const ITER = 120_000;

function b64(bytes: ArrayBuffer | Uint8Array) {
  const u8 = bytes instanceof Uint8Array ? bytes : new Uint8Array(bytes);
  let s = "";
  for (const b of u8) s += String.fromCharCode(b);
  return btoa(s);
}

function fromB64(s: string) {
  const bin = atob(s);
  const u8 = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) u8[i] = bin.charCodeAt(i);
  return u8;
}

async function derive(passphrase: string, salt: Uint8Array) {
  const base = await crypto.subtle.importKey("raw", new TextEncoder().encode(passphrase), "PBKDF2", false, [
    "deriveKey",
  ]);
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt: salt as BufferSource, iterations: ITER, hash: "SHA-256" },
    base,
    { name: "AES-GCM", length: 256 },
    false,
    ["encrypt", "decrypt"],
  );
}

export async function encryptNotes(passphrase: string, payload: unknown) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const iv = crypto.getRandomValues(new Uint8Array(12));
  const key = await derive(passphrase, salt);
  const data = new TextEncoder().encode(JSON.stringify(payload));
  const ciphertext = await crypto.subtle.encrypt({ name: "AES-GCM", iv }, key, data);
  return { salt: b64(salt), iv: b64(iv), ciphertext: b64(ciphertext) };
}

export async function decryptNotes<T>(passphrase: string, pack: { salt: string; iv: string; ciphertext: string }) {
  const salt = fromB64(pack.salt);
  const iv = fromB64(pack.iv);
  const key = await derive(passphrase, salt);
  const raw = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, fromB64(pack.ciphertext));
  return JSON.parse(new TextDecoder().decode(raw)) as T;
}
