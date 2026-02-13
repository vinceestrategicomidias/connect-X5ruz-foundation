import { useState } from "react";
import { FunilIndicador } from "./FunilIndicador";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import {
  FileText,
  Upload,
  Download,
  Plus,
  Calendar,
  User,
  Phone,
  Mail,
  CreditCard,
  Building,
  Tag,
  Pencil,
  Star,
  MessageSquare,
  CalendarDays,
  ExternalLink,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ConnectAvatar } from "./ConnectAvatar";
import { Paciente } from "@/hooks/usePacientes";
import { useDocumentosPaciente } from "@/hooks/useDocumentosPaciente";
import { useNotasPaciente } from "@/hooks/useNotasPaciente";
import { useHistoricoPaciente } from "@/hooks/useHistoricoPaciente";
import { useEtiquetasPaciente } from "@/hooks/useEtiquetasPaciente";
import { useMensagensFavoritadas } from "@/hooks/useMensagensFavoritadas";
import { useAtualizarNomePaciente } from "@/hooks/useMutations";
import { format } from "date-fns";
import { EditarNomeDialog } from "./EditarNomeDialog";

interface PerfilPacienteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paciente: Paciente | null;
  onNavigateToMessage?: (mensagemId: string, conversaId?: string) => void;
}

const getSatisfacaoIA = (paciente: Paciente | null) => {
  if (!paciente) return { nivel: "Neutro", emoji: "😐", cor: "bg-muted" };
  
  // Simulação simples baseada no status
  const satisfacaoMap: Record<string, { nivel: string; emoji: string; cor: string }> = {
    "em_atendimento": { nivel: "Satisfeito", emoji: "😊", cor: "bg-green-100 text-green-800" },
    "finalizado": { nivel: "Muito satisfeito", emoji: "😄", cor: "bg-green-200 text-green-900" },
    "espera": { nivel: "Neutro", emoji: "😐", cor: "bg-gray-100 text-gray-800" },
  };
  
  return satisfacaoMap[paciente.status] || { nivel: "Neutro", emoji: "😐", cor: "bg-muted" };
};

