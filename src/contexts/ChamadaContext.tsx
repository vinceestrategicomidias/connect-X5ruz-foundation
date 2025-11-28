import { createContext, useContext, useState, ReactNode, useEffect } from "react";
import { Chamada } from "@/hooks/useChamadas";

interface ChamadaContextType {
  chamadaAtiva: Chamada | null;
  setChamadaAtiva: (chamada: Chamada | null) => void;
  tempoDecorrido: number;
  mutado: boolean;
  setMutado: (mutado: boolean) => void;
}

const ChamadaContext = createContext<ChamadaContextType | undefined>(undefined);

export const ChamadaProvider = ({ children }: { children: ReactNode }) => {
  const [chamadaAtiva, setChamadaAtiva] = useState<Chamada | null>(null);
  const [tempoDecorrido, setTempoDecorrido] = useState(0);
  const [mutado, setMutado] = useState(false);

  useEffect(() => {
    if (!chamadaAtiva || chamadaAtiva.status === "encerrada") {
      setTempoDecorrido(0);
      return;
    }

    const intervalo = setInterval(() => {
      const inicio = new Date(chamadaAtiva.horario_inicio);
      const agora = new Date();
      const segundos = Math.floor((agora.getTime() - inicio.getTime()) / 1000);
      setTempoDecorrido(segundos);
    }, 1000);

    return () => clearInterval(intervalo);
  }, [chamadaAtiva]);

  return (
    <ChamadaContext.Provider
      value={{
        chamadaAtiva,
        setChamadaAtiva,
        tempoDecorrido,
        mutado,
        setMutado,
      }}
    >
      {children}
    </ChamadaContext.Provider>
  );
};

export const useChamadaContext = () => {
  const context = useContext(ChamadaContext);
  if (!context) {
    throw new Error("useChamadaContext deve ser usado dentro de ChamadaProvider");
  }
  return context;
};
