import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Sparkles, Loader2 } from "lucide-react";
import { useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Sugestao {
  texto: string;
  tipo: string;
  confianca: number;
}

interface IASugestoesRespostasProps {
  conversaId: string;
  onUsarSugestao: (texto: string) => void;
}

export const IASugestoesRespostas = ({ conversaId, onUsarSugestao }: IASugestoesRespostasProps) => {
  const [sugestoes, setSugestoes] = useState<Sugestao[]>([]);
  const [loading, setLoading] = useState(false);

  const buscarSugestoes = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ia-sugerir-resposta', {
        body: { conversa_id: conversaId, contexto: 'Atendimento médico hospitalar' }
      });

      if (error) throw error;

      if (data?.sugestoes) {
        setSugestoes(data.sugestoes);
      }
    } catch (error) {
      console.error('Erro ao buscar sugestões:', error);
      toast.error('Erro ao buscar sugestões da Thalí');
    } finally {
      setLoading(false);
    }
  };

  const getTipoBadgeVariant = (tipo: string) => {
    switch (tipo) {
      case 'informativa':
        return 'default';
      case 'procedimento':
        return 'secondary';
      case 'empatica':
        return 'outline';
      default:
        return 'outline';
    }
  };

  return (
    <Card className="p-4 space-y-3">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Sparkles className="h-5 w-5 text-primary" />
          <h3 className="font-semibold">Sugestões da Thalí</h3>
        </div>
        <Button
          size="sm"
          variant="outline"
          onClick={buscarSugestoes}
          disabled={loading}
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              Analisando...
            </>
          ) : (
            <>
              <Sparkles className="h-4 w-4 mr-2" />
              Gerar Sugestões
            </>
          )}
        </Button>
      </div>

      {sugestoes.length > 0 && (
        <div className="space-y-2">
          {sugestoes.map((sugestao, index) => (
            <div key={index} className="p-3 border rounded-lg space-y-2 hover:bg-muted/50 transition-colors">
              <div className="flex items-center justify-between">
                <Badge variant={getTipoBadgeVariant(sugestao.tipo)} className="text-xs">
                  {sugestao.tipo}
                </Badge>
                <span className="text-xs text-muted-foreground">
                  {Math.round(sugestao.confianca * 100)}% confiança
                </span>
              </div>
              <p className="text-sm">{sugestao.texto}</p>
              <Button
                size="sm"
                variant="ghost"
                className="w-full"
                onClick={() => {
                  onUsarSugestao(sugestao.texto);
                  toast.success('Sugestão aplicada');
                }}
              >
                Usar esta resposta
              </Button>
            </div>
          ))}
        </div>
      )}

      {sugestoes.length === 0 && !loading && (
        <p className="text-sm text-center text-muted-foreground py-4">
          Clique em "Gerar Sugestões" para obter respostas da Thalí
        </p>
      )}
    </Card>
  );
};
