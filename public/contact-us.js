// /contact-us.js
import emailjs from "https://cdn.jsdelivr.net/npm/@emailjs/browser@3/dist/email.min.js";

// Initialize EmailJS
emailjs.init("k-pLBkzSztIp6MenN");

const form = document.getElementById("contact-form");
const messageEl = document.getElementById("form-message");

form.addEventListener("submit", function (event) {
  event.preventDefault();
  messageEl.textContent = "Sending...";
  messageEl.style.color = "#555";

  emailjs.sendForm("service_muyt2eo", "template_mzbzxzi", this)
    .then(() => {
      messageEl.textContent = "✅ Message sent successfully!";
      messageEl.style.color = "#2a9d8f";
      form.reset();
    })
    .catch((error) => {
      messageEl.textContent = "❌ Failed to send message. Please try again.";
      messageEl.style.color = "#e74c3c";
      console.error("EmailJS error:", error);
    });
});
