import { useState } from "react";
import { X, Copy, RotateCcw, Send, Trash2, ArrowLeft } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "@/hooks/use-toast";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { usePacienteContext } from "@/contexts/PacienteContext";
import { useConversaByPaciente } from "@/hooks/useConversas";
import { useLeadAtivoPaciente, useCriarLead } from "@/hooks/useLeadsFunil";
import { useEnviarMensagem } from "@/hooks/useMutations";
import { FunilClassificacaoModal } from "./FunilClassificacaoModal";

interface RoteirosNode {
  id: string;
  mensagem: string;
  opcoes?: { rotulo: string; proximo_no: string }[];
}

const roteiros: Record<string, RoteirosNode> = {
  no_inicial: {
    id: "no_inicial",
    mensagem: "Olá! Seja bem-vindo(a) ao Grupo Liruz 💙. Sou [nome], vou te ajudar hoje!",
    opcoes: [
      { rotulo: "Paciente Particular", proximo_no: "no_particular_dados" },
      { rotulo: "Paciente Convênio", proximo_no: "no_convenio_dados" },
      { rotulo: "Orçamento", proximo_no: "no_template_orcamento" },
    ],
  },
  no_particular_dados: {
    id: "no_particular_dados",
    mensagem: "Perfeito! Para seguir, preciso do seu nome completo, CPF, telefone e cidade/estado.",
    opcoes: [
      { rotulo: "Enviar orçamento", proximo_no: "no_particular_orcamento" },
      { rotulo: "Voltar", proximo_no: "no_inicial" },
    ],
  },
  no_particular_orcamento: {
    id: "no_particular_orcamento",
    mensagem: "Vou verificar as melhores condições de orçamento para você. Um instante!",
    opcoes: [
      { rotulo: "Condições de pagamento", proximo_no: "no_particular_condicoes" },
      { rotulo: "Objeções", proximo_no: "no_particular_objecoes" },
      { rotulo: "Voltar", proximo_no: "no_particular_dados" },
    ],
  },
  no_particular_condicoes: {
    id: "no_particular_condicoes",
    mensagem: "Temos excelentes condições! Entrada facilitada e parcelamento em até 12x sem juros no cartão de crédito.",
    opcoes: [
      { rotulo: "Agendar consulta", proximo_no: "no_agendamento" },
      { rotulo: "Voltar", proximo_no: "no_particular_orcamento" },
    ],
  },
  no_particular_objecoes: {
    id: "no_particular_objecoes",
    mensagem: "Entendo suas preocupações. Podemos conversar sobre qualquer dúvida que você tenha. O que te preocupa?",
    opcoes: [
      { rotulo: "Voltar ao orçamento", proximo_no: "no_particular_orcamento" },
    ],
  },
  no_convenio_dados: {
    id: "no_convenio_dados",
    mensagem: "Que bom! Qual o seu convênio? Preciso também do nome completo, número da carteirinha e telefone.",
    opcoes: [
      { rotulo: "Verificar cobertura", proximo_no: "no_convenio_cobertura" },
      { rotulo: "Voltar", proximo_no: "no_inicial" },
    ],
  },
  no_convenio_cobertura: {
    id: "no_convenio_cobertura",
    mensagem: "Vou verificar a cobertura do seu convênio para o procedimento desejado. Aguarde um momento.",
    opcoes: [
      { rotulo: "Agendar consulta", proximo_no: "no_agendamento" },
      { rotulo: "Voltar", proximo_no: "no_convenio_dados" },
    ],
  },
  no_agendamento: {
    id: "no_agendamento",
    mensagem: "Perfeito! Temos disponibilidade para os próximos dias. Qual período prefere: manhã ou tarde?",
    opcoes: [
      { rotulo: "Confirmar agendamento", proximo_no: "no_confirmacao" },
    ],
  },
  no_confirmacao: {
    id: "no_confirmacao",
    mensagem: "Agendamento confirmado! 🎉 Você receberá uma mensagem de confirmação com todos os detalhes. Até breve!",
  },
  no_template_orcamento: {
    id: "no_template_orcamento",
    mensagem: "📋 Template de Orçamento - Preencha os campos abaixo para gerar o orçamento.",
  },
};

interface OrcamentoData {
  descricao: string;
  valorProduto: string;
  despesasAdicionais: string;
  valorDesconto: string;
}

interface RoteirosPanelProps {
  open: boolean;
  onClose: () => void;
}

