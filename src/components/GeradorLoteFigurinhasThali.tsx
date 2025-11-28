import { useEffect, useState } from "react";
import { useGerarFigurinhaThali } from "@/hooks/useGerarFigurinhaThali";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Loader2, Check, AlertCircle } from "lucide-react";

interface FigurinhaConfig {
  nome: string;
  expressao: string;
  contexto: string;
}

const figurinhasIniciais: FigurinhaConfig[] = [
  {
    nome: "Thalí Feliz",
    expressao: "feliz",
    contexto: "expressão alegre e acolhedora, sorrindo com entusiasmo",
  },
  {
    nome: "Thalí Pensativa",
    expressao: "pensativa",
    contexto: "analisando dados, com expressão concentrada e reflexiva",
  },
  {
    nome: "Thalí Animada",
    expressao: "animada",
    contexto: "empolgada para ajudar, com energia positiva e vibrante",
  },
  {
    nome: "Thalí Atenta",
    expressao: "atenta",
    contexto: "prestando atenção aos detalhes, focada e profissional",
  },
  {
    nome: "Thalí Aprovação",
    expressao: "aprovação",
    contexto: "dando sinal positivo com polegar para cima, aprovando",
  },
];

export const GeradorLoteFigurinhasThali = () => {
  const [status, setStatus] = useState<Record<string, "pending" | "loading" | "success" | "error">>({});
  const [isGenerating, setIsGenerating] = useState(false);
  const { mutateAsync } = useGerarFigurinhaThali();

  const gerarTodasFigurinhas = async () => {
    setIsGenerating(true);
    
    // Inicializar status
    const initialStatus: Record<string, "pending" | "loading" | "success" | "error"> = {};
    figurinhasIniciais.forEach(fig => {
      initialStatus[fig.nome] = "pending";
    });
    setStatus(initialStatus);

    // Gerar cada figurinha sequencialmente
    for (const fig of figurinhasIniciais) {
      try {
        setStatus(prev => ({ ...prev, [fig.nome]: "loading" }));
        
        await mutateAsync({
          nome: fig.nome,
          expressao: fig.expressao,
          contexto: fig.contexto,
        });
        
        setStatus(prev => ({ ...prev, [fig.nome]: "success" }));
        
        // Aguardar 2 segundos entre cada geração para evitar rate limit
        await new Promise(resolve => setTimeout(resolve, 2000));
      } catch (error) {
        console.error(`Erro ao gerar ${fig.nome}:`, error);
        setStatus(prev => ({ ...prev, [fig.nome]: "error" }));
      }
    }
    
    setIsGenerating(false);
  };

  const getStatusIcon = (figurinhaStatus: "pending" | "loading" | "success" | "error") => {
    switch (figurinhaStatus) {
      case "loading":
        return <Loader2 className="h-4 w-4 animate-spin text-primary" />;
      case "success":
        return <Check className="h-4 w-4 text-green-500" />;
      case "error":
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      default:
        return <div className="h-4 w-4 rounded-full border-2 border-muted" />;
    }
  };

  return (
    <Card className="p-6">
      <div className="space-y-4">
        <div>
          <h3 className="text-lg font-semibold mb-2">Gerar Figurinhas Iniciais da Thalí</h3>
          <p className="text-sm text-muted-foreground mb-4">
            Clique no botão abaixo para gerar automaticamente as 5 figurinhas iniciais da Thalí com diferentes expressões.
          </p>
        </div>

        <Button
          onClick={gerarTodasFigurinhas}
          disabled={isGenerating}
          className="w-full"
        >
          {isGenerating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Gerando figurinhas...
            </>
          ) : (
            "Gerar 5 Figurinhas Iniciais"
          )}
        </Button>

        {Object.keys(status).length > 0 && (
          <div className="space-y-2 mt-4">
            {figurinhasIniciais.map((fig) => (
              <div
                key={fig.nome}
                className="flex items-center justify-between p-3 rounded-lg bg-muted/50"
              >
                <span className="text-sm font-medium">{fig.nome}</span>
                {getStatusIcon(status[fig.nome])}
              </div>
            ))}
          </div>
        )}

        {isGenerating && (
          <p className="text-xs text-muted-foreground text-center">
            Aguardando 2 segundos entre cada geração para evitar limites de taxa...
          </p>
        )}
      </div>
    </Card>
  );
};
