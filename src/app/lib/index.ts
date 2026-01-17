class GatewayService {
  private baseURL: string;
  private static instance: GatewayService;
  private abortControllers: Map<string, AbortController> = new Map();

  constructor(baseURL: string) {
    this.baseURL = baseURL;
  }

  static getInstance(baseURL?: string): GatewayService {
    if (!GatewayService.instance) {
      if (!baseURL) {
        throw new Error('Base URL is required for GatewayService initialization');
      }
      GatewayService.instance = new GatewayService(baseURL);
    }
    return GatewayService.instance;
  }

  private getHeaders(): HeadersInit {
    return {
      'Content-Type': 'application/json',
      'Accept': 'application/json',
      'X-Request-ID': crypto.randomUUID(),
    };
  }

  private async handleResponse<T>(response: Response): Promise<APIResponse<T>> {
    if (!response.ok) {
      const error = await response.text();
      throw new Error(`HTTP ${response.status}: ${error}`);
    }

    const data = await response.json();
    return {
      data: data as T,
      success: true,
    };
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {},
    timeout: number = 30000
  ): Promise<APIResponse<T>> {
    const controller = new AbortController();
    const id = crypto.randomUUID();
    this.abortControllers.set(id, controller);

    const timeoutId = setTimeout(() => controller.abort(), timeout);

    try {
      const response = await fetch(`${this.baseURL}${endpoint}`, {
        ...options,
        headers: { ...this.getHeaders(), ...options.headers },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);
      return await this.handleResponse<T>(response);
    } catch (error) {
      clearTimeout(timeoutId);
      throw error;
    } finally {
      this.abortControllers.delete(id);
    }
  }

  async chat(message: string, sessionId?: string): Promise<APIResponse<ChatResponse>> {
    return this.request<ChatResponse>('/chat', {
      method: 'POST',
      body: JSON.stringify({ message, sessionId }),
    });
  }

  async streamChat(
    message: string,
    sessionId?: string,
    onChunk: (chunk: string) => void,
    onComplete: () => void
  ): Promise<void> {
    const controller = new AbortController();
    const response = await fetch(`${this.baseURL}/chat/stream`, {
      method: 'POST',
      headers: this.getHeaders(),
      body: JSON.stringify({ message, sessionId }),
      signal: controller.signal,
    });

    const reader = response.body?.getReader();
    const decoder = new TextDecoder();

    if (!reader) return;

    try {
      while (true) {
        const { done, value } = await reader.read();
        if (done) {
          onComplete();
          break;
        }

        const chunk = decoder.decode(value);
        onChunk(chunk);
      }
    } finally {
      reader.releaseLock();
    }
  }

  async getSessions(): Promise<APIResponse<ChatSession[]>> {
    return this.request<ChatSession[]>('/sessions');
  }

  async createSession(title: string): Promise<APIResponse<ChatSession>> {
    return this.request<ChatSession>('/sessions', {
      method: 'POST',
      body: JSON.stringify({ title }),
    });
  }

  async deleteSession(sessionId: string): Promise<APIResponse<void>> {
    return this.request<void>(`/sessions/${sessionId}`, {
      method: 'DELETE',
    });
  }

  abortRequest(id: string): void {
    const controller = this.abortControllers.get(id);
    if (controller) {
      controller.abort();
      this.abortControllers.delete(id);
    }
  }

  abortAll(): void {
    this.abortControllers.forEach(controller => controller.abort());
    this.abortControllers.clear();
  }
}

export const gateway = GatewayService.getInstance(process.env.NEXT_PUBLIC_API_URL || 'https://arcmind-27ed.onrender.com');
