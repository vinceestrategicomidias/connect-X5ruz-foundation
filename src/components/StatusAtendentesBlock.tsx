import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ConnectAvatar } from "./ConnectAvatar";
import { Users, Headphones, Coffee, PhoneCall } from "lucide-react";

interface AtendenteStatus {
  id: string;
  nome: string;
  setor: string;
  unidade: string;
  status: "online" | "em_atendimento" | "em_pausa" | "em_ligacao";
  tempoNoStatus: string;
}

const ATENDENTES_STATUS: AtendenteStatus[] = [
  { id: "1", nome: "Emilly Santos", setor: "Venda", unidade: "Sede - Vitória", status: "em_atendimento", tempoNoStatus: "1h 23min" },
  { id: "2", nome: "Paloma Ribeiro", setor: "Venda", unidade: "Sede - Vitória", status: "em_atendimento", tempoNoStatus: "45min" },
  { id: "3", nome: "Geovanna Costa", setor: "Pré-venda", unidade: "Sede - Vitória", status: "em_ligacao", tempoNoStatus: "12min" },
  { id: "4", nome: "Ricardo Almeida", setor: "Comercial", unidade: "Unidade SP", status: "em_pausa", tempoNoStatus: "8min" },
  { id: "5", nome: "Marcos Vinícius", setor: "Convênios", unidade: "Sede - Vitória", status: "online", tempoNoStatus: "2h 10min" },
  { id: "6", nome: "Bianca Ferreira", setor: "Pré-venda", unidade: "Unidade RJ", status: "online", tempoNoStatus: "1h 45min" },
  { id: "7", nome: "Lucas Pereira", setor: "Venda", unidade: "Sede - Vitória", status: "em_atendimento", tempoNoStatus: "32min" },
  { id: "8", nome: "Ana Clara", setor: "Convênios", unidade: "Unidade SP", status: "em_pausa", tempoNoStatus: "15min" },
];

const statusConfig = {
  online: { label: "Online", icon: Users, color: "bg-green-500", textColor: "text-green-700 dark:text-green-400", bgLight: "bg-green-50 dark:bg-green-900/20" },
  em_atendimento: { label: "Em atendimento", icon: Headphones, color: "bg-blue-500", textColor: "text-blue-700 dark:text-blue-400", bgLight: "bg-blue-50 dark:bg-blue-900/20" },
  em_pausa: { label: "Em pausa", icon: Coffee, color: "bg-yellow-500", textColor: "text-yellow-700 dark:text-yellow-400", bgLight: "bg-yellow-50 dark:bg-yellow-900/20" },
  em_ligacao: { label: "Em ligação", icon: PhoneCall, color: "bg-purple-500", textColor: "text-purple-700 dark:text-purple-400", bgLight: "bg-purple-50 dark:bg-purple-900/20" },
};

interface StatusAtendentesBlockProps {
  onOpenMonitoramento: () => void;
}

export const StatusAtendentesBlock = ({ onOpenMonitoramento }: StatusAtendentesBlockProps) => {
  const [statusExpandido, setStatusExpandido] = useState<string | null>(null);

  const contadores = {
    online: ATENDENTES_STATUS.filter(a => a.status === "online").length,
    em_atendimento: ATENDENTES_STATUS.filter(a => a.status === "em_atendimento").length,
    em_pausa: ATENDENTES_STATUS.filter(a => a.status === "em_pausa").length,
    em_ligacao: ATENDENTES_STATUS.filter(a => a.status === "em_ligacao").length,
  };

  const atendentesFiltrados = statusExpandido
    ? ATENDENTES_STATUS.filter(a => a.status === statusExpandido)
    : [];

  return (
    <Card className="p-4 mb-6">
      <h3 className="text-lg font-semibold mb-4">Status dos Atendentes (tempo real)</h3>
      
      <div className="grid grid-cols-4 gap-3 mb-4">
        {(Object.entries(statusConfig) as [keyof typeof statusConfig, typeof statusConfig[keyof typeof statusConfig]][]).map(([key, config]) => {
          const Icon = config.icon;
          const count = contadores[key];
          const isActive = statusExpandido === key;
          
          return (
            <div
              key={key}
              onClick={() => setStatusExpandido(isActive ? null : key)}
              className={`p-3 rounded-lg border cursor-pointer transition-all ${
                isActive ? "ring-2 ring-primary border-primary" : "hover:bg-muted/50"
              } ${config.bgLight}`}
            >
              <div className="flex items-center gap-2 mb-1">
                <div className={`w-2.5 h-2.5 rounded-full ${config.color}`} />
                <Icon className={`h-4 w-4 ${config.textColor}`} />
              </div>
              <p className="text-2xl font-bold">{count}</p>
              <p className="text-xs text-muted-foreground">{config.label}</p>
            </div>
          );
        })}
      </div>

      {statusExpandido && atendentesFiltrados.length > 0 && (
        <ScrollArea className="h-[200px] border rounded-lg">
          <div className="p-2 space-y-1">
            {atendentesFiltrados.map((atendente) => {
              const config = statusConfig[atendente.status];
              return (
                <div
                  key={atendente.id}
                  className="flex items-center gap-3 p-2 rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={onOpenMonitoramento}
                >
                  <div className="relative">
                    <ConnectAvatar name={atendente.nome} size="sm" />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${config.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{atendente.nome}</p>
                    <p className="text-xs text-muted-foreground">{atendente.setor} • {atendente.unidade}</p>
                  </div>
                  <Badge variant="outline" className="text-xs">
                    {atendente.tempoNoStatus}
                  </Badge>
                </div>
              );
            })}
          </div>
        </ScrollArea>
      )}
    </Card>
  );
};
