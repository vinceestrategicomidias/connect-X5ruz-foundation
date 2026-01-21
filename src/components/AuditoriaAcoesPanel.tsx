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

export const AuditoriaAcoesPanel = () => {
  const [busca, setBusca] = useState("");
  const [buscaNumero, setBuscaNumero] = useState("");
  const [filtroData, setFiltroData] = useState("7dias");
  const [filtroTipo, setFiltroTipo] = useState("todas");
  const [filtroUsuario, setFiltroUsuario] = useState("todos");
  const [acaoSelecionada, setAcaoSelecionada] = useState<AcaoAuditoria | null>(null);

  const acoesFiltradas = acoesSimuladas.filter(acao => {
    // Filtro por busca de conversa/descrição
    if (busca && !acao.descricao.toLowerCase().includes(busca.toLowerCase()) &&
        !acao.paciente?.toLowerCase().includes(busca.toLowerCase())) {
      return false;
    }

    // Filtro por número
    if (buscaNumero && !acao.pacienteTelefone?.includes(buscaNumero)) {
      return false;
    }

    // Filtro por tipo
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

    // Filtro por usuário
    if (filtroUsuario !== "todos" && 
        acao.usuario.toLowerCase() !== filtroUsuario.toLowerCase()) {
      return false;
    }

    return true;
  });

  const getTipoColor = (tipo: string) => {
    const colors: Record<string, string> = {
      "Mensagem Enviada": "bg-blue-100 text-blue-700 border-blue-200",
      "Encaminhou Conversa": "bg-purple-100 text-purple-700 border-purple-200",
      "Favoritou Mensagem": "bg-yellow-100 text-yellow-700 border-yellow-200",
      "Iniciou Atendimento": "bg-green-100 text-green-700 border-green-200",
      "Adicionou Orçamento": "bg-emerald-100 text-emerald-700 border-emerald-200",
      "Realizou Ligação": "bg-cyan-100 text-cyan-700 border-cyan-200",
      "Alteração de URA": "bg-orange-100 text-orange-700 border-orange-200",
      "Edição de Roteiro": "bg-pink-100 text-pink-700 border-pink-200",
    };
    return colors[tipo] || "bg-gray-100 text-gray-700 border-gray-200";
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between gap-4 flex-wrap">
        <div className="flex items-center gap-2">
          <History className="h-6 w-6 text-[#0A2647]" />
          <h3 className="text-2xl font-bold text-[#0A2647]">
            Auditoria de Ações
          </h3>
        </div>
        <Button variant="outline" size="sm">
          <Download className="h-4 w-4 mr-2" />
          Exportar
        </Button>
      </div>

      {/* Barra de Busca */}
      <div className="flex flex-wrap gap-3">
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Pesquisar conversa, paciente..."
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
            className="pl-9"
          />
        </div>
        <div className="relative w-48">
          <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar por número..."
            value={buscaNumero}
            onChange={(e) => setBuscaNumero(e.target.value)}
            className="pl-9"
          />
        </div>
      </div>

      {/* Filtros */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-lg border">
        <Filter className="h-4 w-4 text-muted-foreground mt-2" />
        
        <Select value={filtroData} onValueChange={setFiltroData}>
          <SelectTrigger className="w-36">
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
          <SelectTrigger className="w-48">
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
          <SelectTrigger className="w-44">
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
      <Card className="overflow-hidden">
        <ScrollArea className="h-[500px]">
          <div className="divide-y divide-border">
            {acoesFiltradas.map((acao) => {
              const IconeAcao = acao.tipoIcone;
              return (
                <div
                  key={acao.id}
                  className="p-4 hover:bg-muted/30 transition-colors cursor-pointer"
                  onClick={() => setAcaoSelecionada(acao)}
                >
                  <div className="flex items-start gap-4">
                    <Avatar className="h-10 w-10 flex-shrink-0">
                      <AvatarImage src={acao.usuarioAvatar} />
                      <AvatarFallback className="text-sm bg-primary/10 text-primary">
                        {acao.usuario.slice(0, 2).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 flex-wrap mb-1">
                        <span className="font-semibold">{acao.usuario}</span>
                        <span className="text-xs text-muted-foreground">({acao.cargo})</span>
                        <Badge className={cn("text-xs gap-1", getTipoColor(acao.tipo))}>
                          <IconeAcao className="h-3 w-3" />
                          {acao.tipo}
                        </Badge>
                      </div>

                      <p className="text-sm text-muted-foreground mb-1">
                        {acao.descricao}
                      </p>

                      {acao.paciente && (
                        <div className="flex items-center gap-2 text-sm">
                          <MessageSquare className="h-3 w-3 text-muted-foreground" />
                          <span className="font-medium">{acao.paciente}</span>
                          {acao.pacienteTelefone && (
                            <span className="text-muted-foreground">
                              {acao.pacienteTelefone}
                            </span>
                          )}
                        </div>
                      )}

                      {acao.detalhes?.valor && (
                        <div className="mt-1 text-sm text-emerald-600 font-medium">
                          {acao.detalhes.valor}
                        </div>
                      )}
                    </div>

                    <div className="text-right flex-shrink-0">
                      <div className="text-sm font-medium">{acao.data}</div>
                      <div className="text-xs text-muted-foreground flex items-center justify-end gap-1">
                        <Clock className="h-3 w-3" />
                        {acao.horario}
                      </div>
                    </div>

                    <ChevronRight className="h-5 w-5 text-muted-foreground flex-shrink-0" />
                  </div>
                </div>
              );
            })}

            {acoesFiltradas.length === 0 && (
              <div className="p-8 text-center text-muted-foreground">
                <History className="h-12 w-12 mx-auto mb-3 opacity-50" />
                <p>Nenhuma ação encontrada com os filtros selecionados.</p>
              </div>
            )}
          </div>
        </ScrollArea>
      </Card>

      {/* Dialog Detalhes */}
      <Dialog open={!!acaoSelecionada} onOpenChange={() => setAcaoSelecionada(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-primary" />
              Detalhes da Ação
            </DialogTitle>
          </DialogHeader>

          {acaoSelecionada && (
            <div className="space-y-4 py-4">
              <div className="flex items-center gap-3">
                <Avatar className="h-12 w-12">
                  <AvatarImage src={acaoSelecionada.usuarioAvatar} />
                  <AvatarFallback className="bg-primary/10 text-primary">
                    {acaoSelecionada.usuario.slice(0, 2).toUpperCase()}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <div className="font-semibold">{acaoSelecionada.usuario}</div>
                  <div className="text-sm text-muted-foreground">{acaoSelecionada.cargo}</div>
                </div>
              </div>

              <div className="space-y-3 p-4 bg-muted/30 rounded-lg">
                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Tipo:</span>
                  <Badge className={cn("text-xs", getTipoColor(acaoSelecionada.tipo))}>
                    {acaoSelecionada.tipo}
                  </Badge>
                </div>

                <div className="flex justify-between">
                  <span className="text-sm text-muted-foreground">Data/Hora:</span>
                  <span className="text-sm font-medium">
                    {acaoSelecionada.data} às {acaoSelecionada.horario}
                  </span>
                </div>

                {acaoSelecionada.paciente && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Paciente:</span>
                    <span className="text-sm font-medium">{acaoSelecionada.paciente}</span>
                  </div>
                )}

                {acaoSelecionada.pacienteTelefone && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Telefone:</span>
                    <span className="text-sm font-medium">{acaoSelecionada.pacienteTelefone}</span>
                  </div>
                )}

                {acaoSelecionada.detalhes?.destinatario && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Encaminhado para:</span>
                    <span className="text-sm font-medium">{acaoSelecionada.detalhes.destinatario}</span>
                  </div>
                )}

                {acaoSelecionada.detalhes?.valor && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Valor:</span>
                    <span className="text-sm font-medium text-emerald-600">
                      {acaoSelecionada.detalhes.valor}
                    </span>
                  </div>
                )}

                {acaoSelecionada.detalhes?.campo && (
                  <div className="flex justify-between">
                    <span className="text-sm text-muted-foreground">Campo:</span>
                    <span className="text-sm font-medium">{acaoSelecionada.detalhes.campo}</span>
                  </div>
                )}
              </div>

              {acaoSelecionada.detalhes?.mensagem && (
                <div className="p-3 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="text-xs text-blue-600 mb-1">Mensagem enviada:</div>
                  <p className="text-sm">{acaoSelecionada.detalhes.mensagem}</p>
                </div>
              )}

              {acaoSelecionada.conversa_id && (
                <Button className="w-full bg-[#0A2647] hover:bg-[#144272]">
                  <MessageSquare className="h-4 w-4 mr-2" />
                  Ver Conversa Completa
                </Button>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
