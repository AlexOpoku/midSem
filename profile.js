document.addEventListener("DOMContentLoaded", () => {
    // Check if the user is logged in
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const username = localStorage.getItem("username");

    // Redirect to homepage if not logged in
    if (!isLoggedIn) {
        console.log("User not logged in. Redirecting to homepage.");
        window.location.href = "index.html";
        return;
    }

    // Show greeting if logged in
    const profileHeader = document.querySelector(".profile h2");
    if (profileHeader) {
        profileHeader.textContent = `Welcome, ${username}!`;
    }

    // Display username
    const usernameElement = document.getElementById("profile-username");
    if (usernameElement) {
        usernameElement.textContent = username;
    }

    // Load profile data from localStorage
    const userProfiles = JSON.parse(localStorage.getItem("userProfiles")) || {};
    const userProfile = userProfiles[username] || { bio: "Not set", area: "Not set", profilePic: "default-pic.jpg" };

    // Display profile info
    document.getElementById("profile-bio").textContent = userProfile.bio;
    document.getElementById("profile-area").textContent = userProfile.area;
    document.getElementById("profile-pic").src = userProfile.profilePic || "default-pic.jpg";

    // Profile form submission handler
    const profileForm = document.getElementById("profile-form");
    const profilePicUpload = document.getElementById("profile-pic-upload");

    if (profileForm) {
        profileForm.addEventListener("submit", (event) => {
            event.preventDefault();

            const bio = document.getElementById("bio").value.trim();
            const area = document.getElementById("area").value.trim();

            // Handle profile picture upload and convert to Base64
            if (profilePicUpload && profilePicUpload.files.length > 0) {
                const reader = new FileReader();
                reader.onload = function (e) {
                    const profilePicBase64 = e.target.result;

                    // Save updated profile data with picture
                    userProfiles[username] = { bio: bio, area: area, profilePic: profilePicBase64 };
                    localStorage.setItem("userProfiles", JSON.stringify(userProfiles));

                    // Update displayed info
                    updateProfileDisplay(bio, area, profilePicBase64);
                    profileForm.reset();
                };
                reader.readAsDataURL(profilePicUpload.files[0]); // Read file and convert to Base64
            } else {
                // If no new picture is uploaded, save other info without changing the picture
                userProfiles[username] = { bio: bio, area: area, profilePic: userProfile.profilePic };
                localStorage.setItem("userProfiles", JSON.stringify(userProfiles));

                // Update displayed info
                updateProfileDisplay(bio, area, userProfile.profilePic);
                profileForm.reset();
            }
        });
    }

    // Function to update profile display
    function updateProfileDisplay(bio, area, profilePic) {
        document.getElementById("profile-bio").textContent = bio;
        document.getElementById("profile-area").textContent = area;
        document.getElementById("profile-pic").src = profilePic;
    }

    // Logout functionality
    const logoutBtn = document.getElementById("logout-btn");
    if (logoutBtn) {
        logoutBtn.addEventListener("click", () => {
            localStorage.removeItem("loggedIn");
            localStorage.removeItem("username");
            console.log("User logged out.");
            window.location.href = "index.html";
        });
    }
});
