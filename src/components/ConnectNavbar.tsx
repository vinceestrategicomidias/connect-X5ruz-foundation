import { useState } from "react";
import { LayoutGrid, Menu, LayoutDashboard } from "lucide-react";
import { ConnectIconButton } from "./ConnectIconButton";
import { ConnectAvatar } from "./ConnectAvatar";
import { SetoresManagement } from "./SetoresManagement";
import { ManualDialer } from "./ManualDialer";
import { PainelUnificado } from "./PainelUnificado";
import { SystemMenu } from "./SystemMenu";
import { RankingTop3 } from "./RankingTop3";
import { NotificationsPanel } from "./NotificationsPanel";
import { useAtendenteContext } from "@/contexts/AtendenteContext";

export const ConnectNavbar = () => {
  const { atendenteLogado } = useAtendenteContext();
  const [systemMenuOpen, setSystemMenuOpen] = useState(false);
  const [painelOpen, setPainelOpen] = useState(false);

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

      {/* Ranking Top 3 */}
      <RankingTop3 />

      {/* Actions */}
      <div className="flex items-center gap-3">
        <ManualDialer />
        <SetoresManagement />
        <ConnectIconButton 
          icon={Menu}
          onClick={() => setSystemMenuOpen(true)}
          tooltip="Menu do Sistema"
        />
        <ConnectIconButton 
          icon={LayoutDashboard}
          onClick={() => setPainelOpen(true)}
          tooltip="Painel Estratégico"
        />
        <NotificationsPanel />
        <ConnectAvatar
          name={atendenteLogado?.nome || "Atendente"}
          image={atendenteLogado?.avatar || undefined}
        />
      </div>

      <SystemMenu open={systemMenuOpen} onOpenChange={setSystemMenuOpen} />
      <PainelUnificado open={painelOpen} onOpenChange={setPainelOpen} />
    </nav>
  );
};
