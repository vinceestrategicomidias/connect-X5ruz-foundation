import { Star, Settings, TrendingUp, Sun, Moon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useState } from "react";

export const ConnectNavbar = () => {
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <header className="h-16 border-b border-border bg-card connect-shadow sticky top-0 z-50">
      <div className="h-full px-6 flex items-center justify-between">
        {/* Logo e Nome */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-3">
            <Star className="h-8 w-8 text-primary fill-primary" />
            <div>
              <h1 className="text-xl font-display font-bold text-foreground">Connect</h1>
              <p className="text-xs text-muted-foreground">Grupo Liruz</p>
            </div>
          </div>
        </div>

        {/* Ações */}
        <div className="flex items-center gap-3">
          {/* Menu de Usuário */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm">
                Atendente
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem>Atendente</DropdownMenuItem>
              <DropdownMenuItem>Coordenação</DropdownMenuItem>
              <DropdownMenuItem>Gestor</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          {/* Ranking Diário */}
          <Button variant="outline" size="sm" className="gap-2">
            <TrendingUp className="h-4 w-4" />
            Ranking Diário
          </Button>

          {/* Configurações */}
          <Button variant="outline" size="sm">
            <Settings className="h-4 w-4" />
          </Button>

          {/* Toggle Tema */}
          <Button
            variant="outline"
            size="sm"
            onClick={toggleTheme}
            aria-label="Alternar tema"
          >
            {theme === "light" ? (
              <Moon className="h-4 w-4" />
            ) : (
              <Sun className="h-4 w-4" />
            )}
          </Button>
        </div>
      </div>
    </header>
  );
};
