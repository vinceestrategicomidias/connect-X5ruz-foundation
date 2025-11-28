import { useState } from "react";
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
} from "lucide-react";
import { ConnectAvatar } from "./ConnectAvatar";
import { Paciente } from "@/hooks/usePacientes";
import { useDocumentosPaciente } from "@/hooks/useDocumentosPaciente";
import { useNotasPaciente } from "@/hooks/useNotasPaciente";
import { useHistoricoPaciente } from "@/hooks/useHistoricoPaciente";
import { format } from "date-fns";

interface PerfilPacienteSheetProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  paciente: Paciente | null;
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
}: PerfilPacienteSheetProps) => {
  const [activeTab, setActiveTab] = useState("dados");
  const [novaNotaTexto, setNovaNotaTexto] = useState("");
  const [novaNotaTag, setNovaNotaTag] = useState("");

  const { documentos, isLoading: loadingDocs } = useDocumentosPaciente(paciente?.id);
  const { notas, adicionarNota, isLoading: loadingNotas } = useNotasPaciente(paciente?.id);
  const { historico, isLoading: loadingHistorico } = useHistoricoPaciente(paciente?.id);

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

  if (!paciente) return null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="w-full sm:max-w-[420px] p-0">
        <ScrollArea className="h-full">
          <div className="p-6">
            <SheetHeader className="mb-6">
              <div className="flex flex-col items-center gap-3">
                <ConnectAvatar name={paciente.nome} size="lg" />
                <div className="text-center">
                  <SheetTitle className="text-xl">{paciente.nome}</SheetTitle>
                  <div
                    className={`inline-flex items-center gap-2 mt-2 px-3 py-1 rounded-full text-sm ${satisfacao.cor}`}
                    title="Classificação baseada nas últimas interações e notas de satisfação"
                  >
                    <span className="text-lg">{satisfacao.emoji}</span>
                    <span className="font-medium">{satisfacao.nivel}</span>
                  </div>
                </div>
              </div>
            </SheetHeader>

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
                      <p className="text-sm font-medium">{paciente.nome}</p>
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
                <div className="space-y-3">
                  {loadingHistorico ? (
                    <p className="text-sm text-muted-foreground">Carregando...</p>
                  ) : historico.length === 0 ? (
                    <p className="text-sm text-center text-muted-foreground py-4">
                      Nenhum evento registrado
                    </p>
                  ) : (
                    historico.map((evento, index) => (
                      <div key={evento.id} className="flex gap-3">
                        <div className="flex flex-col items-center">
                          <div className="w-2 h-2 rounded-full bg-primary" />
                          {index < historico.length - 1 && (
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
    </Sheet>
  );
};
