document.addEventListener("DOMContentLoaded", () => {
  const hamburger = document.getElementById("hamburger");
  const menu = document.getElementById("menu");

  hamburger.addEventListener("click", () => {
    menu.classList.toggle("hidden");
  });

  const logout = document.getElementById("logout");
  logout.addEventListener("click", () => {
    alert("Logged out!");
    // Implement actual logout logic if needed
  });
});
