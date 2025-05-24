import { getQueue } from "../store/queueStore";
import type { LibraryTrack } from "../types/db";

let queue = getQueue();
let currentTrackIndex = 0;
let audioPlayer: HTMLAudioElement;
let playPauseBtn: HTMLElement;
let progressBar: HTMLInputElement;
let currentTimeEl: HTMLElement;
let totalTimeEl: HTMLElement;
let volumeSlider: HTMLInputElement;
let muteBtn: HTMLElement;

export function initControls() {
  audioPlayer = document.getElementById("audio-player") as HTMLAudioElement;
  playPauseBtn = document.getElementById("play-pause-btn")!;
  progressBar = document.getElementById("progress-bar")! as HTMLInputElement;
  currentTimeEl = document.querySelector(".current-time")!;
  totalTimeEl = document.querySelector(".total-time")!;
  volumeSlider = document.querySelector(".volume-slider")! as HTMLInputElement;
  muteBtn = document.getElementById("mute-toggle")!;

  const prevBtn = document.getElementById("prev-btn")!;
  const nextBtn = document.getElementById("next-btn")!;

  prevBtn.addEventListener("click", playPrevious);
  nextBtn.addEventListener("click", playNext);
  playPauseBtn.addEventListener("click", togglePlayPause);

  audioPlayer.addEventListener("ended", playNext);
  audioPlayer.addEventListener("pause", () => {
    playPauseBtn.textContent = "▶️";
  });
  audioPlayer.addEventListener("play", () => {
    playPauseBtn.textContent = "⏸";
  });

  audioPlayer.addEventListener("timeupdate", updateProgress);
  if (progressBar) {
  progressBar.addEventListener("input", seekAudio);
  }
  volumeSlider.addEventListener("input", updateVolume);
  muteBtn.addEventListener("click", toggleMute);

  // Initial volume
  audioPlayer.volume = volumeSlider.valueAsNumber / 100;
}

function playSong(index: number) {
  queue = getQueue(); // refresh in case queue changed
  const track: LibraryTrack = queue[index];
  if (!track) return;

  currentTrackIndex = index;
  audioPlayer.src = track.url!;
  audioPlayer.play();

  // Update track info
  document.querySelector(".track-info h2")!.textContent = track.title;
  document.querySelector(".track-info p")!.textContent = track.artist;
}

function playNext() {
  if (currentTrackIndex < queue.length - 1) {
    playSong(currentTrackIndex + 1);
  } else {
    audioPlayer.pause(); // End of queue
  }
}

function playPrevious() {
  if (currentTrackIndex > 0) {
    playSong(currentTrackIndex - 1);
  } else {
    audioPlayer.currentTime = 0;
  }
}

function togglePlayPause() {
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
}

function updateProgress() {
  const current = audioPlayer.currentTime;
  const duration = audioPlayer.duration || 0;

  currentTimeEl.textContent = formatTime(current);
  totalTimeEl.textContent = formatTime(duration);

  const progress = (current / duration) * 100;
  progressBar.value = progress.toString();
}

function seekAudio() {
  if (!isNaN(audioPlayer.duration)) {
    const newTime = (progressBar.valueAsNumber / 100) * audioPlayer.duration;
    audioPlayer.currentTime = newTime;
  }
}

function formatTime(seconds: number): string {
  const mins = Math.floor(seconds / 60);
  const secs = Math.floor(seconds % 60)
    .toString()
    .padStart(2, "0");
  return `${mins}:${secs}`;
}

function updateVolume() {
  audioPlayer.volume = volumeSlider.valueAsNumber / 100;
}

function toggleMute() {
  audioPlayer.muted = !audioPlayer.muted;
  muteBtn.textContent = audioPlayer.muted ? "🔈" : "🔇";
}
