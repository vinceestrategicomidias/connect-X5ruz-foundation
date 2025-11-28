import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

interface EditarNomeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomeAtual: string;
  onSalvar: (novoNome: string) => Promise<void>;
}

export const EditarNomeDialog = ({
  open,
  onOpenChange,
  nomeAtual,
  onSalvar,
}: EditarNomeDialogProps) => {
  const [novoNome, setNovoNome] = useState(nomeAtual);
  const [salvando, setSalvando] = useState(false);

  const handleSalvar = async () => {
    if (!novoNome.trim()) {
      toast.error("Nome não pode estar vazio");
      return;
    }

    if (novoNome.trim().length < 2) {
      toast.error("Nome deve ter pelo menos 2 caracteres");
      return;
    }

    if (novoNome.trim() === nomeAtual.trim()) {
      toast.info("Nome não foi alterado");
      onOpenChange(false);
      return;
    }

    setSalvando(true);
    try {
      await onSalvar(novoNome.trim());
      toast.success("Nome atualizado com sucesso!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao atualizar nome");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar nome do contato</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nome atual</Label>
            <Input value={nomeAtual} disabled className="bg-muted" />
          </div>

          <div className="space-y-2">
            <Label>Novo nome *</Label>
            <Input
              placeholder="Digite o novo nome"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  handleSalvar();
                }
              }}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 2 caracteres
            </p>
          </div>
        </div>

        <DialogFooter>
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            disabled={salvando}
          >
            Cancelar
          </Button>
          <Button onClick={handleSalvar} disabled={salvando}>
            {salvando ? "Salvando..." : "Salvar"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
