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

  // Initialize WebSocket connection
  useEffect(() => {
    const connectWebSocket = () => {
      try {
        const wsUrl = process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001';
        wsRef.current = new WebSocket(wsUrl);

        wsRef.current.onopen = () => {
          console.log('WebSocket connected');
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
          console.error('WebSocket error event:', error);
          console.error('WebSocket readyState:', wsRef.current?.readyState);
          console.error('WebSocket URL:', wsRef.current?.url);
          store.setError('Failed to connect to chat service. Please check your connection.');
        };

        wsRef.current.onclose = () => {
          console.log('WebSocket disconnected');
          // Attempt to reconnect after 3 seconds
          setTimeout(connectWebSocket, 3000);
        };
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : String(error);
        console.error('Failed to initialize WebSocket connection:', errorMsg);
        console.log('WebSocket URL attempted:', process.env.NEXT_PUBLIC_WS_URL || 'ws://localhost:3001');
        store.setError('Chat service unavailable. Make sure the server is running.');
      }
    };

    connectWebSocket();

    return () => {
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
