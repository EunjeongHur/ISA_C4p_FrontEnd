const endpointUrl = "https://isa-c4p-4vqm.onrender.com/";

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

    userRow.appendChild(userIdCell);
    userRow.appendChild(emailCell);
    userRow.appendChild(totalRequestsCell);

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
