import { useState } from "react";
import { MessageSquare, Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import { RoteirosPanel } from "./RoteirosPanel";
import { ThaliPanel } from "./ThaliPanel";

export const FloatingButtons = () => {
  const [roteirosOpen, setRoteirosOpen] = useState(false);
  const [thaliOpen, setThaliOpen] = useState(false);

  return (
    <>
      <div className="fixed bottom-6 right-6 flex flex-col gap-3 z-50">
        {/* Botão de Roteiros (superior) */}
        <Button
          onClick={() => setRoteirosOpen(true)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          size="icon"
        >
          <MessageSquare className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
        </Button>

        {/* Botão da IA Thalí (inferior) */}
        <Button
          onClick={() => setThaliOpen(true)}
          className="w-14 h-14 rounded-full bg-primary hover:bg-primary-hover shadow-lg hover:shadow-xl transition-all hover:scale-105 active:scale-95"
          size="icon"
        >
          <Sparkles className="h-5 w-5 text-primary-foreground" strokeWidth={2} />
        </Button>
      </div>

      {/* Painéis */}
      <RoteirosPanel open={roteirosOpen} onClose={() => setRoteirosOpen(false)} />
      <ThaliPanel open={thaliOpen} onClose={() => setThaliOpen(false)} />
    </>
  );
};
