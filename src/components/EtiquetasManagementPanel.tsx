import { useState } from "react";
import { 
  Tag, Plus, Edit2, Trash2, Search, Save, X,
  MoreVertical, Users, TrendingUp
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

export interface Etiqueta {
  id: string;
  nome: string;
  cor: string;
  descricao?: string;
  totalPacientes: number;
  createdAt: string;
}

// Mock de etiquetas
const mockEtiquetas: Etiqueta[] = [
  { 
    id: "1", 
    nome: "VIP", 
    cor: "#9333EA", 
    descricao: "Clientes prioritários com atendimento diferenciado",
    totalPacientes: 47,
    createdAt: "2025-10-15"
  },
  { 
    id: "2", 
    nome: "Negociação", 
    cor: "#F59E0B", 
    descricao: "Em processo de negociação comercial",
    totalPacientes: 128,
    createdAt: "2025-11-02"
  },
  { 
    id: "3", 
    nome: "Proposta Enviada", 
    cor: "#3B82F6", 
    descricao: "Aguardando retorno sobre proposta",
    totalPacientes: 89,
    createdAt: "2025-11-10"
  },
  { 
    id: "4", 
    nome: "Primeira Consulta", 
    cor: "#10B981", 
    descricao: "Pacientes em primeiro contato",
    totalPacientes: 234,
    createdAt: "2025-09-20"
  },
  { 
    id: "5", 
    nome: "Retorno", 
    cor: "#6366F1", 
    descricao: "Pacientes que retornaram para novo atendimento",
    totalPacientes: 156,
    createdAt: "2025-08-05"
  },
  { 
    id: "6", 
    nome: "Convênio", 
    cor: "#EC4899", 
    descricao: "Atendimento via convênio médico",
    totalPacientes: 312,
    createdAt: "2025-07-18"
  },
  { 
    id: "7", 
    nome: "Particular", 
    cor: "#14B8A6", 
    descricao: "Atendimento particular",
    totalPacientes: 198,
    createdAt: "2025-07-18"
  },
  { 
    id: "8", 
    nome: "Urgente", 
    cor: "#EF4444", 
    descricao: "Casos que requerem atenção imediata",
    totalPacientes: 23,
    createdAt: "2025-12-01"
  },
];

const coresPredefinidas = [
  "#EF4444", "#F59E0B", "#10B981", "#3B82F6", 
  "#6366F1", "#9333EA", "#EC4899", "#14B8A6",
  "#0A2647", "#144272", "#205295", "#2C74B3"
];

export const EtiquetasManagementPanel = () => {
  const [etiquetas, setEtiquetas] = useState<Etiqueta[]>(mockEtiquetas);
  const [searchTerm, setSearchTerm] = useState("");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingEtiqueta, setEditingEtiqueta] = useState<Etiqueta | null>(null);
  const [formData, setFormData] = useState({
    nome: "",
    cor: "#3B82F6",
    descricao: "",
  });

  const filteredEtiquetas = etiquetas.filter(e => 
    e.nome.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleNovaEtiqueta = () => {
    setEditingEtiqueta(null);
    setFormData({ nome: "", cor: "#3B82F6", descricao: "" });
    setDialogOpen(true);
  };

  const handleEditarEtiqueta = (etiqueta: Etiqueta) => {
    setEditingEtiqueta(etiqueta);
    setFormData({
      nome: etiqueta.nome,
      cor: etiqueta.cor,
      descricao: etiqueta.descricao || "",
    });
    setDialogOpen(true);
  };

  const handleSalvar = () => {
    if (!formData.nome.trim()) {
      toast.error("Nome da etiqueta é obrigatório");
      return;
    }

    if (editingEtiqueta) {
      setEtiquetas(prev => prev.map(e => 
        e.id === editingEtiqueta.id 
          ? { ...e, ...formData }
          : e
      ));
      toast.success("Etiqueta atualizada com sucesso!");
    } else {
      const novaEtiqueta: Etiqueta = {
        id: Date.now().toString(),
        nome: formData.nome,
        cor: formData.cor,
        descricao: formData.descricao,
        totalPacientes: 0,
        createdAt: new Date().toISOString().split('T')[0],
      };
      setEtiquetas(prev => [...prev, novaEtiqueta]);
      toast.success("Etiqueta criada com sucesso!");
    }

    setDialogOpen(false);
  };

  const handleExcluir = (id: string) => {
    setEtiquetas(prev => prev.filter(e => e.id !== id));
    toast.success("Etiqueta excluída com sucesso!");
  };

  const totalPacientesComEtiqueta = etiquetas.reduce((acc, e) => acc + e.totalPacientes, 0);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Tag className="h-6 w-6 text-[#0A2647]" />
          <h3 className="text-2xl font-bold text-[#0A2647]">
            Gestão de Etiquetas
          </h3>
        </div>
        <Button onClick={handleNovaEtiqueta} className="bg-[#0A2647] hover:bg-[#144272]">
          <Plus className="h-4 w-4 mr-2" />
          Nova Etiqueta
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-[#0A2647]/10">
              <Tag className="h-5 w-5 text-[#0A2647]" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Total de Etiquetas</p>
              <p className="text-2xl font-bold text-[#0A2647]">{etiquetas.length}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-green-100">
              <Users className="h-5 w-5 text-green-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Pacientes Etiquetados</p>
              <p className="text-2xl font-bold text-green-600">{totalPacientesComEtiqueta}</p>
            </div>
          </div>
        </Card>
        <Card className="p-4">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-purple-100">
              <TrendingUp className="h-5 w-5 text-purple-600" />
            </div>
            <div>
              <p className="text-sm text-muted-foreground">Mais Usada</p>
              <p className="text-lg font-bold text-purple-600">
                {etiquetas.sort((a, b) => b.totalPacientes - a.totalPacientes)[0]?.nome || "-"}
              </p>
            </div>
          </div>
        </Card>
      </div>

      {/* Busca */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar etiquetas..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-10"
        />
      </div>

      {/* Lista de etiquetas */}
      <ScrollArea className="h-[400px]">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pr-4">
          {filteredEtiquetas.map((etiqueta) => (
            <Card key={etiqueta.id} className="p-4 hover:shadow-md transition-shadow">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div 
                    className="w-4 h-4 rounded-full mt-1 flex-shrink-0"
                    style={{ backgroundColor: etiqueta.cor }}
                  />
                  <div className="min-w-0">
                    <div className="flex items-center gap-2">
                      <h4 className="font-semibold truncate">{etiqueta.nome}</h4>
                      <Badge variant="secondary" className="text-xs">
                        {etiqueta.totalPacientes} pacientes
                      </Badge>
                    </div>
                    {etiqueta.descricao && (
                      <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                        {etiqueta.descricao}
                      </p>
                    )}
                  </div>
                </div>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="ghost" size="icon" className="h-8 w-8">
                      <MoreVertical className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={() => handleEditarEtiqueta(etiqueta)}>
                      <Edit2 className="h-4 w-4 mr-2" />
                      Editar
                    </DropdownMenuItem>
                    <DropdownMenuItem 
                      onClick={() => handleExcluir(etiqueta.id)}
                      className="text-destructive"
                    >
                      <Trash2 className="h-4 w-4 mr-2" />
                      Excluir
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </Card>
          ))}
        </div>
      </ScrollArea>

      {/* Dialog de criação/edição */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {editingEtiqueta ? "Editar Etiqueta" : "Nova Etiqueta"}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div className="space-y-2">
              <Label htmlFor="nome">Nome da Etiqueta</Label>
              <Input
                id="nome"
                placeholder="Ex: VIP, Negociação, Proposta Enviada..."
                value={formData.nome}
                onChange={(e) => setFormData(prev => ({ ...prev, nome: e.target.value }))}
              />
            </div>

            <div className="space-y-2">
              <Label>Cor</Label>
              <div className="flex flex-wrap gap-2">
                {coresPredefinidas.map((cor) => (
                  <button
                    key={cor}
                    onClick={() => setFormData(prev => ({ ...prev, cor }))}
                    className={`w-8 h-8 rounded-full transition-all ${
                      formData.cor === cor ? "ring-2 ring-offset-2 ring-primary scale-110" : ""
                    }`}
                    style={{ backgroundColor: cor }}
                  />
                ))}
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="descricao">Descrição (opcional)</Label>
              <Input
                id="descricao"
                placeholder="Descreva o propósito desta etiqueta..."
                value={formData.descricao}
                onChange={(e) => setFormData(prev => ({ ...prev, descricao: e.target.value }))}
              />
            </div>

            {/* Preview */}
            <div className="p-4 bg-muted/30 rounded-lg">
              <p className="text-sm text-muted-foreground mb-2">Preview:</p>
              <Badge 
                style={{ 
                  backgroundColor: `${formData.cor}20`,
                  color: formData.cor,
                  borderColor: formData.cor 
                }}
                className="border"
              >
                <Tag className="h-3 w-3 mr-1" />
                {formData.nome || "Nome da etiqueta"}
              </Badge>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              <X className="h-4 w-4 mr-2" />
              Cancelar
            </Button>
            <Button onClick={handleSalvar} className="bg-[#0A2647] hover:bg-[#144272]">
              <Save className="h-4 w-4 mr-2" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
