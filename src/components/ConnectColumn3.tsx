import { Search, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useTodosPacientes } from "@/hooks/usePacientes";
import { ConnectPatientCard } from "./ConnectPatientCard";
import { usePacienteContext } from "@/contexts/PacienteContext";
import { useState } from "react";

export const ConnectColumn3 = () => {
  const { data: pacientes, isLoading } = useTodosPacientes();
  const { setPacienteSelecionado } = usePacienteContext();
  const [busca, setBusca] = useState("");

  const pacientesFiltrados = pacientes?.filter((paciente) =>
    paciente.nome.toLowerCase().includes(busca.toLowerCase()) ||
    paciente.telefone.includes(busca)
  );

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-display font-semibold text-foreground mb-4">
          Todos os Pacientes
        </h2>
        {/* Campo de Busca */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar pacientes..."
            className="pl-9"
            value={busca}
            onChange={(e) => setBusca(e.target.value)}
          />
        </div>
      </div>

      {/* Lista de Pacientes */}
      <ScrollArea className="flex-1 p-4">
        {isLoading ? (
          <div className="flex items-center justify-center h-64">
            <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
          </div>
        ) : !pacientesFiltrados || pacientesFiltrados.length === 0 ? (
          <div className="flex items-center justify-center h-64">
            <p className="text-sm text-muted-foreground text-center">
              {busca ? "Nenhum paciente encontrado" : "Nenhum paciente cadastrado"}
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {pacientesFiltrados.map((paciente) => (
              <ConnectPatientCard
                key={paciente.id}
                name={paciente.nome}
                lastMessage={paciente.ultima_mensagem || undefined}
                time={paciente.tempo_na_fila > 0 ? `${paciente.tempo_na_fila}min` : undefined}
                status={
                  paciente.status === "fila"
                    ? "espera"
                    : paciente.status === "em_atendimento"
                    ? "andamento"
                    : "finalizado"
                }
                onClick={() => setPacienteSelecionado(paciente)}
              />
            ))}
          </div>
        )}
      </ScrollArea>
    </div>
  );
};
