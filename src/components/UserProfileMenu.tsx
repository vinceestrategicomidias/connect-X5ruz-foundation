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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

export const UserProfileMenu = () => {
  const navigate = useNavigate();
  const { atendenteLogado } = useAtendenteContext();
  const [perfilOpen, setPerfilOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await supabase.auth.signOut();
      toast.success("Logout realizado com sucesso!");
      navigate("/login");
    } catch (error) {
      toast.error("Erro ao fazer logout");
    }
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
