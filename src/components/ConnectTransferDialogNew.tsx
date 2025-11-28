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
import { Loader2, Users, Building2, Inbox } from "lucide-react";
import { ScrollArea } from "@/components/ui/scroll-area";

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

  const handleTransferirAtendente = async (atendenteId: string) => {
    await transferir.mutateAsync({
      pacienteId,
      novoAtendenteId: atendenteId,
      conversaId,
    });
    onOpenChange(false);
  };

  const handleTransferirSetor = async (setorId: string) => {
    await transferir.mutateAsync({
      pacienteId,
      novoSetorId: setorId,
      conversaId,
    });
    onOpenChange(false);
  };

  const handleVoltarParaFila = async () => {
    await transferir.mutateAsync({
      pacienteId,
      conversaId,
      voltarParaFila: true,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>Transferir Atendimento</DialogTitle>
          <DialogDescription>
            Escolha para onde transferir {pacienteNome}
          </DialogDescription>
        </DialogHeader>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="atendentes">
              <Users className="h-4 w-4 mr-2" />
              Atendentes
            </TabsTrigger>
            <TabsTrigger value="setores">
              <Building2 className="h-4 w-4 mr-2" />
              Setores
            </TabsTrigger>
            <TabsTrigger value="fila">
              <Inbox className="h-4 w-4 mr-2" />
              Fila
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
                        onClick={() => handleTransferirAtendente(atendente.id)}
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
                        onClick={() => handleTransferirSetor(setor.id)}
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
                Enviar para Fila
              </Button>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};
