import { useState, useEffect } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useSetores } from "@/hooks/useSetores";
import { useUnidades } from "@/hooks/useUnidades";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from "@/components/ui/dialog";
import { Plus, Pencil, Trash2, ArrowRightLeft, Building, LayoutGrid } from "lucide-react";

interface Motivo {
  id: string;
  nome: string;
  descricao: string | null;
  ativo: boolean;
  setores: string[];
  unidades: string[];
}

export const MotivosTransferenciaPanel = () => {
  const { data: setores } = useSetores();
  const { data: unidades } = useUnidades();
  const [motivos, setMotivos] = useState<Motivo[]>([]);
  const [loading, setLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingMotivo, setEditingMotivo] = useState<Motivo | null>(null);

  // Form state
  const [nome, setNome] = useState("");
  const [descricao, setDescricao] = useState("");
  const [setoresSelecionados, setSetoresSelecionados] = useState<string[]>([]);
  const [unidadesSelecionadas, setUnidadesSelecionadas] = useState<string[]>([]);

  const fetchMotivos = async () => {
    setLoading(true);
    const { data: motivosData } = await supabase
      .from("motivos_transferencia")
      .select("*")
      .order("created_at", { ascending: false });

    if (!motivosData) { setLoading(false); return; }

    const motivosComRelacoes: Motivo[] = await Promise.all(
      motivosData.map(async (m: any) => {
        const { data: setoresRel } = await supabase
          .from("motivos_transferencia_setores")
          .select("setor_id")
          .eq("motivo_id", m.id);
        const { data: unidadesRel } = await supabase
          .from("motivos_transferencia_unidades")
          .select("unidade_id")
          .eq("motivo_id", m.id);
        return {
          ...m,
          setores: setoresRel?.map((r: any) => r.setor_id) || [],
          unidades: unidadesRel?.map((r: any) => r.unidade_id) || [],
        };
      })
    );
    setMotivos(motivosComRelacoes);
    setLoading(false);
  };

  useEffect(() => { fetchMotivos(); }, []);

  const resetForm = () => {
    setNome("");
    setDescricao("");
    setSetoresSelecionados([]);
    setUnidadesSelecionadas([]);
    setEditingMotivo(null);
  };

  const handleOpenCreate = () => {
    resetForm();
    setDialogOpen(true);
  };

  const handleOpenEdit = (motivo: Motivo) => {
    setEditingMotivo(motivo);
    setNome(motivo.nome);
    setDescricao(motivo.descricao || "");
    setSetoresSelecionados(motivo.setores);
    setUnidadesSelecionadas(motivo.unidades);
    setDialogOpen(true);
  };

  const handleSalvar = async () => {
    if (!nome.trim()) { toast.error("Informe o nome do motivo"); return; }

    try {
      let motivoId: string;

      if (editingMotivo) {
        const { error } = await supabase
          .from("motivos_transferencia")
          .update({ nome, descricao: descricao || null })
          .eq("id", editingMotivo.id);
        if (error) throw error;
        motivoId = editingMotivo.id;

        // Clear existing relations
        await supabase.from("motivos_transferencia_setores").delete().eq("motivo_id", motivoId);
        await supabase.from("motivos_transferencia_unidades").delete().eq("motivo_id", motivoId);
      } else {
        const { data, error } = await supabase
          .from("motivos_transferencia")
          .insert({ nome, descricao: descricao || null })
          .select()
          .single();
        if (error) throw error;
        motivoId = data.id;
      }

      // Insert sector relations
      if (setoresSelecionados.length > 0) {
        await supabase.from("motivos_transferencia_setores").insert(
          setoresSelecionados.map((setor_id) => ({ motivo_id: motivoId, setor_id }))
        );
      }

      // Insert unit relations
      if (unidadesSelecionadas.length > 0) {
        await supabase.from("motivos_transferencia_unidades").insert(
          unidadesSelecionadas.map((unidade_id) => ({ motivo_id: motivoId, unidade_id }))
        );
      }

      toast.success(editingMotivo ? "Motivo atualizado" : "Motivo criado");
      setDialogOpen(false);
      resetForm();
      fetchMotivos();
    } catch {
      toast.error("Erro ao salvar motivo");
    }
  };

  const handleToggleAtivo = async (motivo: Motivo) => {
    await supabase
      .from("motivos_transferencia")
      .update({ ativo: !motivo.ativo })
      .eq("id", motivo.id);
    fetchMotivos();
  };

  const handleDelete = async (id: string) => {
    await supabase.from("motivos_transferencia").delete().eq("id", id);
    toast.success("Motivo removido");
    fetchMotivos();
  };

  const getSetorNome = (id: string) => setores?.find((s) => s.id === id)?.nome || "—";
  const getUnidadeNome = (id: string) => unidades?.find((u) => u.id === id)?.nome || "—";

  const toggleSetor = (id: string) => {
    setSetoresSelecionados((prev) =>
      prev.includes(id) ? prev.filter((s) => s !== id) : [...prev, id]
    );
  };

  const toggleUnidade = (id: string) => {
    setUnidadesSelecionadas((prev) =>
      prev.includes(id) ? prev.filter((u) => u !== id) : [...prev, id]
    );
  };

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <div>
          <h3 className="text-lg font-semibold flex items-center gap-2">
            <ArrowRightLeft className="h-5 w-5 text-primary" />
            Motivos de Transferência
          </h3>
          <p className="text-sm text-muted-foreground">
            Cadastre os motivos disponíveis ao transferir atendimentos
          </p>
        </div>
        <Button onClick={handleOpenCreate} size="sm" className="gap-1.5">
          <Plus className="h-4 w-4" /> Novo Motivo
        </Button>
      </div>

      <div className="grid gap-3">
        {loading ? (
          <p className="text-sm text-muted-foreground py-8 text-center">Carregando...</p>
        ) : motivos.length === 0 ? (
          <Card className="p-8 text-center">
            <p className="text-sm text-muted-foreground">Nenhum motivo cadastrado</p>
          </Card>
        ) : (
          motivos.map((motivo) => (
            <Card key={motivo.id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-medium text-sm">{motivo.nome}</span>
                    <Badge variant={motivo.ativo ? "default" : "secondary"} className="text-[10px]">
                      {motivo.ativo ? "Ativo" : "Inativo"}
                    </Badge>
                  </div>
                  {motivo.descricao && (
                    <p className="text-xs text-muted-foreground mb-2">{motivo.descricao}</p>
                  )}
                  <div className="flex flex-wrap gap-1">
                    {motivo.setores.map((sid) => (
                      <Badge key={sid} variant="outline" className="text-[10px] gap-1">
                        <LayoutGrid className="h-3 w-3" />
                        {getSetorNome(sid)}
                      </Badge>
                    ))}
                    {motivo.unidades.map((uid) => (
                      <Badge key={uid} variant="outline" className="text-[10px] gap-1">
                        <Building className="h-3 w-3" />
                        {getUnidadeNome(uid)}
                      </Badge>
                    ))}
                    {motivo.setores.length === 0 && motivo.unidades.length === 0 && (
                      <span className="text-[10px] text-muted-foreground">Todos os setores/unidades</span>
                    )}
                  </div>
                </div>
                <div className="flex items-center gap-1.5 shrink-0">
                  <Switch checked={motivo.ativo} onCheckedChange={() => handleToggleAtivo(motivo)} />
                  <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => handleOpenEdit(motivo)}>
                    <Pencil className="h-3.5 w-3.5" />
                  </Button>
                  <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive" onClick={() => handleDelete(motivo.id)}>
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </div>
              </div>
            </Card>
          ))
        )}
      </div>

      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>{editingMotivo ? "Editar Motivo" : "Novo Motivo de Transferência"}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label className="text-xs">Nome *</Label>
              <Input value={nome} onChange={(e) => setNome(e.target.value)} placeholder="Ex: Redirecionamento para setor responsável" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Descrição</Label>
              <Textarea value={descricao} onChange={(e) => setDescricao(e.target.value)} placeholder="Descrição opcional..." rows={2} />
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1.5">
                <LayoutGrid className="h-3.5 w-3.5" /> Setores
              </Label>
              <ScrollArea className="h-[120px] border rounded-md p-2">
                {setores?.map((setor) => (
                  <label key={setor.id} className="flex items-center gap-2 py-1.5 px-1 hover:bg-muted rounded cursor-pointer">
                    <Checkbox
                      checked={setoresSelecionados.includes(setor.id)}
                      onCheckedChange={() => toggleSetor(setor.id)}
                    />
                    <div className="w-3 h-3 rounded-full shrink-0" style={{ backgroundColor: setor.cor || undefined }} />
                    <span className="text-sm">{setor.nome}</span>
                  </label>
                ))}
                {(!setores || setores.length === 0) && (
                  <p className="text-xs text-muted-foreground text-center py-3">Nenhum setor cadastrado</p>
                )}
              </ScrollArea>
            </div>

            <div className="space-y-2">
              <Label className="text-xs flex items-center gap-1.5">
                <Building className="h-3.5 w-3.5" /> Unidades Empresariais
              </Label>
              <ScrollArea className="h-[120px] border rounded-md p-2">
                {unidades?.map((unidade) => (
                  <label key={unidade.id} className="flex items-center gap-2 py-1.5 px-1 hover:bg-muted rounded cursor-pointer">
                    <Checkbox
                      checked={unidadesSelecionadas.includes(unidade.id)}
                      onCheckedChange={() => toggleUnidade(unidade.id)}
                    />
                    <span className="text-sm">{unidade.nome}</span>
                  </label>
                ))}
                {(!unidades || unidades.length === 0) && (
                  <p className="text-xs text-muted-foreground text-center py-3">Nenhuma unidade cadastrada</p>
                )}
              </ScrollArea>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setDialogOpen(false)}>Cancelar</Button>
            <Button onClick={handleSalvar}>{editingMotivo ? "Salvar" : "Criar Motivo"}</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};
