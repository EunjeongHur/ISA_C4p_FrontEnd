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
    const userTable = document.getElementById("userTable");
    const userTableBody = userTable.querySelector("tbody");
    userTableBody.innerHTML = ""; // Clear existing rows

    users.forEach((user) => {
        const requestCount = user.apiRequests.length || 1;

        // For the first row, we'll populate all cells
        const userRow = document.createElement("tr");

        const userIdCell = document.createElement("td");
        userIdCell.textContent = user.userId;
        userIdCell.rowSpan = requestCount;

        const emailCell = document.createElement("td");
        emailCell.textContent = user.email;
        emailCell.rowSpan = requestCount;

        const totalRequestsCell = document.createElement("td");
        totalRequestsCell.textContent = user.totalAiRequests;
        totalRequestsCell.rowSpan = requestCount;

        const actionCell = document.createElement("td");
        actionCell.rowSpan = requestCount;
        const deleteButton = document.createElement("button");
        deleteButton.textContent = "Delete";
        deleteButton.className = "btn btn-danger";
        deleteButton.addEventListener("click", () => deleteUser(user.userId));
        actionCell.appendChild(deleteButton);

        userRow.appendChild(userIdCell);
        userRow.appendChild(emailCell);
        userRow.appendChild(totalRequestsCell);
        userRow.appendChild(actionCell);

        // Now, for the first API request (if any)
        if (user.apiRequests.length > 0) {
            const firstRequest = user.apiRequests[0];

            const routeCell = document.createElement("td");
            routeCell.textContent = firstRequest.route;

            const methodCell = document.createElement("td");
            methodCell.textContent = firstRequest.method;

            const countCell = document.createElement("td");
            countCell.textContent = firstRequest.count;

            userRow.appendChild(routeCell);
            userRow.appendChild(methodCell);
            userRow.appendChild(countCell);

            userTableBody.appendChild(userRow);

            // For the rest of the API requests
            for (let i = 1; i < user.apiRequests.length; i++) {
                const request = user.apiRequests[i];
                const requestRow = document.createElement("tr");

                const routeCell = document.createElement("td");
                routeCell.textContent = request.route;

                const methodCell = document.createElement("td");
                methodCell.textContent = request.method;

                const countCell = document.createElement("td");
                countCell.textContent = request.count;

                requestRow.appendChild(routeCell);
                requestRow.appendChild(methodCell);
                requestRow.appendChild(countCell);

                userTableBody.appendChild(requestRow);
            }
        } else {
            // If no API requests, just append the user row
            // Add empty cells for Route, Method, and Count
            const emptyRouteCell = document.createElement("td");
            const emptyMethodCell = document.createElement("td");
            const emptyCountCell = document.createElement("td");

            userRow.appendChild(emptyRouteCell);
            userRow.appendChild(emptyMethodCell);
            userRow.appendChild(emptyCountCell);

            userTableBody.appendChild(userRow);
        }
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
