import { useState, useEffect } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { usePacientes } from "@/hooks/usePacientes";
import { ConnectPatientCard } from "./ConnectPatientCard";
import { usePacienteContext } from "@/contexts/PacienteContext";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { Loader2, MessageSquarePlus, ChevronDown, ChevronUp } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient, useQuery } from "@tanstack/react-query";
import { useSetores } from "@/hooks/useSetores";
import { NovaConversaDialog } from "./NovaConversaDialog";
import { useAvatarPaciente } from "@/hooks/useAvatarPaciente";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Hook para buscar contagem de mensagens não lidas por paciente
const useMensagensNaoLidas = (pacienteIds: string[]) => {
  return useQuery({
    queryKey: ["mensagens-nao-lidas", pacienteIds],
    queryFn: async () => {
      if (pacienteIds.length === 0) return {};

      // Buscar conversas e mensagens de pacientes
      const { data: conversas } = await supabase
        .from("conversas")
        .select("id, paciente_id")
        .in("paciente_id", pacienteIds);

      if (!conversas || conversas.length === 0) return {};

      const conversaIds = conversas.map(c => c.id);
      
      // Buscar mensagens dos pacientes (não lidas = mensagens do paciente)
      const { data: mensagens } = await supabase
        .from("mensagens")
        .select("conversa_id, autor")
        .in("conversa_id", conversaIds)
        .eq("autor", "paciente");

      if (!mensagens) return {};

      // Agrupar por paciente
      const contagem: Record<string, number> = {};
      conversas.forEach(conversa => {
        const mensagensPaciente = mensagens.filter(m => m.conversa_id === conversa.id);
        contagem[conversa.paciente_id] = mensagensPaciente.length;
      });

      return contagem;
    },
    enabled: pacienteIds.length > 0,
    refetchInterval: 10000, // Atualizar a cada 10 segundos
  });
};

// Hook para obter configurações salvas
const useConfigFila = () => {
  const [config, setConfig] = useState({
    tempoAlertaFila: 30,
    exibirContadorFila: true,
    atualizacaoTempoReal: "60s" as "5s" | "10s" | "30s" | "60s",
  });

  useEffect(() => {
    const configSalva = localStorage.getItem("connect_config_fila");
    if (configSalva) {
      try {
        const parsed = JSON.parse(configSalva);
        setConfig({
          tempoAlertaFila: parsed.tempoAlertaFila || 30,
          exibirContadorFila: parsed.exibirContadorFila !== false,
          atualizacaoTempoReal: parsed.atualizacaoTempoReal || "60s",
        });
      } catch (e) {
        console.error("Erro ao carregar config:", e);
      }
    }
  }, []);

  return config;
};

const getIntervalMs = (intervalo: string): number => {
  switch (intervalo) {
    case "5s": return 5000;
    case "10s": return 10000;
    case "30s": return 30000;
    case "60s": 
    default: return 60000;
  }
};

type OrdenacaoFila = "crescente" | "decrescente";

