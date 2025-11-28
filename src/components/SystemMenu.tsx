import { useState } from "react";
import {
  Building2,
  Building,
  Users,
  ShieldCheck,
  Phone,
  Bot,
  FileText,
  BarChart3,
  Settings,
  Map,
  UserCheck,
} from "lucide-react";
import { ValidacoesPerfilPanel } from "./ValidacoesPerfilPanel";
import { ConfiguracoesManagement } from "./ConfiguracoesManagement";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import {
  Drawer,
  DrawerContent,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import { ScrollArea } from "@/components/ui/scroll-area";
import { cn } from "@/lib/utils";

interface SystemMenuProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type MenuSection =
  | "empresa"
  | "unidades"
  | "setores"
  | "usuarios"
  | "perfis"
  | "validacoes"
  | "ura"
  | "mensageria"
  | "relatorios"
  | "dashboard"
  | "config";

const menuItems = [
  { id: "empresa" as MenuSection, label: "Empresa", icon: Building2 },
  { id: "unidades" as MenuSection, label: "Unidades", icon: Building },
  { id: "setores" as MenuSection, label: "Setores", icon: Map },
  { id: "usuarios" as MenuSection, label: "Usuários", icon: Users },
  { id: "perfis" as MenuSection, label: "Perfis de Acesso", icon: ShieldCheck },
  { id: "validacoes" as MenuSection, label: "Validações de Perfil", icon: UserCheck, requiresCoordenacao: true },
  { id: "ura" as MenuSection, label: "URA (Telefonia)", icon: Phone },
  { id: "mensageria" as MenuSection, label: "Robô e Mensageria", icon: Bot },
  { id: "relatorios" as MenuSection, label: "Relatórios", icon: FileText },
  { id: "dashboard" as MenuSection, label: "Dashboard", icon: BarChart3 },
  { id: "config" as MenuSection, label: "Configurações", icon: Settings },
];

export const SystemMenu = ({ open, onOpenChange }: SystemMenuProps) => {
  const { isCoordenacao, isGestor } = useAtendenteContext();
  const [selectedSection, setSelectedSection] = useState<MenuSection>("empresa");
  const [validacoesOpen, setValidacoesOpen] = useState(false);
  const [configuracoesOpen, setConfiguracoesOpen] = useState(false);

  const renderContent = () => {
    switch (selectedSection) {
      case "empresa":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Cadastro da Empresa</h3>
            <p className="text-sm text-muted-foreground">
              Configure os dados da sua empresa: nome, CNPJ, endereço, logo e responsável administrativo.
            </p>
            <div className="mt-4">
              <button
                onClick={() => setConfiguracoesOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Abrir Configurações Completas
              </button>
            </div>
          </div>
        );

      case "unidades":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Unidades Empresariais</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie as unidades da sua empresa. Cada unidade pode ter seus próprios setores e atendentes.
            </p>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-center text-muted-foreground">
                Módulo em desenvolvimento
              </p>
            </div>
          </div>
        );

      case "setores":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Gestão de Setores</h3>
            <p className="text-sm text-muted-foreground">
              Configure setores por unidade. Defina se recebem ligações e mensagens.
            </p>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-center text-muted-foreground">
                Módulo em desenvolvimento
              </p>
            </div>
          </div>
        );

      case "usuarios":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Gestão de Usuários</h3>
            <p className="text-sm text-muted-foreground">
              Crie e gerencie usuários do sistema. Vincule a unidades, setores e perfis de acesso.
            </p>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-center text-muted-foreground">
                Módulo em desenvolvimento
              </p>
            </div>
          </div>
        );

      case "perfis":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Perfis de Acesso</h3>
            <p className="text-sm text-muted-foreground">
              Configure perfis personalizados com permissões detalhadas para cada tipo de usuário.
            </p>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-center text-muted-foreground">
                Módulo em desenvolvimento
              </p>
            </div>
          </div>
        );

      case "validacoes":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Validações de Perfil</h3>
            <p className="text-sm text-muted-foreground">
              Aprove ou reprove alterações solicitadas pelos usuários em seus perfis.
            </p>
            <div className="mt-4">
              <button
                onClick={() => setValidacoesOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Abrir Painel de Validações
              </button>
            </div>
          </div>
        );

      case "ura":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configuração da URA</h3>
            <p className="text-sm text-muted-foreground">
              Configure a URA telefônica: áudios, mensagens, opções de menu e horários de funcionamento.
            </p>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-center text-muted-foreground">
                Módulo em desenvolvimento
              </p>
            </div>
          </div>
        );

      case "mensageria":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Robô e Mensageria</h3>
            <p className="text-sm text-muted-foreground">
              Ative robô de pré-atendimento, crie fluxos automatizados e configure assistente IA.
            </p>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-center text-muted-foreground">
                Módulo em desenvolvimento
              </p>
            </div>
          </div>
        );

      case "relatorios":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Relatórios</h3>
            <p className="text-sm text-muted-foreground">
              Gere relatórios de atendimento, produtividade, ligações por unidade, setor e atendente.
            </p>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-center text-muted-foreground">
                Módulo em desenvolvimento
              </p>
            </div>
          </div>
        );

      case "dashboard":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Dashboard para Gestão</h3>
            <p className="text-sm text-muted-foreground">
              Dashboard full-screen com métricas em tempo real. Ideal para monitores de operação.
            </p>
            <div className="p-6 rounded-lg border bg-card">
              <p className="text-center text-muted-foreground">
                Módulo em desenvolvimento
              </p>
            </div>
          </div>
        );

      case "config":
        return (
          <div className="space-y-4">
            <h3 className="text-lg font-semibold">Configurações Avançadas</h3>
            <p className="text-sm text-muted-foreground">
              Gerencie todas as configurações do sistema: empresa, unidades, usuários, perfis, URA, IA, alertas e APIs.
            </p>
            <div className="mt-4">
              <button
                onClick={() => setConfiguracoesOpen(true)}
                className="px-4 py-2 bg-primary text-primary-foreground rounded-lg hover:bg-primary/90 transition-colors"
              >
                Abrir Configurações Completas
              </button>
            </div>
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <>
      <Drawer open={open} onOpenChange={onOpenChange} direction="right">
        <DrawerContent className="h-screen top-0 right-0 left-auto mt-0 w-[900px] rounded-none">
          <DrawerHeader className="border-b">
            <DrawerTitle className="text-xl">Sistema de Gestão</DrawerTitle>
          </DrawerHeader>
          
          <div className="flex h-full overflow-hidden">
            {/* Sidebar */}
            <div className="w-64 border-r bg-muted/20">
              <ScrollArea className="h-full">
                <div className="p-4 space-y-1">
                  {menuItems.map((item) => {
                    const Icon = item.icon;
                    const requiresCoordenacao = (item as any).requiresCoordenacao;
                    
                    // Hide validações menu item if user is not coordenação or gestor
                    if (requiresCoordenacao && !isCoordenacao && !isGestor) {
                      return null;
                    }
                    
                    return (
                      <button
                        key={item.id}
                        onClick={() => setSelectedSection(item.id)}
                        className={cn(
                          "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors",
                          selectedSection === item.id
                            ? "bg-primary text-primary-foreground"
                            : "hover:bg-muted text-muted-foreground hover:text-foreground"
                        )}
                      >
                        <Icon className="h-4 w-4" />
                        <span>{item.label}</span>
                      </button>
                    );
                  })}
                </div>
              </ScrollArea>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-hidden">
              <ScrollArea className="h-full">
                <div className="p-6">{renderContent()}</div>
              </ScrollArea>
            </div>
          </div>
        </DrawerContent>
      </Drawer>
      
      <ValidacoesPerfilPanel open={validacoesOpen} onOpenChange={setValidacoesOpen} />
      <ConfiguracoesManagement open={configuracoesOpen} onOpenChange={setConfiguracoesOpen} />
    </>
  );
};
