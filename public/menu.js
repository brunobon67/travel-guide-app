document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  if (menu) {
    menu.classList.remove("visible");
  }

  if (hamburger) {
    hamburger.addEventListener("click", (e) => {
      e.stopPropagation();
      menu.classList.toggle("visible");
    });
  }

  document.addEventListener("click", (e) => {
    if (menu && menu.classList.contains("visible") && !hamburger.contains(e.target) && !menu.contains(e.target)) {
      menu.classList.remove("visible");
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
