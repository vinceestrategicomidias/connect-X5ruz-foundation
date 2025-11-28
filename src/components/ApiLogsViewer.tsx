import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useApiLogs, useApiStats } from "@/hooks/useApiLogs";
import { Activity, TrendingUp, AlertCircle, Clock } from "lucide-react";

export const ApiLogsViewer = () => {
  const { data: logs } = useApiLogs(50);
  const { data: stats } = useApiStats();

  const getStatusColor = (status?: number) => {
    if (!status) return "secondary";
    if (status < 300) return "default";
    if (status < 400) return "secondary";
    if (status < 500) return "destructive";
    return "destructive";
  };

  const getStatusText = (status?: number) => {
    if (!status) return "Unknown";
    if (status < 300) return "Success";
    if (status < 400) return "Redirect";
    if (status < 500) return "Client Error";
    return "Server Error";
  };

  return (
    <div className="space-y-6">
      {stats && (
        <div className="grid grid-cols-4 gap-4">
          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Activity className="h-5 w-5 text-primary" />
                <div>
                  <div className="text-2xl font-bold">{stats.total}</div>
                  <div className="text-xs text-muted-foreground">Total Requisições</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-green-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.taxaSucesso}%</div>
                  <div className="text-xs text-muted-foreground">Taxa de Sucesso</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.erros}</div>
                  <div className="text-xs text-muted-foreground">Erros</div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="pt-6">
              <div className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-blue-500" />
                <div>
                  <div className="text-2xl font-bold">{stats.tempoMedio}ms</div>
                  <div className="text-xs text-muted-foreground">Tempo Médio</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Logs Recentes (últimas 50 requisições)</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[500px]">
            <div className="space-y-2">
              {logs && logs.length > 0 ? (
                logs.map((log) => (
                  <div key={log.id} className="p-3 border rounded-lg space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant={getStatusColor(log.status_code)}>
                          {log.status_code || "---"}
                        </Badge>
                        <Badge variant="outline">{log.metodo}</Badge>
                        <code className="text-xs">{log.endpoint}</code>
                      </div>
                      <span className="text-xs text-muted-foreground">
                        {log.tempo_resposta_ms}ms
                      </span>
                    </div>

                    <div className="flex items-center justify-between text-xs text-muted-foreground">
                      <div className="flex items-center gap-4">
                        <span>IP: {log.ip_origem || "unknown"}</span>
                        {log.status_code && (
                          <span>{getStatusText(log.status_code)}</span>
                        )}
                      </div>
                      <span>
                        {log.created_at && new Date(log.created_at).toLocaleString()}
                      </span>
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum log de API disponível
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {stats && stats.porEndpoint && (
        <Card>
          <CardHeader>
            <CardTitle>Estatísticas por Endpoint</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {Object.entries(stats.porEndpoint).map(([endpoint, data]: [string, any]) => (
                <div key={endpoint} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between mb-2">
                    <code className="text-sm font-medium">{endpoint}</code>
                    <Badge variant="outline">{data.total} requisições</Badge>
                  </div>
                  <div className="flex gap-4 text-xs">
                    <span className="text-green-600">
                      ✓ {data.sucessos} sucessos
                    </span>
                    <span className="text-red-600">
                      ✗ {data.erros} erros
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
