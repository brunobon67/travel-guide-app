let isLogin = true;

document.getElementById("toggleForm").addEventListener("click", (e) => {
  e.preventDefault();
  isLogin = !isLogin;

  document.getElementById("formTitle").innerText = isLogin ? "🔐 Login" : "🆕 Register";
  document.getElementById("submitButton").innerText = isLogin ? "Log In" : "Register";
  document.getElementById("toggleForm").innerText = isLogin ? "Need to register?" : "Already have an account?";
  document.getElementById("nameField").style.display = isLogin ? "none" : "block";
  document.getElementById("loginStatus").innerText = "";
});

document.getElementById("authForm").addEventListener("submit", async (e) => {
  e.preventDefault();
  const endpoint = isLogin ? "/login" : "/register";
  const payload = {
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };
  if (!isLogin) payload.name = document.getElementById("name").value;

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(payload)
  });

  const data = await res.json();
  if (res.ok) {
    window.location.href = "/app";
  } else {
    document.getElementById("loginStatus").innerText = data.error || "Something went wrong.";
  }
});
