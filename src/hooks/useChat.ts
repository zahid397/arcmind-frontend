import { useState } from 'react';

export const useChat = () => {
  // Mock Hook to prevent errors
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  const sendMessage = async (content: string) => {
    console.log("Mock message sent:", content);
    // No backend call here
  };

  return { messages, loading, sendMessage };
}
