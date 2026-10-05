import { useEffect, useState, type InputHTMLAttributes, type ReactNode, type TextareaHTMLAttributes } from "react";
import { Link } from "@tanstack/react-router";
import { FileText, ShieldCheck, Trash2 } from "lucide-react";
import { Disclaimer, PageHeader } from "@/components/layout/page";
import {
  CHECKS,
  clearDraft,
  EMPTY_DRAFT,
  KIND_LABEL,
  loadDraft,
  PAY_LABEL,
  PLAN_LABEL,
  ROLE_LABEL,
  saveDraft,
  UNIT_LABEL,
  type HireDraft,
  type PayHow,
  type PlanStyle,
  type PriceUnit,
  type Role,
  type WorkerKind,
  type YesNo,
} from "@/lib/hire/model";

const STEPS = ["Who", "The support", "Money", "Before you sign", "Download"] as const;

function Field({
  label,
  hint,
  children,
}: {
  label: string;
  hint?: string;
  children: ReactNode;
}) {
  return (
    <label className="block">
      <span className="font-bold text-ink">{label}</span>
      {hint ? <span className="mt-1 block text-sm text-muted">{hint}</span> : null}
      <span className="mt-2 block">{children}</span>
    </label>
  );
}

const inputClass =
  "min-h-11 w-full rounded-xl border border-line bg-card px-3 py-2 text-ink placeholder:text-muted/70";

function TextInput(props: InputHTMLAttributes<HTMLInputElement>) {
  return <input {...props} className={inputClass} />;
}

function Area(props: TextareaHTMLAttributes<HTMLTextAreaElement>) {
  return <textarea {...props} className={`${inputClass} min-h-28`} />;
}

function Choice<T extends string>({
  name,
  value,
  current,
  label,
  onPick,
}: {
  name: string;
  value: T;
  current: string;
  label: string;
  onPick: (value: T) => void;
}) {
  const checked = current === value;
  return (
    <label
      className={`flex min-h-11 cursor-pointer items-center gap-3 rounded-xl border px-3 py-2 ${
        checked ? "border-primary bg-primary-soft" : "border-line bg-card"
      }`}
    >
      <input
        type="radio"
        name={name}
        checked={checked}
        onChange={() => onPick(value)}
        className="size-4 accent-primary"
      />
      <span>{label}</span>
    </label>
  );
}

