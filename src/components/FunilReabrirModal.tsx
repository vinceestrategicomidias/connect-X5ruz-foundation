import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { RotateCcw } from "lucide-react";

interface FunilReabrirModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: (observacao: string) => void;
  etapaAnterior: "vendido" | "perdido";
}

export const FunilReabrirModal = ({ open, onOpenChange, onConfirmar, etapaAnterior }: FunilReabrirModalProps) => {
  const [observacao, setObservacao] = useState("");

  const handleConfirmar = () => {
    onConfirmar(observacao.trim());
    setObservacao("");
  };

  const label = etapaAnterior === "vendido" ? "vendido" : "perdido";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <RotateCcw className="h-5 w-5 text-primary" />
            Reabrir Negociação
          </DialogTitle>
          <DialogDescription>
            Este lead estava marcado como <span className="font-semibold">{label}</span>. 
            Ao reabrir, o histórico será mantido e a negociação será retomada.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3">
          <div>
            <label className="text-sm font-medium">Motivo da reabertura</label>
            <Textarea
              placeholder="Ex: Cliente retomou contato, nova proposta solicitada..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              className="mt-1.5"
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmar}>
            Reabrir Lead
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
