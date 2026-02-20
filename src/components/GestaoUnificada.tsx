import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Building, Users, ShieldCheck, Phone, Bot, FileText, BarChart3,
  Map, UserCheck, Bell, Code2, Save, Plus, Copy, RefreshCw, Pencil,
  LayoutGrid, ThumbsUp, TrendingUp, MessageSquare, Activity, History,
  Lightbulb, X, Award, Settings, Filter, Calendar, Download, ChevronDown,
  Gauge, Star, Zap, BookOpen, Tag, ClipboardList, Brain, AlertTriangle,
  Workflow, type LucideIcon,
} from "lucide-react";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { cn } from "@/lib/utils";
import { useAtendenteContext } from "@/contexts/AtendenteContext";

// Hooks
import { useEmpresas, useAtualizarEmpresa } from "@/hooks/useEmpresas";
import { useUnidades, useCriarUnidade } from "@/hooks/useUnidades";
import { useSetores } from "@/hooks/useSetores";
import { usePerfisAcesso, PerfilAcesso } from "@/hooks/usePerfisAcesso";
import { useAtendentes } from "@/hooks/useAtendentes";
import { useMensageriaConfig, useAtualizarMensageriaConfig } from "@/hooks/useMensageriaConfig";
import { useUraConfig, useAtualizarUraConfig } from "@/hooks/useUraConfig";

// Sub-panels
import { ValidacoesPerfilPanel } from "./ValidacoesPerfilPanel";
import { ApiWebhooksManager } from "./ApiWebhooksManager";
import { ApiLogsViewer } from "./ApiLogsViewer";
import { ApiDocsPanel } from "./ApiDocsPanel";
import { IAConfigPanel } from "./IAConfigPanel";
import { FigurinhasManagement } from "./FigurinhasManagement";
import { DocumentosThaliPanel } from "./DocumentosThaliPanel";
import { CriarSetorDialog } from "./CriarSetorDialog";
import { CriarUsuarioDialog } from "./CriarUsuarioDialog";
import { EditarUsuarioDialog } from "./EditarUsuarioDialog";
import { CriarPerfilAcessoDialog } from "./CriarPerfilAcessoDialog";
import { EditarPerfilAcessoDialog } from "./EditarPerfilAcessoDialog";
import { EditarUnidadeDialog } from "./EditarUnidadeDialog";
import { MensagensRapidasManagement } from "./MensagensRapidasManagement";
import { ConfiguracoesFilaPanel } from "./ConfiguracoesFilaPanel";
import { EditorRoteirosPanel } from "./EditorRoteirosPanel";
import { RelatoriosInteligentesPanel } from "./RelatoriosInteligentesPanel";
import { CentralIdeiasPanel } from "./CentralIdeiasPanel";
import { AuditoriaAcoesPanel } from "./AuditoriaAcoesPanel";
import { EtiquetasManagementPanel } from "./EtiquetasManagementPanel";

// UI
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Switch } from "@/components/ui/switch";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue,
} from "@/components/ui/select";

// ─── Data ─────────────────────────────────────────────────
const dadosEmpresaGrande = {
  totalAtendimentos: 2847, tmaSetor: "3m 42s", tmeSetor: "5m 11s", taxaConclusao: 87,
  atendimentosPorDia: [
    { dia: "Seg", atendimentos: 412 }, { dia: "Ter", atendimentos: 386 },
    { dia: "Qua", atendimentos: 502 }, { dia: "Qui", atendimentos: 631 },
    { dia: "Sex", atendimentos: 713 }, { dia: "Sáb", atendimentos: 279 },
    { dia: "Dom", atendimentos: 194 },
  ],
  tmaTmePorDia: [
    { dia: "Seg", TMA: 3.2, TME: 4.8 }, { dia: "Ter", TMA: 3.4, TME: 5.3 },
    { dia: "Qua", TMA: 3.5, TME: 6.1 }, { dia: "Qui", TMA: 3.2, TME: 5.8 },
    { dia: "Sex", TMA: 2.9, TME: 4.7 }, { dia: "Sáb", TMA: 4.6, TME: 7.4 },
    { dia: "Dom", TMA: 5.1, TME: 8.1 },
  ],
  distribuicaoPorAtendente: [
    { nome: "Geovana", atendimentos: 314 }, { nome: "Paloma", atendimentos: 287 },
    { nome: "Emilly", atendimentos: 274 }, { nome: "Marcos", atendimentos: 251 },
    { nome: "Bianca", atendimentos: 229 },
  ],
  statusAtendimentos: [
    { name: "Finalizados", value: 1124 }, { name: "Em Atendimento", value: 382 },
    { name: "Aguardando", value: 514 }, { name: "Em Fila", value: 827 },
  ],
  horariosPico: [
    { horario: "08-09", msgs: 45, nivel: "Médio" }, { horario: "09-10", msgs: 62, nivel: "Alto" },
    { horario: "10-11", msgs: 88, nivel: "Muito Alto" }, { horario: "11-12", msgs: 44, nivel: "Médio" },
    { horario: "12-13", msgs: 29, nivel: "Baixo" }, { horario: "13-14", msgs: 56, nivel: "Alto" },
  ],
  npsGeral: 92, porcentagemTransferencia: 13, taxaReabertura: 8,
  nps: {
    totalRespondido: 208, npsMedio: 92, promotores: 168, neutros: 22, detratores: 18,
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
    horarioPicoPrevisto: "10h–11h", volumeEsperadoHoje: 921, setorMaisDemandado: "Pré-cirurgia",
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
    melhorias: [{ atendente: "Marcos", motivo: "NPS baixo recorrente nas últimas 72h" }],
  },
  indicadores: [
    { nome: "Volume mensal", valor: "12.214" },
    { nome: "Atendimentos complexos", valor: "431" },
    { nome: "Taxa de resolutividade", valor: "89%" },
  ],
};

