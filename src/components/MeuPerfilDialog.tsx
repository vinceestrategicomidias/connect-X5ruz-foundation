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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MeuPerfilDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TipoEnvio = "ideia" | "sugestao" | "duvida" | "solicitacao";
type StatusIdeia = "pendente" | "aprovada" | "rejeitada" | "implementada";

interface MinhaIdeia {
  id: string;
  tipo: TipoEnvio;
  titulo: string;
  descricao: string;
  status: StatusIdeia;
  curtidas: number;
  descurtidas: number;
  dataEnvio: string;
  respostaCoordenador?: string;
}

const minhasIdeiasSimuladas: MinhaIdeia[] = [
  {
    id: "1",
    tipo: "ideia",
    titulo: "Criar modo escuro mais suave",
    descricao: "Ajustar as cores do modo escuro para serem mais confortáveis durante uso prolongado.",
    status: "aprovada",
    curtidas: 8,
    descurtidas: 0,
    dataEnvio: "10/01/2026",
  },
  {
    id: "2",
    tipo: "duvida",
    titulo: "Como acessar relatórios antigos?",
    descricao: "Gostaria de saber onde encontro os relatórios de meses anteriores.",
    status: "aprovada",
    curtidas: 3,
    descurtidas: 0,
    dataEnvio: "08/01/2026",
    respostaCoordenador: "Você pode acessar no Painel Estratégico > Relatórios > Histórico.",
  },
  {
    id: "3",
    tipo: "sugestao",
    titulo: "Notificação sonora para mensagens",
    descricao: "Adicionar opção de som personalizado quando chega mensagem nova.",
    status: "pendente",
    curtidas: 0,
    descurtidas: 0,
    dataEnvio: "15/01/2026",
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
  const [novaIdeia, setNovaIdeia] = useState({
    tipo: "ideia" as TipoEnvio,
    titulo: "",
    descricao: "",
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
      tipo: novaIdeia.tipo,
      titulo: novaIdeia.titulo,
      descricao: novaIdeia.descricao,
      status: "pendente",
      curtidas: 0,
      descurtidas: 0,
      dataEnvio: new Date().toLocaleDateString("pt-BR"),
    };

    setMinhasIdeias(prev => [nova, ...prev]);
    setNovaIdeia({ tipo: "ideia", titulo: "", descricao: "" });
  };

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
              <Lightbulb className="h-4 w-4" />
              Minhas Ideias
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
            <ScrollArea className="h-[500px] pr-4">
              <div className="space-y-6">
                {/* Formulário para enviar nova ideia */}
                <Card className="p-4 border-primary/20 bg-primary/5">
                  <h4 className="font-semibold mb-4 flex items-center gap-2">
                    <Send className="h-4 w-4 text-primary" />
                    Enviar para Coordenação
                  </h4>

                  <div className="space-y-4">
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
                      Enviar
                    </Button>
                  </div>
                </Card>

                {/* Lista de ideias enviadas */}
                <div>
                  <h4 className="font-semibold mb-3 flex items-center gap-2">
                    <Star className="h-4 w-4 text-primary" />
                    Minhas Ideias Enviadas
                  </h4>

                  <div className="space-y-3">
                    {minhasIdeias.map((ideia) => {
                      const tipoInfo = tiposEnvio.find(t => t.value === ideia.tipo);
                      const TipoIcon = tipoInfo?.icon || Lightbulb;
                      const StatusIcon = statusConfig[ideia.status].icon;

                      return (
                        <Card key={ideia.id} className="p-4">
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
                            </div>
                            <span className="text-xs text-muted-foreground">{ideia.dataEnvio}</span>
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

                          <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                            <span className="flex items-center gap-1">
                              <ThumbsUp className="h-3 w-3" /> {ideia.curtidas}
                            </span>
                            <span className="flex items-center gap-1">
                              <ThumbsDown className="h-3 w-3" /> {ideia.descurtidas}
                            </span>
                          </div>
                        </Card>
                      );
                    })}

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
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
