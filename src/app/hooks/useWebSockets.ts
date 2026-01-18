"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import {
  UseWebSocketOptions,
  UseWebSocketReturn,
} from "../types/websocket.types";

/**
 * Custom hook for managing WebSocket connections with automatic reconnection.
 */
export function useWebSocket({
  url,
  onMessage,
  onError,
  reconnectInterval = 5000,
  maxReconnectAttempts = 10,
}: UseWebSocketOptions): UseWebSocketReturn {
  const [isConnected, setIsConnected] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reconnectAttempts, setReconnectAttempts] = useState(0);
  const isLoadingRef = useRef(true);

  const wsRef = useRef<WebSocket | null>(null);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const shouldReconnectRef = useRef(true);
  const reconnectCountRef = useRef(0);
  const isMountedRef = useRef(true);
  const connectRef = useRef<() => void>(() => {});

  const onMessageRef = useRef(onMessage);
  const onErrorRef = useRef(onError);

  useEffect(() => {
    onMessageRef.current = onMessage;
    onErrorRef.current = onError;
  }, [onMessage, onError]);

  const clearReconnectTimeout = useCallback(() => {
    if (reconnectTimeoutRef.current) {
      clearTimeout(reconnectTimeoutRef.current);
      reconnectTimeoutRef.current = null;
    }
  }, []);

  const closeWebSocket = useCallback(() => {
    if (wsRef.current) {
      wsRef.current.onopen = null;
      wsRef.current.onmessage = null;
      wsRef.current.onerror = null;
      wsRef.current.onclose = null;

      if (
        wsRef.current.readyState === WebSocket.OPEN ||
        wsRef.current.readyState === WebSocket.CONNECTING
      ) {
        wsRef.current.close();
      }
      wsRef.current = null;
    }
  }, []);

  const disconnect = useCallback(() => {
    shouldReconnectRef.current = false;
    clearReconnectTimeout();
    closeWebSocket();
    setIsConnected(false);
    setError(null);
    reconnectCountRef.current = 0;
    setReconnectAttempts(0);
  }, [clearReconnectTimeout, closeWebSocket]);

  const connect = useCallback(() => {
    if (!isMountedRef.current) return;
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      return;
    }

    closeWebSocket();

    try {
      const ws = new WebSocket(url);
      wsRef.current = ws;

      ws.onopen = () => {
        if (!isMountedRef.current) {
          ws.close();
          return;
        }
        setIsConnected(true);
        setError(null);
        reconnectCountRef.current = 0;
        setReconnectAttempts(0);
      };

      ws.onmessage = (event) => {
        if (!isMountedRef.current) return;
        try {
          const data = JSON.parse(event?.data);
          onMessageRef.current?.(data);
        } catch (parseError) {
          console.error("[WebSocket] Error:", parseError);
        }
      };

      ws.onerror = (event) => {
        if (!isMountedRef.current) return;
        const errorMessage = "Connection error occurred";
        console.error("[WebSocket] Error:", errorMessage);
        setError(errorMessage);
        onErrorRef.current?.(event);
      };

      ws.onclose = (event) => {
        if (!isMountedRef.current) return;
        console.log("[WebSocket] Connection closed:", event.code, event.reason);
        setIsConnected(false);
        wsRef.current = null;

        if (!shouldReconnectRef.current) {
          console.log("[WebSocket] Reconnection disabled");
          return;
        }

        if (reconnectCountRef.current >= maxReconnectAttempts) {
          const msg = `Maximum reconnection attempts reached (${maxReconnectAttempts})`;
          console.error("[WebSocket]", msg);
          setError(msg);
          return;
        }

        console.log(
          `[WebSocket] Retrying connection in ${reconnectInterval}ms...`,
        );
        reconnectTimeoutRef.current = setTimeout(() => {
          if (!isMountedRef.current) return;
          reconnectCountRef.current += 1;
          setReconnectAttempts(reconnectCountRef.current);
          connectRef.current();
        }, reconnectInterval);
      };
    } catch (connectionError) {
      console.error("[WebSocket] Error creating connection:", connectionError);
      setError("Failed to establish WebSocket connection");
    } finally {
      isLoadingRef.current = false;
    }
  }, [url, reconnectInterval, maxReconnectAttempts, closeWebSocket]);

  useEffect(() => {
    connectRef.current = connect;
  }, [connect]);

  const sendMessage = useCallback((data: unknown): boolean => {
    if (wsRef.current?.readyState === WebSocket.OPEN) {
      wsRef.current.send(JSON.stringify(data));
      return true;
    }
    console.warn(
      "[WebSocket] No se puede enviar mensaje: conexión no establecida",
    );
    return false;
  }, []);

  useEffect(() => {
    isMountedRef.current = true;
    shouldReconnectRef.current = true;

    console.log("[WebSocket] Starting new connection for:", url);
    connectRef.current();

    return () => {
      console.log("[WebSocket] Cleaning up connection for:", url);
      isMountedRef.current = false;
      shouldReconnectRef.current = false;
      clearReconnectTimeout();
      closeWebSocket();
    };
  }, [url, connect, clearReconnectTimeout, closeWebSocket]);

  return {
    isConnected,
    isLoading: isLoadingRef.current,
    error,
    reconnectAttempts,
    disconnect,
    sendMessage,
  };
}
