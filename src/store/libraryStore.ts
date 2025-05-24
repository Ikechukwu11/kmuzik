// src/store/libraryStore.ts

import type { LibraryTrack } from "../types/db";
import { addToStore, updateStoreItem, deleteFromStore } from "./db";

let libraryData: LibraryTrack[] = [];

export function initializeLibrary(data: LibraryTrack[]) {
  libraryData = data;
}

export function getLibrary() {
  return libraryData;
}

export async function addToLibrary(track: Omit<LibraryTrack, "id">) {
  const id = await addToStore("library", track);
  const newTrack: LibraryTrack = { ...track, id };
  libraryData.push(newTrack);
  return id;
}

export async function updateLibraryItem(
  id: number,
  track: Omit<LibraryTrack, "id">
) {
  await updateStoreItem("library", id, track);
  const index = libraryData.findIndex((item) => item.id === id);
  if (index > -1) {
    libraryData[index] = { ...track, id };
  }
}

export async function deleteFromLibrary(id: number) {
  await deleteFromStore("library", id);
  libraryData = libraryData.filter((item) => item.id !== id);
}
