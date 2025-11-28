import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Separator } from "@/components/ui/separator";
import { Badge } from "@/components/ui/badge";
import { Brain, Save, Zap, MessageSquare, TrendingUp, Bell, ThumbsUp } from "lucide-react";
import { useState, useEffect } from "react";
import { useIAConfig, useAtualizarIAConfig } from "@/hooks/useIAConfig";

export const IAConfigPanel = () => {
  const { data: config } = useIAConfig();
  const atualizarConfig = useAtualizarIAConfig();

  const [formData, setFormData] = useState({
    ia_ativa: true,
    nivel_atuacao: 'assistente' as 'observador' | 'assistente' | 'automatizado_parcial',
    pre_atendimento_ativo: false,
    analise_intencao_ativa: true,
    preditiva_ativa: true,
    alertas_inteligentes_ativos: true,
    sugestao_respostas_ativa: true,
    feedback_automatico_ativo: false,
    limite_nps_baixo: 7,
    limite_fila_alta: 12,
    limite_tma_minutos: 8,
    sensibilidade_alertas: 'media' as 'baixa' | 'media' | 'alta',
  });

  useEffect(() => {
    if (config) {
      setFormData({
        ia_ativa: config.ia_ativa ?? true,
        nivel_atuacao: config.nivel_atuacao ?? 'assistente',
        pre_atendimento_ativo: config.pre_atendimento_ativo ?? false,
        analise_intencao_ativa: config.analise_intencao_ativa ?? true,
        preditiva_ativa: config.preditiva_ativa ?? true,
        alertas_inteligentes_ativos: config.alertas_inteligentes_ativos ?? true,
        sugestao_respostas_ativa: config.sugestao_respostas_ativa ?? true,
        feedback_automatico_ativo: config.feedback_automatico_ativo ?? false,
        limite_nps_baixo: config.limite_nps_baixo ?? 7,
        limite_fila_alta: config.limite_fila_alta ?? 12,
        limite_tma_minutos: config.limite_tma_minutos ?? 8,
        sensibilidade_alertas: config.sensibilidade_alertas ?? 'media',
      });
    }
  }, [config]);

  const handleSalvar = () => {
    atualizarConfig.mutate(formData);
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold flex items-center gap-2">
          <Brain className="h-6 w-6 text-primary" />
          Configurações de Inteligência Artificial
        </h2>
        <p className="text-muted-foreground mt-2">
          Configure como a IA irá auxiliar nos atendimentos
        </p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Status e Nível de Atuação</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label className="text-base">IA Ativa</Label>
              <p className="text-sm text-muted-foreground">Ativar/desativar todos os módulos de IA</p>
            </div>
            <Switch
              checked={formData.ia_ativa}
              onCheckedChange={(checked) => setFormData({ ...formData, ia_ativa: checked })}
            />
          </div>

          <Separator />

          <div className="space-y-3">
            <Label>Nível de Atuação</Label>
            <div className="grid grid-cols-3 gap-3">
              <button
                onClick={() => setFormData({ ...formData, nivel_atuacao: 'observador' })}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  formData.nivel_atuacao === 'observador' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                }`}
              >
                <div className="font-medium">Observador</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Apenas análise, sem ações
                </div>
              </button>
              <button
                onClick={() => setFormData({ ...formData, nivel_atuacao: 'assistente' })}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  formData.nivel_atuacao === 'assistente' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                }`}
              >
                <div className="font-medium">Assistente</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Sugere ações, usuário decide
                </div>
              </button>
              <button
                onClick={() => setFormData({ ...formData, nivel_atuacao: 'automatizado_parcial' })}
                className={`p-4 border rounded-lg text-left transition-colors ${
                  formData.nivel_atuacao === 'automatizado_parcial' ? 'border-primary bg-primary/5' : 'hover:bg-muted'
                }`}
              >
                <div className="font-medium">Automatizado</div>
                <div className="text-xs text-muted-foreground mt-1">
                  Pré-atendimento automático
                </div>
              </button>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Módulos de IA</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <div>
                <Label>Pré-atendimento Automatizado</Label>
                <p className="text-xs text-muted-foreground">Captar dados antes de transferir</p>
              </div>
            </div>
            <Switch
              checked={formData.pre_atendimento_ativo}
              onCheckedChange={(checked) => setFormData({ ...formData, pre_atendimento_ativo: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Brain className="h-5 w-5 text-purple-500" />
              <div>
                <Label>Análise de Intenção</Label>
                <p className="text-xs text-muted-foreground">Identificar propósito da mensagem</p>
              </div>
            </div>
            <Switch
              checked={formData.analise_intencao_ativa}
              onCheckedChange={(checked) => setFormData({ ...formData, analise_intencao_ativa: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-blue-500" />
              <div>
                <Label>Análise Preditiva</Label>
                <p className="text-xs text-muted-foreground">Prever picos e demandas</p>
              </div>
            </div>
            <Switch
              checked={formData.preditiva_ativa}
              onCheckedChange={(checked) => setFormData({ ...formData, preditiva_ativa: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-red-500" />
              <div>
                <Label>Alertas Inteligentes</Label>
                <p className="text-xs text-muted-foreground">Notificações baseadas em padrões</p>
              </div>
            </div>
            <Switch
              checked={formData.alertas_inteligentes_ativos}
              onCheckedChange={(checked) => setFormData({ ...formData, alertas_inteligentes_ativos: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-5 w-5 text-green-500" />
              <div>
                <Label>Sugestão de Respostas</Label>
                <p className="text-xs text-muted-foreground">Auxiliar atendente com respostas prontas</p>
              </div>
            </div>
            <Switch
              checked={formData.sugestao_respostas_ativa}
              onCheckedChange={(checked) => setFormData({ ...formData, sugestao_respostas_ativa: checked })}
            />
          </div>

          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <ThumbsUp className="h-5 w-5 text-orange-500" />
              <div>
                <Label>Feedback Automatizado</Label>
                <p className="text-xs text-muted-foreground">Gerar feedbacks para gestão</p>
              </div>
            </div>
            <Switch
              checked={formData.feedback_automatico_ativo}
              onCheckedChange={(checked) => setFormData({ ...formData, feedback_automatico_ativo: checked })}
            />
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Limites e Sensibilidade</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-3 gap-4">
            <div className="space-y-2">
              <Label>NPS Baixo</Label>
              <Input
                type="number"
                value={formData.limite_nps_baixo}
                onChange={(e) => setFormData({ ...formData, limite_nps_baixo: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>Fila Alta</Label>
              <Input
                type="number"
                value={formData.limite_fila_alta}
                onChange={(e) => setFormData({ ...formData, limite_fila_alta: Number(e.target.value) })}
              />
            </div>
            <div className="space-y-2">
              <Label>TMA (minutos)</Label>
              <Input
                type="number"
                value={formData.limite_tma_minutos}
                onChange={(e) => setFormData({ ...formData, limite_tma_minutos: Number(e.target.value) })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label>Sensibilidade de Alertas</Label>
            <div className="flex gap-2">
              <Badge
                variant={formData.sensibilidade_alertas === 'baixa' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFormData({ ...formData, sensibilidade_alertas: 'baixa' })}
              >
                Baixa
              </Badge>
              <Badge
                variant={formData.sensibilidade_alertas === 'media' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFormData({ ...formData, sensibilidade_alertas: 'media' })}
              >
                Média
              </Badge>
              <Badge
                variant={formData.sensibilidade_alertas === 'alta' ? 'default' : 'outline'}
                className="cursor-pointer"
                onClick={() => setFormData({ ...formData, sensibilidade_alertas: 'alta' })}
              >
                Alta
              </Badge>
            </div>
          </div>
        </CardContent>
      </Card>

      <Button onClick={handleSalvar} className="w-full" size="lg">
        <Save className="h-4 w-4 mr-2" />
        Salvar Configurações de IA
      </Button>
    </div>
  );
};
