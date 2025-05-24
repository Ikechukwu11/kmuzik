export default function Layout(): string {
    return `
    <header class="app-header">
      <div class="left-header">
        <button id="menu-toggle">☰</button>
        <h1>K Muzik</h1>
      </div>
      <div class="center-header">
        <input type="text" class="search-input" placeholder="Search" />
      </div>
      <div class="right-header">
        <button>⚙</button>
      </div>
    </header>
  
    <main class="app-body">
      <aside class="sidebar">
        <nav class="sidebar-nav">
          <ul>
            <li data-target="-view">
              Now Playing
            </li>
            <li data-target="library-view">
              Library
            </li>
            <li data-target="playlists-view">Playlists</li>
            <li data-target="settings-view">Settings</li>
          </ul>
        </nav>
      </aside>
  
      <section id="main-view" class="view-container"></section>
    </main>
  
    <footer class="mini-player">
      <audio id="audio-player" autoplay controls hidden></audio>
      <div class="mini-info">🎵 Now Playing</div>
      <div class="mini-controls">
        <button id="prev-btn">⏮</button>
        <button id="play-pause-btn">▶️</button>
        <button id="next-btn">⏭</button>
      </div>
      <div class="mini-actions">
        <input type="range" min="0" max="100" value="50" class="volume-slider" />
        <button id="mute-toggle">🔇</button>
        <button>❤️</button>
        <button>⋮</button>
        <button id="queue-toggle">⬆</button>
      </div>
    </footer>
  
    <nav class="mobile-nav sidebar-nav">
      <li data-target="library-view">
        Library
        <button id="add-music-btn1">➕</button>
        <input type="file" id="music-input" accept="audio/*" multiple hidden />
      </li>
      <li data-target="playlist-view">Playlists</li>
      <li data-target="settings-view">Settings</li>
    </nav>
    `;
  }
  