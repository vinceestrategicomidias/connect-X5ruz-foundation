import { useState } from "react";
import { X, Save, FileText, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

interface CallNotesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pacienteNome?: string;
  numeroDiscado: string;
  chamadaAtiva: boolean;
  onSaveNote: (nota: string, transcricao?: string) => void;
}

export const CallNotesPanel = ({
  open,
  onOpenChange,
  pacienteNome,
  numeroDiscado,
  chamadaAtiva,
  onSaveNote,
}: CallNotesPanelProps) => {
  const [nota, setNota] = useState("");
  const [transcricaoAtiva, setTranscricaoAtiva] = useState(false);
  const [transcricao, setTranscricao] = useState("");
  const [transcricaoEmAndamento, setTranscricaoEmAndamento] = useState(false);

  if (!open) return null;

  const handleToggleTranscricao = () => {
    if (!transcricaoAtiva) {
      setTranscricaoAtiva(true);
      setTranscricaoEmAndamento(true);
      toast.info("Transcrição ativada", {
        description: "A ligação será transcrita automaticamente.",
      });
      
      // Simular transcrição em tempo real
      const frases = [
        "Olá, boa tarde!",
        "Gostaria de informações sobre o procedimento...",
        "Qual o valor aproximado?",
        "Posso agendar uma consulta?",
      ];
      
      let index = 0;
      const interval = setInterval(() => {
        if (index < frases.length) {
          setTranscricao((prev) => prev + (prev ? "\n" : "") + frases[index]);
          index++;
        } else {
          clearInterval(interval);
          setTranscricaoEmAndamento(false);
        }
      }, 3000);
    } else {
      setTranscricaoAtiva(false);
      setTranscricaoEmAndamento(false);
      toast.info("Transcrição desativada");
    }
  };

  const handleSalvar = () => {
    if (!nota.trim() && !transcricao.trim()) {
      toast.error("Adicione uma anotação ou ative a transcrição");
      return;
    }

    onSaveNote(nota, transcricao);
    toast.success("Anotação salva com sucesso!", {
      description: transcricao ? "Transcrição incluída na anotação." : undefined,
    });
    setNota("");
    setTranscricao("");
  };

  const handleFechar = () => {
    // Permite fechar mesmo com ligação ativa - a nota pode ser salva depois
    onOpenChange(false);
  };

  return (
    <Card
      className={cn(
        "fixed bottom-6 right-[360px] w-80 p-4 connect-shadow z-50 animate-fade-in bg-card",
        "border-l-4 border-l-primary"
      )}
    >
      {/* Cabeçalho */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-primary" />
          <h4 className="font-medium text-sm">Anotações da Ligação</h4>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-6 w-6"
          onClick={handleFechar}
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      {/* Info do paciente */}
      <div className="text-xs text-muted-foreground mb-3">
        {pacienteNome ? (
          <span className="font-medium text-foreground">{pacienteNome}</span>
        ) : (
          <span>{numeroDiscado}</span>
        )}
        {chamadaAtiva && (
          <Badge variant="outline" className="ml-2 text-[10px] bg-primary/10 text-primary border-primary/30">
            Em ligação
          </Badge>
        )}
      </div>

      {/* Campo de Anotação */}
      <Textarea
        placeholder="Digite suas anotações sobre a ligação..."
        value={nota}
        onChange={(e) => setNota(e.target.value)}
        className="min-h-[100px] text-sm resize-none mb-3"
      />

      {/* Toggle de Transcrição */}
      <div className="flex items-center justify-between p-2 rounded-lg bg-muted/50 mb-3">
        <div className="flex items-center gap-2">
          {transcricaoAtiva ? (
            <Mic className="h-4 w-4 text-destructive animate-pulse" />
          ) : (
            <MicOff className="h-4 w-4 text-muted-foreground" />
          )}
          <Label htmlFor="transcricao" className="text-xs cursor-pointer">
            Transcrever ligação
          </Label>
        </div>
        <Switch
          id="transcricao"
          checked={transcricaoAtiva}
          onCheckedChange={handleToggleTranscricao}
          disabled={!chamadaAtiva}
        />
      </div>

      {/* Área de Transcrição */}
      {transcricaoAtiva && (
        <div className="mb-3">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-medium text-muted-foreground">
              Transcrição
            </span>
            {transcricaoEmAndamento && (
              <Badge variant="outline" className="text-[10px] animate-pulse">
                Transcrevendo...
              </Badge>
            )}
          </div>
          <div className="p-2 rounded-lg bg-muted/30 border border-border min-h-[60px] max-h-[100px] overflow-y-auto">
            <p className="text-xs text-muted-foreground whitespace-pre-wrap">
              {transcricao || "Aguardando fala..."}
            </p>
          </div>
          <p className="text-[10px] text-muted-foreground mt-1 italic">
            ⚠️ Transcrição disponível apenas durante o expediente
          </p>
        </div>
      )}

      {/* Botões de Ação */}
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="flex-1"
          onClick={handleFechar}
        >
          Cancelar
        </Button>
        <Button
          size="sm"
          className="flex-1"
          onClick={handleSalvar}
          disabled={!nota.trim() && !transcricao.trim()}
        >
          <Save className="h-4 w-4 mr-1" />
          Salvar
        </Button>
      </div>
    </Card>
  );
};
