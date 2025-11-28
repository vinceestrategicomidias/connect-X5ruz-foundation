import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useAtendentes } from "@/hooks/useAtendentes";
import { useTransferirAtendimento } from "@/hooks/useMutations";
import { ConnectAvatar } from "./ConnectAvatar";
import { Loader2 } from "lucide-react";

interface ConnectTransferDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  pacienteId: string;
  conversaId: string;
  pacienteNome: string;
}

export const ConnectTransferDialog = ({
  open,
  onOpenChange,
  pacienteId,
  conversaId,
  pacienteNome,
}: ConnectTransferDialogProps) => {
  const { data: atendentes, isLoading } = useAtendentes();
  const transferir = useTransferirAtendimento();

  const handleTransferir = async (atendenteId: string) => {
    await transferir.mutateAsync({
      pacienteId,
      novoAtendenteId: atendenteId,
      conversaId,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Transferir Atendimento</DialogTitle>
          <DialogDescription>
            Selecione o atendente para transferir o atendimento de {pacienteNome}
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-2 mt-4">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            atendentes?.map((atendente) => (
              <Button
                key={atendente.id}
                variant="outline"
                className="w-full justify-start"
                onClick={() => handleTransferir(atendente.id)}
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
            ))
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};
