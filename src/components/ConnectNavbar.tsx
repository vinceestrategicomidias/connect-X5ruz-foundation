import { useNavigate } from "react-router-dom";
import { LayoutDashboard, Sun, Moon, BarChart3 } from "lucide-react";
import { ConnectIconButton } from "./ConnectIconButton";
import { SetoresManagement } from "./SetoresManagement";
import { ManualDialer } from "./ManualDialer";
import { RankingTop3 } from "./RankingTop3";
import { NotificationsPanel } from "./NotificationsPanel";
import { UserProfileMenu } from "./UserProfileMenu";
import { useTheme } from "next-themes";

export const ConnectNavbar = () => {
  const navigate = useNavigate();
  const { theme, setTheme } = useTheme();

  return (
    <nav className="h-16 border-b border-border bg-card px-6 flex items-center justify-between connect-shadow">
      {/* Logo / Brand */}
      <div className="flex items-center gap-3">
        <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center flex-shrink-0">
          <span className="text-primary-foreground font-bold text-xs">GL</span>
        </div>
        <div className="flex flex-col leading-none">
          <h1 className="text-[26px] font-semibold text-foreground uppercase tracking-tight">CONNECT</h1>
          <p className="text-[11px] font-normal text-muted-foreground uppercase tracking-wide mt-0.5">GRUPO LIRUZ</p>
        </div>
      </div>

      {/* Ranking Top 3 */}
      <RankingTop3 />

      {/* Actions */}
      <div className="flex items-center gap-3">
        <ManualDialer />
        <SetoresManagement />
        <ConnectIconButton
          icon={BarChart3}
          onClick={() => navigate("/dashboard")}
          tooltip="Dashboard de Monitoramento"
        />
        <ConnectIconButton
          icon={LayoutDashboard}
          onClick={() => navigate("/gestao")}
          tooltip="Central de Gestão"
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
    </nav>
  );
};
