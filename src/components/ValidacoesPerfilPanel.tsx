import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  usePerfilValidacoes,
  useAprovarValidacao,
  useReprovarValidacao,
} from "@/hooks/usePerfilValidacoes";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useAtendentes } from "@/hooks/useAtendentes";
import { Check, X, Clock } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ValidacoesPerfilPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const ValidacoesPerfilPanel = ({
  open,
  onOpenChange,
}: ValidacoesPerfilPanelProps) => {
  const { atendenteLogado } = useAtendenteContext();
  const { data: validacoes, isLoading } = usePerfilValidacoes();
  const { data: atendentes } = useAtendentes();
  const aprovarValidacao = useAprovarValidacao();
  const reprovarValidacao = useReprovarValidacao();

  const [reprovandoId, setReprovandoId] = useState<string | null>(null);
  const [observacao, setObservacao] = useState("");

  const validacoesPendentes = validacoes?.filter((v) => v.status === "pendente") || [];

  const getAtendente = (id: string) => {
    return atendentes?.find((a) => a.id === id);
  };

  const handleAprovar = async (validacaoId: string) => {
    if (!atendenteLogado) return;
    await aprovarValidacao.mutateAsync({
      validacaoId,
      coordenadorId: atendenteLogado.id,
    });
  };

  const handleReprovar = async () => {
    if (!atendenteLogado || !reprovandoId) return;
    await reprovarValidacao.mutateAsync({
      validacaoId: reprovandoId,
      coordenadorId: atendenteLogado.id,
      observacao: observacao || undefined,
    });
    setReprovandoId(null);
    setObservacao("");
  };

  if (isLoading) {
    return null;
  }

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-[#0A2647]">
              Validações de Perfil Pendentes
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            {validacoesPendentes.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <Clock className="h-12 w-12 text-muted-foreground/30 mb-3" />
                <p className="text-sm font-medium text-muted-foreground">
                  Nenhuma validação pendente
                </p>
                <p className="text-xs text-muted-foreground/70 mt-1">
                  Todas as alterações de perfil estão em dia!
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {validacoesPendentes.map((validacao) => {
                  const atendente = getAtendente(validacao.usuario_id);

                  return (
                    <Card key={validacao.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarImage src={atendente?.avatar || ""} />
                          <AvatarFallback>
                            {atendente?.nome
                              .split(" ")
                              .map((n) => n[0])
                              .join("")
                              .toUpperCase()
                              .slice(0, 2)}
                          </AvatarFallback>
                        </Avatar>

                        <div className="flex-1 space-y-3">
                          <div>
                            <div className="flex items-center justify-between">
                              <h4 className="font-semibold text-foreground">
                                {atendente?.nome}
                              </h4>
                              <Badge variant="secondary" className="text-xs">
                                {formatDistanceToNow(
                                  new Date(validacao.data_solicitacao),
                                  { addSuffix: true, locale: ptBR }
                                )}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {(atendente as any)?.email}
                            </p>
                          </div>

                          <div className="space-y-2">
                            {Object.entries(validacao.valores_novos).map(
                              ([campo, valorNovo]) => {
                                const campoLabel =
                                  campo === "nome"
                                    ? "Nome"
                                    : campo === "avatar"
                                    ? "Avatar"
                                    : campo;

                                return (
                                  <div
                                    key={campo}
                                    className="bg-muted/30 rounded-md p-3"
                                  >
                                    <p className="text-xs font-medium text-muted-foreground mb-1">
                                      {campoLabel}
                                    </p>
                                    <div className="flex items-center gap-2 text-sm">
                                      <span className="text-muted-foreground line-through">
                                        {(atendente as any)?.[campo] || "-"}
                                      </span>
                                      <span className="text-muted-foreground">→</span>
                                      <span className="font-medium text-foreground">
                                        {valorNovo as string}
                                      </span>
                                    </div>
                                  </div>
                                );
                              }
                            )}
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-green-600 border-green-600 hover:bg-green-50"
                              onClick={() => handleAprovar(validacao.id)}
                              disabled={aprovarValidacao.isPending}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-red-600 border-red-600 hover:bg-red-50"
                              onClick={() => setReprovandoId(validacao.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reprovar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  );
                })}
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dialog de Reprovar com Observação */}
      <Dialog open={!!reprovandoId} onOpenChange={() => setReprovandoId(null)}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Reprovar Alterações</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <Textarea
              placeholder="Adicione um comentário (opcional)"
              value={observacao}
              onChange={(e) => setObservacao(e.target.value)}
              rows={4}
            />
            <div className="flex gap-3">
              <Button
                variant="outline"
                className="flex-1"
                onClick={() => {
                  setReprovandoId(null);
                  setObservacao("");
                }}
              >
                Cancelar
              </Button>
              <Button
                variant="destructive"
                className="flex-1"
                onClick={handleReprovar}
                disabled={reprovarValidacao.isPending}
              >
                Reprovar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </>
  );
};
