// ========== CONFIGURATION ==========
const CONFIG = {
    API_BASE: 'https://arcmind-27ed.onrender.com',
    ENDPOINTS: {
        HEALTH: '/api/health',
        CHAT: '/api/chat'
    },
    TIMEOUTS: {
        HEALTH: 3000,
        CHAT: 8000
    },
    MAX_RETRIES: 2
};

// ========== STATE ==========
const STATE = {
    isBackendAlive: false,
    isDemoMode: true,
    isTyping: false,
    messages: [],
    stats: {
        total: 0,
        backend: 0,
        demo: 0,
        avgResponseTime: 0
    }
};

// ========== DOM ELEMENTS ==========
const DOM = {};

function initDOM() {
    DOM.loader = document.getElementById('loader');
    DOM.statusBanner = document.getElementById('statusBanner');
    DOM.statusText = document.getElementById('statusText');
    DOM.statusTime = document.getElementById('statusTime');
    DOM.wakeBtn = document.getElementById('wakeBtn');
    DOM.wakeBigBtn = document.getElementById('wakeBigBtn');
    DOM.liveStatus = document.getElementById('liveStatus');
    DOM.clearBtn = document.getElementById('clearBtn');
    DOM.themeBtn = document.getElementById('themeBtn');
    DOM.infoBtn = document.getElementById('infoBtn');
    DOM.welcomeSection = document.getElementById('welcomeSection');
    DOM.welcomeDesc = document.getElementById('welcomeDesc');
    DOM.chatSection = document.getElementById('chatSection');
    DOM.messagesContainer = document.getElementById('messagesContainer');
    DOM.messageInput = document.getElementById('messageInput');
    DOM.sendBtn = document.getElementById('sendBtn');
    DOM.promptBtns = document.querySelectorAll('.prompt-btn');
    DOM.infoModal = document.getElementById('infoModal');
    DOM.closeModal = document.getElementById('closeModal');
    DOM.viewSource = document.getElementById('viewSource');
}

// ========== UTILITIES ==========
function debounce(fn, delay) {
    let timeout;
    return (...args) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => fn(...args), delay);
    };
}

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

// ========== API FUNCTIONS ==========
async function fetchWithTimeout(url, timeout, options = {}) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    
    try {
        const response = await fetch(url, {
            ...options,
            signal: controller.signal,
            headers: {
                'Content-Type': 'application/json',
                ...options.headers
            }
        });
        clearTimeout(timeoutId);
        return response;
    } catch (error) {
        clearTimeout(timeoutId);
        throw error;
    }
}

async function checkHealth() {
    try {
        const response = await fetchWithTimeout(
            `${CONFIG.API_BASE}${CONFIG.ENDPOINTS.HEALTH}`,
            CONFIG.TIMEOUTS.HEALTH
        );
        
        const isAlive = response.ok;
        STATE.isBackendAlive = isAlive;
        STATE.isDemoMode = !isAlive;
        
        updateStatus(isAlive ? 'live' : 'demo');
        updateStatusTime();
        
        return isAlive;
    } catch (error) {
        console.warn('Health check failed:', error.message);
        STATE.isBackendAlive = false;
        STATE.isDemoMode = true;
        updateStatus('demo');
        return false;
    }
}

