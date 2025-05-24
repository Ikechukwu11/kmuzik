import LibraryView from "./views/LibraryView";
import Player from "./views/PlayerView";
import PlaylistView from "./views/PlaylistView";
import SettingsView from "./views/SettingsView";

const routes: Record<string, () => string> = {
  "/": Player,
  "/library": LibraryView,
  "/playlists": PlaylistView,
  "/settings": SettingsView,
};

export function initRouter() {
  const mainView = document.getElementById("main-view")!;
  if (!mainView) return;

  function render() {
    const path = window.location.pathname;
    const view = routes[path] || (() => `<h2>404 - Not Found</h2>`);
    mainView.innerHTML = view();
  }

  // Handle nav clicks
  document.body.addEventListener("click", (e) => {
    const target = (e.target as HTMLElement).closest("[data-target]");
    if (target) {
      const view = target.getAttribute("data-target");
      if (view) {
        history.pushState({}, "", `/${view.replace("-view", "")}`);
        render();
      }
    }
  });

  window.addEventListener("popstate", render);
  render();
}
