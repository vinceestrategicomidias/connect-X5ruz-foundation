import { Search, Loader2, ChevronRight, ChevronDown } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTodosPacientes } from "@/hooks/usePacientes";
import { ConnectPatientCardSimple } from "./ConnectPatientCardSimple";
import { usePacienteContext } from "@/contexts/PacienteContext";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { supabase } from "@/integrations/supabase/client";
import { useQueryClient } from "@tanstack/react-query";
import { useAvatarPaciente } from "@/hooks/useAvatarPaciente";

export const ConnectColumn3 = () => {
  const { data: pacientes, isLoading } = useTodosPacientes();
  const { setPacienteSelecionado } = usePacienteContext();
  const { atendenteLogado } = useAtendenteContext();
  const [busca, setBusca] = useState("");
  const [expandido, setExpandido] = useState(true);
  const queryClient = useQueryClient();
  const { getAvatar } = useAvatarPaciente();

  // Realtime updates
  useEffect(() => {
    const channel = supabase
      .channel("todos-pacientes-changes")
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

  const pacientesFiltrados = pacientes
    ?.filter((p) => p.setor_id === atendenteLogado?.setor_id)
    ?.filter(
      (paciente) =>
        paciente.nome.toLowerCase().includes(busca.toLowerCase()) ||
        paciente.telefone.includes(busca)
    );

  // Ordenar pacientes: alertas primeiro, depois por tempo na fila, depois por horário
  const pacientesOrdenados = pacientesFiltrados?.sort((a, b) => {
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
    <div
      className={`border-l border-border bg-card flex flex-col h-full transition-all duration-300 ${
        expandido ? "w-80" : "w-16"
      }`}
    >
      {/* Header */}
      <div className="p-4 border-b border-border">
        <div className="flex items-center justify-between mb-4">
          <h2
            className={`text-lg font-display font-semibold text-foreground transition-opacity ${
              expandido ? "opacity-100" : "opacity-0 w-0"
            }`}
          >
            Todos os Pacientes
          </h2>
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setExpandido(!expandido)}
            className="flex-shrink-0"
          >
            {expandido ? (
              <ChevronRight className="h-4 w-4" />
            ) : (
              <ChevronDown className="h-4 w-4" />
            )}
          </Button>
        </div>
        {/* Campo de Busca */}
        {expandido && (
          <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar pacientes..."
              className="pl-9"
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
            />
          </div>
        )}
      </div>

      {/* Lista de Pacientes */}
      {expandido && <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !pacientesOrdenados || pacientesOrdenados.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-muted-foreground text-center">
              {busca ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {pacientesOrdenados.map((paciente) => (
              <ConnectPatientCardSimple
                key={paciente.id}
                name={paciente.nome}
                lastMessage={paciente.ultima_mensagem || undefined}
                lastMessageTime={new Date(paciente.created_at).toLocaleTimeString('pt-BR', { 
                  hour: '2-digit', 
                  minute: '2-digit' 
                })}
                avatar={getAvatar(paciente.nome)}
                onClick={() => setPacienteSelecionado(paciente)}
              />
            ))}
          </div>
        )}
      </ScrollArea>}
    </div>
  );
};
