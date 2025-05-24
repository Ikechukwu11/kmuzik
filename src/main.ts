import { initRouter } from "./router";
import renderLayout from "./layout/Layout";

import { getAllFromStore } from "./store/db";
import { initializeLibrary } from "./store/libraryStore";
import { initializePlaylists } from "./store/playlistStore";
import { initializeSettings } from "./store/settingsStore";
import { initializeQueue } from "./store/queueStore";
import { initControls } from "./utils/controls";
import menuControls from "./utils/menu";

async function loadInitialData() {
  const [library, playlists, settings, queue] = await Promise.all([
    getAllFromStore("library"),
    getAllFromStore("playlists"),
    getAllFromStore("settings"),
    getAllFromStore("queue"),
  ]);

  initializeLibrary(library);
  initializePlaylists(playlists);
  initializeSettings(settings);
  initializeQueue(queue);
}


document.addEventListener("DOMContentLoaded", async () => {
  const app = document.getElementById("app");
  if (!app) return;

  // Render base layout (header/sidebar/footer)
  app.innerHTML = renderLayout();

  // Load data from IndexedDB into stores
  await loadInitialData();
  // Activate router AFTER data is loaded
  initRouter();
  menuControls();
  initControls(); // ✅ Controls initialized
});