export const PerfilPacienteSheet = ({
  open,
  onOpenChange,
  paciente,
  onNavigateToMessage,
}: PerfilPacienteSheetProps) => {
  const [activeTab, setActiveTab] = useState("dados");
  const [novaNotaTexto, setNovaNotaTexto] = useState("");
  const [novaNotaTag, setNovaNotaTag] = useState("");
  const [editarNomeOpen, setEditarNomeOpen] = useState(false);
  const [filtroDataInicio, setFiltroDataInicio] = useState<Date | undefined>(undefined);
  const [filtroDataFim, setFiltroDataFim] = useState<Date | undefined>(undefined);
  const [filtroCalendarioOpen, setFiltroCalendarioOpen] = useState(false);

  const { documentos, isLoading: loadingDocs } = useDocumentosPaciente(paciente?.id);
  const { notas, adicionarNota, isLoading: loadingNotas } = useNotasPaciente(paciente?.id);
  const { historico, isLoading: loadingHistorico } = useHistoricoPaciente(paciente?.id, paciente?.nome);
  const { etiquetas, historicoEtiquetas } = useEtiquetasPaciente(paciente?.id, paciente?.nome);
  const { mensagensFavoritadas } = useMensagensFavoritadas(paciente?.id, paciente?.nome);
  const atualizarNome = useAtualizarNomePaciente();

  const satisfacao = getSatisfacaoIA(paciente);

  const handleAdicionarNota = () => {
    if (!paciente || !novaNotaTexto.trim()) return;
    
    adicionarNota({
      paciente_id: paciente.id,
      texto: novaNotaTexto,
      tag: novaNotaTag || undefined,
    });
    
    setNovaNotaTexto("");
    setNovaNotaTag("");
  };

  const handleSalvarNome = async (novoNome: string) => {
    if (!paciente) return;
    
    await atualizarNome.mutateAsync({
      pacienteId: paciente.id,
      novoNome,
    });
  };

  if (!paciente) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[420px] p-0" side="right">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <div className="flex flex-col items-center gap-3">
                <ConnectAvatar name={paciente.nome} size="lg" />
                <div className="text-center">
                  <SheetTitle className="text-xl">Ver Perfil</SheetTitle>
                  <p className="text-sm text-muted-foreground mt-1">{paciente.nome}</p>
                  
                  {/* Badges de sentimento e etiquetas */}
                  <div className="flex flex-wrap items-center justify-center gap-2 mt-3">
                    <div
                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs ${satisfacao.cor}`}
                      title="Classificação baseada nas últimas interações"
                    >
                      <span>{satisfacao.emoji}</span>
                      <span className="font-medium">{satisfacao.nivel}</span>
                    </div>
                    
                    {/* Etiquetas do paciente */}
                    {etiquetas.slice(0, 2).map((etiqueta) => (
                      <Badge
                        key={etiqueta.id}
                        style={{
                          backgroundColor: `${etiqueta.cor}20`,
                          color: etiqueta.cor,
                          borderColor: etiqueta.cor,
                        }}
                        className="border text-xs"
                      >
                        <Tag className="h-2.5 w-2.5 mr-1" />
                        {etiqueta.nome}
                      </Badge>
                    ))}
                    {etiquetas.length > 2 && (
                      <Badge variant="secondary" className="text-xs">
                        +{etiquetas.length - 2}
                      </Badge>
                    )}
                  </div>
                </div>
              </div>
            </SheetHeader>

            {/* Funil de Vendas */}
            <div className="mb-4 flex justify-center">
              <FunilIndicador pacienteId={paciente.id} />
            </div>

            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-4">
                <TabsTrigger value="dados">Dados</TabsTrigger>
                <TabsTrigger value="documentos">Docs</TabsTrigger>
                <TabsTrigger value="notas">Notas</TabsTrigger>
                <TabsTrigger value="historico">Histórico</TabsTrigger>
              </TabsList>

              {/* ABA DADOS */}
              <TabsContent value="dados" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="flex items-start gap-3">
                    <User className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Nome</Label>
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-medium flex-1">{paciente.nome}</p>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-7 w-7"
                          onClick={() => setEditarNomeOpen(true)}
                          title="Editar nome"
                        >
                          <Pencil className="h-3.5 w-3.5" />
                        </Button>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Phone className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Telefone</Label>
                      <p className="text-sm font-medium">{paciente.telefone}</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Mail className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Email</Label>
                      <p className="text-sm font-medium text-muted-foreground">
                        Não cadastrado
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <CreditCard className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Convênio</Label>
                      <p className="text-sm font-medium">Particular</p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Building className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">Setor atual</Label>
                      <p className="text-sm font-medium">
                        {paciente.setor_id || "Não definido"}
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start gap-3">
                    <Calendar className="h-4 w-4 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <Label className="text-xs text-muted-foreground">
                        Primeiro contato
                      </Label>
                      <p className="text-sm font-medium">
                        {format(new Date(paciente.created_at || new Date()), "dd/MM/yyyy")}
                      </p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* ABA DOCUMENTOS */}
              <TabsContent value="documentos" className="space-y-4 mt-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-sm font-medium">Documentos anexados</h3>
                  <Button size="sm" variant="outline">
                    <Upload className="h-3 w-3 mr-1" />
                    Upload
                  </Button>
                </div>

                {loadingDocs ? (
                  <p className="text-sm text-muted-foreground">Carregando...</p>
                ) : documentos.length === 0 ? (
                  <div className="text-center py-8 text-muted-foreground">
                    <FileText className="h-12 w-12 mx-auto mb-2 opacity-20" />
                    <p className="text-sm">Nenhum documento anexado</p>
                  </div>
                ) : (
                  <div className="space-y-2">
                    {documentos.map((doc) => (
                      <div
                        key={doc.id}
                        className="flex items-center gap-3 p-3 border rounded-lg hover:bg-muted/50"
                      >
                        <FileText className="h-4 w-4 text-primary" />
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-medium truncate">{doc.nome}</p>
                          <p className="text-xs text-muted-foreground">
                            {format(new Date(doc.data_envio), "dd/MM/yyyy")} • {doc.enviado_por}
                          </p>
                        </div>
                        <Button size="sm" variant="ghost">
                          <Download className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>
                )}
              </TabsContent>

              {/* ABA NOTAS */}
              <TabsContent value="notas" className="space-y-4 mt-4">
                <div className="space-y-3">
                  <div className="space-y-2">
                    <Label htmlFor="nota-texto">Nova nota interna</Label>
                    <Textarea
                      id="nota-texto"
                      placeholder="Digite sua observação sobre o paciente..."
                      value={novaNotaTexto}
                      onChange={(e) => setNovaNotaTexto(e.target.value)}
                      rows={3}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="nota-tag">Tag (opcional)</Label>
                    <Input
                      id="nota-tag"
                      placeholder="Ex: financeiro, convênio, comportamento"
                      value={novaNotaTag}
                      onChange={(e) => setNovaNotaTag(e.target.value)}
                    />
                  </div>
                  <Button onClick={handleAdicionarNota} className="w-full">
                    <Plus className="h-4 w-4 mr-2" />
                    Adicionar nota
                  </Button>
                </div>

                <div className="space-y-2">
                  {loadingNotas ? (
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                  ) : notas.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-4">
                      Nenhuma nota registrada
                    </p>
                  ) : (
                    notas.map((nota) => (
                      <div
                        key={nota.id}
                        className="p-3 border rounded-lg space-y-2"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <p className="text-sm">{nota.texto}</p>
                          {nota.tag && (
                            <Badge variant="secondary" className="shrink-0">
                              <Tag className="h-3 w-3 mr-1" />
                              {nota.tag}
                            </Badge>
                          )}
                        </div>
                        <p className="text-xs text-muted-foreground">
                          {format(new Date(nota.created_at), "dd/MM/yyyy HH:mm")} •{" "}
                          {nota.usuario_nome}
                        </p>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>

              {/* ABA HISTÓRICO */}
              <TabsContent value="historico" className="space-y-4 mt-4">
                {/* Mensagens Favoritadas */}
                {mensagensFavoritadas.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-amber-600">
                      <Star className="h-4 w-4" />
                      Mensagens Favoritadas
                    </h4>
                    <div className="space-y-2">
                      {mensagensFavoritadas.map((msg) => (
                        <div 
                          key={msg.id} 
                          className="p-3 rounded-lg bg-amber-50 border border-amber-200 cursor-pointer hover:bg-amber-100 transition-colors"
                          onClick={() => {
                            if (onNavigateToMessage && msg.id) {
                              onNavigateToMessage(msg.id);
                              onOpenChange(false);
                            }
                          }}
                          title="Clique para ir até esta mensagem na conversa"
                        >
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-3.5 w-3.5 text-amber-600 mt-0.5 flex-shrink-0" />
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-amber-900 line-clamp-2">
                                "{msg.texto}"
                              </p>
                              {msg.nota && (
                                <p className="text-xs text-amber-700 mt-1 italic">
                                  📝 {msg.nota}
                                </p>
                              )}
                              <p className="text-xs text-amber-600/70 mt-1">
                                {format(new Date(msg.dataFavorito), "dd/MM/yyyy HH:mm")} • {msg.favoritadoPor}
                              </p>
                            </div>
                            {onNavigateToMessage && (
                              <ExternalLink className="h-3.5 w-3.5 text-amber-500 mt-0.5 flex-shrink-0" />
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Notas dos Atendentes */}
                {notas.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-blue-600">
                      <FileText className="h-4 w-4" />
                      Notas dos Atendentes
                    </h4>
                    <div className="space-y-2">
                      {notas.map((nota) => (
                        <div
                          key={nota.id}
                          className="p-3 rounded-lg bg-blue-50 border border-blue-200"
                        >
                          <div className="flex items-start gap-2">
                            <div className="flex-1 min-w-0">
                              <p className="text-sm text-blue-900">{nota.texto}</p>
                              {nota.tag && (
                                <Badge variant="secondary" className="mt-1 text-xs">
                                  <Tag className="h-2.5 w-2.5 mr-1" />
                                  {nota.tag}
                                </Badge>
                              )}
                              <p className="text-xs text-blue-600/70 mt-1">
                                {format(new Date(nota.created_at), "dd/MM/yyyy HH:mm")} • {nota.usuario_nome} • {nota.setor}
                              </p>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Histórico de Etiquetas */}
                {historicoEtiquetas.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-semibold flex items-center gap-2 text-purple-600">
                      <Tag className="h-4 w-4" />
                      Histórico de Etiquetas
                    </h4>
                    <div className="space-y-2">
                      {historicoEtiquetas.map((item) => (
                        <div 
                          key={item.id} 
                          className="flex items-center gap-3 p-2 rounded-lg bg-muted/50"
                        >
                          <div 
                            className="w-3 h-3 rounded-full flex-shrink-0"
                            style={{ backgroundColor: item.etiqueta.cor }}
                          />
                          <div className="flex-1 min-w-0">
                            <p className="text-sm">
                              Recebeu etiqueta <span className="font-medium">{item.etiqueta.nome}</span>
                            </p>
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(item.dataAtribuicao), "dd/MM/yyyy HH:mm")} • {item.atribuidoPor}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Eventos do histórico */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <h4 className="text-sm font-semibold flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Linha do Tempo
                    </h4>
                    <Popover open={filtroCalendarioOpen} onOpenChange={setFiltroCalendarioOpen}>
                      <PopoverTrigger asChild>
                        <Button variant="outline" size="sm" className="h-8 gap-1.5">
                          <CalendarDays className="h-3.5 w-3.5" />
                          {filtroDataInicio || filtroDataFim ? (
                            <span className="text-xs">
                              {filtroDataInicio ? format(filtroDataInicio, "dd/MM") : "..."} - {filtroDataFim ? format(filtroDataFim, "dd/MM") : "..."}
                            </span>
                          ) : (
                            <span className="text-xs">Filtrar período</span>
                          )}
                        </Button>
                      </PopoverTrigger>
                      <PopoverContent className="w-auto p-3" align="end">
                        <div className="space-y-3">
                          <div className="text-sm font-medium">Selecione o período</div>
                          <div className="flex gap-2">
                            <div className="space-y-1">
                              <Label className="text-xs">Data inicial</Label>
                              <CalendarComponent
                                mode="single"
                                selected={filtroDataInicio}
                                onSelect={setFiltroDataInicio}
                                className={cn("rounded-md border pointer-events-auto")}
                              />
                            </div>
                            <div className="space-y-1">
                              <Label className="text-xs">Data final</Label>
                              <CalendarComponent
                                mode="single"
                                selected={filtroDataFim}
                                onSelect={setFiltroDataFim}
                                className={cn("rounded-md border pointer-events-auto")}
                              />
                            </div>
                          </div>
                          <div className="flex justify-between gap-2">
                            <Button 
                              variant="ghost" 
                              size="sm"
                              onClick={() => {
                                setFiltroDataInicio(undefined);
                                setFiltroDataFim(undefined);
                              }}
                            >
                              Limpar
                            </Button>
                            <Button 
                              size="sm"
                              onClick={() => setFiltroCalendarioOpen(false)}
                            >
                              Aplicar
                            </Button>
                          </div>
                        </div>
                      </PopoverContent>
                    </Popover>
                  </div>
                  {loadingHistorico ? (
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                  ) : historico.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-4">
                      Nenhum evento registrado
                    </p>
                  ) : (
                    historico
                      .filter((evento) => {
                        const eventoDate = new Date(evento.data_hora);
                        if (filtroDataInicio && eventoDate < filtroDataInicio) return false;
                        if (filtroDataFim) {
                          const fimDoDia = new Date(filtroDataFim);
                          fimDoDia.setHours(23, 59, 59, 999);
                          if (eventoDate > fimDoDia) return false;
                        }
                        return true;
                      })
                      .map((evento, index, arr) => (
                      <div key={evento.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          {index < arr.length - 1 && (
                            <div className="w-px flex-1 bg-border mt-1" />
                          )}
                        </div>
                        <div className="flex-1 pb-4">
                          <p className="text-sm font-medium">{evento.titulo}</p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {evento.descricao}
                          </p>
                          <p className="text-xs text-muted-foreground mt-1">
                            {format(new Date(evento.data_hora), "dd/MM/yyyy HH:mm")}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </ScrollArea>
      </SheetContent>

      {/* Dialog para editar nome */}
      <EditarNomeDialog
        open={editarNomeOpen}
        onOpenChange={setEditarNomeOpen}
        nomeAtual={paciente.nome}
        onSalvar={handleSalvarNome}
      />
    </Sheet>
  );
};
