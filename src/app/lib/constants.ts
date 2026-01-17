export const APP_CONFIG = {
  NAME: 'ArcMind',
  VERSION: '1.0.0',
  DESCRIPTION: 'Advanced AI Assistant with Blockchain Integration',
  REPOSITORY: 'https://github.com/zahid397/ArcMind',
};

export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'https://arcmind-27ed.onrender.com',
  TIMEOUT: 30000,
  RETRIES: 3,
};

export const ANIMATION_DURATIONS = {
  FAST: 150,
  NORMAL: 300,
  SLOW: 500,
  VERY_SLOW: 1000,
};

export const MESSAGE_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  ERROR: 'error',
} as const;

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
} as const;

export const TOOL_NAMES = {
  CALCULATOR: 'calculator',
  IMAGE_GENERATOR: 'image_generator',
  BLOCKCHAIN: 'blockchain',
  WEB_SEARCH: 'web_search',
} as const;
