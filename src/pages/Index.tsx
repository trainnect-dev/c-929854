import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import MessageList from '@/components/MessageList';
import { CourseState, CourseType } from '@/types/courseCreation';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

const INITIAL_MESSAGE: Message = {
  role: 'assistant',
  content: "Hello, I'm here to help you create or update technical course materials. Let's get started! Are you creating a New Outline, a New Full Course, or are you updating an existing course?"
};

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([INITIAL_MESSAGE]);
  const [isLoading, setIsLoading] = useState(false);
  const [courseState, setCourseState] = useState<CourseState>({});
  const [apiKey, setApiKey] = useState<string>('');
  const { toast } = useToast();

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
  };

  const handleCourseTypeResponse = (message: string) => {
    const courseType = message.trim() as CourseType;
    if (!['New Outline', 'New Full Course', 'Updating an existing course'].includes(courseType)) {
      return `Please choose one of the following options:
      - New Outline
      - New Full Course
      - Updating an existing course`;
    }

    setCourseState(prev => ({ ...prev, courseType }));
    
    if (courseType === 'Updating an existing course') {
      return "Please navigate to the 'course_output' folder to select and update your existing course.";
    }
    
    return `What is the topic of the ${courseType} you would like to create?`;
  };

  const handleCourseTopicResponse = (message: string) => {
    setCourseState(prev => ({ ...prev, courseTopic: message }));
    return `What is the target audience for this ${courseState.courseType}?`;
  };

  const handleCourseLevelResponse = (message: string) => {
    setCourseState(prev => ({ ...prev, courseLevel: message }));
    return `Great! I'll now start creating your ${courseState.courseType} about "${courseState.courseTopic}" for ${message} audience. Please confirm if you'd like to proceed.`;
  };

  const sendMessageToAnthropic = async (messages: Message[]) => {
    if (!apiKey) {
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
          'x-api-key': apiKey,
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
      
      if (!courseState.courseType) {
        responseContent = handleCourseTypeResponse(content);
      } else if (!courseState.courseTopic) {
        responseContent = handleCourseTopicResponse(content);
      } else if (!courseState.courseLevel) {
        responseContent = handleCourseLevelResponse(content);
      } else {
        // Use Claude API for subsequent messages
        const claudeResponse = await sendMessageToAnthropic(newMessages);
        responseContent = claudeResponse || "I apologize, but I couldn't process your request. Please try again.";
      }

      const assistantMessage: Message = {
        role: 'assistant',
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

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onApiKeyChange={handleApiKeyChange}
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <ChatHeader isSidebarOpen={isSidebarOpen} />
        
        <div className="flex h-full flex-col justify-between pt-[60px] pb-4">
          <MessageList messages={messages} />
          <div className="w-full max-w-3xl mx-auto px-4 py-2">
            <ChatInput onSend={handleSendMessage} isLoading={isLoading} />
          </div>
          <div className="text-xs text-center text-gray-500 py-2">
            ChatGPT can make mistakes. Check important info.
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;