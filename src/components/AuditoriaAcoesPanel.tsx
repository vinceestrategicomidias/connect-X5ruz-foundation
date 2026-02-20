import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
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
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  History,
  Download,
  Search,
  Filter,
  Calendar,
  Users,
  MessageSquare,
  Send,
  Star,
  UserPlus,
  FileText,
  Phone,
  DollarSign,
  Eye,
  Forward,
  Clock,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface AcaoAuditoria {
  id: string;
  tipo: string;
  tipoIcone: any;
  descricao: string;
  usuario: string;
  usuarioAvatar?: string;
  cargo: string;
  data: string;
  horario: string;
  paciente?: string;
  pacienteTelefone?: string;
  conversa_id?: string;
  detalhes?: {
    campo?: string;
    valorAnterior?: string;
    valorNovo?: string;
    destinatario?: string;
    valor?: string;
    mensagem?: string;
  };
}

const acoesSimuladas: AcaoAuditoria[] = [
  {
    id: "1",
    tipo: "Mensagem Enviada",
    tipoIcone: Send,
    descricao: "Enviou mensagem para Ana Cristina",
    usuario: "Geovana",
    cargo: "Atendente",
    data: "21/01/2026",
    horario: "14:32",
    paciente: "Ana Cristina",
    pacienteTelefone: "(11) 98765-4321",
    conversa_id: "conv-123",
    detalhes: {
      mensagem: "Olá! Seu orçamento foi aprovado e já está disponível.",
    },
  },
  {
    id: "2",
    tipo: "Encaminhou Conversa",
    tipoIcone: Forward,
    descricao: "Encaminhou conversa para Emilly",
    usuario: "Paloma",
    cargo: "Atendente",
    data: "21/01/2026",
    horario: "14:15",
    paciente: "Luiz Fernando",
    pacienteTelefone: "(11) 91234-5678",
    conversa_id: "conv-456",
    detalhes: {
      destinatario: "Emilly",
    },
  },
  {
    id: "3",
    tipo: "Favoritou Mensagem",
    tipoIcone: Star,
    descricao: "Favoritou mensagem importante",
    usuario: "Emilly",
    cargo: "Atendente",
    data: "21/01/2026",
    horario: "13:48",
    paciente: "Maria Santos",
    pacienteTelefone: "(11) 99876-5432",
    conversa_id: "conv-789",
  },
  {
    id: "4",
    tipo: "Iniciou Atendimento",
    tipoIcone: UserPlus,
    descricao: "Iniciou atendimento com novo paciente",
    usuario: "Marcos",
    cargo: "Atendente",
    data: "21/01/2026",
    horario: "13:22",
    paciente: "José Silva",
    pacienteTelefone: "(11) 98888-7777",
    conversa_id: "conv-101",
  },
  {
    id: "5",
    tipo: "Adicionou Orçamento",
    tipoIcone: DollarSign,
    descricao: "Adicionou valores ao orçamento",
    usuario: "Geovana",
    cargo: "Atendente",
    data: "21/01/2026",
    horario: "12:55",
    paciente: "Carla Mendes",
    pacienteTelefone: "(11) 97777-6666",
    conversa_id: "conv-202",
    detalhes: {
      valor: "R$ 2.450,00",
      campo: "Procedimento Cirúrgico",
    },
  },
  {
    id: "6",
    tipo: "Realizou Ligação",
    tipoIcone: Phone,
    descricao: "Realizou ligação telefônica",
    usuario: "Bianca",
    cargo: "Atendente",
    data: "21/01/2026",
    horario: "12:30",
    paciente: "Roberto Lima",
    pacienteTelefone: "(11) 96666-5555",
    detalhes: {
      valorAnterior: "3:45",
    },
  },
  {
    id: "7",
    tipo: "Alteração de URA",
    tipoIcone: FileText,
    descricao: "Alterou configuração de URA",
    usuario: "Admin",
    cargo: "Gestor",
    data: "21/01/2026",
    horario: "08:12",
    detalhes: {
      campo: "Mensagem de boas-vindas",
      valorAnterior: "Texto antigo...",
      valorNovo: "Novo texto atualizado...",
    },
  },
  {
    id: "8",
    tipo: "Edição de Roteiro",
    tipoIcone: FileText,
    descricao: "Editou roteiro de atendimento",
    usuario: "Coordenação",
    cargo: "Coordenação",
    data: "21/01/2026",
    horario: "10:47",
    detalhes: {
      campo: "Roteiro Pré-Venda",
    },
  },
];

