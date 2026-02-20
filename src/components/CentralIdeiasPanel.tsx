import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
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
  Award,
  MessageCircle,
  HelpCircle,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles,
  Users,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAtendenteContext } from "@/contexts/AtendenteContext";

type TipoEnvio = "ideia" | "sugestao" | "duvida" | "solicitacao";
type StatusIdeia = "pendente" | "aprovada" | "rejeitada" | "implementada";
type Visibilidade = "coordenacao" | "publico";

interface Ideia {
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
    visibilidade: "publico",
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
    visibilidade: "publico",
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
    visibilidade: "publico",
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
    visibilidade: "coordenacao",
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
    visibilidade: "coordenacao",
    curtidas: 0,
    descurtidas: 0,
    dataEnvio: "05/01/2026",
  },
  {
    id: "6",
    autor: "Pedro",
    tipo: "ideia",
    titulo: "Atalhos de teclado personalizados",
    descricao: "Permitir que cada atendente configure seus próprios atalhos de teclado para ações frequentes.",
    status: "pendente",
    visibilidade: "publico",
    curtidas: 5,
    descurtidas: 1,
    dataEnvio: "18/01/2026",
  },
];

const tiposEnvio = [
  { value: "ideia", label: "Ideia", icon: Lightbulb, cor: "text-warning" },
  { value: "sugestao", label: "Sugestão", icon: Star, cor: "text-primary" },
  { value: "duvida", label: "Dúvida", icon: HelpCircle, cor: "text-primary" },
  { value: "solicitacao", label: "Solicitação", icon: FileText, cor: "text-success" },
];

const statusConfig = {
  pendente: { label: "Pendente", icon: Clock, cor: "bg-warning/10 text-warning border-warning/20" },
  aprovada: { label: "Aprovada", icon: CheckCircle, cor: "bg-success/10 text-success border-success/20" },
  rejeitada: { label: "Rejeitada", icon: XCircle, cor: "bg-destructive/10 text-destructive border-destructive/20" },
  implementada: { label: "Implementada", icon: Sparkles, cor: "bg-primary/10 text-primary border-primary/20" },
};

