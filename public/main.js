document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is authenticated on page load
  const isAuthenticated = await checkAuthentication();
  if (!isAuthenticated) {
    alert("Please sign in to access this page.");
    window.location.href = "/login"; // Redirect to the login page
    return;
  }

  // Check the user's current request count on page load
  await checkRequestCount();
});

// Function to check if the user is authenticated
async function checkAuthentication() {
  const token = localStorage.getItem("token");
  if (!token) return false; // No token found, so user is not authenticated

  try {
    // Verify the token with a backend endpoint
    const response = await fetch(
      "https://your-user-api.com/api/v1/verify-token",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    return response.ok; // True if the token is valid
  } catch (error) {
    console.error("Authentication error:", error);
    return false;
  }
}

document
  .getElementById("question-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = document.getElementById("question").value;

    try {
      // Step 1: Send question to the LLM endpoint
      const llmResponse = await fetch(
        "https://your-llm-endpoint.com/api/v1/legal-question",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ question }),
        }
      );

      const llmData = await llmResponse.json();

      if (llmResponse.ok) {
        addResponseCard(question, llmData.answer || "No response received.");

        // Step 2: If LLM request is successful, increment request count
        await incrementRequestCount();
        await checkRequestCount(); // Check if warning should be shown
      } else {
        addResponseCard(
          question,
          "An error occurred while processing your question."
        );
      }
    } catch (error) {
      console.error("Error:", error);
      addResponseCard(question, "An error occurred. Please try again.");
    }

    // Clear the question field for a new question
    document.getElementById("question").value = "";
  });

// Function to increment request count on the user API
async function incrementRequestCount() {
  try {
    const token = localStorage.getItem("token");
    const userResponse = await fetch(
      "https://your-user-api.com/api/v1/increment-request-count",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    if (!userResponse.ok) {
      console.warn("Failed to increment request count.");
    }
  } catch (error) {
    console.error("Error incrementing request count:", error);
  }
}

// Function to check request count and display a warning if at or above limit
async function checkRequestCount() {
  try {
    const token = localStorage.getItem("token");
    const userResponse = await fetch(
      "https://your-user-api.com/api/v1/request-count",
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      }
    );
    const userData = await userResponse.json();

    if (userResponse.ok && userData.requestCount >= 20) {
      displayWarning("You have reached your free 20-question limit.");
    }
  } catch (error) {
    console.error("Error checking request count:", error);
  }
}

// Function to add a new response card to the responses container
function addResponseCard(question, answer) {
  const responsesContainer = document.getElementById("responses-container");

  const card = document.createElement("div");
  card.className = "card mb-3";
  card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">Question</h5>
            <p class="card-text">${question}</p>
            <h5 class="card-title">Response</h5>
            <p class="card-text">${answer}</p>
        </div>
    `;

  responsesContainer.prepend(card);
}

// Function to display a warning message at the top of the page
function displayWarning(message) {
  let warningDiv = document.getElementById("warningMessage");

  if (!warningDiv) {
    warningDiv = document.createElement("div");
    warningDiv.id = "warningMessage";
    warningDiv.className = "alert alert-warning text-center mt-3";
    document.querySelector(".container").prepend(warningDiv);
  }

  warningDiv.textContent = message;
}
