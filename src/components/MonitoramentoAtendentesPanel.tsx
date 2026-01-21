import { useState } from "react";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Send,
  ArrowRightLeft,
  Search,
  Inbox,
  Building2,
  Loader2,
  MessageSquare,
  Eye,
} from "lucide-react";
import { ConnectAvatar } from "./ConnectAvatar";
import { useAtendentes } from "@/hooks/useAtendentes";
import { useTodosPacientes } from "@/hooks/usePacientes";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { TransferenciaJustificativaDialog } from "./TransferenciaJustificativaDialog";
import { useTransferirAtendimento } from "@/hooks/useMutations";
import { useSetores } from "@/hooks/useSetores";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";

interface MonitoramentoAtendentesPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface AtendenteMock {
  id: string;
  nome: string;
  avatar?: string;
  cargo: string;
  setor_id: string;
  setor_nome: string;
  status: "online" | "ocupado" | "ligacao" | "ausente";
  atendimentos_ativos: number;
}

// Mock de atendentes logados
const ATENDENTES_LOGADOS_MOCK: AtendenteMock[] = [
  {
    id: "att-1",
    nome: "Emilly Santos",
    setor_id: "venda",
    setor_nome: "Venda",
    cargo: "atendente",
    status: "online",
    atendimentos_ativos: 3,
  },
  {
    id: "att-2",
    nome: "Paloma Ribeiro",
    setor_id: "venda",
    setor_nome: "Venda",
    cargo: "atendente",
    status: "ocupado",
    atendimentos_ativos: 5,
  },
  {
    id: "att-3",
    nome: "Geovanna Costa",
    setor_id: "prevenda",
    setor_nome: "Pré-venda",
    cargo: "coordenacao",
    status: "ligacao",
    atendimentos_ativos: 2,
  },
  {
    id: "att-4",
    nome: "Ricardo Almeida",
    setor_id: "comercial",
    setor_nome: "Comercial Connect",
    cargo: "atendente",
    status: "ausente",
    atendimentos_ativos: 0,
  },
];

// Mock de pacientes por atendente com dados atualizados
const PACIENTES_POR_ATENDENTE: Record<string, { id: string; nome: string; telefone: string; ultima_msg: string; horario: string; tempo_aguardando: number; nao_lidas: number }[]> = {
  "att-1": [
    { id: "p1", nome: "Ricardo Fernandes", telefone: "(27) 99999-1234", ultima_msg: "Consegue me enviar a proposta com desconto?", horario: "08:28", tempo_aguardando: 17, nao_lidas: 2 },
    { id: "p2", nome: "Vanessa Lima", telefone: "(27) 99999-5678", ultima_msg: "Qual a forma de pagamento para confirmar hoje?", horario: "08:10", tempo_aguardando: 35, nao_lidas: 3 },
    { id: "p3", nome: "Carlos Eduardo", telefone: "(27) 99999-9012", ultima_msg: "Obrigado!", horario: "09:01", tempo_aguardando: 5, nao_lidas: 0 },
  ],
  "att-2": [
    { id: "p4", nome: "Mariana Costa", telefone: "(27) 99888-1111", ultima_msg: "Aguardo retorno sobre o orçamento", horario: "08:15", tempo_aguardando: 28, nao_lidas: 2 },
    { id: "p5", nome: "Felipe Santos", telefone: "(27) 99888-2222", ultima_msg: "Pode me ajudar com a dúvida?", horario: "08:50", tempo_aguardando: 8, nao_lidas: 1 },
  ],
  "att-3": [
    { id: "p6", nome: "Ana Paula", telefone: "(27) 99777-1111", ultima_msg: "Tenho dúvidas sobre o procedimento", horario: "09:10", tempo_aguardando: 3, nao_lidas: 1 },
  ],
};

