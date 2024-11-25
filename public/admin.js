const endpointUrl = "https://isa-c4p-4vqm.onrender.com/";
// const endpointUrl = "https://localhost:8080";

document.addEventListener("DOMContentLoaded", () => {
	document.getElementById("logoutButton").textContent = messages.logout;
	document.getElementById("requestCounts-text").textContent =
		messages.requestCount;
	document.getElementById("userId-text").textContent = messages.userId;
	document.getElementById("totalRequests-text").textContent =
		messages.totalRequests;
	document.getElementById("actions-text").textContent = messages.actions;
	document.getElementById("email-text").textContent = messages.email;
});

document.addEventListener("DOMContentLoaded", async () => {
	const isAdmin = await checkAdminAccess();
	if (!isAdmin) {
		alert("Access denied. Admins only.");
		window.location.href = "/main"; // Redirect non-admins to the home page or login
		return;
	}

	// Load the user table for admins
	await loadUserTable();
});

// Function to check if the user is an admin
async function checkAdminAccess() {
	try {
		const response = await fetch(`${endpointUrl}api/v1/check-role`, {
			method: "GET",
			headers: {
				"Content-Type": "application/json",
			},
			credentials: "include", // Send cookies with the request
		});
		const data = await response.json();

		// Check if the response is successful and role is 'admin'
		if (response.ok && data.role === "admin") {
			return true;
		} else {
			console.warn("Unauthorized access attempt detected.");
			return false;
		}
	} catch (error) {
		console.error("Authorization error:", error);
		return false;
	}
}

// Function to fetch users and populate the table
async function loadUserTable() {
	try {
		const response = await fetch(
			"https://isa-c4p-4vqm.onrender.com/api/v1/users",
			{
				method: "GET",
				headers: {
					"Content-Type": "application/json",
				},
				credentials: "include", // Include cookies if using cookie-based auth
			}
		);

		const data = await response.json();

		// Access the users array within the data object
		if (response.ok && Array.isArray(data.users)) {
			populateTable(data.users); // Pass the users array to populateTable
		} else {
			console.error(
				"Failed to fetch users or users data is not an array:",
				data
			);
		}
	} catch (error) {
		console.error("Error fetching users:", error);
	}
}

function populateTable(users) {
	const userTableBody = document
		.getElementById("userTable")
		.querySelector("tbody");
	userTableBody.innerHTML = ""; // Clear existing rows

	users.forEach((user) => {
		// Main user row
		const userRow = document.createElement("tr");

		const userIdCell = document.createElement("td");
		userIdCell.textContent = user.userId;

		const emailCell = document.createElement("td");
		emailCell.textContent = user.email;

		const totalRequestsCell = document.createElement("td");
		totalRequestsCell.textContent = user.totalAiRequests;

		const actionCell = document.createElement("td");
		const deleteButton = document.createElement("button");
		deleteButton.textContent = "Delete";
		deleteButton.className = "btn btn-danger";
		deleteButton.addEventListener("click", () => deleteUser(user.userId));
		actionCell.appendChild(deleteButton);

		userRow.appendChild(userIdCell);
		userRow.appendChild(emailCell);
		userRow.appendChild(totalRequestsCell);
		userRow.appendChild(actionCell);

		userTableBody.appendChild(userRow);

		// Add sub-header row for Route, Method, and Count
		const subHeaderRow = document.createElement("tr");

		const routeHeaderCell = document.createElement("th");
		routeHeaderCell.textContent = "Route";

		const methodHeaderCell = document.createElement("th");
		methodHeaderCell.textContent = "Method";

		const countHeaderCell = document.createElement("th");
		countHeaderCell.textContent = "Count";

		subHeaderRow.appendChild(routeHeaderCell);
		subHeaderRow.appendChild(methodHeaderCell);
		subHeaderRow.appendChild(countHeaderCell);

		userTableBody.appendChild(subHeaderRow);

		// Sub-rows for each API request
		user.apiRequests.forEach((request) => {
			const detailRow = document.createElement("tr");

			const routeCell = document.createElement("td");
			routeCell.textContent = request.route;

			const methodCell = document.createElement("td");
			methodCell.textContent = request.method;

			const countCell = document.createElement("td");
			countCell.textContent = request.count;

			detailRow.appendChild(routeCell);
			detailRow.appendChild(methodCell);
			detailRow.appendChild(countCell);

			userTableBody.appendChild(detailRow);
		});
	});
}

async function deleteUser(userId) {
	const confirmed = confirm("Are you sure you want to delete this user?");
	if (!confirmed) {
		return;
	}

	try {
		const response = await fetch(
			`https://isa-c4p-4vqm.onrender.com/api/v1/users/delete`,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
				},
				body: JSON.stringify({ userId }),
				credentials: "include", // Include cookies if using cookie-based auth
			}
		);
		if (response.ok) {
			alert("User deleted successfully.");
			await loadUserTable();
		} else {
			alert("Failed to delete user.");
		}
	} catch (error) {
		console.error("Error deleting user:", error);
		alert("Failed to delete user.");
	}
}
