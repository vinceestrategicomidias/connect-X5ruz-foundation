import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useCriarValidacao } from "@/hooks/usePerfilValidacoes";
import { Upload, Save } from "lucide-react";

interface MeuPerfilDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const MeuPerfilDialog = ({ open, onOpenChange }: MeuPerfilDialogProps) => {
  const { atendenteLogado } = useAtendenteContext();
  const criarValidacao = useCriarValidacao();

  const [formData, setFormData] = useState({
    nome: "",
    assinatura: "",
    avatar: "",
  });

  useEffect(() => {
    if (atendenteLogado && open) {
      setFormData({
        nome: atendenteLogado.nome || "",
        assinatura: atendenteLogado.nome || "",
        avatar: atendenteLogado.avatar || "",
      });
    }
  }, [atendenteLogado, open]);

  const handleSave = async () => {
    if (!atendenteLogado) return;

    const camposAlterados: Record<string, boolean> = {};
    const valoresNovos: Record<string, any> = {};

    if (formData.nome !== atendenteLogado.nome) {
      camposAlterados.nome = true;
      valoresNovos.nome = formData.nome;
    }

    if (formData.avatar !== (atendenteLogado.avatar || "")) {
      camposAlterados.avatar = true;
      valoresNovos.avatar = formData.avatar;
    }

    if (Object.keys(camposAlterados).length === 0) {
      onOpenChange(false);
      return;
    }

    await criarValidacao.mutateAsync({
      usuario_id: atendenteLogado.id,
      campos_alterados: camposAlterados,
      valores_novos: valoresNovos,
    });

    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="text-[#0A2647]">Meu Perfil</DialogTitle>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Avatar */}
          <div className="flex flex-col items-center gap-4">
            <Avatar className="h-24 w-24">
              <AvatarImage src={formData.avatar} />
              <AvatarFallback className="text-2xl">
                {formData.nome.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
              </AvatarFallback>
            </Avatar>
            <Button variant="outline" size="sm">
              <Upload className="h-4 w-4 mr-2" />
              Alterar Foto
            </Button>
          </div>

          {/* Campos Editáveis */}
          <div className="space-y-4">
            <div>
              <Label htmlFor="nome">Nome Completo *</Label>
              <Input
                id="nome"
                value={formData.nome}
                onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="assinatura">Assinatura *</Label>
              <Input
                id="assinatura"
                value={formData.assinatura}
                onChange={(e) => setFormData({ ...formData, assinatura: e.target.value })}
                className="mt-1.5"
                placeholder="Nome que aparece ao enviar mensagens"
              />
            </div>

            {/* Campos Não Editáveis */}
            <div className="pt-4 border-t border-border space-y-3">
              <div>
                <Label className="text-muted-foreground">E-mail</Label>
                <p className="text-sm font-medium mt-1">
                  {(atendenteLogado as any)?.email || "Não informado"}
                </p>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label className="text-muted-foreground">Cargo</Label>
                  <p className="text-sm font-medium mt-1 capitalize">
                    {atendenteLogado?.cargo || "-"}
                  </p>
                </div>
                <div>
                  <Label className="text-muted-foreground">Unidade</Label>
                  <p className="text-sm font-medium mt-1">Matriz</p>
                </div>
              </div>

              <div>
                <Label className="text-muted-foreground">Setor</Label>
                <p className="text-sm font-medium mt-1">Atendimento Geral</p>
              </div>
            </div>
          </div>

          {/* Botões */}
          <div className="flex gap-3 pt-4">
            <Button
              variant="outline"
              className="flex-1"
              onClick={() => onOpenChange(false)}
            >
              Cancelar
            </Button>
            <Button
              className="flex-1 bg-[#0A2647] hover:bg-[#0A2647]/90"
              onClick={handleSave}
              disabled={criarValidacao.isPending}
            >
              <Save className="h-4 w-4 mr-2" />
              Salvar Alterações
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center">
            * Alterações serão enviadas para validação da coordenação
          </p>
        </div>
      </DialogContent>
    </Dialog>
  );
};
