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
import { useQueryClient } from "@tanstack/react-query";
import { useSetores } from "@/hooks/useSetores";
import { NovaConversaDialog } from "./NovaConversaDialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  const { data: pacientesFila } = usePacientes("fila");
  const config = useConfigFila();
  const [ordenacaoFila, setOrdenacaoFila] = useState<OrdenacaoFila>("decrescente");
  
  const nomeSetor = setores?.find(s => s.id === atendenteLogado?.setor_id)?.nome || "Atendimento";
  
  // Contar pacientes na fila do setor do atendente
  const countFila = pacientesFila?.filter(p => p.setor_id === atendenteLogado?.setor_id)?.length || 0;

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
        onOpenChange={setNovaConversaOpen}
      />

      {/* Tabs de Status */}
      <Tabs defaultValue="espera" className="flex-1 flex flex-col">
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
              Meus Atend.
            </TabsTrigger>
            <TabsTrigger 
              value="finalizados" 
              className="text-xs font-medium py-2.5 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
            >
              Finalizados
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="espera" className="flex-1 mt-2">
          <PacientesLista status="fila" config={config} ordenacao={ordenacaoFila} />
        </TabsContent>
        <TabsContent value="andamento" className="flex-1 mt-2">
          <PacientesLista status="em_atendimento" config={config} ordenacao="decrescente" />
        </TabsContent>
        <TabsContent value="finalizados" className="flex-1 mt-2">
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
      // Também invalida a query para buscar dados atualizados
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

  // Filtrar pacientes por setor e por atendente para "Meus Atendimentos"
  const pacientesFiltrados =
    status === "em_atendimento"
      ? pacientes?.filter(
          (p) =>
            p.setor_id === atendenteLogado?.setor_id &&
            p.atendente_responsavel === atendenteLogado?.id
        )
      : pacientes?.filter((p) => p.setor_id === atendenteLogado?.setor_id);

  if (!pacientesFiltrados || pacientesFiltrados.length === 0) {
    const mensagens = {
      fila: "Nenhum paciente na fila",
      em_atendimento: "Nenhum atendimento em andamento",
      finalizado: "Nenhum atendimento finalizado",
    };

    return (
      <ScrollArea className="h-full px-4">
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

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-2">
        {pacientesOrdenados.map((paciente) => (
          <ConnectPatientCard
            key={paciente.id}
            name={paciente.nome}
            lastMessage={paciente.ultima_mensagem || undefined}
            lastMessageTime={new Date(paciente.created_at || new Date()).toLocaleTimeString('pt-BR', { 
              hour: '2-digit', 
              minute: '2-digit' 
            })}
            status={
              status === "fila"
                ? "espera"
                : status === "em_atendimento"
                ? "andamento"
                : "finalizado"
            }
            tempoNaFila={paciente.tempo_na_fila || 0}
            tempoSemResposta={paciente.tempo_na_fila || 0} // Usa tempo_na_fila como proxy
            tempoLimiteAlerta={config.tempoAlertaFila}
            unread={Math.floor(Math.random() * 4)} // Simular mensagens não lidas
            onClick={() => handleClickPaciente(paciente)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};

