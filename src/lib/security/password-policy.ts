/** Client-side rules only. The server hashes with scrypt; we never store the password. */

const COMMON = new Set([
  "password",
  "password1",
  "password123",
  "12345678",
  "123456789",
  "1234567890",
  "qwerty123",
  "letmein",
  "welcome1",
  "ndis1234",
  "plan decoder",
  "plandecoder",
]);

export function passwordIssue(password: string, extras: { email?: string; name?: string } = {}) {
  if (password.length < 8) return "Use at least 8 characters.";
  if (password.length > 200) return "That password is too long.";
  if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
    return "Include at least one letter and one number.";
  }
  const folded = password.trim().toLowerCase();
  if (COMMON.has(folded)) return "Choose something less common.";
  const email = extras.email?.trim().toLowerCase();
  if (email && (folded === email || folded === email.split("@")[0])) {
    return "Don’t use your email as the password.";
  }
  const name = extras.name?.trim().toLowerCase();
  if (name && name.length >= 3 && folded.includes(name)) {
    return "Don’t use your name in the password.";
  }
  return null;
}
