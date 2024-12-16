document.addEventListener("DOMContentLoaded", () => {
    // Retrieve login and membership data from localStorage
    const isLoggedIn = localStorage.getItem("loggedIn") === "true";
    const username = localStorage.getItem("username");
    const currentGroup = localStorage.getItem("currentGroup");
    const joinedGroups = JSON.parse(localStorage.getItem("joinedGroups")) || [];

    // Check if the user is logged in
    if (!isLoggedIn || !username) {
        alert("Please log in or register to access the chat.");
        window.location.href = "index.html"; // Redirect to the homepage for login/registration
        return;
    }

    // Check if the user has joined the current group
    if (!currentGroup || !joinedGroups.includes(currentGroup)) {
        alert("Please join the group to access the chat.");
        window.location.href = "groups.html"; // Redirect to groups page if not a member
        return;
    }

    // Set up chat for the specific group
    initializeChat(currentGroup);
});

function initializeChat(groupName) {
    const messagesArea = document.getElementById("messages-area");
    const messageInput = document.getElementById("message-input");
    const sendBtn = document.getElementById("send-btn");

    const username = localStorage.getItem("username") || "Anonymous"; // Fallback if username not set
    const groupChatKey = `groupChatMessages_${groupName}`; // Unique key for each group's chat messages

    // Display the current group name in the chat header
    document.getElementById("chat-group-name").textContent = groupName || "Unknown Group";

    // Load chat history for the current group from localStorage
    const loadMessages = () => {
        console.log("Loading messages from localStorage...");
        const chatMessages = JSON.parse(localStorage.getItem(groupChatKey)) || [];
        messagesArea.innerHTML = ""; // Clear current display

        chatMessages.forEach(message => {
            displayMessage(message);
        });

        // Scroll to the latest message
        messagesArea.scrollTop = messagesArea.scrollHeight;
    };

    // Display a message on the screen
    const displayMessage = (message) => {
        const messageElement = document.createElement("div");
        messageElement.classList.add("message");

        // Apply specific styling if message is from the current user
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
    };

    // Save message to the group's chat in localStorage
    const saveMessage = (message) => {
        const chatMessages = JSON.parse(localStorage.getItem(groupChatKey)) || [];
        chatMessages.push(message);
        localStorage.setItem(groupChatKey, JSON.stringify(chatMessages));
    };

    // Handle sending a message
    const sendMessage = () => {
        const text = messageInput.value.trim();
        if (text === "") {
            console.log("Empty message. Ignoring send.");
            return;
        }

        const message = {
            username: username,
            text: text,
            timestamp: new Date().toLocaleString([], { hour: '2-digit', minute: '2-digit' })
        };

        console.log("Sending message:", message);
        displayMessage(message);
        saveMessage(message);

        // Clear the input and scroll to the latest message
        messageInput.value = "";
        messagesArea.scrollTop = messagesArea.scrollHeight;
    };

    // Event listener for send button
    sendBtn.addEventListener("click", sendMessage);

    // Event listener for pressing "Enter" key
    messageInput.addEventListener("keypress", (event) => {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });

    // Clear chat history for testing purposes
    const clearChatBtn = document.getElementById("clear-chat-btn");

    clearChatBtn.addEventListener("click", () => {
        localStorage.removeItem(groupChatKey);
        messagesArea.innerHTML = ""; // Clear displayed messages
        console.log("Chat cleared.");
    });

    // Initial load of chat messages
    loadMessages();

    // Check for new messages
    let lastMessageCount = 0;

    const checkForNewMessages = () => {
        const chatMessages = JSON.parse(localStorage.getItem(groupChatKey)) || [];
        if (chatMessages.length > lastMessageCount) {
            console.log("New message received!");
            lastMessageCount = chatMessages.length;
            loadMessages(); // Reload messages
        }
    };

    // Check for new messages every 5 seconds
    setInterval(checkForNewMessages, 5000);
}
