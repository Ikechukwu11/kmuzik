export default function menuControls() {
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
}
