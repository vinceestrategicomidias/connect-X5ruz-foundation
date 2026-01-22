import { Phone, PhoneOff, Mic, MicOff, MessageSquare, User, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChamadaContext } from "@/contexts/ChamadaContext";
import { useAtualizarChamada } from "@/hooks/useChamadas";
import { ConnectAvatar } from "./ConnectAvatar";
import { usePacientes } from "@/hooks/usePacientes";
import { usePacienteContext } from "@/contexts/PacienteContext";
import { useState } from "react";
import { PerfilPacienteSheet } from "./PerfilPacienteSheet";
import { CallNotesPanel } from "./CallNotesPanel";
import { toast } from "sonner";

export const CallFloatingCard = () => {
  const { chamadaAtiva, setChamadaAtiva, tempoDecorrido, mutado, setMutado } =
    useChamadaContext();
  const atualizarChamada = useAtualizarChamada();
  const { data: pacientes } = usePacientes();
  const { setPacienteSelecionado } = usePacienteContext();
  const [perfilAberto, setPerfilAberto] = useState(false);
  const [notasAbertas, setNotasAbertas] = useState(false);

  // Manter estado das notas mesmo após encerrar a chamada
  const [ultimaChamada, setUltimaChamada] = useState<{
    numeroDiscado: string;
    pacienteNome?: string;
  } | null>(null);

  if (!chamadaAtiva || chamadaAtiva.status === "encerrada") {
    // Se não tem chamada ativa mas tem notas abertas, manter o painel
    if (notasAbertas && ultimaChamada) {
      return (
        <CallNotesPanel
          open={notasAbertas}
          onOpenChange={(open) => {
            setNotasAbertas(open);
            if (!open) setUltimaChamada(null);
          }}
          pacienteNome={ultimaChamada.pacienteNome}
          numeroDiscado={ultimaChamada.numeroDiscado}
          chamadaAtiva={false}
          onSaveNote={(nota, transcricao) => {
            console.log("Nota salva:", { nota, transcricao });
            toast.success("Anotação salva na aba de notas do paciente");
            setNotasAbertas(false);
            setUltimaChamada(null);
          }}
        />
      );
    }
    return null;
  }

  const paciente = pacientes?.find((p) => p.id === chamadaAtiva.paciente_id);

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  };

  const handleEncerrar = async () => {
    // Salvar dados da chamada antes de encerrar para manter notas abertas
    setUltimaChamada({
      numeroDiscado: chamadaAtiva.numero_discado,
      pacienteNome: paciente?.nome,
    });

    await atualizarChamada.mutateAsync({
      chamadaId: chamadaAtiva.id,
      status: "encerrada",
    });
    setChamadaAtiva(null);
  };

  const handleAbrirConversa = () => {
    if (paciente) {
      setPacienteSelecionado(paciente);
    }
  };

  const handleAbrirPerfil = () => {
    if (paciente) {
      setPerfilAberto(true);
    }
  };

  const handleAbrirNotas = () => {
    setNotasAbertas(true);
  };

  const getStatusText = () => {
    switch (chamadaAtiva.status) {
      case "discando":
        return "Discando...";
      case "chamando":
        return "Chamando...";
      case "atendida":
        return "Em ligação";
      case "perdida":
        return "Chamada perdida";
      default:
        return "";
    }
  };

  return (
    <>
      <Card className="fixed bottom-6 right-6 w-80 p-4 connect-shadow z-50 animate-fade-in bg-card">
        <div className="flex items-start gap-3">
          <ConnectAvatar
            name={paciente?.nome || chamadaAtiva.numero_discado}
            image={paciente?.avatar || undefined}
            size="md"
          />
          <div className="flex-1 min-w-0">
            <h4 className="font-medium text-sm truncate">
              {paciente?.nome || chamadaAtiva.numero_discado}
            </h4>
            <p className="text-xs text-muted-foreground">{getStatusText()}</p>
            {chamadaAtiva.status === "atendida" && (
              <p className="text-lg font-mono font-semibold mt-1">
                {formatarTempo(tempoDecorrido)}
              </p>
            )}
          </div>
          
          {/* Botão de Notas */}
          <Button
            variant={notasAbertas ? "default" : "outline"}
            size="icon"
            className="h-8 w-8 flex-shrink-0"
            onClick={handleAbrirNotas}
            title="Anotações da ligação"
          >
            <FileText className="h-4 w-4" />
          </Button>
        </div>

        <div className="flex items-center gap-2 mt-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setMutado(!mutado)}
            className="flex-1"
            title={mutado ? "Desmutar" : "Mutar"}
          >
            {mutado ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={handleEncerrar}
            className="flex-1"
            title="Encerrar ligação"
          >
            <PhoneOff className="h-4 w-4" />
          </Button>
        </div>

        {paciente && (
          <div className="flex gap-2 mt-3">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleAbrirConversa}
            >
              <MessageSquare className="h-4 w-4 mr-2" />
              Chat
            </Button>
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleAbrirPerfil}
            >
              <User className="h-4 w-4 mr-2" />
              Perfil
            </Button>
          </div>
        )}
      </Card>

      {/* Painel de Notas */}
      <CallNotesPanel
        open={notasAbertas}
        onOpenChange={setNotasAbertas}
        pacienteNome={paciente?.nome}
        numeroDiscado={chamadaAtiva.numero_discado}
        chamadaAtiva={chamadaAtiva.status === "atendida"}
        onSaveNote={(nota, transcricao) => {
          console.log("Nota salva:", { nota, transcricao });
          toast.success("Anotação salva na aba de notas do paciente");
        }}
      />

      {paciente && (
        <PerfilPacienteSheet
          open={perfilAberto}
          onOpenChange={setPerfilAberto}
          paciente={paciente}
        />
      )}
    </>
  );
};
