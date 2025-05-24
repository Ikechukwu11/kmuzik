import { addToStore, getAllFromStore, updateStoreItem, deleteFromStore } from './db.js';

const PLAYLIST_STORE = 'playlists';

export function createPlaylist(name) {
    const id = Date.now().toString();
    return addToStore(PLAYLIST_STORE, { id, name, songs: [] });
}
export function getPlaylists() {
    return getAllFromStore(PLAYLIST_STORE);
}
export function updatePlaylist(id, updatedData) {
    return updateInStore(PLAYLIST_STORE, { id, ...updatedData });
}
export function deletePlaylist(id) {
    return deleteFromStore(PLAYLIST_STORE, id);
}

export async function addSongToPlaylist(playlistId, song) {
    const playlist = await getPlaylist(playlistId);
    if (!playlist.songs) playlist.songs = [];

    playlist.songs.push(song); // ideally use song ID or URL
    await updateInStore("playlists", playlistId, playlist);
}

export async function removeSongFromPlaylist(playlistId, songUrl) {
    const playlist = await getPlaylist(playlistId);
    playlist.songs = playlist.songs.filter(s => s.url !== songUrl);
    await updateInStore("playlists", playlistId, playlist);
}

export async function getPlaylist(id) {
    const all = await getAllFromStore("playlists");
    return all.find(p => p.id === id);
}


document.getElementById("create-playlist-btn").addEventListener("click", async () => {
    const nameInput = document.getElementById("new-playlist-name");
    const name = nameInput.value.trim();
    if (name) {
        await createPlaylist(name);
        nameInput.value = "";
        loadPlaylistsUI(); // refresh the list
    }
});

// async function loadPlaylistsUI() {
//     const playlists = await getPlaylists();
//     const ul = document.getElementById("playlist-list");
//     ul.innerHTML = "";
//     playlists.forEach(p => {
//         const li = document.createElement("li");
//         li.textContent = p.name;
//         // Add edit/delete buttons if needed
//         ul.appendChild(li);
//     });
//   }
async function loadPlaylistsUI() {
    const playlists = await getPlaylists();
    const ul = document.getElementById("playlist-list");
    ul.innerHTML = "";

    playlists.forEach(p => {
        const li = document.createElement("li");
        li.classList.add("playlist-item");
        li.setAttribute("data-id", p.id);

        const nameSpan = document.createElement("span");
        nameSpan.textContent = p.name;
        li.appendChild(nameSpan);

        const actionsDiv = document.createElement("div");
        actionsDiv.className = "playlist-actions hidden"; // toggle this on hover

        const playBtn = document.createElement("button");
        playBtn.textContent = "▶️";
        playBtn.className = "action-playlist-btn";
        playBtn.dataset.id = p.id;
        playBtn.dataset.action = "play";

        const editBtn = document.createElement("button");
        editBtn.textContent = "✏️";
        editBtn.className = "action-playlist-btn";
        editBtn.dataset.id = p.id;
        editBtn.dataset.action = "edit";

        const deleteBtn = document.createElement("button");
        deleteBtn.textContent = "🗑️";
        deleteBtn.className = "action-playlist-btn";
        deleteBtn.dataset.id = p.id;
        deleteBtn.dataset.action = "delete";

        actionsDiv.appendChild(playBtn);
        actionsDiv.appendChild(editBtn);
        actionsDiv.appendChild(deleteBtn);
        li.appendChild(actionsDiv);

        // Show/hide actions on hover
        li.addEventListener("mouseenter", () => actionsDiv.classList.remove("hidden"));
        li.addEventListener("mouseleave", () => actionsDiv.classList.add("hidden"));

        ul.appendChild(li);
    });
}  

async function playPlaylist(playlistId) {
    const playlist = await getPlaylist(playlistId);
    if (playlist?.songs?.length) {
        queue = [...playlist.songs]; // replace queue
        currentTrackIndex = 0;
        playSongFromQueue(currentTrackIndex);
    }
}

document.getElementById("playlist-list").addEventListener("click", e => {
    if (e.target.classList.contains("action-playlist-btn")) {
        const id = e.target.dataset.id;
        const action = e.target.dataset.action;

        if (action === "play") {
            playPlaylist(id);
        } else if (action === "edit") {
            openEditModal(id);
        } else if (action === "delete") {
            deletePlaylist(id);
        }
    }
});  

document.addEventListener("DOMContentLoaded", loadPlaylistsUI);