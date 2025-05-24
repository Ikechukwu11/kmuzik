// src/store/playlistStore.ts

import type { Playlist } from "../types/db";
import { addToStore, updateStoreItem, deleteFromStore } from "./db";

let playlistData: Playlist[] = [];

export function initializePlaylists(data: Playlist[]) {
  playlistData = data;
}

export function getPlaylists() {
  return playlistData;
}

export async function addPlaylist(playlist: Omit<Playlist, "id">) {
  const id = await addToStore("playlists", playlist);
  playlistData.push({ ...playlist, id });
  return id;
}

export async function updatePlaylist(
  id: number,
  playlist: Omit<Playlist, "id">
) {
  await updateStoreItem("playlists", id, playlist);
  const index = playlistData.findIndex((p) => p.id === id);
  if (index > -1) {
    playlistData[index] = { ...playlist, id };
  }
}

export async function deletePlaylist(id: number) {
  await deleteFromStore("playlists", id);
  playlistData = playlistData.filter((p) => p.id !== id);
}
