emailjs.init("k-pLBkzSztIp6MenN");

const form = document.getElementById("contact-form");
const messageEl = document.getElementById("form-message");
const submitBtn = form.querySelector('button[type="submit"]');

form.addEventListener("submit", function (event) {
  event.preventDefault();

  const formData = {
    from_name: form.from_name.value,
    from_email: form.from_email.value,
    message: form.message.value
  };

  console.log("Sending data:", formData); // Check in browser console

  submitBtn.disabled = true;
  submitBtn.textContent = "Sending...";
  messageEl.innerHTML = `<span class="spinner"></span> Sending...`;
  messageEl.style.color = "#555";

  emailjs.send("service_muyt2eo", "template_mzbzxzi", formData)
    .then(() => {
      messageEl.textContent = "✅ Message sent successfully!";
      messageEl.style.color = "#2a9d8f";
      form.reset();
    })
    .catch((error) => {
      messageEl.textContent = "❌ Failed to send message. Please try again.";
      messageEl.style.color = "#e74c3c";
      console.error("EmailJS error:", error);
    })
    .finally(() => {
      submitBtn.disabled = false;
      submitBtn.textContent = "Send Message";
    });
});
