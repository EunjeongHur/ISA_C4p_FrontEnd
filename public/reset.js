const endpointUrl = "https://isa-c4p-4vqm.onrender.com"; // Update this to your backend URL

document
  .getElementById("resetForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token"); // Get the token from URL
    console.log(token);
    const newPassword = document.getElementById("newPassword").value;
    console.log(newPassword);

    try {
      const response = await fetch(`${endpointUrl}/api/v1/update-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, newPassword }),
      });
      const data = await response.json();
      document.getElementById("responseMessage").textContent = data.message;
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("responseMessage").textContent =
        "Password reset failed.";
    }
  });
