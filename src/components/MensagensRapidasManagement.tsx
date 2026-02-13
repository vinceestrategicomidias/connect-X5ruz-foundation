import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Plus, Pencil, Trash2, Search, Zap } from "lucide-react";
import { MENSAGENS_RAPIDAS_INICIAIS, type MensagemRapida } from "./MensagensRapidasDropdown";
import { toast } from "sonner";

export const MensagensRapidasManagement = () => {
  const [mensagens, setMensagens] = useState<MensagemRapida[]>(MENSAGENS_RAPIDAS_INICIAIS);
  const [busca, setBusca] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editando, setEditando] = useState<MensagemRapida | null>(null);
  const [form, setForm] = useState({ codigo: "", titulo: "", texto: "", setor: "Todos os setores" });

  const mensagensFiltradas = mensagens.filter(m =>
    m.codigo.toLowerCase().includes(busca.toLowerCase()) ||
    m.titulo.toLowerCase().includes(busca.toLowerCase()) ||
    m.texto.toLowerCase().includes(busca.toLowerCase())
  );

  const handleAbrir = (msg?: MensagemRapida) => {
    if (msg) {
      setEditando(msg);
      setForm({ codigo: msg.codigo, titulo: msg.titulo, texto: msg.texto, setor: msg.setor });
    } else {
      setEditando(null);
      setForm({ codigo: "/", titulo: "", texto: "", setor: "Todos os setores" });
    }
    setDialogOpen(true);
  };

  const handleSalvar = () => {
    if (!form.codigo.startsWith("/") || !form.titulo.trim() || !form.texto.trim()) {
      toast.error("Preencha todos os campos obrigatórios. O código deve começar com /");
      return;
    }

    if (editando) {
      setMensagens(prev => prev.map(m => m.codigo === editando.codigo ? { ...form, ativa: m.ativa } : m));
      toast.success("Mensagem atualizada");
    } else {
      if (mensagens.some(m => m.codigo === form.codigo)) {
        toast.error("Já existe uma mensagem com esse código");
        return;
      }
      setMensagens(prev => [...prev, { ...form, ativa: true }]);
      toast.success("Mensagem criada");
    }
    setDialogOpen(false);
  };

  const handleToggle = (codigo: string) => {
    setMensagens(prev => prev.map(m => m.codigo === codigo ? { ...m, ativa: !m.ativa } : m));
  };

  const handleExcluir = (codigo: string) => {
    setMensagens(prev => prev.filter(m => m.codigo !== codigo));
    toast.success("Mensagem excluída");
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <Zap className="h-5 w-5 text-primary" />
            Mensagens Rápidas
          </h3>
          <p className="text-sm text-muted-foreground">
            Gerencie mensagens rápidas acessíveis via atalho "/" no chat ({mensagens.length} cadastradas)
          </p>
        </div>
        <Button onClick={() => handleAbrir()}>
          <Plus className="h-4 w-4 mr-2" />
          Cadastrar mensagem
        </Button>
      </div>

      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por código, título ou conteúdo..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-9"
        />
      </div>

      <Card>
        <CardContent className="p-0">
          <ScrollArea className="h-[500px]">
            <div className="divide-y">
              {mensagensFiltradas.map((msg) => (
                <div key={msg.codigo} className={`p-4 ${!msg.ativa ? "opacity-50" : ""}`}>
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <code className="text-sm font-mono text-primary bg-primary/10 px-2 py-0.5 rounded">{msg.codigo}</code>
                        <span className="font-medium">{msg.titulo}</span>
                        <Badge variant="outline" className="text-xs">{msg.setor}</Badge>
                      </div>
                      <p className="text-sm text-muted-foreground">{msg.texto}</p>
                    </div>
                    <div className="flex items-center gap-2 flex-shrink-0">
                      <Switch checked={msg.ativa} onCheckedChange={() => handleToggle(msg.codigo)} />
                      <Button variant="ghost" size="icon" onClick={() => handleAbrir(msg)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" onClick={() => handleExcluir(msg.codigo)}>
                        <Trash2 className="h-4 w-4 text-destructive" />
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>{editando ? "Editar Mensagem Rápida" : "Cadastrar Mensagem Rápida"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label>Código/atalho *</Label>
              <Input
                value={form.codigo}
                onChange={(e) => setForm({ ...form, codigo: e.target.value })}
                placeholder="/pagamento"
              />
            </div>
            <div className="space-y-2">
              <Label>Título *</Label>
              <Input
                value={form.titulo}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
                placeholder="Formas de pagamento"
              />
            </div>
            <div className="space-y-2">
              <Label>Mensagem *</Label>
              <Textarea
                value={form.texto}
                onChange={(e) => setForm({ ...form, texto: e.target.value })}
                placeholder="Texto da mensagem..."
                rows={4}
              />
            </div>
            <div className="space-y-2">
              <Label>Setor *</Label>
              <Select value={form.setor} onValueChange={(v) => setForm({ ...form, setor: v })}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Todos os setores">Todos os setores</SelectItem>
                  <SelectItem value="Pré-venda">Pré-venda</SelectItem>
                  <SelectItem value="Venda">Venda</SelectItem>
                  <SelectItem value="Pós-venda">Pós-venda</SelectItem>
                  <SelectItem value="Convênios">Convênios</SelectItem>
                  <SelectItem value="Comercial Connect">Comercial Connect</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-3 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setDialogOpen(false)}>Cancelar</Button>
              <Button className="flex-1" onClick={handleSalvar}>Salvar</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
