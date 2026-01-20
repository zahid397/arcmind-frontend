// আমরা এখন Next.js এর নিজস্ব API ব্যবহার করছি, তাই রিলেটিভ পাথ যথেষ্ট
const API_ENDPOINT = '/api/chat';

export interface AgentResponse {
  message: string;
  transaction?: {
    type: 'buy' | 'sell' | 'transfer';
    amount: number;
    asset: string;
    status: 'completed' | 'pending' | 'failed';
    hash: string;
  };
  suggestions?: string[];
}

export async function sendMessageToAgent(content: string): Promise<AgentResponse> {
  try {
    const response = await fetch(API_ENDPOINT, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      throw new Error(`Server Error: ${response.status}`);
    }

    const data = await response.json();

    // Backend (route.ts) returns { response, transaction }
    // আমরা এটাকে UI এর সুবিধামতো ম্যাপ করছি
    return {
        message: data.response, 
        transaction: data.transaction,
        suggestions: data.suggestions || [] // যদি সাজেশন না থাকে, খালি অ্যারে
    };
  } catch (error) {
    console.error('Error talking to ArcMind Core:', error);
    throw error;
  }
}
