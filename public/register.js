document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("registerForm");
  const status = document.getElementById("status");

  form.addEventListener("submit", async function (e) {
    e.preventDefault();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;

    if (password !== confirmPassword) {
      status.textContent = "Passwords do not match.";
      return;
    }

    const res = await fetch("/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({ name, email, password })
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = "/login"; // ✅ Send to login after registration
    } else {
      status.textContent = data.error || "Registration failed.";
    }
  });
});
