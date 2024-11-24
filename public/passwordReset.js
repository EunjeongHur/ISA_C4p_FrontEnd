const endpointUrl = "https://isa-c4p-4vqm.onrender.com"; // Update this to your backend URL

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("resetYourPassword-text").textContent = messages.resetYourPassword;
  document.getElementById("resetPassword-text").textContent = messages.resetPassword;
});

document
  .getElementById("resetForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token"); // Get the token from URL
    const newPassword = document.getElementById("newPassword").value;

    try {
      const response = await fetch(`${endpointUrl}/api/v1/update-password`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      if (response.ok) {
        window.location.href = "/";
      } else {
        document.getElementById("responseMessage").textContent =
          data.message || "Password reset failed.";
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("responseMessage").textContent =
        "Password reset failed.";
    }
  });
