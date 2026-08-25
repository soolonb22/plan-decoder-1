/**
 * Local email/password — including the reset-email hook.
 * Secrets (Worker): EMAIL_FROM + RESEND_API_KEY (or MAILGUN_API_KEY + MAILGUN_DOMAIN).
 */
import { sendPlanDecoderMail } from "../mail";

export const emailAndPasswordEnabled = true;

export const emailAndPasswordOptions = {
  enabled: true as const,
  resetPasswordTokenExpiresIn: 60 * 60,
  revokeSessionsOnPasswordReset: true,
  async sendResetPassword({ user, url }: { user: { email: string; name?: string | null }; url: string }) {
    const name = user.name?.trim() || "there";
    const text = [
      `Hello ${name},`,
      "",
      "Someone asked to reset the Plan Decoder password for this email.",
      "If it was you, open this link within one hour:",
      url,
      "",
      "If it was not you, you can ignore this email. Your password stays the same.",
      "",
      "Plan Decoder is not the NDIA. Practice notes stay on your device unless you choose encrypted sync.",
    ].join("\n");
    const html = `
      <p>Hello ${escapeHtml(name)},</p>
      <p>Someone asked to reset the Plan Decoder password for this email.</p>
      <p><a href="${escapeHtml(url)}">Reset password</a> — this link lasts one hour.</p>
      <p>If it was not you, ignore this email. Your password stays the same.</p>
      <p style="color:#6b5b76;font-size:13px">Plan Decoder is not the NDIA.</p>
    `;
    await sendPlanDecoderMail({
      to: user.email,
      subject: "Reset your Plan Decoder password",
      text,
      html,
    });
  },
};

function escapeHtml(s: string) {
  return s.replace(/[&<>"']/g, (c) => ({ "&": "&", "<": "<", ">": ">", '"': """, "'": "&#39;" })[c] ?? c);
}
