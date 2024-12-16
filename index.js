// Tab functionality for switching between Register and Login tabs
function openTab(tabName) {
    const tabContents = document.querySelectorAll(".tab-content");
    const tabButtons = document.querySelectorAll(".tab-btn");

    // Hide all tab contents
    tabContents.forEach(tab => {
        tab.style.display = "none";
    });

    // Remove active class from all buttons
    tabButtons.forEach(button => {
        button.classList.remove("active");
    });

    // Show the selected tab and add active class to the corresponding button
    document.getElementById(tabName).style.display = "block";
    document.querySelector(`[onclick="openTab('${tabName}')"]`).classList.add("active");
}

// Initialize by opening the "register" tab
document.addEventListener("DOMContentLoaded", () => {
    openTab("register");
});

// Registration functionality
document.addEventListener("DOMContentLoaded", () => {
    const registerForm = document.getElementById("register-form");

    if (registerForm) {
        registerForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // Get form input values
            const username = document.getElementById("reg-username").value.trim();
            const password = document.getElementById("reg-password").value;

            // Retrieve existing users from localStorage or create an empty object if none exist
            const users = JSON.parse(localStorage.getItem("users")) || {};

            // Check if the username already exists
            if (users[username]) {
                alert("Username already taken. Please choose another one.");
                return;
            }

            // Add new user to users object
            users[username] = { password: password };
            localStorage.setItem("users", JSON.stringify(users)); // Save users back to localStorage

            alert("Registration successful! You can now log in.");
            registerForm.reset(); // Clear form fields
            openTab("login"); // Switch to login tab if using the tab layout
        });
    }
});

// Login functionality
document.addEventListener("DOMContentLoaded", () => {
    const loginForm = document.getElementById("login-form");

    if (loginForm) {
        loginForm.addEventListener("submit", (event) => {
            event.preventDefault();

            // Get form input values
            const username = document.getElementById("username").value.trim();
            const password = document.getElementById("password").value;

            // Retrieve users from localStorage
            const users = JSON.parse(localStorage.getItem("users")) || {};

            // Check if the user exists and the password matches
            if (users[username] && users[username].password === password) {
                // Save session info to localStorage
                localStorage.setItem("loggedIn", "true");
                localStorage.setItem("username", username);

                alert("Login successful!");
                window.location.href = "profile.html"; // Redirect to profile page
            } else {
                alert("Invalid username or password.");
            }
        });
    }
});

// Homepage group section functionality
document.addEventListener("DOMContentLoaded", () => {
    const homepageGroups = [
        { name: "Software Engineering" },
        { name: "Web Development" },
        { name: "AI & Machine Learning" },
        { name: "Mobile App Development" },
    ];

    const homepageGroupList = document.getElementById("homepage-group-list");

    // Display groups on the homepage
    function displayHomepageGroups() {
        homepageGroupList.innerHTML = "";
        homepageGroups.forEach(group => {
            const groupItem = document.createElement("div");
            groupItem.classList.add("group-item");

            const groupName = document.createElement("h3");
            groupName.textContent = group.name;

            const joinBtn = document.createElement("button");
            joinBtn.classList.add("join-btn");
            joinBtn.textContent = "Join";
            joinBtn.addEventListener("click", () => handleJoinClick(group.name));

            groupItem.appendChild(groupName);
            groupItem.appendChild(joinBtn);
            homepageGroupList.appendChild(groupItem);
        });
    }

    // Handle "Join" button click
    function handleJoinClick(groupName) {
        const isLoggedIn = localStorage.getItem("loggedIn") === "true";

        if (isLoggedIn) {
            // If user is logged in, redirect to the groups page
            window.location.href = "groups.html";
        } else {
            // If user is not logged in, prompt to log in or register
            const userChoice = confirm("Please log in or register to join a group. Would you like to log in?");
            if (userChoice) {
                window.location.href = "index.html";
            } else {
                window.location.href = "index.html";
            }
        }
    }

    // Initial display of homepage groups
    displayHomepageGroups();
});
