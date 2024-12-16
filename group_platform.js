document.addEventListener("DOMContentLoaded", () => {
    const currentGroup = localStorage.getItem("currentGroup"); // Get current group from localStorage
    const groups = [
        { name: "Software Engineering", description: "Discuss and collaborate on software development topics." },
        { name: "Data Science", description: "Explore data analysis, machine learning, and data visualization." },
        { name: "Web Development", description: "Learn and share knowledge about frontend and backend web technologies." },
        { name: "AI & Machine Learning", description: "Dive into artificial intelligence and machine learning projects." },
        { name: "Mobile App Development", description: "Collaborate on mobile app development for iOS and Android." },
    ];

    // DOM Elements
    const groupNameElement = document.getElementById("group-name");
    const groupDescriptionElement = document.getElementById("group-description");
    const memberCountElement = document.getElementById("member-count");
    const membersListElement = document.getElementById("members-list");
    const fileInput = document.getElementById("file-input");
    const uploadBtn = document.getElementById("upload-btn");
    const fileListElement = document.getElementById("file-list");
    const messagesArea = document.getElementById("messages-area");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");
    const announcementInput = document.getElementById("announcement-input");
    const postAnnouncementBtn = document.getElementById("post-announcement-btn");
    const announcementList = document.getElementById("announcement-list");

    // Function to load and display group details
    const displayGroupInfo = () => {
        if (currentGroup) {
            // Display the group name in the header
            groupNameElement.textContent = currentGroup;

            // Find the matching group from the array
            const groupDetails = groups.find(group => group.name === currentGroup);

            // Display group description or fallback text
            if (groupDetails) {
                groupDescriptionElement.textContent = groupDetails.description;
            } else {
                groupDescriptionElement.textContent = "No description available for this group.";
            }

            // Display member count (mocking with random number for now)
            const randomMemberCount = Math.floor(Math.random() * 50) + 1; // Mock random member count
            memberCountElement.textContent = `${randomMemberCount} members`;

            // Generate members list (mocking with sample data)
            const sampleMembers = ["Alice", "Bob", "Charlie", "David"];
            membersListElement.innerHTML = "";
            sampleMembers.forEach(member => {
                const listItem = document.createElement("li");
                listItem.textContent = member;
                membersListElement.appendChild(listItem);
            });
        } else {
            // Fallback if no group is selected
            groupNameElement.textContent = "No Group Selected";
            groupDescriptionElement.textContent = "Please join a group to see its description.";
            memberCountElement.textContent = "0 members";
            membersListElement.innerHTML = "";
        }
    };

    // Function to handle file upload
    uploadBtn.addEventListener("click", () => {
        const file = fileInput.files[0];  // Get the first file selected
        if (file) {
            // Create a file display element
            const fileItem = document.createElement("div");
            fileItem.textContent = file.name; // Display the file name
            fileListElement.appendChild(fileItem);  // Add the file to the list
            fileInput.value = ""; // Clear the file input field after uploading
        } else {
            alert("Please select a file to upload.");
        }
    });

    // Function to initialize chat functionality
    const initializeChat = () => {
        const username = localStorage.getItem("username") || "Anonymous";
        const groupChatKey = `groupChatMessages_${currentGroup}`;

        // Load chat history from localStorage
        const loadMessages = () => {
            const chatMessages = JSON.parse(localStorage.getItem(groupChatKey)) || [];
            messagesArea.innerHTML = ""; // Clear existing messages

            // Display all messages in the chat window
            chatMessages.forEach(message => {
                const messageElement = document.createElement("div");
                messageElement.classList.add("message");

                // If the message is from the current user, add special styling
                if (message.username === username) {
                    messageElement.classList.add("current-user");
                }

                const userElement = document.createElement("span");
                userElement.classList.add("username");
                userElement.textContent = message.username;

                const timestampElement = document.createElement("span");
                timestampElement.classList.add("timestamp");
                timestampElement.textContent = ` - ${message.timestamp}`;

                const textElement = document.createElement("p");
                textElement.textContent = message.text;

                messageElement.appendChild(userElement);
                messageElement.appendChild(timestampElement);
                messageElement.appendChild(textElement);

                messagesArea.appendChild(messageElement);
            });

            // Scroll to the latest message
            messagesArea.scrollTop = messagesArea.scrollHeight;
        };

        // Send a new message to the group chat
        const sendMessage = () => {
            const text = messageInput.value.trim();
            if (text === "") {
                return;
            }

            const message = {
                username: username,
                text: text,
                timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' })
            };

            // Save the message to localStorage
            const chatMessages = JSON.parse(localStorage.getItem(groupChatKey)) || [];
            chatMessages.push(message);
            localStorage.setItem(groupChatKey, JSON.stringify(chatMessages));

            loadMessages(); // Refresh the message list
            messageInput.value = ""; // Clear the input field
        };

        // Event listener for send button click
        sendBtn.addEventListener("click", sendMessage);

        // Event listener for pressing the "Enter" key
        messageInput.addEventListener("keypress", (event) => {
            if (event.key === "Enter") {
                event.preventDefault();
                sendMessage();
            }
        });

        // Load the initial messages when the page loads
        loadMessages();
    };

    // Function to post a new announcement
    const postAnnouncement = () => {
        const announcementText = announcementInput.value.trim();
        if (!announcementText) {
            alert("Please enter an announcement.");
            return;
        }

        const username = localStorage.getItem("username") || "Anonymous";
        const timestamp = new Date().getTime();  // Store the current timestamp in milliseconds

        const announcement = {
            username: username,
            text: announcementText,
            timestamp: timestamp,
        };

        // Get existing announcements from localStorage or initialize an empty array
        const existingAnnouncements = JSON.parse(localStorage.getItem("groupAnnouncements")) || [];
        existingAnnouncements.push(announcement);

        // Save updated announcements to localStorage
        localStorage.setItem("groupAnnouncements", JSON.stringify(existingAnnouncements));

        // Clear the input field and reload announcements
        announcementInput.value = "";
        loadAnnouncements();
    };

    // Function to load announcements
    const loadAnnouncements = () => {
        const now = new Date().getTime();
        const groupAnnouncements = JSON.parse(localStorage.getItem("groupAnnouncements")) || [];

        // Filter out announcements that are older than 3 days (3 * 24 * 60 * 60 * 1000 ms = 259200000 ms)
        const validAnnouncements = groupAnnouncements.filter(announcement => now - announcement.timestamp <= 259200000);

        // Save filtered announcements back to localStorage
        localStorage.setItem("groupAnnouncements", JSON.stringify(validAnnouncements));

        // Clear the existing list before reloading
        announcementList.innerHTML = "";

        // Render the announcements
        validAnnouncements.forEach(announcement => {
            const announcementElement = document.createElement("div");
            announcementElement.classList.add("announcement");

            const usernameElement = document.createElement("span");
            usernameElement.classList.add("announcement-username");
            usernameElement.textContent = announcement.username;

            const timestampElement = document.createElement("span");
            timestampElement.classList.add("announcement-timestamp");
            timestampElement.textContent = new Date(announcement.timestamp).toLocaleString();

            const announcementTextElement = document.createElement("p");
            announcementTextElement.textContent = announcement.text;

            // Append to the announcement element
            announcementElement.appendChild(usernameElement);
            announcementElement.appendChild(timestampElement);
            announcementElement.appendChild(announcementTextElement);

            // Append to the list
            announcementList.appendChild(announcementElement);
        });
    };

    // Event listener for posting a new announcement
    postAnnouncementBtn.addEventListener("click", postAnnouncement);

    // Load group information and initialize chat on page load
    displayGroupInfo();
    initializeChat();
});
