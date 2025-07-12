// script.js
const messagesArea = document.getElementById('messagesArea');
const messageInput = document.getElementById('messageInput');
const sendMessageBtn = document.getElementById('sendMessageBtn');
const loadingIndicator = document.getElementById('loadingIndicator');

// chatHistory will store the conversation for context
let chatHistory = [];

// Function to add a message to the UI
function addMessageToUI(text, sender) {
    const messageBubble = document.createElement('div');
    messageBubble.classList.add('message-bubble', 'rounded-xl', 'relative');
    messageBubble.classList.add(sender); // 'user' or 'ai'

    const messageContent = document.createElement('p');
    messageContent.textContent = text;
    messageBubble.appendChild(messageContent);

    // Append messages above the loading indicator if it's present
    if (loadingIndicator.style.display === 'block') {
        messagesArea.insertBefore(messageBubble, loadingIndicator);
    } else {
        messagesArea.appendChild(messageBubble);
    }
    messagesArea.scrollTop = messagesArea.scrollHeight; // Scroll to bottom
}

// Function to send message to Gemini API
async function sendMessageToGemini(prompt) {
    // Add user message to UI and history
    addMessageToUI(prompt, 'user');
    chatHistory.push({ role: "user", parts: [{ text: prompt }] });

    // Show loading indicator
    loadingIndicator.style.display = 'block';
    messagesArea.scrollTop = messagesArea.scrollHeight; // Scroll to bottom to show loading

    try {
        const payload = {
            contents: chatHistory
        };
        // Gemini API Key provided by the user
        const apiKey = "AIzaSyBOfV-ke2ZBjyBF-N7HATEnlV6Yo9RjVpE"; 
        // Using gemini-2.5-flash model
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash:generateContent?key=${apiKey}`;

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(`API error: ${response.status} ${response.statusText} - ${errorData.error.message || 'Unknown error'}`);
        }

        const result = await response.json();

        if (result.candidates && result.candidates.length > 0 &&
            result.candidates[0].content && result.candidates[0].content.parts &&
            result.candidates[0].content.parts.length > 0) {
            const aiResponseText = result.candidates[0].content.parts[0].text;
            addMessageToUI(aiResponseText, 'ai');
            chatHistory.push({ role: "model", parts: [{ text: aiResponseText }] });
        } else {
            addMessageToUI("Sorry, I couldn't get a response from the AI. Please try again.", 'ai');
            console.error("Unexpected API response structure:", result);
        }
    } catch (error) {
        console.error("Error calling Gemini API:", error);
        addMessageToUI(`An error occurred: ${error.message}. Please try again.`, 'ai');
    } finally {
        // Hide loading indicator
        loadingIndicator.style.display = 'none';
        messagesArea.scrollTop = messagesArea.scrollHeight; // Scroll to bottom again
    }
}

// Event listeners
sendMessageBtn.addEventListener('click', () => {
    const message = messageInput.value.trim();
    if (message) {
        sendMessageToGemini(message);
        messageInput.value = ''; // Clear input field
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendMessageBtn.click(); // Trigger button click on Enter key
    }
});
