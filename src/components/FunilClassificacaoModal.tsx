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
import { ShoppingCart, MessageSquare } from "lucide-react";

interface FunilClassificacaoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onClassificar: (tipo: "venda" | "apenas_contato", dados?: {
    produto_servico: string;
    valor_orcamento: number;
    origem_lead?: string;
    observacoes?: string;
  }) => void;
  valorOrcamento?: number;
  produtoServico?: string;
}

export const FunilClassificacaoModal = ({
  open,
  onOpenChange,
  onClassificar,
  valorOrcamento,
  produtoServico: produtoServicoInicial,
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
    // Reset
    setProdutoServico("");
    setValor("");
    setOrigemLead("");
    setObservacoes("");
    setTipo("venda");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Classificação do envio</DialogTitle>
          <DialogDescription>
            Este envio de orçamento é uma venda em potencial ou apenas um contato informativo?
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-2">
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
