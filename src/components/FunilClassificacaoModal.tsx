import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ShoppingCart, MessageSquare, Info } from "lucide-react";
import type { LeadFunil } from "@/hooks/useLeadsFunil";

interface FunilClassificacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassificar: (tipo: "venda" | "apenas_contato", dados?: {
    produto_servico: string;
    valor_orcamento: number;
    origem_lead?: string;
    observacoes?: string;
    etapa_lead?: "em_negociacao" | "vendido" | "perdido";
  }) => void;
  valorOrcamento?: number;
  produtoServico?: string;
  leadAtivo?: LeadFunil | null;
}

const ETAPA_LABELS: Record<string, string> = {
  em_negociacao: "Em negociação",
  vendido: "Vendido",
  perdido: "Perdido",
};

export const FunilClassificacaoModal = ({
  open,
  onOpenChange,
  onClassificar,
  valorOrcamento,
  produtoServico: produtoServicoInicial,
  leadAtivo,
}: FunilClassificacaoModalProps) => {
  const [tipo, setTipo] = useState<"venda" | "apenas_contato">("venda");
  const [produtoServico, setProdutoServico] = useState(produtoServicoInicial || "");
  const [valor, setValor] = useState(valorOrcamento?.toString() || "");
  const [origemLead, setOrigemLead] = useState("");
  const [observacoes, setObservacoes] = useState("");
  const [etapaLead, setEtapaLead] = useState<"em_negociacao" | "vendido" | "perdido">("em_negociacao");

  useEffect(() => {
    if (open) {
      setProdutoServico(produtoServicoInicial || "");
      setValor(valorOrcamento?.toString() || "");
      if (leadAtivo) {
        setTipo("venda");
        setEtapaLead(leadAtivo.etapa as "em_negociacao" | "vendido" | "perdido");
      } else {
        setTipo("venda");
        setEtapaLead("em_negociacao");
      }
    }
  }, [open, produtoServicoInicial, valorOrcamento, leadAtivo]);

  const handleConfirmar = () => {
    if (tipo === "apenas_contato") {
      onClassificar("apenas_contato");
    } else {
      onClassificar("venda", {
        produto_servico: produtoServico || "Orçamento",
        valor_orcamento: parseFloat(valor) || 0,
        origem_lead: origemLead || undefined,
        observacoes: observacoes || undefined,
        etapa_lead: etapaLead,
      });
    }
    // Reset
    setProdutoServico("");
    setValor("");
    setOrigemLead("");
    setObservacoes("");
    setTipo("venda");
    setEtapaLead("em_negociacao");
  };

  const hasLeadAtivo = !!leadAtivo;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm max-h-[85vh] overflow-y-auto" onInteractOutside={(e) => e.preventDefault()} onEscapeKeyDown={(e) => e.preventDefault()}>
        <DialogHeader>
          <DialogTitle>
            {hasLeadAtivo ? "Novo orçamento para lead ativo" : "Novo orçamento para negociação"}
          </DialogTitle>
          <DialogDescription>
            {hasLeadAtivo
              ? "Este paciente já possui um lead ativo no funil. O orçamento será vinculado a ele."
              : "Classifique este envio: é uma venda em potencial ou apenas um contato informativo?"}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
          {/* Banner lead ativo */}
          {hasLeadAtivo && (
            <div className="flex items-start gap-2 p-3 rounded-lg bg-primary/10 border border-primary/20">
              <Info className="h-4 w-4 text-primary mt-0.5 shrink-0" />
              <div className="text-xs">
                <p className="font-medium">Lead ativo: {ETAPA_LABELS[leadAtivo!.etapa] || leadAtivo!.etapa}</p>
                <p className="text-muted-foreground mt-0.5">
                  Produto: {leadAtivo!.produto_servico} • Valor: R$ {leadAtivo!.valor_orcamento?.toFixed(2)}
                </p>
              </div>
            </div>
          )}

          {/* Tipo selection — only show when no leadAtivo */}
          {!hasLeadAtivo && (
            <RadioGroup value={tipo} onValueChange={(v) => setTipo(v as any)}>
              <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                onClick={() => setTipo("venda")}>
                <RadioGroupItem value="venda" id="venda" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="venda" className="flex items-center gap-2 cursor-pointer font-medium">
                    <ShoppingCart className="h-4 w-4 text-primary" />
                    Venda
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Incluir no funil de vendas como lead ativo
                  </p>
                </div>
              </div>
              <div className="flex items-start gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
                onClick={() => setTipo("apenas_contato")}>
                <RadioGroupItem value="apenas_contato" id="apenas_contato" className="mt-0.5" />
                <div className="flex-1">
                  <Label htmlFor="apenas_contato" className="flex items-center gap-2 cursor-pointer font-medium">
                    <MessageSquare className="h-4 w-4 text-muted-foreground" />
                    Apenas contato
                  </Label>
                  <p className="text-xs text-muted-foreground mt-1">
                    Enviar orçamento sem incluir no funil
                  </p>
                </div>
              </div>
            </RadioGroup>
          )}

          {/* Venda fields — show when tipo=venda OR leadAtivo exists */}
          {(tipo === "venda" || hasLeadAtivo) && (
            <div className="space-y-3 border-t pt-3">
              {/* Stage selector when lead already exists */}
              {hasLeadAtivo && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Etapa da negociação</Label>
                  <Select value={etapaLead} onValueChange={(v) => setEtapaLead(v as any)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="em_negociacao">Em negociação</SelectItem>
                      <SelectItem value="vendido">Vendido</SelectItem>
                      <SelectItem value="perdido">Perdido</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}

              <div className="space-y-1.5">
                <Label className="text-xs">Produto/Serviço *</Label>
                <Input
                  placeholder="Ex: Consulta especializada"
                  value={produtoServico}
                  onChange={(e) => setProdutoServico(e.target.value)}
                />
              </div>
              <div className="space-y-1.5">
                <Label className="text-xs">Valor do orçamento (R$) *</Label>
                <Input
                  type="number"
                  step="0.01"
                  placeholder="0,00"
                  value={valor}
                  onChange={(e) => setValor(e.target.value)}
                />
              </div>
              {!hasLeadAtivo && (
                <div className="space-y-1.5">
                  <Label className="text-xs">Origem do lead</Label>
                  <Select value={origemLead} onValueChange={setOrigemLead}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione (opcional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="whatsapp">WhatsApp</SelectItem>
                      <SelectItem value="telefone">Telefone</SelectItem>
                      <SelectItem value="site">Site</SelectItem>
                      <SelectItem value="indicacao">Indicação</SelectItem>
                      <SelectItem value="redes_sociais">Redes sociais</SelectItem>
                      <SelectItem value="outro">Outro</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
              <div className="space-y-1.5">
                <Label className="text-xs">Observações</Label>
                <Textarea
                  placeholder="Notas adicionais..."
                  value={observacoes}
                  onChange={(e) => setObservacoes(e.target.value)}
                  rows={2}
                />
              </div>
            </div>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={(tipo === "venda" || hasLeadAtivo) && (!produtoServico.trim() || !valor)}
          >
            Confirmar e enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
