// src/services/api.ts
import { AgentResponse } from '@/types';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export const sendMessageToAgent = async (prompt: string): Promise<AgentResponse> => {
  if (!API_URL) throw new Error('API URL not configured');

  const response = await fetch(`${API_URL}/agent/command`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ prompt }),
  });

  if (!response.ok) {
    throw new Error('Network response was not ok');
  }

  return response.json();
};
