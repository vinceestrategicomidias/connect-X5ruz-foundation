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
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <TrendingUp className="h-6 w-6 text-primary" />
            Análise Preditiva
          </h2>
          <p className="text-muted-foreground mt-2">
            Previsões e recomendações para hoje
          </p>
        </div>
        <Button onClick={handleGerar} disabled={gerarPreditiva.isPending || isLoading}>
          <RefreshCw className={`h-4 w-4 mr-2 ${gerarPreditiva.isPending ? 'animate-spin' : ''}`} />
          Gerar Nova Previsão
        </Button>
      </div>

      {preditiva ? (
        <>
          <div className="grid grid-cols-3 gap-4">
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <TrendingUp className="h-5 w-5 text-blue-500" />
                  <div>
                    <div className="text-2xl font-bold">{preditiva.volume_esperado || 0}</div>
                    <div className="text-xs text-muted-foreground">Volume Esperado Hoje</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <AlertTriangle className="h-5 w-5 text-orange-500" />
                  <div>
                    <Badge variant={getRiscoColor(preditiva.risco_sla)}>
                      {preditiva.risco_sla || 'baixo'}
                    </Badge>
                    <div className="text-xs text-muted-foreground mt-1">Risco SLA</div>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center gap-2">
                  <Clock className="h-5 w-5 text-purple-500" />
                  <div>
                    <div className="text-2xl font-bold">
                      {preditiva.horarios_pico?.length || 0}
                    </div>
                    <div className="text-xs text-muted-foreground">Horários de Pico</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {preditiva.horarios_pico && preditiva.horarios_pico.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Horários de Pico Previstos</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {preditiva.horarios_pico.map((horario: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center gap-2">
                        <Clock className="h-4 w-4 text-muted-foreground" />
                        <span className="font-medium">{horario.inicio} - {horario.fim}</span>
                      </div>
                      <Badge variant={
                        horario.intensidade === 'alta' ? 'destructive' :
                        horario.intensidade === 'media' ? 'default' : 'secondary'
                      }>
                        {horario.intensidade}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {preditiva.setores_alta_demanda && preditiva.setores_alta_demanda.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle>Setores com Alta Demanda Prevista</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {preditiva.setores_alta_demanda.map((setor: any, index: number) => (
                    <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                      <span className="font-medium">{setor.setor}</span>
                      <Badge variant="outline">{setor.previsao_volume} atendimentos</Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {preditiva.recomendacoes && preditiva.recomendacoes.length > 0 && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Lightbulb className="h-5 w-5 text-yellow-500" />
                  Recomendações da IA
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {preditiva.recomendacoes.map((rec: string, index: number) => (
                    <li key={index} className="flex items-start gap-2 text-sm">
                      <span className="text-primary mt-1">•</span>
                      <span>{rec}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          )}

          {preditiva.acuracia_anterior && (
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium">Acurácia da Previsão Anterior</span>
                  <Badge variant="secondary">{preditiva.acuracia_anterior.toFixed(1)}%</Badge>
                </div>
              </CardContent>
            </Card>
          )}
        </>
      ) : (
        <Card>
          <CardContent className="pt-6 text-center space-y-4">
            <TrendingUp className="h-12 w-12 mx-auto text-muted-foreground" />
            <div>
              <p className="font-medium">Nenhuma previsão disponível</p>
              <p className="text-sm text-muted-foreground">
                Clique em "Gerar Nova Previsão" para criar análise preditiva
              </p>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
