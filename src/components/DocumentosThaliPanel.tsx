import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  FileText,
  Upload,
  Plus,
  Eye,
  Download,
  Pencil,
  ToggleLeft,
  ToggleRight,
  Info,
  Image,
  FileType,
  Calendar,
  User,
  X,
} from "lucide-react";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface DocumentoThali {
  id: string;
  nome: string;
  tipo: string;
  visibilidade: string;
  arquivo_url: string;
  arquivo_tipo: "pdf" | "image";
  observacao?: string;
  data_upload: Date;
  enviado_por: string;
  ativo: boolean;
}

const tiposDocumento = [
  "Padrão de atendimento",
  "Planilha de valores",
  "Código de ética",
  "Políticas internas",
  "Outros",
];

const visibilidadeOpcoes = [
  { value: "somente_gestao", label: "Somente gestão" },
  { value: "gestao_coordenacao", label: "Gestão e coordenação" },
  { value: "todos", label: "Todos (somente leitura)" },
];

// Documentos de exemplo
const documentosExemplo: DocumentoThali[] = [
  {
    id: "doc-1",
    nome: "Manual de Atendimento Connect",
    tipo: "Padrão de atendimento",
    visibilidade: "todos",
    arquivo_url: "/placeholder.svg",
    arquivo_tipo: "pdf",
    observacao: "Documento base para todos os atendentes seguirem o padrão de atendimento.",
    data_upload: new Date("2025-01-10"),
    enviado_por: "Admin Sistema",
    ativo: true,
  },
  {
    id: "doc-2",
    nome: "Tabela de Preços 2025",
    tipo: "Planilha de valores",
    visibilidade: "gestao_coordenacao",
    arquivo_url: "/placeholder.svg",
    arquivo_tipo: "image",
    observacao: "Valores atualizados para o ano de 2025.",
    data_upload: new Date("2025-01-15"),
    enviado_por: "Gestor Comercial",
    ativo: true,
  },
  {
    id: "doc-3",
    nome: "Código de Ética Grupo Liruz",
    tipo: "Código de ética",
    visibilidade: "todos",
    arquivo_url: "/placeholder.svg",
    arquivo_tipo: "image",
    observacao: "Normas de conduta para todos os colaboradores.",
    data_upload: new Date("2025-01-08"),
    enviado_por: "RH",
    ativo: true,
  },
];

