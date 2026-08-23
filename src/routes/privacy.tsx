import { createFileRoute } from "@tanstack/react-router";
import { useOllie } from "@/lib/store";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Disclaimer, PageHeader } from "@/components/layout/page";

export const Route = createFileRoute("/privacy")({ component: PrivacyPage });

function PrivacyPage() {
  const reset = useOllie((s) => s.resetAll);
  return (
    <div>
      <PageHeader
        title="Privacy and safety"
        lede="NDIS information is sensitive. Plan Decoder is built device-local on purpose."
      />
      <Disclaimer>
        Plan Decoder is a working tool, not the NDIA, not a health service, and not a substitute for advocacy or clinical care. If you are in immediate danger, call 000.
      </Disclaimer>
      <div className="mt-5 space-y-3">
        <Card>
          <p className="font-semibold">What stays on this device</p>
          <p className="mt-2 text-sm text-muted">
            Evidence, logs, flags, goals, briefs, school notes, WHODAS-inspired snapshots, practice assessments, and drafts are stored in this browser. Clearing site data deletes them. The Delete button on a practice assessment removes that rehearsal immediately. We do not put those notes in the cloud database.
          </p>
        </Card>
        <Card>
          <p className="font-semibold">What sign-in is for</p>
          <p className="mt-2 text-sm text-muted">
            Your account identity, role, and membership. You need an account to open Plan Decoder. Practice answers still stay on this device.
          </p>
        </Card>
        <Card>
          <p className="font-semibold">Passwords</p>
          <p className="mt-2 text-sm text-muted">
            Email passwords are hashed on the server with scrypt (a unique random salt each time). The plain password is never written to the database, this device’s notes, or server logs. Google and X sign-in never share a Plan Decoder password.
          </p>
        </Card>
        <Card>
          <p className="font-semibold">What “Draft with Plan Decoder” sends</p>
          <p className="mt-2 text-sm text-muted">
            Only when you press the button. It sends the notes already on screen so a language model can polish them. Do not include extra identifiers you would not put in an email. Drafts can be wrong. You edit before you share.
          </p>
        </Card>
        <Card>
          <p className="font-semibold">Professionals</p>
          <p className="mt-2 text-sm text-muted">
            You still need consent, your own record-keeping, and your organisation’s policies. Plan Decoder is not an official client management system.
          </p>
        </Card>
        <Card>
          <p className="font-semibold">Clear this device</p>
          <p className="mt-2 text-sm text-muted">Removes local Plan Decoder notes on this browser. It does not close your account.</p>
          <Button
            className="mt-3"
            variant="danger"
            onClick={() => {
              if (confirm("Remove all Plan Decoder notes on this device?")) reset();
            }}
          >
            Clear local notes
          </Button>
        </Card>
      </div>
    </div>
  );
}
