const endpointUrl = "https://isa-c4p.onrender.com/";

document.addEventListener("DOMContentLoaded", async () => {
  const isAdmin = await checkAdminAccess();
  if (!isAdmin) {
    alert("Access denied. Admins only.");
    window.location.href = "/"; // Redirect non-admins to the home page or login
    return;
  }

  // Load the user table for admins
  await loadUserTable();
});

// Function to check if the user is an admin
async function checkAdminAccess() {
  const token = localStorage.getItem("token");

  if (!token) {
    console.warn("No token found, redirecting to login.");
    return false; // Token missing, user is not authenticated
  }

  try {
    const response = await fetch(`${endpointUrl}api/v1/check-role`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
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
    const token = localStorage.getItem("token");
    const response = await fetch(`${endpointUrl}api/v1/users`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const users = await response.json();

    if (response.ok) {
      populateTable(users);
    } else {
      console.error(
        "Failed to fetch users:",
        users.message || response.statusText
      );
    }
  } catch (error) {
    console.error("Error fetching users:", error);
  }
}

// Function to populate the table with user data
function populateTable(users) {
  const userTableBody = document
    .getElementById("userTable")
    .querySelector("tbody");
  userTableBody.innerHTML = ""; // Clear existing rows

  users.forEach((user) => {
    const row = document.createElement("tr");

    // Create table cells for each field
    const userIdCell = document.createElement("td");
    userIdCell.textContent = user.user_id;

    const emailCell = document.createElement("td");
    emailCell.textContent = user.email;

    const requestCountCell = document.createElement("td");
    requestCountCell.textContent = user.request_count;

    // Append cells to the row
    row.appendChild(userIdCell);
    row.appendChild(emailCell);
    row.appendChild(requestCountCell);

    // Append row to the table body
    userTableBody.appendChild(row);
  });
}
