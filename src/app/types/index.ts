// types/index.ts

/* =====================================================
   ENUMS
===================================================== */

export enum TransactionStatus {
  PENDING = 'pending',
  CONFIRMED = 'confirmed',
  FAILED = 'failed',
  EXPIRED = 'expired',
  CANCELLED = 'cancelled',
}

export enum MessageRole {
  USER = 'user',
  ASSISTANT = 'assistant',
  SYSTEM = 'system',
  TOOL = 'tool',
}

export enum MessageStatus {
  SENDING = 'sending',
  SENT = 'sent',
  DELIVERED = 'delivered',
  READ = 'read',
  ERROR = 'error',
  CANCELLED = 'cancelled',
}

export enum UserStatus {
  ONLINE = 'online',
  OFFLINE = 'offline',
  AWAY = 'away',
  BUSY = 'busy',
  DO_NOT_DISTURB = 'do_not_disturb',
}

export enum SessionStatus {
  ACTIVE = 'active',
  ARCHIVED = 'archived',
  DELETED = 'deleted',
}

/* =====================================================
   CORE MODELS
===================================================== */

export interface Transaction {
  id: string;
  amount: string;
  currency: string;
  tx_hash: string;
  explorer_url: string;
  status: TransactionStatus;
  timestamp: number;
  from_address?: string;
  to_address?: string;
  network?: string;
  gas_fee?: string;
  confirmations?: number;
  block_number?: number;
  metadata?: Record<string, unknown>;
}

export interface ToolCall {
  id: string;
  name: string;
  arguments: Record<string, unknown>;
  result?: unknown;
  error?: string;
  duration?: number;
}

export interface MessageContent {
  text: string;
  type?: 'text' | 'markdown' | 'code';
  language?: string;
}

export interface MessageAttachment {
  id: string;
  type: 'image' | 'file' | 'audio' | 'video';
  url: string;
  name: string;
  size?: number;
  mime_type?: string;
  thumbnail_url?: string;
  metadata?: Record<string, unknown>;
}

export interface Message {
  id: string;
  conversation_id: string;
  parent_message_id?: string;
  role: MessageRole;
  content: MessageContent;
  reasoning?: string;
  tool_calls?: ToolCall[];
  attachments?: MessageAttachment[];
  transaction?: Transaction;
  timestamp: number;
  created_at: number;
  updated_at: number;
  status: MessageStatus;
  error?: string;
  retry_count?: number;
  tokens?: {
    prompt: number;
    completion: number;
    total: number;
  };
  metadata?: Record<string, unknown>;
}

export interface SessionSettings {
  model: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  system_prompt?: string;
  tools_enabled?: boolean;
  streaming_enabled?: boolean;
}

export interface SessionStatistics {
  message_count: number;
  total_tokens: number;
  average_response_time: number;
  last_activity: number;
}

export interface ChatSession {
  id: string;
  user_id: string;
  title: string;
  description?: string;
  messages: Message[];
  model?: string;
  created_at: number;
  updated_at: number;
  last_message_at: number;
  status: SessionStatus;
  is_pinned: boolean;
  is_archived: boolean;
  tags?: string[];
  settings?: SessionSettings;
  statistics?: SessionStatistics;
  metadata?: Record<string, unknown>;
}

export interface UserPreferences {
  theme: 'light' | 'dark' | 'auto';
  language: string;
  timezone: string;
  notifications: {
    enabled: boolean;
    sound: boolean;
    desktop: boolean;
    email: boolean;
  };
  privacy: {
    typing_indicators: boolean;
    read_receipts: boolean;
    online_status: boolean;
  };
}

export interface User {
  id: string;
  email: string;
  name: string;
  username?: string;
  avatar?: string;
  status: UserStatus;
  last_seen?: number;
  created_at: number;
  updated_at: number;
  preferences?: UserPreferences;
  metadata?: Record<string, unknown>;
}

/* =====================================================
   API
===================================================== */

export interface PaginationMeta {
  total: number;
  page: number;
  limit: number;
  pages: number;
  has_next: boolean;
  has_prev: boolean;
}

