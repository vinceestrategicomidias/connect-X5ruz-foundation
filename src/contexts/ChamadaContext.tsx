import { createContext, useContext, useState, ReactNode, useEffect, useRef } from "react";
import { Chamada } from "@/hooks/useChamadas";
import { loadRingingAudio } from "@/utils/audioUtils";

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
  const ringingAudioRef = useRef<HTMLAudioElement | null>(null);

  // Controlar som de ligando
  useEffect(() => {
    const isRinging = chamadaAtiva && 
      (chamadaAtiva.status === "discando" || chamadaAtiva.status === "chamando");

    if (isRinging) {
      // Criar e tocar áudio de ringing
      if (!ringingAudioRef.current) {
        ringingAudioRef.current = loadRingingAudio();
      }
      
      ringingAudioRef.current.play().catch(error => {
        console.log("Erro ao tocar som de ringing:", error);
      });
    } else {
      // Parar áudio quando não estiver discando/chamando
      if (ringingAudioRef.current) {
        ringingAudioRef.current.pause();
        ringingAudioRef.current.currentTime = 0;
      }
    }

    // Cleanup ao desmontar
    return () => {
      if (ringingAudioRef.current) {
        ringingAudioRef.current.pause();
        ringingAudioRef.current.currentTime = 0;
      }
    };
  }, [chamadaAtiva?.status]);

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
