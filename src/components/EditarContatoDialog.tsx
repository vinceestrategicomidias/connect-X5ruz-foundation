import { useState, useEffect } from "react";
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

interface EditarContatoDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  nomeAtual: string;
  telefoneAtual: string;
  onSalvar: (novoNome: string, novoTelefone: string) => Promise<void>;
}

const formatarTelefone = (valor: string): string => {
  // Remove tudo que não é dígito
  const numeros = valor.replace(/\D/g, "");
  
  // Limita a 11 dígitos (DDD + 9 dígitos)
  const limitado = numeros.slice(0, 11);
  
  // Aplica a máscara
  if (limitado.length === 0) return "";
  if (limitado.length <= 2) return `(${limitado}`;
  if (limitado.length <= 7) return `(${limitado.slice(0, 2)}) ${limitado.slice(2)}`;
  return `(${limitado.slice(0, 2)}) ${limitado.slice(2, 7)}-${limitado.slice(7)}`;
};

const validarTelefone = (telefone: string): boolean => {
  const numeros = telefone.replace(/\D/g, "");
  return numeros.length >= 10 && numeros.length <= 11;
};

export const EditarContatoDialog = ({
  open,
  onOpenChange,
  nomeAtual,
  telefoneAtual,
  onSalvar,
}: EditarContatoDialogProps) => {
  const [novoNome, setNovoNome] = useState(nomeAtual);
  const [novoTelefone, setNovoTelefone] = useState(telefoneAtual);
  const [salvando, setSalvando] = useState(false);

  // Reset quando abrir
  useEffect(() => {
    if (open) {
      setNovoNome(nomeAtual);
      setNovoTelefone(formatarTelefone(telefoneAtual.replace("+55", "").replace(/\D/g, "")));
    }
  }, [open, nomeAtual, telefoneAtual]);

  const handleTelefoneChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setNovoTelefone(formatarTelefone(e.target.value));
  };

  const handleSalvar = async () => {
    if (!novoNome.trim()) {
      toast.error("Nome não pode estar vazio");
      return;
    }

    if (novoNome.trim().length < 2) {
      toast.error("Nome deve ter pelo menos 2 caracteres");
      return;
    }

    if (!validarTelefone(novoTelefone)) {
      toast.error("Telefone inválido. Informe DDD + número");
      return;
    }

    const nomeIgual = novoNome.trim() === nomeAtual.trim();
    const telefoneIgual = novoTelefone.replace(/\D/g, "") === telefoneAtual.replace(/\D/g, "");

    if (nomeIgual && telefoneIgual) {
      toast.info("Nenhuma alteração realizada");
      onOpenChange(false);
      return;
    }

    setSalvando(true);
    try {
      // Formata telefone para salvar com +55
      const telefoneFormatado = "+55" + novoTelefone.replace(/\D/g, "");
      await onSalvar(novoNome.trim(), telefoneFormatado);
      toast.success("Contato atualizado com sucesso!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao atualizar contato");
    } finally {
      setSalvando(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Editar contato</DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="space-y-2">
            <Label>Nome *</Label>
            <Input
              placeholder="Digite o nome"
              value={novoNome}
              onChange={(e) => setNovoNome(e.target.value)}
              autoFocus
            />
            <p className="text-xs text-muted-foreground">
              Mínimo 2 caracteres
            </p>
          </div>

          <div className="space-y-2">
            <Label>Telefone *</Label>
            <div className="flex items-center gap-2">
              <span className="text-sm text-muted-foreground bg-muted px-3 py-2 rounded-md">
                +55
              </span>
              <Input
                placeholder="(00) 00000-0000"
                value={novoTelefone}
                onChange={handleTelefoneChange}
                className="flex-1"
              />
            </div>
            <p className="text-xs text-muted-foreground">
              DDD + número (10 ou 11 dígitos)
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
