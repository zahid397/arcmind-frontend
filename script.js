// ========== CONFIGURATION ==========
const AI_CONFIG = {
    name: "ArcMind AI",
    version: "1.0",
    personality: "helpful, creative, technical",
    responseDelay: 800, // ms
    typingSpeed: 30, // ms per character
    intelligenceScore: 0
};

// ========== KNOWLEDGE BASE ==========
const KNOWLEDGE_BASE = {
    greetings: [
        "Hello! I'm ArcMind AI, running entirely in your browser.",
        "Hi there! No backend needed - I'm pure frontend AI.",
        "Hey! This demo works 24/7 with no sleeping servers."
    ],
    
    topics: {
        "machine learning": {
            responses: [
                "Machine Learning is a subset of AI where computers learn from data without explicit programming. It powers recommendations, image recognition, and more.",
                "ML involves training algorithms on data to make predictions or decisions. Types include supervised, unsupervised, and reinforcement learning.",
                "Deep learning, a ML subset using neural networks, has revolutionized fields like computer vision and NLP."
            ],
            score: 10
        },
        
        "python": {
            responses: [
                "Python is a high-level programming language known for its simplicity and extensive libraries for data science and AI.",
                "Here's a Python factorial function:\n\n```python\ndef factorial(n):\n    if n == 0:\n        return 1\n    else:\n        return n * factorial(n-1)\n```",
                "Python's `scikit-learn`, `tensorflow`, and `pytorch` are essential for ML development."
            ],
            score: 8
        },
        
        "quantum computing": {
            responses: [
                "Quantum computing uses quantum bits (qubits) that can be in multiple states simultaneously via superposition.",
                "Unlike classical bits (0 or 1), qubits can be both 0 and 1 at once, enabling exponential processing power for certain problems.",
                "Quantum computers could revolutionize cryptography, drug discovery, and optimization problems."
            ],
            score: 12
        },
        
        "ai benefits": {
            responses: [
                "AI benefits include automation of repetitive tasks, data analysis at scale, improved healthcare diagnostics, and enhanced creativity.",
                "AI can process vast amounts of data quickly, identify patterns humans miss, and work 24/7 without fatigue.",
                "From personalized recommendations to autonomous vehicles, AI transforms industries and improves efficiency."
            ],
            score: 7
        },
        
        "hackathon": {
            responses: [
                "Hackathons are great for rapid prototyping and learning new technologies under pressure.",
                "For hackathons, focus on a working demo with clear value proposition. UI/UX matters!",
                "Hackathon tip: Build something that works end-to-end, even if features are limited."
            ],
            score: 5
        },
        
        "javascript": {
            responses: [
                "JavaScript is the language of the web. Modern ES6+ features include async/await, arrow functions, and modules.",
                "Here's a factorial function in JavaScript:\n\n```javascript\nfunction factorial(n) {\n    return n <= 1 ? 1 : n * factorial(n - 1);\n}\n```",
                "JavaScript runs in browsers and servers (Node.js), making it versatile for full-stack development."
            ],
            score: 9
        }
    },
    
    fallbacks: [
        "That's an interesting topic! As a frontend AI, I'm designed to handle common queries efficiently.",
        "I'm processing your query locally in the browser. No API calls needed!",
        "This response is generated entirely in JavaScript - no backend required.",
        "Since I run in your browser, I provide instant responses with no network latency.",
        "Frontend AI at your service! All processing happens right here."
    ]
};

// ========== DOM ELEMENTS ==========
const DOM = {};

function initDOM() {
    DOM.loader = document.getElementById('loader');
    DOM.scoreValue = document.getElementById('scoreValue');
    DOM.welcomeSection = document.getElementById('welcomeSection');
    DOM.chatSection = document.getElementById('chatSection');
    DOM.messagesContainer = document.getElementById('messagesContainer');
    DOM.messageInput = document.getElementById('messageInput');
    DOM.sendBtn = document.getElementById('sendBtn');
    DOM.clearBtn = document.getElementById('clearBtn');
    DOM.themeBtn = document.getElementById('themeBtn');
    DOM.demoBtn = document.getElementById('demoBtn');
    DOM.startChat = document.getElementById('startChat');
    DOM.promptBtns = document.querySelectorAll('.prompt-btn');
}

