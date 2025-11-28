import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";

export const ConnectColumn3 = () => {
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
          />
        </div>
      </div>

      {/* Lista de Pacientes */}
      <ScrollArea className="flex-1 p-4">
        <div className="flex items-center justify-center h-64">
          <p className="text-sm text-muted-foreground text-center">
            Nenhum paciente cadastrado
          </p>
        </div>
      </ScrollArea>
    </div>
  );
};
