const endpointUrl = "https://isa-c4p-4vqm.onrender.com/";
// const endpointUrl = "https://localhost:8080";
const AIServiceEndpoint =
	"https://isa-c4p-ai-service.onrender.com/process-text";

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("logoutButton").textContent = messages.logout;
	document.getElementById("summarizeYourText-text").textContent =
		messages.summarizeYourText;
	document.getElementById("yourText-text").textContent = messages.yourText;
	document.getElementById("submitYourText-text").textContent =
		messages.submitYourText;
	document.getElementById("summarizeText-text").textContent =
		messages.summarizeText;
});

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
	try {
		// Verify authentication with the backend
		const response = await fetch(`${endpointUrl}api/v1/verify-token`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include", // Send cookies with the request
		});
		return response.ok; // True if the user is authenticated
	} catch (error) {
		console.error("Authentication error:", error);
		return false;
	}
}

// Handle form submission for text summarization
document
	.getElementById("text-form")
	.addEventListener("submit", async (event) => {
		event.preventDefault();
		const text = document.getElementById("text-input").value;

		try {
			// Send text to the AI summarization endpoint

			//add the AI endpoint URL here
			const response = await fetch(`${AIServiceEndpoint}`, {
				method: "POST",
				headers: { "Content-Type": "application/json" },
				body: JSON.stringify({ input: text }), // Use 'input' as the key
			});

			const data = await response.json();
			if (response.ok) {
				addResponseCard(data.summary || "No response received.");

				// Increment request count if the summarization was successful
				await incrementRequestCount();
				await checkRequestCount(); // Check if warning should be shown
			} else {
				addResponseCard(
					"An error occurred while processing your text."
				);
			}
		} catch (error) {
			console.error("Error:", error);
			addResponseCard("An error occurred. Please try again.");
		}

		// Clear the text field for new input
		document.getElementById("text-input").value = "";
	});

// Function to increment request count on the user API
async function incrementRequestCount() {
	try {
		const response = await fetch(
			`${endpointUrl}api/v1/increment-request-count`,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // Send cookies with the request
			}
		);
		if (!response.ok) {
			console.warn("Failed to increment request count.");
		}
	} catch (error) {
		console.error("Error incrementing request count:", error);
	}
}

// Function to check request count and display a warning if at or above limit
async function checkRequestCount() {
	try {
		const response = await fetch(`${endpointUrl}api/v1/request-count`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include", // Send cookies with the request
		});
		const data = await response.json();

		// Display warning if the request count is at or above 20
		if (response.ok && data.requestCount >= 20) {
			displayWarning("You have reached your free 20-request limit.");
		}
	} catch (error) {
		console.error("Error checking request count:", error);
	}
}

// Function to add a new response card to the responses container
function addResponseCard(summary) {
	const responsesContainer = document.getElementById("responses-container");

	const card = document.createElement("div");
	card.className = "card mb-3";
	card.innerHTML = `
        <div class="card-body">
            <h5 class="card-title">Summarized Text</h5>
            <p class="card-text">${summary}</p>
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
