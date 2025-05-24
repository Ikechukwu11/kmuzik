// src/store/queueStore.ts

import type { QueueTrack } from "../types/db";
import { updateStoreItem, addToStore, deleteFromStore } from "./db";

let queueData: QueueTrack[] = [];

// Initialize queue store with data loaded from IndexedDB
export function initializeQueue(data: QueueTrack[]) {
  queueData = data;
}

// Get current queue
export function getQueue() {
  return queueData;
}

// Add track to queue (updates in-memory and DB)
export async function addToQueue(track: Omit<QueueTrack, "id">) {
  const id = await addToStore("queue", track);
  queueData.push({ ...track, id });
  return id;
}

// Update track in queue by id
export async function updateQueueItem(
  id: number,
  track: Omit<QueueTrack, "id">
) {
  await updateStoreItem("queue", id, track);
  const index = queueData.findIndex((item) => item.id === id);
  if (index > -1) {
    queueData[index] = { ...track, id };
  }
}

// Delete track from queue by id
export async function deleteFromQueue(id: number) {
  await deleteFromStore("queue", id);
  queueData = queueData.filter((item) => item.id !== id);
}
