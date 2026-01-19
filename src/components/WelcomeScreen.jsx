// src/components/WelcomeScreen.jsx
import React from 'react';
import './WelcomeScreen.css';

const WelcomeScreen = ({ onQuickStart, onWakeBackend, isWaking, isDemoMode }) => {
    const quickPrompts = [
        { icon: '💡', text: 'Explain quantum computing basics', prompt: 'Explain quantum computing in simple terms' },
        { icon: '🐍', text: 'Write a Python function', prompt: 'Write a Python function to calculate factorial' },
        { icon: '📊', text: 'Analyze market trends', prompt: 'What are the current AI market trends?' },
        { icon: '🚀', text: 'Startup advice', prompt: 'Give me startup advice for a SaaS product' }
    ];

    return (
        <div className="welcome-screen">
            <div className="welcome-content">
                <div className="welcome-icon">
                    {isDemoMode ? '🔋' : '🤖'}
                </div>
                
                <h1>ArcMind AI Assistant</h1>
                <p className="welcome-subtitle">
                    {isDemoMode 
                        ? 'Backend is sleeping (Render free tier). Chat in demo mode or wake it up!'
                        : 'Your intelligent assistant for coding, analysis & creative thinking'}
                </p>
                
                {isDemoMode && (
                    <div className="demo-notice">
                        <div className="demo-alert">
                            ⚡ <strong>Hackathon Demo Mode Active</strong>
                            <p>Backend takes 30-50s to wake up. First response may be slow.</p>
                        </div>
                        
                        <button 
                            className="wake-backend-large"
                            onClick={onWakeBackend}
                            disabled={isWaking}
                        >
                            {isWaking ? (
                                <>
                                    <span className="spinner"></span>
                                    Waking Backend Server...
                                </>
                            ) : (
                                '🚀 Click to Wake Backend Now'
                            )}
                        </button>
                        
                        <p className="demo-tip">
                            <small>Pro tip: Wake backend at demo start, then use smoothly!</small>
                        </p>
                    </div>
                )}
                
                <div className="quick-start-section">
                    <h3>Try asking:</h3>
                    <div className="quick-options">
                        {quickPrompts.map((item, index) => (
                            <button
                                key={index}
                                className="quick-option"
                                onClick={() => onQuickStart(item.prompt)}
                            >
                                <span className="quick-icon">{item.icon}</span>
                                <span className="quick-text">{item.text}</span>
                            </button>
                        ))}
                    </div>
                </div>
                
                <div className="welcome-footer">
                    <div className="info-tip">
                        <span>💡</span>
                        <p>
                            {isDemoMode
                                ? 'Real AI responses available once backend wakes up'
                                : 'Ask anything! Code, writing, analysis, planning, etc.'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default WelcomeScreen;
