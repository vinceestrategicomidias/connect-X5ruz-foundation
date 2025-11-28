import { createContext, useContext, useState, ReactNode } from "react";
import { Paciente } from "@/hooks/usePacientes";

interface PacienteContextType {
  pacienteSelecionado: Paciente | null;
  setPacienteSelecionado: (paciente: Paciente | null) => void;
}

const PacienteContext = createContext<PacienteContextType | undefined>(undefined);

export const PacienteProvider = ({ children }: { children: ReactNode }) => {
  const [pacienteSelecionado, setPacienteSelecionado] = useState<Paciente | null>(null);

  return (
    <PacienteContext.Provider value={{ pacienteSelecionado, setPacienteSelecionado }}>
      {children}
    </PacienteContext.Provider>
  );
};

export const usePacienteContext = () => {
  const context = useContext(PacienteContext);
  if (!context) {
    throw new Error("usePacienteContext deve ser usado dentro de PacienteProvider");
  }
  return context;
};
