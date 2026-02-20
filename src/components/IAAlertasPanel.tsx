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
        return <AlertCircle className="h-4 w-4 text-destructive" />;
      case 'warning':
        return <AlertTriangle className="h-4 w-4 text-warning" />;
      default:
        return <Info className="h-4 w-4 text-primary" />;
    }
  };

  const getSeveridadeBadge = (severidade: string) => {
    switch (severidade) {
      case 'critical':
        return <Badge variant="destructive" className="text-[10px]">Crítico</Badge>;
      case 'warning':
        return <Badge className="bg-warning text-warning-foreground text-[10px]">Aviso</Badge>;
      default:
        return <Badge variant="secondary" className="text-[10px]">Info</Badge>;
    }
  };

  const handleAtender = (alertaId: string) => {
    if (atendenteLogado?.id) {
      atenderAlerta.mutate({ id: alertaId, atendente_id: atendenteLogado.id });
    }
  };

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-3 gap-3">
        <Card className="border-border/60">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2.5">
              <AlertCircle className="h-4 w-4 text-destructive" />
              <div>
                <div className="text-xl font-bold">
                  {alertasNaoAtendidos?.filter(a => a.severidade === 'critical').length || 0}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Críticos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2.5">
              <AlertTriangle className="h-4 w-4 text-warning" />
              <div>
                <div className="text-xl font-bold">
                  {alertasNaoAtendidos?.filter(a => a.severidade === 'warning').length || 0}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Avisos</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="border-border/60">
          <CardContent className="pt-5 pb-4">
            <div className="flex items-center gap-2.5">
              <Check className="h-4 w-4 text-success" />
              <div>
                <div className="text-xl font-bold">
                  {alertasAtendidos?.length || 0}
                </div>
                <div className="text-[10px] text-muted-foreground uppercase tracking-wider">Atendidos Hoje</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Alertas Pendentes</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {alertasNaoAtendidos && alertasNaoAtendidos.length > 0 ? (
                alertasNaoAtendidos.map((alerta) => (
                  <div key={alerta.id} className="p-4 border border-border/60 rounded-lg space-y-3">
                    <div className="flex items-start justify-between">
                      <div className="flex items-start gap-2.5">
                        {getSeveridadeIcon(alerta.severidade)}
                        <div className="flex-1">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-sm font-semibold">{alerta.titulo}</h4>
                            {getSeveridadeBadge(alerta.severidade)}
                            <Badge variant="outline" className="text-[10px]">
                              {alerta.tipo.replace(/_/g, ' ')}
                            </Badge>
                          </div>
                          <p className="text-xs text-muted-foreground">{alerta.descricao}</p>
                        </div>
                      </div>
                    </div>

                    {alerta.acao_recomendada && (
                      <>
                        <Separator />
                        <div className="flex items-start gap-2">
                          <Info className="h-3.5 w-3.5 text-muted-foreground mt-0.5" />
                          <div>
                            <p className="text-[10px] font-medium">Ação Recomendada:</p>
                            <p className="text-xs text-muted-foreground">{alerta.acao_recomendada}</p>
                          </div>
                        </div>
                      </>
                    )}

                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                        <Clock className="h-3 w-3" />
                        {alerta.created_at && new Date(alerta.created_at).toLocaleString()}
                      </div>
                      <Button
                        size="sm"
                        className="h-8 text-xs"
                        onClick={() => handleAtender(alerta.id)}
                        disabled={atenderAlerta.isPending}
                      >
                        <Check className="h-3.5 w-3.5 mr-1" />
                        Marcar como Atendido
                      </Button>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground text-xs">
                  Nenhum alerta pendente
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card className="border-border/60">
        <CardHeader className="pb-3">
          <CardTitle className="text-sm">Histórico Recente</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[200px]">
            <div className="space-y-2">
              {alertasAtendidos && alertasAtendidos.length > 0 ? (
                alertasAtendidos.map((alerta) => (
                  <div key={alerta.id} className="p-3 border border-border/60 rounded-lg flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Check className="h-3.5 w-3.5 text-success" />
                      <div>
                        <p className="text-xs font-medium">{alerta.titulo}</p>
                        <p className="text-[10px] text-muted-foreground">
                          Atendido em {alerta.atendido_em && new Date(alerta.atendido_em).toLocaleString()}
                        </p>
                      </div>
                    </div>
                    {getSeveridadeBadge(alerta.severidade)}
                  </div>
                ))
              ) : (
                <div className="text-center py-4 text-muted-foreground text-xs">
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
