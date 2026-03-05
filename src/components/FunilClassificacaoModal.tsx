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

  useEffect(() => {
    if (open) {
      setProdutoServico(produtoServicoInicial || "");
      setValor(valorOrcamento?.toString() || "");
      setTipo("venda");
    }
  }, [open, produtoServicoInicial, valorOrcamento]);

  const handleConfirmar = () => {
    if (tipo === "apenas_contato") {
      onClassificar("apenas_contato");
    } else {
      onClassificar("venda", {
        produto_servico: produtoServico || "Orçamento",
        valor_orcamento: parseFloat(valor) || 0,
        origem_lead: origemLead || undefined,
        observacoes: observacoes || undefined,
      });
    }
    setProdutoServico("");
    setValor("");
    setOrigemLead("");
    setObservacoes("");
    setTipo("venda");
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
          {/* Tipo selection — always show */}
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
                  {hasLeadAtivo ? "Vincular ao lead ativo no funil" : "Incluir no funil de vendas como lead ativo"}
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

          {/* Banner lead ativo — show inside venda when lead exists */}
          {hasLeadAtivo && tipo === "venda" && (
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

          {/* Venda fields */}
          {tipo === "venda" && (
            <div className="space-y-3 border-t pt-3">
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
                  <select
                    className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
                    value={origemLead}
                    onChange={(e) => setOrigemLead(e.target.value)}
                  >
                    <option value="">Selecione (opcional)</option>
                    <option value="whatsapp">WhatsApp</option>
                    <option value="telefone">Telefone</option>
                    <option value="site">Site</option>
                    <option value="indicacao">Indicação</option>
                    <option value="redes_sociais">Redes sociais</option>
                    <option value="outro">Outro</option>
                  </select>
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
            disabled={tipo === "venda" && (!produtoServico.trim() || !valor)}
          >
            Confirmar e enviar
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
