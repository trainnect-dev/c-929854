import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

export const useChatMessages = (apiKey: string) => {
  const { toast } = useToast();

  const sendMessageToAnthropic = async (messages: Message[]) => {
    // First check localStorage for API key
    const storedApiKey = localStorage.getItem('anthropic_api_key');
    const effectiveApiKey = apiKey || storedApiKey;

    if (!effectiveApiKey) {
      toast({
        title: "API Key Required",
        description: "Please enter your Anthropic API key in the sidebar",
        variant: "destructive"
      });
      return null;
    }

    try {
      const response = await fetch('https://id-preview--d7723df7-8fdf-4999-9b9a-b505dd02eddc.functions.supabase.co/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          messages,
          apiKey: effectiveApiKey
        }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to get response from Claude');
      }

      const data = await response.json();
      return data.content;
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "Failed to communicate with Claude",
        variant: "destructive"
      });
      return null;
    }
  };

  return { sendMessageToAnthropic };
};