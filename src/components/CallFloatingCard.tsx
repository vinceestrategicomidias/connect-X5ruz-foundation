import { Phone, PhoneOff, Mic, MicOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useChamadaContext } from "@/contexts/ChamadaContext";
import { useAtualizarChamada } from "@/hooks/useChamadas";
import { ConnectAvatar } from "./ConnectAvatar";
import { usePacientes } from "@/hooks/usePacientes";
import { usePacienteContext } from "@/contexts/PacienteContext";

export const CallFloatingCard = () => {
  const { chamadaAtiva, setChamadaAtiva, tempoDecorrido, mutado, setMutado } =
    useChamadaContext();
  const atualizarChamada = useAtualizarChamada();
  const { data: pacientes } = usePacientes();
  const { setPacienteSelecionado } = usePacienteContext();

  if (!chamadaAtiva || chamadaAtiva.status === "encerrada") return null;

  const paciente = pacientes?.find((p) => p.id === chamadaAtiva.paciente_id);

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins.toString().padStart(2, "0")}:${segs.toString().padStart(2, "0")}`;
  };

  const handleEncerrar = async () => {
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
      </div>

      <div className="flex items-center gap-2 mt-4">
        <Button
          variant="outline"
          size="icon"
          onClick={() => setMutado(!mutado)}
          className="flex-1"
        >
          {mutado ? <MicOff className="h-4 w-4" /> : <Mic className="h-4 w-4" />}
        </Button>
        <Button
          variant="destructive"
          size="icon"
          onClick={handleEncerrar}
          className="flex-1"
        >
          <PhoneOff className="h-4 w-4" />
        </Button>
      </div>

      {paciente && (
        <Button
          variant="outline"
          size="sm"
          className="w-full mt-3"
          onClick={handleAbrirConversa}
        >
          Abrir Conversa
        </Button>
      )}

      {chamadaAtiva.status === "discando" && (
        <div className="mt-3 flex gap-2">
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={async () => {
              await atualizarChamada.mutateAsync({
                chamadaId: chamadaAtiva.id,
                status: "atendida",
              });
            }}
          >
            Atendeu
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="flex-1"
            onClick={async () => {
              await atualizarChamada.mutateAsync({
                chamadaId: chamadaAtiva.id,
                status: "perdida",
              });
              setChamadaAtiva(null);
            }}
          >
            Perdida
          </Button>
        </div>
      )}
    </Card>
  );
};
