import { getQueue } from "../store/queueStore";

export default function Player(): string {
  const queue = getQueue();
  const current = queue[0];
  console.log(queue);

  return `
    <section class="main-player ${current ? "" : ""}" id="main-player">
      <div class="album-art">🎵</div>
      <div class="track-info">
        <h2>${current?.title || "No Track Playing"}</h2>
        <p>${current?.artist || "Unknown Artist"}</p>
      </div>

      <div class="progress-bar">
        <span class="current-time">0:00</span>
        <input type="range" min="0" max="100" value="0" id="progress-bar" />
        <span class="total-time">0:00</span>
      </div>

      <div class="lyrics-area">Lyrics will appear here...</div>
    </section>

    <aside class="play-queue ${queue.length ? "" : ""}" id="play-queue">
      <ul class="queue-list">
        ${queue
          .map(
            (track) =>
              `<li data-id="${track.id}">${track.title} - ${track.artist}</li>`
          )
          .join("")}
      </ul>
    </aside>
  `;
}
