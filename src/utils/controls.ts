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

  audioPlayer.addEventListener("timeupdate", () => {
    localStorage.setItem("currentTime", audioPlayer.currentTime.toString());
    updateProgress();
  });

  if (progressBar) {
  progressBar.addEventListener("input", seekAudio);
  }
  volumeSlider.addEventListener("input", updateVolume);
  muteBtn.addEventListener("click", toggleMute);

  // Initial volume
  audioPlayer.volume = volumeSlider.valueAsNumber / 100;

  redrawPlayerUI();
}

export const restorePlayer = () => {
  queue = getQueue();
  const savedIndex = parseInt(
    localStorage.getItem("currentTrackIndex") || "-1"
  );
  const savedTime = parseFloat(localStorage.getItem("currentTime") || "0");
  console.log("Saved index:", savedIndex, "Saved time:", savedTime, queue.length);
  if (!isNaN(savedIndex) && savedIndex >= 0 && savedIndex < queue.length) {
    console.log("Saved index:", savedIndex);
    playTrackAtIndex(savedIndex);
    audioPlayer.currentTime = savedTime;
    playPauseBtn.click();
    //audioPlayer.play(); // Don't auto-play unless you want to
  }
};

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
    playTrackAtIndex(currentTrackIndex + 1);
  } else {
    audioPlayer.pause(); // End of queue
  }
}

function playPrevious() {
  if (currentTrackIndex > 0) {
    playTrackAtIndex(currentTrackIndex - 1);
  } else {
    audioPlayer.currentTime = 0;
  }
}

function togglePlayPause() {
  queue = getQueue();
  if (audioPlayer.src === "" && queue.length === 0) return;

  // If player is not loaded but queue exists, start first track
  if (!audioPlayer.src && queue.length > 0) {
    playTrackAtIndex(0);
    return;
  }
  if (audioPlayer.paused) {
    audioPlayer.play();
  } else {
    audioPlayer.pause();
  }
}

function updateProgress() {
  const current = audioPlayer.currentTime;
  const duration = audioPlayer.duration || 0;
if (progressBar) {
  currentTimeEl.textContent = formatTime(current);
  totalTimeEl.textContent = formatTime(duration);

  const progress = (current / duration) * 100;
  progressBar.value = progress.toString();
}
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


export function playTrackAtIndex(index: number) {
  queue = getQueue(); // Refresh in case of updates
  const track: LibraryTrack = queue[index];
  if (!track) return;

  currentTrackIndex = index;
  const blob = new Blob([track.fileData], { type: track.type });
  const url = URL.createObjectURL(blob);
  track.url = url;
  audioPlayer.src = track.url!;
  audioPlayer.play();
  // Save current playing state
  localStorage.setItem("currentTrackIndex", String(index));
  localStorage.setItem("currentTime", "0");
  updatePlayerUI(track);
}

export function updatePlayerUI(track: LibraryTrack) {
  if(document.querySelector(".track-info h2") &&
  document.querySelector(".track-info p")){   

  document.querySelector(".track-info h2")!.textContent = track.title;
  document.querySelector(".track-info p")!.textContent = track.artist;
  //updateProgress;
}
}

export function redrawPlayerUI() {
  const queue = getQueue();
  const current = queue[currentTrackIndex];
    updatePlayerUI(current);
}
