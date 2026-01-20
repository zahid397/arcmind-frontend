const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

export async function sendMessageToAgent(content: string) {
  try {
    const response = await fetch(`${API_URL}/api/chat`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error('Network response was not ok');
    }

    const data = await response.json();
    // Backend returns { response, transaction, suggestions }
    // Mapping it to ensure frontend reads 'message' correctly if needed
    return {
        message: data.response, 
        transaction: data.transaction,
        suggestions: data.suggestions
    };
  } catch (error) {
    console.error('Error connecting to backend:', error);
    throw error;
  }
}
