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
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useCriarValidacao } from "@/hooks/usePerfilValidacoes";
import { 
  Upload, 
  Save, 
  User, 
  Lightbulb, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Send,
  HelpCircle,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles,
  MessageCircle,
  Users,
  Lock,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MeuPerfilDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TipoEnvio = "ideia" | "sugestao" | "duvida" | "solicitacao";
type StatusIdeia = "pendente" | "aprovada" | "rejeitada" | "implementada";
type Visibilidade = "coordenacao" | "publico";

interface MinhaIdeia {
  id: string;
  autor: string;
  avatar?: string;
  tipo: TipoEnvio;
  titulo: string;
  descricao: string;
  status: StatusIdeia;
  visibilidade: Visibilidade;
  curtidas: number;
  descurtidas: number;
  meuVoto?: "up" | "down";
  dataEnvio: string;
  respostaCoordenador?: string;
}

// Ideias do próprio atendente
const minhasIdeiasSimuladas: MinhaIdeia[] = [
  {
    id: "1",
    autor: "Geovana",
    tipo: "ideia",
    titulo: "Criar modo escuro mais suave",
    descricao: "Ajustar as cores do modo escuro para serem mais confortáveis durante uso prolongado.",
    status: "aprovada",
    visibilidade: "publico",
    curtidas: 8,
    descurtidas: 0,
    dataEnvio: "10/01/2026",
  },
  {
    id: "2",
    autor: "Geovana",
    tipo: "duvida",
    titulo: "Como acessar relatórios antigos?",
    descricao: "Gostaria de saber onde encontro os relatórios de meses anteriores.",
    status: "aprovada",
    visibilidade: "coordenacao",
    curtidas: 0,
    descurtidas: 0,
    dataEnvio: "08/01/2026",
    respostaCoordenador: "Você pode acessar no Painel Estratégico > Relatórios > Histórico.",
  },
  {
    id: "3",
    autor: "Geovana",
    tipo: "sugestao",
    titulo: "Notificação sonora para mensagens",
    descricao: "Adicionar opção de som personalizado quando chega mensagem nova.",
    status: "pendente",
    visibilidade: "publico",
    curtidas: 2,
    descurtidas: 0,
    dataEnvio: "15/01/2026",
  },
];

// Ideias públicas dos colegas do setor
const ideiasPublicasSetor: MinhaIdeia[] = [
  {
    id: "p1",
    autor: "Paloma",
    tipo: "ideia",
    titulo: "Scripts automáticos de resposta rápida",
    descricao: "Criar templates de respostas rápidas que podem ser personalizados por cada atendente.",
    status: "implementada",
    visibilidade: "publico",
    curtidas: 15,
    descurtidas: 1,
    dataEnvio: "15/01/2026",
  },
  {
    id: "p2",
    autor: "Marcos",
    tipo: "sugestao",
    titulo: "Otimizar fila com Thalí",
    descricao: "Utilizar a IA para redistribuir automaticamente pacientes quando um atendente fica sobrecarregado.",
    status: "aprovada",
    visibilidade: "publico",
    curtidas: 12,
    descurtidas: 2,
    dataEnvio: "12/01/2026",
  },
  {
    id: "p3",
    autor: "Emilly",
    tipo: "ideia",
    titulo: "Atalhos de teclado personalizados",
    descricao: "Permitir que cada atendente configure seus próprios atalhos de teclado para ações frequentes.",
    status: "pendente",
    visibilidade: "publico",
    curtidas: 5,
    descurtidas: 1,
    dataEnvio: "18/01/2026",
  },
  {
    id: "p4",
    autor: "Bianca",
    tipo: "sugestao",
    titulo: "Dashboard personalizado",
    descricao: "Cada atendente poder escolher quais métricas aparecem no seu painel inicial.",
    status: "pendente",
    visibilidade: "publico",
    curtidas: 7,
    descurtidas: 0,
    dataEnvio: "16/01/2026",
  },
];

const tiposEnvio = [
  { value: "ideia", label: "Ideia", icon: Lightbulb, cor: "text-yellow-600" },
  { value: "sugestao", label: "Sugestão", icon: Star, cor: "text-purple-600" },
  { value: "duvida", label: "Dúvida", icon: HelpCircle, cor: "text-blue-600" },
  { value: "solicitacao", label: "Solicitação", icon: FileText, cor: "text-green-600" },
];

const statusConfig = {
  pendente: { label: "Pendente", icon: Clock, cor: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  aprovada: { label: "Aprovada", icon: CheckCircle, cor: "bg-green-100 text-green-700 border-green-200" },
  rejeitada: { label: "Rejeitada", icon: XCircle, cor: "bg-red-100 text-red-700 border-red-200" },
  implementada: { label: "Implementada", icon: Sparkles, cor: "bg-purple-100 text-purple-700 border-purple-200" },
};

export const MeuPerfilDialog = ({ open, onOpenChange }: MeuPerfilDialogProps) => {
  const { atendenteLogado } = useAtendenteContext();
  const criarValidacao = useCriarValidacao();

  const [formData, setFormData] = useState({
    nome: "",
    assinatura: "",
    avatar: "",
  });

  const [minhasIdeias, setMinhasIdeias] = useState<MinhaIdeia[]>(minhasIdeiasSimuladas);
  const [ideiasSetor, setIdeiasSetor] = useState<MinhaIdeia[]>(ideiasPublicasSetor);
  const [novaIdeia, setNovaIdeia] = useState({
    tipo: "ideia" as TipoEnvio,
    titulo: "",
    descricao: "",
    visibilidade: "publico" as Visibilidade,
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

  const handleEnviarIdeia = () => {
    if (!novaIdeia.titulo.trim() || !novaIdeia.descricao.trim()) return;

    const nova: MinhaIdeia = {
      id: Date.now().toString(),
      autor: atendenteLogado?.nome || "Você",
      avatar: atendenteLogado?.avatar,
      tipo: novaIdeia.tipo,
      titulo: novaIdeia.titulo,
      descricao: novaIdeia.descricao,
      status: "pendente",
      visibilidade: novaIdeia.visibilidade,
      curtidas: 0,
      descurtidas: 0,
      dataEnvio: new Date().toLocaleDateString("pt-BR"),
    };

    setMinhasIdeias(prev => [nova, ...prev]);
    
    // Se for público, adiciona também às ideias do setor
    if (novaIdeia.visibilidade === "publico") {
      setIdeiasSetor(prev => [nova, ...prev]);
    }
    
    setNovaIdeia({ tipo: "ideia", titulo: "", descricao: "", visibilidade: "publico" });
  };

  const handleVotoSetor = (ideiaId: string, tipo: "up" | "down") => {
    setIdeiasSetor(prev => prev.map(ideia => {
      if (ideia.id === ideiaId) {
        const votoAnterior = ideia.meuVoto;
        let novasCurtidas = ideia.curtidas;
        let novasDescurtidas = ideia.descurtidas;

        if (votoAnterior === "up") novasCurtidas--;
        if (votoAnterior === "down") novasDescurtidas--;

        if (votoAnterior !== tipo) {
          if (tipo === "up") novasCurtidas++;
          if (tipo === "down") novasDescurtidas++;
        }

        return {
          ...ideia,
          curtidas: novasCurtidas,
          descurtidas: novasDescurtidas,
          meuVoto: votoAnterior === tipo ? undefined : tipo,
        };
      }
      return ideia;
    }));
  };

  // Ideias aprovadas (minhas + dos colegas)
  const ideiasAprovadas = [
    ...minhasIdeias.filter(i => i.status === "aprovada" || i.status === "implementada"),
    ...ideiasSetor.filter(i => (i.status === "aprovada" || i.status === "implementada") && i.autor !== atendenteLogado?.nome),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-[#0A2647]">Meu Perfil</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="perfil" className="gap-2">
              <User className="h-4 w-4" />
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger value="ideias" className="gap-2">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              Ideia das Estrelas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="perfil" className="mt-4">
            <div className="space-y-6">
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
          </TabsContent>

          <TabsContent value="ideias" className="mt-4">
            <Tabs defaultValue="enviar" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="enviar" className="gap-1 text-xs sm:text-sm">
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Enviar</span>
                </TabsTrigger>
                <TabsTrigger value="setor" className="gap-1 text-xs sm:text-sm">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Setor</span>
                </TabsTrigger>
                <TabsTrigger value="aprovadas" className="gap-1 text-xs sm:text-sm">
                  <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Aprovadas</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab Enviar Ideia */}
              <TabsContent value="enviar">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    {/* Formulário para enviar nova ideia */}
                    <Card className="p-4 border-primary/20 bg-primary/5">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        Nova Ideia
                      </h4>

                      <div className="space-y-4">
                        {/* Destino */}
                        <div>
                          <Label className="text-sm mb-3 block">Enviar para</Label>
                          <RadioGroup
                            value={novaIdeia.visibilidade}
                            onValueChange={(v) => setNovaIdeia({ ...novaIdeia, visibilidade: v as Visibilidade })}
                            className="grid grid-cols-2 gap-3"
                          >
                            <Label
                              htmlFor="publico"
                              className={cn(
                                "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                                novaIdeia.visibilidade === "publico"
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <RadioGroupItem value="publico" id="publico" />
                              <Users className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="font-medium text-sm">Público</p>
                                <p className="text-xs text-muted-foreground">Colegas podem ver e curtir</p>
                              </div>
                            </Label>
                            <Label
                              htmlFor="coordenacao"
                              className={cn(
                                "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                                novaIdeia.visibilidade === "coordenacao"
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <RadioGroupItem value="coordenacao" id="coordenacao" />
                              <Lock className="h-4 w-4 text-orange-600" />
                              <div>
                                <p className="font-medium text-sm">Coordenação</p>
                                <p className="text-xs text-muted-foreground">Privado, só gestão vê</p>
                              </div>
                            </Label>
                          </RadioGroup>
                        </div>

                        {/* Tipo */}
                        <div>
                          <Label className="text-sm mb-2 block">Tipo</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {tiposEnvio.map(tipo => {
                              const Icon = tipo.icon;
                              return (
                                <Button
                                  key={tipo.value}
                                  variant={novaIdeia.tipo === tipo.value ? "default" : "outline"}
                                  size="sm"
                                  className={cn(
                                    "text-xs",
                                    novaIdeia.tipo === tipo.value && "bg-[#0A2647]"
                                  )}
                                  onClick={() => setNovaIdeia({ ...novaIdeia, tipo: tipo.value as TipoEnvio })}
                                >
                                  <Icon className={cn("h-3 w-3 mr-1", novaIdeia.tipo !== tipo.value && tipo.cor)} />
                                  {tipo.label}
                                </Button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm mb-2 block">Título</Label>
                          <Input
                            placeholder="Resumo breve..."
                            value={novaIdeia.titulo}
                            onChange={(e) => setNovaIdeia({ ...novaIdeia, titulo: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label className="text-sm mb-2 block">Descrição</Label>
                          <Textarea
                            placeholder="Descreva com detalhes..."
                            rows={3}
                            value={novaIdeia.descricao}
                            onChange={(e) => setNovaIdeia({ ...novaIdeia, descricao: e.target.value })}
                          />
                        </div>

                        <Button 
                          className="w-full bg-[#0A2647] hover:bg-[#144272]"
                          onClick={handleEnviarIdeia}
                          disabled={!novaIdeia.titulo.trim() || !novaIdeia.descricao.trim()}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Ideia
                        </Button>
                      </div>
                    </Card>

                    {/* Minhas ideias enviadas */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        Minhas Ideias Enviadas
                      </h4>

                      <div className="space-y-3">
                        {minhasIdeias.map((ideia) => (
                          <IdeiaCardSimples key={ideia.id} ideia={ideia} />
                        ))}

                        {minhasIdeias.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>Você ainda não enviou nenhuma ideia.</p>
                            <p className="text-sm">Use o formulário acima para compartilhar suas sugestões!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Tab Ideias do Setor */}
              <TabsContent value="setor">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold">Ideias Públicas do Setor</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Veja as ideias compartilhadas pelos colegas do seu setor e vote nas que você mais gosta!
                    </p>

                    {ideiasSetor.map((ideia) => (
                      <IdeiaCardVotavel 
                        key={ideia.id} 
                        ideia={ideia} 
                        onVoto={handleVotoSetor}
                        podeVotar={ideia.autor !== atendenteLogado?.nome}
                      />
                    ))}

                    {ideiasSetor.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Nenhuma ideia pública no setor ainda.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Tab Aprovadas */}
              <TabsContent value="aprovadas">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <h4 className="font-semibold">Ideias Aprovadas</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Confira as ideias que foram aprovadas pela coordenação! 🎉
                    </p>

                    {ideiasAprovadas.map((ideia) => (
                      <Card 
                        key={ideia.id} 
                        className={cn(
                          "p-4 border-2",
                          ideia.status === "implementada" 
                            ? "border-purple-300 bg-purple-50/50" 
                            : "border-green-300 bg-green-50/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={ideia.avatar} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {ideia.autor.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {ideia.autor === atendenteLogado?.nome && (
                                <Badge className="bg-primary text-xs">Sua ideia!</Badge>
                              )}
                              <span className="font-medium text-sm">{ideia.autor}</span>
                              <Badge className={cn("text-xs", statusConfig[ideia.status].cor)}>
                                {ideia.status === "implementada" ? (
                                  <><Sparkles className="h-3 w-3 mr-1" /> Implementada</>
                                ) : (
                                  <><CheckCircle className="h-3 w-3 mr-1" /> Aprovada</>
                                )}
                              </Badge>
                            </div>
                            <h5 className="font-medium text-sm mb-1">{ideia.titulo}</h5>
                            <p className="text-xs text-muted-foreground line-clamp-2">{ideia.descricao}</p>

                            {ideia.respostaCoordenador && (
                              <div className="mt-2 p-2 rounded-lg bg-blue-50 border border-blue-200">
                                <div className="flex items-center gap-1 text-xs text-blue-700 mb-1">
                                  <MessageCircle className="h-3 w-3" />
                                  Feedback da Coordenação
                                </div>
                                <p className="text-xs text-blue-800">{ideia.respostaCoordenador}</p>
                              </div>
                            )}

                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" /> {ideia.curtidas}
                              </span>
                              <span>{ideia.dataEnvio}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {ideiasAprovadas.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Nenhuma ideia aprovada ainda.</p>
                        <p className="text-sm">Continue enviando suas ideias!</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Card simples para minhas ideias (sem votação)
const IdeiaCardSimples = ({ ideia }: { ideia: MinhaIdeia }) => {
  const tipoInfo = tiposEnvio.find(t => t.value === ideia.tipo);
  const TipoIcon = tipoInfo?.icon || Lightbulb;
  const StatusIcon = statusConfig[ideia.status].icon;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs gap-1">
            <TipoIcon className={cn("h-3 w-3", tipoInfo?.cor)} />
            {tipoInfo?.label}
          </Badge>
          <Badge className={cn("text-xs", statusConfig[ideia.status].cor)}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig[ideia.status].label}
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            {ideia.visibilidade === "publico" ? (
              <><Users className="h-3 w-3" /> Público</>
            ) : (
              <><Lock className="h-3 w-3" /> Coordenação</>
            )}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground flex-shrink-0">{ideia.dataEnvio}</span>
      </div>

      <h5 className="font-medium mb-1">{ideia.titulo}</h5>
      <p className="text-sm text-muted-foreground line-clamp-2">{ideia.descricao}</p>

      {ideia.respostaCoordenador && (
        <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-1 text-xs text-blue-700 mb-1">
            <MessageCircle className="h-3 w-3" />
            Resposta da Coordenação
          </div>
          <p className="text-sm text-blue-800">{ideia.respostaCoordenador}</p>
        </div>
      )}

      {ideia.visibilidade === "publico" && (
        <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" /> {ideia.curtidas}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsDown className="h-3 w-3" /> {ideia.descurtidas}
          </span>
        </div>
      )}
    </Card>
  );
};

// Card com votação para ideias do setor
interface IdeiaCardVotavelProps {
  ideia: MinhaIdeia;
  onVoto: (id: string, tipo: "up" | "down") => void;
  podeVotar: boolean;
}

const IdeiaCardVotavel = ({ ideia, onVoto, podeVotar }: IdeiaCardVotavelProps) => {
  const tipoInfo = tiposEnvio.find(t => t.value === ideia.tipo);
  const TipoIcon = tipoInfo?.icon || Lightbulb;
  const StatusIcon = statusConfig[ideia.status].icon;

  return (
    <Card className={cn(
      "p-4 transition-all hover:shadow-md",
      ideia.status === "implementada" && "border-purple-200 bg-purple-50/30",
      ideia.status === "aprovada" && "border-green-200 bg-green-50/30"
    )}>
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={ideia.avatar} />
          <AvatarFallback className="text-sm bg-primary/10 text-primary">
            {ideia.autor.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold">{ideia.autor}</span>
            <Badge variant="outline" className="text-xs gap-1">
              <TipoIcon className={cn("h-3 w-3", tipoInfo?.cor)} />
              {tipoInfo?.label}
            </Badge>
            <Badge className={cn("text-xs", statusConfig[ideia.status].cor)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[ideia.status].label}
            </Badge>
            <span className="text-xs text-muted-foreground">{ideia.dataEnvio}</span>
          </div>

          <h5 className="font-medium mb-1">{ideia.titulo}</h5>
          <p className="text-sm text-muted-foreground line-clamp-2">{ideia.descricao}</p>

          <div className="flex items-center gap-2 mt-3">
            {podeVotar ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3",
                    ideia.meuVoto === "up" && "text-green-600 bg-green-50"
                  )}
                  onClick={() => onVoto(ideia.id, "up")}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Bom ({ideia.curtidas})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3",
                    ideia.meuVoto === "down" && "text-red-600 bg-red-50"
                  )}
                  onClick={() => onVoto(ideia.id, "down")}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Ruim ({ideia.descurtidas})
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-green-600" /> {ideia.curtidas}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsDown className="h-4 w-4 text-red-600" /> {ideia.descurtidas}
                </span>
                <span className="text-xs italic">(sua ideia)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
