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
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { ArrowRight, CheckCircle, Send } from "lucide-react";

interface TransferenciaJustificativaDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pacienteNome: string;
  destinoNome: string;
  tipoDestino: "atendente" | "setor" | "fila" | "fila_geral";
  onConfirmar: (motivo: string, observacao?: string) => void;
}

const MOTIVOS_TRANSFERENCIA = [
  { id: "assunto_nao_identificado", nome: "Assunto não identificado" },
  { id: "fila_interna_redirecionamento", nome: "Redirecionamento para setor responsável" },
  { id: "necessita_especialista", nome: "Necessita apoio/atendimento especializado" },
];

export const TransferenciaJustificativaDialog = ({
  open,
  onOpenChange,
  pacienteNome,
  destinoNome,
  tipoDestino,
  onConfirmar,
}: TransferenciaJustificativaDialogProps) => {
  const [etapa, setEtapa] = useState<1 | 2>(1);
  const [motivoSelecionado, setMotivoSelecionado] = useState("");
  const [observacao, setObservacao] = useState("");

  const getDestinoLabel = () => {
    switch (tipoDestino) {
      case "atendente":
        return `Atendente: ${destinoNome}`;
      case "setor":
        return `Setor: ${destinoNome}`;
      case "fila":
        return `Fila do Setor`;
      case "fila_geral":
        return `Fila Geral (sem destino definido)`;
      default:
        return destinoNome;
    }
  };

  const handleConfirmar = () => {
    if (!motivoSelecionado) return;
    onConfirmar(motivoSelecionado, observacao || undefined);
    // Reset
    setEtapa(1);
    setMotivoSelecionado("");
    setObservacao("");
    onOpenChange(false);
  };

  const handleClose = () => {
    setEtapa(1);
    setMotivoSelecionado("");
    setObservacao("");
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Justificativa da Transferência</DialogTitle>
        </DialogHeader>

        {/* Indicador de etapas */}
        <div className="flex items-center justify-center gap-2 py-2">
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              etapa >= 1 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            {etapa > 1 ? <CheckCircle className="h-4 w-4" /> : "1"}
          </div>
          <div className="w-12 h-0.5 bg-muted">
            <div
              className={`h-full transition-all ${etapa >= 2 ? "bg-primary w-full" : "w-0"}`}
            />
          </div>
          <div
            className={`flex items-center justify-center w-8 h-8 rounded-full text-sm font-medium ${
              etapa >= 2 ? "bg-primary text-primary-foreground" : "bg-muted text-muted-foreground"
            }`}
          >
            2
          </div>
        </div>

        {/* Resumo da transferência */}
        <div className="p-3 bg-muted rounded-lg text-sm space-y-1">
          <p>
            <span className="text-muted-foreground">Paciente:</span>{" "}
            <span className="font-medium">{pacienteNome}</span>
          </p>
          <div className="flex items-center gap-2">
            <span className="text-muted-foreground">Destino:</span>
            <ArrowRight className="h-3 w-3 text-muted-foreground" />
            <span className="font-medium">{getDestinoLabel()}</span>
          </div>
        </div>

        {etapa === 1 && (
          <div className="space-y-4">
            <Label>Selecione o motivo da transferência *</Label>
            <RadioGroup value={motivoSelecionado} onValueChange={setMotivoSelecionado}>
              {MOTIVOS_TRANSFERENCIA.map((motivo) => (
                <div
                  key={motivo.id}
                  className={`flex items-center space-x-3 p-3 border rounded-lg cursor-pointer transition-colors ${
                    motivoSelecionado === motivo.id
                      ? "border-primary bg-primary/5"
                      : "hover:bg-muted"
                  }`}
                  onClick={() => setMotivoSelecionado(motivo.id)}
                >
                  <RadioGroupItem value={motivo.id} id={motivo.id} />
                  <Label htmlFor={motivo.id} className="cursor-pointer flex-1">
                    {motivo.nome}
                  </Label>
                </div>
              ))}
            </RadioGroup>
          </div>
        )}

        {etapa === 2 && (
          <div className="space-y-4">
            <div>
              <Label className="text-muted-foreground">Motivo selecionado:</Label>
              <p className="font-medium">
                {MOTIVOS_TRANSFERENCIA.find((m) => m.id === motivoSelecionado)?.nome}
              </p>
            </div>
            <div className="space-y-2">
              <Label>Observação (opcional)</Label>
              <Textarea
                value={observacao}
                onChange={(e) => setObservacao(e.target.value)}
                placeholder="Adicione detalhes sobre a transferência..."
                rows={3}
              />
            </div>
          </div>
        )}

        <DialogFooter className="gap-2">
          {etapa === 1 ? (
            <>
              <Button variant="outline" onClick={handleClose}>
                Cancelar
              </Button>
              <Button
                onClick={() => setEtapa(2)}
                disabled={!motivoSelecionado}
                className="gap-2"
              >
                Próximo
                <ArrowRight className="h-4 w-4" />
              </Button>
            </>
          ) : (
            <>
              <Button variant="outline" onClick={() => setEtapa(1)}>
                Voltar
              </Button>
              <Button onClick={handleConfirmar} className="gap-2">
                <Send className="h-4 w-4" />
                Confirmar Transferência
              </Button>
            </>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
