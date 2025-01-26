import { useState } from 'react';
import ChatInput from './ChatInput';
import MessageList from './MessageList';
import CourseButtons from './CourseButtons';
import { useChatState } from '@/hooks/useChatState';
import { CourseResponseHandler } from './CourseResponseHandler';
import { useChatMessages } from '@/hooks/useChatMessages';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hello, I'm here to help you create or update technical course materials. Let's get started! Are you creating a New Outline, a New Full Course, or are you updating an existing course?"
};

const ChatContainer = () => {
  const {
    messages,
    setMessages,
    isLoading,
    setIsLoading,
    courseState,
    setCourseState,
    apiKey,
    toast
  } = useChatState();

  const { sendMessageToAnthropic } = useChatMessages(apiKey);

  const handleSendMessage = async (content: string) => {
    if (!content.trim()) {
      toast({
        title: "Error",
        description: "Please enter a message",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const newUserMessage = { role: 'user' as const, content };
      const newMessages = [...messages, newUserMessage];
      setMessages(newMessages);

      let responseContent: string;
      
      const courseResponse = CourseResponseHandler({ 
        message: content, 
        courseState, 
        setCourseState 
      });

      if (courseResponse) {
        responseContent = courseResponse;
      } else {
        const claudeResponse = await sendMessageToAnthropic(newMessages);
        responseContent = claudeResponse || "I apologize, but I couldn't process your request. Please try again.";
      }

      const assistantMessage = {
        role: 'assistant' as const,
        content: responseContent
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error) {
      toast({
        title: "Error",
        description: error instanceof Error ? error.message : "An unexpected error occurred",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  const clearHistory = () => {
    setMessages([INITIAL_MESSAGE]);
    setCourseState({});
    toast({
      title: "Chat Cleared",
      description: "Started a new chat session",
    });
  };

  return (
    <div className="flex h-full flex-col justify-between pt-[60px] pb-4">
      <MessageList messages={messages} />
      <div className="w-full max-w-3xl mx-auto px-4">
        <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
        <CourseButtons onSendMessage={handleSendMessage} />
      </div>
      <div className="text-xs text-center text-gray-500 py-2">
        ClaudeGPT can make mistakes. Check important info.
      </div>
    </div>
  );
};

export default ChatContainer;