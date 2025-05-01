document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  // Hide menu initially
  if (menu) {
    menu.classList.add("hidden");
  }

  if (hamburger) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation(); // Prevent click propagation
      menu.classList.toggle("hidden");
    });
  }

  // Optional: Close menu when clicking outside
  document.addEventListener("click", (e) => {
    if (menu && !menu.classList.contains("hidden") && !hamburger.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.add("hidden");
    }
  });

  const logout = document.getElementById("logout");
  if (logout) {
    logout.addEventListener("click", () => {
      alert("Logged out!");
      // Add your logout logic here
    });
  }
});
