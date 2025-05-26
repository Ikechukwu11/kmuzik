import { getLibrary, addToLibrary } from "../store/libraryStore";
import { addToQueue, clearQueue, initializeQueue } from "../store/queueStore";
import type { LibraryTrack } from "../types/db";
import { updatePlayerUI } from "../utils/controls";
//import { parseBlob } from "music-metadata-browser";
import { parseBlob } from "music-metadata";
export default function LibraryView(): string {
  const library = getLibrary();

  // Setup events after DOM is inserted
  setTimeout(setupHandlers, 0);

  return `
    <section id="library-view" class="view">
      <button id="add-music-btn">➕</button>
      <input type="file" id="music-input" accept="audio/*" multiple hidden />

      ${
        library.length === 0
          ? `<p>No songs found in library.</p>`
          : `<ul id="music-library" class="music-library">
              ${library.map(renderTrack).join("")}
            </ul>`
      }
    </section>
  `;
}

function renderTrack(track: LibraryTrack): string {
  return `<li data-id="${track.id}">🎵 ${track.title}</li>`;
}

function setupHandlers() {
  const addBtn = document.getElementById("add-music-btn")!;
  const input = document.getElementById("music-input") as HTMLInputElement;
  const list = document.getElementById("music-library");

  const player = document.getElementById("audio-player") as HTMLAudioElement;

  // Open file input
  addBtn.addEventListener("click", () => input.click());

  // Handle file selection
  // input.addEventListener("change", async () => {
  //   const files = Array.from(input.files || []);
  //   for (const file of files) {
  //     const buffer = await file.arrayBuffer();
  //     const trackData: LibraryTrack = {
  //       title: file.name.replace(/\.[^/.]+$/, ""),
  //       artist: "Unknown",
  //       fileName: file.name,
  //       fileData: buffer,
  //       type: file.type,
  //       src: "",
  //       url: "",
  //     };

  //     await addToLibrary(trackData);

  //     // UI update
  //     const blob = new Blob([trackData.fileData], { type: trackData.type });
  //     const url = URL.createObjectURL(blob);

  //     const li = document.createElement("li");
  //     li.textContent = `🎵 ${trackData.title}`;
  //     li.dataset.id = String(trackData.id);
  //     li.addEventListener("click", () => handleTrackClick(trackData.id!, url));
  //     list?.appendChild(li);
  //   }

  //   input.value = "";
  // });

  input.addEventListener("change", async () => {
    const files = Array.from(input.files || []);
    for (const file of files) {
      const buffer = await file.arrayBuffer();

      // Extract metadata using music-metadata-browser
      const metadata = await parseBlob(file);
      const title = metadata.common.title || file.name.replace(/\.[^/.]+$/, "");
      const artist = metadata.common.artist || "Unknown Artist";
      const album = metadata.common.album || "";

      // Extract album art (if available)
      let albumArtData: ArrayBuffer | undefined;
      let albumArtType: string | undefined;
      
      if (metadata.common.picture && metadata.common.picture.length > 0) {
        const picture = metadata.common.picture[0];
        albumArtData = picture.data.buffer; // Store the raw buffer
        albumArtType = picture.format; // e.g. "image/jpeg"
      }

      const blob = new Blob([buffer], { type: file.type });
      const url = URL.createObjectURL(blob);

      const trackData: LibraryTrack = {
        title,
        artist,
        album,
        albumArtData,
        albumArtType,
        fileName: file.name,
        fileData: buffer,
        type: file.type,
        src: "",
        url,
      };

      await addToLibrary(trackData);

      const li = document.createElement("li");
      li.textContent = `🎵 ${trackData.title}`;
      li.dataset.id = String(trackData.id);
      li.addEventListener("click", () => handleTrackClick(trackData.id!, url));
      list?.appendChild(li);
    }

    input.value = "";
  });


  // Setup click events for each library item
  const library = getLibrary();
  library.forEach((track) => {
    const li = document.querySelector(`li[data-id="${track.id}"]`);
    if (!li) return;

    const blob = new Blob([track.fileData], { type: track.type });
    const url = URL.createObjectURL(blob);

    li.addEventListener("click", () => handleTrackClick(track.id!, url));
  });

  // Play the selected track from the queue
  async function handleTrackClick(clickedId: number, clickedUrl: string) {
    const library = getLibrary();

    await clearQueue();
    const queue: any[] = [];

    for (const track of library) {
      const { id, ...safeTrack } = track;
      const newTrack = { ...safeTrack };
      const newId = await addToQueue(newTrack);
      queue.push({ ...newTrack, id: newId });
    }

    initializeQueue(queue);

    const clickedIndex = library.findIndex((t) => t.id === clickedId);
    if (clickedIndex !== -1) {
      player.src = clickedUrl;
      player.play();

      updatePlayerUI(queue[clickedIndex]);
    }
  }
}

