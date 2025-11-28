import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useDemoMode } from "./DemoModeContext";

export type CargoTipo = "atendente" | "coordenacao" | "gestor";

export interface AtendenteLogado {
  id: string;
  nome: string;
  cargo: CargoTipo;
  setor_id: string;
  avatar: string | null;
}

interface AtendenteContextType {
  atendenteLogado: AtendenteLogado | null;
  setAtendenteLogado: (atendente: AtendenteLogado | null) => void;
  isGestor: boolean;
  isCoordenacao: boolean;
  isAtendente: boolean;
}

const AtendenteContext = createContext<AtendenteContextType | undefined>(undefined);

export const AtendenteProvider = ({ children }: { children: ReactNode }) => {
  const [atendenteLogado, setAtendenteLogado] = useState<AtendenteLogado | null>(null);
  const { isDemoMode, demoProfile } = useDemoMode();

  // Mock: Carregar Geovana como atendente logado por padrão
  useEffect(() => {
    const carregarAtendente = async () => {
      const { data } = await supabase
        .from("atendentes")
        .select("*")
        .eq("nome", "Geovana")
        .single();

      if (data) {
        setAtendenteLogado({
          id: data.id,
          nome: data.nome,
          cargo: data.cargo as CargoTipo,
          setor_id: data.setor_id,
          avatar: data.avatar,
        });
      }
    };

    carregarAtendente();
  }, []);

  // Usar perfil demo se modo demo estiver ativo, senão usar cargo real
  const cargoAtual = isDemoMode && demoProfile ? demoProfile : atendenteLogado?.cargo;

  const isGestor = cargoAtual === "gestor";
  const isCoordenacao = cargoAtual === "coordenacao" || isGestor;
  const isAtendente = cargoAtual === "atendente";

  return (
    <AtendenteContext.Provider
      value={{
        atendenteLogado,
        setAtendenteLogado,
        isGestor,
        isCoordenacao,
        isAtendente,
      }}
    >
      {children}
    </AtendenteContext.Provider>
  );
};

export const useAtendenteContext = () => {
  const context = useContext(AtendenteContext);
  if (!context) {
    throw new Error("useAtendenteContext deve ser usado dentro de AtendenteProvider");
  }
  return context;
};