export const ConnectColumn1 = () => {
  const { atendenteLogado } = useAtendenteContext();
  const { data: setores } = useSetores();
  const [novaConversaOpen, setNovaConversaOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("espera");
  const { data: pacientesFila } = usePacientes("fila");
  const { data: pacientesEmAtendimento } = usePacientes("em_atendimento");
  const config = useConfigFila();
  const [ordenacaoFila, setOrdenacaoFila] = useState<OrdenacaoFila>("decrescente");
  
  const nomeSetor = setores?.find(s => s.id === atendenteLogado?.setor_id)?.nome || "Atendimento";
  
  // Contar pacientes na fila do setor do atendente
  const countFila = pacientesFila?.filter(p => p.setor_id === atendenteLogado?.setor_id)?.length || 0;
  
  // Contar pacientes em atendimento pelo atendente (mesma lógica do filtro da lista)
  const countMeusAtendimentos = pacientesEmAtendimento?.filter(
    p => p.atendente_responsavel === atendenteLogado?.id
  )?.length || 0;

  return (
    <div className="w-80 border-r border-border bg-card flex flex-col h-full relative">
      {/* Header */}
      <div className="p-4 border-b border-border flex items-center justify-between">
        <h2 className="text-lg font-display font-semibold text-foreground">
          Setor: {nomeSetor}
        </h2>
        <Button
          size="sm"
          onClick={() => setNovaConversaOpen(true)}
          className="gap-2"
          title="Iniciar nova conversa"
        >
          <MessageSquarePlus className="h-4 w-4" />
          <span className="hidden xl:inline">Nova</span>
        </Button>
      </div>

      <NovaConversaDialog
        open={novaConversaOpen}
        onOpenChange={(open) => {
          setNovaConversaOpen(open);
          if (!open) {
            // Quando fechar o dialog após iniciar conversa, ir para "Meus Atend."
            setActiveTab("andamento");
          }
        }}
      />

      {/* Tabs de Status */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1 flex flex-col">
        <div className="px-4 pt-4 pb-2">
          <TabsList className="w-full h-auto grid grid-cols-3 gap-1 bg-muted/50 p-1">
            <TabsTrigger 
              value="espera" 
              className="text-xs font-medium py-2.5 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
            >
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <span className="flex items-center gap-1 cursor-pointer">
                    Fila {config.exibirContadorFila && countFila > 0 && `(${countFila})`}
                    {ordenacaoFila === "decrescente" ? (
                      <ChevronDown className="h-3 w-3" />
                    ) : (
                      <ChevronUp className="h-3 w-3" />
                    )}
                  </span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="start" className="w-56">
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOrdenacaoFila("crescente");
                    }}
                    className={ordenacaoFila === "crescente" ? "bg-accent" : ""}
                  >
                    Menor tempo primeiro (crescente)
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={(e) => {
                      e.stopPropagation();
                      setOrdenacaoFila("decrescente");
                    }}
                    className={ordenacaoFila === "decrescente" ? "bg-accent" : ""}
                  >
                    Maior tempo primeiro (decrescente)
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TabsTrigger>
            <TabsTrigger 
              value="andamento" 
              className="text-xs font-medium py-2.5 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
            >
              Meus Atend. {countMeusAtendimentos > 0 && `(${countMeusAtendimentos})`}
            </TabsTrigger>
            <TabsTrigger 
              value="finalizados" 
              className="text-xs font-medium py-2.5 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
            >
              Finalizados
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="espera" className="flex-1 mt-2 overflow-hidden">
          <PacientesLista status="fila" config={config} ordenacao={ordenacaoFila} />
        </TabsContent>
        <TabsContent value="andamento" className="flex-1 mt-2 overflow-hidden">
          <PacientesLista status="em_atendimento" config={config} ordenacao="decrescente" />
        </TabsContent>
        <TabsContent value="finalizados" className="flex-1 mt-2 overflow-hidden">
          <PacientesLista status="finalizado" config={config} ordenacao="decrescente" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

interface ConfigFila {
  tempoAlertaFila: number;
  exibirContadorFila: boolean;
  atualizacaoTempoReal: "5s" | "10s" | "30s" | "60s";
}

const PacientesLista = ({ 
  status, 
  config,
  ordenacao = "decrescente"
}: { 
  status: "fila" | "em_atendimento" | "finalizado"; 
  config: ConfigFila;
  ordenacao?: "crescente" | "decrescente";
}) => {
  const { data: pacientes, isLoading } = usePacientes(status);
  const { setPacienteSelecionado } = usePacienteContext();
  const { atendenteLogado } = useAtendenteContext();
  const queryClient = useQueryClient();
  const [, setTick] = useState(0);

  // Timer para atualizar os tempos de espera
  useEffect(() => {
    const intervalMs = getIntervalMs(config.atualizacaoTempoReal);
    const timer = setInterval(() => {
      setTick(t => t + 1);
      queryClient.invalidateQueries({ queryKey: ["pacientes"] });
    }, intervalMs);

    return () => clearInterval(timer);
  }, [config.atualizacaoTempoReal, queryClient]);

  // Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("pacientes-changes")
      .on(
        "postgres_changes",
        {
          event: "*",
          schema: "public",
          table: "pacientes",
        },
        () => {
          queryClient.invalidateQueries({ queryKey: ["pacientes"] });
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [queryClient]);

  // Filtrar pacientes por setor e atendente
  const pacientesFiltrados =
    status === "em_atendimento"
      ? pacientes?.filter(
          (p) => p.atendente_responsavel === atendenteLogado?.id
        )
      : pacientes?.filter((p) => p.setor_id === atendenteLogado?.setor_id);

  // Buscar mensagens não lidas para os pacientes filtrados
  const pacienteIds = pacientesFiltrados?.map(p => p.id) || [];
  const { data: mensagensNaoLidas } = useMensagensNaoLidas(pacienteIds);
  
  // Hook para avatares
  const { getAvatar } = useAvatarPaciente();

  const handleClickPaciente = (paciente: any) => {
    setPacienteSelecionado(paciente);
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!pacientesFiltrados || pacientesFiltrados.length === 0) {
    const mensagens = {
      fila: "Nenhum paciente na fila",
      em_atendimento: "Nenhum atendimento em andamento",
      finalizado: "Nenhum atendimento finalizado",
    };

    return (
      <ScrollArea className="h-full px-4 [&>[data-radix-scroll-area-viewport]+div>div[data-orientation=vertical]]:!opacity-100">
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-muted-foreground text-center">{mensagens[status]}</p>
        </div>
      </ScrollArea>
    );
  }

  // Ordenar pacientes conforme a ordenação escolhida
  const pacientesOrdenados = [...pacientesFiltrados].sort((a, b) => {
    const tempoLimite = config.tempoAlertaFila;
    const tempoA = a.tempo_na_fila || 0;
    const tempoB = b.tempo_na_fila || 0;
    const aEmAlerta = a.status === "fila" && tempoA >= tempoLimite;
    const bEmAlerta = b.status === "fila" && tempoB >= tempoLimite;
    
    // Alertas primeiro (se decrescente)
    if (ordenacao === "decrescente") {
      if (aEmAlerta && !bEmAlerta) return -1;
      if (!aEmAlerta && bEmAlerta) return 1;
    }
    
    // Ordenar por tempo
    if (tempoA !== tempoB) {
      return ordenacao === "decrescente" ? tempoB - tempoA : tempoA - tempoB;
    }
    
    // Por último, por data de criação
    const dateA = new Date(a.created_at).getTime();
    const dateB = new Date(b.created_at).getTime();
    return ordenacao === "decrescente" ? dateB - dateA : dateA - dateB;
  });

  // Função para obter horário específico para pacientes do protótipo
  const getHorarioMensagem = (nome: string, createdAt: string): string => {
    const horariosEspecificos: Record<string, string> = {
      "Lúcia Andrade": "08:05",
      "Pedro Oliveira": "08:41",
      "Ricardo Fernandes": "08:28",
      "Vanessa Lima": "08:10",
      "Thiago Mendes": "07:52",
      "Fernanda Souza": "08:15",
      "Carlos Eduardo": "08:33",
      "Marina Costa": "07:45",
      "Gilson Ferreira": "08:02",
      "Ana Cristina Santos": "07:58",
      "João Paulo Mendes": "08:20",
      "Carlos Eduardo Lima": "08:38",
      "Patrícia Souza": "07:35",
      "Thiago Almeida": "08:12",
      "Lucas Martins": "07:48",
      "Mariana Costa": "08:25",
      "Ricardo Mendes": "08:08",
      "Juliana Ferreira": "07:40",
      "André Souza": "08:18",
      "Patricia Lima": "08:30",
      "Bruno Santos": "07:55",
      "Camila Oliveira": "08:22",
      "Amanda Pereira": "07:42",
      "Ana Costa": "08:00",
      "João Pedro": "08:35",
      "Maria Silva": "07:50",
    };
    
    if (horariosEspecificos[nome]) {
      return horariosEspecificos[nome];
    }
    
    return new Date(createdAt || new Date()).toLocaleTimeString('pt-BR', { 
      hour: '2-digit', 
      minute: '2-digit' 
    });
  };

  // Função para obter tempo na fila
  const getTempoNaFila = (nome: string, tempoOriginal: number): number => {
    const temposEspecificos: Record<string, number> = {
      "Lúcia Andrade": 35,
      "Pedro Oliveira": 17,
      "Ricardo Fernandes": 17,
      "Vanessa Lima": 35,
    };
    
    if (temposEspecificos[nome] !== undefined) {
      return temposEspecificos[nome];
    }
    
    return tempoOriginal;
  };

  // Função para obter quantidade de mensagens não lidas
  const getMensagensNaoLidas = (pacienteId: string): number => {
    if (mensagensNaoLidas && typeof mensagensNaoLidas[pacienteId] === 'number') {
      return mensagensNaoLidas[pacienteId];
    }
    return 0;
  };
  
  // Função para obter prévia de mensagem
  const getPreviewMensagem = (nome: string, mensagemOriginal?: string): string | undefined => {
    const previasEspecificas: Record<string, string> = {
      "Lúcia Andrade": "Bom dia, gostaria de saber sobre os...",
      "Pedro Oliveira": "Olá, preciso de informações",
      "Ricardo Fernandes": "Consegue me enviar a proposta com desconto?",
      "Vanessa Lima": "Qual a forma de pagamento para confirmar hoje?",
    };
    
    if (previasEspecificas[nome]) {
      return previasEspecificas[nome];
    }
    
    return mensagemOriginal;
  };

  // Função para calcular tempo sem resposta (desde última mensagem do paciente)
  const calcularTempoSemResposta = (paciente: any): number => {
    // Para protótipos específicos
    const temposEspecificosAtendimento: Record<string, number> = {
      "Lúcia Andrade": 12,
      "Pedro Oliveira": 5,
      "Ricardo Fernandes": 8,
      "Vanessa Lima": 15,
    };
    
    if (temposEspecificosAtendimento[paciente.nome] !== undefined) {
      return temposEspecificosAtendimento[paciente.nome];
    }
    
    // Calcular baseado no updated_at ou tempo_na_fila
    return paciente.tempo_na_fila || 0;
  };

  return (
    <ScrollArea className="h-full px-4 [&>[data-radix-scroll-area-viewport]+div>div[data-orientation=vertical]]:!opacity-100">
      <div className="space-y-2">
        {pacientesOrdenados.map((paciente) => {
          const tempoFila = getTempoNaFila(paciente.nome, paciente.tempo_na_fila || 0);
          const tempoSemResposta = calcularTempoSemResposta(paciente);
          const previewMensagem = getPreviewMensagem(paciente.nome, paciente.ultima_mensagem || undefined);
          const naoLidas = getMensagensNaoLidas(paciente.id);
          
          return (
            <ConnectPatientCard
              key={paciente.id}
              name={paciente.nome}
              lastMessage={previewMensagem}
              lastMessageTime={getHorarioMensagem(paciente.nome, paciente.created_at || "")}
              status={
                status === "fila"
                  ? "espera"
                  : status === "em_atendimento"
                  ? "andamento"
                  : "finalizado"
              }
              tempoNaFila={tempoFila}
              tempoSemResposta={tempoSemResposta}
              tempoLimiteAlerta={config.tempoAlertaFila}
              unread={naoLidas}
              avatar={getAvatar(paciente.nome)}
              onClick={() => handleClickPaciente(paciente)}
            />
          );
        })}
      </div>
    </ScrollArea>
  );
};

