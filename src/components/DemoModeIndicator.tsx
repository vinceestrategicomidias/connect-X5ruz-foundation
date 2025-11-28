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
    <div className="fixed top-2 right-2 z-50 bg-amber-500/95 backdrop-blur-sm text-white py-1.5 px-3 flex items-center gap-2 rounded-lg shadow-lg text-xs">
      <Eye className="h-3 w-3" />
      <span className="font-medium">
        Demo: {perfilLabels[demoProfile!]}
      </span>
      <button
        onClick={resetDemo}
        className="p-0.5 hover:bg-white/20 rounded transition-colors"
        aria-label="Desativar modo demo"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
};
