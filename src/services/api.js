// src/services/api.js

const DEFAULT_BASE = 'https://arcmind-27ed.onrender.com';
const BASE = import.meta.env.VITE_BACKEND_URL || DEFAULT_BASE;

// Timeout utility with AbortController
function createTimeout(ms) {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), ms);
    return { controller, clear: () => clearTimeout(timeoutId) };
}

// Health check (3s timeout)
export async function checkHealth(timeoutMs = 3000) {
    const { controller, clear } = createTimeout(timeoutMs);
    
    try {
        const response = await fetch(`${BASE}/health`, {
            signal: controller.signal,
            headers: { 'Cache-Control': 'no-cache' }
        });
        return response.ok;
    } catch (error) {
        console.log('Backend health check failed:', error.message);
        return false;
    } finally {
        clear();
    }
}

// Chat request with retry logic
export async function sendChat(message, timeoutMs = 8000, maxRetries = 2) {
    let lastError;
    
    for (let attempt = 1; attempt <= maxRetries; attempt++) {
        const { controller, clear } = createTimeout(timeoutMs);
        
        try {
            console.log(`API attempt ${attempt}/${maxRetries}`);
            
            const response = await fetch(`${BASE}/chat`, {
                method: 'POST',
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                signal: controller.signal,
                body: JSON.stringify({ 
                    message,
                    timestamp: new Date().toISOString()
                })
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}`);
            }

            const data = await response.json();
            clear();
            return { 
                success: true, 
                data: data.response || data.message || 'No response text',
                source: 'backend'
            };
            
        } catch (error) {
            lastError = error;
            clear();
            
            // Short delay before retry (exponential backoff simplified)
            if (attempt < maxRetries) {
                await new Promise(resolve => setTimeout(resolve, 500 * attempt));
            }
        }
    }
    
    // All retries failed
    return { 
        success: false, 
        error: lastError?.message || 'Network/timeout error',
        source: 'failed'
    };
}

// Demo response generator (for offline mode)
export function generateDemoResponse(userMessage) {
    const responses = [
        `I received your message: "${userMessage.substring(0, 50)}...". Currently in demo mode while backend wakes up.`,
        `Demo response: I'd normally process "${userMessage.substring(0, 40)}..." with AI. Backend is starting...`,
        `Thanks for your message! The backend server is waking up (Render free tier). Try again in 10-15 seconds.`,
        `🔌 Backend is booting... Here's a demo response. Real AI response will work once server is active.`,
        `In live mode, I'd analyze: "${userMessage.substring(0, 30)}..." For now, this is a placeholder response.`
    ];
    
    // Add typing delay simulation
    const response = responses[Math.floor(Math.random() * responses.length)];
    const words = response.split(' ').length;
    const typingTime = Math.min(1500, words * 80); // Max 1.5s
    
    return {
        success: true,
        data: response,
        source: 'demo',
        simulatedDelay: typingTime
    };
}

// Check if we should use demo mode
export function getServiceMode(isBackendAlive) {
    return {
        isOnline: isBackendAlive,
        mode: isBackendAlive ? 'live' : 'demo',
        message: isBackendAlive 
            ? '✅ Backend connected' 
            : '🔋 Backend sleeping (demo mode)'
    };
}
