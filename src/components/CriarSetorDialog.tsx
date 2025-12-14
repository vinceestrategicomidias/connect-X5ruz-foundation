import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { useCriarSetor } from "@/hooks/useSetores";
import { useUnidades } from "@/hooks/useUnidades";
import { toast } from "sonner";
import { Loader2, Plus, MessageSquare, Phone, Mail, Bot, Users, Clock } from "lucide-react";

interface CriarSetorDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface SetorFormData {
  nome: string;
  descricao: string;
  cor: string;
  unidade_id: string;
  recebe_mensagens: boolean;
  recebe_ligacoes: boolean;
  // Campos extras para configuração
  tipo_atendimento: string;
  regra_entrada: string;
  distribuicao_automatica: boolean;
  regra_balanceamento: string;
  limite_alerta_fila: number;
  limite_sem_resposta: number;
  prioridade: string;
}

export const CriarSetorDialog = ({ open, onOpenChange }: CriarSetorDialogProps) => {
  const criarSetor = useCriarSetor();
  const { data: unidades } = useUnidades();

  const [formData, setFormData] = useState<SetorFormData>({
    nome: "",
    descricao: "",
    cor: "#3B82F6",
    unidade_id: "",
    recebe_mensagens: true,
    recebe_ligacoes: true,
    tipo_atendimento: "manual",
    regra_entrada: "fila",
    distribuicao_automatica: false,
    regra_balanceamento: "round_robin",
    limite_alerta_fila: 30,
    limite_sem_resposta: 15,
    prioridade: "normal",
  });

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      toast.error("Nome do setor é obrigatório");
      return;
    }

    try {
      await criarSetor.mutateAsync({
        nome: formData.nome,
        descricao: formData.descricao,
        cor: formData.cor,
        unidade_id: formData.unidade_id || null,
        recebe_mensagens: formData.recebe_mensagens,
        recebe_ligacoes: formData.recebe_ligacoes,
      });
      
      toast.success("Setor criado com sucesso!");
      onOpenChange(false);
      setFormData({
        nome: "",
        descricao: "",
        cor: "#3B82F6",
        unidade_id: "",
        recebe_mensagens: true,
        recebe_ligacoes: true,
        tipo_atendimento: "manual",
        regra_entrada: "fila",
        distribuicao_automatica: false,
        regra_balanceamento: "round_robin",
        limite_alerta_fila: 30,
        limite_sem_resposta: 15,
        prioridade: "normal",
      });
    } catch (error) {
      toast.error("Erro ao criar setor");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Plus className="h-5 w-5" />
            Criar Novo Setor
          </DialogTitle>
          <DialogDescription>
            Configure todos os detalhes do novo setor de atendimento
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[65vh] pr-4">
          <div className="space-y-6">
            {/* Dados Básicos */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Dados Básicos
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Setor *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Ex: Pré-venda"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="unidade">Unidade</Label>
                  <Select
                    value={formData.unidade_id}
                    onValueChange={(value) => setFormData({ ...formData, unidade_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades?.map((unidade) => (
                        <SelectItem key={unidade.id} value={unidade.id}>
                          {unidade.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="descricao">Descrição</Label>
                <Textarea
                  id="descricao"
                  value={formData.descricao}
                  onChange={(e) => setFormData({ ...formData, descricao: e.target.value })}
                  placeholder="Descrição do setor e suas responsabilidades"
                  rows={2}
                />
              </div>

              <div className="space-y-2">
                <Label>Cor do Setor</Label>
                <div className="flex items-center gap-3">
                  <Input
                    type="color"
                    value={formData.cor}
                    onChange={(e) => setFormData({ ...formData, cor: e.target.value })}
                    className="w-16 h-10 p-1 cursor-pointer"
                  />
                  <span className="text-sm text-muted-foreground">{formData.cor}</span>
                </div>
              </div>
            </div>

            <Separator />

            {/* Canais Ativos */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Canais Ativos
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <MessageSquare className="h-4 w-4 text-blue-500" />
                    <span className="text-sm">Chat / WhatsApp</span>
                  </div>
                  <Switch
                    checked={formData.recebe_mensagens}
                    onCheckedChange={(checked) => setFormData({ ...formData, recebe_mensagens: checked })}
                  />
                </div>
                
                <div className="flex items-center justify-between p-3 rounded-lg border">
                  <div className="flex items-center gap-2">
                    <Phone className="h-4 w-4 text-green-500" />
                    <span className="text-sm">Telefonia</span>
                  </div>
                  <Switch
                    checked={formData.recebe_ligacoes}
                    onCheckedChange={(checked) => setFormData({ ...formData, recebe_ligacoes: checked })}
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Modo de Atendimento */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Modo de Atendimento
              </h4>
              
              <div className="space-y-2">
                <Label>Tipo de Atendimento</Label>
                <Select
                  value={formData.tipo_atendimento}
                  onValueChange={(value) => setFormData({ ...formData, tipo_atendimento: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="manual">
                      <div className="flex items-center gap-2">
                        <Users className="h-4 w-4" />
                        Manual (atendentes humanos)
                      </div>
                    </SelectItem>
                    <SelectItem value="chatbot">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        Chatbot
                      </div>
                    </SelectItem>
                    <SelectItem value="thali">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4 text-purple-500" />
                        Thalí (Assistente IA)
                      </div>
                    </SelectItem>
                    <SelectItem value="hibrido">
                      <div className="flex items-center gap-2">
                        <Bot className="h-4 w-4" />
                        Híbrido (Chatbot + Humano)
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label>Regra de Entrada</Label>
                <Select
                  value={formData.regra_entrada}
                  onValueChange={(value) => setFormData({ ...formData, regra_entrada: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="fila">
                      Ficar na Fila até atendente enviar 1ª mensagem
                    </SelectItem>
                    <SelectItem value="distribuicao">
                      Distribuição automática para atendentes
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="flex items-center justify-between p-3 rounded-lg border">
                <div>
                  <p className="text-sm font-medium">Distribuição Automática</p>
                  <p className="text-xs text-muted-foreground">
                    Distribuir pacientes automaticamente para atendentes disponíveis
                  </p>
                </div>
                <Switch
                  checked={formData.distribuicao_automatica}
                  onCheckedChange={(checked) => setFormData({ ...formData, distribuicao_automatica: checked })}
                />
              </div>

              {formData.distribuicao_automatica && (
                <div className="space-y-2">
                  <Label>Regra de Balanceamento</Label>
                  <Select
                    value={formData.regra_balanceamento}
                    onValueChange={(value) => setFormData({ ...formData, regra_balanceamento: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="round_robin">Round-robin</SelectItem>
                      <SelectItem value="menor_fila">Menor fila</SelectItem>
                      <SelectItem value="menor_tma">Menor TMA</SelectItem>
                      <SelectItem value="senioridade">Prioridade por senioridade</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <Separator />

            {/* SLA e Alertas */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Clock className="h-4 w-4" />
                SLA e Alertas do Setor
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Limite alerta fila (min)</Label>
                  <Input
                    type="number"
                    value={formData.limite_alerta_fila}
                    onChange={(e) => setFormData({ ...formData, limite_alerta_fila: Number(e.target.value) })}
                    min={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tempo para chip vermelho na fila
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label>Limite sem resposta (min)</Label>
                  <Input
                    type="number"
                    value={formData.limite_sem_resposta}
                    onChange={(e) => setFormData({ ...formData, limite_sem_resposta: Number(e.target.value) })}
                    min={1}
                  />
                  <p className="text-xs text-muted-foreground">
                    Tempo para alerta de paciente sem resposta
                  </p>
                </div>
              </div>

              <div className="space-y-2">
                <Label>Prioridade de Urgências</Label>
                <Select
                  value={formData.prioridade}
                  onValueChange={(value) => setFormData({ ...formData, prioridade: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="baixa">Baixa</SelectItem>
                    <SelectItem value="normal">Normal</SelectItem>
                    <SelectItem value="alta">Alta</SelectItem>
                    <SelectItem value="critica">Crítica</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </ScrollArea>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            className="flex-1"
            onClick={handleSubmit}
            disabled={criarSetor.isPending}
          >
            {criarSetor.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Criar Setor
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
