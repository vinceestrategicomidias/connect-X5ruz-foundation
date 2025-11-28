import { useDemoMode } from "@/contexts/DemoModeContext";
import { Eye, X } from "lucide-react";

export const DemoModeIndicator = () => {
  const { isDemoMode, demoProfile, resetDemo } = useDemoMode();

  if (!isDemoMode) return null;

  const perfilLabels = {
    atendente: "Atendente",
    coordenacao: "Coordenação",
    gestor: "Gestão",
  };

  return (
    <div className="fixed top-0 left-0 right-0 z-50 bg-amber-500/90 backdrop-blur-sm text-white py-2 px-4 flex items-center justify-center gap-3 shadow-lg">
      <Eye className="h-4 w-4" />
      <p className="text-sm font-medium">
        Visualização simulada: Perfil {perfilLabels[demoProfile!]}
      </p>
      <button
        onClick={resetDemo}
        className="ml-2 p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Desativar modo demo"
      >
        <X className="h-4 w-4" />
      </button>
    </div>
  );
};
