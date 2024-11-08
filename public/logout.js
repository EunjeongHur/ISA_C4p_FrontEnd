document.getElementById("logoutButton").addEventListener("click", async () => {
  try {
    // Send request to backend to clear the auth cookie
    const response = await fetch(
      "https://isa-c4p-4vqm.onrender.com/api/v1/logout",
      {
        method: "POST",
        credentials: "include", // Send cookies with the request
      }
    );

    if (response.ok) {
      // Redirect to home page after successful logout
      window.location.href = "/";
    } else {
      console.error("Failed to log out:", response.statusText);
    }
  } catch (error) {
    console.error("Error logging out:", error);
  }
});