const npsComparativo = {
  porAtendente: [
    { nome: "Geovana", nps: 95, atendimentos: 314 }, { nome: "Emilly", nps: 92, atendimentos: 298 },
    { nome: "Paloma", nps: 93, atendimentos: 283 }, { nome: "Marcos", nps: 74, atendimentos: 251 },
    { nome: "Bianca", nps: 88, atendimentos: 229 },
  ],
  evolucaoMensal: [
    { mes: "Jul", nps: 87 }, { mes: "Ago", nps: 89 }, { mes: "Set", nps: 91 },
    { mes: "Out", nps: 90 }, { mes: "Nov", nps: 92 }, { mes: "Dez", nps: 92 },
  ],
  distribuicao: [
    { name: "Promotores", value: 168, color: "hsl(142, 71%, 45%)" },
    { name: "Neutros", value: 22, color: "hsl(48, 89%, 48%)" },
    { name: "Detratores", value: 18, color: "hsl(0, 84%, 60%)" },
  ],
};

const COLORS = ["hsl(214, 85%, 51%)", "hsl(214, 85%, 41%)", "hsl(142, 71%, 45%)", "hsl(210, 14%, 72%)"];

const alertasMeta = [
  { id: "fila_alta", nome: "Fila Alta", desc: "Quando a fila de espera exceder o limite configurado" },
  { id: "tempo_espera", nome: "Tempo excessivo de espera", desc: "Paciente aguardando além do tempo aceitável" },
  { id: "nps_baixo", nome: "NPS baixo", desc: "Quando o NPS cair abaixo do esperado" },
  { id: "atendente_tempo", nome: "Atendente com tempo elevado", desc: "Atendente com TMA acima da meta" },
  { id: "pico_atendimento", nome: "Pico de atendimento", desc: "Volume de atendimentos acima do normal" },
  { id: "relatorio_critico", nome: "Relatório crítico", desc: "Relatório com indicadores fora do padrão" },
];

const getNivelStyle = (nivel: string) => {
  switch (nivel) {
    case "Muito Alto": return "bg-destructive/10 text-destructive border-destructive/20";
    case "Alto": return "bg-warning/10 text-warning border-warning/20";
    case "Médio": return "bg-primary/10 text-primary border-primary/20";
    case "Baixo": return "bg-success/10 text-success border-success/20";
    default: return "bg-muted text-muted-foreground";
  }
};

// ─── Helpers ──────────────────────────────────────────────
const MetricCard = ({ label, value, accent = false }: { label: string; value: string | number; accent?: boolean }) => (
  <Card className="p-4 border-border/60">
    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</p>
    <p className={cn("text-xl font-bold", accent ? "text-primary" : "text-foreground")}>{value}</p>
  </Card>
);

const ChartCard = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
  <Card className={cn("p-4 border-border/60", className)}>
    <h4 className="text-xs font-semibold text-foreground mb-3">{title}</h4>
    <div className="w-full h-[220px]">{children}</div>
  </Card>
);

