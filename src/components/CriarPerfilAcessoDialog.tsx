import { useState } from "react";
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
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { Loader2, Plus, Shield } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface CriarPerfilAcessoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const permissoesDisponiveis = [
  { id: "ver_dashboards", label: "Ver dashboards", categoria: "Visualização" },
  { id: "ver_todos_setores", label: "Ver todos os setores", categoria: "Visualização" },
  { id: "ver_auditoria", label: "Ver auditoria de ações", categoria: "Visualização" },
  { id: "exportar_relatorios", label: "Exportar relatórios", categoria: "Visualização" },
  { id: "editar_roteiros", label: "Editar roteiros", categoria: "Edição" },
  { id: "configurar_ura", label: "Configurar URA", categoria: "Configuração" },
  { id: "configurar_ia", label: "Configurar Thalí/IA", categoria: "Configuração" },
  { id: "gerenciar_usuarios", label: "Gerenciar usuários", categoria: "Administração" },
  { id: "gerenciar_setores", label: "Gerenciar setores", categoria: "Administração" },
  { id: "aprovar_validacoes", label: "Aprovar validações de perfil", categoria: "Administração" },
];

export const CriarPerfilAcessoDialog = ({ open, onOpenChange }: CriarPerfilAcessoDialogProps) => {
  const queryClient = useQueryClient();
  const [isLoading, setIsLoading] = useState(false);
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [permissoes, setPermissoes] = useState<string[]>([]);

  const handleSubmit = async () => {
    if (!nome.trim()) {
      toast.error("Nome do perfil é obrigatório");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("perfis_de_acesso").insert({
        nome,
        descricao,
        permissoes: permissoes,
      });

      if (error) throw error;

      toast.success("Perfil de acesso criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["perfis_de_acesso"] });
      onOpenChange(false);
      setNome("");
      setDescricao("");
      setPermissoes([]);
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar perfil de acesso");
    } finally {
      setIsLoading(false);
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
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Shield className="h-5 w-5" />
            Criar Perfil de Acesso
          </DialogTitle>
          <DialogDescription>
            Crie um novo perfil de acesso com permissões personalizadas
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
            <Label>Permissões</Label>
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
                          id={perm.id}
                          checked={permissoes.includes(perm.id)}
                          onCheckedChange={() => togglePermissao(perm.id)}
                        />
                        <Label htmlFor={perm.id} className="text-sm font-normal cursor-pointer">
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
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Criando...
              </>
            ) : (
              <>
                <Plus className="h-4 w-4 mr-2" />
                Criar Perfil
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
