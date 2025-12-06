// Lightweight IndexedDB helpers to store pending audio across page reloads

const DB_NAME = 'voiceclone-pending-db';
const STORE_NAME = 'media';
const DB_VERSION = 1;

interface PendingAudioRecord {
  id: 'audio';
  blob: Blob;
  fileName: string;
  mimeType: string;
  source: 'recorded' | 'uploaded';
}

function openDB(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);
    request.onupgradeneeded = () => {
      const db = request.result;
      if (!db.objectStoreNames.contains(STORE_NAME)) {
        db.createObjectStore(STORE_NAME, { keyPath: 'id' });
      }
    };
    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function savePendingAudio(rec: Omit<PendingAudioRecord, 'id'>) {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    store.put({ id: 'audio', ...rec });
    tx.oncomplete = () => resolve();
    tx.onerror = () => reject(tx.error);
  });
}

export async function loadPendingAudio(): Promise<PendingAudioRecord | null> {
  const db = await openDB();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readonly');
    const store = tx.objectStore(STORE_NAME);
    const req = store.get('audio');
    req.onsuccess = () => resolve((req.result as PendingAudioRecord) || null);
    req.onerror = () => reject(req.error);
  });
}

export async function clearPendingAudio() {
  const db = await openDB();
  return new Promise<void>((resolve, reject) => {
    const tx = db.transaction(STORE_NAME, 'readwrite');
    const store = tx.objectStore(STORE_NAME);
    const req = store.delete('audio');
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
