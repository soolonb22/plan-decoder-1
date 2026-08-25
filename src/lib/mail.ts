/** Server-only. Sends one email via Resend or Mailgun. Used for password reset. */

function env(key: string) {
  return (typeof process !== "undefined" ? process.env[key]?.trim() : "") || "";
}

export function mailConfigured() {
  return Boolean(env("EMAIL_FROM") && (env("RESEND_API_KEY") || (env("MAILGUN_API_KEY") && env("MAILGUN_DOMAIN"))));
}

export async function sendPlanDecoderMail(opts: { to: string; subject: string; text: string; html: string }) {
  const from = env("EMAIL_FROM");
  if (!from) {
    throw new Error(
      "Reset email is not connected. Add EMAIL_FROM and RESEND_API_KEY (or MAILGUN_API_KEY + MAILGUN_DOMAIN) as Worker secrets.",
    );
  }
  const resend = env("RESEND_API_KEY");
  if (resend) {
    const res = await fetch("https://api.resend.com/emails", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${resend}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        from,
        to: [opts.to],
        subject: opts.subject,
        text: opts.text,
        html: opts.html,
      }),
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Resend did not send (${res.status}): ${body.slice(0, 200)}`);
    }
    return;
  }
  const mailgun = env("MAILGUN_API_KEY");
  const domain = env("MAILGUN_DOMAIN");
  if (mailgun && domain) {
    const form = new URLSearchParams();
    form.set("from", from);
    form.set("to", opts.to);
    form.set("subject", opts.subject);
    form.set("text", opts.text);
    form.set("html", opts.html);
    const res = await fetch(`https://api.mailgun.net/v3/${domain}/messages`, {
      method: "POST",
      headers: { Authorization: `Basic ${btoa(`api:${mailgun}`)}` },
      body: form,
    });
    if (!res.ok) {
      const body = await res.text();
      throw new Error(`Mailgun did not send (${res.status}): ${body.slice(0, 200)}`);
    }
    return;
  }
  throw new Error(
    "Reset email is not connected. Add RESEND_API_KEY and EMAIL_FROM as Worker secrets.",
  );
}
