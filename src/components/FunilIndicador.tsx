import { useState } from "react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useLeadAtivoPaciente, useAtualizarEtapaLead, useReabrirLead } from "@/hooks/useLeadsFunil";
import { FunilVendidoModal } from "./FunilVendidoModal";
import { FunilPerdidoModal } from "./FunilPerdidoModal";
import { toast } from "sonner";
import { TrendingUp, RotateCcw } from "lucide-react";

interface FunilIndicadorProps {
  pacienteId: string | null;
}

const ETAPAS = [
  { key: "em_negociacao", label: "Em negociação", color: "bg-blue-500", textColor: "text-blue-700", bgLight: "bg-blue-100" },
  { key: "vendido", label: "Vendido", color: "bg-green-500", textColor: "text-green-700", bgLight: "bg-green-100" },
  { key: "perdido", label: "Perdido", color: "bg-red-500", textColor: "text-red-700", bgLight: "bg-red-100" },
] as const;

export const FunilIndicador = ({ pacienteId }: FunilIndicadorProps) => {
  const { data: lead } = useLeadAtivoPaciente(pacienteId);
  const atualizarEtapa = useAtualizarEtapaLead();
  const reabrirLead = useReabrirLead();
  const [vendidoOpen, setVendidoOpen] = useState(false);
  const [perdidoOpen, setPerdidoOpen] = useState(false);

  if (!lead) return null;

  const handleClickEtapa = (etapa: string) => {
    if (etapa === lead.etapa) return;
    if (etapa === "vendido") setVendidoOpen(true);
    if (etapa === "perdido") setPerdidoOpen(true);
    if (etapa === "em_negociacao" && lead.etapa !== "em_negociacao") {
      // Reabrir
      reabrirLead.mutate(
        { leadId: lead.id, pacienteId: lead.paciente_id },
        { onSuccess: () => toast.success("Lead reaberto!") }
      );
    }
  };

  const handleVendido = (dados: { valor_final: number; forma_pagamento: string }) => {
    atualizarEtapa.mutate(
      {
        leadId: lead.id,
        pacienteId: lead.paciente_id,
        etapa: "vendido",
        valor_final: dados.valor_final,
        forma_pagamento: dados.forma_pagamento,
      },
      { onSuccess: () => { toast.success("Venda confirmada! 🎉"); setVendidoOpen(false); } }
    );
  };

  const handlePerdido = (motivo: string) => {
    atualizarEtapa.mutate(
      {
        leadId: lead.id,
        pacienteId: lead.paciente_id,
        etapa: "perdido",
        motivo_perda: motivo,
      },
      { onSuccess: () => { toast.info("Lead marcado como perdido"); setPerdidoOpen(false); } }
    );
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1.5 px-2">
        <Tooltip>
          <TooltipTrigger>
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
          </TooltipTrigger>
          <TooltipContent side="bottom" className="text-xs max-w-52">
            <p className="font-medium">{lead.produto_servico}</p>
            <p>Orçamento: {formatCurrency(lead.valor_orcamento)}</p>
            {lead.valor_final && <p>Fechado: {formatCurrency(lead.valor_final)}</p>}
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center gap-0.5">
          {ETAPAS.map((etapa, idx) => {
            const isActive = lead.etapa === etapa.key;
            const canClick = lead.etapa !== etapa.key;

            return (
              <button
                key={etapa.key}
                onClick={() => canClick && handleClickEtapa(etapa.key)}
                className={cn(
                  "px-2 py-0.5 text-[10px] font-medium transition-all border",
                  idx === 0 && "rounded-l-full",
                  idx === ETAPAS.length - 1 && "rounded-r-full",
                  isActive
                    ? `${etapa.color} text-white border-transparent`
                    : `${etapa.bgLight} ${etapa.textColor} border-transparent opacity-50 hover:opacity-80`,
                  canClick && "cursor-pointer"
                )}
              >
                {etapa.label}
              </button>
            );
          })}
        </div>

        {(lead.etapa === "vendido" || lead.etapa === "perdido") && (
          <Tooltip>
            <TooltipTrigger asChild>
              <button
                onClick={() => handleClickEtapa("em_negociacao")}
                className="ml-0.5 text-muted-foreground hover:text-primary"
              >
                <RotateCcw className="h-3 w-3" />
              </button>
            </TooltipTrigger>
            <TooltipContent className="text-xs">Reabrir lead</TooltipContent>
          </Tooltip>
        )}
      </div>

      <FunilVendidoModal
        open={vendidoOpen}
        onOpenChange={setVendidoOpen}
        onConfirmar={handleVendido}
        valorOrcamento={lead.valor_orcamento}
      />

      <FunilPerdidoModal
        open={perdidoOpen}
        onOpenChange={setPerdidoOpen}
        onConfirmar={handlePerdido}
      />
    </TooltipProvider>
  );
};
