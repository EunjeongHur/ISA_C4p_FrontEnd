// Toggle the password reset form visibility

//const endpointUrl = "http://localhost:3000/";
const endpointUrl =
  "https://isa-c4-lyr2omuz4-joshhipkins-projects.vercel.app/api/v1/login";
document
  .getElementById("forgot-password-link")
  .addEventListener("click", (event) => {
    event.preventDefault();
    document.getElementById("login-section").classList.add("d-none");
    document
      .getElementById("reset-password-section")
      .classList.remove("d-none");
  });

// Back to login button in the reset password section
document.getElementById("back-to-login").addEventListener("click", (event) => {
  event.preventDefault();
  document.getElementById("reset-password-section").classList.add("d-none");
  document.getElementById("login-section").classList.remove("d-none");
});

// Handle Password Reset Form submission
document
  .getElementById("reset-password-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const email = document.getElementById("reset-email").value;

    try {
      const response = await fetch(
        "https://isa-c4-lyr2omuz4-joshhipkins-projects.vercel.app/api/v1/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email }),
        }
      );

      console.log("Response status:", response.status);

      const data = await response.json();

      if (response.ok) {
        document.getElementById("resetMessage").textContent =
          "If this email is registered, you will receive password reset instructions.";
      } else {
        document.getElementById("resetMessage").textContent =
          data.message || "Unable to process password reset.";
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("resetMessage").textContent =
        "An error occurred. Please try again.";
    }
  });

// Checks for a valid JWT token and redirects to main page if found.
document.addEventListener("DOMContentLoaded", () => {
  const token = localStorage.getItem("token");

  if (token) {
    const tokenExpirationValid = isTokenValid(token);

    if (tokenExpirationValid) {
      window.location.href = "/main";
      return;
    } else {
      localStorage.removeItem("token");
    }
  }
});

// Helper function for validating JWT token.
function isTokenValid(token) {
  try {
    const payload = JSON.parse(atob(token.split(".")[1]));
    const expiration = payload.exp * 1000;
    return Date.now() < expiration;
  } catch (error) {
    console.error("Invalid token format");
    return false;
  }
}

// Handle login form submission
document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const response = await fetch(
        "https://isa-c4-lyr2omuz4-joshhipkins-projects.vercel.app/api/v1/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok && data.token) {
        localStorage.setItem("token", data.token);
        window.location.href = "/main";
      } else {
        document.getElementById("responseMessage").textContent =
          data.message || "Login Failed";
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("responseMessage").textContent =
        "An error occurred. Please try again or reset your password";
    }
  });

// Handle signup form submission
document
  .getElementById("signup-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("signup-email").value;
    const password = document.getElementById("signup-password").value;

    try {
      const response = await fetch(
        "https://isa-c4-lyr2omuz4-joshhipkins-projects.vercel.app/api/v1/login",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ email, password }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        document.getElementById("responseMessage").textContent =
          "Signup successful! You can now log in.";
        document.getElementById("signup-form").reset();
      } else {
        document.getElementById("responseMessage").textContent =
          data.message || "Signup failed. Please try again.";
      }
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("responseMessage").textContent =
        "An error occurred. Please try again.";
    }
  });
