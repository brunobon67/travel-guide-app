document.addEventListener("DOMContentLoaded", () => {
  const wrapper = document.getElementById("user-menu-wrapper");
  if (!wrapper) return;

  wrapper.innerHTML = `
    <button class="hamburger" id="menuToggle" aria-label="Toggle Menu">&#9776;</button>
    <div class="user-menu" id="menu">
      <a href="/index.html" class="menu-link" id="menu-home">Home</a>
      <a href="/saved-plans.html" class="menu-link" id="menu-saved">My saved plans</a>
      <a href="/profile.html" class="menu-link" id="menu-profile">My profile</a>
      <a href="/contact-us.html" class="menu-link" id="menu-contact">Contact</a>
      <button id="logout-btn" class="logout-btn">Logout</button>
    </div>
  `;

  // Toggle hamburger
  const menuToggle = document.getElementById("menuToggle");
  const menu = document.getElementById("menu");

  if (menuToggle && menu) {
    menuToggle.addEventListener("click", () => {
      menu.classList.toggle("visible");
      if (window.innerWidth <= 768) {
        document.body.classList.toggle("menu-open");
      }
    });
  }

  // Highlight active menu item
  const path = window.location.pathname;
  if (path.includes("index")) document.getElementById("menu-home")?.classList.add("active");
  if (path.includes("saved-plans")) document.getElementById("menu-saved")?.classList.add("active");
  if (path.includes("profile")) document.getElementById("menu-profile")?.classList.add("active");

  // Handle logout
  const logoutBtn = document.getElementById("logout-btn");
  if (logoutBtn) {
    logoutBtn.addEventListener("click", async () => {
      const { auth } = await import("/firebase.js");
      const { signOut } = await import("https://www.gstatic.com/firebasejs/10.8.0/firebase-auth.js");
      await signOut(auth);
      window.location.href = "/login";
    });
  }
});

