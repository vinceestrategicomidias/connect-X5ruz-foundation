import { useState } from "react";
import { X, Copy, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { toast } from "@/hooks/use-toast";
import { useAtendenteContext } from "@/contexts/AtendenteContext";

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
};

interface RoteirosPanelProps {
  open: boolean;
  onClose: () => void;
}

export const RoteirosPanel = ({ open, onClose }: RoteirosPanelProps) => {
  const [fluxo, setFluxo] = useState<string[]>(["no_inicial"]);
  const { atendenteLogado } = useAtendenteContext();

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
    </div>
  );
};
