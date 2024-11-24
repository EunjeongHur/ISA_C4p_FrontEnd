const endpointUrl = "https://isa-c4p-4vqm.onrender.com";

document.addEventListener("DOMContentLoaded", () => {
  document.getElementById("welcome-text").textContent = messages.welcome;
  document.getElementById("signup-text").textContent = messages.signup;
  document.getElementById("signup-text2").textContent = messages.signup;
  document.getElementById("email-text").textContent = messages.email;
  document.getElementById("password-text").textContent = messages.password;
  document.getElementById("login-text").textContent = messages.login;
  document.getElementById("email-text2").textContent = messages.email;
  document.getElementById("password-text2").textContent = messages.password;
  document.getElementById("login-text2").textContent = messages.login;
  document.getElementById("forgot-password-link").textContent = messages.forgotPassword;
  document.getElementById("resetPassword-text").textContent = messages.resetPassword;
  document.getElementById("email-text3").textContent = messages.email;
  document.getElementById("resetPassword-text2").textContent = messages.resetPassword;
  document.getElementById("back-to-login").textContent = messages.backToLogin;
});

// Toggle the password reset form visibility
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
      const response = await fetch(`${endpointUrl}/api/v1/password-reset`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();
      document.getElementById("resetMessage").textContent = response.ok
        // ? "If this email is registered, you will receive password reset instructions."
        ? messages.resetPasswordInstructions
        // : data.message || "Unable to process password reset.";
        : data.message || messages.unableToProcessPasswordReset;
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("resetMessage").textContent =
        "An error occurred. Please try again.";
    }
  });

// Handle login form submission
document
  .getElementById("login-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();

    const email = document.getElementById("login-email").value;
    const password = document.getElementById("login-password").value;

    try {
      const response = await fetch(`${endpointUrl}/api/v1/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
        credentials: "include", // Include credentials for cookies
      });

      const data = await response.json();
      document.getElementById("responseMessage").textContent = response.ok
        ? (window.location.href = "/main")
        // : data.message || "Login Failed";
        : data.message || messages.loginFailed;
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("responseMessage").textContent =
        // "An error occurred. Please try again or reset your password.";
        messages.errorOccurred;
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
      const response = await fetch(`${endpointUrl}/api/v1/signup`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      const data = await response.json();
      document.getElementById("responseMessage").textContent = response.ok
        // ? "Signup successful! You can now log in."
        ? messages.signupSuccessful
        // : data.message || "Signup failed. Please try again.";
        : data.message || messages.signupFailed;
      if (response.ok) document.getElementById("signup-form").reset();
    } catch (error) {
      console.error("Error:", error);
      document.getElementById("responseMessage").textContent =
        // "An error occurred. Please try again.";
        messages.errorOccurred2;
    }
  });
