document.getElementById("registerForm").addEventListener("submit", async function (e) {
  e.preventDefault();

  const res = await fetch("/register", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify({
      name: document.getElementById("name").value,
      email: document.getElementById("email").value,
      password: document.getElementById("password").value
    })
  });

  const data = await res.json();

  if (res.ok) {
    window.location.href = "/app"; // Redirect to main app if success
  } else {
    document.getElementById("status").innerText = data.error || "Registration failed.";
  }
});
