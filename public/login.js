document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("authForm");
  const status = document.getElementById("loginStatus");

  if (!form) {
    console.error("Login form not found!");
    return;
  }

  form.addEventListener("submit", async (e) => {
    e.preventDefault();

    const res = await fetch("/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
      body: JSON.stringify({
        email: document.getElementById("email").value,
        password: document.getElementById("password").value
      })
    });

    const data = await res.json();

    if (res.ok) {
      window.location.href = "/app";
    } else {
      status.innerText = data.error || "Invalid credentials";
    }
  });
});


