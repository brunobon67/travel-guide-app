document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  if (menu) {
    menu.classList.remove("expanded");
  }

  if (hamburger) {
    hamburger.addEventListener("click", () => {
      menu.classList.toggle("expanded");
    });
  }

  document.addEventListener("click", (e) => {
    if (
      menu &&
      menu.classList.contains("expanded") &&
      !hamburger.contains(e.target) &&
      !menu.contains(e.target)
    ) {
      menu.classList.remove("expanded");
    }
  });

  const logout = document.getElementById("logout");
  if (logout) {
    logout.addEventListener("click", () => {
      alert("Logged out!");
      // Add logout logic here
    });
  }
});
