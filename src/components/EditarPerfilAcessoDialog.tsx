import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { toast } from "sonner";
import { Loader2, Save, Pencil } from "lucide-react";
import { useAtualizarPerfil, PerfilAcesso } from "@/hooks/usePerfisAcesso";

interface EditarPerfilAcessoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  perfil: PerfilAcesso | null;
}

const permissoesDisponiveis = [
  { id: "acessar_sistema_gestao", label: "Acessar sistema de gestão", categoria: "Sistema" },
  { id: "ver_dashboards", label: "Acessar dashboards", categoria: "Visualização" },
  { id: "ver_todos_setores", label: "Ver todos os setores", categoria: "Visualização" },
  { id: "ver_auditoria", label: "Ver auditoria de ações", categoria: "Visualização" },
  { id: "exportar_relatorios", label: "Exportar relatórios", categoria: "Visualização" },
  { id: "editar_roteiros", label: "Editar roteiros", categoria: "Edição" },
  { id: "configurar_ura", label: "Configurar URA", categoria: "Configuração" },
  { id: "configurar_ia", label: "Configurar Thalí/IA", categoria: "Configuração" },
  { id: "gerenciar_usuarios", label: "Gerir usuários", categoria: "Administração" },
  { id: "gerenciar_setores", label: "Gerir setores", categoria: "Administração" },
  { id: "aprovar_validacoes", label: "Aprovar validações de perfil", categoria: "Administração" },
  { id: "acessar_api", label: "Acessar integrações/API", categoria: "Administração" },
];

export const EditarPerfilAcessoDialog = ({ 
  open, 
  onOpenChange, 
  perfil 
}: EditarPerfilAcessoDialogProps) => {
  const atualizarPerfil = useAtualizarPerfil();
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [permissoes, setPermissoes] = useState<string[]>([]);

  useEffect(() => {
    if (perfil) {
      setNome(perfil.nome);
      setDescricao(perfil.descricao || "");
      // Convert permissoes object to array of enabled permission ids
      const permissoesArray = perfil.permissoes 
        ? Object.entries(perfil.permissoes)
            .filter(([_, enabled]) => enabled)
            .map(([key]) => key)
        : [];
      setPermissoes(permissoesArray);
    }
  }, [perfil]);

  const handleSubmit = async () => {
    if (!perfil) return;
    if (!nome.trim()) {
      toast.error("Nome do perfil é obrigatório");
      return;
    }

    try {
      // Convert array back to object format
      const permissoesObj: Record<string, boolean> = {};
      permissoesDisponiveis.forEach(p => {
        permissoesObj[p.id] = permissoes.includes(p.id);
      });

      await atualizarPerfil.mutateAsync({
        id: perfil.id,
        dados: {
          nome,
          descricao,
          permissoes: permissoesObj,
        },
      });

      toast.success("Perfil atualizado com sucesso!");
      onOpenChange(false);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao atualizar perfil");
    }
  };

  const togglePermissao = (permissao: string) => {
    setPermissoes((prev) =>
      prev.includes(permissao)
        ? prev.filter((p) => p !== permissao)
        : [...prev, permissao]
    );
  };

  const categorias = [...new Set(permissoesDisponiveis.map((p) => p.categoria))];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg max-h-[85vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Editar Perfil de Acesso
          </DialogTitle>
          <DialogDescription>
            Atualize as permissões do perfil "{perfil?.nome}"
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          <div className="space-y-2">
            <Label htmlFor="nome">Nome do Perfil *</Label>
            <Input
              id="nome"
              value={nome}
              onChange={(e) => setNome(e.target.value)}
              placeholder="Ex: Supervisor"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="descricao">Descrição</Label>
            <Textarea
              id="descricao"
              value={descricao}
              onChange={(e) => setDescricao(e.target.value)}
              placeholder="Descrição do perfil e suas responsabilidades"
              rows={2}
            />
          </div>

          <div className="space-y-4">
            <Label>Permissões do Perfil</Label>
            {categorias.map((categoria) => (
              <div key={categoria} className="space-y-2">
                <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  {categoria}
                </p>
                <div className="space-y-2">
                  {permissoesDisponiveis
                    .filter((p) => p.categoria === categoria)
                    .map((perm) => (
                      <div key={perm.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={`edit-${perm.id}`}
                          checked={permissoes.includes(perm.id)}
                          onCheckedChange={() => togglePermissao(perm.id)}
                        />
                        <Label htmlFor={`edit-${perm.id}`} className="text-sm font-normal cursor-pointer">
                          {perm.label}
                        </Label>
                      </div>
                    ))}
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="flex gap-3 pt-4 border-t">
          <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button 
            className="flex-1"
            onClick={handleSubmit}
            disabled={atualizarPerfil.isPending}
          >
            {atualizarPerfil.isPending ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Salvando...
              </>
            ) : (
              <>
                <Save className="h-4 w-4 mr-2" />
                Salvar Alterações
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
