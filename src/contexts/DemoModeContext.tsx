import { createContext, useContext, useState, ReactNode } from "react";
import type { CargoTipo } from "./AtendenteContext";

interface DemoModeContextType {
  isDemoMode: boolean;
  demoProfile: CargoTipo | null;
  setDemoProfile: (profile: CargoTipo | null) => void;
  resetDemo: () => void;
}

const DemoModeContext = createContext<DemoModeContextType | undefined>(undefined);

export const DemoModeProvider = ({ children }: { children: ReactNode }) => {
  const [demoProfile, setDemoProfile] = useState<CargoTipo | null>(null);

  const isDemoMode = demoProfile !== null;

  const resetDemo = () => {
    setDemoProfile(null);
  };

  return (
    <DemoModeContext.Provider
      value={{
        isDemoMode,
        demoProfile,
        setDemoProfile,
        resetDemo,
      }}
    >
      {children}
    </DemoModeContext.Provider>
  );
};

export const useDemoMode = () => {
  const context = useContext(DemoModeContext);
  if (context === undefined) {
    throw new Error("useDemoMode must be used within a DemoModeProvider");
  }
  return context;
};
