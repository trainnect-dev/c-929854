import { useState } from 'react';
import Sidebar from '@/components/Sidebar';
import ChatHeader from '@/components/ChatHeader';
import ChatContainer from '@/components/ChatContainer';
import { useChatState } from '@/hooks/useChatState';
import { useToast } from '@/hooks/use-toast';

const Index = () => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { messages, setMessages, apiKey, setApiKey } = useChatState();
  const { toast } = useToast();

  const handleApiKeyChange = (newApiKey: string) => {
    setApiKey(newApiKey);
    localStorage.setItem('anthropic_api_key', newApiKey);
  };

  const clearChatHistory = () => {
    setMessages([{
      role: 'assistant',
      content: "Hello, I'm here to help you create or update technical course materials. Let's get started! Are you creating a New Outline, a New Full Course, or are you updating an existing course?"
    }]);
    localStorage.removeItem('chat_history');
    localStorage.removeItem('course_state');
    toast({
      title: "Chat History Cleared",
      description: "Started a new chat session",
    });
    setIsSidebarOpen(false);
  };

  return (
    <div className="flex h-screen">
      <Sidebar 
        isOpen={isSidebarOpen} 
        onToggle={() => setIsSidebarOpen(!isSidebarOpen)}
        onApiKeyChange={handleApiKeyChange}
        messages={messages}
        onClearHistory={clearChatHistory}
      />
      
      <main className={`flex-1 transition-all duration-300 ${isSidebarOpen ? 'ml-64' : 'ml-0'}`}>
        <ChatHeader onSidebarToggle={() => setIsSidebarOpen(!isSidebarOpen)} isSidebarOpen={isSidebarOpen} />
        <ChatContainer />
      </main>
    </div>
  );
};

export default Index;