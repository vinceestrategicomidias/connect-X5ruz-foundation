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
    // Se tempo excedido, mostrar vermelho
    if (status === "espera" && tempoNaFila >= tempoLimite) {
      return "#EF4444";
    }

    switch (status) {
      case "espera":
        return "#EAB308"; // amarelo
      case "andamento":
        return "#22C55E"; // verde
      case "finalizado":
        return "#2C2C2C"; // cinza
      case "online":
        return "#22C55E"; // verde
      case "offline":
        return "#2C2C2C"; // cinza
      default:
        return "#2C2C2C";
    }
  };

  const mostrarAlerta = status === "espera" && tempoNaFila >= tempoLimite;

  return (
    <div className="flex items-center gap-1.5">
      <div
        className={`w-2 h-2 rounded-full ${mostrarAlerta ? 'animate-pulse-alert' : ''}`}
        style={{ backgroundColor: getStatusColor() }}
      />
      {mostrarAlerta && (
        <AlertCircle className="w-3 h-3 text-[#EF4444] animate-pulse-alert" />
      )}
    </div>
  );
};
