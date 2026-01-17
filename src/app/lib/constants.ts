// ============================================
// CORE APPLICATION CONFIGURATION
// ============================================

export const APP_CONFIG = {
  NAME: 'ArcMind',
  VERSION: '1.0.0',
  BUILD: process.env.NEXT_PUBLIC_APP_BUILD || 'development',
  DESCRIPTION: 'Advanced AI Assistant with Blockchain Integration',
  REPOSITORY: 'https://github.com/zahid397/ArcMind',
  AUTHOR: 'zahid397',
  LICENSE: 'MIT',
  SUPPORT_EMAIL: 'support@arcmind.ai',
  WEBSITE: 'https://arcmind.ai',
  ENVIRONMENT: process.env.NODE_ENV || 'development',
} as const;

// ============================================
// API & SERVICE CONFIGURATION
// ============================================

export const API_CONFIG = {
  BASE_URL:
    process.env.NEXT_PUBLIC_API_URL ||
    'https://arcmind-27ed.onrender.com',
  TIMEOUT: 30000,
  RETRIES: 3,
  RETRY_DELAY: 1000,
  MAX_FILE_SIZE: 10 * 1024 * 1024,
  RATE_LIMIT: {
    WINDOW: 60,
    MAX_REQUESTS: 100,
  },
} as const;

// ============================================
// STATUS TYPES
// ============================================

export const MESSAGE_DELIVERY_STATUS = {
  SENDING: 'sending',
  SENT: 'sent',
  DELIVERED: 'delivered',
  READ: 'read',
  ERROR: 'error',
} as const;

export type MessageDeliveryStatus =
  typeof MESSAGE_DELIVERY_STATUS[keyof typeof MESSAGE_DELIVERY_STATUS];

export const MESSAGE_PROCESSING_STATUS = {
  QUEUED: 'queued',
  PROCESSING: 'processing',
  COMPLETED: 'completed',
  FAILED: 'failed',
} as const;

export type MessageProcessingStatus =
  typeof MESSAGE_PROCESSING_STATUS[keyof typeof MESSAGE_PROCESSING_STATUS];

export const TRANSACTION_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  FAILED: 'failed',
  CANCELLED: 'cancelled',
} as const;

export type TransactionStatus =
  typeof TRANSACTION_STATUS[keyof typeof TRANSACTION_STATUS];

// ============================================
// AI MODELS
// ============================================

export const AI_MODELS = {
  GPT_4: { id: 'gpt-4', provider: 'openai', display: 'GPT-4' },
  GPT_4_TURBO: {
    id: 'gpt-4-turbo-preview',
    provider: 'openai',
    display: 'GPT-4 Turbo',
  },
  GPT_3_5_TURBO: {
    id: 'gpt-3.5-turbo',
    provider: 'openai',
    display: 'GPT-3.5 Turbo',
  },

  CLAUDE_3_OPUS: {
    id: 'claude-3-opus-20240229',
    provider: 'anthropic',
    display: 'Claude 3 Opus',
  },
  CLAUDE_3_SONNET: {
    id: 'claude-3-sonnet-20240229',
    provider: 'anthropic',
    display: 'Claude 3 Sonnet',
  },
  CLAUDE_3_HAIKU: {
    id: 'claude-3-haiku-20240307',
    provider: 'anthropic',
    display: 'Claude 3 Haiku',
  },

  GEMINI_PRO: { id: 'gemini-pro', provider: 'google', display: 'Gemini Pro' },
  GEMINI_ULTRA: { id: 'gemini-ultra', provider: 'google', display: 'Gemini Ultra' },

  LLAMA_2_70B: {
    id: 'llama-2-70b-chat',
    provider: 'meta',
    display: 'Llama 2 70B',
  },
  LLAMA_3_70B: {
    id: 'llama-3-70b-instruct',
    provider: 'meta',
    display: 'Llama 3 70B',
  },

  MIXTRAL_8X7B: {
    id: 'mixtral-8x7b-instruct',
    provider: 'mistral',
    display: 'Mixtral 8x7B',
  },
} as const;

export type AIModelKey = keyof typeof AI_MODELS;
export type AIModel = typeof AI_MODELS[AIModelKey];
export type AIModelId = AIModel['id'];
export type AIProvider = AIModel['provider'];

// ============================================
// TOOLS
// ============================================

