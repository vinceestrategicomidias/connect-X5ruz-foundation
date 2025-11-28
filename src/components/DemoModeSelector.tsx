import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Button } from "@/components/ui/button";
import { Eye, User, Users, Crown } from "lucide-react";
import { useDemoMode } from "@/contexts/DemoModeContext";
import type { CargoTipo } from "@/contexts/AtendenteContext";

export const DemoModeSelector = () => {
  const { isDemoMode, demoProfile, setDemoProfile } = useDemoMode();

  const perfis: { value: CargoTipo; label: string; icon: any; description: string }[] = [
    {
      value: "atendente",
      label: "Atendente",
      icon: User,
      description: "Visão básica de operação",
    },
    {
      value: "coordenacao",
      label: "Coordenação",
      icon: Users,
      description: "Gestão do setor",
    },
    {
      value: "gestor",
      label: "Gestão",
      icon: Crown,
      description: "Visão estratégica completa",
    },
  ];

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="ghost"
          size="sm"
          className={`gap-2 ${isDemoMode ? "bg-amber-500/10 text-amber-600 hover:bg-amber-500/20" : ""}`}
        >
          <Eye className="h-4 w-4" />
          <span className="text-xs font-medium">[DEMO]</span>
        </Button>
      </PopoverTrigger>
      <PopoverContent align="end" className="w-72">
        <div className="space-y-3">
          <div>
            <h3 className="font-semibold text-sm text-foreground">
              Modo Demonstração
            </h3>
            <p className="text-xs text-muted-foreground mt-1">
              Simule a visualização de diferentes perfis
            </p>
          </div>

          <div className="space-y-2">
            {perfis.map((perfil) => {
              const Icon = perfil.icon;
              const isActive = demoProfile === perfil.value;

              return (
                <button
                  key={perfil.value}
                  onClick={() =>
                    setDemoProfile(isActive ? null : perfil.value)
                  }
                  className={`w-full flex items-start gap-3 p-3 rounded-lg border transition-all ${
                    isActive
                      ? "bg-primary/10 border-primary"
                      : "bg-card border-border hover:bg-accent"
                  }`}
                >
                  <div
                    className={`mt-0.5 ${
                      isActive ? "text-primary" : "text-muted-foreground"
                    }`}
                  >
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 text-left">
                    <p
                      className={`text-sm font-medium ${
                        isActive ? "text-primary" : "text-foreground"
                      }`}
                    >
                      {perfil.label}
                    </p>
                    <p className="text-xs text-muted-foreground mt-0.5">
                      {perfil.description}
                    </p>
                  </div>
                  {isActive && (
                    <div className="mt-1">
                      <div className="h-2 w-2 rounded-full bg-primary" />
                    </div>
                  )}
                </button>
              );
            })}
          </div>

          {isDemoMode && (
            <Button
              variant="outline"
              size="sm"
              className="w-full"
              onClick={() => setDemoProfile(null)}
            >
              Desativar Modo Demo
            </Button>
          )}

          <p className="text-xs text-muted-foreground text-center pt-2 border-t border-border">
            Apenas para apresentação • Não afeta o sistema real
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
};
