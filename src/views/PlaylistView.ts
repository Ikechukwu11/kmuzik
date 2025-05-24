export default function PlaylistView(): string {
return `
    <section id="playlist-view" class="view">
        <h2>Playlists</h2>
        <input type="text" id="new-playlist-name" placeholder="New playlist name" />
        <button id="create-playlist-btn">Create</button>
        <ul id="playlist-list" class="playlist-list"></ul>
    </section>
    `;
}
