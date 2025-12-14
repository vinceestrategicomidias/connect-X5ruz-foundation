import { AlertCircle } from "lucide-react";

interface ConnectStatusIndicatorProps {
  status: "online" | "offline" | "espera" | "andamento" | "finalizado";
  tempoNaFila?: number;
  tempoLimite?: number;
}

export const ConnectStatusIndicator = ({ 
  status, 
  tempoNaFila = 0,
  tempoLimite = 30 
}: ConnectStatusIndicatorProps) => {
  const getStatusColor = () => {
    // Cores baseadas no tempo de espera para status "espera"
    if (status === "espera") {
      if (tempoNaFila >= tempoLimite) {
        return "#EF4444"; // vermelho - alerta crítico
      }
      if (tempoNaFila >= 15) {
        return "#F97316"; // laranja - atenção
      }
      if (tempoNaFila >= 10) {
        return "#EAB308"; // amarelo - atenção leve
      }
      return "#22C55E"; // verde - chegou recentemente
    }

    switch (status) {
      case "andamento":
        return "#22C55E"; // verde
      case "finalizado":
        return "#6B7280"; // cinza
      case "online":
        return "#22C55E"; // verde
      case "offline":
        return "#6B7280"; // cinza
      default:
        return "#6B7280";
    }
  };

  const mostrarAlerta = status === "espera" && tempoNaFila >= tempoLimite;

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-2.5 h-2.5 rounded-full ${mostrarAlerta ? 'animate-pulse' : ''}`}
        style={{ backgroundColor: getStatusColor() }}
      />
      {mostrarAlerta && (
        <AlertCircle className="w-3.5 h-3.5 text-destructive animate-pulse" />
      )}
    </div>
  );
};
