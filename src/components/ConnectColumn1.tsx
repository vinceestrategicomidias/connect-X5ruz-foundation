import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePacientes } from "@/hooks/usePacientes";
import { ConnectPatientCard } from "./ConnectPatientCard";
import { usePacienteContext } from "@/contexts/PacienteContext";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { Loader2 } from "lucide-react";
import { useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useSetores } from "@/hooks/useSetores";

export const ConnectColumn1 = () => {
  const { atendenteLogado } = useAtendenteContext();
  const { data: setores } = useSetores();
  
  const nomeSetor = setores?.find(s => s.id === atendenteLogado?.setor_id)?.nome || "Atendimento";
  
  return (
    <div className="w-80 border-r border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-display font-semibold text-foreground">
          Setor: {nomeSetor}
        </h2>
      </div>

      {/* Tabs de Status */}
      <Tabs defaultValue="espera" className="flex-1 flex flex-col">
        <div className="px-4 pt-4 pb-2">
          <TabsList className="w-full h-auto grid grid-cols-3 gap-1 bg-muted/50 p-1">
            <TabsTrigger 
              value="espera" 
              className="text-xs font-medium py-2.5 px-2 data-[state=active]:bg-primary data-[state=active]:text-primary-foreground whitespace-nowrap"
            >
              Fila
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
          <PacientesLista status="fila" />
        </TabsContent>
        <TabsContent value="andamento" className="flex-1 mt-2">
          <PacientesLista status="em_atendimento" />
        </TabsContent>
        <TabsContent value="finalizados" className="flex-1 mt-2">
          <PacientesLista status="finalizado" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PacientesLista = ({ status }: { status: "fila" | "em_atendimento" | "finalizado" }) => {
  const { data: pacientes, isLoading } = usePacientes(status);
  const { setPacienteSelecionado } = usePacienteContext();
  const { atendenteLogado } = useAtendenteContext();
  const queryClient = useQueryClient();

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

  // Ordenar pacientes: alertas primeiro, depois por tempo na fila, depois por horário
  const pacientesOrdenados = [...pacientesFiltrados].sort((a, b) => {
    const tempoLimite = 30;
    const aEmAlerta = a.status === "fila" && (a.tempo_na_fila || 0) >= tempoLimite;
    const bEmAlerta = b.status === "fila" && (b.tempo_na_fila || 0) >= tempoLimite;
    
    if (aEmAlerta && !bEmAlerta) return -1;
    if (!aEmAlerta && bEmAlerta) return 1;
    
    if ((b.tempo_na_fila || 0) !== (a.tempo_na_fila || 0)) {
      return (b.tempo_na_fila || 0) - (a.tempo_na_fila || 0);
    }
    
    return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
  });

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-2">
        {pacientesOrdenados.map((paciente) => (
          <ConnectPatientCard
            key={paciente.id}
            name={paciente.nome}
            lastMessage={paciente.ultima_mensagem || undefined}
            lastMessageTime={new Date(paciente.created_at).toLocaleTimeString('pt-BR', { 
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
            onClick={() => handleClickPaciente(paciente)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
