// ============================================
// TYPES
// ============================================

export interface APIResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
}

export interface ChatResponse {
  message: string;
  sessionId?: string;
  timestamp: string;
}

export interface ChatSession {
  id: string;
  title: string;
  createdAt: number;
  updatedAt: number;
  messageCount?: number;
  isActive?: boolean;
}

export interface StreamChatOptions {
  sessionId?: string;
  signal?: AbortSignal;
  onChunk?: (chunk: string) => void;
  onComplete?: () => void;
  onError?: (error: Error) => void;
}

export interface RequestOptions extends RequestInit {
  timeout?: number;
  signal?: AbortSignal;
}

// ============================================
// GATEWAY SERVICE
// ============================================

export class GatewayService {
  private static instance: GatewayService | null = null;

  private baseURL: string;
  private defaultHeaders: HeadersInit;
  private requestMap = new Map<string, AbortController>();

  private constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, '');
    this.defaultHeaders = {
      'Content-Type': 'application/json',
      Accept: 'application/json',
    };
  }

  // ------------------------------------------
  // SINGLETON
  // ------------------------------------------

  static getInstance(baseURL?: string): GatewayService {
    if (!GatewayService.instance) {
      if (!baseURL) {
        throw new Error('GatewayService requires baseURL on first initialization');
      }
      GatewayService.instance = new GatewayService(baseURL);
    }
    return GatewayService.instance;
  }

  static destroy(): void {
    GatewayService.instance?.abortAllRequests();
    GatewayService.instance = null;
  }

  // ------------------------------------------
  // INTERNAL HELPERS
  // ------------------------------------------

  private generateRequestId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `req_${Date.now()}_${Math.random().toString(36).slice(2)}`;
  }

  private async parseResponse<T>(response: Response): Promise<APIResponse<T>> {
    const isJson = response.headers
      .get('content-type')
      ?.includes('application/json');

    if (!response.ok) {
      let error = `${response.status} ${response.statusText}`;
      try {
        if (isJson) {
          const body = await response.json();
          error = body?.error || body?.message || error;
        }
      } catch {}
      throw new Error(error);
    }

    if (!isJson) {
      throw new Error('Expected JSON response');
    }

    return {
      success: true,
      data: (await response.json()) as T,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    const requestId = this.generateRequestId();
    const controller = new AbortController();

    const timeout = options.timeout ?? 30000;
    const timeoutId = setTimeout(() => controller.abort(), timeout);

    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort(), {
        once: true,
      });
    }

    this.requestMap.set(requestId, controller);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: {
          ...this.defaultHeaders,
          'X-Request-ID': requestId,
          ...options.headers,
        },
        signal: controller.signal,
      });

      return await this.parseResponse<T>(response);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        throw new Error('Request aborted');
      }
      if (err instanceof TypeError) {
        throw new Error('Network error');
      }
      throw err;
    } finally {
      clearTimeout(timeoutId);
      this.requestMap.delete(requestId);
    }
  }

  // ------------------------------------------
  // CHAT
  // ------------------------------------------

  chat(
    message: string,
    sessionId?: string,
    options?: RequestOptions
  ): Promise<APIResponse<ChatResponse>> {
    return this.request('/chat', {
      method: 'POST',
      body: JSON.stringify({
        message,
        sessionId,
        timestamp: new Date().toISOString(),
      }),
      ...options,
    });
  }

  async streamChat(
    message: string,
    options: StreamChatOptions = {}
  ): Promise<void> {
    const controller = new AbortController();
    const requestId = this.generateRequestId();

    if (options.signal) {
      options.signal.addEventListener('abort', () => controller.abort(), {
        once: true,
      });
    }

    this.requestMap.set(requestId, controller);

    try {
      const res = await fetch(`${this.baseURL}/chat/stream`, {
        method: 'POST',
        headers: this.defaultHeaders,
        body: JSON.stringify({
          message,
          sessionId: options.sessionId,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error('Streaming failed');
      }

      const reader = res.body.getReader();
      const decoder = new TextDecoder();

      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop() || '';

        for (const line of lines) {
          if (line.trim()) {
            options.onChunk?.(line.trim());
          }
        }
      }

      options.onComplete?.();
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        options.onError?.(err);
        throw err;
      }
    } finally {
      this.requestMap.delete(requestId);
    }
  }

  // ------------------------------------------
  // SESSIONS
  // ------------------------------------------

  getSessions(options?: RequestOptions) {
    return this.request<ChatSession[]>('/sessions', options);
  }

  getSession(sessionId: string, options?: RequestOptions) {
    return this.request<ChatSession>(`/sessions/${sessionId}`, options);
  }

  createSession(title: string, options?: RequestOptions) {
    return this.request<ChatSession>('/sessions', {
      method: 'POST',
      body: JSON.stringify({ title }),
      ...options,
    });
  }

  deleteSession(sessionId: string, options?: RequestOptions) {
    return this.request<void>(`/sessions/${sessionId}`, {
      method: 'DELETE',
      ...options,
    });
  }

  // ------------------------------------------
  // REQUEST CONTROL
  // ------------------------------------------

  abortAllRequests(): void {
    this.requestMap.forEach(c => c.abort());
    this.requestMap.clear();
  }

  getActiveRequestCount(): number {
    return this.requestMap.size;
  }

  setBaseURL(url: string): void {
    this.baseURL = url.replace(/\/$/, '');
  }

  setHeader(key: string, value: string): void {
    this.defaultHeaders = { ...this.defaultHeaders, [key]: value };
  }

  removeHeader(key: string): void {
    const { [key]: _, ...rest } = this.defaultHeaders;
    this.defaultHeaders = rest;
  }
}

// ============================================
// EXPORTS
// ============================================

export const createGatewayService = (baseURL: string) =>
  GatewayService.getInstance(baseURL);

export const gateway = GatewayService.getInstance(
  process.env.NEXT_PUBLIC_API_URL ||
    'https://arcmind-27ed.onrender.com'
);
