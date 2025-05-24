import type { LibraryTrack, QueueTrack, Playlist, Setting } from "../types/db";

const DB_NAME = "kmuzikDB";
const DB_VERSION = 1;

type StoreName = "library" | "queue" | "playlists" | "settings";

type StoreDataMap = {
  library: LibraryTrack;
  queue: QueueTrack;
  playlists: Playlist;
  settings: Setting;
};

function openDatabase(): Promise<IDBDatabase> {
  return new Promise((resolve, reject) => {
    const request = indexedDB.open(DB_NAME, DB_VERSION);

    request.onupgradeneeded = (event) => {
      const db = (event.target as IDBOpenDBRequest).result;

      if (!db.objectStoreNames.contains("library")) {
        db.createObjectStore("library", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("queue")) {
        db.createObjectStore("queue", { keyPath: "id", autoIncrement: true });
      }
      if (!db.objectStoreNames.contains("playlists")) {
        db.createObjectStore("playlists", {
          keyPath: "id",
          autoIncrement: true,
        });
      }
      if (!db.objectStoreNames.contains("settings")) {
        db.createObjectStore("settings", { keyPath: "key" });
      }
    };

    request.onsuccess = () => resolve(request.result);
    request.onerror = () => reject(request.error);
  });
}

export async function addToStore<K extends StoreName>(
  storeName: K,
  data: Omit<StoreDataMap[K], "id">
): Promise<number> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.add(data);

    request.onsuccess = () => resolve(request.result as number);
    request.onerror = () => reject(request.error);
  });
}

export async function getAllFromStore<K extends StoreName>(
  storeName: K
): Promise<StoreDataMap[K][]> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readonly");
    const store = tx.objectStore(storeName);
    const request = store.getAll();

    request.onsuccess = () => resolve(request.result as StoreDataMap[K][]);
    request.onerror = () => reject(request.error);
  });
}

export async function updateStoreItem<K extends StoreName>(
  storeName: K,
  key: number | string,
  data: Omit<StoreDataMap[K], "id">
): Promise<number | string> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const request = store.put({ ...data, id: key });

    request.onsuccess = () => resolve(request.result as number | string);
    request.onerror = () => reject(request.error);
  });
}

export async function deleteFromStore<K extends StoreName>(
  storeName: K,
  key: number | string
): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction(storeName, "readwrite");
    const store = tx.objectStore(storeName);
    const req = store.delete(key);
    req.onsuccess = () => resolve();
    req.onerror = () => reject(req.error);
  });
}
// Save arbitrary object with string key in settings
export async function putSetting(key: string, value: any): Promise<void> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("settings", "readwrite");
    const store = tx.objectStore("settings");
    const request = store.put({ key, value });

    request.onsuccess = () => resolve();
    request.onerror = () => reject(request.error);
  });
}

// Get object from settings by key
export async function getSetting(key: string): Promise<any | null> {
  const db = await openDatabase();
  return new Promise((resolve, reject) => {
    const tx = db.transaction("settings", "readonly");
    const store = tx.objectStore("settings");
    const request = store.get(key);

    request.onsuccess = () => {
      if (request.result) {
        resolve(request.result.value);
      } else {
        resolve(null);
      }
    };
    request.onerror = () => reject(request.error);
  });
}
