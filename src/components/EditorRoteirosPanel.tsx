import { useState } from "react";
import { 
  X, Plus, Trash2, Save, Pencil, GripVertical, 
  ChevronDown, ChevronUp, MessageSquare, GitBranch, AlertTriangle
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogFooter 
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { cn } from "@/lib/utils";

// Types
interface Mensagem {
  id: string;
  numero?: number;
  texto: string;
  tipo: "mensagem_simples" | "mensagem_com_dupla_escolha";
  perguntaBase?: string;
  opcao1?: string;
  opcao2?: string;
  grupoOpcao1?: string;
  grupoOpcao2?: string;
}

interface GrupoMensagens {
  id: string;
  titulo: string;
  mensagens: Mensagem[];
}

interface Objecao {
  id: string;
  nome: string;
  resposta: string;
}

interface Roteiro {
  id: string;
  nome: string;
  setorId: string;
  setorNome: string;
  numeracaoAtiva: boolean;
  grupos: GrupoMensagens[];
  objecoes: Objecao[];
  habilitarObjecoes: boolean;
}

// Mock de setores
const setoresMock = [
  { id: "1", nome: "Pré-venda" },
  { id: "2", nome: "Pós-venda" },
  { id: "3", nome: "Suporte" },
  { id: "4", nome: "Financeiro" },
];

// Mock de roteiros existentes
const roteirosMock: Roteiro[] = [
  {
    id: "1",
    nome: "Roteiro Pré-venda – Particular",
    setorId: "1",
    setorNome: "Pré-venda",
    numeracaoAtiva: true,
    grupos: [
      {
        id: "g1",
        titulo: "Boas-vindas e qualificação",
        mensagens: [
          { id: "m1", numero: 1, texto: "Olá! Seja bem-vindo(a) ao Grupo Liruz 💙", tipo: "mensagem_simples" },
          { id: "m2", numero: 2, texto: "Sou [nome], vou te ajudar hoje!", tipo: "mensagem_simples" },
        ],
      },
      {
        id: "g2",
        titulo: "Coleta de dados",
        mensagens: [
          { id: "m3", numero: 1, texto: "Para seguir, preciso do seu nome completo e CPF.", tipo: "mensagem_simples" },
        ],
      },
    ],
    objecoes: [
      { id: "o1", nome: "Financeiro", resposta: "Entendo sua preocupação. Temos condições facilitadas..." },
      { id: "o2", nome: "Tempo", resposta: "O procedimento é rápido e seguro..." },
    ],
    habilitarObjecoes: true,
  },
  {
    id: "2",
    nome: "Roteiro Pré-venda – Convênio",
    setorId: "1",
    setorNome: "Pré-venda",
    numeracaoAtiva: true,
    grupos: [
      {
        id: "g1",
        titulo: "Boas-vindas",
        mensagens: [
          { id: "m1", numero: 1, texto: "Olá! Bem-vindo(a) ao atendimento por convênio.", tipo: "mensagem_simples" },
        ],
      },
    ],
    objecoes: [],
    habilitarObjecoes: false,
  },
];

interface EditorRoteirosPanelProps {
  onClose: () => void;
}

export const EditorRoteirosPanel = ({ onClose }: EditorRoteirosPanelProps) => {
  const [roteiros, setRoteiros] = useState<Roteiro[]>(roteirosMock);
  const [editorOpen, setEditorOpen] = useState(false);
  const [roteiroEditando, setRoteiroEditando] = useState<Roteiro | null>(null);
  const [expandedGroups, setExpandedGroups] = useState<Set<string>>(new Set());

  // Form state
  const [formNome, setFormNome] = useState("");
  const [formSetor, setFormSetor] = useState("");
  const [formNumeracao, setFormNumeracao] = useState(true);
  const [formGrupos, setFormGrupos] = useState<GrupoMensagens[]>([]);
  const [formObjecoes, setFormObjecoes] = useState<Objecao[]>([]);
  const [formHabilitarObjecoes, setFormHabilitarObjecoes] = useState(false);

  const handleNovoRoteiro = () => {
    setRoteiroEditando(null);
    setFormNome("");
    setFormSetor("");
    setFormNumeracao(true);
    setFormGrupos([{
      id: `g-${Date.now()}`,
      titulo: "",
      mensagens: [],
    }]);
    setFormObjecoes([]);
    setFormHabilitarObjecoes(false);
    setEditorOpen(true);
  };

  const handleEditarRoteiro = (roteiro: Roteiro) => {
    setRoteiroEditando(roteiro);
    setFormNome(roteiro.nome);
    setFormSetor(roteiro.setorId);
    setFormNumeracao(roteiro.numeracaoAtiva);
    setFormGrupos([...roteiro.grupos]);
    setFormObjecoes([...roteiro.objecoes]);
    setFormHabilitarObjecoes(roteiro.habilitarObjecoes);
    setEditorOpen(true);
  };

  const handleSalvarRoteiro = () => {
    if (!formNome.trim() || !formSetor) {
      toast.error("Preencha o nome e selecione o setor");
      return;
    }

    const setorNome = setoresMock.find(s => s.id === formSetor)?.nome || "";
    
    const novoRoteiro: Roteiro = {
      id: roteiroEditando?.id || `r-${Date.now()}`,
      nome: formNome,
      setorId: formSetor,
      setorNome,
      numeracaoAtiva: formNumeracao,
      grupos: formGrupos,
      objecoes: formObjecoes,
      habilitarObjecoes: formHabilitarObjecoes,
    };

    if (roteiroEditando) {
      setRoteiros(roteiros.map(r => r.id === roteiroEditando.id ? novoRoteiro : r));
      toast.success("Roteiro atualizado com sucesso!");
    } else {
      setRoteiros([...roteiros, novoRoteiro]);
      toast.success("Roteiro criado com sucesso!");
    }

    setEditorOpen(false);
  };

  const handleExcluirRoteiro = (id: string) => {
    setRoteiros(roteiros.filter(r => r.id !== id));
    toast.success("Roteiro excluído");
  };

  // Grupo handlers
  const handleAdicionarGrupo = () => {
    setFormGrupos([...formGrupos, {
      id: `g-${Date.now()}`,
      titulo: "",
      mensagens: [],
    }]);
  };

  const handleRemoverGrupo = (grupoId: string) => {
    setFormGrupos(formGrupos.filter(g => g.id !== grupoId));
  };

  const handleAtualizarTituloGrupo = (grupoId: string, titulo: string) => {
    setFormGrupos(formGrupos.map(g => g.id === grupoId ? { ...g, titulo } : g));
  };

  // Mensagem handlers
  const handleAdicionarMensagem = (grupoId: string) => {
    const grupo = formGrupos.find(g => g.id === grupoId);
    if (!grupo) return;

    const novaMensagem: Mensagem = {
      id: `m-${Date.now()}`,
      numero: formNumeracao ? grupo.mensagens.length + 1 : undefined,
      texto: "",
      tipo: "mensagem_simples",
    };

    setFormGrupos(formGrupos.map(g => 
      g.id === grupoId 
        ? { ...g, mensagens: [...g.mensagens, novaMensagem] }
        : g
    ));
  };

  const handleRemoverMensagem = (grupoId: string, mensagemId: string) => {
    setFormGrupos(formGrupos.map(g => 
      g.id === grupoId 
        ? { 
            ...g, 
            mensagens: g.mensagens
              .filter(m => m.id !== mensagemId)
              .map((m, idx) => ({ ...m, numero: formNumeracao ? idx + 1 : undefined }))
          }
        : g
    ));
  };

  const handleAtualizarMensagem = (grupoId: string, mensagemId: string, updates: Partial<Mensagem>) => {
    setFormGrupos(formGrupos.map(g => 
      g.id === grupoId 
        ? { 
            ...g, 
            mensagens: g.mensagens.map(m => 
              m.id === mensagemId ? { ...m, ...updates } : m
            )
          }
        : g
    ));
  };

  // Objecao handlers
  const handleAdicionarObjecao = () => {
    setFormObjecoes([...formObjecoes, {
      id: `o-${Date.now()}`,
      nome: "",
      resposta: "",
    }]);
  };

  const handleRemoverObjecao = (id: string) => {
    setFormObjecoes(formObjecoes.filter(o => o.id !== id));
  };

  const handleAtualizarObjecao = (id: string, updates: Partial<Objecao>) => {
    setFormObjecoes(formObjecoes.map(o => o.id === id ? { ...o, ...updates } : o));
  };

  const toggleGroupExpanded = (grupoId: string) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(grupoId)) {
      newExpanded.delete(grupoId);
    } else {
      newExpanded.add(grupoId);
    }
    setExpandedGroups(newExpanded);
  };

  // Group by setor
  const roteirosPorSetor = roteiros.reduce((acc, roteiro) => {
    if (!acc[roteiro.setorNome]) {
      acc[roteiro.setorNome] = [];
    }
    acc[roteiro.setorNome].push(roteiro);
    return acc;
  }, {} as Record<string, Roteiro[]>);

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-[#0A2647]">
          Roteiros de Atendimento
        </h3>
        <Button onClick={handleNovoRoteiro} className="bg-[#0A2647] hover:bg-[#144272]">
          <Plus className="h-4 w-4 mr-2" />
          Criar Roteiro
        </Button>
      </div>

      {/* Lista de roteiros por setor */}
      <ScrollArea className="h-[calc(100vh-280px)]">
        <div className="space-y-6 pr-4">
          {Object.entries(roteirosPorSetor).map(([setor, roteirosSetor]) => (
            <Card key={setor} className="p-6">
              <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
                <MessageSquare className="h-5 w-5 text-primary" />
                Setor: {setor}
              </h4>
              <div className="space-y-3">
                {roteirosSetor.map(roteiro => (
                  <div 
                    key={roteiro.id} 
                    className="p-4 border border-border rounded-lg hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 min-w-0">
                        <h5 className="font-semibold mb-2 truncate">{roteiro.nome}</h5>
                        <div className="flex flex-wrap gap-2 mb-2">
                          <Badge variant="outline" className="text-xs">
                            {roteiro.grupos.length} grupos
                          </Badge>
                          <Badge variant="outline" className="text-xs">
                            {roteiro.grupos.reduce((acc, g) => acc + g.mensagens.length, 0)} mensagens
                          </Badge>
                          {roteiro.numeracaoAtiva && (
                            <Badge variant="secondary" className="text-xs">
                              Numeração ativa
                            </Badge>
                          )}
                          {roteiro.habilitarObjecoes && (
                            <Badge variant="secondary" className="text-xs">
                              {roteiro.objecoes.length} objeções
                            </Badge>
                          )}
                        </div>
                        <ol className="list-decimal list-inside space-y-1 text-sm text-muted-foreground">
                          {roteiro.grupos.slice(0, 3).map(g => (
                            <li key={g.id} className="truncate">{g.titulo || "Grupo sem título"}</li>
                          ))}
                          {roteiro.grupos.length > 3 && (
                            <li className="text-muted-foreground/60">
                              + {roteiro.grupos.length - 3} grupos...
                            </li>
                          )}
                        </ol>
                      </div>
                      <div className="flex gap-2 flex-shrink-0">
                        <Button 
                          size="sm" 
                          variant="outline"
                          onClick={() => handleEditarRoteiro(roteiro)}
                        >
                          <Pencil className="h-3 w-3 mr-1" />
                          Editar
                        </Button>
                        <Button 
                          size="sm" 
                          variant="outline" 
                          className="text-destructive hover:text-destructive"
                          onClick={() => handleExcluirRoteiro(roteiro.id)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          ))}

          {Object.keys(roteirosPorSetor).length === 0 && (
            <Card className="p-12 text-center">
              <MessageSquare className="h-12 w-12 text-muted-foreground/30 mx-auto mb-4" />
              <p className="text-muted-foreground">Nenhum roteiro cadastrado.</p>
              <p className="text-sm text-muted-foreground/60 mt-1">
                Clique em "Criar Roteiro" para começar.
              </p>
            </Card>
          )}
        </div>
      </ScrollArea>

      {/* Editor Dialog */}
      <Dialog open={editorOpen} onOpenChange={setEditorOpen}>
        <DialogContent className="max-w-4xl max-h-[90vh] p-0 gap-0 overflow-hidden">
          <DialogHeader className="px-6 py-4 border-b flex-shrink-0">
            <DialogTitle>
              {roteiroEditando ? "Editar Roteiro" : "Criar Novo Roteiro"}
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 max-h-[calc(90vh-140px)]">
            <div className="p-6 space-y-6">
              {/* Dados básicos */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="nome">Nome do Roteiro *</Label>
                  <Input
                    id="nome"
                    placeholder="Ex.: Roteiro Pré-venda – Particular"
                    value={formNome}
                    onChange={e => setFormNome(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="setor">Setor Vinculado *</Label>
                  <Select value={formSetor} onValueChange={setFormSetor}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecione o setor" />
                    </SelectTrigger>
                    <SelectContent>
                      {setoresMock.map(setor => (
                        <SelectItem key={setor.id} value={setor.id}>
                          {setor.nome}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              {/* Toggle numeração */}
              <div className="flex items-center justify-between p-4 bg-muted/30 rounded-lg">
                <div>
                  <Label>Permitir Numeração</Label>
                  <p className="text-sm text-muted-foreground">
                    Exibir número sequencial em cada mensagem (01, 02, 03...)
                  </p>
                </div>
                <Switch 
                  checked={formNumeracao} 
                  onCheckedChange={setFormNumeracao}
                />
              </div>

              {/* Grupos de mensagens */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <Label className="text-lg font-semibold">Grupos de Mensagens</Label>
                  <Button size="sm" variant="outline" onClick={handleAdicionarGrupo}>
                    <Plus className="h-4 w-4 mr-1" />
                    Adicionar Grupo
                  </Button>
                </div>

                {formGrupos.map((grupo, grupoIndex) => (
                  <Card key={grupo.id} className="p-4 border-2">
                    <div className="space-y-4">
                      {/* Header do grupo */}
                      <div className="flex items-center gap-3">
                        <GripVertical className="h-4 w-4 text-muted-foreground cursor-grab" />
                        <Input
                          placeholder="Título do grupo (Ex.: Boas-vindas e qualificação)"
                          value={grupo.titulo}
                          onChange={e => handleAtualizarTituloGrupo(grupo.id, e.target.value)}
                          className="flex-1"
                        />
                        <Button 
                          size="icon" 
                          variant="ghost"
                          onClick={() => toggleGroupExpanded(grupo.id)}
                        >
                          {expandedGroups.has(grupo.id) ? (
                            <ChevronUp className="h-4 w-4" />
                          ) : (
                            <ChevronDown className="h-4 w-4" />
                          )}
                        </Button>
                        {formGrupos.length > 1 && (
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemoverGrupo(grupo.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>

                      {/* Mensagens do grupo */}
                      {(expandedGroups.has(grupo.id) || grupo.mensagens.length === 0) && (
                        <div className="space-y-3 pl-7">
                          {grupo.mensagens.map((mensagem, msgIndex) => (
                            <Card key={mensagem.id} className="p-4 bg-muted/20">
                              <div className="space-y-3">
                                <div className="flex items-start gap-3">
                                  {formNumeracao && (
                                    <Badge variant="outline" className="mt-1 flex-shrink-0">
                                      {String(mensagem.numero).padStart(2, '0')}
                                    </Badge>
                                  )}
                                  <div className="flex-1 space-y-2">
                                    <Select 
                                      value={mensagem.tipo}
                                      onValueChange={(value: "mensagem_simples" | "mensagem_com_dupla_escolha") => 
                                        handleAtualizarMensagem(grupo.id, mensagem.id, { tipo: value })
                                      }
                                    >
                                      <SelectTrigger className="w-48">
                                        <SelectValue />
                                      </SelectTrigger>
                                      <SelectContent>
                                        <SelectItem value="mensagem_simples">
                                          <div className="flex items-center gap-2">
                                            <MessageSquare className="h-3 w-3" />
                                            Mensagem simples
                                          </div>
                                        </SelectItem>
                                        <SelectItem value="mensagem_com_dupla_escolha">
                                          <div className="flex items-center gap-2">
                                            <GitBranch className="h-3 w-3" />
                                            Dupla escolha
                                          </div>
                                        </SelectItem>
                                      </SelectContent>
                                    </Select>

                                    {mensagem.tipo === "mensagem_simples" ? (
                                      <Textarea
                                        placeholder="Digite o texto da mensagem..."
                                        value={mensagem.texto}
                                        onChange={e => handleAtualizarMensagem(grupo.id, mensagem.id, { texto: e.target.value })}
                                        rows={2}
                                      />
                                    ) : (
                                      <div className="space-y-3">
                                        <Input
                                          placeholder="Pergunta base (Ex.: Qual opção se aplica?)"
                                          value={mensagem.perguntaBase || ""}
                                          onChange={e => handleAtualizarMensagem(grupo.id, mensagem.id, { perguntaBase: e.target.value })}
                                        />
                                        <div className="grid grid-cols-2 gap-3">
                                          <div className="space-y-2">
                                            <Input
                                              placeholder="Opção 1 (Ex.: Particular)"
                                              value={mensagem.opcao1 || ""}
                                              onChange={e => handleAtualizarMensagem(grupo.id, mensagem.id, { opcao1: e.target.value })}
                                            />
                                            <Select 
                                              value={mensagem.grupoOpcao1 || ""}
                                              onValueChange={value => handleAtualizarMensagem(grupo.id, mensagem.id, { grupoOpcao1: value })}
                                            >
                                              <SelectTrigger className="text-xs">
                                                <SelectValue placeholder="Vincular grupo..." />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {formGrupos.filter(g => g.id !== grupo.id).map(g => (
                                                  <SelectItem key={g.id} value={g.id}>
                                                    {g.titulo || "Grupo sem título"}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                          <div className="space-y-2">
                                            <Input
                                              placeholder="Opção 2 (Ex.: Convênio)"
                                              value={mensagem.opcao2 || ""}
                                              onChange={e => handleAtualizarMensagem(grupo.id, mensagem.id, { opcao2: e.target.value })}
                                            />
                                            <Select 
                                              value={mensagem.grupoOpcao2 || ""}
                                              onValueChange={value => handleAtualizarMensagem(grupo.id, mensagem.id, { grupoOpcao2: value })}
                                            >
                                              <SelectTrigger className="text-xs">
                                                <SelectValue placeholder="Vincular grupo..." />
                                              </SelectTrigger>
                                              <SelectContent>
                                                {formGrupos.filter(g => g.id !== grupo.id).map(g => (
                                                  <SelectItem key={g.id} value={g.id}>
                                                    {g.titulo || "Grupo sem título"}
                                                  </SelectItem>
                                                ))}
                                              </SelectContent>
                                            </Select>
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                  <Button 
                                    size="icon" 
                                    variant="ghost" 
                                    className="text-destructive hover:text-destructive flex-shrink-0"
                                    onClick={() => handleRemoverMensagem(grupo.id, mensagem.id)}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              </div>
                            </Card>
                          ))}

                          <Button 
                            size="sm" 
                            variant="outline" 
                            onClick={() => handleAdicionarMensagem(grupo.id)}
                            className="w-full"
                          >
                            <Plus className="h-4 w-4 mr-1" />
                            Adicionar Mensagem
                          </Button>
                        </div>
                      )}
                    </div>
                  </Card>
                ))}
              </div>

              {/* Objeções */}
              <div className="space-y-4">
                <div className="flex items-center justify-between p-4 bg-orange-50 dark:bg-orange-950/20 rounded-lg border border-orange-200 dark:border-orange-900">
                  <div className="flex items-center gap-3">
                    <AlertTriangle className="h-5 w-5 text-orange-600" />
                    <div>
                      <Label>Bloco de Objeções</Label>
                      <p className="text-sm text-muted-foreground">
                        Mensagens prontas para contornar objeções comuns
                      </p>
                    </div>
                  </div>
                  <Switch 
                    checked={formHabilitarObjecoes} 
                    onCheckedChange={setFormHabilitarObjecoes}
                  />
                </div>

                {formHabilitarObjecoes && (
                  <div className="space-y-3 pl-4">
                    {formObjecoes.map(objecao => (
                      <Card key={objecao.id} className="p-4">
                        <div className="flex items-start gap-3">
                          <div className="flex-1 space-y-2">
                            <Input
                              placeholder="Nome da objeção (Ex.: Financeiro)"
                              value={objecao.nome}
                              onChange={e => handleAtualizarObjecao(objecao.id, { nome: e.target.value })}
                            />
                            <Textarea
                              placeholder="Resposta para contornar..."
                              value={objecao.resposta}
                              onChange={e => handleAtualizarObjecao(objecao.id, { resposta: e.target.value })}
                              rows={2}
                            />
                          </div>
                          <Button 
                            size="icon" 
                            variant="ghost" 
                            className="text-destructive hover:text-destructive"
                            onClick={() => handleRemoverObjecao(objecao.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </Card>
                    ))}

                    <Button 
                      size="sm" 
                      variant="outline" 
                      onClick={handleAdicionarObjecao}
                    >
                      <Plus className="h-4 w-4 mr-1" />
                      Adicionar Objeção
                    </Button>

                    {formObjecoes.length === 0 && (
                      <p className="text-sm text-muted-foreground italic">
                        Sugestões: Financeiro, Tempo, Sem interesse, Concorrência
                      </p>
                    )}
                  </div>
                )}
              </div>
            </div>
          </ScrollArea>

          <DialogFooter className="px-6 py-4 border-t flex-shrink-0">
            <Button variant="outline" onClick={() => setEditorOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvarRoteiro} className="bg-[#0A2647] hover:bg-[#144272]">
              <Save className="h-4 w-4 mr-2" />
              Salvar Roteiro
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
