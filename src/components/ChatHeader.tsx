import { Menu } from 'lucide-react';
import { Button } from './ui/button';

interface ChatHeaderProps {
  onSidebarToggle: () => void;
  isSidebarOpen: boolean;
}

const ChatHeader = ({ onSidebarToggle, isSidebarOpen }: ChatHeaderProps) => {
  return (
    <header className="fixed top-0 w-full bg-white border-b border-gray-200 z-10">
      <div className="flex items-center justify-between px-4 py-2">
        <Button variant="ghost" size="icon" onClick={onSidebarToggle}>
          <Menu className="h-5 w-5" />
        </Button>
        <h1 className="text-xl font-semibold">Course Creation Assistant</h1>
        <div className="w-10" /> {/* Spacer for alignment */}
      </div>
    </header>
  );
};

export default ChatHeader;