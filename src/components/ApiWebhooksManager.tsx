import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Plus, Trash2, RefreshCw } from "lucide-react";
import { useState } from "react";
import { useWebhooks, useCriarWebhook, useAtualizarWebhook, useDeletarWebhook } from "@/hooks/useWebhooks";
import { useEmpresas } from "@/hooks/useEmpresas";

export const ApiWebhooksManager = () => {
  const { data: empresas } = useEmpresas();
  const { data: webhooks } = useWebhooks(empresas?.[0]?.id);
  const criarWebhook = useCriarWebhook();
  const atualizarWebhook = useAtualizarWebhook();
  const deletarWebhook = useDeletarWebhook();

  const [novoWebhook, setNovoWebhook] = useState({
    evento: "",
    url_destino: "",
    secret: "",
  });

  const eventosDisponiveis = [
    "novo_paciente",
    "nova_mensagem",
    "mensagem_lida",
    "inicio_atendimento",
    "transferencia_atendimento",
    "fim_atendimento",
    "ligacao_iniciada",
    "ligacao_finalizada",
    "alerta_gerado",
    "nps_recebido",
  ];

  const handleCriarWebhook = () => {
    if (!novoWebhook.evento || !novoWebhook.url_destino || !empresas?.[0]?.id) {
      return;
    }

    criarWebhook.mutate({
      empresa_id: empresas[0].id,
      evento: novoWebhook.evento,
      url_destino: novoWebhook.url_destino,
      secret: novoWebhook.secret || undefined,
      ativo: true,
    });

    setNovoWebhook({ evento: "", url_destino: "", secret: "" });
  };

  const handleToggleWebhook = (id: string, ativo: boolean) => {
    atualizarWebhook.mutate({ id, dados: { ativo } });
  };

  const handleDeletarWebhook = (id: string) => {
    if (confirm("Tem certeza que deseja remover este webhook?")) {
      deletarWebhook.mutate(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Criar Novo Webhook</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Label>Evento</Label>
            <select
              value={novoWebhook.evento}
              onChange={(e) => setNovoWebhook({ ...novoWebhook, evento: e.target.value })}
              className="w-full p-2 border rounded-lg"
            >
              <option value="">Selecione um evento</option>
              {eventosDisponiveis.map((evento) => (
                <option key={evento} value={evento}>
                  {evento.replace(/_/g, " ")}
                </option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <Label>URL de Destino</Label>
            <Input
              value={novoWebhook.url_destino}
              onChange={(e) => setNovoWebhook({ ...novoWebhook, url_destino: e.target.value })}
              placeholder="https://seu-servidor.com/webhook"
            />
          </div>

          <div className="space-y-2">
            <Label>Secret (Opcional)</Label>
            <Input
              value={novoWebhook.secret}
              onChange={(e) => setNovoWebhook({ ...novoWebhook, secret: e.target.value })}
              placeholder="secret_key_para_validacao"
              type="password"
            />
            <p className="text-xs text-muted-foreground">
              Secret será enviado no header X-Webhook-Secret
            </p>
          </div>

          <Button onClick={handleCriarWebhook} className="w-full" disabled={!novoWebhook.evento || !novoWebhook.url_destino}>
            <Plus className="h-4 w-4 mr-2" />
            Criar Webhook
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Webhooks Configurados ({webhooks?.length || 0})</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {webhooks && webhooks.length > 0 ? (
                webhooks.map((webhook) => (
                  <div key={webhook.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline">{webhook.evento.replace(/_/g, " ")}</Badge>
                        {webhook.ativo ? (
                          <Badge variant="default" className="text-xs">Ativo</Badge>
                        ) : (
                          <Badge variant="secondary" className="text-xs">Inativo</Badge>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <Switch
                          checked={webhook.ativo || false}
                          onCheckedChange={(checked) => handleToggleWebhook(webhook.id, checked)}
                        />
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeletarWebhook(webhook.id)}
                        >
                          <Trash2 className="h-4 w-4 text-destructive" />
                        </Button>
                      </div>
                    </div>

                    <Separator />

                    <div className="space-y-2">
                      <div className="flex items-start gap-2">
                        <span className="text-xs font-medium text-muted-foreground min-w-[60px]">URL:</span>
                        <code className="text-xs flex-1 break-all">{webhook.url_destino}</code>
                      </div>

                      {webhook.secret && (
                        <div className="flex items-start gap-2">
                          <span className="text-xs font-medium text-muted-foreground min-w-[60px]">Secret:</span>
                          <code className="text-xs">••••••••</code>
                        </div>
                      )}

                      {webhook.tentativas_falhas !== undefined && webhook.tentativas_falhas > 0 && (
                        <div className="flex items-center gap-2 text-xs text-destructive">
                          <RefreshCw className="h-3 w-3" />
                          {webhook.tentativas_falhas} falha(s) de entrega
                        </div>
                      )}

                      {webhook.ultima_tentativa && (
                        <div className="text-xs text-muted-foreground">
                          Última tentativa: {new Date(webhook.ultima_tentativa).toLocaleString()}
                        </div>
                      )}
                    </div>
                  </div>
                ))
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  Nenhum webhook configurado
                </div>
              )}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Eventos Disponíveis</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-2">
            {eventosDisponiveis.map((evento) => (
              <div key={evento} className="p-2 border rounded text-sm">
                {evento.replace(/_/g, " ")}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
