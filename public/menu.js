document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  // Ensure menu is hidden by default on load
  if (menu) {
    menu.classList.add("hidden");
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("hidden");
    });
  }

  const logout = document.getElementById("logout");
  if (logout) {
    logout.addEventListener("click", () => {
      alert("Logged out!");
      // Replace with actual logout logic if needed
    });
  }
});
