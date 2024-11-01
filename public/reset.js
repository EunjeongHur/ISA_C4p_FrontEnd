document
  .getElementById("resetForm")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const urlParams = new URLSearchParams(window.location.search);
    const token = urlParams.get("token");
    const newPassword = document.getElementById("newPassword").value;

    try {
      const response = await fetch(
        "https://localhost:3000/api/v1/update-password",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ token, newPassword }),
        }
      );
      const data = await response.json();
      document.getElementById("responseMessage").textContent = data.message;
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("responseMessage").textContent =
        "Password reset failed.";
    }
  });
