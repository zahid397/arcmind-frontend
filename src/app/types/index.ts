export interface Transaction {
  amount: string;
  currency: string;
  tx_hash: string;
  explorer_url: string;
  status: 'pending' | 'confirmed' | 'failed';
  timestamp: number;
}

export interface Message {
  id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  reasoning?: string;
  tool_used?: string;
  image_url?: string;
  transaction?: Transaction;
  timestamp: number;
  status?: 'sending' | 'sent' | 'delivered' | 'read' | 'error';
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  createdAt: number;
  updatedAt: number;
  isActive: boolean;
}

export interface User {
  id: string;
  name: string;
  avatar?: string;
  status: 'online' | 'offline' | 'away';
}

export interface GatewayConfig {
  baseURL: string;
  timeout: number;
  retries: number;
}

export interface APIResponse<T = any> {
  data: T;
  success: boolean;
  message?: string;
  error?: string;
}

export interface ChatRequest {
  message: string;
  sessionId?: string;
  stream?: boolean;
}

export interface ChatResponse {
  message: Message;
  sessionId: string;
  tokens: number;
  latency: number;
}
