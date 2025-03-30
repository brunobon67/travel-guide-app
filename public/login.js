document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("login-form");

  if (!form) return;

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const email = document.getElementById("email").value.trim();
    const password = document.getElementById("password").value.trim();

    try {
      const response = await fetch("/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        credentials: "include", // ✅ required for sessions
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        // ✅ Login success – redirect to app
        window.location.href = "/app";
      } else {
        alert(data.error || "Login failed. Check your credentials.");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert("Login error. Try again later.");
    }
  });
});

