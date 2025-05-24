import { getLibrary, addToLibrary } from "../store/libraryStore";
import { addToQueue } from "../store/queueStore";
import type { LibraryTrack, QueueTrack } from "../types/db";

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
  input.addEventListener("change", async () => {
    const files = Array.from(input.files || []);
    for (const file of files) {
      const buffer = await file.arrayBuffer();
      const trackData: LibraryTrack = {
        title: file.name.replace(/\.[^/.]+$/, ""),
        artist: "Unknown",
        fileName: file.name,
        fileData: buffer,
        type: file.type,
        src: "",
        url: "",
      };
      await addToLibrary(trackData);

      // Add to queue
      const queueTrack: QueueTrack = {
        title: trackData.title,
        album: "",
        artist: "Unknown",
        fileName: trackData.fileName,
        type: trackData?.type,
        url: trackData?.url,
        src: trackData.src,
      };
      await addToQueue(queueTrack);

      // Update UI
      const blob = new Blob([trackData.fileData], { type: trackData.type });
      const url = URL.createObjectURL(blob);
      const li = document.createElement("li");
      li.textContent = `🎵 ${trackData.title}`;
      li.dataset.id = String(trackData.id);
      li.addEventListener("click", () => {
        player.src = url;
        player.play();
      });
      list?.appendChild(li);
    }

    input.value = "";
  });

  // Attach play handlers to existing tracks
  const library = getLibrary();
  library.forEach((track) => {
    const li = document.querySelector(`li[data-id="${track.id}"]`);
    if (!li) return;

    const blob = new Blob([track.fileData], { type: track.type });
    const url = URL.createObjectURL(blob);

    li.addEventListener("click", () => {
      player.src = url;
      player.play();
    });
  });
}
