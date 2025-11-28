import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Phone, Delete, X } from "lucide-react";
import { useIniciarChamada } from "@/hooks/useChamadas";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useChamadaContext } from "@/contexts/ChamadaContext";
import { usePacientes } from "@/hooks/usePacientes";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

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

  // Reset número ao fechar
  useEffect(() => {
    if (!open) {
      setNumero("");
    }
  }, [open]);

  // Suporte a teclado físico
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;

      // Prevenir ações padrão para teclas específicas
      if (["Backspace", "Enter"].includes(e.key)) {
        e.preventDefault();
      }

      if (e.key >= "0" && e.key <= "9") {
        setNumero((prev) => prev + e.key);
      } else if (e.key === "*" || e.key === "#") {
        setNumero((prev) => prev + e.key);
      } else if (e.key === "Backspace") {
        setNumero((prev) => prev.slice(0, -1));
      } else if (e.key === "Enter" && numero.length > 0) {
        handleLigar();
      } else if (e.key === "Escape") {
        onOpenChange(false);
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

  const handleLimparTudo = () => {
    setNumero("");
  };

  const handleLigar = async () => {
    if (!numero.trim() || !atendenteLogado) {
      toast.error("Digite um número válido");
      return;
    }

    try {
      // Buscar paciente pelo telefone
      const paciente = pacientes?.find((p) => p.telefone === numero);

      // Criar chamada no banco
      const chamada = await iniciarChamada.mutateAsync({
        numeroDiscado: numero,
        atendenteId: atendenteLogado.id,
        setorOrigem: atendenteLogado.setor_id,
        pacienteId: paciente?.id,
        tipo: paciente ? "paciente" : "manual",
      });

      // Ativar card de ligação
      setChamadaAtiva(chamada);
      
      // Fechar discador e limpar número
      onOpenChange(false);
      setNumero("");

      // Feedback ao usuário
      if (paciente) {
        toast.success(`Ligando para ${paciente.nome}`, {
          description: numero,
        });
      } else {
        toast.success(`Ligando para ${numero}`, {
          description: "Número desconhecido",
        });
      }
    } catch (error) {
      toast.error("Erro ao iniciar chamada");
      console.error("Erro ao iniciar chamada:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[380px] p-0 gap-0 overflow-hidden">
        {/* Cabeçalho */}
        <DialogHeader className="px-6 py-4 border-b border-border bg-muted/30">
          <div className="flex items-center justify-between">
            <DialogTitle className="text-lg font-semibold">Discador</DialogTitle>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8"
              onClick={() => onOpenChange(false)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </DialogHeader>

        <div className="px-6 py-6 space-y-6">
          {/* Display do Número */}
          <div className="relative bg-muted/30 rounded-lg p-4 min-h-[72px] flex items-center justify-center">
            <div
              className={cn(
                "text-center font-mono font-semibold transition-all",
                numero ? "text-3xl text-foreground" : "text-xl text-muted-foreground"
              )}
            >
              {numero || "Digite um número"}
            </div>
            {numero && (
              <div className="absolute right-2 top-1/2 -translate-y-1/2 flex gap-1">
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-8 w-8 hover:bg-destructive/10 hover:text-destructive"
                  onClick={handleApagar}
                  title="Apagar último dígito (Backspace)"
                >
                  <Delete className="h-4 w-4" />
                </Button>
              </div>
            )}
          </div>

          {/* Teclado Numérico Estilo Celular */}
          <div className="grid grid-cols-3 gap-3">
            {teclas.map((tecla) => (
              <Button
                key={tecla.numero}
                variant="outline"
                className={cn(
                  "h-16 w-full rounded-full flex flex-col items-center justify-center",
                  "hover:bg-primary/10 hover:border-primary/50 hover:scale-105",
                  "active:scale-95 transition-all duration-150",
                  "shadow-sm hover:shadow-md"
                )}
                onClick={() => handleClickTecla(tecla.numero)}
              >
                <span className="text-2xl font-semibold leading-none">
                  {tecla.numero}
                </span>
                {tecla.letras && (
                  <span className="text-[9px] text-muted-foreground mt-0.5 leading-none">
                    {tecla.letras}
                  </span>
                )}
              </Button>
            ))}
          </div>

          {/* Botões de Ação */}
          <div className="space-y-3">
            {/* Botão Ligar */}
            <Button
              className={cn(
                "w-full h-14 rounded-full shadow-lg",
                "bg-green-600 hover:bg-green-700 text-white",
                "font-semibold text-base",
                "transition-all duration-200",
                "hover:scale-[1.02] active:scale-95",
                "disabled:opacity-50 disabled:cursor-not-allowed"
              )}
              onClick={handleLigar}
              disabled={numero.length === 0 || iniciarChamada.isPending}
            >
              <Phone className="h-5 w-5 mr-2" />
              {iniciarChamada.isPending ? "Ligando..." : "Ligar"}
            </Button>

            {/* Botão Limpar Tudo */}
            {numero && (
              <Button
                variant="outline"
                size="sm"
                className="w-full text-xs"
                onClick={handleLimparTudo}
              >
                Limpar tudo
              </Button>
            )}
          </div>

          {/* Dica de uso */}
          <div className="text-center text-xs text-muted-foreground">
            Dica: Use o teclado numérico ou pressione <kbd className="px-1 py-0.5 bg-muted rounded text-[10px]">Enter</kbd> para ligar
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
