import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";

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
          <EmptyState message="Nenhum paciente na fila" />
        </TabsContent>
        <TabsContent value="andamento" className="flex-1 mt-4">
          <EmptyState message="Nenhum atendimento em andamento" />
        </TabsContent>
        <TabsContent value="finalizados" className="flex-1 mt-4">
          <EmptyState message="Nenhum atendimento finalizado" />
        </TabsContent>
      </Tabs>
    </div>
  );
};

const EmptyState = ({ message }: { message: string }) => {
  return (
    <ScrollArea className="h-full px-4">
      <div className="flex items-center justify-center h-64">
        <p className="text-sm text-muted-foreground text-center">{message}</p>
      </div>
    </ScrollArea>
  );
};
