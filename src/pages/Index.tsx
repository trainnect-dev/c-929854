import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatInput from '@/components/ChatInput';
import ActionButtons from '@/components/ActionButtons';
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
  const { toast } = useToast();

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

  const getNextResponse = (userMessage: string): string => {
    if (!courseState.courseType) {
      return handleCourseTypeResponse(userMessage);
    }
    if (courseState.courseType === 'Updating an existing course') {
      return "Please navigate to the 'course_output' folder to select and update your existing course.";
    }
    if (!courseState.courseTopic) {
      return handleCourseTopicResponse(userMessage);
    }
    if (!courseState.courseLevel) {
      return handleCourseLevelResponse(userMessage);
    }
    return "I'll start generating the course content now. Would you like to proceed?";
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
      const newMessages = [
        ...messages,
        { role: 'user', content } as const
      ];
      
      setMessages(newMessages);

      // Get the next response based on the conversation state
      const responseContent = getNextResponse(content);

      const assistantMessage: Message = {
        role: 'assistant',
        content: responseContent
      };

      setMessages([...newMessages, assistantMessage]);
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
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
        onApiKeyChange={() => {}}
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