export const CentralIdeiasPanel = () => {
  const { isCoordenacao, isGestor } = useAtendenteContext();
  const [ideias, setIdeias] = useState<Ideia[]>(ideiasSimuladas);
  const [filtroStatus, setFiltroStatus] = useState<string>("todas");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroVisibilidade, setFiltroVisibilidade] = useState<string>("todas");
  
  const [feedbackDialog, setFeedbackDialog] = useState<{
    open: boolean;
    ideiaId: string;
    acao: "aprovar" | "reprovar";
  }>({ open: false, ideiaId: "", acao: "aprovar" });
  const [feedbackTexto, setFeedbackTexto] = useState("");

  const handleAprovar = (ideiaId: string) => {
    setFeedbackDialog({ open: true, ideiaId, acao: "aprovar" });
    setFeedbackTexto("");
  };

  const handleReprovar = (ideiaId: string) => {
    setFeedbackDialog({ open: true, ideiaId, acao: "reprovar" });
    setFeedbackTexto("");
  };

  const confirmarAcao = () => {
    setIdeias(prev => prev.map(ideia => {
      if (ideia.id === feedbackDialog.ideiaId) {
        return {
          ...ideia,
          status: feedbackDialog.acao === "aprovar" ? "aprovada" : "rejeitada",
          respostaCoordenador: feedbackTexto.trim() || undefined,
        };
      }
      return ideia;
    }));
    setFeedbackDialog({ open: false, ideiaId: "", acao: "aprovar" });
    setFeedbackTexto("");
  };

  const ideiasFiltradas = ideias.filter(ideia => {
    if (filtroStatus !== "todas" && ideia.status !== filtroStatus) return false;
    if (filtroTipo !== "todos" && ideia.tipo !== filtroTipo) return false;
    if (filtroVisibilidade !== "todas" && ideia.visibilidade !== filtroVisibilidade) return false;
    return true;
  });

  const ideiasDestaque = ideias.filter(i => i.destaque && (i.status === "aprovada" || i.status === "implementada"));
  const reconhecimentoSemana = { usuario: "Emilly", motivo: "Melhor evolução de NPS" };
  const totalPendentes = ideias.filter(i => i.status === "pendente").length;

  return (
    <div className="space-y-5">
      {/* Reconhecimento da Semana */}
      <Card className="p-5 border-border/60 bg-warning/5">
        <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-warning" />
          Reconhecimento da Semana
        </h4>
        <div className="p-3 bg-background rounded-lg border border-border/40">
          <div className="text-sm font-semibold mb-0.5">{reconhecimentoSemana.usuario}</div>
          <p className="text-xs text-muted-foreground">{reconhecimentoSemana.motivo}</p>
        </div>
      </Card>

      {/* Ideias em Destaque */}
      {ideiasDestaque.length > 0 && (
        <Card className="p-5 border-primary/20 bg-primary/5">
          <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-primary fill-primary" />
            Ideias em Destaque
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ideiasDestaque.map((ideia) => {
              const StatusIcon = statusConfig[ideia.status].icon;
              return (
                <div key={ideia.id} className="p-3 rounded-lg bg-background border border-primary/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="h-3 w-3 text-warning" />
                    <span className="text-xs font-semibold">{ideia.autor}</span>
                    <Badge className={cn("text-[10px]", statusConfig[ideia.status].cor)}>
                      <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                      {statusConfig[ideia.status].label}
                    </Badge>
                  </div>
                  <h5 className="text-xs font-medium mb-1">{ideia.titulo}</h5>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{ideia.descricao}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <ThumbsUp className="h-2.5 w-2.5" /> {ideia.curtidas}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Tabs e Filtros */}
      <Tabs defaultValue="pendentes" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="pendentes" className="text-xs gap-1">
              <Clock className="h-3 w-3" />
              Pendentes
              {totalPendentes > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                  {totalPendentes}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="todas" className="text-xs">Todas</TabsTrigger>
            <TabsTrigger value="aprovadas" className="text-xs">Aprovadas</TabsTrigger>
          </TabsList>

          <div className="flex gap-2 flex-wrap">
            <Select value={filtroVisibilidade} onValueChange={setFiltroVisibilidade}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Visibilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="coordenacao">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Coordenação
                  </span>
                </SelectItem>
                <SelectItem value="publico">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> Público
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {tiposEnvio.map(tipo => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aprovada">Aprovada</SelectItem>
                <SelectItem value="implementada">Implementada</SelectItem>
                <SelectItem value="rejeitada">Rejeitada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="pendentes" className="space-y-3">
          {ideiasFiltradas
            .filter(i => i.status === "pendente")
            .map((ideia) => (
              <IdeiaCardGestao 
                key={ideia.id} 
                ideia={ideia}
                onAprovar={handleAprovar}
                onReprovar={handleReprovar}
              />
            ))}
          {ideiasFiltradas.filter(i => i.status === "pendente").length === 0 && (
            <Card className="p-8 text-center text-muted-foreground border-border/60">
              <CheckCircle className="h-10 w-10 mx-auto mb-3 text-success" />
              <p className="text-sm font-medium">Nenhuma ideia pendente!</p>
              <p className="text-xs">Todas as ideias foram analisadas.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="todas" className="space-y-3">
          {ideiasFiltradas.map((ideia) => (
            <IdeiaCardGestao 
              key={ideia.id} 
              ideia={ideia}
              onAprovar={ideia.status === "pendente" ? handleAprovar : undefined}
              onReprovar={ideia.status === "pendente" ? handleReprovar : undefined}
            />
          ))}
        </TabsContent>

        <TabsContent value="aprovadas" className="space-y-3">
          {ideiasFiltradas
            .filter(i => i.status === "aprovada" || i.status === "implementada")
            .map((ideia) => (
              <IdeiaCardGestao 
                key={ideia.id} 
                ideia={ideia}
              />
            ))}
        </TabsContent>
      </Tabs>

      {/* Dialog Feedback/Resposta */}
      <Dialog open={feedbackDialog.open} onOpenChange={(open) => !open && setFeedbackDialog({ open: false, ideiaId: "", acao: "aprovar" })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              {feedbackDialog.acao === "aprovar" ? (
                <>
                  <CheckCircle className="h-4 w-4 text-success" />
                  Aprovar Ideia
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  Reprovar Ideia
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs font-medium mb-2 block">
                Feedback para o autor (opcional)
              </label>
              <Textarea
                placeholder={
                  feedbackDialog.acao === "aprovar" 
                    ? "Parabéns! Sua ideia foi muito bem recebida..."
                    : "Explique o motivo da reprovação..."
                }
                rows={4}
                className="text-xs"
                value={feedbackTexto}
                onChange={(e) => setFeedbackTexto(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setFeedbackDialog({ open: false, ideiaId: "", acao: "aprovar" })}>
              Cancelar
            </Button>
            <Button 
              size="sm"
              className={cn("h-8 text-xs", feedbackDialog.acao === "aprovar" ? "bg-success hover:bg-success/90" : "bg-destructive hover:bg-destructive/90")}
              onClick={confirmarAcao}
            >
              {feedbackDialog.acao === "aprovar" ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  Confirmar Aprovação
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Confirmar Reprovação
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface IdeiaCardGestaoProps {
  ideia: Ideia;
  onAprovar?: (id: string) => void;
  onReprovar?: (id: string) => void;
}

const IdeiaCardGestao = ({ ideia, onAprovar, onReprovar }: IdeiaCardGestaoProps) => {
  const tipoInfo = tiposEnvio.find(t => t.value === ideia.tipo);
  const TipoIcon = tipoInfo?.icon || Lightbulb;
  const StatusIcon = statusConfig[ideia.status].icon;

  return (
    <Card className={cn(
      "p-4 transition-all border-border/60",
      ideia.destaque && "border-primary/30 bg-primary/5",
      ideia.status === "pendente" && "border-warning/30 bg-warning/5"
    )}>
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={ideia.avatar} />
          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
            {ideia.autor.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className="text-xs font-semibold">{ideia.autor}</span>
            <Badge variant="outline" className="text-[10px] gap-0.5">
              <TipoIcon className={cn("h-2.5 w-2.5", tipoInfo?.cor)} />
              {tipoInfo?.label}
            </Badge>
            <Badge className={cn("text-[10px]", statusConfig[ideia.status].cor)}>
              <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
              {statusConfig[ideia.status].label}
            </Badge>
            <Badge variant="outline" className="text-[10px] gap-0.5">
              {ideia.visibilidade === "publico" ? (
                <>
                  <Users className="h-2.5 w-2.5" />
                  Público
                </>
              ) : (
                <>
                  <Lock className="h-2.5 w-2.5" />
                  Coordenação
                </>
              )}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{ideia.dataEnvio}</span>
          </div>

          <h5 className="text-xs font-medium mb-0.5">{ideia.titulo}</h5>
          <p className="text-[10px] text-muted-foreground line-clamp-2">{ideia.descricao}</p>

          {ideia.respostaCoordenador && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-1 text-[10px] text-primary mb-0.5">
                <MessageCircle className="h-2.5 w-2.5" />
                Resposta da Coordenação
              </div>
              <p className="text-xs text-foreground">{ideia.respostaCoordenador}</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <ThumbsUp className="h-3 w-3" />
                {ideia.curtidas}
              </span>
              <span className="flex items-center gap-0.5">
                <ThumbsDown className="h-3 w-3" />
                {ideia.descurtidas}
              </span>
            </div>

            {onAprovar && onReprovar && ideia.status === "pendente" && (
              <div className="flex gap-1.5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-[10px] text-destructive hover:bg-destructive/5 border-destructive/20"
                  onClick={() => onReprovar(ideia.id)}
                >
                  <XCircle className="h-3 w-3 mr-0.5" />
                  Reprovar
                </Button>
                <Button 
                  size="sm" 
                  className="h-7 text-[10px] bg-success hover:bg-success/90"
                  onClick={() => onAprovar(ideia.id)}
                >
                  <CheckCircle className="h-3 w-3 mr-0.5" />
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