const tiposAcao = [
  { value: "todas", label: "Todas as Ações" },
  { value: "mensagem", label: "Mensagens Enviadas" },
  { value: "encaminhou", label: "Encaminhamentos" },
  { value: "favoritou", label: "Favoritos" },
  { value: "atendimento", label: "Início de Atendimento" },
  { value: "orcamento", label: "Orçamentos" },
  { value: "ligacao", label: "Ligações" },
  { value: "ura", label: "Alteração de URA" },
  { value: "roteiro", label: "Edição de Roteiro" },
];

const atendentes = [
  { value: "todos", label: "Todos os Usuários" },
  { value: "geovana", label: "Geovana" },
  { value: "paloma", label: "Paloma" },
  { value: "emilly", label: "Emilly" },
  { value: "marcos", label: "Marcos" },
  { value: "bianca", label: "Bianca" },
  { value: "admin", label: "Admin" },
  { value: "coordenacao", label: "Coordenação" },
];

const getTipoColor = (tipo: string) => {
  const colors: Record<string, string> = {
    "Mensagem Enviada": "bg-primary/10 text-primary border-primary/20",
    "Encaminhou Conversa": "bg-primary/10 text-primary border-primary/20",
    "Favoritou Mensagem": "bg-warning/10 text-warning border-warning/20",
    "Iniciou Atendimento": "bg-success/10 text-success border-success/20",
    "Adicionou Orçamento": "bg-success/10 text-success border-success/20",
    "Realizou Ligação": "bg-primary/10 text-primary border-primary/20",
    "Alteração de URA": "bg-warning/10 text-warning border-warning/20",
    "Edição de Roteiro": "bg-primary/10 text-primary border-primary/20",
  };
  return colors[tipo] || "bg-muted text-muted-foreground border-border";
};

