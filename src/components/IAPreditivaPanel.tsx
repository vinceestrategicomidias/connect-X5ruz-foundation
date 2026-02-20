import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { TrendingUp, RefreshCw, Clock, AlertTriangle, Lightbulb } from "lucide-react";
import { useIAPreditiva, useGerarPreditiva } from "@/hooks/useIAPreditiva";

export const IAPreditivaPanel = () => {
  const hoje = new Date().toISOString().split('T')[0];
  const { data: preditiva, isLoading } = useIAPreditiva(hoje);
  const gerarPreditiva = useGerarPreditiva();

  const getRiscoColor = (risco?: string) => {
    switch (risco) {
      case 'alto':
        return 'destructive';
      case 'medio':
        return 'default';
      default:
        return 'secondary';
    }
  };

  const handleGerar = () => {
    gerarPreditiva.mutate(undefined);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <p className="text-xs text-muted-foreground mt-1">
            Previsões e recomendações para hoje
          </p>
        </div>
        <Button size="sm" className="h-8 text-xs" onClick={handleGerar} disabled={gerarPreditiva.isPending || isLoading}>
          <RefreshCw className={`h-3.5 w-3.5 mr-1.5 ${gerarPreditiva.isPending ? 'animate-spin' : ''}`} />
          Gerar Nova Previsão
        </Button>
      </div>

      {preditiva ? (
        <>
          <div className="grid grid-cols-3 gap-3">
            <Card className="p-4 border-border/60">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Volume Esperado</p>
              <p className="text-xl font-bold text-primary">{preditiva.volume_esperado || 0}</p>
            </Card>

            <Card className="p-4 border-border/60">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Risco SLA</p>
              <Badge variant={getRiscoColor(preditiva.risco_sla)} className="text-[10px]">
                {preditiva.risco_sla || 'baixo'}
              </Badge>
            </Card>

            <Card className="p-4 border-border/60">
              <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">Horários de Pico</p>
              <p className="text-xl font-bold text-foreground">{preditiva.horarios_pico?.length || 0}</p>
            </Card>
          </div>

          {preditiva.horarios_pico && preditiva.horarios_pico.length > 0 && (
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Horários de Pico Previstos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {preditiva.horarios_pico.map((horario: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border/60 rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-3.5 w-3.5 text-muted-foreground" />
                        <span className="text-xs font-medium">{horario.inicio} - {horario.fim}</span>
                      </div>
                      <Badge variant={
                        horario.intensidade === 'alta' ? 'destructive' :
                        horario.intensidade === 'media' ? 'default' : 'secondary'
                      } className="text-[10px]">
                        {horario.intensidade}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {preditiva.setores_alta_demanda && preditiva.setores_alta_demanda.length > 0 && (
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm">Setores com Alta Demanda Prevista</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {preditiva.setores_alta_demanda.map((setor: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border border-border/60 rounded-lg">
                      <span className="text-xs font-medium">{setor.setor}</span>
                      <Badge variant="outline" className="text-[10px]">{setor.previsao_volume} atendimentos</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {preditiva.recomendacoes && preditiva.recomendacoes.length > 0 && (
            <Card className="border-border/60">
              <CardHeader className="pb-3">
                <CardTitle className="text-sm flex items-center gap-1.5">
                  <Lightbulb className="h-3.5 w-3.5 text-warning" />
                  Recomendações da Thalí
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {preditiva.recomendacoes.map((rec: string, index: number) => (
                    <div key={index} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/15 border border-border/30">
                      <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                        <span className="text-[9px] font-bold text-primary">{index + 1}</span>
                      </div>
                      <p className="text-xs text-foreground leading-relaxed">{rec}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {preditiva.acuracia_anterior && (
            <Card className="border-border/60">
              <CardContent className="pt-5 pb-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-medium">Acurácia da Previsão Anterior</span>
                  <Badge variant="secondary" className="text-[10px]">{preditiva.acuracia_anterior.toFixed(1)}%</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card className="border-border/60">
          <CardContent className="pt-6 text-center space-y-4">
            <TrendingUp className="h-10 w-10 mx-auto text-muted-foreground" />
            <div>
              <p className="text-sm font-medium">Nenhuma previsão disponível</p>
              <p className="text-xs text-muted-foreground">
                Clique em "Gerar Nova Previsão" para criar análise preditiva
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