async function sendChat(message) {
    for (let attempt = 1; attempt <= CONFIG.MAX_RETRIES; attempt++) {
        try {
            const response = await fetchWithTimeout(
                `${CONFIG.API_BASE}${CONFIG.ENDPOINTS.CHAT}`,
                CONFIG.TIMEOUTS.CHAT,
                {
                    method: 'POST',
                    body: JSON.stringify({ message })
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            STATE.stats.backend++;
            
            return {
                success: true,
                text: data.response || data.message || 'No response',
                source: 'backend',
                attempt
            };
        } catch (error) {
            console.warn(`Attempt ${attempt} failed:`, error.message);
            
            if (attempt < CONFIG.MAX_RETRIES) {
                await new Promise(resolve => 
                    setTimeout(resolve, 500 * attempt)
                );
                continue;
            }
            
            return {
                success: false,
                error: error.message,
                source: 'failed'
            };
        }
    }
}

// ========== STATUS UPDATES ==========
function updateStatus(type) {
    if (!DOM.statusBanner || !DOM.statusText) return;
    
    DOM.statusBanner.className = `status-banner ${type}`;
    
    switch (type) {
        case 'live':
            DOM.statusText.textContent = 'Backend connected';
            DOM.liveStatus.textContent = 'Live Mode';
            DOM.welcomeDesc.textContent = 'Backend is awake! Chat with real AI now.';
            break;
        case 'demo':
            DOM.statusText.textContent = 'Backend sleeping (demo mode)';
            DOM.liveStatus.textContent = 'Demo Mode';
            DOM.welcomeDesc.textContent = 'Hackathon project with intelligent backend sleep handling';
            break;
        case 'checking':
            DOM.statusText.textContent = 'Checking backend status...';
            break;
    }
}

function updateStatusTime() {
    if (DOM.statusTime) {
        DOM.statusTime.textContent = `Last checked: ${formatTime()}`;
    }
}

// ========== MESSAGE HANDLING ==========
function addMessage(text, sender, isDemo = false) {
    const id = Date.now();
    const time = new Date();
    
    const message = {
        id,
        text,
        sender,
        isDemo,
        time,
        timestamp: time.getTime()
    };
    
    STATE.messages.push(message);
    STATE.stats.total++;
    if (isDemo) STATE.stats.demo++;
    
    renderMessage(message);
    updateStats();
    
    if (DOM.welcomeSection.classList.contains('active') && sender === 'user') {
        DOM.welcomeSection.classList.remove('active');
    }
}

function renderMessage(message) {
    const messageDiv = document.createElement('div');
    messageDiv.className = `message ${message.sender}-message`;
    
    const avatarClass = message.sender === 'user' ? 'user-avatar' : 'ai-avatar';
    const avatarIcon = message.sender === 'user' ? 'fa-user' : 'fa-robot';
    
    messageDiv.innerHTML = `
        <div class="message-avatar ${avatarClass}">
            <i class="fas ${avatarIcon}"></i>
        </div>
        <div class="message-content">
            <div class="message-text">${escapeHTML(message.text)}</div>
            <div class="message-time">
                ${formatTime(message.time)}
                ${message.isDemo ? '<span class="demo-badge">DEMO</span>' : ''}
            </div>
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
    STATE.isTyping = true;
    scrollToBottom();
}

function hideTyping() {
    const indicator = document.getElementById('typingIndicator');
    if (indicator) {
        indicator.style.animation = 'fadeOut 0.3s forwards';
        setTimeout(() => indicator.remove(), 300);
    }
    STATE.isTyping = false;
}

// ========== DEMO RESPONSES ==========
function getDemoResponse(userMessage) {
    const responses = [
        `I received: "${userMessage.substring(0, 50)}...". Currently in demo mode while backend wakes up from Render sleep.`,
        `Demo response: For "${userMessage.substring(0, 40)}...", the live backend AI would provide detailed analysis.`,
        `🔋 Backend is starting up... This is a demo response. Try waking the backend for real AI!`,
        `Thanks for your message! The backend server is sleeping (Render free tier). Use the wake button above.`,
        `In live mode, I'd process this with DeepSeek AI. Meanwhile, here's a demo response.`
    ];
    
    // Smart responses for questions
    if (userMessage.includes('?')) {
        return "That's a great question! The backend AI can provide a comprehensive answer once it wakes up.";
    }
    
    // Code-related queries
    if (userMessage.toLowerCase().includes('code') || 
        userMessage.toLowerCase().includes('function') ||
        userMessage.toLowerCase().includes('python')) {
        return "For code generation and analysis, the live backend with DeepSeek AI works best. Try waking it!";
    }
    
    return responses[Math.floor(Math.random() * responses.length)];
}

// ========== WAKE BACKEND ==========
async function wakeBackend() {
    if (DOM.wakeBtn.disabled) return;
    
    // Disable buttons
    DOM.wakeBtn.disabled = true;
    DOM.wakeBigBtn.disabled = true;
    DOM.wakeBtn.querySelector('.btn-spinner').style.display = 'inline-block';
    DOM.wakeBtn.innerHTML = '<span class="btn-spinner"></span> Waking...';
    
    updateStatus('checking');
    
    try {
        let isAlive = false;
        const maxAttempts = 3;
        
        for (let i = 0; i < maxAttempts; i++) {
            console.log(`Wake attempt ${i + 1}`);
            isAlive = await checkHealth();
            
            if (isAlive) break;
            
            // Progressive delay
            await new Promise(resolve => 
                setTimeout(resolve, 2000 * (i + 1))
            );
        }
        
        if (isAlive) {
            addMessage('✅ Backend is now awake! All responses will be from live AI.', 'system');
            console.log('✅ Backend successfully woken up');
        } else {
            addMessage('⚠️ Backend is taking longer to wake up. Continue in demo mode.', 'system');
        }
        
    } catch (error) {
        console.error('Wake error:', error);
        addMessage(`❌ Failed to wake backend: ${error.message}`, 'system');
        updateStatus('demo');
    } finally {
        // Re-enable after delay
        setTimeout(() => {
            DOM.wakeBtn.disabled = false;
            DOM.wakeBigBtn.disabled = false;
            DOM.wakeBtn.querySelector('.btn-spinner').style.display = 'none';
            DOM.wakeBtn.innerHTML = '🚀 Wake Backend';
        }, 2000);
    }
}

// ========== MESSAGE SENDING ==========
async function sendMessage() {
    const text = DOM.messageInput.value.trim();
    if (!text || STATE.isTyping) return;
    
    // Disable send button
    DOM.sendBtn.disabled = true;
    DOM.sendBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i>';
    
    // Add user message
    addMessage(text, 'user');
    DOM.messageInput.value = '';
    DOM.messageInput.style.height = 'auto';
    
    // Show typing
    showTyping();
    
    const startTime = Date.now();
    
    try {
        let response;
        
        if (STATE.isBackendAlive) {
            // Try real backend
            response = await sendChat(text);
            
            if (!response.success) {
                // Fallback to demo
                STATE.isBackendAlive = false;
                STATE.isDemoMode = true;
                updateStatus('demo');
                response = {
                    success: true,
                    text: getDemoResponse(text),
                    source: 'demo'
                };
            }
        } else {
            // Direct demo
            response = {
                success: true,
                text: getDemoResponse(text),
                source: 'demo'
            };
        }
        
        // Simulate typing delay
        const elapsed = Date.now() - startTime;
        const minDelay = response.source === 'demo' ? 1000 : 500;
        const extraDelay = Math.max(0, minDelay - elapsed);
        
        if (extraDelay > 0) {
            await new Promise(resolve => setTimeout(resolve, extraDelay));
        }
        
        // Add AI response
        hideTyping();
        addMessage(response.text, 'ai', response.source === 'demo');
        
        // Update response time
        const totalTime = elapsed + extraDelay;
        STATE.stats.avgResponseTime = 
            (STATE.stats.avgResponseTime * (STATE.stats.total - 1) + totalTime) / STATE.stats.total;
        
        // Background health check
        if (response.source === 'demo') {
            setTimeout(async () => {
                const isAlive = await checkHealth();
                if (isAlive) {
                    addMessage('🎉 Backend woke up! Next response will be live.', 'system');
                }
            }, 3000);
        }
        
    } catch (error) {
        console.error('Send error:', error);
        hideTyping();
        addMessage('Error sending message. Please try again.', 'system');
    } finally {
        // Re-enable send button
        DOM.sendBtn.disabled = false;
        DOM.sendBtn.innerHTML = '<i class="fas fa-paper-plane"></i>';
        DOM.messageInput.focus();
    }
}

// ========== STATS ==========
function updateStats() {
    // Could update stats display if needed
    console.log('Stats:', STATE.stats);
}

// ========== EVENT LISTENERS ==========
function setupEvents() {
    // Auto-resize textarea
    DOM.messageInput.addEventListener('input', function() {
        this.style.height = 'auto';
        this.style.height = Math.min(this.scrollHeight, 120) + 'px';
    });
    
    // Send message
    DOM.sendBtn.addEventListener('click', sendMessage);
    
    // Enter to send
    DOM.messageInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    });
    
    // Wake buttons
    DOM.wakeBtn.addEventListener('click', wakeBackend);
    DOM.wakeBigBtn.addEventListener('click', wakeBackend);
    
    // Clear chat
    DOM.clearBtn.addEventListener('click', () => {
        if (confirm('Clear all messages?')) {
            DOM.messagesContainer.innerHTML = '';
            DOM.welcomeSection.classList.add('active');
            STATE.messages = [];
            STATE.stats = { total: 0, backend: 0, demo: 0, avgResponseTime: 0 };
            addMessage('Chat cleared. Start a new conversation!', 'system');
        }
    });
    
    // Theme toggle
    DOM.themeBtn.addEventListener('click', () => {
        document.body.classList.toggle('light-theme');
        DOM.themeBtn.innerHTML = document.body.classList.contains('light-theme') 
            ? '<i class="fas fa-moon"></i>' 
            : '<i class="fas fa-sun"></i>';
    });
    
    // Info modal
    DOM.infoBtn.addEventListener('click', () => {
        DOM.infoModal.classList.add('active');
    });
    
    DOM.closeModal.addEventListener('click', () => {
        DOM.infoModal.classList.remove('active');
    });
    
    DOM.viewSource.addEventListener('click', () => {
        window.open('https://github.com/zahid397/arcmind-frontend', '_blank');
    });
    
    // Click outside modal to close
    window.addEventListener('click', (e) => {
        if (e.target === DOM.infoModal) {
            DOM.infoModal.classList.remove('active');
        }
    });
    
    // Prompt buttons
    DOM.promptBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            const prompt = btn.getAttribute('data-prompt');
            DOM.messageInput.value = prompt;
            DOM.messageInput.focus();
            DOM.messageInput.style.height = 'auto';
            DOM.messageInput.style.height = Math.min(DOM.messageInput.scrollHeight, 120) + 'px';
        });
    });
    
    // Tech card hover effects
    document.querySelectorAll('.tech-card').forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-10px)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
    });
}

// ========== INITIALIZATION ==========
async function initApp() {
    initDOM();
    setupEvents();
    
    // Initial health check
    const isAlive = await checkHealth();
    
    if (isAlive) {
        addMessage('✅ Backend is connected and ready!', 'system');
    } else {
        addMessage('🔋 Backend is sleeping (Render free tier). Use demo mode or wake it up!', 'system');
    }
    
    // Periodic health checks
    setInterval(async () => {
        if (!STATE.isBackendAlive) {
            await checkHealth();
        }
    }, 120000); // Every 2 minutes
    
    console.log('🚀 ArcMind AI initialized');
}

// ========== START APP ==========
document.addEventListener('DOMContentLoaded', () => {
    setTimeout(initApp, 100);
});
