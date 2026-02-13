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
import { XCircle, ChevronDown, ChevronUp } from "lucide-react";

const MOTIVOS_PRINCIPAIS = [
  "Financeiro",
  "Tempo",
  "Sem interesse",
  "Fechou com concorrência",
];

const MOTIVOS_EXTRAS = [
  "Desistiu do procedimento",
  "Mudou de cidade",
  "Não respondeu mais",
  "Preferiu outro profissional",
  "Outro motivo",
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
  const [showExtras, setShowExtras] = useState(false);

  const handleConfirmar = () => {
    onConfirmar(motivo);
    setMotivo("");
    setShowExtras(false);
  };

  const handleOpenChange = (val: boolean) => {
    if (!val) { setMotivo(""); setShowExtras(false); }
    onOpenChange(val);
  };

  const renderOption = (m: string) => (
    <div
      key={m}
      className="flex items-center gap-3 p-3 rounded-lg border hover:bg-muted/50 cursor-pointer"
      onClick={() => setMotivo(m)}
    >
      <RadioGroupItem value={m} id={m} />
      <Label htmlFor={m} className="cursor-pointer text-sm">{m}</Label>
    </div>
  );

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-sm">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <XCircle className="h-5 w-5 text-destructive" />
            Marcar como Perdido
          </DialogTitle>
          <DialogDescription>Selecione o motivo da perda.</DialogDescription>
        </DialogHeader>

        <RadioGroup value={motivo} onValueChange={setMotivo} className="space-y-2 py-2">
          {MOTIVOS_PRINCIPAIS.map(renderOption)}

          {!showExtras && (
            <button
              type="button"
              onClick={() => setShowExtras(true)}
              className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto pt-1"
            >
              <ChevronDown className="h-3.5 w-3.5" />
              Ver mais motivos
            </button>
          )}

          {showExtras && (
            <>
              {MOTIVOS_EXTRAS.map(renderOption)}
              <button
                type="button"
                onClick={() => setShowExtras(false)}
                className="flex items-center gap-1.5 text-xs text-muted-foreground hover:text-foreground transition-colors mx-auto pt-1"
              >
                <ChevronUp className="h-3.5 w-3.5" />
                Ver menos
              </button>
            </>
          )}
        </RadioGroup>

        <DialogFooter>
          <Button variant="outline" onClick={() => handleOpenChange(false)}>Cancelar</Button>
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
