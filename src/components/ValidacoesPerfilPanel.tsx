import { useState, useMemo } from "react";
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
import { Check, X, Clock, Key, UserCircle } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { ptBR } from "date-fns/locale";

interface ValidacoesPerfilPanelProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// Exemplos de validações simuladas para demonstração
const validacoesExemplo = [
  {
    id: "exemplo-1",
    usuario_id: "exemplo-emilly",
    usuario_nome: "Emilly Santos",
    usuario_email: "emilly.santos@grupoliruz.com",
    usuario_setor: "Pré-venda",
    tipo: "senha",
    campos_alterados: ["senha"],
    valores_novos: { senha: "••••••••" },
    detalhe: "Solicitou redefinição de senha de acesso",
    data_solicitacao: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(), // 2h atrás
    status: "pendente",
  },
  {
    id: "exemplo-2",
    usuario_id: "exemplo-paloma",
    usuario_nome: "Paloma Ribeiro",
    usuario_email: "paloma.r@grupoliruz.com",
    usuario_setor: "Venda",
    tipo: "nome_usuario",
    campos_alterados: ["nome_usuario"],
    valores_novos: { nome_usuario: "paloma.ribeiro" },
    valor_antigo: "paloma.r",
    detalhe: "De 'paloma.r' para 'paloma.ribeiro'",
    data_solicitacao: new Date(Date.now() - 45 * 60 * 1000).toISOString(), // 45min atrás
    status: "pendente",
  },
  {
    id: "exemplo-3",
    usuario_id: "exemplo-geovanna",
    usuario_nome: "Geovanna Costa",
    usuario_email: "geovanna.costa@grupoliruz.com",
    usuario_setor: "Venda",
    tipo: "senha",
    campos_alterados: ["senha"],
    valores_novos: { senha: "••••••••" },
    detalhe: "Solicitou redefinição de senha de acesso",
    data_solicitacao: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(), // 1 dia atrás
    status: "aprovado",
  },
  {
    id: "exemplo-4",
    usuario_id: "exemplo-ricardo",
    usuario_nome: "Ricardo Almeida",
    usuario_email: "ricardo.a@grupoliruz.com",
    usuario_setor: "Comercial Connect",
    tipo: "nome_usuario",
    campos_alterados: ["nome_usuario"],
    valores_novos: { nome_usuario: "ricardo.almeida" },
    valor_antigo: "ricardo.a",
    detalhe: "De 'ricardo.a' para 'ricardo.almeida'",
    data_solicitacao: new Date(Date.now() - 30 * 60 * 1000).toISOString(), // 30min atrás
    status: "pendente",
  },
];

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
  const [exemplosStatus, setExemplosStatus] = useState<Record<string, string>>({});

  // Combinar validações reais com exemplos simulados
  const todasValidacoes = useMemo(() => {
    const validacoesReais = validacoes?.filter((v) => v.status === "pendente") || [];
    const exemplosFiltrados = validacoesExemplo.map(ex => ({
      ...ex,
      status: exemplosStatus[ex.id] || ex.status,
    }));
    return {
      reais: validacoesReais,
      exemplos: exemplosFiltrados,
    };
  }, [validacoes, exemplosStatus]);

  const getAtendente = (id: string) => {
    return atendentes?.find((a) => a.id === id);
  };

  const handleAprovar = async (validacaoId: string) => {
    if (!atendenteLogado) return;
    
    // Verificar se é um exemplo
    if (validacaoId.startsWith("exemplo-")) {
      setExemplosStatus(prev => ({ ...prev, [validacaoId]: "aprovado" }));
      return;
    }
    
    await aprovarValidacao.mutateAsync({
      validacaoId,
      coordenadorId: atendenteLogado.id,
    });
  };

  const handleReprovar = async () => {
    if (!atendenteLogado || !reprovandoId) return;
    
    // Verificar se é um exemplo
    if (reprovandoId.startsWith("exemplo-")) {
      setExemplosStatus(prev => ({ ...prev, [reprovandoId]: "reprovado" }));
      setReprovandoId(null);
      setObservacao("");
      return;
    }
    
    await reprovarValidacao.mutateAsync({
      validacaoId: reprovandoId,
      coordenadorId: atendenteLogado.id,
      observacao: observacao || undefined,
    });
    setReprovandoId(null);
    setObservacao("");
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "aprovado":
        return <Badge className="bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400">Aprovado</Badge>;
      case "reprovado":
        return <Badge className="bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400">Reprovado</Badge>;
      default:
        return <Badge variant="secondary">Pendente</Badge>;
    }
  };

  const getTipoIcon = (tipo: string) => {
    return tipo === "senha" ? <Key className="h-4 w-4" /> : <UserCircle className="h-4 w-4" />;
  };

  const getTipoLabel = (tipo: string) => {
    return tipo === "senha" ? "Alteração de senha" : "Alteração de nome de usuário";
  };

  if (isLoading) {
    return null;
  }

  const exemplosPendentes = todasValidacoes.exemplos.filter(e => e.status === "pendente");
  const exemplosResolvidos = todasValidacoes.exemplos.filter(e => e.status !== "pendente");

  return (
    <>
      <Dialog open={open} onOpenChange={onOpenChange}>
        <DialogContent className="max-w-3xl h-[80vh]">
          <DialogHeader>
            <DialogTitle className="text-foreground">
              Painel de Validação
            </DialogTitle>
          </DialogHeader>

          <ScrollArea className="flex-1 pr-4">
            {/* Validações Pendentes */}
            <div className="space-y-4">
              <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider">
                Pendentes ({todasValidacoes.reais.length + exemplosPendentes.length})
              </h3>

              {todasValidacoes.reais.length === 0 && exemplosPendentes.length === 0 ? (
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
                  {/* Validações reais */}
                  {todasValidacoes.reais.map((validacao) => {
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

                  {/* Exemplos simulados - pendentes */}
                  {exemplosPendentes.map((exemplo) => (
                    <Card key={exemplo.id} className="p-4">
                      <div className="flex items-start gap-4">
                        <Avatar className="h-12 w-12">
                          <AvatarFallback>
                            {exemplo.usuario_nome
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
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">
                                  {exemplo.usuario_nome}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {exemplo.usuario_setor}
                                </Badge>
                              </div>
                              <Badge variant="secondary" className="text-xs">
                                {formatDistanceToNow(
                                  new Date(exemplo.data_solicitacao),
                                  { addSuffix: true, locale: ptBR }
                                )}
                              </Badge>
                            </div>
                            <p className="text-xs text-muted-foreground mt-0.5">
                              {exemplo.usuario_email}
                            </p>
                          </div>

                          <div className="bg-muted/30 rounded-md p-3">
                            <div className="flex items-center gap-2 mb-1">
                              {getTipoIcon(exemplo.tipo)}
                              <p className="text-xs font-medium text-muted-foreground">
                                {getTipoLabel(exemplo.tipo)}
                              </p>
                            </div>
                            <p className="text-sm text-foreground">
                              {exemplo.detalhe}
                            </p>
                          </div>

                          <div className="flex gap-2">
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-green-600 border-green-600 hover:bg-green-50 dark:hover:bg-green-900/20"
                              onClick={() => handleAprovar(exemplo.id)}
                            >
                              <Check className="h-4 w-4 mr-1" />
                              Aprovar
                            </Button>
                            <Button
                              size="sm"
                              variant="outline"
                              className="flex-1 text-red-600 border-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                              onClick={() => setReprovandoId(exemplo.id)}
                            >
                              <X className="h-4 w-4 mr-1" />
                              Reprovar
                            </Button>
                          </div>
                        </div>
                      </div>
                    </Card>
                  ))}
                </div>
              )}

              {/* Validações Resolvidas (exemplos) */}
              {exemplosResolvidos.length > 0 && (
                <>
                  <h3 className="font-semibold text-sm text-muted-foreground uppercase tracking-wider mt-8">
                    Resolvidas Recentemente ({exemplosResolvidos.length})
                  </h3>
                  <div className="space-y-4">
                    {exemplosResolvidos.map((exemplo) => (
                      <Card key={exemplo.id} className="p-4 opacity-70">
                        <div className="flex items-start gap-4">
                          <Avatar className="h-12 w-12">
                            <AvatarFallback>
                              {exemplo.usuario_nome
                                .split(" ")
                                .map((n) => n[0])
                                .join("")
                                .toUpperCase()
                                .slice(0, 2)}
                            </AvatarFallback>
                          </Avatar>

                          <div className="flex-1 space-y-2">
                            <div className="flex items-center justify-between">
                              <div className="flex items-center gap-2">
                                <h4 className="font-semibold text-foreground">
                                  {exemplo.usuario_nome}
                                </h4>
                                <Badge variant="outline" className="text-xs">
                                  {exemplo.usuario_setor}
                                </Badge>
                              </div>
                              {getStatusBadge(exemplo.status)}
                            </div>
                            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                              {getTipoIcon(exemplo.tipo)}
                              <span>{exemplo.detalhe}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                </>
              )}
            </div>
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
