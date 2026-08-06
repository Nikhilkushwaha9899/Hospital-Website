const chatWindow = document.getElementById('ip');
const inputBox = document.querySelector('#msg input');
const askBtn = document.getElementById('bt');

addBotMessage("Hi! I'm your Mediclub+ Health Assistant. Describe your symptoms or ask a health question, and I'll do my best to help.");

askBtn.addEventListener('click', handleAsk);
inputBox.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') handleAsk();
});

async function handleAsk() {
    const question = inputBox.value.trim();
    if (!question) return;

    addUserMessage(question);
    inputBox.value = '';
    inputBox.focus();

    const typingEl = showTypingIndicator();

    try {
        const reply = await askAssistant(question);
        typingEl.remove();
        addBotMessage(reply);
    } catch (err) {
        typingEl.remove();
        addBotMessage("Sorry, I couldn't reach the assistant right now. Please try again in a moment.");
        console.error('Assistant API error:', err);
    }
}

async function askAssistant(message) {
    const response = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message })
    });

    if (!response.ok) {
        throw new Error(`Server responded with ${response.status}`);
    }

    const data = await response.json();
    return data.reply || "I didn't get a proper response, please try again.";
}

function addUserMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-msg user-msg';
    bubble.textContent = text;
    chatWindow.appendChild(bubble);
    scrollToBottom();
}

function addBotMessage(text) {
    const bubble = document.createElement('div');
    bubble.className = 'chat-msg bot-msg';
    bubble.textContent = text;
    chatWindow.appendChild(bubble);
    scrollToBottom();
}

function showTypingIndicator() {
    const bubble = document.createElement('div');
    bubble.className = 'chat-msg bot-msg typing';
    bubble.innerHTML = '<span></span><span></span><span></span>';
    chatWindow.appendChild(bubble);
    scrollToBottom();
    return bubble;
}

function scrollToBottom() {
    chatWindow.scrollTop = chatWindow.scrollHeight;
}