export function HireApp() {
  const [draft, setDraft] = useState<HireDraft>(EMPTY_DRAFT);
  const [ready, setReady] = useState(false);
  const [step, setStep] = useState(0);
  const [busy, setBusy] = useState(false);
  const [note, setNote] = useState<string | null>(null);

  useEffect(() => {
    setDraft(loadDraft());
    setReady(true);
  }, []);

  useEffect(() => {
    if (!ready) return;
    saveDraft(draft);
  }, [draft, ready]);

  function patch<K extends keyof HireDraft>(key: K, value: HireDraft[K]) {
    setDraft((prev) => ({ ...prev, [key]: value }));
  }

  function toggleCheck(id: string) {
    setDraft((prev) => ({
      ...prev,
      checks: { ...prev.checks, [id]: !prev.checks[id] },
    }));
  }

  async function download() {
    setBusy(true);
    setNote(null);
    try {
      const { downloadAgreement } = await import("@/lib/hire/pdf");
      await downloadAgreement(draft);
      setNote("Agreement PDF downloaded to this device. Read it before you share it.");
    } catch {
      setNote("The PDF could not be built in this browser. Your notes are still saved here.");
    } finally {
      setBusy(false);
    }
  }

  function wipe() {
    if (!confirm("Erase this draft from this browser? A PDF you already downloaded is not deleted.")) return;
    clearDraft();
    setDraft(EMPTY_DRAFT);
    setStep(0);
    setNote("Erased from this device.");
  }

  return (
    <div>
      <PageHeader
        title="Service agreement"
        lede="Your facts only. Download one draft agreement. The hiring guide is a separate page."
      />
      <Disclaimer>
        This is a preparation draft, not legal advice and not an NDIA form. It does not decide funding, safety, or
        whether a provider is allowed to charge a fee. Check ndis.gov.au before you sign. It is not an NDIS support
        and cannot be paid from a plan.
      </Disclaimer>

      <p className="mt-4 flex items-start gap-2 text-sm text-muted">
        <ShieldCheck className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
        Saved in this browser only. Leave the NDIS number blank if you would rather write it on paper.
      </p>

        <ol className="mt-6 grid grid-cols-5 gap-2" aria-label="Steps">
          {STEPS.map((label, index) => {
            const active = index === step;
            return (
              <li key={label}>
                <button
                  type="button"
                  onClick={() => setStep(index)}
                  className={`flex min-h-11 w-full flex-col items-center justify-center rounded-xl px-1 py-2 text-center text-xs font-bold sm:text-sm ${
                    active ? "bg-primary text-primary-fg" : "border border-line bg-card text-primary-deep"
                  }`}
                  aria-current={active ? "step" : undefined}
                >
                  <span className="font-display text-base leading-none">{index + 1}</span>
                  <span className="mt-1">{label}</span>
                </button>
              </li>
            );
          })}
        </ol>

        <section className="mt-6 rounded-card border border-line bg-card p-4 sm:p-6">
          {!ready ? <p className="text-muted">Opening your draft on this device…</p> : null}

          {ready && step === 0 ? (
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold text-primary-deep">Who is this for?</h2>
              <fieldset className="space-y-2">
                <legend className="font-bold">I am filling this in as</legend>
                <div className="mt-2 grid gap-2">
                  {(Object.keys(ROLE_LABEL) as Role[]).map((key) => (
                    <Choice
                      key={key}
                      name="role"
                      value={key}
                      current={draft.role}
                      label={ROLE_LABEL[key as Exclude<Role, "">]}
                      onPick={(value) => patch("role", value)}
                    />
                  ))}
                </div>
              </fieldset>
              <Field label="Participant's name" hint="First name is enough if that feels safer.">
                <TextInput
                  value={draft.personName}
                  autoComplete="name"
                  onChange={(e) => patch("personName", e.target.value)}
                />
              </Field>
              <Field label="Nominee or support person" hint="Optional. Someone who will read or sign with you.">
                <TextInput value={draft.nomineeName} onChange={(e) => patch("nomineeName", e.target.value)} />
              </Field>
              <Field
                label="NDIS number"
                hint="Optional. If you type it, it stays in this browser with the draft. You can write it on the paper copy instead."
              >
                <TextInput
                  value={draft.ndisNumber}
                  inputMode="numeric"
                  autoComplete="off"
                  onChange={(e) => patch("ndisNumber", e.target.value)}
                />
              </Field>
              <Field label="Provider or worker's name">
                <TextInput value={draft.providerName} onChange={(e) => patch("providerName", e.target.value)} />
              </Field>
              <Field label="Their ABN" hint="Optional. Ask for it before you sign.">
                <TextInput value={draft.providerAbn} onChange={(e) => patch("providerAbn", e.target.value)} />
              </Field>
              <fieldset className="space-y-2">
                <legend className="font-bold">What kind of professional</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-2">
                  {(Object.keys(KIND_LABEL) as WorkerKind[]).map((key) => (
                    <Choice
                      key={key}
                      name="kind"
                      value={key}
                      current={draft.workerKind}
                      label={KIND_LABEL[key as Exclude<WorkerKind, "">]}
                      onPick={(value) => patch("workerKind", value)}
                    />
                  ))}
                </div>
              </fieldset>
              {draft.workerKind === "other" ? (
                <Field label="Describe the role">
                  <TextInput
                    value={draft.workerKindOther}
                    onChange={(e) => patch("workerKindOther", e.target.value)}
                  />
                </Field>
              ) : null}
            </div>
          ) : null}

          {ready && step === 1 ? (
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold text-primary-deep">The support</h2>
              <p className="text-muted">A few honest lines are enough. Empty boxes stay as blanks in the draft.</p>
              <Field label="What they will actually do" hint="Tasks, and anything they will not do.">
                <Area value={draft.tasks} onChange={(e) => patch("tasks", e.target.value)} />
              </Field>
              <Field label="Where">
                <TextInput
                  value={draft.where}
                  placeholder="Home, community, clinic"
                  onChange={(e) => patch("where", e.target.value)}
                />
              </Field>
              <Field label="How often" hint="Days, times, and how long a shift is.">
                <TextInput value={draft.howOften} onChange={(e) => patch("howOften", e.target.value)} />
              </Field>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Start">
                  <TextInput type="date" value={draft.startDate} onChange={(e) => patch("startDate", e.target.value)} />
                </Field>
                <Field label="End or review">
                  <TextInput type="date" value={draft.endDate} onChange={(e) => patch("endDate", e.target.value)} />
                </Field>
              </div>
              <Field label="What you want this to help with" hint="Optional. Your words, not a formal goal.">
                <Area value={draft.goals} onChange={(e) => patch("goals", e.target.value)} />
              </Field>
            </div>
          ) : null}

          {ready && step === 2 ? (
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold text-primary-deep">Money and notice</h2>
              <fieldset className="space-y-2">
                <legend className="font-bold">How this part of the plan is managed</legend>
                <div className="mt-2 grid gap-2">
                  {(Object.keys(PLAN_LABEL) as PlanStyle[]).map((key) => (
                    <Choice
                      key={key}
                      name="plan"
                      value={key}
                      current={draft.planStyle}
                      label={PLAN_LABEL[key as Exclude<PlanStyle, "">]}
                      onPick={(value) => patch("planStyle", value)}
                    />
                  ))}
                </div>
              </fieldset>
              <fieldset className="space-y-2">
                <legend className="font-bold">Are they NDIS registered?</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {(
                    [
                      ["yes", "Yes"],
                      ["no", "No"],
                      ["not-sure", "Not sure"],
                    ] as const
                  ).map(([value, label]) => (
                    <Choice
                      key={value}
                      name="registered"
                      value={value}
                      current={draft.registered}
                      label={label}
                      onPick={(picked) => patch("registered", picked as YesNo)}
                    />
                  ))}
                </div>
              </fieldset>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Price they quoted" hint="Numbers only. The draft adds the dollar sign.">
                  <TextInput
                    inputMode="decimal"
                    value={draft.quotedPrice}
                    placeholder="70.00"
                    onChange={(e) => patch("quotedPrice", e.target.value)}
                  />
                </Field>
                <fieldset>
                  <legend className="font-bold">Per</legend>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    {(Object.keys(UNIT_LABEL) as PriceUnit[]).map((key) => (
                      <Choice
                        key={key}
                        name="unit"
                        value={key}
                        current={draft.priceUnit}
                        label={UNIT_LABEL[key as Exclude<PriceUnit, "">]}
                        onPick={(value) => patch("priceUnit", value)}
                      />
                    ))}
                  </div>
                </fieldset>
              </div>
              <Field label="Travel or other charges" hint="Write “none” if they said there are none.">
                <TextInput value={draft.travel} onChange={(e) => patch("travel", e.target.value)} />
              </Field>
              <fieldset>
                <legend className="font-bold">Did they mention GST?</legend>
                <div className="mt-2 grid gap-2 sm:grid-cols-3">
                  {(
                    [
                      ["yes", "Yes"],
                      ["no", "No"],
                      ["not-sure", "Not sure"],
                    ] as const
                  ).map(([value, label]) => (
                    <Choice
                      key={value}
                      name="gst"
                      value={value}
                      current={draft.gst}
                      label={label}
                      onPick={(picked) => patch("gst", picked as YesNo)}
                    />
                  ))}
                </div>
              </fieldset>
              <fieldset>
                <legend className="font-bold">Who pays the invoice</legend>
                <div className="mt-2 grid gap-2">
                  {(Object.keys(PAY_LABEL) as PayHow[]).map((key) => (
                    <Choice
                      key={key}
                      name="pay"
                      value={key}
                      current={draft.payHow}
                      label={PAY_LABEL[key as Exclude<PayHow, "">]}
                      onPick={(value) => patch("payHow", value)}
                    />
                  ))}
                </div>
              </fieldset>
              <Field label="Notice if you cancel" hint="Write what they told you. Check it against the current price rules before you sign.">
                <Area value={draft.cancelNotice} onChange={(e) => patch("cancelNotice", e.target.value)} />
              </Field>
              <Field label="What if they cancel">
                <Area value={draft.providerCancel} onChange={(e) => patch("providerCancel", e.target.value)} />
              </Field>
            </div>
          ) : null}

          {ready && step === 3 ? (
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold text-primary-deep">Before you sign</h2>
              <p className="text-muted">
                Tick what you have already asked. A tick is your reminder. It is not a clearance, and it does not make
                a provider safe.
              </p>
              <ul className="space-y-2">
                {CHECKS.map((item) => (
                  <li key={item.id}>
                    <label className="flex min-h-11 items-start gap-3 rounded-xl border border-line bg-paper-2 px-3 py-3">
                      <input
                        type="checkbox"
                        className="mt-1 size-4 accent-primary"
                        checked={Boolean(draft.checks[item.id])}
                        onChange={() => toggleCheck(item.id)}
                      />
                      <span>{item.label}</span>
                    </label>
                  </li>
                ))}
              </ul>
              <Field label="How you can end it" hint="For example, 14 days’ notice.">
                <TextInput value={draft.endNotice} onChange={(e) => patch("endNotice", e.target.value)} />
              </Field>
              <Field label="What you agree to share" hint="You do not have to share the whole plan.">
                <Area value={draft.shareWhat} onChange={(e) => patch("shareWhat", e.target.value)} />
              </Field>
              <Field label="Who you contact if something is wrong">
                <TextInput
                  value={draft.complaintsContact}
                  onChange={(e) => patch("complaintsContact", e.target.value)}
                />
              </Field>
            </div>
          ) : null}

          {ready && step === 4 ? (
            <div className="space-y-5">
              <h2 className="text-2xl font-semibold text-primary-deep">Download the agreement</h2>
              <p className="text-muted">
                Built in this browser. Read it before you send it to anyone. Brackets mean you still need to add that
                fact.
              </p>
              <article className="rounded-xl border border-line bg-paper-2 p-4">
                <div className="flex items-start gap-3">
                  <FileText className="mt-1 size-5 text-primary" aria-hidden="true" />
                  <div>
                    <h3 className="font-bold">Draft service agreement</h3>
                    <p className="mt-1 text-sm text-muted">
                      Your names, the support, the price, cancellation, privacy, complaints, and a place to sign.
                    </p>
                  </div>
                </div>
                <button
                  type="button"
                  className="mt-4 min-h-11 w-full rounded-xl bg-primary px-4 font-bold text-primary-fg disabled:opacity-60 sm:w-auto"
                  disabled={busy}
                  onClick={() => void download()}
                >
                  {busy ? "Building…" : "Download agreement PDF"}
                </button>
              </article>
              {note ? (
                <p className="rounded-xl bg-primary-soft px-4 py-3 text-sm" role="status">
                  {note}
                </p>
              ) : null}
              <p className="text-sm text-muted">
                The hiring guide is separate.{" "}
                <Link to="/before-you-hire" className="font-semibold text-primary underline-offset-2 hover:underline">
                  Read before you hire
                </Link>
              </p>
              <button
                type="button"
                className="inline-flex min-h-11 items-center gap-2 text-sm font-bold text-alert underline"
                onClick={wipe}
              >
                <Trash2 className="size-4" aria-hidden="true" />
                Erase this draft
              </button>
            </div>
          ) : null}

          {ready && step < 4 ? (
            <div className="mt-8 flex flex-col-reverse gap-3 sm:flex-row sm:justify-between">
              <button
                type="button"
                className="min-h-11 rounded-xl px-4 font-semibold text-primary disabled:opacity-40"
                disabled={step === 0}
                onClick={() => setStep((n) => Math.max(0, n - 1))}
              >
                Back
              </button>
              <button
                type="button"
                className="min-h-11 rounded-xl bg-primary px-5 font-bold text-primary-fg"
                onClick={() => setStep((n) => Math.min(4, n + 1))}
              >
                {step === 3 ? "Review and download" : "Continue"}
              </button>
            </div>
          ) : null}
        </section>
    </div>
  );
}