export const TOOLS = {
  CALCULATOR: { id: 'calculator', display: 'Calculator' },
  IMAGE_GENERATOR: { id: 'image_generator', display: 'Image Generator' },
  BLOCKCHAIN: { id: 'blockchain', display: 'Blockchain' },
  WEB_SEARCH: { id: 'web_search', display: 'Web Search' },
  CODE_EXECUTOR: { id: 'code_executor', display: 'Code Executor' },
  FILE_PROCESSOR: { id: 'file_processor', display: 'File Processor' },
  TRANSLATOR: { id: 'translator', display: 'Translator' },
  SUMMARIZER: { id: 'summarizer', display: 'Summarizer' },
} as const;

export type ToolKey = keyof typeof TOOLS;
export type Tool = typeof TOOLS[ToolKey];
export type ToolId = Tool['id'];

// ============================================
// UI CONFIG
// ============================================

export const UI_CONFIG = {
  BREAKPOINTS: {
    MOBILE: 640,
    TABLET: 768,
    LAPTOP: 1024,
    DESKTOP: 1280,
    WIDE: 1536,
  },
  Z_INDEX: {
    BACKGROUND: -1,
    BASE: 0,
    CONTENT: 10,
    HEADER: 100,
    SIDEBAR: 200,
    MODAL: 1000,
    TOAST: 2000,
    TOOLTIP: 3000,
  },
} as const;

// ============================================
// CHAT CONFIG
// ============================================

export const CHAT_CONFIG = {
  LIMITS: {
    MAX_MESSAGE_LENGTH: 4000,
    MAX_MESSAGES_PER_SESSION: 1000,
    MAX_SESSIONS: 50,
    MAX_ATTACHMENT_SIZE: 10 * 1024 * 1024,
    MAX_ATTACHMENTS_PER_MESSAGE: 5,
    RATE_LIMIT_PER_MINUTE: 60,
  },
} as const;

// ============================================
// USER & AUTH
// ============================================

export const USER_ROLES = {
  USER: 'user',
  ASSISTANT: 'assistant',
  SYSTEM: 'system',
  ADMIN: 'admin',
  MODERATOR: 'moderator',
} as const;

export type UserRole = typeof USER_ROLES[keyof typeof USER_ROLES];

// ============================================
// I18N (FIXED)
// ============================================

export const I18N_CONFIG = {
  DEFAULT_LANGUAGE: 'en',
  LANGUAGES: {
    EN: { code: 'en', name: 'English' },
    ES: { code: 'es', name: 'Spanish' },
    FR: { code: 'fr', name: 'French' },
    DE: { code: 'de', name: 'German' },
    JA: { code: 'ja', name: 'Japanese' },
    KO: { code: 'ko', name: 'Korean' },
    ZH: { code: 'zh', name: 'Chinese' },
    HI: { code: 'hi', name: 'Hindi' },
  },
} as const;

export type LanguageCode =
  typeof I18N_CONFIG.LANGUAGES[keyof typeof I18N_CONFIG.LANGUAGES]['code'];

// ============================================
// BLOCKCHAIN & CRYPTO (FIXED)
// ============================================

export const CRYPTO_CURRENCIES = {
  ETH: { symbol: 'ETH', decimals: 18 },
  BTC: { symbol: 'BTC', decimals: 8 },
  USDT: { symbol: 'USDT', decimals: 6 },
  USDC: { symbol: 'USDC', decimals: 6 },
  BNB: { symbol: 'BNB', decimals: 18 },
  MATIC: { symbol: 'MATIC', decimals: 18 },
} as const;

export type CryptoCurrency =
  typeof CRYPTO_CURRENCIES[keyof typeof CRYPTO_CURRENCIES]['symbol'];

// ============================================
// ROUTES (FUTURE SAFE)
// ============================================

export const ROUTES = {
  HOME: '/',
  CHAT: '/chat',
  HISTORY: '/history',
  SETTINGS: '/settings',
  PROFILE: '/profile',
  DOCS: '/docs',
  ADMIN: '/admin',
  LOGIN: '/login',
  SIGNUP: '/signup',
  PRICING: '/pricing',
} as const;

export type StaticRoute = typeof ROUTES[keyof typeof ROUTES];
export type Route = StaticRoute | `${string}/${string}`;
