import { useCallback, useEffect, useRef } from 'react';
import { useChatStore } from '@/store/chatStore';
import { ChatMessage } from '@/types';
import axiosClient from '@/lib/axiosClient';

interface WebSocketMessage {
  type: string;
  content?: string;
  data?: unknown;
  intent?: string;
}

export const useChat = () => {
  const store = useChatStore();
  const wsRef = useRef<WebSocket | null>(null);
  const reconnectAttemptsRef = useRef<number>(0);
  const maxReconnectAttemptsRef = useRef<number>(5);
  const reconnectTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const isConnectingRef = useRef<boolean>(false);

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      // Prevent multiple simultaneous connection attempts
      if (isConnectingRef.current || wsRef.current?.readyState === WebSocket.OPEN) {
        return;
      }

      isConnectingRef.current = true;

      try {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
          console.log('WebSocket connected');
          reconnectAttemptsRef.current = 0;
          isConnectingRef.current = false;
          store.setError(null);
        };

        wsRef.current.onmessage = (event: MessageEvent<string>) => {
          try {
            const message: WebSocketMessage = JSON.parse(event.data);

            const chatMessage: ChatMessage = {
              id: Date.now().toString(),
              sender: 'bot',
              content: message.content || '',
              timestamp: new Date().toISOString(),
              metadata: {
                intent: message.intent,
                data: message.data,
              },
            };

            store.addMessage(chatMessage);
          } catch (error) {
            console.error('Error parsing WebSocket message:', error);
          }
        };

        wsRef.current.onerror = (error: Event) => {
          isConnectingRef.current = false;
          // Only log first error and every 5th attempt to reduce console spam
          if (reconnectAttemptsRef.current === 0 || reconnectAttemptsRef.current % 5 === 0) {
            console.error('WebSocket error: Failed to connect to chat service');
          }
        };

        wsRef.current.onclose = () => {
          isConnectingRef.current = false;

          if (reconnectAttemptsRef.current < maxReconnectAttemptsRef.current) {
            // Exponential backoff: 2^attempt * 1000ms (1s, 2s, 4s, 8s, 16s)
            const backoffDelay = Math.min(
              Math.pow(2, reconnectAttemptsRef.current) * 1000,
              30000 // Cap at 30 seconds
            );

            reconnectAttemptsRef.current += 1;

            if (reconnectAttemptsRef.current === 1) {
              store.setError('Chat service unavailable. Attempting to reconnect...');
            }

            reconnectTimeoutRef.current = setTimeout(connectWebSocket, backoffDelay);
          } else {
            store.setError('Chat service unavailable. Please refresh the page or try again later.');
          }
        };
      } catch (error) {
        isConnectingRef.current = false;
        if (reconnectAttemptsRef.current === 0) {
          console.error('Failed to initialize WebSocket connection');
        }
      }
    };

    connectWebSocket();

    return () => {
      isConnectingRef.current = false;
      if (reconnectTimeoutRef.current) {
        clearTimeout(reconnectTimeoutRef.current);
      }
      if (wsRef.current) {
        wsRef.current.close();
      }
    };
  }, [store]);

  // Send message function
  const sendMessage = useCallback(
    async (content: string) => {
      try {
        store.setError(null);
        store.setLoading(true);

        // Add user message to store
        const userMessage: ChatMessage = {
          id: Date.now().toString(),
          sender: 'user',
          content,
          timestamp: new Date().toISOString(),
        };
        store.addMessage(userMessage);

        // Send via WebSocket if connected
        if (wsRef.current && wsRef.current.readyState === WebSocket.OPEN) {
          wsRef.current.send(
            JSON.stringify({
              type: 'message',
              content,
              timestamp: new Date().toISOString(),
            })
          );
        } else {
          // Fallback to REST API
          const response = await axiosClient.post('/chat', { message: content });
          if (response.data.data) {
            const botMessage: ChatMessage = {
              id: (Date.now() + 1).toString(),
              sender: 'bot',
              content: response.data.data.reply || '',
              timestamp: new Date().toISOString(),
              metadata: {
                intent: response.data.data.intent,
                data: response.data.data.data,
              },
            };
            store.addMessage(botMessage);
          }
        }
      } catch (error) {
        const errorMessage = error instanceof Error ? error.message : 'Failed to send message';
        store.setError(errorMessage);
      } finally {
        store.setLoading(false);
      }
    },
    [store]
  );

  return {
    messages: store.messages,
    isLoading: store.isLoading,
    error: store.error,
    sendMessage,
    clearMessages: store.clearMessages,
  };
};
