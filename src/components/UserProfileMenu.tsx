import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { User, LogOut } from "lucide-react";
import { ConnectAvatar } from "./ConnectAvatar";
import { MeuPerfilDialog } from "./MeuPerfilDialog";
import { useAtendenteContext } from "@/contexts/AtendenteContext";

export const UserProfileMenu = () => {
  const navigate = useNavigate();
  const { atendenteLogado } = useAtendenteContext();
  const [perfilOpen, setPerfilOpen] = useState(false);

  const handleLogout = () => {
    // TODO: Implementar logout com Supabase quando auth estiver ativo
    navigate("/login");
  };

  return (
    <>
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <button className="focus:outline-none focus:ring-2 focus:ring-primary rounded-full">
            <ConnectAvatar
              name={atendenteLogado?.nome || "Usuário"}
              image={atendenteLogado?.avatar || undefined}
            />
          </button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-56">
          <DropdownMenuItem onClick={() => setPerfilOpen(true)}>
            <User className="mr-2 h-4 w-4" />
            Meu Perfil
          </DropdownMenuItem>
          <DropdownMenuSeparator />
          <DropdownMenuItem onClick={handleLogout}>
            <LogOut className="mr-2 h-4 w-4" />
            Sair
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <MeuPerfilDialog open={perfilOpen} onOpenChange={setPerfilOpen} />
    </>
  );
};
