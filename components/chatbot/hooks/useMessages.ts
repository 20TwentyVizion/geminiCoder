import { useState } from 'react';
import { Message } from '../types';

export const useMessages = () => {
  const [messages, setMessages] = useState<Message[]>([]);

  const addMessage = (message: Message) => {
    setMessages((prev) => [...prev, message]);
  };

  const clearMessages = () => {
    setMessages([]);
  };

  return {
    messages,
    addMessage,
    clearMessages,
  };
};
