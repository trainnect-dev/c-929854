import { Settings, X, MessageSquarePlus } from 'lucide-react';
import { Button } from './ui/button';
import { useToast } from '@/hooks/use-toast';

type Message = {
  role: 'user' | 'assistant';
  content: string;
};

interface SidebarProps {
  isOpen: boolean;
  onToggle: () => void;
  onApiKeyChange: (apiKey: string) => void;
  messages: Message[];
  onClearHistory: () => void;
}

const Sidebar = ({ isOpen, onToggle, onApiKeyChange, messages, onClearHistory }: SidebarProps) => {
  const { toast } = useToast();

  const handleApiKeyChange = (apiKey: string) => {
    if (apiKey.trim()) {
      onApiKeyChange(apiKey);
      localStorage.setItem('anthropic_api_key', apiKey);
      toast({
        title: "API Key Saved",
        description: "Your API key has been saved successfully",
      });
    }
  };

  // Get the stored API key to show in input if it exists
  const storedApiKey = localStorage.getItem('anthropic_api_key') || '';

  return (
    <div
      className={`fixed left-0 top-0 h-full w-64 bg-[#202123] transform transition-transform duration-300 ease-in-out ${
        isOpen ? 'translate-x-0' : '-translate-x-full'
      }`}
    >
      <div className="flex flex-col h-full">
        <div className="p-4 border-b border-gray-600">
          <div className="flex justify-between items-center mb-4">
            <Button 
              variant="outline" 
              className="w-full text-white hover:bg-gray-700 border-gray-600"
              onClick={onClearHistory}
            >
              <MessageSquarePlus className="mr-2 h-4 w-4" />
              New chat
            </Button>
          </div>
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-semibold">Settings</h2>
            <button onClick={onToggle} className="p-1 hover:bg-gray-700 rounded">
              <X className="h-5 w-5" />
            </button>
          </div>
        </div>

        <div className="p-4 flex-1 overflow-auto">
          <div className="mb-6">
            <label className="block text-sm font-medium mb-2">API Key</label>
            <input
              type="password"
              onChange={(e) => handleApiKeyChange(e.target.value)}
              placeholder="Enter your API key"
              defaultValue={storedApiKey}
              className="w-full px-3 py-2 bg-gray-700 rounded border border-gray-600 focus:outline-none focus:border-gray-400"
            />
            {storedApiKey && (
              <p className="text-xs text-green-500 mt-1">API key is set</p>
            )}
          </div>

          <div className="mb-6">
            <h3 className="text-sm font-medium mb-2">Chat History</h3>
            <div className="space-y-2 max-h-[400px] overflow-y-auto">
              {messages.map((message, index) => (
                <div
                  key={index}
                  className={`text-sm p-2 rounded ${
                    message.role === 'user' ? 'bg-gray-700' : 'bg-gray-800'
                  }`}
                >
                  <div className="font-medium mb-1">
                    {message.role === 'user' ? 'You' : 'Assistant'}
                  </div>
                  <div className="text-gray-300 line-clamp-2">{message.content}</div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="p-4 border-t border-gray-600">
          <Button variant="outline" className="w-full" onClick={onToggle}>
            <Settings className="mr-2 h-4 w-4" />
            Close Settings
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;