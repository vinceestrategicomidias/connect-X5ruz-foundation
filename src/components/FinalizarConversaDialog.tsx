import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface FinalizarConversaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pacienteNome: string;
  onConfirmar: (dados: {
    motivo: string;
    submotivo?: string;
    observacao?: string;
  }) => Promise<void>;
}

const MOTIVOS = [
  { id: "vendido", nome: "Vendido" },
  { id: "em_negociacao", nome: "Em negociação" },
  { id: "objecao", nome: "Objeção" },
];

const SUBMOTIVOS_OBJECAO = [
  { id: "financeiro", nome: "Financeiro" },
  { id: "tempo", nome: "Tempo" },
  { id: "sem_interesse", nome: "Sem interesse" },
  { id: "concorrencia", nome: "Fechou com concorrência" },
];

export const FinalizarConversaDialog = ({
  open,
  onOpenChange,
  pacienteNome,
  onConfirmar,
}: FinalizarConversaDialogProps) => {
  const [motivo, setMotivo] = useState("");
  const [submotivo, setSubmotivo] = useState("");
  const [observacao, setObservacao] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const exigeSubmotivo = motivo === "objecao";

  const handleConfirmar = async () => {
    if (!motivo) {
      toast.error("Selecione um motivo");
      return;
    }

    if (exigeSubmotivo && !submotivo) {
      toast.error("Selecione um submotivo para Objeção");
      return;
    }

    setIsLoading(true);
    try {
      await onConfirmar({
        motivo,
        submotivo: exigeSubmotivo ? submotivo : undefined,
        observacao: observacao.trim() || undefined,
      });
      
      // Limpar campos
      setMotivo("");
      setSubmotivo("");
      setObservacao("");
      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao finalizar:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setMotivo("");
    setSubmotivo("");
    setObservacao("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Finalizar conversa</DialogTitle>
          <p className="text-sm text-muted-foreground">
            Finalizando atendimento de <strong>{pacienteNome}</strong>
          </p>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label htmlFor="motivo">Motivo da finalização *</Label>
            <Select value={motivo} onValueChange={setMotivo}>
              <SelectTrigger id="motivo">
                <SelectValue placeholder="Selecione o motivo" />
              </SelectTrigger>
              <SelectContent>
                {MOTIVOS.map((m) => (
                  <SelectItem key={m.id} value={m.id}>
                    {m.nome}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {exigeSubmotivo && (
            <div className="space-y-2">
              <Label htmlFor="submotivo">Submotivo *</Label>
              <Select value={submotivo} onValueChange={setSubmotivo}>
                <SelectTrigger id="submotivo">
                  <SelectValue placeholder="Selecione o submotivo" />
                </SelectTrigger>
                <SelectContent>
                  {SUBMOTIVOS_OBJECAO.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.nome}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="observacao">Observação (opcional)</Label>
            <Textarea
              id="observacao"
              placeholder="Adicione uma observação..."
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={3}
            />
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose} disabled={isLoading}>
            Cancelar
          </Button>
          <Button onClick={handleConfirmar} disabled={isLoading}>
            {isLoading ? "Finalizando..." : "Confirmar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
