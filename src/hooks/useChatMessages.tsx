import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Anthropic from '@ai-sdk/anthropic';

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
      const anthropic = new Anthropic({
        apiKey: effectiveApiKey,
      });

      const response = await anthropic.messages.create({
        model: 'claude-3-5-sonnet-20241022',
        messages: messages.map(msg => ({
          role: msg.role,
          content: msg.content
        })),
        max_tokens: 2500,
      });

      return response.content[0].text;
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