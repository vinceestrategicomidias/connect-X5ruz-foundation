import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { AlertTriangle, Info, AlertCircle, Check, Clock } from "lucide-react";
import { useIAAlertas, useAtenderAlerta } from "@/hooks/useIAAlertas";
import { useAtendenteContext } from "@/contexts/AtendenteContext";

export const IAAlertasPanel = () => {
  const { data: alertasNaoAtendidos } = useIAAlertas(false);
  const { data: alertasAtendidos } = useIAAlertas(true);
  const atenderAlerta = useAtenderAlerta();
  const { atendenteLogado } = useAtendenteContext();

  const getSeveridadeIcon = (severidade: string) => {
    switch (severidade) {
      case 'critical':
        return <AlertCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getSeveridadeBadge = (severidade: string) => {
    switch (severidade) {
      case 'critical':
        return <Badge variant="destructive">Crítico</Badge>;
      case 'warning':
        return <Badge className="bg-yellow-500">Aviso</Badge>;
      default:
        return <Badge variant="secondary">Info</Badge>;
    }
  };

  const handleAtender = (alertaId: string) => {
    if (atendenteLogado?.id) {
      atenderAlerta.mutate({ id: alertaId, atendente_id: atendenteLogado.id });
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Alertas Inteligentes</h2>
        <p className="text-muted-foreground mt-2">
          Alertas gerados automaticamente pela Thalí
        </p>
      </div>

      <div className="grid grid-cols-3 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <div>
                <div className="text-2xl font-bold">
                  {alertasNaoAtendidos?.filter(a => a.severidade === 'critical').length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Críticos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-yellow-500" />
              <div>
                <div className="text-2xl font-bold">
                  {alertasNaoAtendidos?.filter(a => a.severidade === 'warning').length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Avisos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center gap-2">
              <Check className="h-5 w-5 text-green-500" />
              <div>
                <div className="text-2xl font-bold">
                  {alertasAtendidos?.length || 0}
                </div>
                <div className="text-xs text-muted-foreground">Atendidos Hoje</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Alertas Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {alertasNaoAtendidos && alertasNaoAtendidos.length > 0 ? (
                alertasNaoAtendidos.map((alerta) => (
                  <div key={alerta.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-3">
                        {getSeveridadeIcon(alerta.severidade)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="font-semibold">{alerta.titulo}</h4>
                            {getSeveridadeBadge(alerta.severidade)}
                            <Badge variant="outline" className="text-xs">
                              {alerta.tipo.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          <p className="text-sm text-muted-foreground">{alerta.descricao}</p>
                        </div>
                      </div>
                    </div>

                    {alerta.acao_recomendada && (
                      <>
                        <Separator />
                        <div className="flex items-start gap-2">
                          <Info className="h-4 w-4 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-xs font-medium">Ação Recomendada:</p>
                            <p className="text-sm text-muted-foreground">{alerta.acao_recomendada}</p>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-xs text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {alerta.created_at && new Date(alerta.created_at).toLocaleString()}
                      </div>
                      <Button
                        size="sm"
                        onClick={() => handleAtender(alerta.id)}
                        disabled={atenderAlerta.isPending}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Marcar como Atendido
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum alerta pendente
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Histórico Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {alertasAtendidos && alertasAtendidos.length > 0 ? (
                alertasAtendidos.map((alerta) => (
                  <div key={alerta.id} className="p-3 border rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="h-4 w-4 text-green-500" />
                      <div>
                        <p className="text-sm font-medium">{alerta.titulo}</p>
                        <p className="text-xs text-muted-foreground">
                          Atendido em {alerta.atendido_em && new Date(alerta.atendido_em).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {getSeveridadeBadge(alerta.severidade)}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground text-sm">
                  Nenhum alerta atendido hoje
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
    </div>
  );
};
