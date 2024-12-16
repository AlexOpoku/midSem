document.addEventListener("DOMContentLoaded", () => {
    const groups = [
        { name: "Software Engineering", description: "Discuss and collaborate on software development topics." },
        { name: "Data Science", description: "Explore data analysis, machine learning, and data visualization." },
        { name: "Web Development", description: "Learn and share knowledge about frontend and backend web technologies." },
        { name: "AI & Machine Learning", description: "Dive into artificial intelligence and machine learning projects." },
        { name: "Mobile App Development", description: "Collaborate on mobile app development for iOS and Android." },
    ];

    const groupList = document.getElementById("group-list");
    const joinedGroupList = document.getElementById("joined-group-list");
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const joinedGroups = JSON.parse(localStorage.getItem("joinedGroups")) || [];

    // Redirect to login if not logged in
    if (!isLoggedIn) {
        alert("Please log in or register to access groups.");
        window.location.href = "index.html";
        return;
    }

    // Display all available groups with join functionality
    function displayGroups() {
        groupList.innerHTML = "";
        groups.forEach(group => {
            const groupItem = document.createElement("div");
            groupItem.classList.add("group-item");
            groupItem.textContent = group.name;

            const joinButton = document.createElement("button");
            joinButton.textContent = joinedGroups.includes(group.name) ? "Joined" : "Join";
            joinButton.disabled = joinedGroups.includes(group.name); // Disable button if already joined

            joinButton.addEventListener("click", () => {
                joinGroup(group.name);
                displayGroups(); // Refresh the available groups list
                displayJoinedGroups(); // Refresh the joined groups list
            });

            groupItem.appendChild(joinButton);
            groupList.appendChild(groupItem);
        });
    }

    // Join a group and update localStorage
    function joinGroup(groupName) {
        if (!joinedGroups.includes(groupName)) {
            joinedGroups.push(groupName);
            localStorage.setItem("joinedGroups", JSON.stringify(joinedGroups));
            alert(`You have successfully joined ${groupName}`);
        } else {
            alert(`You are already a member of ${groupName}`);
        }
    }

    // Leave a group and update localStorage
    function leaveGroup(groupName) {
        const groupIndex = joinedGroups.indexOf(groupName);
        if (groupIndex > -1) {
            joinedGroups.splice(groupIndex, 1); // Remove the group from joinedGroups
            localStorage.setItem("joinedGroups", JSON.stringify(joinedGroups));
            alert(`You have left the group: ${groupName}`);
            displayGroups(); // Refresh the available groups list
            displayJoinedGroups(); // Refresh the joined groups list
        }
    }

    // Display joined groups with leave functionality
    function displayJoinedGroups() {
        joinedGroupList.innerHTML = ""; // Clear the existing list
        if (joinedGroups.length > 0) {
            joinedGroups.forEach(groupName => {
                const joinedGroupItem = document.createElement("div");
                joinedGroupItem.classList.add("group-item");
                joinedGroupItem.textContent = groupName;

                // "Options" button to navigate to chat or platform
                const optionsButton = document.createElement("button");
                optionsButton.classList.add("options-btn");
                optionsButton.innerHTML = '<i class="fas fa-cog"></i> Options';
                optionsButton.addEventListener("click", () => {
                    localStorage.setItem("currentGroup", groupName);
                    const userChoice = confirm(`Do you want to enter the Chat for ${groupName}? Click "Cancel" to view the Platform.`);
                    if (userChoice) {
                        window.location.href = "chat.html";
                    } else {
                        window.location.href = "group_platform.html";
                    }
                });

                // "Leave" button to leave the group
                const leaveButton = document.createElement("button");
                leaveButton.classList.add("leave-btn");
                leaveButton.textContent = "Leave";
                leaveButton.addEventListener("click", () => {
                    leaveGroup(groupName);
                });

                joinedGroupItem.appendChild(optionsButton);
                joinedGroupItem.appendChild(leaveButton);
                joinedGroupList.appendChild(joinedGroupItem);
            });
        } else {
            joinedGroupList.textContent = "You haven't joined any groups yet.";
        }
    }

    // Initial display of available and joined groups
    displayGroups();
    displayJoinedGroups();
});
