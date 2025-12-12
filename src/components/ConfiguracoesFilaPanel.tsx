import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Save, Settings2, Clock, Users, Bell, RefreshCw } from "lucide-react";

interface ConfiguracoesChat {
  distribuicaoAutomatica: boolean;
  regraInicioAtendimento: "ao_enviar_mensagem" | "ao_abrir_conversa";
  tempoAlertaFila: number;
  slaRespostaSemInteracao: number;
  exibirContadorFila: boolean;
  atualizacaoTempoReal: "5s" | "10s" | "30s" | "60s";
}

const configInicial: ConfiguracoesChat = {
  distribuicaoAutomatica: false,
  regraInicioAtendimento: "ao_enviar_mensagem",
  tempoAlertaFila: 30,
  slaRespostaSemInteracao: 15,
  exibirContadorFila: true,
  atualizacaoTempoReal: "60s",
};

export const ConfiguracoesFilaPanel = () => {
  const [config, setConfig] = useState<ConfiguracoesChat>(configInicial);
  const [salvando, setSalvando] = useState(false);

  useEffect(() => {
    // Carregar configurações do localStorage ou futuro endpoint
    const configSalva = localStorage.getItem("connect_config_fila");
    if (configSalva) {
      try {
        setConfig(JSON.parse(configSalva));
      } catch (e) {
        console.error("Erro ao carregar configurações:", e);
      }
    }
  }, []);

  const handleSalvar = async () => {
    setSalvando(true);
    try {
      localStorage.setItem("connect_config_fila", JSON.stringify(config));
      toast.success("Configurações salvas com sucesso!");
    } catch (error) {
      toast.error("Erro ao salvar configurações");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-2xl font-bold text-[#0A2647]">Configurações do Sistema</h3>
          <p className="text-sm text-muted-foreground mt-1">
            Configure o comportamento da fila e atendimentos
          </p>
        </div>
        <Button onClick={handleSalvar} disabled={salvando} className="bg-[#0A2647] hover:bg-[#144272]">
          <Save className="h-4 w-4 mr-2" />
          {salvando ? "Salvando..." : "Salvar Alterações"}
        </Button>
      </div>

      {/* Distribuição de Pacientes */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">Distribuição automática de pacientes</h4>
              <p className="text-sm text-muted-foreground">
                Define se o sistema distribui pacientes automaticamente para atendentes ou mantém em fila
              </p>
            </div>
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label className="text-sm font-medium">
                  {config.distribuicaoAutomatica ? "Ativado (distribuição automática)" : "Desativado (mantém em Fila)"}
                </Label>
                <p className="text-xs text-muted-foreground">
                  {config.distribuicaoAutomatica 
                    ? "Pacientes são atribuídos automaticamente para atendentes disponíveis"
                    : "Paciente fica na Fila e só vai para 'Meus atendimentos' quando o atendente enviar a primeira mensagem"}
                </p>
              </div>
              <Switch
                checked={config.distribuicaoAutomatica}
                onCheckedChange={(checked) => setConfig({ ...config, distribuicaoAutomatica: checked })}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Regra de Início de Atendimento */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Settings2 className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">Início do atendimento</h4>
              <p className="text-sm text-muted-foreground">
                Define quando o atendimento é considerado iniciado
              </p>
            </div>
            <Select
              value={config.regraInicioAtendimento}
              onValueChange={(value: "ao_enviar_mensagem" | "ao_abrir_conversa") => 
                setConfig({ ...config, regraInicioAtendimento: value })}
            >
              <SelectTrigger className="w-full max-w-md">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="ao_enviar_mensagem">Ao atendente enviar a primeira mensagem</SelectItem>
                <SelectItem value="ao_abrir_conversa">Ao atendente abrir a conversa (preview)</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>

      {/* Tempo de Alerta da Fila */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-destructive/10">
            <Clock className="h-5 w-5 text-destructive" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">Tempo limite para alerta de fila</h4>
              <p className="text-sm text-muted-foreground">
                Pacientes com tempo de espera maior que este limite ficam com chip vermelho e podem gerar notificação
              </p>
            </div>
            <div className="flex items-center gap-3 max-w-xs">
              <Input
                type="number"
                min={1}
                max={120}
                value={config.tempoAlertaFila}
                onChange={(e) => setConfig({ ...config, tempoAlertaFila: parseInt(e.target.value) || 30 })}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">minutos</span>
            </div>
          </div>
        </div>
      </Card>

      {/* SLA de Resposta */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-orange-100">
            <Bell className="h-5 w-5 text-orange-600" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">Tempo limite sem resposta do atendente</h4>
              <p className="text-sm text-muted-foreground">
                Gera alerta quando um paciente em atendimento fica muito tempo sem resposta
              </p>
            </div>
            <div className="flex items-center gap-3 max-w-xs">
              <Input
                type="number"
                min={1}
                max={60}
                value={config.slaRespostaSemInteracao}
                onChange={(e) => setConfig({ ...config, slaRespostaSemInteracao: parseInt(e.target.value) || 15 })}
                className="w-24"
              />
              <span className="text-sm text-muted-foreground">minutos</span>
            </div>
          </div>
        </div>
      </Card>

      {/* Exibir Contador da Fila */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-primary/10">
            <Users className="h-5 w-5 text-primary" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">Exibir contador de pacientes na Fila</h4>
              <p className="text-sm text-muted-foreground">
                Mostra "Fila (X)" no topo da coluna Fila
              </p>
            </div>
            <div className="flex items-center justify-between">
              <Label className="text-sm font-medium">
                {config.exibirContadorFila ? "Contador visível" : "Contador oculto"}
              </Label>
              <Switch
                checked={config.exibirContadorFila}
                onCheckedChange={(checked) => setConfig({ ...config, exibirContadorFila: checked })}
              />
            </div>
          </div>
        </div>
      </Card>

      {/* Atualização em Tempo Real */}
      <Card className="p-6">
        <div className="flex items-start gap-4">
          <div className="p-3 rounded-lg bg-green-100">
            <RefreshCw className="h-5 w-5 text-green-600" />
          </div>
          <div className="flex-1 space-y-4">
            <div>
              <h4 className="font-semibold text-foreground">Atualização em tempo real</h4>
              <p className="text-sm text-muted-foreground">
                Configura o intervalo de atualização do tempo de fila e indicadores
              </p>
            </div>
            <Select
              value={config.atualizacaoTempoReal}
              onValueChange={(value: "5s" | "10s" | "30s" | "60s") => 
                setConfig({ ...config, atualizacaoTempoReal: value })}
            >
              <SelectTrigger className="w-full max-w-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="5s">A cada 5 segundos</SelectItem>
                <SelectItem value="10s">A cada 10 segundos</SelectItem>
                <SelectItem value="30s">A cada 30 segundos</SelectItem>
                <SelectItem value="60s">A cada 60 segundos</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>
      </Card>
    </div>
  );
};
