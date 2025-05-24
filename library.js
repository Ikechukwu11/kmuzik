import { addToStore, getAllFromStore } from "./db.js";
const addMusicBtn = document.getElementById("add-music-btn");
const addMusicBtn1 = document.getElementById("add-music-btn1");
const musicInput = document.getElementById("music-input");
const musicLibrary = document.getElementById("music-library");
const audioPlayer = document.getElementById("audio-player");

async function loadLibrary() {
    const library = await getAllFromStore("library");
    library.forEach((song, index) => {
        const blob = new Blob([song.fileData], { type: song.type });
        const url = URL.createObjectURL(blob);
        song.url = url;

        queue.push(song);

        const li = document.createElement("li");
        li.textContent = song.title;
        li.addEventListener("click", () => playSong(queue.indexOf(song)));
        musicLibrary.appendChild(li);
    });
}

document.addEventListener("DOMContentLoaded", loadLibrary);

let queue = [];
let currentTrackIndex = 0;

addMusicBtn.addEventListener("click", () => musicInput.click());

addMusicBtn1.addEventListener("click", () => musicInput.click());

// musicInput.addEventListener("change", (e) => {
//   const files = Array.from(e.target.files);

//   files.forEach((file, index) => {
//     const url = URL.createObjectURL(file);
//     const song = {
//       title: file.name.replace(/\.[^/.]+$/, ""),
//       artist: "Unknown",
//       file,
//       url
//     };

//     queue.push(song);

//     const li = document.createElement("li");
//     li.textContent = song.title;
//     li.addEventListener("click", () => playSong(queue.indexOf(song)));
//     musicLibrary.appendChild(li);
//   });
// });
musicInput.addEventListener("change", async (e) => {
    const files = Array.from(e.target.files);

    for (const file of files) {
        const url = URL.createObjectURL(file);
        const song = {
            title: file.name.replace(/\.[^/.]+$/, ""),
            artist: "Unknown",
            fileName: file.name,
            url, // optional: for immediate playback
            fileData: await file.arrayBuffer(), // store raw file data
            type: file.type,
        };

        // Save to IndexedDB
        try {
            await addToStore("library", song);
            console.log("Added to library:", song.title);
        } catch (err) {
            console.error("DB Error:", err);
        }

        // Add to queue
        queue.push(song);

        // Show in UI
        const li = document.createElement("li");
        li.textContent = song.title;
        li.addEventListener("click", () => playSong(queue.indexOf(song)));
        musicLibrary.appendChild(li);
    }

    musicInput.value = ""; // Clear file input
});

function playSong(index) {
    const song = queue[index];
    if (!song) return;

    currentTrackIndex = index;
    audioPlayer.src = song.url;
    audioPlayer.play();


    // Optional: update player UI
    document.querySelector(".track-info h2").textContent = song.title;
    document.querySelector(".track-info p").textContent = song.artist;
}
