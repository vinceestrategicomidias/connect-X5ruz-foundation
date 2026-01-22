import { useState } from "react";
import { MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ChatInternoPanel } from "./ChatInternoEquipe";
import { cn } from "@/lib/utils";

interface ChatInternoButtonProps {
  className?: string;
}

export const ChatInternoButton = ({ className }: ChatInternoButtonProps) => {
  const [open, setOpen] = useState(false);
  
  // Simular contagem de não lidas
  const naoLidas = 3;

  return (
    <>
      <Button
        variant="outline"
        size="icon"
        className={cn(
          "fixed bottom-6 right-6 h-12 w-12 rounded-full shadow-lg z-40",
          "bg-muted/80 hover:bg-muted border-border/50",
          "transition-all duration-200 hover:scale-105",
          className
        )}
        onClick={() => setOpen(true)}
      >
        <MessageCircle className="h-5 w-5 text-muted-foreground" />
        {naoLidas > 0 && (
          <Badge 
            className={cn(
              "absolute -top-1 -right-1 h-5 min-w-5 px-1.5",
              "text-[10px] font-semibold bg-destructive text-destructive-foreground",
              "animate-pulse"
            )}
          >
            {naoLidas > 9 ? "9+" : naoLidas}
          </Badge>
        )}
      </Button>

      <ChatInternoPanel open={open} onOpenChange={setOpen} />
    </>
  );
};
