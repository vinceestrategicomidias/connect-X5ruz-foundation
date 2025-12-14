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
import { ScrollArea } from "@/components/ui/scroll-area";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Separator } from "@/components/ui/separator";
import { supabase } from "@/integrations/supabase/client";
import { useUnidades } from "@/hooks/useUnidades";
import { useSetores } from "@/hooks/useSetores";
import { usePerfisAcesso } from "@/hooks/usePerfisAcesso";
import { toast } from "sonner";
import { Loader2, Plus, User, Shield } from "lucide-react";
import { useQueryClient } from "@tanstack/react-query";

interface CriarUsuarioDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface UsuarioFormData {
  nome: string;
  email: string;
  telefone: string;
  unidade_id: string;
  setor_id: string;
  perfil_id: string;
  cargo: string;
  senha: string;
  permissoes_personalizadas: string[];
}

const permissoesDisponiveis = [
  { id: "ver_dashboards", label: "Ver dashboards" },
  { id: "ver_todos_setores", label: "Ver todos os setores" },
  { id: "editar_roteiros", label: "Editar roteiros" },
  { id: "configurar_ura", label: "Configurar URA" },
  { id: "gerenciar_usuarios", label: "Gerenciar usuários" },
  { id: "aprovar_validacoes", label: "Aprovar validações de perfil" },
  { id: "exportar_relatorios", label: "Exportar relatórios" },
  { id: "configurar_ia", label: "Configurar Thalí/IA" },
  { id: "ver_auditoria", label: "Ver auditoria de ações" },
  { id: "gerenciar_setores", label: "Gerenciar setores" },
];

export const CriarUsuarioDialog = ({ open, onOpenChange }: CriarUsuarioDialogProps) => {
  const queryClient = useQueryClient();
  const { data: unidades } = useUnidades();
  const { data: setores } = useSetores();
  const { data: perfis } = usePerfisAcesso();
  const [isLoading, setIsLoading] = useState(false);

  const [formData, setFormData] = useState<UsuarioFormData>({
    nome: "",
    email: "",
    telefone: "",
    unidade_id: "",
    setor_id: "",
    perfil_id: "",
    cargo: "atendente",
    senha: "",
    permissoes_personalizadas: [],
  });

  const handleSubmit = async () => {
    if (!formData.nome.trim()) {
      toast.error("Nome é obrigatório");
      return;
    }
    if (!formData.email.trim()) {
      toast.error("E-mail é obrigatório");
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase.from("atendentes").insert({
        nome: formData.nome,
        email: formData.email,
        senha: formData.senha || null,
        setor_id: formData.setor_id || null,
        unidade_id: formData.unidade_id || null,
        perfil_id: formData.perfil_id || null,
        cargo: formData.cargo as any,
        ativo: true,
      });

      if (error) throw error;

      toast.success("Usuário criado com sucesso!");
      queryClient.invalidateQueries({ queryKey: ["atendentes"] });
      onOpenChange(false);
      setFormData({
        nome: "",
        email: "",
        telefone: "",
        unidade_id: "",
        setor_id: "",
        perfil_id: "",
        cargo: "atendente",
        senha: "",
        permissoes_personalizadas: [],
      });
    } catch (error) {
      console.error(error);
      toast.error("Erro ao criar usuário");
    } finally {
      setIsLoading(false);
    }
  };

  const togglePermissao = (permissao: string) => {
    setFormData((prev) => ({
      ...prev,
      permissoes_personalizadas: prev.permissoes_personalizadas.includes(permissao)
        ? prev.permissoes_personalizadas.filter((p) => p !== permissao)
        : [...prev.permissoes_personalizadas, permissao],
    }));
  };

  const perfilSelecionado = perfis?.find((p) => p.id === formData.perfil_id);
  const mostrarPermissoesPersonalizadas = perfilSelecionado?.nome?.toLowerCase() === "personalizado";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <User className="h-5 w-5" />
            Criar Novo Usuário
          </DialogTitle>
          <DialogDescription>
            Adicione um novo usuário ao sistema com as permissões adequadas
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Dados Pessoais */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Dados Pessoais
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome Completo *</Label>
                  <Input
                    id="nome"
                    value={formData.nome}
                    onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                    placeholder="Nome do usuário"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">E-mail (Login) *</Label>
                  <Input
                    id="email"
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="email@empresa.com"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="telefone">Telefone</Label>
                  <Input
                    id="telefone"
                    value={formData.telefone}
                    onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                    placeholder="(27) 99999-9999"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="senha">Senha Inicial</Label>
                  <Input
                    id="senha"
                    type="password"
                    value={formData.senha}
                    onChange={(e) => setFormData({ ...formData, senha: e.target.value })}
                    placeholder="••••••••"
                  />
                </div>
              </div>
            </div>

            <Separator />

            {/* Vínculo */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Vínculo
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Unidade</Label>
                  <Select
                    value={formData.unidade_id}
                    onValueChange={(value) => setFormData({ ...formData, unidade_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione a unidade" />
                    </SelectTrigger>
                    <SelectContent>
                      {unidades?.map((unidade) => (
                        <SelectItem key={unidade.id} value={unidade.id}>
                          {unidade.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Setor</Label>
                  <Select
                    value={formData.setor_id}
                    onValueChange={(value) => setFormData({ ...formData, setor_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {setores?.map((setor) => (
                        <SelectItem key={setor.id} value={setor.id}>
                          {setor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            <Separator />

            {/* Perfil de Acesso */}
            <div className="space-y-4">
              <h4 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider flex items-center gap-2">
                <Shield className="h-4 w-4" />
                Perfil de Acesso
              </h4>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Cargo</Label>
                  <Select
                    value={formData.cargo}
                    onValueChange={(value) => setFormData({ ...formData, cargo: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="atendente">Atendente</SelectItem>
                      <SelectItem value="coordenacao">Coordenação</SelectItem>
                      <SelectItem value="gestor">Gestão</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label>Perfil de Acesso</Label>
                  <Select
                    value={formData.perfil_id}
                    onValueChange={(value) => setFormData({ ...formData, perfil_id: value })}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o perfil" />
                    </SelectTrigger>
                    <SelectContent>
                      {perfis?.map((perfil) => (
                        <SelectItem key={perfil.id} value={perfil.id}>
                          {perfil.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {mostrarPermissoesPersonalizadas && (
                <div className="space-y-3 p-4 rounded-lg border bg-muted/20">
                  <h5 className="text-sm font-medium">Permissões Personalizadas</h5>
                  <div className="grid grid-cols-2 gap-3">
                    {permissoesDisponiveis.map((perm) => (
                      <div key={perm.id} className="flex items-center space-x-2">
                        <Checkbox
                          id={perm.id}
                          checked={formData.permissoes_personalizadas.includes(perm.id)}
                          onCheckedChange={() => togglePermissao(perm.id)}
                        />
                        <Label htmlFor={perm.id} className="text-sm font-normal cursor-pointer">
                          {perm.label}
                        </Label>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>
        </ScrollArea>

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
                Criar Usuário
              </>
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