export const RoteirosPanel = ({ open, onClose }: RoteirosPanelProps) => {
  const [fluxo, setFluxo] = useState<string[]>(["no_inicial"]);
  const { atendenteLogado } = useAtendenteContext();
  const { pacienteSelecionado } = usePacienteContext();
  const { data: conversa } = useConversaByPaciente(pacienteSelecionado?.id || null);
  const { data: leadAtivo } = useLeadAtivoPaciente(pacienteSelecionado?.id || null);
  const criarLead = useCriarLead();
  const enviarMensagem = useEnviarMensagem();
  const [classificacaoModalOpen, setClassificacaoModalOpen] = useState(false);
  const [pendingOrcamentoCallback, setPendingOrcamentoCallback] = useState<(() => void) | null>(null);
  const [orcamento, setOrcamento] = useState<OrcamentoData>({
    descricao: "Consulta especializada",
    valorProduto: "350.00",
    despesasAdicionais: "50.00",
    valorDesconto: "",
  });

  const handleOpcaoClick = (proximoNo: string) => {
    setFluxo([...fluxo, proximoNo]);
  };

  const handleCopyMessage = (mensagem: string) => {
    const mensagemPersonalizada = mensagem.replace("[nome]", atendenteLogado?.nome || "");
    navigator.clipboard.writeText(mensagemPersonalizada);
    toast({
      title: "Mensagem copiada",
      description: "A mensagem foi copiada para a área de transferência",
    });
  };

  const handleReset = () => {
    setFluxo(["no_inicial"]);
  };

  const formatCurrency = (value: string): string => {
    const num = parseFloat(value) || 0;
    return num.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const calcularTotal = (): number => {
    const valorProduto = parseFloat(orcamento.valorProduto) || 0;
    const despesas = parseFloat(orcamento.despesasAdicionais) || 0;
    return valorProduto + despesas;
  };

  const gerarMensagemOrcamento = (): string => {
    const total = calcularTotal();
    const desconto = parseFloat(orcamento.valorDesconto) || 0;
    
    let mensagem = `📋 *ORÇAMENTO – ${orcamento.descricao}*\n\n`;
    mensagem += `💰 Valor do produto: ${formatCurrency(orcamento.valorProduto)}\n`;
    mensagem += `📦 Despesas adicionais: ${formatCurrency(orcamento.despesasAdicionais)}\n`;
    mensagem += `━━━━━━━━━━━━━━━━━━━━\n`;
    mensagem += `*Total: ${formatCurrency(total.toString())}*\n`;
    
    if (desconto > 0) {
      mensagem += `🎁 Com desconto: ${formatCurrency(orcamento.valorDesconto)}\n`;
    }
    
    mensagem += `\nCaso deseje, posso te enviar as opções de pagamento. 😊`;
    
    return mensagem;
  };

  const enviarOrcamentoDireto = () => {
    const mensagem = gerarMensagemOrcamento();
    if (conversa?.id) {
      enviarMensagem.mutate({
        conversaId: conversa.id,
        texto: mensagem,
        autor: "atendente",
      });
      toast({
        title: "Orçamento enviado!",
        description: "O orçamento foi enviado na conversa",
      });
    } else {
      navigator.clipboard.writeText(mensagem);
      toast({
        title: "Orçamento copiado!",
        description: "O orçamento foi copiado para a área de transferência",
      });
    }
  };

  const handleEnviarOrcamento = () => {
    if (!pacienteSelecionado || !atendenteLogado) {
      enviarOrcamentoDireto();
      return;
    }
    // If lead already exists, just send
    if (leadAtivo) {
      enviarOrcamentoDireto();
      return;
    }
    // First budget → open classification modal
    setPendingOrcamentoCallback(() => enviarOrcamentoDireto);
    setClassificacaoModalOpen(true);
  };

  const handleClassificacao = (tipo: "venda" | "apenas_contato", dados?: {
    produto_servico: string;
    valor_orcamento: number;
    origem_lead?: string;
    observacoes?: string;
  }) => {
    if (tipo === "venda" && dados && pacienteSelecionado && atendenteLogado) {
      criarLead.mutate({
        paciente_id: pacienteSelecionado.id,
        conversa_id: conversa?.id,
        atendente_id: atendenteLogado.id,
        setor_id: atendenteLogado.setor_id || undefined,
        produto_servico: dados.produto_servico,
        valor_orcamento: dados.valor_orcamento,
        origem_lead: dados.origem_lead,
        observacoes: dados.observacoes,
      });
    }
    setClassificacaoModalOpen(false);
    if (pendingOrcamentoCallback) {
      pendingOrcamentoCallback();
      setPendingOrcamentoCallback(null);
    }
  };

  const handleLimparOrcamento = () => {
    setOrcamento({
      descricao: "",
      valorProduto: "",
      despesasAdicionais: "",
      valorDesconto: "",
    });
  };

  const handleVoltarOrcamento = () => {
    setFluxo(fluxo.slice(0, -1));
  };

  const currentNodeId = fluxo[fluxo.length - 1];
  const isOrcamentoNode = currentNodeId === "no_template_orcamento";

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 bg-background/80 backdrop-blur-sm">
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-background border-l shadow-2xl animate-in slide-in-from-right">
        <div className="flex h-full flex-col">
          {/* Header */}
          <div className="flex items-center justify-between border-b p-4">
            <div>
              <h2 className="text-lg font-semibold">Roteiros do Setor</h2>
              <p className="text-sm text-muted-foreground">Siga o fluxo de atendimento</p>
            </div>
            <div className="flex gap-2">
              <Button variant="outline" size="sm" onClick={handleReset}>
                Reiniciar
              </Button>
              <Button variant="ghost" size="icon" onClick={onClose}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Fluxo de Roteiro */}
          <ScrollArea className="flex-1 p-4">
            <div className="space-y-4">
              {fluxo.map((nodeId, index) => {
                const node = roteiros[nodeId];
                if (!node) return null;

                const mensagemPersonalizada = node.mensagem.replace(
                  "[nome]",
                  atendenteLogado?.nome || ""
                );

                // Se for o nó de orçamento e for o último, renderizar o formulário
                if (nodeId === "no_template_orcamento" && index === fluxo.length - 1) {
                  return (
                    <div key={`${nodeId}-${index}`} className="space-y-4">
                      <Card className="p-4 bg-primary/5 border-primary/20">
                        <p className="text-sm font-medium mb-4">{mensagemPersonalizada}</p>
                        
                        {/* Formulário de Orçamento */}
                        <div className="space-y-4">
                          <div className="space-y-2">
                            <Label htmlFor="descricao" className="text-xs">Descrição do produto/serviço</Label>
                            <Input
                              id="descricao"
                              placeholder="Ex.: Consulta especializada / Sistema Connect"
                              value={orcamento.descricao}
                              onChange={(e) => setOrcamento({ ...orcamento, descricao: e.target.value })}
                              className="text-sm"
                            />
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label htmlFor="valorProduto" className="text-xs">Valor do produto (R$)</Label>
                              <Input
                                id="valorProduto"
                                type="number"
                                step="0.01"
                                placeholder="0,00"
                                value={orcamento.valorProduto}
                                onChange={(e) => setOrcamento({ ...orcamento, valorProduto: e.target.value })}
                                className="text-sm"
                              />
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="despesas" className="text-xs">Despesas adicionais (R$)</Label>
                              <Input
                                id="despesas"
                                type="number"
                                step="0.01"
                                placeholder="0,00"
                                value={orcamento.despesasAdicionais}
                                onChange={(e) => setOrcamento({ ...orcamento, despesasAdicionais: e.target.value })}
                                className="text-sm"
                              />
                            </div>
                          </div>

                          <div className="grid grid-cols-2 gap-3">
                            <div className="space-y-2">
                              <Label className="text-xs">Valor total</Label>
                              <div className="h-9 px-3 py-2 bg-muted rounded-md text-sm font-medium flex items-center">
                                {formatCurrency(calcularTotal().toString())}
                              </div>
                            </div>

                            <div className="space-y-2">
                              <Label htmlFor="desconto" className="text-xs">Valor com desconto (R$)</Label>
                              <Input
                                id="desconto"
                                type="number"
                                step="0.01"
                                placeholder="Opcional"
                                value={orcamento.valorDesconto}
                                onChange={(e) => setOrcamento({ ...orcamento, valorDesconto: e.target.value })}
                                className="text-sm"
                              />
                            </div>
                          </div>
                        </div>
                      </Card>

                      {/* Preview da mensagem */}
                      <Card className="p-4 bg-muted/50 border-dashed">
                        <p className="text-xs font-medium text-muted-foreground mb-2">Pré-visualização:</p>
                        <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed">
                          {gerarMensagemOrcamento()}
                        </pre>
                      </Card>

                      {/* Botões de ação */}
                      <div className="flex gap-2">
                        <Button
                          size="sm"
                          className="flex-1"
                          onClick={handleEnviarOrcamento}
                        >
                          <Send className="h-3 w-3 mr-1" />
                          Enviar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleLimparOrcamento}
                        >
                          <Trash2 className="h-3 w-3 mr-1" />
                          Limpar
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={handleVoltarOrcamento}
                        >
                          <ArrowLeft className="h-3 w-3 mr-1" />
                          Voltar
                        </Button>
                      </div>
                    </div>
                  );
                }

                return (
                  <div key={`${nodeId}-${index}`} className="space-y-3">
                    {/* Mensagem do Roteiro */}
                    <Card className="p-4 bg-primary/5 border-primary/20">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm leading-relaxed flex-1">{mensagemPersonalizada}</p>
                        <div className="flex gap-1">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 shrink-0"
                            onClick={() => handleCopyMessage(node.mensagem)}
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </Card>

                    {/* Opções (apenas para o último nó) */}
                    {index === fluxo.length - 1 && node.opcoes && (
                      <div className="flex flex-wrap gap-2 pl-4">
                        {node.opcoes.map((opcao, opIndex) => (
                          <Button
                            key={opIndex}
                            variant="outline"
                            size="sm"
                            onClick={() => handleOpcaoClick(opcao.proximo_no)}
                            className="text-xs"
                          >
                            {opcao.rotulo}
                          </Button>
                        ))}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </div>
      </div>
      {/* Modal de Classificação do Funil */}
      <FunilClassificacaoModal
        open={classificacaoModalOpen}
        onOpenChange={(open) => {
          setClassificacaoModalOpen(open);
          if (!open) {
            setPendingOrcamentoCallback(null);
          }
        }}
        onClassificar={handleClassificacao}
        valorOrcamento={calcularTotal() || undefined}
        produtoServico={orcamento.descricao || undefined}
      />
    </div>
  );
};
