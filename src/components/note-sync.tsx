import { useEffect, useState } from "react";
import { useOllie } from "@/lib/store";
import { encryptNotes, decryptNotes } from "@/lib/sync-crypto";
import type { NoteSnapshot } from "@/lib/note-snapshot";
import { formatDate } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Field, Input } from "@/components/ui/input";

export function NoteSync() {
  const exportNotes = useOllie((s) => s.exportNotes);
  const importNotes = useOllie((s) => s.importNotes);
  const [pass, setPass] = useState("");
  const [confirm, setConfirm] = useState("");
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);
  const [cloud, setCloud] = useState<{ exists: boolean; updatedAt?: string } | null>(null);

  async function refresh() {
    try {
      const res = await fetch("/api/sync", { credentials: "include" });
      const data = (await res.json()) as { exists?: boolean; updatedAt?: string };
      setCloud({ exists: Boolean(data.exists), updatedAt: data.updatedAt });
    } catch {
      setCloud({ exists: false });
    }
  }

  useEffect(() => {
    void refresh();
  }, []);

  async function save() {
    if (pass.length < 8) {
      setNote("Use 8 or more characters for the sync phrase. This is not your login password.");
      return;
    }
    if (pass !== confirm) {
      setNote("The two phrases do not match.");
      return;
    }
    setBusy(true);
    setNote(null);
    try {
      const pack = await encryptNotes(pass, exportNotes());
      const res = await fetch("/api/sync", {
        method: "PUT",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(pack),
      });
      if (!res.ok) throw new Error("Could not save the encrypted copy.");
      setNote("Encrypted copy saved to your account. Files in the pocket stay on this device only.");
      await refresh();
    } catch (err) {
      setNote(err instanceof Error ? err.message : "Save failed.");
    } finally {
      setBusy(false);
    }
  }

  async function load() {
    if (pass.length < 8) {
      setNote("Enter the same sync phrase you used to save.");
      return;
    }
    setBusy(true);
    setNote(null);
    try {
      const res = await fetch("/api/sync", { credentials: "include" });
      const data = (await res.json()) as {
        exists?: boolean;
        ciphertext?: string;
        iv?: string;
        salt?: string;
      };
      if (!data.exists || !data.ciphertext || !data.iv || !data.salt) {
        throw new Error("No cloud copy yet.");
      }
      const snap = await decryptNotes<NoteSnapshot>(pass, {
        ciphertext: data.ciphertext,
        iv: data.iv,
        salt: data.salt,
      });
      importNotes(snap);
      setNote("Notes loaded from the encrypted copy. This replaced what was on this browser.");
    } catch (err) {
      setNote(
        err instanceof Error && /decrypt|operation/i.test(err.message)
          ? "That phrase did not unlock the copy."
          : err instanceof Error
            ? err.message
            : "Load failed.",
      );
    } finally {
      setBusy(false);
    }
  }

  async function removeCloud() {
    if (!window.confirm("Delete the encrypted copy from your account? Notes on this browser stay.")) return;
    setBusy(true);
    try {
      await fetch("/api/sync", { method: "DELETE", credentials: "include" });
      setNote("Cloud copy removed.");
      await refresh();
    } finally {
      setBusy(false);
    }
  }

  return (
    <Card className="space-y-3">
      <p className="font-semibold">Optional encrypted copy</p>
      <p className="text-sm text-muted">
        Off by default. If you choose this, notes are locked with a phrase you choose, then stored as ciphertext on
        your account. We cannot read them. Pocket files (PDFs, photos) stay on this device. Membership and credits
        are not in this copy.
      </p>
      {cloud?.exists ? (
        <p className="text-sm">A copy is on your account{cloud.updatedAt ? ` · last saved ${formatDate(cloud.updatedAt)}` : ""}.</p>
      ) : (
        <p className="text-sm text-muted">No cloud copy yet.</p>
      )}
      <Field label="Sync phrase (not your login password)">
        <Input type="password" value={pass} onChange={(e) => setPass(e.target.value)} autoComplete="new-password" />
      </Field>
      <Field label="Confirm phrase">
        <Input type="password" value={confirm} onChange={(e) => setConfirm(e.target.value)} autoComplete="new-password" />
      </Field>
      <div className="flex flex-wrap gap-2">
        <Button disabled={busy} onClick={() => void save()}>
          Save encrypted copy
        </Button>
        <Button variant="secondary" disabled={busy} onClick={() => void load()}>
          Load onto this device
        </Button>
        <Button variant="ghost" disabled={busy || !cloud?.exists} onClick={() => void removeCloud()}>
          Delete cloud copy
        </Button>
      </div>
      {note ? <p className="text-sm" role="status">{note}</p> : null}
    </Card>
  );
}
