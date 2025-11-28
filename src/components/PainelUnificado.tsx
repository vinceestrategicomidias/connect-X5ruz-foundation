import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  LayoutGrid,
  User,
  BarChart3,
  Shield,
  FileText,
  Download,
  ArrowRightLeft,
  ThumbsUp,
  Bell,
  TrendingUp,
  MessageSquare,
  Activity,
  History,
  Lightbulb,
} from "lucide-react";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useChamadas } from "@/hooks/useChamadas";
import { usePacientes } from "@/hooks/usePacientes";
import { useEffect, useState as useStateLocal } from "react";
import { supabase } from "@/integrations/supabase/client";

type SecaoPainel =
  | "perfil"
  | "dashboards"
  | "permissoes"
  | "roteiros"
  | "relatorios"
  | "transferencias"
  | "nps"
  | "alertas"
  | "preditiva"
  | "feedback"
  | "indicadores"
  | "auditoria"
  | "ideias";

interface MenuItem {
  id: SecaoPainel;
  label: string;
  icon: any;
}

const menuItems: MenuItem[] = [
  { id: "perfil", label: "Perfil", icon: User },
  { id: "dashboards", label: "Dashboards", icon: BarChart3 },
  { id: "permissoes", label: "Permissões", icon: Shield },
  { id: "roteiros", label: "Roteiros", icon: FileText },
  { id: "relatorios", label: "Relatórios", icon: Download },
  { id: "transferencias", label: "Transferências", icon: ArrowRightLeft },
  { id: "nps", label: "NPS Feedback", icon: ThumbsUp },
  { id: "alertas", label: "Alertas", icon: Bell },
  { id: "preditiva", label: "Preditiva", icon: TrendingUp },
  { id: "feedback", label: "Feedback", icon: MessageSquare },
  { id: "indicadores", label: "Indicadores", icon: Activity },
  { id: "auditoria", label: "Auditoria de Ações", icon: History },
  { id: "ideias", label: "Ideias", icon: Lightbulb },
];

export const PainelUnificado = () => {
  const [open, setOpen] = useState(false);
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoPainel>("dashboards");
  const { atendenteLogado, isCoordenacao } = useAtendenteContext();
  const { data: chamadas } = useChamadas(
    isCoordenacao ? undefined : atendenteLogado?.id,
    isCoordenacao ? atendenteLogado?.setor_id : undefined
  );
  const { data: pacientes } = usePacientes(undefined, atendenteLogado?.setor_id);
  const [metricas, setMetricas] = useStateLocal({
    totalAtendimentos: 0,
    tma: 0,
    tme: 0,
    taxaConclusao: 0,
    totalMensagens: 0,
  });

  useEffect(() => {
    const calcularMetricas = async () => {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const chamadasHoje =
        chamadas?.filter((c) => new Date(c.horario_inicio) >= hoje) || [];
      const atendidas = chamadasHoje.filter((c) => c.status === "atendida");

      const duracaoTotal = atendidas.reduce((acc, c) => acc + (c.duracao || 0), 0);
      const tma = atendidas.length > 0 ? duracaoTotal / atendidas.length : 0;

      const { count: totalMensagens } = await supabase
        .from("mensagens")
        .select("*", { count: "exact", head: true })
        .gte("created_at", hoje.toISOString())
        .eq("autor", "atendente");

      const finalizados =
        pacientes?.filter((p) => p.status === "finalizado").length || 0;
      const total = pacientes?.length || 1;
      const taxaConclusao = (finalizados / total) * 100;

      setMetricas({
        totalAtendimentos: atendidas.length,
        tma: Math.floor(tma),
        tme: 0, // Calcular depois
        taxaConclusao: Math.round(taxaConclusao),
        totalMensagens: totalMensagens || 0,
      });
    };

    calcularMetricas();
  }, [chamadas, pacientes]);

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins}m ${segs}s`;
  };

  const renderConteudo = () => {
    switch (secaoAtiva) {
      case "perfil":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-4">
              <div className="w-20 h-20 rounded-full bg-primary/10 flex items-center justify-center text-3xl font-bold text-primary">
                {atendenteLogado?.nome.charAt(0)}
              </div>
              <div>
                <h3 className="text-2xl font-bold">{atendenteLogado?.nome}</h3>
                <p className="text-muted-foreground capitalize">
                  {atendenteLogado?.cargo}
                </p>
              </div>
            </div>
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Informações do Perfil</h4>
              <div className="space-y-3">
                <div>
                  <label className="text-sm text-muted-foreground">Nome</label>
                  <p className="font-medium">{atendenteLogado?.nome}</p>
                </div>
                <div>
                  <label className="text-sm text-muted-foreground">Cargo</label>
                  <p className="font-medium capitalize">{atendenteLogado?.cargo}</p>
                </div>
              </div>
            </Card>
          </div>
        );

      case "dashboards":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Dashboards de Produtividade</h3>
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6">
                <div className="text-3xl font-bold text-[#0A2647]">
                  {metricas.totalAtendimentos}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Total de Atendimentos
                </p>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-[#0A2647]">
                  {formatarTempo(metricas.tma)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">TMA</p>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-[#0A2647]">
                  {formatarTempo(metricas.tme)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">TME</p>
              </Card>
              <Card className="p-6">
                <div className="text-3xl font-bold text-[#0A2647]">
                  {metricas.taxaConclusao}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Taxa de Conclusão
                </p>
              </Card>
            </div>
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Mensagens Enviadas Hoje</h4>
              <div className="text-4xl font-bold text-[#0A2647]">
                {metricas.totalMensagens}
              </div>
            </Card>
          </div>
        );

      case "permissoes":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Permissões</h3>
            <Card className="p-6">
              <p className="text-muted-foreground">
                Gerenciamento de cargos e permissões em desenvolvimento.
              </p>
            </Card>
          </div>
        );

      case "transferencias":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold">Histórico de Transferências</h3>
            <Card className="p-6">
              <p className="text-muted-foreground">
                Histórico de transferências em desenvolvimento.
              </p>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold capitalize">
              {menuItems.find((m) => m.id === secaoAtiva)?.label}
            </h3>
            <Card className="p-6">
              <p className="text-muted-foreground">
                Conteúdo em desenvolvimento.
              </p>
            </Card>
          </div>
        );
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <LayoutGrid className="h-4 w-4 mr-2" />
          Painel
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-6xl h-[90vh] p-0">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-64 border-r border-border bg-muted/20">
            <DialogHeader className="p-6 border-b border-border">
              <DialogTitle className="text-[#0A2647]">Painel Connect</DialogTitle>
            </DialogHeader>
            <ScrollArea className="h-[calc(100%-80px)]">
              <div className="p-4 space-y-1">
                {menuItems.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Button
                      key={item.id}
                      variant={secaoAtiva === item.id ? "secondary" : "ghost"}
                      className="w-full justify-start transition-all duration-200"
                      onClick={() => setSecaoAtiva(item.id)}
                    >
                      <Icon className="h-4 w-4 mr-3" />
                      {item.label}
                    </Button>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Conteúdo */}
          <div className="flex-1">
            <ScrollArea className="h-full">
              <div className="p-8">{renderConteudo()}</div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
