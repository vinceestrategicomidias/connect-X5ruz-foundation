import { Bell, Settings } from "lucide-react";
import { ConnectIconButton } from "./ConnectIconButton";
import { ConnectAvatar } from "./ConnectAvatar";
import { SetoresManagement } from "./SetoresManagement";
import { useAtendenteContext } from "@/contexts/AtendenteContext";

export const ConnectNavbar = () => {
  const { atendenteLogado } = useAtendenteContext();

  return (
    <nav className="h-16 border-b border-border bg-card px-6 flex items-center justify-between connect-shadow">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3">
        <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
          <span className="text-primary-foreground font-bold text-sm">GL</span>
        </div>
        <div>
          <h1 className="text-lg font-display font-semibold text-foreground">
            Connect – Grupo Liruz
          </h1>
          {atendenteLogado && (
            <p className="text-xs text-muted-foreground capitalize">
              {atendenteLogado.cargo}
            </p>
          )}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3">
        <SetoresManagement />
        <ConnectIconButton icon={Bell} />
        <ConnectIconButton icon={Settings} />
        <ConnectAvatar
          name={atendenteLogado?.nome || "Atendente"}
          image={atendenteLogado?.avatar || undefined}
        />
      </div>
    </nav>
  );
};
