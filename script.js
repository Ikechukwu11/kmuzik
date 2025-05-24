document.addEventListener("DOMContentLoaded", function () {
  const toggleMenuBtn = document.getElementById("menu-toggle");
  const sidebar = document.querySelector(".sidebar");
  const toggleQueueBtn = document.getElementById("queue-toggle");
  const playQueue = document.querySelector(".play-queue");

  if (toggleMenuBtn && sidebar) {
    toggleMenuBtn.addEventListener("click", () => {
      sidebar.classList.toggle("hidden");
    });
  }

  if (toggleQueueBtn && playQueue) {
    toggleQueueBtn.addEventListener("click", () => {
      playQueue.classList.toggle("hidden");
    });
  }

  const queueItems = document.querySelectorAll(".queue-list li");
  queueItems.forEach((item) => {
    item.addEventListener("click", () => {
      queueItems.forEach((el) => el.classList.remove("active"));
      item.classList.add("active");
    });
  });


  const navItems = document.querySelectorAll(".sidebar-nav li");
  const views = document.querySelectorAll(".view");

  function showViewById(id) {
    views.forEach(view => {
      view.classList.toggle("hidden", view.id !== id);
    });

    navItems.forEach(item => {
      item.classList.toggle("active", item.getAttribute("data-target") === id);
    });
  }

  // Handle nav item clicks
  navItems.forEach(item => {
    item.addEventListener("click", () => {
      const targetId = item.getAttribute("data-target");

      // Update URL hash (without page reload)
      if (window.location.hash !== `#${targetId}`) {
        window.location.hash = targetId;
      } else {
        // If hash is same, still call showView to update UI (edge case)
        showViewById(targetId);
      }
    });
  });

  // Handle hash change (back/forward buttons, manual URL changes)
  window.addEventListener("hashchange", () => {
    const hash = window.location.hash.substring(1); // remove #
    if (hash) {
      showViewById(hash);
    }
  });

  // On page load: read current hash or default to "library-view"
  window.addEventListener("DOMContentLoaded", () => {
    const hash = window.location.hash.substring(1);
    if (hash) {
      showViewById(hash);
    } else {
      showViewById("library-view"); // default view
    }
  });


//   const addMusicBtn = document.getElementById("add-music-btn");
// const musicInput = document.getElementById("music-input");

// addMusicBtn.addEventListener("click", () => musicInput.click());

// musicInput.addEventListener("change", async (e) => {
//   const files = Array.from(e.target.files);
//   for (const file of files) {
//     const url = URL.createObjectURL(file);
//     // Save metadata (title from filename for now)
//     const song = {
//       title: file.name.replace(/\.[^/.]+$/, ""),
//       artist: "Unknown",
//       url,
//       file
//     };
//     // TODO: Store in IndexedDB
//     console.log("Loaded song:", song.title);
//     // TODO: Update UI
//   }
// });

});
