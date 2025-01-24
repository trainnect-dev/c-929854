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
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': effectiveApiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-sonnet-20240229',
          messages: messages.map(msg => ({
            role: msg.role,
            content: msg.content
          })),
          max_tokens: 1024,
        }),
      });

      if (!response.ok) {
        throw new Error('Failed to get response from Claude');
      }

      const data = await response.json();
      return data.content[0].text;
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