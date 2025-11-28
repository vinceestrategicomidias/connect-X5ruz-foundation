import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Delete } from "lucide-react";
import { useIniciarChamada } from "@/hooks/useChamadas";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useChamadaContext } from "@/contexts/ChamadaContext";
import { usePacientes } from "@/hooks/usePacientes";
import { toast } from "sonner";

interface DiscadorTelefonicoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const DiscadorTelefonico = ({
  open,
  onOpenChange,
}: DiscadorTelefonicoProps) => {
  const [numero, setNumero] = useState("");
  const iniciarChamada = useIniciarChamada();
  const { atendenteLogado } = useAtendenteContext();
  const { setChamadaAtiva } = useChamadaContext();
  const { data: pacientes } = usePacientes();

  const teclas = [
    { numero: "1", letras: "" },
    { numero: "2", letras: "ABC" },
    { numero: "3", letras: "DEF" },
    { numero: "4", letras: "GHI" },
    { numero: "5", letras: "JKL" },
    { numero: "6", letras: "MNO" },
    { numero: "7", letras: "PQRS" },
    { numero: "8", letras: "TUV" },
    { numero: "9", letras: "WXYZ" },
    { numero: "*", letras: "" },
    { numero: "0", letras: "+" },
    { numero: "#", letras: "" },
  ];

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      if (e.key >= "0" && e.key <= "9") {
        setNumero((prev) => prev + e.key);
      } else if (e.key === "*" || e.key === "#") {
        setNumero((prev) => prev + e.key);
      } else if (e.key === "Backspace") {
        setNumero((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter" && numero.length > 0) {
        handleLigar();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [open, numero]);

  const handleClickTecla = (tecla: string) => {
    setNumero((prev) => prev + tecla);
  };

  const handleApagar = () => {
    setNumero((prev) => prev.slice(0, -1));
  };

  const handleLigar = async () => {
    if (!numero.trim() || !atendenteLogado) {
      toast.error("Digite um número válido");
      return;
    }

    const paciente = pacientes?.find((p) => p.telefone === numero);

    const chamada = await iniciarChamada.mutateAsync({
      numeroDiscado: numero,
      atendenteId: atendenteLogado.id,
      setorOrigem: atendenteLogado.setor_id,
      pacienteId: paciente?.id,
      tipo: paciente ? "paciente" : "manual",
    });

    setChamadaAtiva(chamada);
    onOpenChange(false);
    setNumero("");

    if (paciente) {
      toast.success(`Ligando para ${paciente.nome}`);
    } else {
      toast.success(`Ligando para ${numero}`);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Discador</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Display do Número */}
          <div className="relative">
            <div className="text-center text-3xl font-mono font-semibold min-h-[48px] flex items-center justify-center">
              {numero || "Digite um número"}
            </div>
            {numero && (
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-0 top-1/2 -translate-y-1/2"
                onClick={handleApagar}
              >
                <Delete className="h-5 w-5" />
              </Button>
            )}
          </div>

          {/* Teclado Numérico */}
          <div className="grid grid-cols-3 gap-3">
            {teclas.map((tecla) => (
              <Button
                key={tecla.numero}
                variant="outline"
                className="h-16 flex flex-col items-center justify-center hover:bg-[#0A2647]/10 transition-all"
                onClick={() => handleClickTecla(tecla.numero)}
              >
                <span className="text-2xl font-semibold">{tecla.numero}</span>
                {tecla.letras && (
                  <span className="text-[10px] text-muted-foreground">
                    {tecla.letras}
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Botão de Ligar */}
          <Button
            className="w-full h-14 bg-success hover:bg-success/90 text-white"
            onClick={handleLigar}
            disabled={numero.length === 0 || iniciarChamada.isPending}
          >
            <Phone className="h-5 w-5 mr-2" />
            Ligar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
