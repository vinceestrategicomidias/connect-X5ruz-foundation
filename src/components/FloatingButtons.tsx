import { useState } from "react";
import { MessageSquare, MessagesSquare } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { RoteirosPanel } from "./RoteirosPanel";
import { ThaliPanel } from "./ThaliPanel";
import { ThaliAvatar } from "./ThaliAvatar";
import { ChatInternoPanel } from "./ChatInternoEquipe";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export const FloatingButtons = () => {
  const [roteirosOpen, setRoteirosOpen] = useState(false);
  const [thaliOpen, setThaliOpen] = useState(false);
  const [chatInternoOpen, setChatInternoOpen] = useState(false);
  
  // Simular contagem de não lidas
  const naoLidas = 3;

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col-reverse items-center gap-3 z-50">
        {/* Botão da IA Thalí (direita) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setThaliOpen(true)}
              className="w-14 h-14 rounded-full p-0 bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95 overflow-hidden"
              size="icon"
            >
              <ThaliAvatar size="lg" className="w-full h-full" />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Thalí — Assistente Inteligente</p>
          </TooltipContent>
        </Tooltip>

        {/* Botão de Roteiros (centro) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setRoteirosOpen(true)}
              className="w-12 h-12 rounded-full bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              size="icon"
            >
              <MessageSquare className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Roteiros de Atendimento</p>
          </TooltipContent>
        </Tooltip>

        {/* Botão Chat Interno (esquerda) */}
        <Tooltip>
          <TooltipTrigger asChild>
            <Button
              onClick={() => setChatInternoOpen(true)}
              variant="outline"
              className="relative w-12 h-12 rounded-full bg-muted/80 hover:bg-muted border-border/50 shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
              size="icon"
            >
              <MessagesSquare className="h-5 w-5 text-muted-foreground" />
              {naoLidas > 0 && (
                <Badge 
                  className="absolute -top-1 -right-1 h-5 min-w-5 px-1.5 text-[10px] font-semibold bg-destructive text-destructive-foreground"
                >
                  {naoLidas > 9 ? "9+" : naoLidas}
                </Badge>
              )}
            </Button>
          </TooltipTrigger>
          <TooltipContent>
            <p>Chat Interno da Equipe</p>
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Painéis */}
      <RoteirosPanel open={roteirosOpen} onClose={() => setRoteirosOpen(false)} />
      <ThaliPanel open={thaliOpen} onClose={() => setThaliOpen(false)} />
      <ChatInternoPanel open={chatInternoOpen} onOpenChange={setChatInternoOpen} />
    </>
  );
};
