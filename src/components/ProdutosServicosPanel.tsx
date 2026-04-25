import { useState, useRef, useMemo } from "react";
import * as XLSX from "xlsx";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Package,
  Upload,
  FileDown,
  Plus,
  Pencil,
  Trash2,
  Eye,
  Save,
  FileText,
  Search,
} from "lucide-react";
import { toast } from "sonner";
import {
  useProdutosServicos,
  useCriarProdutoServico,
  useCriarProdutosServicosLote,
  useAtualizarProdutoServico,
  useDeletarProdutoServico,
  useOrcamentoTemplate,
  useAtualizarOrcamentoTemplate,
  renderTemplateOrcamento,
  type ProdutoServico,
  type OrcamentoTemplate,
  type TipoItem,
} from "@/hooks/useProdutosServicos";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formatCurrency = (v: number) =>
  v.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

export const ProdutosServicosPanel = () => {
  const { data: produtos = [], isLoading } = useProdutosServicos();
  const { data: template } = useOrcamentoTemplate();
  const criar = useCriarProdutoServico();
  const criarLote = useCriarProdutosServicosLote();
  const atualizar = useAtualizarProdutoServico();
  const deletar = useDeletarProdutoServico();
  const atualizarTemplate = useAtualizarOrcamentoTemplate();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [busca, setBusca] = useState("");
  const [novoOpen, setNovoOpen] = useState(false);
  const [editando, setEditando] = useState<ProdutoServico | null>(null);
  const [orcamentoOpen, setOrcamentoOpen] = useState(false);
  const [editTemplateOpen, setEditTemplateOpen] = useState(false);

  const [form, setForm] = useState<{
    tipo: TipoItem;
    categoria: string;
    nome: string;
    valor: string;
    descricao: string;
    duracao_minutos: string;
    profissional: string;
    sku: string;
    estoque: string;
  }>({
    tipo: "produto",
    categoria: "",
    nome: "",
    valor: "",
    descricao: "",
    duracao_minutos: "",
    profissional: "",
    sku: "",
    estoque: "",
  });

  // Etapa do modal: primeiro escolher se é produto ou serviço
  const [escolhendoTipo, setEscolhendoTipo] = useState(false);

  const resetForm = () =>
    setForm({
      tipo: "produto",
      categoria: "",
      nome: "",
      valor: "",
      descricao: "",
      duracao_minutos: "",
      profissional: "",
      sku: "",
      estoque: "",
    });

  const produtosFiltrados = useMemo(() => {
    const q = busca.toLowerCase().trim();
    if (!q) return produtos;
    return produtos.filter(
      (p) =>
        p.categoria.toLowerCase().includes(q) ||
        p.nome.toLowerCase().includes(q) ||
        (p.descricao || "").toLowerCase().includes(q)
    );
  }, [produtos, busca]);

  // ─── Importação Excel ───────────────────────
  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const data = await file.arrayBuffer();
      const wb = XLSX.read(data);
      const ws = wb.Sheets[wb.SheetNames[0]];
      const rows = XLSX.utils.sheet_to_json<Record<string, any>>(ws, { defval: "" });

      const items = rows
        .map((r) => {
          // Aceita variações de nome de coluna
          const categoria =
            r["Categoria"] ?? r["categoria"] ?? r["CATEGORIA"] ?? r["Produto"] ?? r["produto"] ?? "";
          const nome =
            r["Nome"] ?? r["nome"] ?? r["NOME"] ?? r["Serviço"] ?? r["servico"] ?? r["Descrição"] ?? r["descricao"] ?? "";
          const valorRaw = r["Valor"] ?? r["valor"] ?? r["VALOR"] ?? r["Preço"] ?? r["preco"] ?? 0;
          const descricao = r["Observação"] ?? r["observacao"] ?? r["Obs"] ?? "";

          let valor = 0;
          if (typeof valorRaw === "number") valor = valorRaw;
          else
            valor =
              parseFloat(
                String(valorRaw).replace(/[R$\s.]/g, "").replace(",", ".")
              ) || 0;

          return {
            categoria: String(categoria).trim(),
            nome: String(nome).trim(),
            valor,
            descricao: descricao ? String(descricao).trim() : null,
          };
        })
        .filter((i) => i.categoria && i.nome);

      if (!items.length) {
        toast.error("Nenhuma linha válida encontrada", {
          description: "Verifique se a planilha tem as colunas: Categoria, Nome, Valor.",
        });
        return;
      }

      await criarLote.mutateAsync(items);
      toast.success(`${items.length} item(ns) importado(s) com sucesso ✅`);
    } catch (err) {
      console.error(err);
      toast.error("Erro ao importar planilha", {
        description: err instanceof Error ? err.message : "Erro desconhecido",
      });
    } finally {
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const handleDownloadTemplate = () => {
    const ws = XLSX.utils.json_to_sheet([
      { Categoria: "Consulta", Nome: "Avaliação inicial", Valor: 250.0 },
      { Categoria: "Procedimento", Nome: "Limpeza de pele", Valor: 180.0 },
    ]);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Produtos");
    XLSX.writeFile(wb, "modelo_produtos_servicos.xlsx");
  };

  // ─── CRUD ────────────────────────────────────
  const handleSalvar = async () => {
    if (!form.categoria.trim() || !form.nome.trim()) {
      toast.error("Categoria e Nome são obrigatórios");
      return;
    }
    const valor = parseFloat(form.valor.replace(",", ".")) || 0;
    try {
      if (editando) {
        await atualizar.mutateAsync({
          id: editando.id,
          updates: {
            categoria: form.categoria.trim(),
            nome: form.nome.trim(),
            valor,
            descricao: form.descricao.trim() || null,
          },
        });
        toast.success("Produto atualizado");
      } else {
        await criar.mutateAsync({
          categoria: form.categoria.trim(),
          nome: form.nome.trim(),
          valor,
          descricao: form.descricao.trim() || null,
        });
        toast.success("Produto cadastrado");
      }
      setNovoOpen(false);
      setEditando(null);
      setForm({ categoria: "", nome: "", valor: "", descricao: "" });
    } catch (err) {
      toast.error("Erro ao salvar", {
        description: err instanceof Error ? err.message : "Erro desconhecido",
      });
    }
  };

  const handleEditar = (p: ProdutoServico) => {
    setEditando(p);
    setForm({
      categoria: p.categoria,
      nome: p.nome,
      valor: String(p.valor),
      descricao: p.descricao || "",
    });
    setNovoOpen(true);
  };

  const handleDeletar = async (p: ProdutoServico) => {
    if (!confirm(`Excluir "${p.nome}"?`)) return;
    try {
      await deletar.mutateAsync(p.id);
      toast.success("Produto excluído");
    } catch (err) {
      toast.error("Erro ao excluir");
    }
  };

  return (
    <div className="space-y-6">
      <input
        ref={fileInputRef}
        type="file"
        accept=".xlsx,.xls,.csv"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 flex-wrap">
        <div>
          <h2 className="text-2xl font-semibold flex items-center gap-2">
            <Package className="h-6 w-6 text-primary" />
            Produtos e Serviços
          </h2>
          <p className="text-sm text-muted-foreground mt-1">
            Cadastre produtos e serviços e personalize o template de orçamento usado nos roteiros.
          </p>
        </div>
        <div className="flex items-center gap-2 flex-wrap">
          <Button variant="outline" size="sm" onClick={handleDownloadTemplate}>
            <FileDown className="h-4 w-4 mr-1" />
            Modelo Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => fileInputRef.current?.click()}>
            <Upload className="h-4 w-4 mr-1" />
            Importar Excel
          </Button>
          <Button variant="outline" size="sm" onClick={() => setOrcamentoOpen(true)}>
            <Eye className="h-4 w-4 mr-1" />
            Visualizar Orçamento
          </Button>
          <Button
            size="sm"
            onClick={() => {
              setEditando(null);
              setForm({ categoria: "", nome: "", valor: "", descricao: "" });
              setNovoOpen(true);
            }}
          >
            <Plus className="h-4 w-4 mr-1" />
            Novo
          </Button>
        </div>
      </div>

      {/* Busca */}
      <div className="relative max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="Buscar por categoria, nome..."
          value={busca}
          onChange={(e) => setBusca(e.target.value)}
          className="pl-9"
        />
      </div>

      {/* Lista */}
      <Card>
        <CardHeader className="pb-3">
          <CardTitle className="text-base flex items-center justify-between">
            <span>Catálogo</span>
            <Badge variant="secondary">{produtosFiltrados.length} item(ns)</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          {isLoading ? (
            <p className="text-sm text-muted-foreground py-6 text-center">Carregando...</p>
          ) : produtosFiltrados.length === 0 ? (
            <div className="text-center py-10 text-muted-foreground">
              <Package className="h-10 w-10 mx-auto mb-3 opacity-40" />
              <p className="text-sm">Nenhum produto cadastrado.</p>
              <p className="text-xs mt-1">Use "Novo" ou "Importar Excel" para começar.</p>
            </div>
          ) : (
            <div className="rounded-md border overflow-hidden">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Categoria</TableHead>
                    <TableHead>Nome</TableHead>
                    <TableHead className="text-right">Valor</TableHead>
                    <TableHead className="w-24 text-right">Ações</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {produtosFiltrados.map((p) => (
                    <TableRow key={p.id}>
                      <TableCell>
                        <Badge variant="outline">{p.categoria}</Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium">{p.nome}</div>
                        {p.descricao && (
                          <div className="text-xs text-muted-foreground mt-0.5">
                            {p.descricao}
                          </div>
                        )}
                      </TableCell>
                      <TableCell className="text-right font-medium tabular-nums">
                        {formatCurrency(p.valor)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-1">
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8"
                            onClick={() => handleEditar(p)}
                          >
                            <Pencil className="h-3.5 w-3.5" />
                          </Button>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-8 w-8 text-destructive hover:text-destructive"
                            onClick={() => handleDeletar(p)}
                          >
                            <Trash2 className="h-3.5 w-3.5" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Modal Novo / Editar */}
      <Dialog open={novoOpen} onOpenChange={(o) => { setNovoOpen(o); if (!o) setEditando(null); }}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editando ? "Editar produto" : "Novo produto"}</DialogTitle>
            <DialogDescription>
              Preencha os dados do produto ou serviço.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label htmlFor="cat">Categoria (Produto)</Label>
              <Input
                id="cat"
                placeholder="Ex: Consulta, Procedimento, Plano..."
                value={form.categoria}
                onChange={(e) => setForm({ ...form, categoria: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="nome">Nome</Label>
              <Input
                id="nome"
                placeholder="Ex: Avaliação inicial"
                value={form.nome}
                onChange={(e) => setForm({ ...form, nome: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="valor">Valor (R$)</Label>
              <Input
                id="valor"
                type="number"
                step="0.01"
                placeholder="0,00"
                value={form.valor}
                onChange={(e) => setForm({ ...form, valor: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="desc">Descrição (opcional)</Label>
              <Textarea
                id="desc"
                rows={2}
                value={form.descricao}
                onChange={(e) => setForm({ ...form, descricao: e.target.value })}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setNovoOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleSalvar} disabled={criar.isPending || atualizar.isPending}>
              <Save className="h-4 w-4 mr-1" />
              Salvar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Modal Visualizar Orçamento */}
      <VisualizarOrcamentoDialog
        open={orcamentoOpen}
        onOpenChange={setOrcamentoOpen}
        template={template}
        onEditar={() => {
          setOrcamentoOpen(false);
          setEditTemplateOpen(true);
        }}
      />

      {/* Modal Editar Template */}
      <EditarTemplateDialog
        open={editTemplateOpen}
        onOpenChange={setEditTemplateOpen}
        template={template}
        onSave={async (updates) => {
          if (!template) return;
          await atualizarTemplate.mutateAsync({ id: template.id, updates });
          toast.success("Template atualizado ✅", {
            description: "O novo padrão será usado automaticamente nos envios.",
          });
          setEditTemplateOpen(false);
        }}
        saving={atualizarTemplate.isPending}
      />
    </div>
  );
};

// ─── Sub-componente: Visualizar Orçamento ─────────────────
interface VisualizarProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  template: OrcamentoTemplate | null | undefined;
  onEditar: () => void;
}
const VisualizarOrcamentoDialog = ({
  open,
  onOpenChange,
  template,
  onEditar,
}: VisualizarProps) => {
  const exemplo = renderTemplateOrcamento(template ?? null, {
    descricao: "Consulta especializada",
    valor_produto: formatCurrency(350),
    despesas: formatCurrency(50),
    total: formatCurrency(400),
    desconto: formatCurrency(380),
  });

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <FileText className="h-5 w-5 text-primary" />
            Visualizar Orçamento
          </DialogTitle>
          <DialogDescription>
            Pré-visualização do template atual usado no envio de orçamentos via Roteiros.
          </DialogDescription>
        </DialogHeader>
        <Card className="bg-muted/40 border-dashed">
          <CardContent className="p-4">
            <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed">
              {exemplo}
            </pre>
          </CardContent>
        </Card>
        <DialogFooter className="gap-2">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Fechar
          </Button>
          <Button onClick={onEditar}>
            <Pencil className="h-4 w-4 mr-1" />
            Editar template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Sub-componente: Editar Template ──────────────────────
interface EditarProps {
  open: boolean;
  onOpenChange: (o: boolean) => void;
  template: OrcamentoTemplate | null | undefined;
  onSave: (updates: Partial<OrcamentoTemplate>) => Promise<void>;
  saving: boolean;
}
const EditarTemplateDialog = ({
  open,
  onOpenChange,
  template,
  onSave,
  saving,
}: EditarProps) => {
  const [form, setForm] = useState<Partial<OrcamentoTemplate>>({});

  // Sincroniza ao abrir
  const initialized = useMemo(() => {
    if (open && template) {
      setForm({
        titulo: template.titulo,
        linha_valor_produto: template.linha_valor_produto,
        linha_despesas: template.linha_despesas,
        separador: template.separador,
        linha_total: template.linha_total,
        linha_desconto: template.linha_desconto,
        rodape: template.rodape,
      });
    }
    return true;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open, template?.id]);
  void initialized;

  const preview = renderTemplateOrcamento(
    { ...(template as any), ...form } as OrcamentoTemplate,
    {
      descricao: "Consulta especializada",
      valor_produto: formatCurrency(350),
      despesas: formatCurrency(50),
      total: formatCurrency(400),
      desconto: formatCurrency(380),
    }
  );

  const variaveis = "{descricao} • {valor_produto} • {despesas} • {total} • {desconto}";

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Editar Template de Orçamento</DialogTitle>
          <DialogDescription>
            As alterações são aplicadas automaticamente no envio de orçamento via Roteiros.
            <br />
            <span className="text-xs">Variáveis disponíveis: <code className="text-primary">{variaveis}</code></span>
          </DialogDescription>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Título</Label>
              <Input
                value={form.titulo ?? ""}
                onChange={(e) => setForm({ ...form, titulo: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Linha do valor do produto</Label>
              <Input
                value={form.linha_valor_produto ?? ""}
                onChange={(e) => setForm({ ...form, linha_valor_produto: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Linha de despesas</Label>
              <Input
                value={form.linha_despesas ?? ""}
                onChange={(e) => setForm({ ...form, linha_despesas: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Separador</Label>
              <Input
                value={form.separador ?? ""}
                onChange={(e) => setForm({ ...form, separador: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Linha do total</Label>
              <Input
                value={form.linha_total ?? ""}
                onChange={(e) => setForm({ ...form, linha_total: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Linha de desconto (quando houver)</Label>
              <Input
                value={form.linha_desconto ?? ""}
                onChange={(e) => setForm({ ...form, linha_desconto: e.target.value })}
              />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Rodapé</Label>
              <Textarea
                rows={2}
                value={form.rodape ?? ""}
                onChange={(e) => setForm({ ...form, rodape: e.target.value })}
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label className="text-xs text-muted-foreground">Pré-visualização</Label>
            <Card className="bg-muted/40 border-dashed sticky top-0">
              <CardContent className="p-4">
                <pre className="text-xs whitespace-pre-wrap font-sans leading-relaxed">
                  {preview}
                </pre>
              </CardContent>
            </Card>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={() => onSave(form)} disabled={saving}>
            <Save className="h-4 w-4 mr-1" />
            Salvar template
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
