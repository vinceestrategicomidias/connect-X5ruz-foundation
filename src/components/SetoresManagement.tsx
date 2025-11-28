import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  useSetores,
  useCriarSetor,
  useAtualizarSetor,
  useDeletarSetor,
} from "@/hooks/useSetores";
import { Settings, Plus, Pencil, Trash2, Loader2 } from "lucide-react";
import { useAtendenteContext } from "@/contexts/AtendenteContext";

export const SetoresManagement = () => {
  const { isGestor } = useAtendenteContext();
  const { data: setores, isLoading } = useSetores();
  const criarSetor = useCriarSetor();
  const atualizarSetor = useAtualizarSetor();
  const deletarSetor = useDeletarSetor();

  const [open, setOpen] = useState(false);
  const [editando, setEditando] = useState<string | null>(null);
  const [novoSetor, setNovoSetor] = useState({
    nome: "",
    descricao: "",
    cor: "#3b82f6",
  });

  if (!isGestor) return null;

  const handleCriar = async () => {
    if (!novoSetor.nome.trim()) return;
    await criarSetor.mutateAsync(novoSetor);
    setNovoSetor({ nome: "", descricao: "", cor: "#3b82f6" });
  };

  const handleAtualizar = async (id: string, updates: any) => {
    await atualizarSetor.mutateAsync({ id, ...updates });
    setEditando(null);
  };

  const handleDeletar = async (id: string) => {
    if (confirm("Deseja realmente desativar este setor?")) {
      await deletarSetor.mutateAsync(id);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Settings className="h-4 w-4 mr-2" />
          Gerenciar Setores
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle>Gerenciamento de Setores</DialogTitle>
          <DialogDescription>
            Criar, editar ou desativar setores do sistema
          </DialogDescription>
        </DialogHeader>

        {/* Formulário de Novo Setor */}
        <div className="space-y-4 p-4 border rounded-lg bg-muted/20">
          <h4 className="font-medium">Novo Setor</h4>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                value={novoSetor.nome}
                onChange={(e) =>
                  setNovoSetor({ ...novoSetor, nome: e.target.value })
                }
                placeholder="Ex: Suporte Técnico"
              />
            </div>
            <div>
              <Label htmlFor="cor">Cor</Label>
              <Input
                id="cor"
                type="color"
                value={novoSetor.cor}
                onChange={(e) =>
                  setNovoSetor({ ...novoSetor, cor: e.target.value })
                }
              />
            </div>
          </div>
          <div>
            <Label htmlFor="descricao">Descrição</Label>
            <Input
              id="descricao"
              value={novoSetor.descricao}
              onChange={(e) =>
                setNovoSetor({ ...novoSetor, descricao: e.target.value })
              }
              placeholder="Descrição opcional"
            />
          </div>
          <Button onClick={handleCriar} className="w-full">
            <Plus className="h-4 w-4 mr-2" />
            Criar Setor
          </Button>
        </div>

        {/* Lista de Setores */}
        <ScrollArea className="h-[300px]">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin" />
            </div>
          ) : (
            <div className="space-y-2">
              {setores?.map((setor) => (
                <div
                  key={setor.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                >
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="w-4 h-4 rounded-full"
                      style={{ backgroundColor: setor.cor }}
                    />
                    {editando === setor.id ? (
                      <Input
                        value={setor.nome}
                        onChange={(e) =>
                          handleAtualizar(setor.id, { nome: e.target.value })
                        }
                        onBlur={() => setEditando(null)}
                        autoFocus
                      />
                    ) : (
                      <div>
                        <p className="font-medium">{setor.nome}</p>
                        {setor.descricao && (
                          <p className="text-xs text-muted-foreground">
                            {setor.descricao}
                          </p>
                        )}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-2">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setEditando(setor.id)}
                    >
                      <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => handleDeletar(setor.id)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
