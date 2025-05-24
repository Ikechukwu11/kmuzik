window.addEventListener("DOMContentLoaded", () => {
    const lastPlayed = JSON.parse(localStorage.getItem("currentTrack"));

    if (lastPlayed) {
        const audio = document.getElementById("audio-player");
        audio.src = lastPlayed.url;

        audio.addEventListener("loadedmetadata", () => {
            audio.currentTime = lastPlayed.timestamp || 0;
            audio.play();
        });

        document.querySelector(".track-info h2").textContent = lastPlayed.title;
    }
});
const state = JSON.parse(localStorage.getItem("queueState"));
if (state) {
    queue = state.queue;
    currentTrackIndex = state.currentTrackIndex;
    audioPlayer.src = queue[currentTrackIndex].url;

    audioPlayer.addEventListener("loadedmetadata", () => {
        audioPlayer.currentTime = state.timestamp || 0;
        audioPlayer.play();
    });
}
