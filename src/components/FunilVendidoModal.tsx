import { useState } from "react";
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
  onConfirmar: (dados: { valor_final: number; forma_pagamento: string }) => void;
  valorOrcamento?: number;
}

export const FunilVendidoModal = ({
  open,
  onOpenChange,
  onConfirmar,
  valorOrcamento,
}: FunilVendidoModalProps) => {
  const [valorFinal, setValorFinal] = useState(valorOrcamento?.toString() || "");
  const [formaPagamento, setFormaPagamento] = useState("");

  const handleConfirmar = () => {
    onConfirmar({
      valor_final: parseFloat(valorFinal) || 0,
      forma_pagamento: formaPagamento,
    });
    setValorFinal("");
    setFormaPagamento("");
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
                <SelectItem value="cartao_credito">Cartão de crédito</SelectItem>
                <SelectItem value="cartao_debito">Cartão de débito</SelectItem>
                <SelectItem value="boleto">Boleto</SelectItem>
                <SelectItem value="dinheiro">Dinheiro</SelectItem>
                <SelectItem value="convenio">Convênio</SelectItem>
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
