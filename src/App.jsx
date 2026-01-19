// src/App.jsx
import { useState, useEffect, useCallback } from 'react';
import { checkHealth, sendChat, generateDemoResponse, getServiceMode } from './services/api';
import Header from './components/Header';
import ChatContainer from './components/ChatContainer';
import InputArea from './components/InputArea';
import WelcomeScreen from './components/WelcomeScreen';
import StatusBanner from './components/StatusBanner';
import './App.css';

function App() {
    const [messages, setMessages] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [backendStatus, setBackendStatus] = useState({
        isAlive: null, // null = checking, true = alive, false = sleeping
        isChecking: false,
        lastChecked: null
    });
    const [serviceMode, setServiceMode] = useState(getServiceMode(null));

    // Health check on app start
    useEffect(() => {
        const initializeBackendCheck = async () => {
            console.log('🔍 Initial backend health check...');
            const isAlive = await checkHealth();
            
            setBackendStatus({
                isAlive,
                isChecking: false,
                lastChecked: new Date()
            });
            
            setServiceMode(getServiceMode(isAlive));
            
            if (!isAlive) {
                console.log('⚠️ Backend sleeping, enabling demo mode');
                // Add a welcome message about demo mode
                setMessages([{
                    id: 'welcome',
                    text: 'Welcome to ArcMind AI! Backend is currently waking up from sleep (Render free tier). You can still chat in demo mode.',
                    sender: 'system',
                    timestamp: new Date()
                }]);
            }
        };

        initializeBackendCheck();
        
        // Check every 2 minutes if in demo mode
        const interval = setInterval(async () => {
            if (!backendStatus.isAlive) {
                const isAlive = await checkHealth();
                if (isAlive) {
                    setBackendStatus(prev => ({ ...prev, isAlive: true }));
                    setServiceMode(getServiceMode(true));
                    console.log('✅ Backend woke up!');
                }
            }
        }, 120000); // 2 minutes

        return () => clearInterval(interval);
    }, []);

    // Manual backend wake-up
    const wakeBackend = useCallback(async () => {
        setBackendStatus(prev => ({ ...prev, isChecking: true }));
        
        // Try waking with multiple attempts
        let isAlive = false;
        for (let i = 0; i < 3; i++) {
            console.log(`Wake attempt ${i + 1}`);
            isAlive = await checkHealth();
            if (isAlive) break;
            await new Promise(resolve => setTimeout(resolve, 2000)); // Wait 2s between tries
        }
        
        setBackendStatus({
            isAlive,
            isChecking: false,
            lastChecked: new Date()
        });
        
        setServiceMode(getServiceMode(isAlive));
        
        if (isAlive) {
            // Add success message
            setMessages(prev => [...prev, {
                id: `wake-${Date.now()}`,
                text: '✅ Backend is now awake! All responses will be from live AI.',
                sender: 'system',
                timestamp: new Date()
            }]);
        }
    }, []);

    // Handle sending messages
    const handleSendMessage = async (text) => {
        if (!text.trim()) return;

        // Add user message immediately
        const userMessage = {
            id: `user-${Date.now()}`,
            text,
            sender: 'user',
            timestamp: new Date()
        };
        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        // Determine response strategy
        let response;
        
        if (backendStatus.isAlive) {
            // Try real backend first
            response = await sendChat(text);
            
            if (!response.success) {
                // Backend failed, fallback to demo
                console.log('Backend request failed, using demo response');
                response = generateDemoResponse(text);
                // Update status if backend seems dead
                setBackendStatus(prev => ({ ...prev, isAlive: false }));
                setServiceMode(getServiceMode(false));
            }
        } else {
            // Direct to demo mode
            response = generateDemoResponse(text);
        }

        // Simulate typing delay for demo responses
        if (response.source === 'demo' && response.simulatedDelay) {
            await new Promise(resolve => setTimeout(resolve, response.simulatedDelay));
        }

        // Add AI response
        const aiMessage = {
            id: `ai-${Date.now()}`,
            text: response.data,
            sender: 'ai',
            timestamp: new Date(),
            source: response.source,
            isDemo: response.source === 'demo'
        };
        
        setMessages(prev => [...prev, aiMessage]);
        setIsLoading(false);

        // If demo response was shown, try a background health check
        if (response.source === 'demo') {
            setTimeout(async () => {
                const isAlive = await checkHealth();
                if (isAlive) {
                    setBackendStatus(prev => ({ ...prev, isAlive: true }));
                    setServiceMode(getServiceMode(true));
                    // Optional: notify user backend is back
                }
            }, 3000);
        }
    };

    // Clear chat
    const handleClearChat = () => {
        setMessages([]);
    };

    return (
        <div className="app-container">
            {/* Status Banner - Always visible */}
            <StatusBanner 
                mode={serviceMode.mode}
                message={serviceMode.message}
                isChecking={backendStatus.isChecking}
                onWakeClick={wakeBackend}
                lastChecked={backendStatus.lastChecked}
            />

            <Header onClearChat={handleClearChat} />
            
            <main className="main-content">
                {messages.length === 0 ? (
                    <WelcomeScreen 
                        onQuickStart={handleSendMessage}
                        onWakeBackend={wakeBackend}
                        isWaking={backendStatus.isChecking}
                        isDemoMode={!backendStatus.isAlive}
                    />
                ) : (
                    <ChatContainer 
                        messages={messages}
                        isLoading={isLoading}
                    />
                )}
            </main>

            <InputArea 
                onSendMessage={handleSendMessage}
                isLoading={isLoading}
                isBackendAlive={backendStatus.isAlive}
            />
        </div>
    );
}

export default App;
