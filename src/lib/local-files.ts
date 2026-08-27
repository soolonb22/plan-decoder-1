import { uid } from "./utils";

const DB_NAME = "plan-decoder-files";
const STORE = "blobs";
export const MAX_LOCAL_FILE = 8 * 1024 * 1024;

export type LocalFileMeta = {
  id: string;
  name: string;
  type: string;
  size: number;
};

function openDb(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const req = indexedDB.open(DB_NAME, 1);
    req.onupgradeneeded = () => {
      if (!req.result.objectStoreNames.contains(STORE)) req.result.createObjectStore(STORE);
    };
    req.onsuccess = () => resolve(req.result);
    req.onerror = () => reject(req.error ?? new Error("Could not open local files"));
  });
}

function txDone(tx: IDBTransaction): Promise<void> {
  return new Promise((resolve, reject) => {
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error ?? new Error("Local file save failed"));
    tx.onabort = () => reject(tx.error ?? new Error("Local file save cancelled"));
  });
}

export async function putLocalFile(file: File | Blob, name: string, type: string): Promise<LocalFileMeta> {
  if (file.size > MAX_LOCAL_FILE) {
    throw new Error("That file is larger than 8 MB. Save a smaller copy, or keep the original on paper.");
  }
  const id = uid("file");
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  tx.objectStore(STORE).put(file, id);
  await txDone(tx);
  return { id, name, type: type || "application/octet-stream", size: file.size };
}

export async function getLocalFile(id: string): Promise<Blob | null> {
  const db = await openDb();
  return new Promise((resolve, reject) => {
    const req = db.transaction(STORE, "readonly").objectStore(STORE).get(id);
    req.onsuccess = () => resolve((req.result as Blob | undefined) ?? null);
    req.onerror = () => reject(req.error);
  });
}

export async function deleteLocalFiles(ids: string[]): Promise<void> {
  if (!ids.length) return;
  const db = await openDb();
  const tx = db.transaction(STORE, "readwrite");
  const store = tx.objectStore(STORE);
  for (const id of ids) store.delete(id);
  await txDone(tx);
}

export function downloadBlob(blob: Blob, name: string) {
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = name;
  a.click();
  URL.revokeObjectURL(url);
}

export function blobToDataUrl(blob: Blob): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(String(reader.result));
    reader.onerror = () => reject(reader.error);
    reader.readAsDataURL(blob);
  });
}

export async function dataUrlToBlob(dataUrl: string): Promise<Blob> {
  const res = await fetch(dataUrl);
  return res.blob();
}

export function fileKindAllowed(_file: File): boolean {
  return true;
}