export const DocumentosThaliPanel = () => {
  const [documentos, setDocumentos] = useState<DocumentoThali[]>(documentosExemplo);
  const [adicionarOpen, setAdicionarOpen] = useState(false);
  const [editarDoc, setEditarDoc] = useState<DocumentoThali | null>(null);
  const [visualizarDoc, setVisualizarDoc] = useState<DocumentoThali | null>(null);

  const [novoDocumento, setNovoDocumento] = useState({
    nome: "",
    tipo: "",
    visibilidade: "",
    observacao: "",
    arquivo: null as File | null,
  });

  const handleAdicionarDocumento = () => {
    if (!novoDocumento.nome || !novoDocumento.tipo || !novoDocumento.visibilidade) {
      return;
    }

    const doc: DocumentoThali = {
      id: `doc-${Date.now()}`,
      nome: novoDocumento.nome,
      tipo: novoDocumento.tipo,
      visibilidade: novoDocumento.visibilidade,
      arquivo_url: "/placeholder.svg",
      arquivo_tipo: novoDocumento.arquivo?.type.includes("pdf") ? "pdf" : "image",
      observacao: novoDocumento.observacao,
      data_upload: new Date(),
      enviado_por: "Usuário Atual",
      ativo: true,
    };

    setDocumentos([doc, ...documentos]);
    setAdicionarOpen(false);
    setNovoDocumento({ nome: "", tipo: "", visibilidade: "", observacao: "", arquivo: null });
  };

  const toggleAtivo = (id: string) => {
    setDocumentos(
      documentos.map((doc) =>
        doc.id === id ? { ...doc, ativo: !doc.ativo } : doc
      )
    );
  };

  const getVisibilidadeLabel = (value: string) => {
    return visibilidadeOpcoes.find((v) => v.value === value)?.label || value;
  };

  return (
    <div className="space-y-6">
      {/* Aviso Informativo */}
      <Alert className="border-primary/30 bg-primary/5">
        <Info className="h-4 w-4 text-primary" />
        <AlertDescription className="text-sm">
          <strong>Documentos base para configuração da Thalí:</strong> Esta função permite ao gestor 
          adicionar documentos (ex.: padrão de atendimento, planilha de valores, código de ética) 
          que serão utilizados como referência para a configuração e respostas da Thalí.
        </AlertDescription>
      </Alert>

      {/* Header com botão de adicionar */}
      <div className="flex items-center justify-between">
        <div>
          <h4 className="font-semibold">Documentos Base para IA</h4>
          <p className="text-sm text-muted-foreground">
            Upload de documentos que servirão como base de conhecimento e padronização do atendimento.
          </p>
        </div>
        <Button onClick={() => setAdicionarOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Adicionar documento
        </Button>
      </div>

      {/* Lista de Documentos */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base">Documentos Cadastrados</CardTitle>
        </CardHeader>
        <CardContent>
          <ScrollArea className="h-[400px]">
            <div className="space-y-3">
              {documentos.map((doc) => (
                <div
                  key={doc.id}
                  className={`p-4 border rounded-lg space-y-3 transition-opacity ${
                    !doc.ativo ? "opacity-50 bg-muted/30" : ""
                  }`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {doc.arquivo_tipo === "pdf" ? (
                        <div className="h-10 w-10 rounded-lg bg-red-100 dark:bg-red-900/30 flex items-center justify-center">
                          <FileType className="h-5 w-5 text-red-600 dark:text-red-400" />
                        </div>
                      ) : (
                        <div className="h-10 w-10 rounded-lg bg-blue-100 dark:bg-blue-900/30 flex items-center justify-center">
                          <Image className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                        </div>
                      )}
                      <div>
                        <h5 className="font-medium">{doc.nome}</h5>
                        <div className="flex items-center gap-2 text-xs text-muted-foreground">
                          <Badge variant="outline" className="text-xs">
                            {doc.tipo}
                          </Badge>
                          <span>•</span>
                          <span>{getVisibilidadeLabel(doc.visibilidade)}</span>
                        </div>
                      </div>
                    </div>
                    <Badge variant={doc.ativo ? "default" : "secondary"}>
                      {doc.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>

                  {doc.observacao && (
                    <p className="text-sm text-muted-foreground pl-13">{doc.observacao}</p>
                  )}

                  <div className="flex items-center justify-between pt-2 border-t">
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {format(doc.data_upload, "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                      <span className="flex items-center gap-1">
                        <User className="h-3 w-3" />
                        {doc.enviado_por}
                      </span>
                    </div>
                    <div className="flex items-center gap-1">
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setVisualizarDoc(doc)}
                      >
                        <Eye className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <Download className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => setEditarDoc(doc)}
                      >
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-8 w-8"
                        onClick={() => toggleAtivo(doc.id)}
                      >
                        {doc.ativo ? (
                          <ToggleRight className="h-4 w-4 text-green-600" />
                        ) : (
                          <ToggleLeft className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>

      {/* Dialog Adicionar Documento */}
      <Dialog open={adicionarOpen} onOpenChange={setAdicionarOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Adicionar Documento
            </DialogTitle>
            <DialogDescription>
              Adicione um documento para servir como base de conhecimento da Thalí.
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="doc-nome">Nome do documento *</Label>
              <Input
                id="doc-nome"
                value={novoDocumento.nome}
                onChange={(e) => setNovoDocumento({ ...novoDocumento, nome: e.target.value })}
                placeholder="Ex.: Manual de Atendimento"
              />
            </div>

            <div className="space-y-2">
              <Label>Tipo de documento *</Label>
              <Select
                value={novoDocumento.tipo}
                onValueChange={(value) => setNovoDocumento({ ...novoDocumento, tipo: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecione o tipo" />
                </SelectTrigger>
                <SelectContent>
                  {tiposDocumento.map((tipo) => (
                    <SelectItem key={tipo} value={tipo}>
                      {tipo}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Visibilidade *</Label>
              <Select
                value={novoDocumento.visibilidade}
                onValueChange={(value) => setNovoDocumento({ ...novoDocumento, visibilidade: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Quem pode visualizar" />
                </SelectTrigger>
                <SelectContent>
                  {visibilidadeOpcoes.map((opt) => (
                    <SelectItem key={opt.value} value={opt.value}>
                      {opt.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Arquivo *</Label>
              <div className="border-2 border-dashed rounded-lg p-6 text-center hover:border-primary/50 transition-colors cursor-pointer">
                <input
                  type="file"
                  accept=".pdf,.png,.jpg,.jpeg"
                  className="hidden"
                  id="file-upload"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) {
                      setNovoDocumento({ ...novoDocumento, arquivo: file });
                    }
                  }}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  {novoDocumento.arquivo ? (
                    <div className="flex items-center justify-center gap-2">
                      <FileText className="h-5 w-5 text-primary" />
                      <span className="text-sm font-medium">{novoDocumento.arquivo.name}</span>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="h-6 w-6"
                        onClick={(e) => {
                          e.preventDefault();
                          setNovoDocumento({ ...novoDocumento, arquivo: null });
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  ) : (
                    <>
                      <Upload className="h-8 w-8 mx-auto text-muted-foreground mb-2" />
                      <p className="text-sm text-muted-foreground">
                        Clique para selecionar ou arraste o arquivo
                      </p>
                      <p className="text-xs text-muted-foreground mt-1">
                        Formatos aceitos: PDF, PNG, JPG, JPEG
                      </p>
                    </>
                  )}
                </label>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="doc-obs">Observação (opcional)</Label>
              <Textarea
                id="doc-obs"
                value={novoDocumento.observacao}
                onChange={(e) => setNovoDocumento({ ...novoDocumento, observacao: e.target.value })}
                placeholder="Descreva o propósito deste documento..."
                rows={2}
              />
            </div>

            <Separator />

            <div className="flex gap-3">
              <Button variant="outline" className="flex-1" onClick={() => setAdicionarOpen(false)}>
                Cancelar
              </Button>
              <Button className="flex-1" onClick={handleAdicionarDocumento}>
                <Plus className="h-4 w-4 mr-2" />
                Adicionar
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Dialog Visualizar */}
      <Dialog open={!!visualizarDoc} onOpenChange={() => setVisualizarDoc(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>{visualizarDoc?.nome}</DialogTitle>
            <DialogDescription>Detalhes do documento</DialogDescription>
          </DialogHeader>
          {visualizarDoc && (
            <div className="space-y-4">
              <div className="aspect-video bg-muted rounded-lg flex items-center justify-center">
                {visualizarDoc.arquivo_tipo === "pdf" ? (
                  <FileType className="h-16 w-16 text-red-500" />
                ) : (
                  <Image className="h-16 w-16 text-blue-500" />
                )}
              </div>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-muted-foreground">Tipo:</span>
                  <p className="font-medium">{visualizarDoc.tipo}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Visibilidade:</span>
                  <p className="font-medium">{getVisibilidadeLabel(visualizarDoc.visibilidade)}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Enviado por:</span>
                  <p className="font-medium">{visualizarDoc.enviado_por}</p>
                </div>
                <div>
                  <span className="text-muted-foreground">Data:</span>
                  <p className="font-medium">
                    {format(visualizarDoc.data_upload, "dd/MM/yyyy", { locale: ptBR })}
                  </p>
                </div>
              </div>
              {visualizarDoc.observacao && (
                <div>
                  <span className="text-sm text-muted-foreground">Observação:</span>
                  <p className="text-sm">{visualizarDoc.observacao}</p>
                </div>
              )}
              <Button className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Baixar documento
              </Button>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Dialog Editar */}
      <Dialog open={!!editarDoc} onOpenChange={() => setEditarDoc(null)}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Editar Documento</DialogTitle>
            <DialogDescription>Altere os metadados do documento</DialogDescription>
          </DialogHeader>
          {editarDoc && (
            <div className="space-y-4">
              <div className="space-y-2">
                <Label>Nome do documento</Label>
                <Input
                  value={editarDoc.nome}
                  onChange={(e) => setEditarDoc({ ...editarDoc, nome: e.target.value })}
                />
              </div>
              <div className="space-y-2">
                <Label>Tipo</Label>
                <Select
                  value={editarDoc.tipo}
                  onValueChange={(value) => setEditarDoc({ ...editarDoc, tipo: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {tiposDocumento.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Visibilidade</Label>
                <Select
                  value={editarDoc.visibilidade}
                  onValueChange={(value) => setEditarDoc({ ...editarDoc, visibilidade: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {visibilidadeOpcoes.map((opt) => (
                      <SelectItem key={opt.value} value={opt.value}>
                        {opt.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-2">
                <Label>Observação</Label>
                <Textarea
                  value={editarDoc.observacao || ""}
                  onChange={(e) => setEditarDoc({ ...editarDoc, observacao: e.target.value })}
                  rows={2}
                />
              </div>
              <div className="flex gap-3">
                <Button variant="outline" className="flex-1" onClick={() => setEditarDoc(null)}>
                  Cancelar
                </Button>
                <Button
                  className="flex-1"
                  onClick={() => {
                    setDocumentos(
                      documentos.map((d) => (d.id === editarDoc.id ? editarDoc : d))
                    );
                    setEditarDoc(null);
                  }}
                >
                  Salvar Alterações
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};
