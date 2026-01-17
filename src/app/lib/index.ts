/* ======================================================
   TYPES
====================================================== */

export interface APIResponse<T = any> {
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
}

/* ======================================================
   GATEWAY SERVICE
====================================================== */

export class GatewayService {
  private static instance: GatewayService | null = null;

  private baseURL: string;
  private headers: HeadersInit = {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  };

  private requests = new Map<string, AbortController>();

  private constructor(baseURL: string) {
    this.baseURL = baseURL.replace(/\/$/, '');
  }

  /* -------------------- SINGLETON -------------------- */

  static getInstance(baseURL?: string): GatewayService {
    if (!GatewayService.instance) {
      if (!baseURL) {
        throw new Error('GatewayService requires baseURL on first call');
      }
      GatewayService.instance = new GatewayService(baseURL);
    }
    return GatewayService.instance;
  }

  static destroy(): void {
    GatewayService.instance?.abortAll();
    GatewayService.instance = null;
  }

  /* -------------------- INTERNAL -------------------- */

  private generateId(): string {
    if (typeof crypto !== 'undefined' && crypto.randomUUID) {
      return crypto.randomUUID();
    }
    return `req_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
  }

  private async parse<T>(res: Response): Promise<APIResponse<T>> {
    const isJson = res.headers
      .get('content-type')
      ?.includes('application/json');

    if (!res.ok) {
      let msg = `${res.status} ${res.statusText}`;
      if (isJson) {
        try {
          const body = await res.json();
          msg = body?.error || body?.message || msg;
        } catch {}
      }
      return { success: false, error: msg };
    }

    if (!isJson) {
      return { success: false, error: 'Invalid response format' };
    }

    return { success: true, data: (await res.json()) as T };
  }

  private async request<T>(
    path: string,
    options: RequestOptions = {}
  ): Promise<APIResponse<T>> {
    const id = this.generateId();
    const controller = new AbortController();
    const timeout = options.timeout ?? 30000;

    const timer = setTimeout(() => controller.abort(), timeout);
    this.requests.set(id, controller);

    try {
      const res = await fetch(`${this.baseURL}${path}`, {
        ...options,
        headers: {
          ...this.headers,
          ...options.headers,
          'X-Request-ID': id,
        },
        signal: controller.signal,
      });

      return await this.parse<T>(res);
    } catch (err: any) {
      if (err?.name === 'AbortError') {
        return { success: false, error: 'Request timeout' };
      }
      return { success: false, error: 'Network error' };
    } finally {
      clearTimeout(timer);
      this.requests.delete(id);
    }
  }

  /* -------------------- CHAT -------------------- */

  chat(
    message: string,
    sessionId?: string,
    options?: RequestOptions
  ) {
    return this.request<ChatResponse>('/chat', {
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
    opts: StreamChatOptions = {}
  ): Promise<void> {
    const controller = new AbortController();
    const id = this.generateId();
    this.requests.set(id, controller);

    if (opts.signal) {
      opts.signal.addEventListener('abort', () => controller.abort(), {
        once: true,
      });
    }

    try {
      const res = await fetch(`${this.baseURL}/chat/stream`, {
        method: 'POST',
        headers: this.headers,
        body: JSON.stringify({
          message,
          sessionId: opts.sessionId,
          timestamp: new Date().toISOString(),
        }),
        signal: controller.signal,
      });

      if (!res.ok || !res.body) {
        throw new Error('Stream failed');
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

        lines.forEach(line => line.trim() && opts.onChunk?.(line.trim()));
      }

      opts.onComplete?.();
    } catch (err: any) {
      if (err?.name !== 'AbortError') {
        opts.onError?.(err);
      }
    } finally {
      this.requests.delete(id);
    }
  }

  /* -------------------- SESSIONS -------------------- */

  getSessions(options?: RequestOptions) {
    return this.request<ChatSession[]>('/sessions', options);
  }

  getSession(id: string, options?: RequestOptions) {
    return this.request<ChatSession>(`/sessions/${id}`, options);
  }

  createSession(title: string, options?: RequestOptions) {
    return this.request<ChatSession>('/sessions', {
      method: 'POST',
      body: JSON.stringify({ title }),
      ...options,
    });
  }

  deleteSession(id: string, options?: RequestOptions) {
    return this.request<void>(`/sessions/${id}`, {
      method: 'DELETE',
      ...options,
    });
  }

  /* -------------------- CONTROL -------------------- */

  abortAll(): void {
    this.requests.forEach(c => c.abort());
    this.requests.clear();
  }

  activeRequests(): number {
    return this.requests.size;
  }

  setHeader(key: string, value: string) {
    this.headers = { ...this.headers, [key]: value };
  }

  removeHeader(key: string) {
    const { [key]: _, ...rest } = this.headers;
    this.headers = rest;
  }
}

/* ======================================================
   EXPORTS
====================================================== */

export const createGatewayService = (baseURL: string) =>
  GatewayService.getInstance(baseURL);

export const gateway = GatewayService.getInstance(
  process.env.NEXT_PUBLIC_API_URL ||
    'https://arcmind-27ed.onrender.com'
);
