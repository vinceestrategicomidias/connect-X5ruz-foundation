import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { usePacientes } from "@/hooks/usePacientes";
import { ConnectPatientCard } from "./ConnectPatientCard";
import { usePacienteContext } from "@/contexts/PacienteContext";
import { Loader2 } from "lucide-react";

export const ConnectColumn1 = () => {
  return (
    <div className="w-80 border-r border-border bg-card flex flex-col h-full">
      {/* Header */}
      <div className="p-4 border-b border-border">
        <h2 className="text-lg font-display font-semibold text-foreground">
          Fluxo de Atendimento
        </h2>
      </div>

      {/* Tabs de Status */}
      <Tabs defaultValue="espera" className="flex-1 flex flex-col">
        <div className="px-4 pt-4">
          <TabsList className="w-full grid grid-cols-3">
            <TabsTrigger value="espera">Fila de Espera</TabsTrigger>
            <TabsTrigger value="andamento">Em Andamento</TabsTrigger>
            <TabsTrigger value="finalizados">Finalizados</TabsTrigger>
          </TabsList>
        </div>

        <TabsContent value="espera" className="flex-1 mt-4">
          <PacientesLista status="fila" />
        </TabsContent>
        <TabsContent value="andamento" className="flex-1 mt-4">
          <PacientesLista status="em_atendimento" />
        </TabsContent>
        <TabsContent value="finalizados" className="flex-1 mt-4">
          <PacientesLista status="finalizado" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const PacientesLista = ({ status }: { status: "fila" | "em_atendimento" | "finalizado" }) => {
  const { data: pacientes, isLoading } = usePacientes(status);
  const { setPacienteSelecionado } = usePacienteContext();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (!pacientes || pacientes.length === 0) {
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

  return (
    <ScrollArea className="h-full px-4">
      <div className="space-y-2">
        {pacientes.map((paciente) => (
          <ConnectPatientCard
            key={paciente.id}
            name={paciente.nome}
            lastMessage={paciente.ultima_mensagem || undefined}
            status={
              status === "fila"
                ? "espera"
                : status === "em_atendimento"
                ? "andamento"
                : "finalizado"
            }
            onClick={() => setPacienteSelecionado(paciente)}
          />
        ))}
      </div>
    </ScrollArea>
  );
};
