import { useState, useEffect } from "react";
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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LayoutGrid,
  BarChart3,
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
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useChamadas } from "@/hooks/useChamadas";
import { usePacientes } from "@/hooks/usePacientes";
import { supabase } from "@/integrations/supabase/client";

type SecaoPainel =
  | "dashboards"
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
  { id: "dashboards", label: "Dashboards", icon: BarChart3 },
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

const COLORS = ["#0A2647", "#144272", "#205295", "#2C74B3"];

const atendimentosPorDiaData = [
  { dia: "Seg", atendimentos: 45 },
  { dia: "Ter", atendimentos: 52 },
  { dia: "Qua", atendimentos: 38 },
  { dia: "Qui", atendimentos: 61 },
  { dia: "Sex", atendimentos: 49 },
  { dia: "Sáb", atendimentos: 28 },
  { dia: "Dom", atendimentos: 15 },
];

const tmaTmeData = [
  { dia: "Seg", TMA: 320, TME: 180 },
  { dia: "Ter", TMA: 290, TME: 160 },
  { dia: "Qua", TMA: 310, TME: 175 },
  { dia: "Qui", TMA: 280, TME: 150 },
  { dia: "Sex", TMA: 305, TME: 165 },
];

const statusAtendimentosData = [
  { name: "Finalizados", value: 65 },
  { name: "Em atendimento", value: 20 },
  { name: "Aguardando resposta", value: 10 },
  { name: "Em fila", value: 5 },
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
  const [metricas, setMetricas] = useState({
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
      case "dashboards":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#0A2647]">
              Dashboards de Produtividade
            </h3>

            {/* Cards de métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 bg-gradient-to-br from-[#0A2647]/5 to-[#0A2647]/10">
                <div className="text-3xl font-bold text-[#0A2647]">
                  {metricas.totalAtendimentos}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Total de Atendimentos
                </p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-[#144272]/5 to-[#144272]/10">
                <div className="text-3xl font-bold text-[#144272]">
                  {formatarTempo(metricas.tma)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  TMA - Tempo Médio Atendimento
                </p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-[#205295]/5 to-[#205295]/10">
                <div className="text-3xl font-bold text-[#205295]">
                  {formatarTempo(metricas.tme)}
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  TME - Tempo Médio Espera
                </p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-[#2C74B3]/5 to-[#2C74B3]/10">
                <div className="text-3xl font-bold text-[#2C74B3]">
                  {metricas.taxaConclusao}%
                </div>
                <p className="text-sm text-muted-foreground mt-1">
                  Taxa de Conclusão
                </p>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6">
                <h4 className="font-semibold mb-4 text-[#0A2647]">
                  Atendimentos por Dia
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <BarChart data={atendimentosPorDiaData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="atendimentos" fill="#0A2647" radius={[8, 8, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold mb-4 text-[#0A2647]">
                  TMA e TME Diário
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <LineChart data={tmaTmeData}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                    <XAxis dataKey="dia" />
                    <YAxis />
                    <Tooltip />
                    <Legend />
                    <Line
                      type="monotone"
                      dataKey="TMA"
                      stroke="#0A2647"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                    <Line
                      type="monotone"
                      dataKey="TME"
                      stroke="#2C74B3"
                      strokeWidth={3}
                      dot={{ r: 5 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold mb-4 text-[#0A2647]">
                  Status de Atendimentos (Hoje)
                </h4>
                <ResponsiveContainer width="100%" height={250}>
                  <PieChart>
                    <Pie
                      data={statusAtendimentosData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) =>
                        `${name}: ${(percent * 100).toFixed(0)}%`
                      }
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {statusAtendimentosData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}
                        />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </Card>

              <Card className="p-6">
                <h4 className="font-semibold mb-4 text-[#0A2647]">
                  Horários de Pico
                </h4>
                <div className="space-y-2">
                  {[
                    { horario: "08-09", msgs: 45, nivel: "Médio" },
                    { horario: "09-10", msgs: 78, nivel: "Alto" },
                    { horario: "10-11", msgs: 92, nivel: "Muito Alto" },
                    { horario: "11-12", msgs: 65, nivel: "Alto" },
                    { horario: "14-15", msgs: 55, nivel: "Médio" },
                  ].map((item) => (
                    <div
                      key={item.horario}
                      className="flex justify-between items-center p-3 rounded-lg bg-muted/30"
                    >
                      <span className="font-medium">{item.horario}h</span>
                      <span className="text-muted-foreground">
                        {item.msgs} mensagens
                      </span>
                      <span
                        className={`px-3 py-1 rounded-full text-xs font-semibold ${
                          item.nivel === "Muito Alto"
                            ? "bg-red-100 text-red-700"
                            : item.nivel === "Alto"
                            ? "bg-orange-100 text-orange-700"
                            : "bg-blue-100 text-blue-700"
                        }`}
                      >
                        {item.nivel}
                      </span>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );

      case "roteiros":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#0A2647]">
              Roteiros de Atendimento
            </h3>
            <Card className="p-6">
              <p className="text-muted-foreground mb-4">
                Scripts e modelos de mensagens para o setor.
              </p>
              <Button className="bg-[#0A2647]">Criar Novo Roteiro</Button>
            </Card>
          </div>
        );

      case "relatorios":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#0A2647]">Relatórios</h3>
            <div className="grid grid-cols-2 gap-4">
              <Card className="p-6">
                <h4 className="font-semibold mb-2">NPS Geral do Setor</h4>
                <div className="text-4xl font-bold text-[#0A2647]">8.5</div>
              </Card>
              <Card className="p-6">
                <h4 className="font-semibold mb-2">Taxa de Transferências</h4>
                <div className="text-4xl font-bold text-[#144272]">12%</div>
              </Card>
            </div>
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Top 3 Atendentes</h4>
              <div className="space-y-3">
                {[
                  { nome: "Ana Silva", atendimentos: 85, nps: 9.2 },
                  { nome: "Carlos Santos", atendimentos: 78, nps: 8.9 },
                  { nome: "Maria Oliveira", atendimentos: 72, nps: 8.7 },
                ].map((atendente, idx) => (
                  <div
                    key={idx}
                    className="flex items-center justify-between p-3 rounded-lg bg-muted/30"
                  >
                    <div className="flex items-center gap-3">
                      <div
                        className={`w-8 h-8 rounded-full flex items-center justify-center font-bold text-white ${
                          idx === 0
                            ? "bg-yellow-500"
                            : idx === 1
                            ? "bg-gray-400"
                            : "bg-orange-600"
                        }`}
                      >
                        {idx + 1}
                      </div>
                      <span className="font-medium">{atendente.nome}</span>
                    </div>
                    <div className="text-right text-sm">
                      <div className="font-semibold">{atendente.atendimentos} atendimentos</div>
                      <div className="text-muted-foreground">NPS: {atendente.nps}</div>
                    </div>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case "preditiva":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#0A2647]">
              Análise Preditiva
            </h3>
            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50">
              <h4 className="font-semibold mb-4">Previsões para Hoje</h4>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-[#0A2647]" />
                  <span>Volume esperado: <strong>120-145 atendimentos</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <Bell className="h-5 w-5 text-orange-500" />
                  <span>Pico previsto: <strong>10h-12h</strong></span>
                </div>
                <div className="flex items-center gap-3">
                  <Activity className="h-5 w-5 text-green-500" />
                  <span>Fila prevista: <strong>Média</strong></span>
                </div>
              </div>
            </Card>
            <Card className="p-6">
              <h4 className="font-semibold mb-2">Recomendação da IA</h4>
              <p className="text-muted-foreground">
                Considere alocar +1 atendente entre 10h-12h para evitar sobrecarga.
              </p>
            </Card>
          </div>
        );

      case "alertas":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#0A2647]">Alertas</h3>
            <div className="space-y-3">
              <Card className="p-4 border-l-4 border-l-red-500">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-red-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">Fila com tempo elevado</h4>
                    <p className="text-sm text-muted-foreground">
                      8 pacientes aguardando há mais de 15 minutos
                    </p>
                  </div>
                </div>
              </Card>
              <Card className="p-4 border-l-4 border-l-yellow-500">
                <div className="flex items-start gap-3">
                  <Bell className="h-5 w-5 text-yellow-500 mt-0.5" />
                  <div>
                    <h4 className="font-semibold">TME acima da média</h4>
                    <p className="text-sm text-muted-foreground">
                      Tempo médio de espera 25% acima do padrão
                    </p>
                  </div>
                </div>
              </Card>
            </div>
          </div>
        );

      case "feedback":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#0A2647]">
              Feedback da Equipe
            </h3>
            <Card className="p-6">
              <h4 className="font-semibold mb-4">Sugestões da IA</h4>
              <div className="space-y-3">
                <div className="p-4 rounded-lg bg-green-50 border border-green-200">
                  <div className="flex items-center gap-2 mb-2">
                    <ThumbsUp className="h-4 w-4 text-green-600" />
                    <span className="font-semibold text-green-900">Elogio</span>
                  </div>
                  <p className="text-sm text-green-800">
                    <strong>Ana Silva</strong> manteve NPS de 9.2 por 30 dias consecutivos.
                  </p>
                  <Button size="sm" className="mt-3 bg-green-600">
                    Enviar Elogio
                  </Button>
                </div>
              </div>
            </Card>
          </div>
        );

      case "ideias":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#0A2647]">
              Ideias e Sugestões
            </h3>
            <Card className="p-6">
              <Button className="bg-[#0A2647] mb-4">Enviar Nova Ideia</Button>
              <div className="space-y-3">
                <div className="p-4 rounded-lg border">
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-semibold">Automatizar respostas FAQ</h4>
                    <span className="px-3 py-1 rounded-full text-xs bg-blue-100 text-blue-700">
                      Em análise
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground mb-2">
                    Criar bot para perguntas frequentes
                  </p>
                  <span className="text-xs text-muted-foreground">
                    Por: Carlos Santos
                  </span>
                </div>
              </div>
            </Card>
          </div>
        );

      case "auditoria":
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#0A2647]">
              Auditoria de Ações
            </h3>
            <Card className="p-6">
              <div className="space-y-3">
                {[
                  {
                    acao: "Transferência de atendimento",
                    user: "Ana Silva",
                    data: "28/11/2025 14:32",
                  },
                  {
                    acao: "Pausa de recebimento",
                    user: "Carlos Santos",
                    data: "28/11/2025 12:15",
                  },
                ].map((item, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg border flex justify-between items-center"
                  >
                    <div>
                      <h4 className="font-medium">{item.acao}</h4>
                      <p className="text-sm text-muted-foreground">{item.user}</p>
                    </div>
                    <span className="text-xs text-muted-foreground">
                      {item.data}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      default:
        return (
          <div className="space-y-6">
            <h3 className="text-2xl font-bold text-[#0A2647] capitalize">
              {menuItems.find((m) => m.id === secaoAtiva)?.label}
            </h3>
            <Card className="p-6">
              <p className="text-muted-foreground">Conteúdo em desenvolvimento.</p>
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
