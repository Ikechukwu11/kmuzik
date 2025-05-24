const prevBtn = document.getElementById("prev-btn");
const playPauseBtn = document.getElementById("play-pause-btn");
const nextBtn = document.getElementById("next-btn");
const audioPlayer = document.getElementById("audio-player");


prevBtn.addEventListener("click", playPrevious);
playPauseBtn.addEventListener("click", togglePlayPause);
nextBtn.addEventListener("click", playNext);
audioPlayer.addEventListener("ended", playNext);
function playNext() {
    if (currentTrackIndex < queue.length - 1) {
      playSong(currentTrackIndex + 1);
    } else {
      audioPlayer.pause(); // stop if at the end
    }
  }
  
  function playPrevious() {
    if (currentTrackIndex > 0) {
      playSong(currentTrackIndex - 1);
    } else {
      audioPlayer.currentTime = 0; // restart if at the beginning
    }
  }
  
  function togglePlayPause() {
    if (audioPlayer.paused) {
      audioPlayer.play();
      playPauseBtn.textContent = "⏸"; // update icon
    } else {
      audioPlayer.pause();
      playPauseBtn.textContent = "▶️";
    }
  }
  
  // Optional: update icon when song ends
  audioPlayer.addEventListener("pause", () => {
    playPauseBtn.textContent = "▶️";
  });
  audioPlayer.addEventListener("play", () => {
    playPauseBtn.textContent = "⏸";
  });
  

  const progressBar = document.getElementById("progress-bar");
const currentTimeEl = document.querySelector(".current-time");
const totalTimeEl = document.querySelector(".total-time");
// Format time helper (e.g. 62 -> "1:02")
function formatTime(seconds) {
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60).toString().padStart(2, "0");
    return `${mins}:${secs}`;
  }
  
  // While audio plays
  audioPlayer.addEventListener("timeupdate", () => {
    const current = audioPlayer.currentTime;
    const duration = audioPlayer.duration || 0;
  
    // Update times
    currentTimeEl.textContent = formatTime(current);
    totalTimeEl.textContent = formatTime(duration);
  
    // Update progress bar
    const progress = (current / duration) * 100;
    progressBar.value = progress || 0;
  });
  progressBar.addEventListener("input", () => {
    if (!isNaN(audioPlayer.duration)) {
      const newTime = (progressBar.value / 100) * audioPlayer.duration;
      audioPlayer.currentTime = newTime;
    }
  });
  

  //Volume
  const volumeSlider = document.querySelector(".volume-slider");
  audioPlayer.volume = volumeSlider.value / 100;
  volumeSlider.addEventListener("input", () => {
    const volume = volumeSlider.value / 100;
    audioPlayer.volume = volume;
  });
  
  const muteBtn = document.getElementById("mute-toggle");

muteBtn.addEventListener("click", () => {
  audioPlayer.muted = !audioPlayer.muted;
  muteBtn.textContent = audioPlayer.muted ? "🔈" : "🔇";
});