export interface APIResponse<T = unknown> {
  success: boolean;
  status: number;
  data: T;
  message?: string;
  error?: string;
  metadata?: {
    timestamp: number;
    requestId: string;
    version: string;
    pagination?: PaginationMeta;
  };
}

export interface PaginatedResponse<T>
  extends APIResponse<T[]> {
  metadata: APIResponse['metadata'] & {
    pagination: PaginationMeta;
  };
}

/* =====================================================
   REQUEST / RESPONSE
===================================================== */

export interface ChatRequest {
  message: string;
  sessionId?: string;
  stream?: boolean;
  model?: string;
  temperature?: number;
  max_tokens?: number;
  top_p?: number;
  frequency_penalty?: number;
  presence_penalty?: number;
  system_prompt?: string;
  parent_message_id?: string;
  metadata?: Record<string, unknown>;
}

export interface ChatResponse {
  message: Message;
  session: ChatSession;
  latency: number;
  finish_reason?: 'stop' | 'length' | 'tool_calls' | 'error';
  usage?: {
    input_tokens: number;
    output_tokens: number;
    total_tokens: number;
    cost?: number;
  };
}

/* =====================================================
   TYPE GUARDS
===================================================== */

export const isTransaction = (v: unknown): v is Transaction =>
  typeof v === 'object' &&
  v !== null &&
  'tx_hash' in v &&
  Object.values(TransactionStatus).includes(
    (v as Transaction).status
  );

export const isMessage = (v: unknown): v is Message =>
  typeof v === 'object' &&
  v !== null &&
  'role' in v &&
  Object.values(MessageRole).includes(
    (v as Message).role
  );

export const isChatSession = (v: unknown): v is ChatSession =>
  typeof v === 'object' &&
  v !== null &&
  'messages' in v &&
  Array.isArray((v as ChatSession).messages);

/* =====================================================
   DTOs
===================================================== */

export type CreateMessageDTO =
  Omit<Message, 'id' | 'created_at' | 'updated_at'> & {
    id?: string;
  };

export type UpdateMessageDTO =
  Partial<Omit<Message, 'id' | 'conversation_id' | 'created_at'>>;

export type CreateSessionDTO =
  Omit<ChatSession, 'id' | 'created_at' | 'updated_at' | 'last_message_at'> & {
    id?: string;
  };

export type UpdateSessionDTO =
  Partial<Omit<ChatSession, 'id' | 'user_id' | 'messages' | 'created_at'>>;

/* =====================================================
   HELPERS
===================================================== */

export function createMessage(
  role: MessageRole,
  text: string,
  overrides: Partial<Message> = {}
): Message {
  const now = Date.now();
  return {
    id: overrides.id ?? `msg_${now}_${Math.random().toString(36).slice(2, 9)}`,
    conversation_id: overrides.conversation_id ?? '',
    role,
    content: { text, type: 'text' },
    timestamp: now,
    created_at: now,
    updated_at: now,
    status: MessageStatus.SENT,
    ...overrides,
  };
}

export function createSession(
  title: string,
  overrides: Partial<ChatSession> = {}
): ChatSession {
  const now = Date.now();
  return {
    id: overrides.id ?? `sess_${now}_${Math.random().toString(36).slice(2, 9)}`,
    user_id: overrides.user_id ?? '',
    title,
    messages: overrides.messages ?? [],
    created_at: now,
    updated_at: now,
    last_message_at: now,
    status: SessionStatus.ACTIVE,
    is_pinned: false,
    is_archived: false,
    ...overrides,
  };
}

/* =====================================================
   DEFAULTS
===================================================== */

export const DEFAULT_SESSION_SETTINGS: SessionSettings = {
  model: 'gpt-4',
  temperature: 0.7,
  max_tokens: 2000,
  top_p: 1,
  frequency_penalty: 0,
  presence_penalty: 0,
  system_prompt: 'You are a helpful assistant.',
  tools_enabled: true,
  streaming_enabled: true,
};
