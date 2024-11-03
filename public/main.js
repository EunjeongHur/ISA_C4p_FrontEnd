const endpointUrl = "https://isa-c4p.onrender.com/";

document.addEventListener("DOMContentLoaded", async () => {
  // Check if user is authenticated on page load
  const isAuthenticated = await checkAuthentication();
  if (!isAuthenticated) {
    alert("Please sign in to access this page.");
    window.location.href = "/"; // Redirect to the index page for login
    return;
  }

  // Check the user's current request count on page load
  await checkRequestCount();
});

// Function to check if the user is authenticated
async function checkAuthentication() {
  const token = localStorage.getItem("token");
  if (!token) {
    console.log("no token found");
    return false; // No token found, so user is not authenticated
  }

  try {
    // Verify the token with a backend endpoint
    const response = await fetch(`${userEndpoint}api/v1/verify-token`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    return response.ok; // True if the token is valid
  } catch (error) {
    console.error("Authentication error:", error);
    localStorage.removeItem("token");
    return false;
  }
}

document
  .getElementById("question-form")
  .addEventListener("submit", async (event) => {
    event.preventDefault();
    const question = document.getElementById("question").value;

    try {
      // temp llm sim
      // const llmData = { answer: "What would Kant say?" };
      // addResponseCard(question, llmData.answer);
      // await incrementRequestCount();
      // await checkRequestCount();

      // Step 1: Send question to the LLM endpoint
      const llmResponse = await fetch(
        "http://localhost:3000/api/v1/summarizeText",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ input: question }),
        }
      );

      const llmData = await llmResponse.json();

      if (await llmResponse.ok) {
        await addResponseCard(
          question,
          llmData.summary || "No response received."
        );

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
      `${userEndpoint}api/v1/increment-request-count`,
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

async function checkRequestCount() {
  try {
    const token = localStorage.getItem("token");
    const userResponse = await fetch(`${userEndpoint}api/v1/request-count`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });
    const userData = await userResponse.json();

    // Display warning if the request count is at or above 20
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

  // Set the warning message text
  warningDiv.textContent = message;

  // Ensure the warning is visible by removing the 'd-none' class
  warningDiv.classList.remove("d-none");
}
