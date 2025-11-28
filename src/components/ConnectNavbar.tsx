import { useState } from "react";
import { Menu, LayoutDashboard, Sun, Moon } from "lucide-react";
import { ConnectIconButton } from "./ConnectIconButton";
import { SetoresManagement } from "./SetoresManagement";
import { ManualDialer } from "./ManualDialer";
import { PainelUnificado } from "./PainelUnificado";
import { SystemMenu } from "./SystemMenu";
import { RankingTop3 } from "./RankingTop3";
import { NotificationsPanel } from "./NotificationsPanel";
import { UserProfileMenu } from "./UserProfileMenu";
import { useTheme } from "next-themes";

export const ConnectNavbar = () => {
  const { theme, setTheme } = useTheme();
  const [systemMenuOpen, setSystemMenuOpen] = useState(false);
  const [painelOpen, setPainelOpen] = useState(false);

  return (
    <nav className="h-16 border-b border-border bg-card px-6 flex items-center justify-between connect-shadow">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-[#0A2647] rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-white font-bold text-xs">GL</span>
        </div>
        <div className="flex flex-col leading-none">
          <h1 className="text-[26px] font-semibold text-[#0A2647] uppercase tracking-tight">
            CONNECT
          </h1>
          <p className="text-[11px] font-normal text-[#1D4E89] uppercase tracking-wide mt-0.5">
            GRUPO LIRUZ
          </p>
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
        <ConnectIconButton 
          icon={theme === "dark" ? Sun : Moon}
          onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
          tooltip="Alternar Tema"
          variant="ghost"
        />
        <UserProfileMenu />
      </div>

      <SystemMenu open={systemMenuOpen} onOpenChange={setSystemMenuOpen} />
      <PainelUnificado open={painelOpen} onOpenChange={setPainelOpen} />
    </nav>
  );
};