// ========== UTILITIES ==========
function escapeHTML(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function formatTime(date = new Date()) {
    return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
}

function scrollToBottom() {
    requestAnimationFrame(() => {
        DOM.messagesContainer.scrollTo({
            top: DOM.messagesContainer.scrollHeight,
            behavior: 'smooth'
        });
    });
}

function simulateTyping(text, callback) {
    const words = text.split(' ');
    let i = 0;
    let currentText = '';
    
    function typeNext() {
        if (i < words.length) {
            currentText += words[i] + ' ';
            i++;
            callback(currentText.trim());
            setTimeout(typeNext, AI_CONFIG.typingSpeed);
        }
    }
    
    typeNext();
}

// ========== AI ENGINE ==========
function analyzeQuery(query) {
    const lowerQuery = query.toLowerCase().trim();
    
    // Check for greetings
    if (lowerQuery.match(/\b(hi|hello|hey|greetings)\b/)) {
        return {
            type: 'greeting',
            confidence: 0.9,
            topic: 'greetings'
        };
    }
    
    // Check known topics
    for (const [topic, data] of Object.entries(KNOWLEDGE_BASE.topics)) {
        if (lowerQuery.includes(topic)) {
            return {
                type: 'topic',
                confidence: 0.8,
                topic: topic,
                score: data.score
            };
        }
    }
    
    // Check for questions
    if (lowerQuery.includes('?')) {
        return {
            type: 'question',
            confidence: 0.7,
            topic: 'general'
        };
    }
    
    // Default
    return {
        type: 'general',
        confidence: 0.5,
        topic: 'general'
    };
}

function generateResponse(query) {
    const analysis = analyzeQuery(query);
    let responses;
    let scoreToAdd = 0;
    
    switch (analysis.type) {
        case 'greeting':
            responses = KNOWLEDGE_BASE.greetings;
            scoreToAdd = 3;
            break;
            
        case 'topic':
            responses = KNOWLEDGE_BASE.topics[analysis.topic].responses;
            scoreToAdd = analysis.score || 5;
            break;
            
        default:
            responses = KNOWLEDGE_BASE.fallbacks;
            scoreToAdd = 2;
    }
    
    // Update intelligence score
    AI_CONFIG.intelligenceScore += scoreToAdd;
    updateScore();
    
    // Select random response from available ones
    const response = responses[Math.floor(Math.random() * responses.length)];
    
    // Add some variety with occasional emoji
    const emojis = ['🤖', '⚡', '💡', '🧠', '🚀'];
    const shouldAddEmoji = Math.random() > 0.7;
    
    return shouldAddEmoji 
        ? `${response} ${emojis[Math.floor(Math.random() * emojis.length)]}`
        : response;
}

// ========== UI MANAGEMENT ==========
function addMessage(text, sender) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${sender}-message`;
    
    const avatarClass = sender === 'user' ? 'user-avatar' : 'ai-avatar';
    const avatarIcon = sender === 'user' ? 'fa-user' : 'fa-robot';
    
    messageDiv.innerHTML = `
        <div class="message-avatar ${avatarClass}">
            <i class="fas ${avatarIcon}"></i>
        </div>
        <div class="message-content">
            <div class="message-text">${escapeHTML(text)}</div>
            <div class="message-time">${formatTime()}</div>
        </div>
    `;
    
    DOM.messagesContainer.appendChild(messageDiv);
    scrollToBottom();
    
    // Add animation
    setTimeout(() => {
        messageDiv.style.animation = 'messageSlide 0.4s ease';
    }, 10);
}

function showTyping() {
    const typingDiv = document.createElement('div');
    typingDiv.className = 'message ai-message';
    typingDiv.id = 'typingIndicator';
    
    typingDiv.innerHTML = `
        <div class="message-avatar ai-avatar">
            <i class="fas fa-robot"></i>
        </div>
        <div class="message-content">
            <div class="typing-indicator">
                <span></span>
                <span></span>
                <span></span>
            </div>
        </div>
    `;
    
    DOM.messagesContainer.appendChild(typingDiv);
    scrollToBottom();
}

function hideTyping() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => indicator.remove(), 300);
    }
}

function updateScore() {
    if (DOM.scoreValue) {
        DOM.scoreValue.textContent = AI_CONFIG.intelligenceScore;
    }
}

// ========== MESSAGE PROCESSING ==========
async function processMessage(query) {
    // Add user message
    addMessage(query, 'user');
    DOM.messageInput.value = '';
    DOM.messageInput.style.height = 'auto';
    
    // Disable send button during processing
    DOM.sendBtn.disabled = true;
    
    // Show typing indicator
    showTyping();
    
    // Generate response after delay
    setTimeout(() => {
        hideTyping();
        const response = generateResponse(query);
        
        // Simulate typing effect for AI response
        const messageDiv = document.createElement('div');
        messageDiv.className = 'message ai-message';
        messageDiv.id = 'aiResponse';
        
        messageDiv.innerHTML = `
            <div class="message-avatar ai-avatar">
                <i class="fas fa-robot"></i>
            </div>
            <div class="message-content">
                <div class="message-text" id="aiText"></div>
                <div class="message-time">${formatTime()}</div>
            </div>
        `;
        
        DOM.messagesContainer.appendChild(messageDiv);
        scrollToBottom();
        
        // Type out the response
        const textElement = messageDiv.querySelector('#aiText');
        simulateTyping(response, (text) => {
            textElement.innerHTML = escapeHTML(text);
            scrollToBottom();
        });
        
        // Re-enable send button
        DOM.sendBtn.disabled = false;
        DOM.messageInput.focus();
    }, AI_CONFIG.responseDelay);
}

// ========== EVENT HANDLERS ==========
function setupEvents() {
    // Auto-resize textarea
    DOM.messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    
    // Send message
    DOM.sendBtn.addEventListener('click', () => {
        const text = DOM.messageInput.value.trim();
        if (text) processMessage(text);
    });
    
    // Enter to send
    DOM.messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            const text = DOM.messageInput.value.trim();
            if (text) processMessage(text);
        }
    });
    
    // Clear chat
    DOM.clearBtn.addEventListener('click', () => {
        if (confirm('Clear all messages?')) {
            DOM.messagesContainer.innerHTML = '';
            DOM.welcomeSection.classList.add('active');
            AI_CONFIG.intelligenceScore = 0;
            updateScore();
        }
    });
    
    // Theme toggle
    DOM.themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        DOM.themeBtn.innerHTML = document.body.classList.contains('light-theme') 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    });
    
    // Start chat button
    DOM.startChat.addEventListener('click', () => {
        DOM.welcomeSection.classList.remove('active');
        addMessage("Hello! I'm ArcMind AI, running entirely in your browser. No backend needed!", 'ai');
    });
    
    // Prompt buttons
    DOM.promptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prompt = btn.getAttribute('data-prompt');
            DOM.messageInput.value = prompt;
            DOM.messageInput.focus();
            DOM.messageInput.style.height = 'auto';
            DOM.messageInput.style.height = Math.min(DOM.messageInput.scrollHeight, 120) + 'px';
            
            // Auto-switch to chat if in welcome screen
            if (DOM.welcomeSection.classList.contains('active')) {
                DOM.welcomeSection.classList.remove('active');
            }
        });
    });
    
    // Demo info button
    DOM.demoBtn.addEventListener('click', () => {
        alert(`ArcMind AI Demo\n\n• Pure frontend implementation\n• No backend API calls\n• Always online\n• Works 24/7\n• Built with HTML5, CSS3, JavaScript\n\nIntelligence Score: ${AI_CONFIG.intelligenceScore}`);
    });
}

// ========== INITIALIZATION ==========
function initApp() {
    initDOM();
    setupEvents();
    updateScore();
    
    console.log('🚀 ArcMind AI initialized - Standalone Mode');
    console.log('✅ No backend dependency');
    console.log('✅ Always online');
    console.log('✅ Pure frontend implementation');
}

// ========== START APP ==========
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initApp, 100);
});

// Light theme CSS
document.head.insertAdjacentHTML('beforeend', `
<style>
.light-theme {
    background: linear-gradient(135deg, #f8fafc 0%, #e2e8f0 100%) !important;
    color: #1e293b !important;
}

.light-theme .app-container {
    background: rgba(255, 255, 255, 0.98) !important;
    border: 1px solid rgba(0, 0, 0, 0.1) !important;
    box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.15) !important;
}

.light-theme .header,
.light-theme .input-section {
    background: rgba(255, 255, 255, 0.9) !important;
    border-color: #e2e8f0 !important;
}

.light-theme .ai-message .message-content {
    background: #f8fafc !important;
    border: 1px solid #e2e8f0 !important;
    color: #1e293b !important;
}

.light-theme .message-input,
.light-theme .input-box {
    background: rgba(255, 255, 255, 0.9) !important;
    border: 1px solid #e2e8f0 !important;
    color: #1e293b !important;
}

@keyframes fadeOut {
    to { opacity: 0; transform: translateY(10px); }
}
</style>
`);
