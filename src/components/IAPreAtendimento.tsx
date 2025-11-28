import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Brain, UserCheck, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";

interface Analise {
  intencao_principal: string;
  nivel_urgencia: string;
  tipo_procedimento?: string;
  dados_extraidos?: any;
}

interface IAPreAtendimentoProps {
  conversaId: string;
  mensagemInicial: string;
}

export const IAPreAtendimento = ({ conversaId, mensagemInicial }: IAPreAtendimentoProps) => {
  const [analise, setAnalise] = useState<Analise | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    analisarMensagem();
  }, []);

  const analisarMensagem = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase.functions.invoke('ia-analisar-intencao', {
        body: {
          texto: mensagemInicial,
          conversa_id: conversaId,
        }
      });

      if (error) throw error;

      if (data?.analise) {
        setAnalise({
          intencao_principal: data.analise.intencao_principal,
          nivel_urgencia: data.analise.nivel_urgencia,
          tipo_procedimento: data.analise.tipo_procedimento,
          dados_extraidos: data.analise.dados_extraidos,
        });
      }
    } catch (error) {
      console.error('Erro ao analisar intenção:', error);
    } finally {
      setLoading(false);
    }
  };

  const getUrgenciaColor = (urgencia: string) => {
    switch (urgencia) {
      case 'critica':
        return 'destructive';
      case 'alta':
        return 'default';
      default:
        return 'secondary';
    }
  };

  if (loading) {
    return (
      <Card className="border-primary/20">
        <CardContent className="pt-6 flex items-center justify-center">
          <Brain className="h-5 w-5 animate-pulse text-primary mr-2" />
          <span className="text-sm">Thalí analisando mensagem...</span>
        </CardContent>
      </Card>
    );
  }

  if (!analise) return null;

  return (
    <Card className="border-primary/20 bg-primary/5">
      <CardHeader className="pb-3">
        <CardTitle className="text-base flex items-center gap-2">
          <Brain className="h-5 w-5 text-primary" />
          Análise da Thalí - Pré-atendimento
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Intenção Principal</p>
            <Badge variant="outline" className="text-xs">
              {analise.intencao_principal}
            </Badge>
          </div>

          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Urgência</p>
            <Badge variant={getUrgenciaColor(analise.nivel_urgencia)} className="text-xs">
              {analise.nivel_urgencia === 'critica' && <AlertCircle className="h-3 w-3 mr-1" />}
              {analise.nivel_urgencia}
            </Badge>
          </div>
        </div>

        {analise.tipo_procedimento && (
          <div className="space-y-1">
            <p className="text-xs font-medium text-muted-foreground">Procedimento</p>
            <p className="text-sm">{analise.tipo_procedimento}</p>
          </div>
        )}

        {analise.dados_extraidos && Object.keys(analise.dados_extraidos).some(k => analise.dados_extraidos[k]) && (
          <div className="space-y-2">
            <p className="text-xs font-medium text-muted-foreground">Dados Extraídos</p>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {analise.dados_extraidos.nome && (
                <div className="flex items-center gap-1">
                  <UserCheck className="h-3 w-3" />
                  <span>{analise.dados_extraidos.nome}</span>
                </div>
              )}
              {analise.dados_extraidos.telefone && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Tel:</span>
                  <span>{analise.dados_extraidos.telefone}</span>
                </div>
              )}
              {analise.dados_extraidos.cpf && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">CPF:</span>
                  <span>{analise.dados_extraidos.cpf}</span>
                </div>
              )}
              {analise.dados_extraidos.convenio && (
                <div className="flex items-center gap-1">
                  <span className="font-medium">Convênio:</span>
                  <span>{analise.dados_extraidos.convenio}</span>
                </div>
              )}
            </div>
          </div>
        )}

        <Button size="sm" variant="outline" className="w-full" onClick={analisarMensagem}>
          <Brain className="h-4 w-4 mr-2" />
          Reanalisar
        </Button>
      </CardContent>
    </Card>
  );
};
