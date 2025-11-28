import { useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useIniciarChamada } from "@/hooks/useChamadas";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useChamadaContext } from "@/contexts/ChamadaContext";
import { usePacientes } from "@/hooks/usePacientes";
import { toast } from "sonner";

export const ManualDialer = () => {
  const [numero, setNumero] = useState("");
  const iniciarChamada = useIniciarChamada();
  const { atendenteLogado } = useAtendenteContext();
  const { setChamadaAtiva } = useChamadaContext();
  const { data: pacientes } = usePacientes();

  const handleLigar = async () => {
    if (!numero.trim() || !atendenteLogado) {
      toast.error("Digite um número válido");
      return;
    }

    // Verificar se o número pertence a algum paciente
    const paciente = pacientes?.find((p) => p.telefone === numero);

    const chamada = await iniciarChamada.mutateAsync({
      numeroDiscado: numero,
      atendenteId: atendenteLogado.id,
      setorOrigem: atendenteLogado.setor_id,
      pacienteId: paciente?.id,
      tipo: paciente ? "paciente" : "manual",
    });

    setChamadaAtiva(chamada);
    setNumero("");

    if (paciente) {
      toast.success(`Ligando para ${paciente.nome}`);
    } else {
      toast.success(`Ligando para ${numero}`);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      handleLigar();
    }
  };

  return (
    <div className="flex items-center gap-2">
      <Input
        type="tel"
        placeholder="Digite o número..."
        value={numero}
        onChange={(e) => setNumero(e.target.value)}
        onKeyPress={handleKeyPress}
        className="w-48"
      />
      <Button
        size="icon"
        onClick={handleLigar}
        disabled={!numero.trim() || iniciarChamada.isPending}
      >
        <Phone className="h-4 w-4" />
      </Button>
    </div>
  );
};
