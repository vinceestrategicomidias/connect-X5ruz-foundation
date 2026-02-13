import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLeadAtivoPaciente, useAtualizarEtapaLead, useReabrirLead } from "@/hooks/useLeadsFunil";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { FunilVendidoModal } from "./FunilVendidoModal";
import { FunilPerdidoModal } from "./FunilPerdidoModal";
import { toast } from "sonner";
import { TrendingUp, RotateCcw, User, ShoppingCart, CalendarClock, XCircle } from "lucide-react";
import { format } from "date-fns";

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
  const { atendenteLogado } = useAtendenteContext();
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
        fechado_por_id: atendenteLogado?.id,
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
        perdido_por_id: atendenteLogado?.id,
      },
      { onSuccess: () => { toast.info("Lead marcado como perdido"); setPerdidoOpen(false); } }
    );
  };

  const formatCurrency = (v: number) =>
    v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const formatDate = (d: string) => {
    try { return format(new Date(d), "dd/MM/yyyy HH:mm"); } catch { return d; }
  };

  const renderTooltipContent = () => {
    return (
      <div className="space-y-1.5 text-xs max-w-56">
        <p className="font-semibold text-sm">{lead.produto_servico}</p>

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <ShoppingCart className="h-3 w-3 shrink-0" />
          <span>Orçamento: {formatCurrency(lead.valor_orcamento)}</span>
        </div>

        {lead.vendedor_nome && (
          <div className="flex items-center gap-1.5">
            <User className="h-3 w-3 shrink-0 text-primary" />
            <span>Vendedor: <span className="font-medium">{lead.vendedor_nome}</span></span>
          </div>
        )}

        <div className="flex items-center gap-1.5 text-muted-foreground">
          <CalendarClock className="h-3 w-3 shrink-0" />
          <span>Enviado: {formatDate(lead.data_envio_orcamento)}</span>
        </div>

        {lead.etapa === "vendido" && (
          <div className="border-t border-border/50 pt-1.5 mt-1.5 space-y-1">
            {lead.valor_final && (
              <p className="text-green-600 font-medium">
                Fechado: {formatCurrency(lead.valor_final)}
              </p>
            )}
            {lead.fechado_por_nome && (
              <div className="flex items-center gap-1.5">
                <User className="h-3 w-3 shrink-0 text-green-600" />
                <span>Fechou venda: <span className="font-medium">{lead.fechado_por_nome}</span></span>
              </div>
            )}
            {lead.data_fechamento && (
              <div className="flex items-center gap-1.5 text-muted-foreground">
                <CalendarClock className="h-3 w-3 shrink-0" />
                <span>{formatDate(lead.data_fechamento)}</span>
              </div>
            )}
          </div>
        )}

        {lead.etapa === "perdido" && lead.motivo_perda && (
          <div className="border-t border-border/50 pt-1.5 mt-1.5">
            <p className="text-destructive">Motivo: {lead.motivo_perda}</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <TooltipProvider>
      <div className="flex items-center gap-1.5 px-2">
        <Tooltip>
          <TooltipTrigger>
            <TrendingUp className="h-3.5 w-3.5 text-primary" />
          </TooltipTrigger>
          <TooltipContent side="bottom">
            {renderTooltipContent()}
          </TooltipContent>
        </Tooltip>

        <div className="flex items-center gap-0.5">
          {ETAPAS.map((etapa, idx) => {
            const isActive = lead.etapa === etapa.key;
            const canClick = lead.etapa !== etapa.key;
            const showPopover = isActive && etapa.key !== "em_negociacao" ? false : (etapa.key === "em_negociacao" && isActive);

            const btnClass = cn(
              "px-2 py-0.5 text-[10px] font-medium transition-all border",
              idx === 0 && "rounded-l-full",
              idx === ETAPAS.length - 1 && "rounded-r-full",
              isActive
                ? `${etapa.color} text-white border-transparent`
                : `${etapa.bgLight} ${etapa.textColor} border-transparent opacity-50 hover:opacity-80`,
              "cursor-pointer"
            );

            // All active stages get a popover with history
            if (isActive) {
              return (
                <Popover key={etapa.key}>
                  <PopoverTrigger asChild>
                    <button className={btnClass}>{etapa.label}</button>
                  </PopoverTrigger>
                  <PopoverContent side="bottom" className="w-64 p-3">
                    <div className="space-y-2 text-xs">
                      <p className="font-semibold text-sm">{lead.produto_servico}</p>

                      {/* Orçamento */}
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <ShoppingCart className="h-3 w-3 shrink-0" />
                        <span>Orçamento: {formatCurrency(lead.valor_orcamento)}</span>
                      </div>

                      {/* Vendedor que enviou */}
                      {lead.vendedor_nome && (
                        <div className="flex items-center gap-1.5">
                          <User className="h-3 w-3 shrink-0 text-primary" />
                          <span>Enviado por: <span className="font-medium">{lead.vendedor_nome}</span></span>
                        </div>
                      )}

                      {/* Data envio */}
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <CalendarClock className="h-3 w-3 shrink-0" />
                        <span>Enviado em: {formatDate(lead.data_envio_orcamento)}</span>
                      </div>

                      {/* Vendido details */}
                      {lead.etapa === "vendido" && (
                        <div className="border-t border-border/50 pt-2 mt-2 space-y-1.5">
                          {lead.valor_final != null && (
                            <p className="text-green-600 font-medium">
                              Valor fechado: {formatCurrency(lead.valor_final)}
                            </p>
                          )}
                          {lead.fechado_por_nome && (
                            <div className="flex items-center gap-1.5">
                              <User className="h-3 w-3 shrink-0 text-green-600" />
                              <span>Vendido por: <span className="font-medium">{lead.fechado_por_nome}</span></span>
                            </div>
                          )}
                          {lead.data_fechamento && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <CalendarClock className="h-3 w-3 shrink-0" />
                              <span>Fechado em: {formatDate(lead.data_fechamento)}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Perdido details */}
                      {lead.etapa === "perdido" && (
                        <div className="border-t border-border/50 pt-2 mt-2 space-y-1.5">
                          {lead.motivo_perda && (
                            <div className="flex items-center gap-1.5 text-destructive">
                              <XCircle className="h-3 w-3 shrink-0" />
                              <span>Motivo: <span className="font-medium">{lead.motivo_perda}</span></span>
                            </div>
                          )}
                          {lead.perdido_por_nome && (
                            <div className="flex items-center gap-1.5">
                              <User className="h-3 w-3 shrink-0 text-destructive" />
                              <span>Classificado por: <span className="font-medium">{lead.perdido_por_nome}</span></span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              );
            }

            return (
              <button
                key={etapa.key}
                onClick={() => canClick && handleClickEtapa(etapa.key)}
                className={btnClass}
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
