export interface UseWebSocketOptions {
  url: string;
  onMessage: (data: unknown) => void;
  onError: (error: Event) => void;
  reconnectInterval?: number;
  maxReconnectAttempts?: number;
}

export interface UseWebSocketReturn {
  isConnected: boolean;
  error: string | null;
  reconnectAttempts: number;
  disconnect: () => void;
  sendMessage: (data: unknown) => boolean;
  isLoading: boolean;
}
