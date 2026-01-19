// src/types/index.ts
export type Message = {
    id: string;
    role: 'user' | 'ai';
    content: string;
    timestamp: Date;
  };
  
export type AgentResponse = {
    status: string;
    message: string;
    timestamp: number;
};
