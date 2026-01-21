import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Save, Building2 } from "lucide-react";
import { useAtualizarUnidade } from "@/hooks/useUnidades";
import { toast } from "sonner";

interface UnidadeCompleta {
  id: string;
  nome: string;
  tipo_unidade?: string;
  cnpj_ou_identificador?: string;
  logradouro?: string;
  numero?: string;
  complemento?: string;
  bairro?: string;
  cidade?: string;
  estado?: string;
  cep?: string;
  telefone?: string;
  email?: string;
  fuso_horario?: string;
  responsavel?: string;
  horario_funcionamento?: string;
  observacoes?: string;
  codigo_interno?: string;
  endereco?: string;
  ativo?: boolean;
}

interface EditarUnidadeDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  unidade: UnidadeCompleta | null;
}

const TIPOS_UNIDADE = ["Sede", "Filial", "Clínica", "Operação", "Outro"];
const ESTADOS_BR = [
  "AC", "AL", "AP", "AM", "BA", "CE", "DF", "ES", "GO", "MA",
  "MT", "MS", "MG", "PA", "PB", "PR", "PE", "PI", "RJ", "RN",
  "RS", "RO", "RR", "SC", "SP", "SE", "TO"
];
const FUSOS_HORARIOS = [
  "America/Sao_Paulo",
  "America/Manaus",
  "America/Cuiaba",
  "America/Recife",
  "America/Rio_Branco",
  "America/Noronha",
];