const tooltipStyle = { borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" };

// ─── Menu definition ──────────────────────────────────────
interface MenuItem {
  id: string;
  label: string;
  icon: LucideIcon;
}

interface MenuBlock {
  title: string;
  items: MenuItem[];
}

const menuBlocks: MenuBlock[] = [
  {
    title: "Visão Estratégica",
    items: [
      { id: "dashboard", label: "Dashboard", icon: BarChart3 },
      { id: "relatorios", label: "Relatórios Inteligentes", icon: FileText },
      { id: "nps", label: "NPS", icon: Star },
      { id: "indicadores", label: "Indicadores", icon: Gauge },
      { id: "feedback", label: "Feedback Thalí", icon: ThumbsUp },
    ],
  },
  {
    title: "Estrutura",
    items: [
      { id: "empresa", label: "Empresa", icon: Building2 },
      { id: "unidades", label: "Unidades", icon: Building },
      { id: "setores", label: "Setores", icon: LayoutGrid },
    ],
  },
  {
    title: "Equipe",
    items: [
      { id: "usuarios", label: "Usuários", icon: Users },
      { id: "perfis", label: "Perfis de Acesso", icon: ShieldCheck },
      { id: "validacoes", label: "Validações", icon: UserCheck },
    ],
  },
  {
    title: "Operação",
    items: [
      { id: "mensagens_rapidas", label: "Mensagens Rápidas", icon: MessageSquare },
      { id: "ura", label: "URA (Telefonia)", icon: Phone },
      { id: "thali_mensageria", label: "Thalí e Mensageria", icon: Bot },
      { id: "roteiros", label: "Roteiros", icon: BookOpen },
      { id: "etiquetas", label: "Etiquetas", icon: Tag },
    ],
  },
  {
    title: "Controle",
    items: [
      { id: "alertas_config", label: "Config. Alertas", icon: Bell },
      { id: "preditiva", label: "Thalí Preditiva", icon: Brain },
      { id: "auditoria", label: "Auditoria", icon: ClipboardList },
      { id: "ideias", label: "Central de Ideias", icon: Lightbulb },
    ],
  },
  {
    title: "Integrações",
    items: [
      { id: "api_webhooks", label: "API e Webhooks", icon: Code2 },
      { id: "configuracoes", label: "Configurações Gerais", icon: Settings },
    ],
  },
];

// ─── Main Component ───────────────────────────────────────
export const GestaoUnificada = () => {
  const navigate = useNavigate();
  const { isCoordenacao, isGestor } = useAtendenteContext();
  const [activeSection, setActiveSection] = useState("dashboard");

  // Data hooks
  const { data: empresas } = useEmpresas();
  const { data: unidades } = useUnidades();
  const { data: setores } = useSetores();
  const { data: perfis } = usePerfisAcesso();
  const { data: atendentes } = useAtendentes();
  const { data: mensageriaConfig } = useMensageriaConfig();
  const { data: uraConfig } = useUraConfig();

  // Mutations
  const atualizarEmpresa = useAtualizarEmpresa();
  const criarUnidade = useCriarUnidade();
  const atualizarMensageria = useAtualizarMensageriaConfig();
  const atualizarUra = useAtualizarUraConfig();

  // Form states
  const [empresaForm, setEmpresaForm] = useState({ nome: "", cnpj: "", endereco: "", responsavel: "" });
  const [novaUnidade, setNovaUnidade] = useState({ nome: "", codigo_interno: "", endereco: "", fuso_horario: "GMT-3" });
  const [unidadeParaEditar, setUnidadeParaEditar] = useState<any>(null);
  const [uraForm, setUraForm] = useState({ mensagem_boas_vindas: "", mensagem_espera: "", mensagem_fora_expediente: "", ativo: true });
  const [iaForm, setIaForm] = useState({ robo_ativo: false, ia_ativa: false });

  // Dialog states
  const [validacoesOpen, setValidacoesOpen] = useState(false);
  const [criarSetorOpen, setCriarSetorOpen] = useState(false);
  const [criarUsuarioOpen, setCriarUsuarioOpen] = useState(false);
  const [editarUsuarioOpen, setEditarUsuarioOpen] = useState(false);
  const [usuarioParaEditar, setUsuarioParaEditar] = useState<any>(null);
  const [criarPerfilOpen, setCriarPerfilOpen] = useState(false);
  const [editarPerfilOpen, setEditarPerfilOpen] = useState(false);
  const [perfilParaEditar, setPerfilParaEditar] = useState<PerfilAcesso | null>(null);

  // Alert states
  const [filtroAlertaSetor, setFiltroAlertaSetor] = useState("todos");
  const [filtroAlertaTipo, setFiltroAlertaTipo] = useState("todos");
  const [alertasConfig, setAlertasConfig] = useState<Record<string, { ativo: boolean; intensidade: string; intervalo: number }>>({
    fila_alta: { ativo: true, intensidade: "moderado", intervalo: 5 },
    tempo_espera: { ativo: true, intensidade: "intenso", intervalo: 3 },
    nps_baixo: { ativo: true, intensidade: "moderado", intervalo: 10 },
    atendente_tempo: { ativo: false, intensidade: "leve", intervalo: 5 },
    pico_atendimento: { ativo: true, intensidade: "leve", intervalo: 15 },
    relatorio_critico: { ativo: false, intensidade: "moderado", intervalo: 5 },
  });
  const [apiConfig] = useState({ chave_api: "LIRUZ-API-KEY-001" });

  // Handlers
  const handleSalvarEmpresa = () => {
    if (empresas?.[0]) atualizarEmpresa.mutate({ id: empresas[0].id, dados: empresaForm });
  };
  const handleCriarUnidade = () => {
    criarUnidade.mutate(novaUnidade);
    setNovaUnidade({ nome: "", codigo_interno: "", endereco: "", fuso_horario: "GMT-3" });
  };
  const handleSalvarUra = () => {
    if (uraConfig?.[0]) atualizarUra.mutate({ id: uraConfig[0].id, dados: uraForm });
  };
  const handleSalvarIA = () => {
    if (mensageriaConfig?.[0]) atualizarMensageria.mutate({ id: mensageriaConfig[0].id, dados: iaForm });
  };

  // ─── Individual render functions ─────

  // Dashboard
  const renderDashboard = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Total Atendimentos" value={dadosEmpresaGrande.totalAtendimentos.toLocaleString()} accent />
        <MetricCard label="TMA" value={dadosEmpresaGrande.tmaSetor} />
        <MetricCard label="TME" value={dadosEmpresaGrande.tmeSetor} />
        <MetricCard label="Resolutividade" value={`${dadosEmpresaGrande.taxaConclusao}%`} accent />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="Atendimentos por Dia">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosEmpresaGrande.atendimentosPorDia}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
              <XAxis dataKey="dia" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="atendimentos" fill="hsl(214, 85%, 51%)" radius={[5, 5, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="TMA e TME Diário (min)">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={dadosEmpresaGrande.tmaTmePorDia}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
              <XAxis dataKey="dia" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={{ fontSize: 10 }} />
              <Line type="monotone" dataKey="TMA" stroke="hsl(214, 85%, 51%)" strokeWidth={2} dot={{ r: 2 }} />
              <Line type="monotone" dataKey="TME" stroke="hsl(214, 85%, 41%)" strokeWidth={2} dot={{ r: 2 }} strokeDasharray="4 4" />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Distribuição por Atendente">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={dadosEmpresaGrande.distribuicaoPorAtendente} layout="vertical">
              <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
              <XAxis type="number" tick={{ fontSize: 10 }} />
              <YAxis dataKey="nome" type="category" width={60} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="atendimentos" fill="hsl(214, 85%, 41%)" radius={[0, 5, 5, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Status de Atendimentos">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={dadosEmpresaGrande.statusAtendimentos} cx="50%" cy="50%" labelLine={false}
                label={({ name, value }) => `${name}: ${value}`} outerRadius={75} innerRadius={35}
                dataKey="value" strokeWidth={0}>
                {dadosEmpresaGrande.statusAtendimentos.map((_, i) => (
                  <Cell key={i} fill={COLORS[i % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
      </div>
      <Card className="p-4 border-border/60">
        <h4 className="text-xs font-semibold text-foreground mb-3">Horários de Pico</h4>
        <div className="grid grid-cols-3 lg:grid-cols-6 gap-2">
          {dadosEmpresaGrande.horariosPico.map((item) => (
            <div key={item.horario} className="flex flex-col items-center p-2.5 rounded-lg bg-muted/20 border border-border/40">
              <span className="text-xs font-semibold">{item.horario}h</span>
              <span className="text-[10px] text-muted-foreground">{item.msgs} msgs</span>
              <span className={cn("mt-1.5 px-2 py-0.5 rounded-full text-[9px] font-semibold border", getNivelStyle(item.nivel))}>{item.nivel}</span>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // NPS
  const renderNps = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Total Respondido" value={dadosEmpresaGrande.nps.totalRespondido} />
        <MetricCard label="NPS Médio" value={dadosEmpresaGrande.nps.npsMedio} accent />
        <MetricCard label="Promotores" value={dadosEmpresaGrande.nps.promotores} />
        <MetricCard label="Detratores" value={dadosEmpresaGrande.nps.detratores} />
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <ChartCard title="NPS por Atendente">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={npsComparativo.porAtendente}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
              <XAxis dataKey="nome" tick={{ fontSize: 10 }} /><YAxis domain={[0, 100]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Bar dataKey="nps" fill="hsl(214, 85%, 51%)" radius={[5, 5, 0, 0]} name="NPS" />
            </BarChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Evolução Mensal do NPS">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={npsComparativo.evolucaoMensal}>
              <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
              <XAxis dataKey="mes" tick={{ fontSize: 10 }} /><YAxis domain={[80, 100]} tick={{ fontSize: 10 }} />
              <Tooltip contentStyle={tooltipStyle} />
              <Line type="monotone" dataKey="nps" stroke="hsl(214, 85%, 51%)" strokeWidth={2} dot={{ r: 2 }} />
            </LineChart>
          </ResponsiveContainer>
        </ChartCard>
        <ChartCard title="Distribuição de Respostas">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie data={npsComparativo.distribuicao} cx="50%" cy="50%" labelLine={false}
                label={({ name, value }) => `${name}: ${value}`} outerRadius={75} innerRadius={35}
                dataKey="value" strokeWidth={0}>
                {npsComparativo.distribuicao.map((entry, i) => (
                  <Cell key={i} fill={entry.color} />
                ))}
              </Pie>
              <Tooltip contentStyle={tooltipStyle} />
            </PieChart>
          </ResponsiveContainer>
        </ChartCard>
        <Card className="p-4 border-border/60">
          <h4 className="text-xs font-semibold mb-3">Feedbacks Recentes</h4>
          <div className="space-y-2.5">
            {dadosEmpresaGrande.nps.feedbacksRecentes.map((fb, i) => (
              <div key={i} className="p-3 rounded-lg border border-border/50 bg-muted/10">
                <div className="flex items-center justify-between mb-1">
                  <span className="text-xs font-medium">{fb.atendente}</span>
                  <span className="text-sm font-bold text-primary">{fb.nota}/10</span>
                </div>
                <p className="text-[10px] text-muted-foreground italic">"{fb.comentario}"</p>
              </div>
            ))}
          </div>
        </Card>
      </div>
    </div>
  );

  // Indicadores
  const renderIndicadores = () => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
      {dadosEmpresaGrande.indicadores.map((ind, i) => (
        <MetricCard key={i} label={ind.nome} value={ind.valor} accent />
      ))}
    </div>
  );

  // Feedback
  const renderFeedback = () => (
    <div className="space-y-5">
      <Card className="p-4 border-border/60">
        <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
          <ThumbsUp className="h-3.5 w-3.5 text-success" /> Elogios
        </h4>
        <div className="space-y-2">
          {dadosEmpresaGrande.feedbackIA.elogios.map((e, i) => (
            <div key={i} className="p-3 rounded-lg bg-success/5 border border-success/15">
              <div className="text-xs font-medium">{e.atendente}</div>
              <p className="text-[10px] text-muted-foreground">{e.motivo}</p>
            </div>
          ))}
        </div>
      </Card>
      <Card className="p-4 border-border/60">
        <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
          <TrendingUp className="h-3.5 w-3.5 text-warning" /> Oportunidades de Melhoria
        </h4>
        <div className="space-y-2">
          {dadosEmpresaGrande.feedbackIA.melhorias.map((m, i) => (
            <div key={i} className="p-3 rounded-lg bg-warning/5 border border-warning/15">
              <div className="text-xs font-medium">{m.atendente}</div>
              <p className="text-[10px] text-muted-foreground">{m.motivo}</p>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );

  // Empresa
  const renderEmpresa = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Dados da Empresa</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Nome</Label>
              <Input value={empresaForm.nome} onChange={(e) => setEmpresaForm({ ...empresaForm, nome: e.target.value })} placeholder="Grupo Liruz" className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">CNPJ</Label>
              <Input value={empresaForm.cnpj} onChange={(e) => setEmpresaForm({ ...empresaForm, cnpj: e.target.value })} placeholder="28.443.771/0001-92" className="h-8 text-xs" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Endereço</Label>
            <Input value={empresaForm.endereco} onChange={(e) => setEmpresaForm({ ...empresaForm, endereco: e.target.value })} placeholder="Av. Nossa Senhora da Penha, 1500" className="h-8 text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Responsável</Label>
            <Input value={empresaForm.responsavel} onChange={(e) => setEmpresaForm({ ...empresaForm, responsavel: e.target.value })} placeholder="Nome do responsável" className="h-8 text-xs" />
          </div>
          <Button onClick={handleSalvarEmpresa} size="sm" className="w-full h-8 text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" /> Salvar
          </Button>
        </CardContent>
      </Card>
      {empresas?.[0] && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Dados Atuais</CardTitle></CardHeader>
          <CardContent className="space-y-1.5 text-xs">
            <div className="flex justify-between"><span className="text-muted-foreground">Nome:</span><span className="font-medium">{empresas[0].nome}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">CNPJ:</span><span className="font-medium">{empresas[0].cnpj || "—"}</span></div>
            <div className="flex justify-between"><span className="text-muted-foreground">Endereço:</span><span className="font-medium text-right">{empresas[0].endereco || "—"}</span></div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Unidades
  const renderUnidades = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Nova Unidade</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1.5">
              <Label className="text-xs">Nome</Label>
              <Input value={novaUnidade.nome} onChange={(e) => setNovaUnidade({ ...novaUnidade, nome: e.target.value })} placeholder="Unidade São Paulo" className="h-8 text-xs" />
            </div>
            <div className="space-y-1.5">
              <Label className="text-xs">Código</Label>
              <Input value={novaUnidade.codigo_interno} onChange={(e) => setNovaUnidade({ ...novaUnidade, codigo_interno: e.target.value })} placeholder="SP01" className="h-8 text-xs" />
            </div>
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Endereço</Label>
            <Input value={novaUnidade.endereco} onChange={(e) => setNovaUnidade({ ...novaUnidade, endereco: e.target.value })} placeholder="Av. Paulista, 1000" className="h-8 text-xs" />
          </div>
          <Button onClick={handleCriarUnidade} size="sm" className="w-full h-8 text-xs">
            <Plus className="h-3.5 w-3.5 mr-1.5" /> Criar Unidade
          </Button>
        </CardContent>
      </Card>
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Unidades Cadastradas</CardTitle></CardHeader>
        <CardContent>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {unidades?.map((u) => (
                <div key={u.id} className="p-3 border rounded-lg">
                  <div className="flex items-center justify-between">
                    <h4 className="text-xs font-semibold">{u.nome}</h4>
                    <div className="flex items-center gap-1.5">
                      <Badge variant={u.ativo ? "default" : "secondary"} className="text-[10px]">{u.ativo ? "Ativa" : "Inativa"}</Badge>
                      <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => setUnidadeParaEditar(u)}>
                        <Pencil className="h-3 w-3" />
                      </Button>
                    </div>
                  </div>
                  <p className="text-[10px] text-muted-foreground mt-1">Código: {u.codigo_interno || "—"} · {u.endereco || "—"}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </CardContent>
      </Card>
      <EditarUnidadeDialog open={!!unidadeParaEditar} onOpenChange={(o) => !o && setUnidadeParaEditar(null)} unidade={unidadeParaEditar} />
    </div>
  );

  // Setores
  const renderSetores = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Setores cadastrados no sistema</p>
        <Button size="sm" className="h-8 text-xs" onClick={() => setCriarSetorOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Novo setor
        </Button>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {setores?.map((s) => (
          <div key={s.id} className="p-3 border rounded-lg">
            <div className="flex items-center gap-2">
              <div className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: s.cor || "#888" }} />
              <h4 className="text-xs font-semibold">{s.nome}</h4>
            </div>
            {s.descricao && <p className="text-[10px] text-muted-foreground mt-1">{s.descricao}</p>}
            <div className="flex gap-1.5 mt-2 flex-wrap">
              {s.recebe_ligacoes && <Badge variant="outline" className="text-[9px] py-0"><Phone className="h-2.5 w-2.5 mr-0.5" />Ligações</Badge>}
              {s.recebe_mensagens && <Badge variant="outline" className="text-[9px] py-0"><Bot className="h-2.5 w-2.5 mr-0.5" />Mensagens</Badge>}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Usuarios
  const renderUsuarios = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">{atendentes?.length || 0} usuários cadastrados</p>
        <Button size="sm" className="h-8 text-xs" onClick={() => setCriarUsuarioOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Novo usuário
        </Button>
      </div>
      <ScrollArea className="h-[400px]">
        <div className="space-y-2">
          {atendentes?.map((u) => (
            <div key={u.id} className="flex items-center gap-3 p-3 border rounded-lg">
              <Avatar className="h-8 w-8">
                <AvatarImage src={u.avatar || undefined} />
                <AvatarFallback className="text-[10px]">{u.nome.substring(0, 2).toUpperCase()}</AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold truncate">{u.nome}</h4>
                <p className="text-[10px] text-muted-foreground truncate">{u.email}</p>
              </div>
              <Badge variant={u.ativo ? "default" : "secondary"} className="text-[10px]">{u.ativo ? "Ativo" : "Inativo"}</Badge>
              <Badge variant="outline" className="text-[10px]">{u.cargo}</Badge>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setUsuarioParaEditar(u); setEditarUsuarioOpen(true); }}>
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </ScrollArea>
    </div>
  );

  // Perfis
  const renderPerfis = () => (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <p className="text-xs text-muted-foreground">Perfis de acesso configurados</p>
        <Button size="sm" className="h-8 text-xs" onClick={() => setCriarPerfilOpen(true)}>
          <Plus className="h-3.5 w-3.5 mr-1.5" /> Novo perfil
        </Button>
      </div>
      <div className="space-y-3">
        {perfis?.map((p) => (
          <div key={p.id} className="p-3 border rounded-lg space-y-2">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-semibold">{p.nome}</h4>
              <Button variant="ghost" size="icon" className="h-7 w-7" onClick={() => { setPerfilParaEditar(p); setEditarPerfilOpen(true); }}>
                <Pencil className="h-3 w-3" />
              </Button>
            </div>
            {p.descricao && <p className="text-[10px] text-muted-foreground">{p.descricao}</p>}
            <div className="flex flex-wrap gap-1">
              {p.permissoes && Object.entries(p.permissoes).filter(([_, v]) => v).map(([k]) => (
                <Badge key={k} variant="outline" className="text-[9px] py-0">{k.replace(/_/g, " ")}</Badge>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  // Validações
  const renderValidacoes = () => (
    <div className="space-y-3">
      <p className="text-xs text-muted-foreground">Aprove ou reprove alterações solicitadas pelos usuários.</p>
      <Button size="sm" className="h-8 text-xs" onClick={() => setValidacoesOpen(true)}>Abrir Painel de Validações</Button>
    </div>
  );

  // URA
  const renderUra = () => (
    <div className="space-y-4">
      <Card>
        <CardHeader className="pb-3"><CardTitle className="text-sm">Configurações de URA</CardTitle></CardHeader>
        <CardContent className="space-y-3">
          <div className="flex items-center justify-between">
            <div><Label className="text-xs">URA Ativa</Label><p className="text-[10px] text-muted-foreground">Ativar/desativar sistema de URA</p></div>
            <Switch checked={uraForm.ativo} onCheckedChange={(c) => setUraForm({ ...uraForm, ativo: c })} />
          </div>
          <Separator />
          <div className="space-y-1.5">
            <Label className="text-xs">Mensagem de Boas-vindas</Label>
            <Textarea value={uraForm.mensagem_boas_vindas} onChange={(e) => setUraForm({ ...uraForm, mensagem_boas_vindas: e.target.value })} placeholder="Bem-vindo ao Grupo Liruz..." rows={2} className="text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Mensagem de Espera</Label>
            <Textarea value={uraForm.mensagem_espera} onChange={(e) => setUraForm({ ...uraForm, mensagem_espera: e.target.value })} placeholder="Por favor, aguarde..." rows={2} className="text-xs" />
          </div>
          <div className="space-y-1.5">
            <Label className="text-xs">Mensagem Fora do Expediente</Label>
            <Textarea value={uraForm.mensagem_fora_expediente} onChange={(e) => setUraForm({ ...uraForm, mensagem_fora_expediente: e.target.value })} placeholder="Nosso horário de atendimento é..." rows={2} className="text-xs" />
          </div>
          <Button onClick={handleSalvarUra} size="sm" className="w-full h-8 text-xs">
            <Save className="h-3.5 w-3.5 mr-1.5" /> Salvar Configurações URA
          </Button>
        </CardContent>
      </Card>
      {uraConfig?.[0] && (
        <Card>
          <CardHeader className="pb-3"><CardTitle className="text-sm">Opções do Menu URA</CardTitle></CardHeader>
          <CardContent className="space-y-1.5">
            <div className="p-2.5 border rounded-lg"><p className="text-xs font-medium">Tecla 1 → Pré-venda</p></div>
            <div className="p-2.5 border rounded-lg"><p className="text-xs font-medium">Tecla 2 → Convênios</p></div>
            <div className="p-2.5 border rounded-lg"><p className="text-xs font-medium">Tecla 3 → Comercial Connect</p></div>
          </CardContent>
        </Card>
      )}
    </div>
  );

  // Thalí e Mensageria
  const renderThaliMensageria = () => (
    <Tabs defaultValue="config" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-3">
        <TabsTrigger value="config" className="text-xs">Configurações</TabsTrigger>
        <TabsTrigger value="documentos" className="text-xs">Documentos</TabsTrigger>
        <TabsTrigger value="figurinhas" className="text-xs">Figurinhas</TabsTrigger>
        <TabsTrigger value="mensageria" className="text-xs">Mensageria</TabsTrigger>
      </TabsList>
      <TabsContent value="config"><IAConfigPanel /></TabsContent>
      <TabsContent value="documentos"><DocumentosThaliPanel /></TabsContent>
      <TabsContent value="figurinhas"><FigurinhasManagement /></TabsContent>
      <TabsContent value="mensageria">
        <Card>
          <CardContent className="py-4 space-y-3">
            <div className="p-3 border rounded-lg"><h4 className="text-xs font-semibold">WhatsApp Business</h4><Badge variant="secondary" className="text-[10px] mt-1">Em breve</Badge></div>
            <div className="p-3 border rounded-lg"><h4 className="text-xs font-semibold">Telegram</h4><Badge variant="secondary" className="text-[10px] mt-1">Em breve</Badge></div>
          </CardContent>
        </Card>
      </TabsContent>
    </Tabs>
  );

  // Alertas Config
  const renderAlertasConfig = () => (
    <div className="space-y-4">
      <ScrollArea className="h-[450px] pr-2">
        <div className="space-y-3">
          {alertasMeta.map((alerta) => {
            const config = alertasConfig[alerta.id];
            return (
              <div key={alerta.id} className={cn("p-3 border rounded-lg space-y-3 transition-colors", config.ativo ? "border-primary/30" : "border-muted opacity-70")}>
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-semibold">{alerta.nome}</h4>
                    <p className="text-[10px] text-muted-foreground">{alerta.desc}</p>
                  </div>
                  <Switch checked={config.ativo} onCheckedChange={(c) => setAlertasConfig({ ...alertasConfig, [alerta.id]: { ...config, ativo: c } })} />
                </div>
                {config.ativo && (
                  <>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Intensidade</Label>
                      <div className="flex gap-1.5">
                        {(["leve", "moderado", "intenso"] as const).map((n) => (
                          <button key={n} onClick={() => setAlertasConfig({ ...alertasConfig, [alerta.id]: { ...config, intensidade: n } })}
                            className={cn("px-2.5 py-1 rounded text-[10px] font-medium border transition-colors",
                              config.intensidade === n ? "bg-primary/10 border-primary text-primary" : "bg-background border-border text-muted-foreground hover:bg-muted"
                            )}>{n.charAt(0).toUpperCase() + n.slice(1)}</button>
                        ))}
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Label className="text-[10px] text-muted-foreground">A cada</Label>
                      <Input type="number" min={1} value={config.intervalo}
                        onChange={(e) => setAlertasConfig({ ...alertasConfig, [alerta.id]: { ...config, intervalo: Math.max(1, parseInt(e.target.value) || 1) } })}
                        className="w-16 h-7 text-xs" />
                      <span className="text-[10px] text-muted-foreground">min</span>
                    </div>
                  </>
                )}
              </div>
            );
          })}
        </div>
      </ScrollArea>
      <Button size="sm" className="w-full h-8 text-xs"><Save className="h-3.5 w-3.5 mr-1.5" /> Salvar Configurações</Button>
    </div>
  );

  // Preditiva (com Alertas Ativos integrados)
  const renderPreditiva = () => (
    <Tabs defaultValue="previsao" className="w-full">
      <TabsList className="grid w-full grid-cols-2 mb-4">
        <TabsTrigger value="previsao" className="text-xs">Previsão</TabsTrigger>
        <TabsTrigger value="alertas" className="text-xs flex items-center gap-1.5">
          <AlertTriangle className="h-3 w-3" /> Alertas Ativos
        </TabsTrigger>
      </TabsList>
      <TabsContent value="previsao">
        <div className="space-y-5">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <MetricCard label="Pico Previsto" value={dadosEmpresaGrande.preditiva.horarioPicoPrevisto} accent />
            <MetricCard label="Volume Esperado" value={dadosEmpresaGrande.preditiva.volumeEsperadoHoje} />
            <MetricCard label="Setor + Demandado" value={dadosEmpresaGrande.preditiva.setorMaisDemandado} />
          </div>
          <Card className="p-4 border-border/60">
            <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
              <Lightbulb className="h-3.5 w-3.5 text-warning" /> Recomendações da Thalí
            </h4>
            <div className="space-y-2">
              {dadosEmpresaGrande.preditiva.recomendacoes.map((rec, i) => (
                <div key={i} className="flex items-start gap-2.5 p-2.5 rounded-lg bg-muted/15 border border-border/30">
                  <div className="w-5 h-5 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <span className="text-[9px] font-bold text-primary">{i + 1}</span>
                  </div>
                  <p className="text-[10px] text-foreground leading-relaxed">{rec}</p>
                </div>
              ))}
            </div>
          </Card>
        </div>
      </TabsContent>
      <TabsContent value="alertas">
        {renderAlertasAtivos()}
      </TabsContent>
    </Tabs>
  );

  // Alertas Ativos
  const renderAlertasAtivos = () => {
    const setoresUnicos = Array.from(new Set(dadosEmpresaGrande.alertas.map((a) => a.setor).filter(Boolean)));
    const alertasFiltrados = dadosEmpresaGrande.alertas.filter((a) => {
      if (filtroAlertaSetor !== "todos" && a.setor !== filtroAlertaSetor) return false;
      if (filtroAlertaTipo !== "todos" && a.tipo !== filtroAlertaTipo) return false;
      return true;
    });

    return (
      <div className="space-y-4">
        <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-border/60 bg-muted/20">
          <Filter className="h-3 w-3 text-muted-foreground" />
          <Select value={filtroAlertaSetor} onValueChange={setFiltroAlertaSetor}>
            <SelectTrigger className="w-40 h-7 text-[10px]"><SelectValue placeholder="Setor" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os setores</SelectItem>
              {setoresUnicos.map((s) => <SelectItem key={s} value={s!}>{s}</SelectItem>)}
            </SelectContent>
          </Select>
          <Select value={filtroAlertaTipo} onValueChange={setFiltroAlertaTipo}>
            <SelectTrigger className="w-40 h-7 text-[10px]"><SelectValue placeholder="Tipo" /></SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os tipos</SelectItem>
              {Array.from(new Set(dadosEmpresaGrande.alertas.map((a) => a.tipo))).map((t) => (
                <SelectItem key={t} value={t}>{t}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-2">
          {alertasFiltrados.length > 0 ? alertasFiltrados.map((a, i) => (
            <Card key={i} className={cn("p-3 border-l-[3px] border-border/60",
              a.cor === "red" && "border-l-destructive bg-destructive/5",
              a.cor === "orange" && "border-l-warning bg-warning/5",
              a.cor === "yellow" && "border-l-warning bg-warning/5"
            )}>
              <div className="flex items-start gap-2.5">
                <Bell className={cn("h-3.5 w-3.5 mt-0.5",
                  a.cor === "red" && "text-destructive", a.cor === "orange" && "text-warning", a.cor === "yellow" && "text-warning"
                )} />
                <div>
                  <h4 className="text-xs font-medium">{a.tipo}{a.setor && ` · ${a.setor}`}{a.atendente && ` · ${a.atendente}`}</h4>
                  <p className="text-[10px] text-muted-foreground">{a.detalhes}</p>
                </div>
              </div>
            </Card>
          )) : (
            <p className="text-center py-8 text-xs text-muted-foreground">Nenhum alerta encontrado</p>
          )}
        </div>
      </div>
    );
  };

  // API e Webhooks
  const renderApiWebhooks = () => (
    <Tabs defaultValue="chave" className="w-full">
      <TabsList className="grid w-full grid-cols-4 mb-3">
        <TabsTrigger value="chave" className="text-xs">Chave API</TabsTrigger>
        <TabsTrigger value="webhooks" className="text-xs">Webhooks</TabsTrigger>
        <TabsTrigger value="logs" className="text-xs">Logs</TabsTrigger>
        <TabsTrigger value="docs" className="text-xs">Documentação</TabsTrigger>
      </TabsList>
      <TabsContent value="chave" className="space-y-3">
        <Card>
          <CardContent className="py-4 space-y-3">
            <div className="space-y-1.5">
              <Label className="text-xs">API Key</Label>
              <div className="flex gap-2">
                <Input value={apiConfig.chave_api} readOnly className="font-mono text-xs h-8" />
                <Button variant="outline" size="icon" className="h-8 w-8"><Copy className="h-3.5 w-3.5" /></Button>
              </div>
              <p className="text-[10px] text-muted-foreground">Header: Authorization: Bearer {apiConfig.chave_api}</p>
            </div>
            <Separator />
            <div className="grid grid-cols-2 gap-3">
              <div className="p-2.5 border rounded-lg text-center"><div className="text-lg font-bold">1000</div><div className="text-[10px] text-muted-foreground">req/min</div></div>
              <div className="p-2.5 border rounded-lg text-center"><div className="text-lg font-bold">250</div><div className="text-[10px] text-muted-foreground">burst/5s</div></div>
            </div>
            <Button variant="outline" size="sm" className="w-full h-8 text-xs"><RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Gerar Nova Chave</Button>
          </CardContent>
        </Card>
      </TabsContent>
      <TabsContent value="webhooks"><ApiWebhooksManager /></TabsContent>
      <TabsContent value="logs"><ApiLogsViewer /></TabsContent>
      <TabsContent value="docs"><ApiDocsPanel /></TabsContent>
    </Tabs>
  );

  // ─── Content renderer per menu item ─────
  const renderContent = () => {
    switch (activeSection) {
      // Visão
      case "dashboard": return renderDashboard();
      case "relatorios": return <RelatoriosInteligentesPanel />;
      case "nps": return renderNps();
      case "indicadores": return renderIndicadores();
      case "feedback": return renderFeedback();
      // Estrutura
      case "empresa": return renderEmpresa();
      case "unidades": return renderUnidades();
      case "setores": return renderSetores();
      // Equipe
      case "usuarios": return renderUsuarios();
      case "perfis": return renderPerfis();
      case "validacoes": return renderValidacoes();
      // Operação
      case "mensagens_rapidas": return <MensagensRapidasManagement />;
      case "ura": return renderUra();
      case "thali_mensageria": return renderThaliMensageria();
      case "roteiros": return <EditorRoteirosPanel onClose={() => {}} />;
      case "etiquetas": return <EtiquetasManagementPanel />;
      // Controle
      case "alertas_config": return renderAlertasConfig();
      case "preditiva": return renderPreditiva();
      case "auditoria": return <AuditoriaAcoesPanel />;
      case "ideias": return <CentralIdeiasPanel />;
      // Integrações
      case "api_webhooks": return renderApiWebhooks();
      case "configuracoes": return <ConfiguracoesFilaPanel />;
      default: return null;
    }
  };

  // Get active item info
  const allItems = menuBlocks.flatMap(b => b.items);
  const activeItem = allItems.find(i => i.id === activeSection);

  // Filter menu items based on role
  const shouldShowItem = (id: string) => {
    if (id === "validacoes" && !isCoordenacao && !isGestor) return false;
    if (id === "etiquetas" && !isCoordenacao && !isGestor) return false;
    return true;
  };

  return (
    <>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-border/60 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <LayoutGrid className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground leading-tight">Central de Gestão</h2>
              <p className="text-[9px] text-muted-foreground uppercase tracking-widest mt-0.5">Grupo Liruz</p>
            </div>
          </div>
          <Button variant="ghost" size="icon" className="h-8 w-8" onClick={() => navigate("/chat")}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Two-column layout */}
        <div className="flex flex-1 overflow-hidden">
          {/* Sidebar menu */}
          <ScrollArea className="w-52 flex-shrink-0 border-r border-border/50 bg-muted/20">
            <nav className="p-3 space-y-4">
              {menuBlocks.map((block) => (
                <div key={block.title}>
                  <p className="px-2.5 mb-1.5 text-[10px] font-semibold text-muted-foreground uppercase tracking-widest">
                    {block.title}
                  </p>
                  <div className="space-y-0.5">
                    {block.items.filter(item => shouldShowItem(item.id)).map((item) => {
                      const isActive = activeSection === item.id;
                      return (
                        <button
                          key={item.id}
                          onClick={() => setActiveSection(item.id)}
                          className={cn(
                            "w-full flex items-center gap-2 px-2.5 py-1.5 rounded-md text-xs transition-colors text-left",
                            isActive
                              ? "bg-primary/10 text-primary font-medium"
                              : "text-muted-foreground hover:bg-muted hover:text-foreground"
                          )}
                        >
                          <item.icon className="h-3.5 w-3.5 flex-shrink-0" />
                          <span className="truncate">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}
            </nav>
          </ScrollArea>

          {/* Main content */}
          <ScrollArea className="flex-1">
            <div className="p-6 pb-10">
              {/* Section title */}
              {activeItem && (
                <div className="flex items-center gap-2 mb-5">
                  <activeItem.icon className="h-4 w-4 text-primary" />
                  <h3 className="text-sm font-semibold text-foreground">{activeItem.label}</h3>
                </div>
              )}
              {renderContent()}
            </div>
          </ScrollArea>
        </div>
      </div>

      {/* Dialogs */}
      <ValidacoesPerfilPanel open={validacoesOpen} onOpenChange={setValidacoesOpen} />
      <CriarSetorDialog open={criarSetorOpen} onOpenChange={setCriarSetorOpen} />
      <CriarUsuarioDialog open={criarUsuarioOpen} onOpenChange={setCriarUsuarioOpen} />
      <EditarUsuarioDialog open={editarUsuarioOpen} onOpenChange={setEditarUsuarioOpen} usuario={usuarioParaEditar} />
      <CriarPerfilAcessoDialog open={criarPerfilOpen} onOpenChange={setCriarPerfilOpen} />
      <EditarPerfilAcessoDialog open={editarPerfilOpen} onOpenChange={setEditarPerfilOpen} perfil={perfilParaEditar} />
    </>
  );
};
