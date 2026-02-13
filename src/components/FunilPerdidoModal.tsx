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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { XCircle } from "lucide-react";

const MOTIVOS_PERDA = [
  "Financeiro",
  "Tempo",
  "Sem interesse",
  "Fechou com concorrência",
];

interface FunilPerdidoModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirmar: (motivo: string) => void;
}

export const FunilPerdidoModal = ({
  open,
  onOpenChange,
  onConfirmar,
}: FunilPerdidoModalProps) => {
  const [motivo, setMotivo] = useState("");

  const handleConfirmar = () => {
    onConfirmar(motivo);
    setMotivo("");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Marcar como Perdido
          </DialogTitle>
          <DialogDescription>Selecione o motivo da perda.</DialogDescription>
        </DialogHeader>

        <RadioGroup value={motivo} onValueChange={setMotivo} className="space-y-2 py-2">
          {MOTIVOS_PERDA.map((m) => (
            <div
              key={m}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
              onClick={() => setMotivo(m)}
            >
              <RadioGroupItem value={m} id={m} />
              <Label htmlFor={m} className="cursor-pointer text-sm">{m}</Label>
            </div>
          ))}
        </RadioGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>Cancelar</Button>
          <Button
            variant="destructive"
            onClick={handleConfirmar}
            disabled={!motivo}
          >
            Confirmar perda
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