export const EditarUnidadeDialog = ({
  open,
  onOpenChange,
  unidade,
}: EditarUnidadeDialogProps) => {
  const atualizarUnidade = useAtualizarUnidade();

  const [form, setForm] = useState<UnidadeCompleta>({
    id: "",
    nome: "",
    tipo_unidade: "Filial",
    cnpj_ou_identificador: "",
    logradouro: "",
    numero: "",
    complemento: "",
    bairro: "",
    cidade: "",
    estado: "",
    cep: "",
    telefone: "",
    email: "",
    fuso_horario: "America/Sao_Paulo",
    responsavel: "",
    horario_funcionamento: "",
    observacoes: "",
    codigo_interno: "",
    ativo: true,
  });

  useEffect(() => {
    if (unidade) {
      // Parse endereço existente se necessário
      const enderecoPartes = unidade.endereco?.split(", ") || [];
      setForm({
        ...unidade,
        tipo_unidade: unidade.tipo_unidade || "Filial",
        cnpj_ou_identificador: unidade.cnpj_ou_identificador || unidade.codigo_interno || "",
        logradouro: unidade.logradouro || enderecoPartes[0] || "",
        numero: unidade.numero || "",
        complemento: unidade.complemento || "",
        bairro: unidade.bairro || enderecoPartes[1] || "",
        cidade: unidade.cidade || "",
        estado: unidade.estado || "",
        cep: unidade.cep || "",
        telefone: unidade.telefone || "",
        email: unidade.email || "",
        fuso_horario: unidade.fuso_horario || "America/Sao_Paulo",
        responsavel: unidade.responsavel || "",
        horario_funcionamento: unidade.horario_funcionamento || "",
        observacoes: unidade.observacoes || "",
        ativo: unidade.ativo ?? true,
      });
    }
  }, [unidade]);

  const handleSalvar = () => {
    if (!form.nome.trim()) {
      toast.error("Nome da unidade é obrigatório");
      return;
    }
    if (!form.cnpj_ou_identificador?.trim()) {
      toast.error("CNPJ ou identificador é obrigatório");
      return;
    }

    // Montar endereço completo
    const endereco = [
      form.logradouro,
      form.numero && `nº ${form.numero}`,
      form.complemento,
      form.bairro,
      form.cidade && form.estado && `${form.cidade} - ${form.estado}`,
      form.cep && `CEP: ${form.cep}`,
    ]
      .filter(Boolean)
      .join(", ");

    atualizarUnidade.mutate(
      {
        id: form.id,
        dados: {
          nome: form.nome,
          codigo_interno: form.cnpj_ou_identificador,
          endereco,
          fuso_horario: form.fuso_horario,
          ativo: form.ativo,
        },
      },
      {
        onSuccess: () => {
          toast.success("Unidade atualizada com sucesso");
          onOpenChange(false);
        },
      }
    );
  };

  const updateField = (field: keyof UnidadeCompleta, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Building2 className="h-5 w-5" />
            Editar Unidade Empresarial
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[60vh] pr-4">
          <div className="space-y-6">
            {/* Dados básicos */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Dados Básicos
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Nome da Unidade *</Label>
                  <Input
                    value={form.nome}
                    onChange={(e) => updateField("nome", e.target.value)}
                    placeholder="Ex: Unidade Centro"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Tipo de Unidade *</Label>
                  <Select
                    value={form.tipo_unidade}
                    onValueChange={(v) => updateField("tipo_unidade", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {TIPOS_UNIDADE.map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>
                          {tipo}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>CNPJ / Identificador Interno *</Label>
                  <Input
                    value={form.cnpj_ou_identificador}
                    onChange={(e) => updateField("cnpj_ou_identificador", e.target.value)}
                    placeholder="00.000.000/0000-00 ou código"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Fuso Horário *</Label>
                  <Select
                    value={form.fuso_horario}
                    onValueChange={(v) => updateField("fuso_horario", v)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {FUSOS_HORARIOS.map((fuso) => (
                        <SelectItem key={fuso} value={fuso}>
                          {fuso}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Endereço */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Endereço
              </h4>
              <div className="grid grid-cols-3 gap-4">
                <div className="col-span-2 space-y-2">
                  <Label>Logradouro *</Label>
                  <Input
                    value={form.logradouro}
                    onChange={(e) => updateField("logradouro", e.target.value)}
                    placeholder="Rua, Avenida..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Número *</Label>
                  <Input
                    value={form.numero}
                    onChange={(e) => updateField("numero", e.target.value)}
                    placeholder="123"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Complemento</Label>
                  <Input
                    value={form.complemento}
                    onChange={(e) => updateField("complemento", e.target.value)}
                    placeholder="Sala, Andar..."
                  />
                </div>
                <div className="space-y-2">
                  <Label>Bairro *</Label>
                  <Input
                    value={form.bairro}
                    onChange={(e) => updateField("bairro", e.target.value)}
                    placeholder="Bairro"
                  />
                </div>
                <div className="space-y-2">
                  <Label>CEP *</Label>
                  <Input
                    value={form.cep}
                    onChange={(e) => updateField("cep", e.target.value)}
                    placeholder="00000-000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Cidade *</Label>
                  <Input
                    value={form.cidade}
                    onChange={(e) => updateField("cidade", e.target.value)}
                    placeholder="Cidade"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Estado *</Label>
                  <Select
                    value={form.estado}
                    onValueChange={(v) => updateField("estado", v)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="UF" />
                    </SelectTrigger>
                    <SelectContent>
                      {ESTADOS_BR.map((uf) => (
                        <SelectItem key={uf} value={uf}>
                          {uf}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Contato */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Contato
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Telefone *</Label>
                  <Input
                    value={form.telefone}
                    onChange={(e) => updateField("telefone", e.target.value)}
                    placeholder="(00) 0000-0000"
                  />
                </div>
                <div className="space-y-2">
                  <Label>E-mail *</Label>
                  <Input
                    type="email"
                    value={form.email}
                    onChange={(e) => updateField("email", e.target.value)}
                    placeholder="unidade@empresa.com"
                  />
                </div>
              </div>
            </div>

            {/* Informações adicionais */}
            <div className="space-y-4">
              <h4 className="font-medium text-sm text-muted-foreground uppercase tracking-wide">
                Informações Adicionais
              </h4>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label>Responsável</Label>
                  <Input
                    value={form.responsavel}
                    onChange={(e) => updateField("responsavel", e.target.value)}
                    placeholder="Nome do responsável"
                  />
                </div>
                <div className="space-y-2">
                  <Label>Horário de Funcionamento</Label>
                  <Input
                    value={form.horario_funcionamento}
                    onChange={(e) => updateField("horario_funcionamento", e.target.value)}
                    placeholder="Ex: 07:00 - 19:00"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label>Observações</Label>
                <Textarea
                  value={form.observacoes}
                  onChange={(e) => updateField("observacoes", e.target.value)}
                  placeholder="Observações adicionais..."
                  rows={3}
                />
              </div>
            </div>
          </div>
        </ScrollArea>

        <DialogFooter className="pt-4 border-t">
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancelar
          </Button>
          <Button onClick={handleSalvar} className="gap-2">
            <Save className="h-4 w-4" />
            Salvar Alterações
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
