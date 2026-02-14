import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { ConnectAvatar } from "./ConnectAvatar";
import { Users, Headphones, Coffee, PhoneCall, Search, X } from "lucide-react";

interface AtendenteStatus {
  id: string;
  nome: string;
  setor: string;
  unidade: string;
  status: "online" | "em_atendimento" | "em_pausa" | "em_ligacao";
  tempoNoStatus: string;
  tempoMinutos: number;
}

const ATENDENTES_STATUS: AtendenteStatus[] = [
  { id: "1", nome: "Emilly Santos", setor: "Venda", unidade: "Sede - Vitória/ES", status: "em_atendimento", tempoNoStatus: "1h 23min", tempoMinutos: 83 },
  { id: "2", nome: "Paloma Ribeiro", setor: "Venda", unidade: "Sede - Vitória/ES", status: "em_atendimento", tempoNoStatus: "45min", tempoMinutos: 45 },
  { id: "3", nome: "Geovanna Costa", setor: "Venda", unidade: "Sede - Vitória/ES", status: "online", tempoNoStatus: "34min", tempoMinutos: 34 },
  { id: "4", nome: "Camila Ribeiro", setor: "Venda", unidade: "Sede - Vitória/ES", status: "em_pausa", tempoNoStatus: "18min", tempoMinutos: 18 },
  { id: "5", nome: "Marcos Vinícius", setor: "Convênios", unidade: "Sede - Vitória/ES", status: "online", tempoNoStatus: "2h 10min", tempoMinutos: 130 },
  { id: "6", nome: "Bianca Ferreira", setor: "Pré-venda", unidade: "Unidade Rio de Janeiro/RJ", status: "online", tempoNoStatus: "1h 45min", tempoMinutos: 105 },
  { id: "7", nome: "Lucas Pereira", setor: "Venda", unidade: "Sede - Vitória/ES", status: "em_atendimento", tempoNoStatus: "32min", tempoMinutos: 32 },
  { id: "8", nome: "Diego Martins", setor: "Pré-venda", unidade: "Unidade São Paulo/SP", status: "em_pausa", tempoNoStatus: "7min", tempoMinutos: 7 },
  { id: "9", nome: "Ricardo Almeida", setor: "Comercial", unidade: "Unidade São Paulo/SP", status: "em_ligacao", tempoNoStatus: "3min", tempoMinutos: 3 },
  { id: "10", nome: "Ana Clara", setor: "Convênios", unidade: "Unidade São Paulo/SP", status: "em_ligacao", tempoNoStatus: "12min", tempoMinutos: 12 },
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
  const [modalStatus, setModalStatus] = useState<string | null>(null);
  const [busca, setBusca] = useState("");

  const contadores = {
    online: ATENDENTES_STATUS.filter(a => a.status === "online").length,
    em_atendimento: ATENDENTES_STATUS.filter(a => a.status === "em_atendimento").length,
    em_pausa: ATENDENTES_STATUS.filter(a => a.status === "em_pausa").length,
    em_ligacao: ATENDENTES_STATUS.filter(a => a.status === "em_ligacao").length,
  };

  const atendentesFiltrados = modalStatus
    ? ATENDENTES_STATUS
        .filter(a => a.status === modalStatus)
        .filter(a => a.nome.toLowerCase().includes(busca.toLowerCase()))
        .sort((a, b) => b.tempoMinutos - a.tempoMinutos)
    : [];

  const configAtual = modalStatus ? statusConfig[modalStatus as keyof typeof statusConfig] : null;

  return (
    <>
      <div className="grid grid-cols-4 gap-4">
        {(Object.entries(statusConfig) as [keyof typeof statusConfig, typeof statusConfig[keyof typeof statusConfig]][]).map(([key, config]) => {
          const Icon = config.icon;
          const count = contadores[key];
          return (
            <Card
              key={key}
              onClick={() => { setModalStatus(key); setBusca(""); }}
              className="p-4 cursor-pointer transition-all hover:ring-2 hover:ring-primary/50"
            >
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-lg ${config.bgLight}`}>
                  <Icon className={`h-5 w-5 ${config.textColor}`} />
                </div>
                <div>
                  <p className="text-2xl font-bold">{count}</p>
                  <p className="text-xs text-muted-foreground">{config.label}</p>
                </div>
              </div>
            </Card>
          );
        })}
      </div>

      <Dialog open={!!modalStatus} onOpenChange={(open) => { if (!open) setModalStatus(null); }}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {configAtual && (
                <>
                  <div className={`w-3 h-3 rounded-full ${configAtual.color}`} />
                  Atendentes {configAtual.label.toLowerCase()}
                  <Badge variant="secondary" className="ml-1">{atendentesFiltrados.length}</Badge>
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="relative mb-3">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Buscar por nome..."
              value={busca}
              onChange={(e) => setBusca(e.target.value)}
              className="pl-9"
            />
          </div>

          <ScrollArea className="max-h-[360px]">
            <div className="space-y-1">
              {atendentesFiltrados.map((atendente) => (
                <div
                  key={atendente.id}
                  className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-muted/50 cursor-pointer"
                  onClick={onOpenMonitoramento}
                >
                  <div className="relative">
                    <ConnectAvatar name={atendente.nome} size="sm" />
                    <div className={`absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full border-2 border-background ${configAtual?.color}`} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium truncate">{atendente.nome}</p>
                    <p className="text-xs text-muted-foreground">{atendente.setor} • {atendente.unidade}</p>
                  </div>
                  <Badge variant="outline" className="text-xs shrink-0">
                    {atendente.tempoNoStatus}
                  </Badge>
                </div>
              ))}
              {atendentesFiltrados.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-4">Nenhum atendente encontrado.</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
