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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { CheckCircle, FileText } from "lucide-react";
import { Orcamento } from "@/hooks/useOrcamentos";

interface FunilVendidoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: (dados: {
    valor_final: number;
    forma_pagamento: string;
    produto_servico?: string;
    orcamento_id?: string;
  }) => void;
  valorOrcamento?: number;
  produtoServico?: string;
  orcamentos?: Orcamento[];
}

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const FunilVendidoModal = ({
  open,
  onOpenChange,
  onConfirmar,
  valorOrcamento,
  produtoServico: produtoInicial,
  orcamentos = [],
}: FunilVendidoModalProps) => {
  const [orcamentoSelecionadoId, setOrcamentoSelecionadoId] = useState("");
  const [valorFinal, setValorFinal] = useState(valorOrcamento?.toString() || "");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [produto, setProduto] = useState(produtoInicial || "");

  const hasMultiple = orcamentos.length > 1;
  const hasSingle = orcamentos.length === 1;

  useEffect(() => {
    if (open) {
      setFormaPagamento("");
      if (hasSingle) {
        const orc = orcamentos[0];
        setOrcamentoSelecionadoId(orc.id);
        setProduto(orc.produto_nome);
        setValorFinal((orc.valor_com_desconto ?? orc.valor_total).toString());
      } else if (hasMultiple) {
        setOrcamentoSelecionadoId("");
        setProduto("");
        setValorFinal("");
      } else {
        setOrcamentoSelecionadoId("");
        setProduto(produtoInicial || "");
        setValorFinal(valorOrcamento?.toString() || "");
      }
    }
  }, [open, orcamentos.length]);

  const handleOrcamentoChange = (orcId: string) => {
    setOrcamentoSelecionadoId(orcId);
    const orc = orcamentos.find((o) => o.id === orcId);
    if (orc) {
      setProduto(orc.produto_nome);
      setValorFinal((orc.valor_com_desconto ?? orc.valor_total).toString());
    }
  };

  const handleConfirmar = () => {
    onConfirmar({
      valor_final: parseFloat(valorFinal) || 0,
      forma_pagamento: formaPagamento,
      produto_servico: produto || undefined,
      orcamento_id: orcamentoSelecionadoId || undefined,
    });
    setValorFinal("");
    setFormaPagamento("");
    setProduto("");
    setOrcamentoSelecionadoId("");
  };

  const isValid =
    !!valorFinal &&
    !!formaPagamento &&
    (hasMultiple ? !!orcamentoSelecionadoId : true);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Finalizar como VENDIDO
          </DialogTitle>
          <DialogDescription>Preencha os dados do fechamento.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          {/* Budget selection - only when there are budgets */}
          {orcamentos.length > 0 && (
            <div className="space-y-1.5">
              <Label className="text-xs flex items-center gap-1">
                <FileText className="h-3 w-3" />
                Selecione o orçamento fechado {hasMultiple && "*"}
              </Label>
              <Select
                value={orcamentoSelecionadoId}
                onValueChange={handleOrcamentoChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o orçamento" />
                </SelectTrigger>
                <SelectContent>
                  {orcamentos.map((orc) => (
                    <SelectItem key={orc.id} value={orc.id}>
                      #{String(orc.numero_sequencial).padStart(3, "0")} — {orc.produto_nome} — {formatCurrency(orc.valor_com_desconto ?? orc.valor_total)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label className="text-xs">Produto *</Label>
            <Input
              value={produto}
              onChange={(e) => setProduto(e.target.value)}
              placeholder="Ex: Connect, CRM..."
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Valor final fechado (R$) *</Label>
            <Input
              type="number"
              step="0.01"
              value={valorFinal}
              onChange={(e) => setValorFinal(e.target.value)}
            />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Forma de pagamento *</Label>
            <Select value={formaPagamento} onValueChange={setFormaPagamento}>
              <SelectTrigger>
                <SelectValue placeholder="Selecione" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="pix">PIX</SelectItem>
                <SelectItem value="cartao">Cartão</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
                <SelectItem value="transferencia">Transferência</SelectItem>
                <SelectItem value="parcelado">Parcelado</SelectItem>
                <SelectItem value="nao_informado">Não informado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button
            onClick={handleConfirmar}
            disabled={!isValid}
            className="bg-green-600 hover:bg-green-700"
          >
            Confirmar venda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
