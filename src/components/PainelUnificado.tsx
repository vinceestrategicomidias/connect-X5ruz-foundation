import { useState } from "react";
import {
  Dialog,
  DialogContent,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  LayoutGrid,
  BarChart3,
  FileText,
  Download,
  ThumbsUp,
  Bell,
  TrendingUp,
  MessageSquare,
  Activity,
  History,
  Lightbulb,
  X,
  Award,
  Settings,
  Filter,
  Users,
  Calendar,
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
import { cn } from "@/lib/utils";
import { useAtendenteContext } from "@/contexts/AtendenteContext";

import { ConfiguracoesFilaPanel } from "./ConfiguracoesFilaPanel";
import { EditorRoteirosPanel } from "./EditorRoteirosPanel";
import { RelatoriosInteligentesPanel } from "./RelatoriosInteligentesPanel";
import { CentralIdeiasPanel } from "./CentralIdeiasPanel";
import { AuditoriaAcoesPanel } from "./AuditoriaAcoesPanel";
import { EtiquetasManagementPanel } from "./EtiquetasManagementPanel";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

type SecaoPainel =
  | "dashboards"
  | "roteiros"
  | "relatorios"
  | "nps"
  | "preditiva"
  | "feedback"
  | "indicadores"
  | "auditoria"
  | "ideias"
  | "etiquetas"
  | "configuracoes";

interface MenuItem {
  id: SecaoPainel;
  label: string;
  icon: any;
  apenasGestor?: boolean;
}

interface MenuBlock {
  title: string;
  items: MenuItem[];
}

const menuBlocks: MenuBlock[] = [
  {
    title: "Visão Estratégica",
    items: [
      { id: "dashboards", label: "Dashboards", icon: LayoutGrid },
      { id: "relatorios", label: "Relatórios Inteligentes", icon: BarChart3 },
      { id: "nps", label: "Net Promoter Score (NPS)", icon: ThumbsUp },
    ],
  },
  {
    title: "Thalí IA",
    items: [
      { id: "preditiva", label: "Thalí Preditiva", icon: TrendingUp },
      { id: "feedback", label: "Feedback da Thalí", icon: MessageSquare },
    ],
  },
  {
    title: "Operação",
    items: [
      { id: "roteiros", label: "Roteiros", icon: FileText },
      { id: "indicadores", label: "Indicadores", icon: Activity },
      { id: "etiquetas", label: "Etiquetas", icon: Award, apenasGestor: true },
    ],
  },
  {
    title: "Controle",
    items: [
      { id: "auditoria", label: "Auditoria", icon: History },
      { id: "ideias", label: "Central de Ideias", icon: Lightbulb },
      { id: "configuracoes", label: "Configurações", icon: Settings, apenasGestor: true },
    ],
  },
];

// Dados NPS comparativos
const npsComparativo = {
  porAtendente: [
    { nome: "Geovana", nps: 95, atendimentos: 314 },
    { nome: "Emilly", nps: 92, atendimentos: 298 },
    { nome: "Paloma", nps: 93, atendimentos: 283 },
    { nome: "Marcos", nps: 74, atendimentos: 251 },
    { nome: "Bianca", nps: 88, atendimentos: 229 },
  ],
  evolucaoMensal: [
    { mes: "Jul", nps: 87 },
    { mes: "Ago", nps: 89 },
    { mes: "Set", nps: 91 },
    { mes: "Out", nps: 90 },
    { mes: "Nov", nps: 92 },
    { mes: "Dez", nps: 92 },
  ],
  distribuicao: [
    { name: "Promotores", value: 168, color: "hsl(142, 71%, 45%)" },
    { name: "Neutros", value: 22, color: "hsl(48, 89%, 48%)" },
    { name: "Detratores", value: 18, color: "hsl(0, 84%, 60%)" },
  ]
};

// Dados simulados de GRANDE EMPRESA
const dadosEmpresaGrande = {
  totalAtendimentos: 2847,
  tmaSetor: "3m 42s",
  tmeSetor: "5m 11s",
  taxaConclusao: 87,

  atendimentosPorDia: [
    { dia: "Seg", atendimentos: 412 },
    { dia: "Ter", atendimentos: 386 },
    { dia: "Qua", atendimentos: 502 },
    { dia: "Qui", atendimentos: 631 },
    { dia: "Sex", atendimentos: 713 },
    { dia: "Sáb", atendimentos: 279 },
    { dia: "Dom", atendimentos: 194 },
  ],

  tmaTmePorDia: [
    { dia: "Seg", TMA: 3.2, TME: 4.8 },
    { dia: "Ter", TMA: 3.4, TME: 5.3 },
    { dia: "Qua", TMA: 3.5, TME: 6.1 },
    { dia: "Qui", TMA: 3.2, TME: 5.8 },
    { dia: "Sex", TMA: 2.9, TME: 4.7 },
    { dia: "Sáb", TMA: 4.6, TME: 7.4 },
    { dia: "Dom", TMA: 5.1, TME: 8.1 },
  ],

  distribuicaoPorAtendente: [
    { nome: "Geovana", atendimentos: 314 },
    { nome: "Paloma", atendimentos: 287 },
    { nome: "Emilly", atendimentos: 274 },
    { nome: "Marcos", atendimentos: 251 },
    { nome: "Bianca", atendimentos: 229 },
  ],

  statusAtendimentos: [
    { name: "Finalizados", value: 1124 },
    { name: "Em Atendimento", value: 382 },
    { name: "Aguardando", value: 514 },
    { name: "Em Fila", value: 827 },
  ],

  horariosPico: [
    { horario: "08-09", msgs: 45, nivel: "Médio" },
    { horario: "09-10", msgs: 62, nivel: "Alto" },
    { horario: "10-11", msgs: 88, nivel: "Muito Alto" },
    { horario: "11-12", msgs: 44, nivel: "Médio" },
    { horario: "12-13", msgs: 29, nivel: "Baixo" },
    { horario: "13-14", msgs: 56, nivel: "Alto" },
  ],

  npsGeral: 92,
  porcentagemTransferencia: 13,
  taxaReabertura: 8,
  rankingTop3: [
    { atendente: "Geovana", atendimentos: 314, tempoMedio: "3m21s", nps: 95 },
    { atendente: "Emilly", atendimentos: 298, tempoMedio: "3m48s", nps: 92 },
    { atendente: "Paloma", atendimentos: 283, tempoMedio: "4m01s", nps: 93 },
  ],

  transferencias: [
    { hora: "09:33", de: "Marcos", para: "Geovana", paciente: "Ana Cristina" },
    { hora: "10:14", de: "Paloma", para: "Emilly", paciente: "Luiz Fernando" },
    { hora: "11:03", de: "Emilly", para: "Gestão", paciente: "Caso especial" },
    { hora: "13:27", de: "Bianca", para: "Marcos", paciente: "José Silva" },
    { hora: "14:52", de: "Geovana", para: "Paloma", paciente: "Maria Santos" },
  ],

  nps: {
    totalRespondido: 208,
    npsMedio: 92,
    promotores: 168,
    neutros: 22,
    detratores: 18,
    feedbacksRecentes: [
      { atendente: "Geovana", nota: 10, comentario: "Atendimento perfeito!" },
      { atendente: "Paloma", nota: 9, comentario: "Rápida e eficiente." },
      { atendente: "Marcos", nota: 6, comentario: "Poderia melhorar o tempo de espera." },
    ],
  },

  alertas: [
    { tipo: "Fila alta", setor: "Pré-venda", detalhes: "14 pacientes aguardando acima de 10 minutos.", cor: "red" },
    { tipo: "NPS baixo", atendente: "Marcos", detalhes: "NPS nas últimas 24h caiu para 74.", cor: "orange" },
    { tipo: "Tempo médio alto", atendente: "Bianca", detalhes: "TMA subiu para 4m52s.", cor: "yellow" },
  ],

  preditiva: {
    horarioPicoPrevisto: "10h–11h",
    volumeEsperadoHoje: 921,
    setorMaisDemandado: "Pré-cirurgia",
    recomendacoes: [
      "Realocar 1 atendente da pós-venda para pré-cirurgia das 9h às 12h.",
      "Ativar fila prioritária para cirurgias complexas.",
      "Aumentar vigilância nos casos com NPS baixo.",
    ],
  },

  feedbackIA: {
    elogios: [
      { atendente: "Geovana", motivo: "Maior índice de satisfação do setor" },
      { atendente: "Emilly", motivo: "Tempo médio extremamente eficiente" },
    ],
    melhorias: [
      { atendente: "Marcos", motivo: "NPS baixo recorrente nas últimas 72h" },
    ],
  },

  indicadores: [
    { nome: "Volume mensal", valor: "12.214" },
    { nome: "Atendimentos complexos", valor: "431" },
    { nome: "Taxa de resolutividade", valor: "89%" },
  ],

  auditoria: [
    { acao: "Alteração de URA", por: "Gestor", horario: "08:12", data: "Hoje" },
    { acao: "Edição de Roteiro", por: "Coordenação", horario: "10:47", data: "Hoje" },
    { acao: "Validação de perfil", por: "Coordenação", horario: "14:19", data: "Hoje" },
  ],

  ideias: [
    { usuario: "Paloma", ideia: "Criar scripts automáticos de resposta rápida.", status: "Em análise" },
    { usuario: "Marcos", ideia: "Otimizar fila com Thalí.", status: "Implementada" },
    { usuario: "Emilly", ideia: "Criar modo escuro mais suave.", status: "Aprovada" },
  ],
  reconhecimentoSemana: { usuario: "Emilly", motivo: "Melhor evolução de NPS" },
};

const COLORS = ["hsl(214, 85%, 51%)", "hsl(214, 85%, 41%)", "hsl(142, 71%, 45%)", "hsl(210, 14%, 72%)"];

const getNivelStyle = (nivel: string) => {
  switch (nivel) {
    case "Muito Alto":
      return "bg-destructive/10 text-destructive border-destructive/20";
    case "Alto":
      return "bg-warning/10 text-warning border-warning/20";
    case "Médio":
      return "bg-primary/10 text-primary border-primary/20";
    case "Baixo":
      return "bg-success/10 text-success border-success/20";
    default:
      return "bg-muted text-muted-foreground";
  }
};

// Reusable section header
const SectionHeader = ({ icon: Icon, title, children }: { icon: any; title: string; children?: React.ReactNode }) => (
  <div className="flex items-center justify-between mb-6">
    <div className="flex items-center gap-3">
      <div className="w-9 h-9 rounded-lg bg-primary/10 flex items-center justify-center">
        <Icon className="h-4.5 w-4.5 text-primary" />
      </div>
      <h3 className="text-xl font-semibold text-foreground">{title}</h3>
    </div>
    {children}
  </div>
);

// Reusable metric card
const MetricCard = ({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) => (
  <Card className="p-5 border-border/60">
    <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-2">{label}</p>
    <p className={cn("text-2xl font-bold", accent ? "text-primary" : "text-foreground")}>{value}</p>
  </Card>
);

// Filter bar
const FilterBar = ({ children }: { children: React.ReactNode }) => (
  <div className="flex flex-wrap items-center gap-3 px-4 py-3 rounded-lg border border-border/60 bg-muted/20">
    <Filter className="h-3.5 w-3.5 text-muted-foreground" />
    {children}
  </div>
);

// Chart wrapper
const ChartCard = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
  <Card className={cn("p-5 border-border/60", className)}>
    <h4 className="text-sm font-semibold text-foreground mb-4">{title}</h4>
    <div className="w-full h-[260px]">{children}</div>
  </Card>
);

interface PainelUnificadoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PainelUnificado = ({ open, onOpenChange }: PainelUnificadoProps) => {
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoPainel>("dashboards");
  const [filtroAlertaSetor, setFiltroAlertaSetor] = useState("todos");
  const [filtroAlertaTipo, setFiltroAlertaTipo] = useState("todos");
  const { isCoordenacao, isGestor } = useAtendenteContext();

  const renderConteudo = () => {
    switch (secaoAtiva) {
      case "dashboards":
        return (
          <div className="space-y-6">
            <SectionHeader icon={LayoutGrid} title="Dashboards de Produtividade">
              <select className="px-3 py-1.5 border border-border/60 rounded-lg text-xs bg-background focus:outline-none focus:ring-2 focus:ring-primary/20">
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
                <option>Últimos 90 dias</option>
              </select>
            </SectionHeader>

            <FilterBar>
              <Select defaultValue="todos">
                <SelectTrigger className="w-40 h-8 text-xs">
                  <SelectValue placeholder="Setores" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos os Setores</SelectItem>
                  <SelectItem value="pre-venda">Pré-venda</SelectItem>
                  <SelectItem value="venda">Venda</SelectItem>
                  <SelectItem value="pos-venda">Pós-venda</SelectItem>
                  <SelectItem value="suporte">Suporte</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="todas">
                <SelectTrigger className="w-40 h-8 text-xs">
                  <SelectValue placeholder="Unidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Unidades</SelectItem>
                  <SelectItem value="sede">Sede - Vitória</SelectItem>
                  <SelectItem value="sp">Unidade São Paulo</SelectItem>
                  <SelectItem value="rj">Unidade Rio de Janeiro</SelectItem>
                </SelectContent>
              </Select>
            </FilterBar>

            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Total de Atendimentos" value={dadosEmpresaGrande.totalAtendimentos.toLocaleString()} accent />
              <MetricCard label="TMA – Tempo Médio Atend." value={dadosEmpresaGrande.tmaSetor} />
              <MetricCard label="TME – Tempo Médio Espera" value={dadosEmpresaGrande.tmeSetor} />
              <MetricCard label="Taxa de Resolutividade" value={`${dadosEmpresaGrande.taxaConclusao}%`} accent />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ChartCard title="Atendimentos por Dia da Semana">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosEmpresaGrande.atendimentosPorDia}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                    <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                    <Bar dataKey="atendimentos" fill="hsl(214, 85%, 51%)" radius={[6, 6, 0, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="TMA e TME Diário (minutos)">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={dadosEmpresaGrande.tmaTmePorDia}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                    <XAxis dataKey="dia" tick={{ fontSize: 11 }} />
                    <YAxis tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                    <Legend wrapperStyle={{ fontSize: 11 }} />
                    <Line type="monotone" dataKey="TMA" stroke="hsl(214, 85%, 51%)" strokeWidth={2} dot={{ r: 3 }} name="TMA" />
                    <Line type="monotone" dataKey="TME" stroke="hsl(214, 85%, 41%)" strokeWidth={2} dot={{ r: 3 }} name="TME" strokeDasharray="4 4" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Distribuição por Atendente">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={dadosEmpresaGrande.distribuicaoPorAtendente} layout="vertical">
                    <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                    <XAxis type="number" tick={{ fontSize: 11 }} />
                    <YAxis dataKey="nome" type="category" width={70} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                    <Bar dataKey="atendimentos" fill="hsl(214, 85%, 41%)" radius={[0, 6, 6, 0]} />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Status de Atendimentos">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={dadosEmpresaGrande.statusAtendimentos}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={85}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {dadosEmpresaGrande.statusAtendimentos.map((_, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>
            </div>

            {/* Horários de Pico */}
            <Card className="p-5 border-border/60">
              <h4 className="text-sm font-semibold text-foreground mb-4">Horários de Pico</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                {dadosEmpresaGrande.horariosPico.map((item) => (
                  <div key={item.horario} className="flex flex-col items-center p-3 rounded-lg bg-muted/20 border border-border/40">
                    <span className="text-sm font-semibold text-foreground">{item.horario}h</span>
                    <span className="text-xs text-muted-foreground mt-0.5">{item.msgs} msgs</span>
                    <span className={cn("mt-2 px-2.5 py-0.5 rounded-full text-[10px] font-semibold border", getNivelStyle(item.nivel))}>
                      {item.nivel}
                    </span>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case "roteiros":
        return <EditorRoteirosPanel onClose={() => {}} />;

      case "relatorios":
        return <RelatoriosInteligentesPanel />;

      case "nps":
        return (
          <div className="space-y-6">
            <SectionHeader icon={ThumbsUp} title="Net Promoter Score (NPS)">
              <Button variant="outline" size="sm" className="h-8 text-xs">
                <Download className="h-3.5 w-3.5 mr-1.5" />
                Gerar Relatório
              </Button>
            </SectionHeader>

            <FilterBar>
              <Select defaultValue="todos">
                <SelectTrigger className="w-32 h-8 text-xs">
                  <Users className="h-3 w-3 mr-1" />
                  <SelectValue placeholder="Atendente" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos</SelectItem>
                  <SelectItem value="geovana">Geovana</SelectItem>
                  <SelectItem value="paloma">Paloma</SelectItem>
                  <SelectItem value="emilly">Emilly</SelectItem>
                  <SelectItem value="marcos">Marcos</SelectItem>
                  <SelectItem value="bianca">Bianca</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="jan">
                <SelectTrigger className="w-28 h-8 text-xs">
                  <Calendar className="h-3 w-3 mr-1" />
                  <SelectValue placeholder="Mês" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="jan">Janeiro</SelectItem>
                  <SelectItem value="fev">Fevereiro</SelectItem>
                  <SelectItem value="mar">Março</SelectItem>
                  <SelectItem value="abr">Abril</SelectItem>
                  <SelectItem value="mai">Maio</SelectItem>
                  <SelectItem value="jun">Junho</SelectItem>
                  <SelectItem value="jul">Julho</SelectItem>
                  <SelectItem value="ago">Agosto</SelectItem>
                  <SelectItem value="set">Setembro</SelectItem>
                  <SelectItem value="out">Outubro</SelectItem>
                  <SelectItem value="nov">Novembro</SelectItem>
                  <SelectItem value="dez">Dezembro</SelectItem>
                </SelectContent>
              </Select>
              <Select defaultValue="2026">
                <SelectTrigger className="w-24 h-8 text-xs">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </FilterBar>

            {/* Metric cards */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <MetricCard label="Total Respondido" value={dadosEmpresaGrande.nps.totalRespondido} />
              <MetricCard label="NPS Médio" value={dadosEmpresaGrande.nps.npsMedio} accent />
              <MetricCard label="Promotores" value={dadosEmpresaGrande.nps.promotores} />
              <MetricCard label="Detratores" value={dadosEmpresaGrande.nps.detratores} />
            </div>

            {/* Charts */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
              <ChartCard title="NPS por Atendente">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={npsComparativo.porAtendente}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                    <XAxis dataKey="nome" tick={{ fontSize: 11 }} />
                    <YAxis domain={[0, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                    <Bar dataKey="nps" fill="hsl(214, 85%, 51%)" radius={[6, 6, 0, 0]} name="NPS" />
                  </BarChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Evolução Mensal do NPS">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={npsComparativo.evolucaoMensal}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                    <XAxis dataKey="mes" tick={{ fontSize: 11 }} />
                    <YAxis domain={[80, 100]} tick={{ fontSize: 11 }} />
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                    <Line type="monotone" dataKey="nps" stroke="hsl(214, 85%, 51%)" strokeWidth={2} dot={{ r: 3 }} name="NPS" />
                  </LineChart>
                </ResponsiveContainer>
              </ChartCard>

              <ChartCard title="Distribuição de Respostas">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={npsComparativo.distribuicao}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, value }) => `${name}: ${value}`}
                      outerRadius={85}
                      innerRadius={40}
                      fill="#8884d8"
                      dataKey="value"
                      strokeWidth={0}
                    >
                      {npsComparativo.distribuicao.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip contentStyle={{ borderRadius: 8, border: 'none', boxShadow: '0 4px 12px rgba(0,0,0,0.08)' }} />
                  </PieChart>
                </ResponsiveContainer>
              </ChartCard>

              {/* Feedbacks Recentes */}
              <Card className="p-5 border-border/60">
                <h4 className="text-sm font-semibold text-foreground mb-4">Feedbacks Recentes</h4>
                <div className="space-y-3 max-h-[260px] overflow-y-auto pr-1">
                  {dadosEmpresaGrande.nps.feedbacksRecentes.map((feedback, idx) => (
                    <div key={idx} className="p-3.5 rounded-lg border border-border/50 bg-muted/10">
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-sm font-medium text-foreground">{feedback.atendente}</span>
                        <span className="text-lg font-bold text-primary">{feedback.nota}/10</span>
                      </div>
                      <p className="text-xs text-muted-foreground italic leading-relaxed">"{feedback.comentario}"</p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );

      case "preditiva": {
        const setoresUnicos = Array.from(new Set(
          dadosEmpresaGrande.alertas.map(a => a.setor).filter(Boolean)
        ));

        const alertasFiltrados = dadosEmpresaGrande.alertas.filter((alerta) => {
          if (filtroAlertaSetor && filtroAlertaSetor !== "todos" && alerta.setor !== filtroAlertaSetor) return false;
          if (filtroAlertaTipo && filtroAlertaTipo !== "todos" && alerta.tipo !== filtroAlertaTipo) return false;
          return true;
        });

        return (
          <div className="space-y-6">
            <SectionHeader icon={TrendingUp} title="Thalí Preditiva" />

            <Tabs defaultValue="analise" className="w-full">
              <TabsList className="mb-5">
                <TabsTrigger value="analise" className="text-xs">Análise Preditiva</TabsTrigger>
                <TabsTrigger value="alertas" className="text-xs">Alertas</TabsTrigger>
              </TabsList>

              <TabsContent value="analise" className="space-y-6 mt-0">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <MetricCard label="Horário de Pico Previsto" value={dadosEmpresaGrande.preditiva.horarioPicoPrevisto} accent />
                  <MetricCard label="Volume Esperado Hoje" value={dadosEmpresaGrande.preditiva.volumeEsperadoHoje} />
                  <MetricCard label="Setor Mais Demandado" value={dadosEmpresaGrande.preditiva.setorMaisDemandado} />
                </div>

                <Card className="p-5 border-border/60">
                  <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                    <Lightbulb className="h-4 w-4 text-warning" />
                    Recomendações da Thalí
                  </h4>
                  <div className="space-y-2.5">
                    {dadosEmpresaGrande.preditiva.recomendacoes.map((rec, idx) => (
                      <div key={idx} className="flex items-start gap-3 p-3 rounded-lg bg-muted/15 border border-border/30">
                        <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                          <span className="text-[10px] font-bold text-primary">{idx + 1}</span>
                        </div>
                        <p className="text-xs text-foreground leading-relaxed flex-1">{rec}</p>
                      </div>
                    ))}
                  </div>
                </Card>
              </TabsContent>

              <TabsContent value="alertas" className="space-y-6 mt-0">
                <FilterBar>
                  <Select value={filtroAlertaSetor} onValueChange={setFiltroAlertaSetor}>
                    <SelectTrigger className="w-44 h-8 text-xs">
                      <SelectValue placeholder="Filtrar por setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os setores</SelectItem>
                      {setoresUnicos.map((setor) => (
                        <SelectItem key={setor} value={setor!}>{setor}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={filtroAlertaTipo} onValueChange={setFiltroAlertaTipo}>
                    <SelectTrigger className="w-44 h-8 text-xs">
                      <SelectValue placeholder="Filtrar por tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos os tipos</SelectItem>
                      {Array.from(new Set(dadosEmpresaGrande.alertas.map(a => a.tipo))).map((tipo) => (
                        <SelectItem key={tipo} value={tipo}>{tipo}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </FilterBar>

                <div className="space-y-3">
                  {alertasFiltrados.length > 0 ? alertasFiltrados.map((alerta, idx) => (
                    <Card
                      key={idx}
                      className={cn(
                        "p-4 border-l-[3px] border-border/60",
                        alerta.cor === "red" && "border-l-destructive bg-destructive/5",
                        alerta.cor === "orange" && "border-l-warning bg-warning/5",
                        alerta.cor === "yellow" && "border-l-warning bg-warning/5"
                      )}
                    >
                      <div className="flex items-start gap-3">
                        <div className={cn(
                          "w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0",
                          alerta.cor === "red" && "bg-destructive/10",
                          alerta.cor === "orange" && "bg-warning/10",
                          alerta.cor === "yellow" && "bg-warning/10"
                        )}>
                          <Bell className={cn(
                            "h-4 w-4",
                            alerta.cor === "red" && "text-destructive",
                            alerta.cor === "orange" && "text-warning",
                            alerta.cor === "yellow" && "text-warning"
                          )} />
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm font-medium text-foreground mb-0.5">
                            {alerta.tipo}
                            {alerta.setor && ` · ${alerta.setor}`}
                            {alerta.atendente && ` · ${alerta.atendente}`}
                          </h4>
                          <p className="text-xs text-muted-foreground leading-relaxed">{alerta.detalhes}</p>
                        </div>
                      </div>
                    </Card>
                  )) : (
                    <div className="text-center py-12 text-sm text-muted-foreground">
                      Nenhum alerta encontrado com os filtros selecionados
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </div>
        );
      }

      case "feedback":
        return (
          <div className="space-y-6">
            <SectionHeader icon={MessageSquare} title="Feedback Gerado pela Thalí" />

            <Card className="p-5 border-border/60">
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <ThumbsUp className="h-4 w-4 text-success" />
                Elogios
              </h4>
              <div className="space-y-2.5">
                {dadosEmpresaGrande.feedbackIA.elogios.map((elogio, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-success/5 border border-success/15">
                    <div className="text-sm font-medium text-foreground mb-0.5">{elogio.atendente}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{elogio.motivo}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-5 border-border/60">
              <h4 className="text-sm font-semibold text-foreground mb-4 flex items-center gap-2">
                <TrendingUp className="h-4 w-4 text-warning" />
                Oportunidades de Melhoria
              </h4>
              <div className="space-y-2.5">
                {dadosEmpresaGrande.feedbackIA.melhorias.map((melhoria, idx) => (
                  <div key={idx} className="p-3.5 rounded-lg bg-warning/5 border border-warning/15">
                    <div className="text-sm font-medium text-foreground mb-0.5">{melhoria.atendente}</div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{melhoria.motivo}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case "indicadores":
        return (
          <div className="space-y-6">
            <SectionHeader icon={Activity} title="Indicadores Personalizados">
              {(isCoordenacao || isGestor) && (
                <Button size="sm" className="h-8 text-xs">
                  <Activity className="h-3.5 w-3.5 mr-1.5" />
                  Criar Indicador
                </Button>
              )}
            </SectionHeader>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dadosEmpresaGrande.indicadores.map((indicador, idx) => (
                <MetricCard key={idx} label={indicador.nome} value={indicador.valor} accent />
              ))}
            </div>
          </div>
        );

      case "auditoria":
        return <AuditoriaAcoesPanel />;

      case "ideias":
        return <CentralIdeiasPanel />;

      case "etiquetas":
        return <EtiquetasManagementPanel />;

      case "configuracoes":
        return <ConfiguracoesFilaPanel />;

      default:
        return <div>Seção em desenvolvimento</div>;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[95vw] w-[95vw] h-[90vh] p-0 gap-0 overflow-hidden">
        <div className="flex h-full overflow-hidden">
          {/* Sidebar */}
          <div className="w-56 border-r border-border/60 bg-muted/10 flex flex-col flex-shrink-0">
            <div className="px-5 py-5 border-b border-border/40 flex-shrink-0">
              <div className="flex items-center gap-2.5">
                <div className="w-7 h-7 bg-primary rounded-lg flex items-center justify-center">
                  <LayoutGrid className="h-3.5 w-3.5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="text-sm font-bold text-foreground leading-tight">Painel Estratégico</h2>
                  <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">Grupo Liruz</p>
                </div>
              </div>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-3 space-y-4">
                {menuBlocks.map((block) => {
                  const visibleItems = block.items.filter(
                    (item) => !item.apenasGestor || isGestor || isCoordenacao
                  );
                  if (visibleItems.length === 0) return null;

                  return (
                    <div key={block.title}>
                      <p className="px-3 mb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                        {block.title}
                      </p>
                      <div className="space-y-0.5">
                        {visibleItems.map((item) => (
                          <button
                            key={item.id}
                            onClick={() => setSecaoAtiva(item.id)}
                            className={cn(
                              "w-full flex items-center gap-2.5 px-3 py-2 rounded-lg text-left transition-all duration-150",
                              "hover:bg-primary/5",
                              secaoAtiva === item.id
                                ? "bg-primary text-primary-foreground shadow-sm"
                                : "text-muted-foreground hover:text-foreground"
                            )}
                          >
                            <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
                            <span className="text-xs font-medium truncate">{item.label}</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </ScrollArea>
          </div>

          {/* Main content */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <div className="px-6 py-3.5 border-b border-border/40 bg-background flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2.5 min-w-0">
                {(() => {
                  const allItems = menuBlocks.flatMap(b => b.items);
                  const activeItem = allItems.find((m) => m.id === secaoAtiva);
                  if (activeItem) {
                    const IconComponent = activeItem.icon;
                    return <IconComponent className="h-4 w-4 text-primary flex-shrink-0" />;
                  }
                  return null;
                })()}
                <h3 className="text-sm font-semibold text-foreground truncate">
                  {menuBlocks.flatMap(b => b.items).find((m) => m.id === secaoAtiva)?.label}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="flex-shrink-0 h-8 w-8"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6 pb-10 max-w-full">{renderConteudo()}</div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