// Mock de mensagens dos últimos 30 dias para visualização
const MENSAGENS_MOCK: Record<string, { id: string; autor: "paciente" | "atendente"; texto: string; horario: string; data: string }[]> = {
  "p1": [
    { id: "m1", autor: "paciente", texto: "Olá, bom dia! Gostaria de saber sobre os procedimentos disponíveis.", horario: "08:15", data: "2026-01-21" },
    { id: "m2", autor: "atendente", texto: "Bom dia! Claro, temos diversas opções. Qual área você tem interesse?", horario: "08:17", data: "2026-01-21" },
    { id: "m3", autor: "paciente", texto: "Estou interessado na área de estética. Vocês fazem harmonização?", horario: "08:20", data: "2026-01-21" },
    { id: "m4", autor: "atendente", texto: "Sim, fazemos! Temos preenchimento, botox e diversos outros procedimentos.", horario: "08:22", data: "2026-01-21" },
    { id: "m5", autor: "paciente", texto: "Consegue me enviar a proposta com desconto?", horario: "08:28", data: "2026-01-21" },
  ],
  "p2": [
    { id: "m6", autor: "paciente", texto: "Boa tarde! Vi a promoção de vocês no Instagram.", horario: "07:50", data: "2026-01-21" },
    { id: "m7", autor: "atendente", texto: "Boa tarde! Que bom que viu! A promoção está válida até sexta-feira.", horario: "07:55", data: "2026-01-21" },
    { id: "m8", autor: "paciente", texto: "Qual a forma de pagamento para confirmar hoje?", horario: "08:10", data: "2026-01-21" },
  ],
  "p3": [
    { id: "m9", autor: "paciente", texto: "Recebi a proposta, muito obrigado!", horario: "08:58", data: "2026-01-21" },
    { id: "m10", autor: "atendente", texto: "Por nada! Qualquer dúvida estamos à disposição.", horario: "08:59", data: "2026-01-21" },
    { id: "m11", autor: "paciente", texto: "Obrigado!", horario: "09:01", data: "2026-01-21" },
  ],
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "online": return "bg-green-500";
    case "ocupado": return "bg-yellow-500";
    case "ligacao": return "bg-blue-500";
    case "ausente": return "bg-gray-400";
    default: return "bg-gray-400";
  }
};

const getStatusLabel = (status: string) => {
  switch (status) {
    case "online": return "Online";
    case "ocupado": return "Ocupado";
    case "ligacao": return "Em ligação";
    case "ausente": return "Ausente";
    default: return status;
  }
};

