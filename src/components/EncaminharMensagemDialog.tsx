import { useState, useMemo } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Search, Send, Forward } from "lucide-react";
import { ConnectAvatar } from "./ConnectAvatar";
import { useTodosPacientes } from "@/hooks/usePacientes";
import { toast } from "sonner";

interface EncaminharMensagemDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mensagem: {
    id: string;
    texto: string;
    autor: string;
    horario: string;
  };
  onEncaminhar?: (contatosIds: string[]) => void;
}

export const EncaminharMensagemDialog = ({
  open,
  onOpenChange,
  mensagem,
  onEncaminhar,
}: EncaminharMensagemDialogProps) => {
  const [busca, setBusca] = useState("");
  const [selecionados, setSelecionados] = useState<string[]>([]);
  const { data: pacientes } = useTodosPacientes();

  const contatosFiltrados = useMemo(() => {
    if (!pacientes) return [];
    return pacientes.filter(
      (p) =>
        p.nome.toLowerCase().includes(busca.toLowerCase()) ||
        p.telefone.includes(busca)
    );
  }, [pacientes, busca]);

  const toggleContato = (id: string) => {
    setSelecionados((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    );
  };

  const handleEnviar = () => {
    if (selecionados.length === 0) {
      toast.error("Selecione pelo menos um contato");
      return;
    }
    onEncaminhar?.(selecionados);
    toast.success(`Mensagem encaminhada para ${selecionados.length} contato(s)`);
    setSelecionados([]);
    setBusca("");
    onOpenChange(false);
  };

  const formatarPreview = (texto: string) => {
    if (!texto) return "📎 Mídia";
    if (texto.length > 80) return texto.substring(0, 80) + "...";
    return texto;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md max-h-[85vh] flex flex-col">
        <DialogHeader className="flex-shrink-0">
          <DialogTitle className="flex items-center gap-2">
            <Forward className="h-5 w-5 text-primary" />
            Encaminhar mensagem
          </DialogTitle>
        </DialogHeader>

        {/* Preview da mensagem (1-2 linhas) */}
        <div className="p-3 bg-muted rounded-lg border flex-shrink-0">
          <p className="text-xs text-muted-foreground mb-1">Mensagem:</p>
          <p className="text-sm line-clamp-2">{formatarPreview(mensagem.texto)}</p>
        </div>

        {/* Campo de busca */}
        <div className="relative flex-shrink-0">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar contatos..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>

        {/* Lista de contatos */}
        <ScrollArea className="flex-1 min-h-0 -mx-2 px-2">
          <div className="space-y-1 py-1">
            {contatosFiltrados.length === 0 ? (
              <div className="flex items-center justify-center h-32 text-muted-foreground text-sm">
                {busca ? "Nenhum contato encontrado" : "Nenhum contato disponível"}
              </div>
            ) : (
              contatosFiltrados.map((contato) => (
                <div
                  key={contato.id}
                  onClick={() => toggleContato(contato.id)}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition-colors ${
                    selecionados.includes(contato.id)
                      ? "bg-primary/10 border border-primary/30"
                      : "hover:bg-muted border border-transparent"
                  }`}
                >
                  <ConnectAvatar name={contato.nome} size="md" />
                  <div className="flex-1 min-w-0">
                    <p className="font-medium text-sm truncate">{contato.nome}</p>
                    <p className="text-xs text-muted-foreground">{contato.telefone}</p>
                  </div>
                  <Checkbox
                    checked={selecionados.includes(contato.id)}
                    onCheckedChange={() => toggleContato(contato.id)}
                  />
                </div>
              ))
            )}
          </div>
        </ScrollArea>

        {/* Rodapé fixo com contagem e botão */}
        <div className="flex items-center justify-between pt-3 border-t flex-shrink-0">
          <span className="text-sm text-muted-foreground">
            {selecionados.length} contato(s) selecionado(s)
          </span>
          <Button
            onClick={handleEnviar}
            disabled={selecionados.length === 0}
            className="gap-2"
          >
            <Send className="h-4 w-4" />
            Enviar
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
};
