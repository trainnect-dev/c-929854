import { useState, useEffect } from 'react';
import { useToast } from '@/hooks/use-toast';
import { CourseState, CourseType } from '@/types/courseCreation';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hello, I'm here to help you create or update technical course materials. Let's get started! Are you creating a New Outline, a New Full Course, or are you updating an existing course?"
};

const STORAGE_KEY = 'chat_history';

export const useChatState = () => {
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [courseState, setCourseState] = useState<CourseState>({});
  const [apiKey, setApiKey] = useState<string>('');
  const { toast } = useToast();

  useEffect(() => {
    const savedMessages = localStorage.getItem(STORAGE_KEY);
    if (savedMessages) {
      setMessages(JSON.parse(savedMessages));
    }
  }, []);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(messages));
  }, [messages]);

  return {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    courseState,
    setCourseState,
    apiKey,
    setApiKey,
    toast
  };
};