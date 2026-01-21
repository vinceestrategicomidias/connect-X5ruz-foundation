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
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Users,
  Phone,
  MessageCircle,
  Clock,
  Send,
  Eye,
  ArrowRightLeft,
  Search,
  Circle,
  Inbox,
} from "lucide-react";
import { ConnectAvatar } from "./ConnectAvatar";
import { useAtendentes } from "@/hooks/useAtendentes";
import { useTodosPacientes } from "@/hooks/usePacientes";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { TransferenciaJustificativaDialog } from "./TransferenciaJustificativaDialog";
import { useTransferirAtendimento } from "@/hooks/useMutations";
import { toast } from "sonner";

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

// Mock de pacientes por atendente
const PACIENTES_POR_ATENDENTE: Record<string, { id: string; nome: string; telefone: string; ultima_msg: string; horario: string }[]> = {
  "att-1": [
    { id: "p1", nome: "Ricardo Fernandes", telefone: "(27) 99999-1234", ultima_msg: "Olá, preciso de ajuda", horario: "08:32" },
    { id: "p2", nome: "Vanessa Lima", telefone: "(27) 99999-5678", ultima_msg: "Qual o valor?", horario: "08:45" },
    { id: "p3", nome: "Carlos Eduardo", telefone: "(27) 99999-9012", ultima_msg: "Obrigado!", horario: "09:01" },
  ],
  "att-2": [
    { id: "p4", nome: "Mariana Costa", telefone: "(27) 99888-1111", ultima_msg: "Aguardo retorno", horario: "08:15" },
    { id: "p5", nome: "Felipe Santos", telefone: "(27) 99888-2222", ultima_msg: "Pode me ajudar?", horario: "08:50" },
  ],
  "att-3": [
    { id: "p6", nome: "Ana Paula", telefone: "(27) 99777-1111", ultima_msg: "Tenho dúvidas", horario: "09:10" },
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

export const MonitoramentoAtendentesPanel = ({
  open,
  onOpenChange,
}: MonitoramentoAtendentesPanelProps) => {
  const { atendenteLogado } = useAtendenteContext();
  const { data: pacientes } = useTodosPacientes();
  const transferir = useTransferirAtendimento();

  const [atendenteSelecionado, setAtendenteSelecionado] = useState<AtendenteMock | null>(null);
  const [pacienteSelecionado, setPacienteSelecionado] = useState<any>(null);
  const [mensagemResposta, setMensagemResposta] = useState("");
  const [buscaAtendente, setBuscaAtendente] = useState("");
  const [buscaFila, setBuscaFila] = useState("");
  const [activeTab, setActiveTab] = useState("atendentes");
  const [transferDialogOpen, setTransferDialogOpen] = useState(false);
  const [pacienteParaTransferir, setPacienteParaTransferir] = useState<any>(null);

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

  const handleTransferirFilaGeral = () => {
    if (!pacienteParaTransferir) return;
    setTransferDialogOpen(true);
  };

  const handleConfirmarTransferencia = (motivo: string, observacao?: string) => {
    toast.success(`${pacienteParaTransferir?.nome} transferido para Fila Geral. Motivo: ${motivo}`);
    setPacienteParaTransferir(null);
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
                                  <span className="text-xs text-muted-foreground">{paciente.horario}</span>
                                </div>
                                <p className="text-xs text-muted-foreground truncate">{paciente.ultima_msg}</p>
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
                          </div>
                        </div>
                      </div>

                      {/* Prévia da conversa */}
                      <div className="flex-1 p-4 bg-muted/10">
                        <p className="text-sm text-muted-foreground mb-3">Última mensagem:</p>
                        <div className="p-3 bg-background rounded-lg border">
                          <p className="text-sm">{pacienteSelecionado.ultima_mensagem || "Sem mensagem"}</p>
                        </div>
                      </div>

                      {/* Ações */}
                      <div className="p-4 border-t space-y-2">
                        <Button
                          className="w-full gap-2"
                          variant="outline"
                          onClick={() => {
                            setPacienteParaTransferir(pacienteSelecionado);
                            setTransferDialogOpen(true);
                          }}
                        >
                          <ArrowRightLeft className="h-4 w-4" />
                          Transferir sem destino (Fila Geral)
                        </Button>
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

      {/* Dialog de justificativa */}
      <TransferenciaJustificativaDialog
        open={transferDialogOpen}
        onOpenChange={setTransferDialogOpen}
        pacienteNome={pacienteParaTransferir?.nome || ""}
        destinoNome="Fila Geral"
        tipoDestino="fila_geral"
        onConfirmar={handleConfirmarTransferencia}
      />
    </>
  );
};