export const AuditoriaAcoesPanel = () => {
  const [busca, setBusca] = useState("");
  const [buscaNumero, setBuscaNumero] = useState("");
  const [filtroData, setFiltroData] = useState("7dias");
  const [filtroTipo, setFiltroTipo] = useState("todas");
  const [filtroUsuario, setFiltroUsuario] = useState("todos");
  const [acaoSelecionada, setAcaoSelecionada] = useState<AcaoAuditoria | null>(null);

  const acoesFiltradas = acoesSimuladas.filter(acao => {
    if (busca && !acao.descricao.toLowerCase().includes(busca.toLowerCase()) &&
        !acao.paciente?.toLowerCase().includes(busca.toLowerCase())) {
      return false;
    }
    if (buscaNumero && !acao.pacienteTelefone?.includes(buscaNumero)) {
      return false;
    }
    if (filtroTipo !== "todas") {
      const tipoMap: Record<string, string[]> = {
        mensagem: ["Mensagem Enviada"],
        encaminhou: ["Encaminhou Conversa"],
        favoritou: ["Favoritou Mensagem"],
        atendimento: ["Iniciou Atendimento"],
        orcamento: ["Adicionou Orçamento"],
        ligacao: ["Realizou Ligação"],
        ura: ["Alteração de URA"],
        roteiro: ["Edição de Roteiro"],
      };
      if (!tipoMap[filtroTipo]?.includes(acao.tipo)) return false;
    }
    if (filtroUsuario !== "todos" && 
        acao.usuario.toLowerCase() !== filtroUsuario.toLowerCase()) {
      return false;
    }
    return true;
  });

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-center justify-between gap-4">
        <p className="text-xs text-muted-foreground">Histórico completo de ações do sistema</p>
        <Button variant="outline" size="sm" className="h-8 text-xs">
          <Download className="h-3.5 w-3.5 mr-1.5" />
          Exportar
        </Button>
      </div>

      {/* Barra de Busca */}
      <div className="flex flex-wrap gap-2">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Pesquisar conversa, paciente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9 h-8 text-xs"
          />
        </div>
        <div className="relative w-44">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-3.5 w-3.5 text-muted-foreground" />
          <Input
            placeholder="Buscar por número..."
            value={buscaNumero}
            onChange={(e) => setBuscaNumero(e.target.value)}
            className="pl-9 h-8 text-xs"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-2 p-3 rounded-lg border border-border/60 bg-muted/10">
        <Filter className="h-3 w-3 text-muted-foreground mt-1.5" />
        
        <Select value={filtroData} onValueChange={setFiltroData}>
          <SelectTrigger className="w-32 h-7 text-[10px]">
            <Calendar className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hoje">Hoje</SelectItem>
            <SelectItem value="7dias">7 dias</SelectItem>
            <SelectItem value="30dias">30 dias</SelectItem>
            <SelectItem value="90dias">90 dias</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={filtroTipo} onValueChange={setFiltroTipo}>
          <SelectTrigger className="w-44 h-7 text-[10px]">
            <SelectValue placeholder="Tipo de Ação" />
          </SelectTrigger>
          <SelectContent>
            {tiposAcao.map(tipo => (
              <SelectItem key={tipo.value} value={tipo.value}>
                {tipo.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={filtroUsuario} onValueChange={setFiltroUsuario}>
          <SelectTrigger className="w-40 h-7 text-[10px]">
            <Users className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Atendente" />
          </SelectTrigger>
          <SelectContent>
            {atendentes.map(atendente => (
              <SelectItem key={atendente.value} value={atendente.value}>
                {atendente.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Lista de Ações */}
      <Card className="overflow-hidden border-border/60">
        <ScrollArea className="h-[500px]">
          <div className="divide-y divide-border/50">
            {acoesFiltradas.map((acao) => {
              const IconeAcao = acao.tipoIcone;
              return (
                <div
                  key={acao.id}
                  className="p-3 hover:bg-muted/20 transition-colors cursor-pointer"
                  onClick={() => setAcaoSelecionada(acao)}
                >
                  <div className="flex items-start gap-3">
                    <Avatar className="h-8 w-8 flex-shrink-0">
                      <AvatarImage src={acao.usuarioAvatar} />
                      <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
                        {acao.usuario.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-1.5 flex-wrap mb-0.5">
                        <span className="text-xs font-semibold">{acao.usuario}</span>
                        <span className="text-[10px] text-muted-foreground">({acao.cargo})</span>
                        <Badge className={cn("text-[10px] gap-0.5", getTipoColor(acao.tipo))}>
                          <IconeAcao className="h-2.5 w-2.5" />
                          {acao.tipo}
                        </Badge>
                      </div>

                      <p className="text-[10px] text-muted-foreground mb-0.5">
                        {acao.descricao}
                      </p>

                      {acao.paciente && (
                        <div className="flex items-center gap-1.5 text-[10px]">
                          <MessageSquare className="h-2.5 w-2.5 text-muted-foreground" />
                          <span className="font-medium">{acao.paciente}</span>
                          {acao.pacienteTelefone && (
                            <span className="text-muted-foreground">
                              {acao.pacienteTelefone}
                            </span>
                          )}
                        </div>
                      )}

                      {acao.detalhes?.valor && (
                        <div className="mt-0.5 text-[10px] text-success font-medium">
                          {acao.detalhes.valor}
                        </div>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-[10px] font-medium">{acao.data}</div>
                      <div className="text-[10px] text-muted-foreground flex items-center justify-end gap-0.5">
                        <Clock className="h-2.5 w-2.5" />
                        {acao.horario}
                      </div>
                    </div>

                    <ChevronRight className="h-3.5 w-3.5 text-muted-foreground flex-shrink-0" />
                  </div>
                </div>
              );
            })}

            {acoesFiltradas.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <History className="h-10 w-10 mx-auto mb-3 opacity-50" />
                <p className="text-xs">Nenhuma ação encontrada com os filtros selecionados.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Dialog Detalhes */}
      <Dialog open={!!acaoSelecionada} onOpenChange={() => setAcaoSelecionada(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              <Eye className="h-4 w-4 text-primary" />
              Detalhes da Ação
            </DialogTitle>
          </DialogHeader>

          {acaoSelecionada && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-10 w-10">
                  <AvatarImage src={acaoSelecionada.usuarioAvatar} />
                  <AvatarFallback className="text-xs bg-primary/10 text-primary">
                    {acaoSelecionada.usuario.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="text-xs font-semibold">{acaoSelecionada.usuario}</div>
                  <div className="text-[10px] text-muted-foreground">{acaoSelecionada.cargo}</div>
                </div>
              </div>

              <div className="space-y-2.5 p-3 bg-muted/10 rounded-lg border border-border/60">
                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Tipo:</span>
                  <Badge className={cn("text-[10px]", getTipoColor(acaoSelecionada.tipo))}>
                    {acaoSelecionada.tipo}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-[10px] text-muted-foreground">Data/Hora:</span>
                  <span className="text-xs font-medium">
                    {acaoSelecionada.data} às {acaoSelecionada.horario}
                  </span>
                </div>

                {acaoSelecionada.paciente && (
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Paciente:</span>
                    <span className="text-xs font-medium">{acaoSelecionada.paciente}</span>
                  </div>
                )}

                {acaoSelecionada.pacienteTelefone && (
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Telefone:</span>
                    <span className="text-xs font-medium">{acaoSelecionada.pacienteTelefone}</span>
                  </div>
                )}

                {acaoSelecionada.detalhes?.destinatario && (
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Encaminhado para:</span>
                    <span className="text-xs font-medium">{acaoSelecionada.detalhes.destinatario}</span>
                  </div>
                )}

                {acaoSelecionada.detalhes?.valor && (
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Valor:</span>
                    <span className="text-xs font-medium text-success">
                      {acaoSelecionada.detalhes.valor}
                    </span>
                  </div>
                )}

                {acaoSelecionada.detalhes?.campo && (
                  <div className="flex justify-between">
                    <span className="text-[10px] text-muted-foreground">Campo:</span>
                    <span className="text-xs font-medium">{acaoSelecionada.detalhes.campo}</span>
                  </div>
                )}

                {acaoSelecionada.detalhes?.valorAnterior && acaoSelecionada.detalhes?.valorNovo && (
                  <div className="space-y-1.5 pt-1">
                    <div className="text-[10px] text-muted-foreground">Alteração:</div>
                    <div className="text-[10px] bg-destructive/5 p-1.5 rounded border border-destructive/10 line-through">
                      {acaoSelecionada.detalhes.valorAnterior}
                    </div>
                    <div className="text-[10px] bg-success/5 p-1.5 rounded border border-success/10">
                      {acaoSelecionada.detalhes.valorNovo}
                    </div>
                  </div>
                )}

                {acaoSelecionada.detalhes?.mensagem && (
                  <div className="space-y-1 pt-1">
                    <div className="text-[10px] text-muted-foreground">Mensagem:</div>
                    <div className="text-xs bg-muted/20 p-2 rounded border border-border/40 italic">
                      "{acaoSelecionada.detalhes.mensagem}"
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
