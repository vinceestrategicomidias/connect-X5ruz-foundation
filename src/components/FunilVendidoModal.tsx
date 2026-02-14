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
import { CheckCircle } from "lucide-react";

interface FunilVendidoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: (dados: { valor_final: number; forma_pagamento: string; produto_servico?: string }) => void;
  valorOrcamento?: number;
  produtoServico?: string;
}

export const FunilVendidoModal = ({
  open,
  onOpenChange,
  onConfirmar,
  valorOrcamento,
  produtoServico: produtoInicial,
}: FunilVendidoModalProps) => {
  const [valorFinal, setValorFinal] = useState(valorOrcamento?.toString() || "");
  const [formaPagamento, setFormaPagamento] = useState("");
  const [produto, setProduto] = useState(produtoInicial || "");

  useEffect(() => {
    if (open) {
      setValorFinal(valorOrcamento?.toString() || "");
      setProduto(produtoInicial || "");
    }
  }, [open, valorOrcamento, produtoInicial]);

  const handleConfirmar = () => {
    onConfirmar({
      valor_final: parseFloat(valorFinal) || 0,
      forma_pagamento: formaPagamento,
      produto_servico: produto || undefined,
    });
    setValorFinal("");
    setFormaPagamento("");
    setProduto("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CheckCircle className="h-5 w-5 text-green-600" />
            Confirmar Venda
          </DialogTitle>
          <DialogDescription>Preencha os dados do fechamento.</DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-2">
          <div className="space-y-1.5">
            <Label className="text-xs">Produto/Serviço</Label>
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
                <SelectItem value="nao_informado">Não informado</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            onClick={handleConfirmar}
            disabled={!valorFinal || !formaPagamento}
            className="bg-green-600 hover:bg-green-700"
          >
            Confirmar venda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