const getTempoColor = (tempo: number): string => {
  if (tempo >= 30) return "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400";
  if (tempo >= 15) return "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400";
  return "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
};
export const MonitoramentoAtendentesPanel = ({
  open,
  onOpenChange,
}: MonitoramentoAtendentesPanelProps) => {
  const { atendenteLogado } = useAtendenteContext();
  const { data: pacientes } = useTodosPacientes();
  const { data: setores, isLoading: loadingSetores } = useSetores();
  const { data: atendentesReais, isLoading: loadingAtendentesReais } = useAtendentes(atendenteLogado?.setor_id);
  const transferir = useTransferirAtendimento();

  const [atendenteSelecionado, setAtendenteSelecionado] = useState<AtendenteMock | null>(null);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<any>(null);
  const [mensagemResposta, setMensagemResposta] = useState("");
  const [buscaAtendente, setBuscaAtendente] = useState("");
  const [buscaFila, setBuscaFila] = useState("");
  const [activeTab, setActiveTab] = useState("atendentes");
  
  // Estados para transferência com seleção de destino
  const [transferSelectorOpen, setTransferSelectorOpen] = useState(false);
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [pacienteParaTransferir, setPacienteParaTransferir] = useState<any>(null);
  const [transferTab, setTransferTab] = useState<"atendentes" | "setores" | "fila">("atendentes");
  const [destinoSelecionado, setDestinoSelecionado] = useState<{
    tipo: "atendente" | "setor" | "fila";
    id?: string;
    nome: string;
  } | null>(null);
  
  // Estado para visualização de conversa em mini tela
  const [conversaDialogOpen, setConversaDialogOpen] = useState(false);
  const [pacienteParaVisualizar, setPacienteParaVisualizar] = useState<any>(null);

  const isGestor = atendenteLogado?.cargo === "gestor";
  const isCoordenacao = atendenteLogado?.cargo === "coordenacao";

  const atendentesLogados = ATENDENTES_LOGADOS_MOCK.filter((a) =>
    a.nome.toLowerCase().includes(buscaAtendente.toLowerCase())
  );

  const pacientesNaFila = pacientes?.filter(
    (p) => p.status === "fila" && p.nome.toLowerCase().includes(buscaFila.toLowerCase())
  );

  const handleResponder = () => {
    if (!mensagemResposta.trim()) return;
    toast.success(`Mensagem enviada para ${pacienteSelecionado?.nome}`);
    setMensagemResposta("");
  };

  const handleAbrirTransferencia = (paciente: any) => {
    setPacienteParaTransferir(paciente);
    setDestinoSelecionado(null);
    setTransferTab("atendentes");
    setTransferSelectorOpen(true);
  };

  const handleSelecionarDestinoAtendente = (atendenteId: string, nome: string) => {
    setDestinoSelecionado({ tipo: "atendente", id: atendenteId, nome });
    setTransferSelectorOpen(false);
    setTransferDialogOpen(true);
  };

  const handleSelecionarDestinoSetor = (setorId: string, nome: string) => {
    setDestinoSelecionado({ tipo: "setor", id: setorId, nome });
    setTransferSelectorOpen(false);
    setTransferDialogOpen(true);
  };

  const handleSelecionarDestinoFila = () => {
    setDestinoSelecionado({ tipo: "fila", nome: "Fila do Setor" });
    setTransferSelectorOpen(false);
    setTransferDialogOpen(true);
  };

  const handleConfirmarTransferencia = (motivo: string, observacao?: string) => {
    toast.success(`${pacienteParaTransferir?.nome} transferido para ${destinoSelecionado?.nome}. Motivo: ${motivo}`);
    setPacienteParaTransferir(null);
    setDestinoSelecionado(null);
    setTransferDialogOpen(false);
  };

  const handleAbrirConversaPreview = (paciente: any) => {
    setPacienteParaVisualizar(paciente);
    setConversaDialogOpen(true);
  };

  // Filtrar mensagens dos últimos 30 dias
  const getMensagens30Dias = (pacienteId: string) => {
    const hoje = new Date();
    const limite = new Date(hoje);
    limite.setDate(limite.getDate() - 30);
    
    const mensagens = MENSAGENS_MOCK[pacienteId] || [];
    return mensagens.filter(m => {
      const dataMensagem = new Date(m.data);
      return dataMensagem >= limite;
    });
  };

  return (
    <>
      <Sheet open={open} onOpenChange={onOpenChange}>
        <SheetContent side="right" className="w-[600px] sm:max-w-[600px] p-0">
          <SheetHeader className="p-4 border-b">
            <SheetTitle className="flex items-center gap-2">
              <Users className="h-5 w-5" />
              Monitoramento de Atendimentos
            </SheetTitle>
          </SheetHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
            <TabsList className="w-full justify-start px-4 py-2 border-b rounded-none bg-muted/50">
              <TabsTrigger value="atendentes" className="gap-2">
                <Users className="h-4 w-4" />
                Atendentes ({atendentesLogados.length})
              </TabsTrigger>
              <TabsTrigger value="fila" className="gap-2">
                <Inbox className="h-4 w-4" />
                Fila ({pacientesNaFila?.length || 0})
              </TabsTrigger>
            </TabsList>

            {/* Aba Atendentes Logados */}
            <TabsContent value="atendentes" className="p-0 m-0">
              <div className="flex h-[calc(100vh-140px)]">
                {/* Lista de atendentes */}
                <div className="w-1/2 border-r">
                  <div className="p-3 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar atendente..."
                        value={buscaAtendente}
                        onChange={(e) => setBuscaAtendente(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(100%-60px)]">
                    <div className="p-2 space-y-1">
                      {atendentesLogados.map((atendente) => (
                        <div
                          key={atendente.id}
                          onClick={() => {
                            setAtendenteSelecionado(atendente);
                            setPacienteSelecionado(null);
                          }}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            atendenteSelecionado?.id === atendente.id
                              ? "bg-primary/10 border border-primary/30"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <div className="relative">
                              <ConnectAvatar name={atendente.nome} size="md" />
                              <div
                                className={`absolute -bottom-0.5 -right-0.5 w-3 h-3 rounded-full border-2 border-background ${getStatusColor(atendente.status)}`}
                              />
                            </div>
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{atendente.nome}</p>
                              <p className="text-xs text-muted-foreground">
                                {atendente.setor_nome} • {getStatusLabel(atendente.status)}
                              </p>
                            </div>
                            <Badge variant="secondary" className="text-xs">
                              {atendente.atendimentos_ativos} atend.
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Detalhes do atendente selecionado */}
                <div className="w-1/2 flex flex-col">
                  {atendenteSelecionado ? (
                    <>
                      <div className="p-4 border-b bg-muted/30">
                        <div className="flex items-center gap-3">
                          <ConnectAvatar name={atendenteSelecionado.nome} size="lg" />
                          <div>
                            <p className="font-semibold">{atendenteSelecionado.nome}</p>
                            <p className="text-sm text-muted-foreground">
                              {atendenteSelecionado.setor_nome}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Lista de pacientes do atendente */}
                      <div className="flex-1 overflow-hidden">
                        <p className="p-3 text-sm font-medium text-muted-foreground border-b">
                          Pacientes em atendimento:
                        </p>
                        <ScrollArea className="h-[calc(100%-44px)]">
                          <div className="p-2 space-y-1">
                            {(PACIENTES_POR_ATENDENTE[atendenteSelecionado.id] || []).map((paciente) => (
                              <div
                                key={paciente.id}
                                onClick={() => setPacienteSelecionado(paciente)}
                                className={`p-3 rounded-lg cursor-pointer transition-colors ${
                                  pacienteSelecionado?.id === paciente.id
                                    ? "bg-accent"
                                    : "hover:bg-muted"
                                }`}
                              >
                                <div className="flex items-center justify-between">
                                  <p className="font-medium text-sm">{paciente.nome}</p>
                                  <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">{paciente.horario}</span>
                                    <Button
                                      variant="ghost"
                                      size="icon"
                                      className="h-6 w-6"
                                      title="Visualizar conversa"
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        handleAbrirConversaPreview(paciente);
                                      }}
                                    >
                                      <Eye className="h-3 w-3" />
                                    </Button>
                                  </div>
                                </div>
                                <div className="flex items-center justify-between mt-1">
                                  <p className="text-xs text-muted-foreground truncate flex-1">{paciente.ultima_msg}</p>
                                  <div className="flex items-center gap-2 flex-shrink-0 ml-2">
                                    <span className={`text-[10px] font-medium px-1.5 py-0.5 rounded ${getTempoColor(paciente.tempo_aguardando)}`}>
                                      {paciente.tempo_aguardando} min
                                    </span>
                                    {paciente.nao_lidas > 0 && (
                                      <span className="bg-primary text-primary-foreground text-[10px] font-bold min-w-[18px] h-[18px] flex items-center justify-center rounded-full px-1">
                                        {paciente.nao_lidas}
                                      </span>
                                    )}
                                  </div>
                                </div>
                              </div>
                            ))}
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Ações do paciente selecionado */}
                      {pacienteSelecionado && (isGestor || isCoordenacao) && (
                        <div className="p-3 border-t space-y-2">
                          <p className="text-xs font-medium text-muted-foreground">
                            Responder como gestor:
                          </p>
                          <div className="flex gap-2">
                            <Textarea
                              value={mensagemResposta}
                              onChange={(e) => setMensagemResposta(e.target.value)}
                              placeholder="Digite sua resposta..."
                              rows={2}
                              className="flex-1"
                            />
                            <Button size="icon" onClick={handleResponder}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      )}
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                      Selecione um atendente
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Aba Fila em Tempo Real */}
            <TabsContent value="fila" className="p-0 m-0">
              <div className="flex h-[calc(100vh-140px)]">
                {/* Lista da fila */}
                <div className="w-1/2 border-r">
                  <div className="p-3 border-b">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="Buscar na fila..."
                        value={buscaFila}
                        onChange={(e) => setBuscaFila(e.target.value)}
                        className="pl-9"
                      />
                    </div>
                  </div>
                  <ScrollArea className="h-[calc(100%-60px)]">
                    <div className="p-2 space-y-1">
                      {pacientesNaFila?.map((paciente) => (
                        <div
                          key={paciente.id}
                          onClick={() => setPacienteSelecionado(paciente)}
                          className={`p-3 rounded-lg cursor-pointer transition-colors ${
                            pacienteSelecionado?.id === paciente.id
                              ? "bg-primary/10 border border-primary/30"
                              : "hover:bg-muted"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <ConnectAvatar name={paciente.nome} size="md" />
                            <div className="flex-1 min-w-0">
                              <p className="font-medium text-sm truncate">{paciente.nome}</p>
                              <p className="text-xs text-muted-foreground truncate">
                                {paciente.ultima_mensagem || "Sem mensagem"}
                              </p>
                            </div>
                            <Badge
                              variant={
                                (paciente.tempo_na_fila || 0) >= 30
                                  ? "destructive"
                                  : (paciente.tempo_na_fila || 0) >= 15
                                  ? "secondary"
                                  : "outline"
                              }
                              className="text-xs"
                            >
                              {paciente.tempo_na_fila || 0}min
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </div>

                {/* Detalhes do paciente na fila */}
                <div className="w-1/2 flex flex-col">
                  {pacienteSelecionado && activeTab === "fila" ? (
                    <>
                      <div className="p-4 border-b bg-muted/30">
                        <div className="flex items-center gap-3">
                          <ConnectAvatar name={pacienteSelecionado.nome} size="lg" />
                          <div>
                            <p className="font-semibold">{pacienteSelecionado.nome}</p>
                            <p className="text-sm text-muted-foreground">
                              {pacienteSelecionado.telefone}
                            </p>
                            <Badge 
                              variant="secondary" 
                              className={`text-xs mt-1 ${getTempoColor(pacienteSelecionado.tempo_na_fila || 0)}`}
                            >
                              Aguardando há {pacienteSelecionado.tempo_na_fila || 0} min
                            </Badge>
                          </div>
                        </div>
                      </div>

                      {/* Prévia da conversa em tempo real */}
                      <div className="flex-1 overflow-hidden flex flex-col">
                        <div className="p-3 border-b flex items-center gap-2">
                          <Eye className="h-4 w-4 text-muted-foreground" />
                          <p className="text-sm font-medium text-muted-foreground">
                            Visualização da Conversa (tempo real)
                          </p>
                        </div>
                        <ScrollArea className="flex-1 p-4 bg-muted/10">
                          <div className="space-y-3">
                            {/* Mensagem do paciente (mock) */}
                            <div className="flex justify-start">
                              <div className="max-w-[80%] p-3 rounded-lg bg-background border">
                                <p className="text-sm">{pacienteSelecionado.ultima_mensagem || "Olá, gostaria de informações"}</p>
                                <p className="text-[10px] text-muted-foreground mt-1">
                                  {new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' })}
                                </p>
                              </div>
                            </div>
                          </div>
                        </ScrollArea>
                      </div>

                      {/* Ações */}
                      <div className="p-4 border-t space-y-2">
                        {(isGestor || isCoordenacao) && (
                          <div className="flex gap-2 mb-3">
                            <Textarea
                              value={mensagemResposta}
                              onChange={(e) => setMensagemResposta(e.target.value)}
                              placeholder="Responder como gestor..."
                              rows={2}
                              className="flex-1"
                            />
                            <Button size="icon" onClick={handleResponder}>
                              <Send className="h-4 w-4" />
                            </Button>
                          </div>
                        )}
                        <Button
                          className="w-full gap-2"
                          variant="outline"
                          onClick={() => handleAbrirTransferencia(pacienteSelecionado)}
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                          Transferir Atendimento
                        </Button>
                        <p className="text-[10px] text-muted-foreground text-center">
                          Escolha: Setor, Atendente ou Fila do setor
                        </p>
                      </div>
                    </>
                  ) : (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground text-sm">
                      Selecione um paciente da fila
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>
          </Tabs>
        </SheetContent>
      </Sheet>

      {/* Dialog de seleção de destino */}
      <Dialog open={transferSelectorOpen} onOpenChange={setTransferSelectorOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transferir {pacienteParaTransferir?.nome}</DialogTitle>
          </DialogHeader>

          <Tabs value={transferTab} onValueChange={(v) => setTransferTab(v as any)}>
            <TabsList className="grid w-full grid-cols-3">
              <TabsTrigger value="atendentes" className="gap-1 text-xs">
                <Users className="h-3 w-3" />
                Atendente
              </TabsTrigger>
              <TabsTrigger value="setores" className="gap-1 text-xs">
                <Building2 className="h-3 w-3" />
                Setor
              </TabsTrigger>
              <TabsTrigger value="fila" className="gap-1 text-xs">
                <Inbox className="h-3 w-3" />
                Fila
              </TabsTrigger>
            </TabsList>

            <TabsContent value="atendentes" className="mt-4">
              <ScrollArea className="h-[250px]">
                {loadingAtendentesReais ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {atendentesReais
                      ?.filter((a) => a.id !== atendenteLogado?.id)
                      .map((atendente) => (
                        <Button
                          key={atendente.id}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleSelecionarDestinoAtendente(atendente.id, atendente.nome)}
                        >
                          <ConnectAvatar name={atendente.nome} image={atendente.avatar || undefined} size="sm" />
                          <div className="ml-3 text-left">
                            <p className="font-medium">{atendente.nome}</p>
                            <p className="text-xs text-muted-foreground capitalize">{atendente.cargo}</p>
                          </div>
                        </Button>
                      ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="setores" className="mt-4">
              <ScrollArea className="h-[250px]">
                {loadingSetores ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {setores
                      ?.filter((s) => s.id !== atendenteLogado?.setor_id)
                      .map((setor) => (
                        <Button
                          key={setor.id}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleSelecionarDestinoSetor(setor.id, setor.nome)}
                        >
                          <div className="w-4 h-4 rounded-full mr-3" style={{ backgroundColor: setor.cor || "#888" }} />
                          <div className="text-left">
                            <p className="font-medium">{setor.nome}</p>
                            {setor.descricao && <p className="text-xs text-muted-foreground">{setor.descricao}</p>}
                          </div>
                        </Button>
                      ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="fila" className="mt-4">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Inbox className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Enviar {pacienteParaTransferir?.nome} de volta para a fila do setor
                </p>
                <Button onClick={handleSelecionarDestinoFila} className="w-full">
                  Enviar para Fila do Setor
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Dialog de justificativa */}
      <TransferenciaJustificativaDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        pacienteNome={pacienteParaTransferir?.nome || ""}
        destinoNome={destinoSelecionado?.nome || ""}
        tipoDestino={destinoSelecionado?.tipo || "fila"}
        onConfirmar={handleConfirmarTransferencia}
      />

      {/* Dialog de visualização de conversa em tempo real */}
      <Dialog open={conversaDialogOpen} onOpenChange={setConversaDialogOpen}>
        <DialogContent className="max-w-lg max-h-[80vh] flex flex-col p-0">
          <DialogHeader className="p-4 border-b">
            <DialogTitle className="flex items-center gap-3">
              <ConnectAvatar name={pacienteParaVisualizar?.nome || ""} size="sm" />
              <div>
                <span>{pacienteParaVisualizar?.nome}</span>
                <p className="text-xs font-normal text-muted-foreground">
                  {pacienteParaVisualizar?.telefone}
                </p>
              </div>
            </DialogTitle>
            <p className="text-xs text-muted-foreground mt-1">
              <MessageSquare className="h-3 w-3 inline mr-1" />
              Mensagens dos últimos 30 dias
            </p>
          </DialogHeader>
          
          <ScrollArea className="flex-1 p-4 max-h-[400px]">
            <div className="space-y-3">
              {pacienteParaVisualizar && getMensagens30Dias(pacienteParaVisualizar.id).length > 0 ? (
                getMensagens30Dias(pacienteParaVisualizar.id).map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex ${msg.autor === "paciente" ? "justify-start" : "justify-end"}`}
                  >
                    <div
                      className={`max-w-[80%] p-3 rounded-lg ${
                        msg.autor === "paciente"
                          ? "bg-muted"
                          : "bg-primary text-primary-foreground"
                      }`}
                    >
                      <p className="text-sm">{msg.texto}</p>
                      <p className={`text-[10px] mt-1 ${
                        msg.autor === "paciente" ? "text-muted-foreground" : "text-primary-foreground/70"
                      }`}>
                        {msg.data} às {msg.horario}
                      </p>
                    </div>
                  </div>
                ))
              ) : (
                <div className="flex flex-col items-center justify-center py-8 text-muted-foreground">
                  <MessageSquare className="h-10 w-10 mb-2 opacity-50" />
                  <p className="text-sm">Nenhuma mensagem nos últimos 30 dias</p>
                </div>
              )}
            </div>
          </ScrollArea>
          
          {(isGestor || isCoordenacao) && (
            <div className="p-4 border-t">
              <div className="flex gap-2">
                <Textarea
                  value={mensagemResposta}
                  onChange={(e) => setMensagemResposta(e.target.value)}
                  placeholder="Responder como gestor..."
                  rows={2}
                  className="flex-1"
                />
                <Button size="icon" onClick={() => {
                  if (mensagemResposta.trim()) {
                    toast.success(`Mensagem enviada para ${pacienteParaVisualizar?.nome}`);
                    setMensagemResposta("");
                  }
                }}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
