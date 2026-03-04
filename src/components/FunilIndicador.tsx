import { useState } from "react";
import { cn } from "@/lib/utils";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { useLeadAtivoPaciente, useAtualizarEtapaLead, useReabrirLead } from "@/hooks/useLeadsFunil";
import { useOrcamentosPaciente, useAtualizarOrcamento } from "@/hooks/useOrcamentos";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { FunilVendidoModal } from "./FunilVendidoModal";
import { FunilPerdidoModal } from "./FunilPerdidoModal";
import { FunilReabrirModal } from "./FunilReabrirModal";
import { toast } from "sonner";
import { TrendingUp, RotateCcw, User, ShoppingCart, CalendarClock, XCircle, History, FileText } from "lucide-react";
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
  const { data: orcamentos = [] } = useOrcamentosPaciente(pacienteId);
  const { atendenteLogado } = useAtendenteContext();
  const atualizarEtapa = useAtualizarEtapaLead();
  const atualizarOrcamento = useAtualizarOrcamento();
  const reabrirLead = useReabrirLead();
  const [vendidoOpen, setVendidoOpen] = useState(false);
  const [perdidoOpen, setPerdidoOpen] = useState(false);
  const [reabrirOpen, setReabrirOpen] = useState(false);

  if (!lead) return null;

  const historicoReaberturas = (lead as any).historico_reaberturas || [];

  const handleClickEtapa = (etapa: string) => {
    if (etapa === lead.etapa) return;
    if (etapa === "vendido") {
      // Validate: need at least one orcamento to mark as sold
      if (orcamentos.length === 0) {
        toast.warning("Não é possível marcar como vendido sem orçamento registrado.");
        return;
      }
      setVendidoOpen(true);
    }
    if (etapa === "perdido") setPerdidoOpen(true);
    if (etapa === "em_negociacao" && lead.etapa !== "em_negociacao") {
      setReabrirOpen(true);
    }
  };

  const handleReabrir = (observacao: string) => {
    if (!atendenteLogado) return;
    reabrirLead.mutate(
      {
        leadId: lead.id,
        pacienteId: lead.paciente_id,
        reaberto_por_id: atendenteLogado.id,
        reaberto_por_nome: atendenteLogado.nome,
        observacao,
        etapa_anterior: lead.etapa,
      },
      { onSuccess: () => { toast.success("Negociação retomada!"); setReabrirOpen(false); } }
    );
  };

  const handleVendido = (dados: { valor_final: number; forma_pagamento: string; produto_servico?: string; orcamento_id?: string }) => {
    atualizarEtapa.mutate(
      {
        leadId: lead.id,
        pacienteId: lead.paciente_id,
        etapa: "vendido",
        valor_final: dados.valor_final,
        forma_pagamento: dados.forma_pagamento,
        fechado_por_id: atendenteLogado?.id,
      },
      {
        onSuccess: () => {
          // Mark the selected orcamento as "fechado"
          if (dados.orcamento_id && pacienteId) {
            atualizarOrcamento.mutate({
              orcamentoId: dados.orcamento_id,
              pacienteId,
              updates: { status_orcamento: "fechado" },
            });
          }
          toast.success("Venda confirmada! 🎉");
          setVendidoOpen(false);
        },
      }
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

  const formatPagamento = (p: string | null) => {
    if (!p) return null;
    const map: Record<string, string> = {
      pix: "PIX", cartao: "Cartão", boleto: "Boleto",
      transferencia: "Transferência", nao_informado: "Não informado",
      cartao_credito: "Cartão de crédito", cartao_debito: "Cartão de débito",
      dinheiro: "Dinheiro", convenio: "Convênio",
    };
    return map[p] || p;
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
                  <PopoverContent side="bottom" className="w-72 p-3">
                    <div className="space-y-2 text-xs">
                      <p className="font-semibold text-sm">{lead.produto_servico}</p>

                      {/* Orçamentos list */}
                      {orcamentos.length > 0 && (
                        <div className="border-t border-border/50 pt-2 mt-1 space-y-1.5">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <FileText className="h-3 w-3 shrink-0" />
                            <span className="font-medium">Orçamentos ({orcamentos.length})</span>
                          </div>
                          {orcamentos.map((orc) => (
                            <div key={orc.id} className="pl-4 border-l-2 border-muted flex items-center justify-between gap-2">
                              <div>
                                <p className="font-medium">
                                  #{String(orc.numero_sequencial).padStart(3, "0")} — {orc.produto_nome}
                                </p>
                                <p className="text-muted-foreground">
                                  {formatCurrency(orc.valor_com_desconto ?? orc.valor_total)} • {formatDate(orc.created_at)}
                                </p>
                              </div>
                              <span className={cn(
                                "text-[9px] px-1.5 py-0.5 rounded-full font-medium",
                                orc.status_orcamento === "fechado" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"
                              )}>
                                {orc.status_orcamento === "fechado" ? "Fechado" : "Enviado"}
                              </span>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Orçamento value from lead */}
                      <div className="flex items-center gap-1.5 text-muted-foreground">
                        <ShoppingCart className="h-3 w-3 shrink-0" />
                        <span>Valor lead: {formatCurrency(lead.valor_orcamento)}</span>
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
                          <p className="font-medium text-green-600">✅ Vendido</p>
                          {lead.produto_servico && (
                            <div className="flex items-center gap-1.5">
                              <ShoppingCart className="h-3 w-3 shrink-0 text-green-600" />
                              <span>Produto: <span className="font-medium">{lead.produto_servico}</span></span>
                            </div>
                          )}
                          {lead.valor_final != null && (
                            <p className="text-green-600 font-medium">
                              Valor fechado: {formatCurrency(lead.valor_final)}
                            </p>
                          )}
                          {lead.forma_pagamento && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <span>Pagamento: <span className="font-medium">{formatPagamento(lead.forma_pagamento)}</span></span>
                            </div>
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
                          <p className="font-medium text-destructive">❌ Perdido</p>
                          {lead.produto_servico && (
                            <div className="flex items-center gap-1.5">
                              <ShoppingCart className="h-3 w-3 shrink-0" />
                              <span>Produto orçado: <span className="font-medium">{lead.produto_servico}</span></span>
                            </div>
                          )}
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <ShoppingCart className="h-3 w-3 shrink-0" />
                            <span>Valor orçado: {formatCurrency(lead.valor_orcamento)}</span>
                          </div>
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
                          {lead.data_fechamento && (
                            <div className="flex items-center gap-1.5 text-muted-foreground">
                              <CalendarClock className="h-3 w-3 shrink-0" />
                              <span>Data: {formatDate(lead.data_fechamento)}</span>
                            </div>
                          )}
                        </div>
                      )}

                      {/* Histórico de reaberturas */}
                      {historicoReaberturas.length > 0 && (
                        <div className="border-t border-border/50 pt-2 mt-2 space-y-2">
                          <div className="flex items-center gap-1.5 text-muted-foreground">
                            <History className="h-3 w-3 shrink-0" />
                            <span className="font-medium">Histórico ({historicoReaberturas.length})</span>
                          </div>
                          {historicoReaberturas.map((h: any, idx: number) => (
                            <div key={idx} className="pl-4 border-l-2 border-muted space-y-0.5 text-[10px]">
                              <p className="text-muted-foreground">
                                {h.etapa_anterior === "vendido" ? "Foi vendido" : "Foi perdido"} → Reaberto em {formatDate(h.reaberto_em)}
                              </p>
                              {h.reaberto_por_nome && (
                                <p className="text-muted-foreground">
                                  <User className="h-2.5 w-2.5 inline mr-1" />
                                  Reaberto por: <span className="font-medium">{h.reaberto_por_nome}</span>
                                </p>
                              )}
                              {h.observacao_reabertura && (
                                <p className="italic text-muted-foreground">"{h.observacao_reabertura}"</p>
                              )}
                            </div>
                          ))}
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
        produtoServico={lead.produto_servico}
        orcamentos={orcamentos}
      />

      <FunilPerdidoModal
        open={perdidoOpen}
        onOpenChange={setPerdidoOpen}
        onConfirmar={handlePerdido}
      />

      <FunilReabrirModal
        open={reabrirOpen}
        onOpenChange={setReabrirOpen}
        onConfirmar={handleReabrir}
        etapaAnterior={lead.etapa as "vendido" | "perdido"}
      />
    </TooltipProvider>
  );
};
