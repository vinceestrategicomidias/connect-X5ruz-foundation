import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useSetores } from "@/hooks/useSetores";
import { useAtendentes } from "@/hooks/useAtendentes";
import { useTransferirAtendimento } from "@/hooks/useMutations";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { ConnectAvatar } from "./ConnectAvatar";
import { Loader2, Users, Building2, Inbox, Globe } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";
import { TransferenciaJustificativaDialog } from "./TransferenciaJustificativaDialog";
import { toast } from "sonner";

interface ConnectTransferDialogNewProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pacienteId: string;
  conversaId: string;
  pacienteNome: string;
}

export const ConnectTransferDialogNew = ({
  open,
  onOpenChange,
  pacienteId,
  conversaId,
  pacienteNome,
}: ConnectTransferDialogNewProps) => {
  const { atendenteLogado } = useAtendenteContext();
  const { data: setores, isLoading: loadingSetores } = useSetores();
  const { data: atendentes, isLoading: loadingAtendentes } = useAtendentes(
    atendenteLogado?.setor_id
  );
  const transferir = useTransferirAtendimento();
  const [activeTab, setActiveTab] = useState("atendentes");

  // Estados para justificativa
  const [justificativaOpen, setJustificativaOpen] = useState(false);
  const [destinoSelecionado, setDestinoSelecionado] = useState<{
    tipo: "atendente" | "setor" | "fila" | "fila_geral";
    id?: string;
    nome: string;
  } | null>(null);

  const handleSelecionarAtendente = (atendenteId: string, nome: string) => {
    setDestinoSelecionado({ tipo: "atendente", id: atendenteId, nome });
    setJustificativaOpen(true);
  };

  const handleSelecionarSetor = (setorId: string, nome: string) => {
    setDestinoSelecionado({ tipo: "setor", id: setorId, nome });
    setJustificativaOpen(true);
  };

  const handleVoltarParaFila = () => {
    setDestinoSelecionado({ tipo: "fila", nome: "Fila do Setor" });
    setJustificativaOpen(true);
  };

  const handleTransferirFilaGeral = () => {
    setDestinoSelecionado({ tipo: "fila_geral", nome: "Fila Geral" });
    setJustificativaOpen(true);
  };

  const handleConfirmarTransferencia = async (motivo: string, observacao?: string) => {
    if (!destinoSelecionado) return;

    try {
      if (destinoSelecionado.tipo === "atendente") {
        await transferir.mutateAsync({
          pacienteId,
          novoAtendenteId: destinoSelecionado.id,
          conversaId,
        });
      } else if (destinoSelecionado.tipo === "setor") {
        await transferir.mutateAsync({
          pacienteId,
          novoSetorId: destinoSelecionado.id,
          conversaId,
        });
      } else if (destinoSelecionado.tipo === "fila") {
        await transferir.mutateAsync({
          pacienteId,
          conversaId,
          voltarParaFila: true,
        });
      } else if (destinoSelecionado.tipo === "fila_geral") {
        // Transferir para fila geral (sem setor/atendente)
        await transferir.mutateAsync({
          pacienteId,
          conversaId,
          voltarParaFila: true,
        });
      }

      toast.success(`Transferência realizada. Motivo: ${motivo}`);
      setDestinoSelecionado(null);
      onOpenChange(false);
    } catch (error) {
      toast.error("Erro ao transferir atendimento");
    }
  };

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Transferir Atendimento</DialogTitle>
            <DialogDescription>
              Escolha para onde transferir {pacienteNome}
            </DialogDescription>
          </DialogHeader>

          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="atendentes">
                <Users className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Atendentes</span>
              </TabsTrigger>
              <TabsTrigger value="setores">
                <Building2 className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Setores</span>
              </TabsTrigger>
              <TabsTrigger value="fila">
                <Inbox className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Fila</span>
              </TabsTrigger>
              <TabsTrigger value="geral">
                <Globe className="h-4 w-4 mr-1" />
                <span className="hidden sm:inline">Geral</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="atendentes" className="mt-4">
              <ScrollArea className="h-[300px]">
                {loadingAtendentes ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {atendentes
                      ?.filter((a) => a.id !== atendenteLogado?.id)
                      .map((atendente) => (
                        <Button
                          key={atendente.id}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleSelecionarAtendente(atendente.id, atendente.nome)}
                        >
                          <ConnectAvatar
                            name={atendente.nome}
                            image={atendente.avatar || undefined}
                            size="sm"
                          />
                          <div className="ml-3 text-left">
                            <p className="font-medium">{atendente.nome}</p>
                            <p className="text-xs text-muted-foreground capitalize">
                              {atendente.cargo}
                            </p>
                          </div>
                        </Button>
                      ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="setores" className="mt-4">
              <ScrollArea className="h-[300px]">
                {loadingSetores ? (
                  <div className="flex items-center justify-center py-8">
                    <Loader2 className="h-6 w-6 animate-spin" />
                  </div>
                ) : (
                  <div className="space-y-2">
                    {setores
                      ?.filter((s) => s.id !== atendenteLogado?.setor_id)
                      .map((setor) => (
                        <Button
                          key={setor.id}
                          variant="outline"
                          className="w-full justify-start"
                          onClick={() => handleSelecionarSetor(setor.id, setor.nome)}
                        >
                          <div
                            className="w-4 h-4 rounded-full mr-3"
                            style={{ backgroundColor: setor.cor }}
                          />
                          <div className="text-left">
                            <p className="font-medium">{setor.nome}</p>
                            {setor.descricao && (
                              <p className="text-xs text-muted-foreground">
                                {setor.descricao}
                              </p>
                            )}
                          </div>
                        </Button>
                      ))}
                  </div>
                )}
              </ScrollArea>
            </TabsContent>

            <TabsContent value="fila" className="mt-4">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Inbox className="h-12 w-12 text-muted-foreground" />
                <p className="text-sm text-muted-foreground text-center">
                  Enviar {pacienteNome} de volta para a fila do seu setor
                </p>
                <Button onClick={handleVoltarParaFila} className="w-full">
                  Enviar para Fila do Setor
                </Button>
              </div>
            </TabsContent>

            <TabsContent value="geral" className="mt-4">
              <div className="flex flex-col items-center justify-center py-8 space-y-4">
                <Globe className="h-12 w-12 text-muted-foreground" />
                <div className="text-center space-y-2">
                  <p className="text-sm font-medium">Transferir sem destino definido</p>
                  <p className="text-xs text-muted-foreground">
                    O paciente será movido para a fila geral do sistema, sem setor ou atendente
                    específico.
                  </p>
                </div>
                <Button onClick={handleTransferirFilaGeral} variant="secondary" className="w-full">
                  Transferir para Fila Geral
                </Button>
              </div>
            </TabsContent>
          </Tabs>
        </DialogContent>
      </Dialog>

      {/* Dialog de justificativa */}
      <TransferenciaJustificativaDialog
        open={justificativaOpen}
        onOpenChange={setJustificativaOpen}
        pacienteNome={pacienteNome}
        destinoNome={destinoSelecionado?.nome || ""}
        tipoDestino={destinoSelecionado?.tipo || "fila"}
        onConfirmar={handleConfirmarTransferencia}
      />
    </>
  );
};
