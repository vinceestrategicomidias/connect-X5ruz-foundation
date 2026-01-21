import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Lightbulb,
  Star,
  ThumbsUp,
  ThumbsDown,
  Send,
  Award,
  MessageCircle,
  HelpCircle,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAtendenteContext } from "@/contexts/AtendenteContext";

type TipoEnvio = "ideia" | "sugestao" | "duvida" | "solicitacao";
type StatusIdeia = "pendente" | "aprovada" | "rejeitada" | "implementada";

interface Ideia {
  id: string;
  autor: string;
  avatar?: string;
  tipo: TipoEnvio;
  titulo: string;
  descricao: string;
  status: StatusIdeia;
  curtidas: number;
  descurtidas: number;
  meuVoto?: "up" | "down";
  dataEnvio: string;
  destaque?: boolean;
  respostaCoordenador?: string;
}

const ideiasSimuladas: Ideia[] = [
  {
    id: "1",
    autor: "Paloma",
    tipo: "ideia",
    titulo: "Scripts automáticos de resposta rápida",
    descricao: "Criar templates de respostas rápidas que podem ser personalizados por cada atendente, agilizando o atendimento.",
    status: "implementada",
    curtidas: 15,
    descurtidas: 1,
    dataEnvio: "15/01/2026",
    destaque: true,
  },
  {
    id: "2",
    autor: "Marcos",
    tipo: "sugestao",
    titulo: "Otimizar fila com Thalí",
    descricao: "Utilizar a IA para redistribuir automaticamente pacientes quando um atendente fica sobrecarregado.",
    status: "aprovada",
    curtidas: 12,
    descurtidas: 2,
    dataEnvio: "12/01/2026",
    destaque: true,
  },
  {
    id: "3",
    autor: "Emilly",
    tipo: "ideia",
    titulo: "Modo escuro mais suave",
    descricao: "Ajustar as cores do modo escuro para serem mais confortáveis durante uso prolongado.",
    status: "aprovada",
    curtidas: 8,
    descurtidas: 0,
    dataEnvio: "10/01/2026",
  },
  {
    id: "4",
    autor: "Geovana",
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
    id: "5",
    autor: "Bianca",
    tipo: "solicitacao",
    titulo: "Solicitar férias em Março",
    descricao: "Gostaria de solicitar férias no período de 15/03 a 30/03.",
    status: "pendente",
    curtidas: 0,
    descurtidas: 0,
    dataEnvio: "05/01/2026",
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

export const CentralIdeiasPanel = () => {
  const { atendenteLogado, isCoordenacao, isGestor } = useAtendenteContext();
  const [ideias, setIdeias] = useState<Ideia[]>(ideiasSimuladas);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [filtroStatus, setFiltroStatus] = useState<string>("todas");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  
  const [novaIdeia, setNovaIdeia] = useState({
    tipo: "ideia" as TipoEnvio,
    titulo: "",
    descricao: "",
  });

  const handleVoto = (ideiaId: string, tipo: "up" | "down") => {
    setIdeias(prev => prev.map(ideia => {
      if (ideia.id === ideiaId) {
        const votoAnterior = ideia.meuVoto;
        let novasCurtidas = ideia.curtidas;
        let novasDescurtidas = ideia.descurtidas;

        // Remover voto anterior
        if (votoAnterior === "up") novasCurtidas--;
        if (votoAnterior === "down") novasDescurtidas--;

        // Adicionar novo voto (ou remover se clicou no mesmo)
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

  const handleEnviarIdeia = () => {
    if (!novaIdeia.titulo.trim() || !novaIdeia.descricao.trim()) return;

    const nova: Ideia = {
      id: Date.now().toString(),
      autor: atendenteLogado?.nome || "Você",
      avatar: atendenteLogado?.avatar,
      tipo: novaIdeia.tipo,
      titulo: novaIdeia.titulo,
      descricao: novaIdeia.descricao,
      status: "pendente",
      curtidas: 0,
      descurtidas: 0,
      dataEnvio: new Date().toLocaleDateString("pt-BR"),
    };

    setIdeias(prev => [nova, ...prev]);
    setNovaIdeia({ tipo: "ideia", titulo: "", descricao: "" });
    setDialogOpen(false);
  };

  const ideiasFiltradas = ideias.filter(ideia => {
    if (filtroStatus !== "todas" && ideia.status !== filtroStatus) return false;
    if (filtroTipo !== "todos" && ideia.tipo !== filtroTipo) return false;
    return true;
  });

  const ideiasDestaque = ideias.filter(i => i.destaque && (i.status === "aprovada" || i.status === "implementada"));
  const reconhecimentoSemana = { usuario: "Emilly", motivo: "Melhor evolução de NPS" };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between flex-wrap gap-4">
        <div className="flex items-center gap-2">
          <Lightbulb className="h-6 w-6 text-[#0A2647]" />
          <h3 className="text-2xl font-bold text-[#0A2647]">
            Central de Ideias
          </h3>
        </div>
        <Button 
          className="bg-[#0A2647] hover:bg-[#144272]"
          onClick={() => setDialogOpen(true)}
        >
          <Send className="h-4 w-4 mr-2" />
          Enviar Nova
        </Button>
      </div>

      {/* Reconhecimento da Semana */}
      <Card className="p-6 bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200 overflow-hidden">
        <h4 className="font-semibold mb-3 text-lg flex items-center gap-2">
          <Award className="h-5 w-5 text-yellow-600 flex-shrink-0" />
          <span className="truncate">Reconhecimento da Semana</span>
        </h4>
        <div className="p-4 bg-white rounded-lg">
          <div className="font-bold text-lg mb-1 truncate">
            {reconhecimentoSemana.usuario}
          </div>
          <p className="text-sm text-muted-foreground line-clamp-2">
            {reconhecimentoSemana.motivo}
          </p>
        </div>
      </Card>

      {/* Ideias em Destaque */}
      {ideiasDestaque.length > 0 && (
        <Card className="p-6 border-primary/30 bg-primary/5">
          <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
            <Star className="h-5 w-5 text-primary fill-primary" />
            Ideias em Destaque
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {ideiasDestaque.map((ideia) => {
              const StatusIcon = statusConfig[ideia.status].icon;
              return (
                <div
                  key={ideia.id}
                  className="p-4 rounded-lg bg-white border-2 border-primary/20 shadow-sm"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Sparkles className="h-4 w-4 text-yellow-500" />
                    <span className="font-semibold text-sm">{ideia.autor}</span>
                    <Badge className={cn("text-xs", statusConfig[ideia.status].cor)}>
                      <StatusIcon className="h-3 w-3 mr-1" />
                      {statusConfig[ideia.status].label}
                    </Badge>
                  </div>
                  <h5 className="font-medium mb-1">{ideia.titulo}</h5>
                  <p className="text-sm text-muted-foreground line-clamp-2">{ideia.descricao}</p>
                  <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
                    <span className="flex items-center gap-1">
                      <ThumbsUp className="h-3 w-3" /> {ideia.curtidas}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Tabs e Filtros */}
      <Tabs defaultValue="todas" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <TabsList>
            <TabsTrigger value="todas">Todas</TabsTrigger>
            <TabsTrigger value="minhas">Minhas</TabsTrigger>
            {(isCoordenacao || isGestor) && (
              <TabsTrigger value="pendentes">Pendentes</TabsTrigger>
            )}
          </TabsList>

          <div className="flex gap-2">
            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos os Tipos</SelectItem>
                {tiposEnvio.map(tipo => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-36">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos os Status</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aprovada">Aprovada</SelectItem>
                <SelectItem value="implementada">Implementada</SelectItem>
                <SelectItem value="rejeitada">Rejeitada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="todas" className="space-y-3">
          {ideiasFiltradas.map((ideia) => (
            <IdeiaCard 
              key={ideia.id} 
              ideia={ideia} 
              onVoto={handleVoto}
              isCoordenacao={isCoordenacao || isGestor}
            />
          ))}
        </TabsContent>

        <TabsContent value="minhas" className="space-y-3">
          {ideiasFiltradas
            .filter(i => i.autor === atendenteLogado?.nome)
            .map((ideia) => (
              <IdeiaCard 
                key={ideia.id} 
                ideia={ideia} 
                onVoto={handleVoto}
                isCoordenacao={isCoordenacao || isGestor}
              />
            ))}
        </TabsContent>

        {(isCoordenacao || isGestor) && (
          <TabsContent value="pendentes" className="space-y-3">
            {ideiasFiltradas
              .filter(i => i.status === "pendente")
              .map((ideia) => (
                <IdeiaCard 
                  key={ideia.id} 
                  ideia={ideia} 
                  onVoto={handleVoto}
                  isCoordenacao={true}
                  showAcoes={true}
                />
              ))}
          </TabsContent>
        )}
      </Tabs>

      {/* Dialog Enviar Ideia */}
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Send className="h-5 w-5 text-primary" />
              Enviar para Coordenação
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-sm font-medium mb-2 block">Tipo</label>
              <div className="grid grid-cols-2 gap-2">
                {tiposEnvio.map(tipo => {
                  const Icon = tipo.icon;
                  return (
                    <Button
                      key={tipo.value}
                      variant={novaIdeia.tipo === tipo.value ? "default" : "outline"}
                      className={cn(
                        "justify-start",
                        novaIdeia.tipo === tipo.value && "bg-[#0A2647]"
                      )}
                      onClick={() => setNovaIdeia({ ...novaIdeia, tipo: tipo.value as TipoEnvio })}
                    >
                      <Icon className={cn("h-4 w-4 mr-2", novaIdeia.tipo !== tipo.value && tipo.cor)} />
                      {tipo.label}
                    </Button>
                  );
                })}
              </div>
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Título</label>
              <Input
                placeholder="Resumo breve..."
                value={novaIdeia.titulo}
                onChange={(e) => setNovaIdeia({ ...novaIdeia, titulo: e.target.value })}
              />
            </div>

            <div>
              <label className="text-sm font-medium mb-2 block">Descrição</label>
              <Textarea
                placeholder="Descreva com detalhes..."
                rows={4}
                value={novaIdeia.descricao}
                onChange={(e) => setNovaIdeia({ ...novaIdeia, descricao: e.target.value })}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-[#0A2647] hover:bg-[#144272]"
              onClick={handleEnviarIdeia}
              disabled={!novaIdeia.titulo.trim() || !novaIdeia.descricao.trim()}
            >
              <Send className="h-4 w-4 mr-2" />
              Enviar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface IdeiaCardProps {
  ideia: Ideia;
  onVoto: (id: string, tipo: "up" | "down") => void;
  isCoordenacao?: boolean;
  showAcoes?: boolean;
}

const IdeiaCard = ({ ideia, onVoto, isCoordenacao, showAcoes }: IdeiaCardProps) => {
  const tipoInfo = tiposEnvio.find(t => t.value === ideia.tipo);
  const TipoIcon = tipoInfo?.icon || Lightbulb;
  const StatusIcon = statusConfig[ideia.status].icon;

  return (
    <Card className={cn(
      "p-4 transition-all hover:shadow-md",
      ideia.destaque && "border-primary/30 bg-primary/5"
    )}>
      <div className="flex items-start gap-4">
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

          {ideia.respostaCoordenador && (
            <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
              <div className="flex items-center gap-1 text-xs text-blue-700 mb-1">
                <MessageCircle className="h-3 w-3" />
                Resposta da Coordenação
              </div>
              <p className="text-sm text-blue-800">{ideia.respostaCoordenador}</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-3">
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2",
                  ideia.meuVoto === "up" && "text-green-600 bg-green-50"
                )}
                onClick={() => onVoto(ideia.id, "up")}
              >
                <ThumbsUp className="h-4 w-4 mr-1" />
                {ideia.curtidas}
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className={cn(
                  "h-8 px-2",
                  ideia.meuVoto === "down" && "text-red-600 bg-red-50"
                )}
                onClick={() => onVoto(ideia.id, "down")}
              >
                <ThumbsDown className="h-4 w-4 mr-1" />
                {ideia.descurtidas}
              </Button>
            </div>

            {showAcoes && isCoordenacao && ideia.status === "pendente" && (
              <div className="flex gap-2">
                <Button variant="outline" size="sm" className="h-8 text-red-600 hover:bg-red-50">
                  <XCircle className="h-4 w-4 mr-1" />
                  Rejeitar
                </Button>
                <Button size="sm" className="h-8 bg-green-600 hover:bg-green-700">
                  <CheckCircle className="h-4 w-4 mr-1" />
                  Aprovar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};
