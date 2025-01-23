import { Volume2, ThumbsUp, ThumbsDown, Copy, RotateCcw, MoreHorizontal } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface MessageActionsProps {
  content: string;
}

const MessageActions = ({ content }: MessageActionsProps) => {
  const { toast } = useToast();

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(content);
      toast({
        title: "Copied!",
        description: "Message copied to clipboard",
      });
    } catch (err) {
      toast({
        title: "Failed to copy",
        description: "Please try again",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex items-center gap-2 text-gray-400">
      <button className="p-1 hover:text-white transition-colors">
        <Volume2 className="h-4 w-4" />
      </button>
      <button className="p-1 hover:text-white transition-colors">
        <ThumbsUp className="h-4 w-4" />
      </button>
      <button className="p-1 hover:text-white transition-colors">
        <ThumbsDown className="h-4 w-4" />
      </button>
      <button className="p-1 hover:text-white transition-colors" onClick={handleCopy}>
        <Copy className="h-4 w-4" />
      </button>
      <button className="p-1 hover:text-white transition-colors">
        <RotateCcw className="h-4 w-4" />
      </button>
      <button className="p-1 hover:text-white transition-colors">
        <MoreHorizontal className="h-4 w-4" />
      </button>
    </div>
  );
};

export default MessageActions;