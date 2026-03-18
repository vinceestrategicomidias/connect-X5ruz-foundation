import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
  Building2, Building, Users, ShieldCheck, Phone, Bot, FileText, BarChart3,
  Map, UserCheck, Bell, Code2, Save, Plus, Copy, RefreshCw, Pencil,
  LayoutGrid, ThumbsUp, TrendingUp, MessageSquare, Activity, History,
  Lightbulb, X, Award, Settings, Filter, Calendar, Download, ChevronDown,
  Gauge, Star, Zap, BookOpen, Tag, ClipboardList, Brain, AlertTriangle,
  Workflow, Sparkles, Settings2, ChevronRight, type LucideIcon,
  CalendarDays, ChevronLeft, BarChart2, Target, Clock, HeartHandshake,
  ShoppingCart, MapPin, Smile, AlertCircle, Timer, RotateCcw, UserX,
  DollarSign, Package, TrendingDown, Pause, Medal, Globe, Home, FileDown,
  Loader2, Trophy, CreditCard, Briefcase, ArrowUpRight, ArrowDownRight,
  ArrowRightLeft, CheckCircle,
} from "lucide-react";
import { format, subDays, startOfMonth, endOfMonth, subMonths, startOfYear, parse, isValid } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import {
  Popover, PopoverContent, PopoverTrigger,
} from "@/components/ui/popover";
import { toast } from "sonner";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis,
  CartesianGrid, Tooltip, Legend, ResponsiveContainer, FunnelChart, Funnel, LabelList,
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
import { MotivosTransferenciaPanel } from "./MotivosTransferenciaPanel";
import { MotivosFinalizacaoPanel } from "./MotivosFinalizacaoPanel";
import { RelatorioEquipePanel } from "./RelatorioEquipePanel";
import DashboardMonitoramento from "@/pages/DashboardMonitoramento";
// UI
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from "@/components/ui/dialog";
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

// Simulated commercial data
const dadosComerciais = {
  vendasPorDia: [
    { dia: "Seg", vendas: 8, receita: 24000 }, { dia: "Ter", vendas: 12, receita: 36000 },
    { dia: "Qua", vendas: 6, receita: 18000 }, { dia: "Qui", vendas: 15, receita: 52000 },
    { dia: "Sex", vendas: 18, receita: 61000 }, { dia: "Sáb", vendas: 4, receita: 12000 },
    { dia: "Dom", vendas: 2, receita: 5000 },
  ],
  receitaPorProduto: [
    { produto: "Cirurgia Plástica", receita: 89000 }, { produto: "Harmonização", receita: 67000 },
    { produto: "Botox", receita: 42000 }, { produto: "Preenchimento", receita: 38000 },
    { produto: "Consulta", receita: 12000 },
  ],
  motivosPerda: [
    { motivo: "Preço alto", quantidade: 23 }, { motivo: "Concorrência", quantidade: 15 },
    { motivo: "Desistência", quantidade: 12 }, { motivo: "Sem retorno", quantidade: 9 },
    { motivo: "Prazo", quantidade: 6 },
  ],
  conversaoPorAtendente: [
    { nome: "Geovana", leads: 45, vendas: 18, conversao: 40, receita: 72000, ticket: 4000, ciclo: 5 },
    { nome: "Paloma", leads: 38, vendas: 14, conversao: 37, receita: 56000, ticket: 4000, ciclo: 6 },
    { nome: "Emilly", leads: 42, vendas: 12, conversao: 29, receita: 48000, ticket: 4000, ciclo: 7 },
    { nome: "Marcos", leads: 35, vendas: 9, conversao: 26, receita: 31500, ticket: 3500, ciclo: 8 },
    { nome: "Bianca", leads: 30, vendas: 7, conversao: 23, receita: 24500, ticket: 3500, ciclo: 9 },
  ],
  funil: [
    { name: "Em negociação", value: 142, fill: "hsl(214, 85%, 51%)" },
    { name: "Vendido", value: 65, fill: "hsl(142, 71%, 45%)" },
    { name: "Perdido", value: 48, fill: "hsl(0, 84%, 60%)" },
  ],
};

const dadosProdutividade = {
  ranking: [
    { nome: "Geovana", atendimentos: 314, online: "7h42", pausa: "48min", resolutividade: 94 },
    { nome: "Paloma", atendimentos: 287, online: "7h18", pausa: "52min", resolutividade: 91 },
    { nome: "Emilly", atendimentos: 274, online: "7h05", pausa: "55min", resolutividade: 89 },
    { nome: "Marcos", atendimentos: 251, online: "6h50", pausa: "1h10", resolutividade: 82 },
    { nome: "Bianca", atendimentos: 229, online: "6h35", pausa: "1h05", resolutividade: 85 },
  ],
};

const dadosDistribuicao = {
  estados: [
    { estado: "ES", clientes: 412 }, { estado: "SP", clientes: 287 },
    { estado: "RJ", clientes: 198 }, { estado: "MG", clientes: 156 },
    { estado: "BA", clientes: 89 }, { estado: "PR", clientes: 67 },
    { estado: "SC", clientes: 45 }, { estado: "RS", clientes: 38 },
    { estado: "GO", clientes: 29 }, { estado: "DF", clientes: 22 },
  ],
  origens: [
    { name: "WhatsApp", value: 45 }, { name: "Instagram", value: 28 },
    { name: "Site", value: 15 }, { name: "Indicação", value: 12 },
  ],
};

const dadosNpsQualidade = {
  sentimento: [
    { periodo: "Sem 1", positivo: 78, neutro: 15, negativo: 7 },
    { periodo: "Sem 2", positivo: 82, neutro: 12, negativo: 6 },
    { periodo: "Sem 3", positivo: 75, neutro: 18, negativo: 7 },
    { periodo: "Sem 4", positivo: 85, neutro: 10, negativo: 5 },
  ],
  tabelaAtendentes: [
    { nome: "Geovana", nps: 95, sentimento: "Positivo", tma: "3m12s", alertas: 0 },
    { nome: "Paloma", nps: 93, sentimento: "Positivo", tma: "3m28s", alertas: 1 },
    { nome: "Emilly", nps: 92, sentimento: "Positivo", tma: "3m05s", alertas: 0 },
    { nome: "Marcos", nps: 74, sentimento: "Neutro", tma: "4m52s", alertas: 3 },
    { nome: "Bianca", nps: 88, sentimento: "Positivo", tma: "3m45s", alertas: 1 },
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
const MetricCard = ({ label, value, accent = false, trend, trendUp }: { label: string; value: string | number; accent?: boolean; trend?: string; trendUp?: boolean }) => (
  <Card className="p-4 border-border/60">
    <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider mb-1.5">{label}</p>
    <div className="flex items-end justify-between">
      <p className={cn("text-xl font-bold", accent ? "text-primary" : "text-foreground")}>{value}</p>
      {trend && (
        <span className={cn("text-[10px] font-medium flex items-center gap-0.5", trendUp ? "text-emerald-600" : "text-destructive")}>
          {trendUp ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
          {trend}
        </span>
      )}
    </div>
  </Card>
);

const ChartCard = ({ title, children, className }: { title: string; children: React.ReactNode; className?: string }) => (
  <Card className={cn("p-4 border-border/60", className)}>
    <h4 className="text-xs font-semibold text-foreground mb-3">{title}</h4>
    <div className="w-full h-[220px]">{children}</div>
  </Card>
);

const tooltipStyle = { borderRadius: 8, border: "none", boxShadow: "0 4px 12px rgba(0,0,0,0.08)" };

const setoresComerciais = [
  "Pré venda", "Venda", "Pós venda", "Comercial CRM", "Comercial Connect", "Comercial Medical Host"
];

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
      { id: "relatorios", label: "Relatórios", icon: FileText },
      { id: "preditiva_estrategica", label: "Thalí Preditiva", icon: Brain },
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
      { id: "motivos_transferencia", label: "Motivos Transferência", icon: ArrowRightLeft },
      { id: "motivos_finalizacao", label: "Motivos Finalização", icon: CheckCircle },
    ],
  },
  {
    title: "Controle",
    items: [
      { id: "alertas_config", label: "Config. Alertas", icon: Bell },
      { id: "auditoria", label: "Auditoria", icon: ClipboardList },
      { id: "ideias", label: "Ideias das Estrelas", icon: Sparkles },
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

  // ─── Report states ─────
  const [personalizarOpen, setPersonalizarOpen] = useState(false);
  const [indicadoresAtivos, setIndicadoresAtivos] = useState<Record<string, boolean>>({});
  const [relatorioDetalhe, setRelatorioDetalhe] = useState<string | null>(null);
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);
  const [gerandoRelatorio, setGerandoRelatorio] = useState(false);
  const [periodoInicio, setPeriodoInicio] = useState<Date | undefined>(undefined);
  const [periodoFim, setPeriodoFim] = useState<Date | undefined>(undefined);
  const [periodoOpen, setPeriodoOpen] = useState(false);
  const [periodoInputText, setPeriodoInputText] = useState("");
  const [periodoInputError, setPeriodoInputError] = useState(false);
  const [filtroSetor, setFiltroSetor] = useState("todos");
  const [filtroUnidade, setFiltroUnidade] = useState("todos");
  const [filtroAtendente, setFiltroAtendente] = useState("todos");
  const [filtroProduto, setFiltroProduto] = useState("todos");
  const [filtroEtapaFunil, setFiltroEtapaFunil] = useState("todos");

  // Sync period text with dates
  useEffect(() => {
    if (periodoInicio && periodoFim) {
      setPeriodoInputText(`${format(periodoInicio, "dd/MM/yyyy")} - ${format(periodoFim, "dd/MM/yyyy")}`);
      setPeriodoInputError(false);
    }
  }, [periodoInicio, periodoFim]);

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

  const handlePeriodoInputChange = (text: string) => {
    setPeriodoInputText(text);
    // Try parsing DD/MM/AAAA - DD/MM/AAAA
    const parts = text.split(" - ");
    if (parts.length === 2) {
      const d1 = parse(parts[0].trim(), "dd/MM/yyyy", new Date());
      const d2 = parse(parts[1].trim(), "dd/MM/yyyy", new Date());
      if (isValid(d1) && isValid(d2)) {
        setPeriodoInicio(d1);
        setPeriodoFim(d2);
        setPeriodoInputError(false);
      } else if (parts[0].trim().length === 10 || parts[1].trim().length === 10) {
        setPeriodoInputError(true);
      }
    } else if (text.length > 10) {
      setPeriodoInputError(true);
    } else {
      setPeriodoInputError(false);
    }
  };

  // ─── Individual render functions ─────

  // Dashboard
  const renderDashboard = () => (
    <DashboardMonitoramento embedded />
  );

  // NPS
  const renderNps = () => (
    <div className="space-y-5">
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
        <MetricCard label="Total Respondido" value={dadosEmpresaGrande.nps.totalRespondido} />
        <MetricCard label="NPS" value={dadosEmpresaGrande.nps.npsMedio} accent />
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
                      <Select value={config.intensidade} onValueChange={(v) => setAlertasConfig({ ...alertasConfig, [alerta.id]: { ...config, intensidade: v } })}>
                        <SelectTrigger className="h-7 text-[10px]"><SelectValue /></SelectTrigger>
                        <SelectContent>
                          <SelectItem value="leve">Leve</SelectItem>
                          <SelectItem value="moderado">Moderado</SelectItem>
                          <SelectItem value="intenso">Intenso</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="space-y-1">
                      <Label className="text-[10px] text-muted-foreground">Intervalo de verificação</Label>
                      <div className="flex items-center gap-2">
                        <Input type="number" value={config.intervalo} onChange={(e) => setAlertasConfig({ ...alertasConfig, [alerta.id]: { ...config, intervalo: Number(e.target.value) } })} className="h-7 w-20 text-[10px]" />
                        <span className="text-[10px] text-muted-foreground">minutos</span>
                      </div>
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

  // ─── Relatórios: Categories & Indicators ─────
  const relatorioCategories = [
    {
      id: "atendimento", icon: MessageSquare, nome: "Atendimento", desc: "Métricas de conversas, tempos e SLA",
      indicadores: [
        { id: "conversas_iniciadas", nome: "Total de conversas iniciadas", icon: MessageSquare },
        { id: "tempo_resposta", nome: "Tempo médio de resposta", icon: Timer },
        { id: "tempo_espera", nome: "Tempo médio de espera", icon: Clock },
        { id: "tempo_atendimento", nome: "Tempo médio de atendimento", icon: Gauge },
        { id: "sla_primeira_resp", nome: "Taxa de primeira resposta em SLA", icon: Target },
        { id: "conversas_reabertas", nome: "Conversas reabertas", icon: RotateCcw },
        { id: "taxa_abandono", nome: "Taxa de abandono", icon: UserX },
      ],
    },
    {
      id: "comercial", icon: Briefcase, nome: "Comercial", desc: "Leads, conversão, receita e funil de vendas",
      indicadores: [
        { id: "leads_recebidos", nome: "Leads recebidos", icon: Users },
        { id: "orcamentos_enviados", nome: "Orçamentos enviados", icon: FileText },
        { id: "vendas_fechadas", nome: "Vendas fechadas", icon: ShoppingCart },
        { id: "taxa_conversao", nome: "Taxa de conversão", icon: Target },
        { id: "ticket_medio", nome: "Ticket médio", icon: DollarSign },
        { id: "receita_total", nome: "Receita total", icon: Zap },
        { id: "ciclo_venda", nome: "Ciclo médio de venda", icon: Clock },
        { id: "motivos_perda", nome: "Motivo principal de perda", icon: TrendingDown },
      ],
    },
    {
      id: "produtividade", icon: Activity, nome: "Produtividade", desc: "Desempenho individual e coletivo da equipe",
      indicadores: [
        { id: "atendimentos_por_atendente", nome: "Atendimentos por atendente", icon: Users },
        { id: "tempo_online", nome: "Tempo online", icon: Clock },
        { id: "tempo_pausa", nome: "Tempo em pausa", icon: Pause },
        { id: "resolutividade", nome: "Taxa de resolutividade", icon: Star },
        { id: "ranking_conversao", nome: "Ranking por conversão", icon: Medal },
        { id: "ranking_nps", nome: "Ranking por NPS", icon: Award },
      ],
    },
    {
      id: "qualidade", icon: HeartHandshake, nome: "Qualidade / NPS", desc: "NPS, sentimento e alertas críticos",
      indicadores: [
        { id: "nps_geral", nome: "NPS geral", icon: Award },
        { id: "nps_atendente", nome: "NPS por atendente", icon: Users },
        { id: "sentimento", nome: "Análise de sentimento", icon: Smile },
        { id: "alertas_criticos", nome: "Atendimentos com alerta crítico", icon: AlertCircle },
        { id: "msgs_negativas", nome: "Percentual de mensagens negativas", icon: TrendingDown },
      ],
    },
    {
      id: "distribuicao", icon: MapPin, nome: "Distribuição", desc: "Origem geográfica e canais dos clientes",
      indicadores: [
        { id: "clientes_estado", nome: "Clientes por estado", icon: Globe },
        { id: "clientes_cidade", nome: "Clientes por cidade", icon: MapPin },
        { id: "origem_lead", nome: "Origem do lead", icon: Target },
        { id: "unidade_maior_volume", nome: "Unidade com maior volume", icon: Home },
      ],
    },
    {
      id: "equipe", icon: Users, nome: "Relatório de Equipe", desc: "Produtividade individual com NPS, TMA, TME, conversão e visão da Thalí",
      indicadores: [
        { id: "nps", nome: "NPS", icon: Award },
        { id: "tma", nome: "TMA", icon: Clock },
        { id: "tme", nome: "TME", icon: Timer },
        { id: "ciclo_venda", nome: "Ciclo de Venda", icon: Target },
        { id: "conversao_comercial", nome: "Conversão Comercial", icon: ShoppingCart },
        { id: "orcamentos_enviados", nome: "Orçamentos Enviados", icon: FileText },
        { id: "historico", nome: "Histórico de Atendimentos", icon: BarChart3 },
        { id: "ranking_radar", nome: "Ranking Radar", icon: Gauge },
        { id: "ideias_estrelas", nome: "Ideias das Estrelas", icon: Lightbulb },
        { id: "visao_thali", nome: "Visão da Thalí", icon: Brain },
      ],
    },
  ];

  const handlePresetPeriodo = (preset: string) => {
    const hoje = new Date();
    switch (preset) {
      case "hoje": setPeriodoInicio(hoje); setPeriodoFim(hoje); break;
      case "7dias": setPeriodoInicio(subDays(hoje, 7)); setPeriodoFim(hoje); break;
      case "30dias": setPeriodoInicio(subDays(hoje, 30)); setPeriodoFim(hoje); break;
      case "este_mes": setPeriodoInicio(startOfMonth(hoje)); setPeriodoFim(hoje); break;
      case "mes_anterior": { const m = subMonths(hoje, 1); setPeriodoInicio(startOfMonth(m)); setPeriodoFim(endOfMonth(m)); break; }
      case "ano_atual": setPeriodoInicio(startOfYear(hoje)); setPeriodoFim(hoje); break;
    }
  };

  const handleAplicarFiltros = () => {
    if (!periodoInicio || !periodoFim) {
      toast.error("Selecione o período para gerar o relatório.");
      return;
    }
    setGerandoRelatorio(true);
    setPeriodoOpen(false);
    setTimeout(() => {
      setGerandoRelatorio(false);
      setFiltrosAplicados(true);
      toast.success("Relatório gerado com sucesso!");
    }, 1000);
  };

  const exportButtons = (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button size="sm" className="h-7 text-[10px]" disabled={!filtrosAplicados}><Download className="h-3 w-3 mr-1" /> Exportar</Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => toast.success("Exportando em Excel...")}>Excel (.xlsx)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.success("Exportando em Word...")}>Word (.docx)</DropdownMenuItem>
        <DropdownMenuItem onClick={() => toast.success("Exportando em PDF...")}>PDF (.pdf)</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );

  // ─── Shared Period Picker Component ─────
  const PeriodPicker = () => (
    <Popover open={periodoOpen} onOpenChange={setPeriodoOpen}>
      <PopoverTrigger asChild>
        <div className="relative">
          <Input
            value={periodoInputText}
            onChange={(e) => handlePeriodoInputChange(e.target.value)}
            placeholder="DD/MM/AAAA - DD/MM/AAAA"
            className={cn("h-7 text-[10px] w-52 pl-7", periodoInputError && "border-destructive focus-visible:ring-destructive")}
            title={periodoInputError ? "Data inválida" : undefined}
          />
          <CalendarDays className="h-3 w-3 absolute left-2 top-1/2 -translate-y-1/2 text-muted-foreground" />
        </div>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <div className="p-3 space-y-3">
          <div className="flex flex-wrap gap-1">
            {[
              { label: "Hoje", value: "hoje" },
              { label: "7 dias", value: "7dias" },
              { label: "30 dias", value: "30dias" },
              { label: "Este mês", value: "este_mes" },
              { label: "Mês anterior", value: "mes_anterior" },
              { label: "Ano atual", value: "ano_atual" },
            ].map(p => (
              <Button key={p.value} variant="outline" size="sm" className="h-6 text-[10px] px-2"
                onClick={() => handlePresetPeriodo(p.value)}>{p.label}</Button>
            ))}
          </div>
          <Separator />
          <div className="flex gap-4">
            <div>
              <p className="text-[10px] font-medium mb-1 text-muted-foreground">Data Inicial</p>
              <CalendarComponent mode="single" selected={periodoInicio} onSelect={setPeriodoInicio}
                className="p-2 pointer-events-auto" locale={ptBR} />
            </div>
            <div>
              <p className="text-[10px] font-medium mb-1 text-muted-foreground">Data Final</p>
              <CalendarComponent mode="single" selected={periodoFim} onSelect={setPeriodoFim}
                className="p-2 pointer-events-auto" locale={ptBR} />
            </div>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );

  // ─── Per-report filter bars ─────
  const renderFiltrosAtendimento = () => (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-border/60 bg-muted/20">
      <Filter className="h-3 w-3 text-muted-foreground" />
      <PeriodPicker />
      <Select value={filtroSetor} onValueChange={setFiltroSetor}>
        <SelectTrigger className="w-32 h-7 text-[10px]"><SelectValue placeholder="Setor" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos os setores</SelectItem>
          {setores?.map(s => <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filtroUnidade} onValueChange={setFiltroUnidade}>
        <SelectTrigger className="w-32 h-7 text-[10px]"><SelectValue placeholder="Unidade" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas</SelectItem>
          {unidades?.map(u => <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filtroAtendente} onValueChange={setFiltroAtendente}>
        <SelectTrigger className="w-32 h-7 text-[10px]"><SelectValue placeholder="Atendente" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {atendentes?.map(a => <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setPersonalizarOpen(true)}>
        <Settings2 className="h-3 w-3 mr-1" /> Personalizar
      </Button>
      <Button size="sm" className="h-7 text-[10px]" onClick={handleAplicarFiltros}>Aplicar</Button>
    </div>
  );

  const renderFiltrosComercial = () => (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-border/60 bg-muted/20">
      <Filter className="h-3 w-3 text-muted-foreground" />
      <PeriodPicker />
      <Select value={filtroUnidade} onValueChange={setFiltroUnidade}>
        <SelectTrigger className="w-28 h-7 text-[10px]"><SelectValue placeholder="Unidade" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas</SelectItem>
          {unidades?.map(u => <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filtroSetor} onValueChange={setFiltroSetor}>
        <SelectTrigger className="w-36 h-7 text-[10px]"><SelectValue placeholder="Setor" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {setoresComerciais.map(s => <SelectItem key={s} value={s}>{s}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filtroAtendente} onValueChange={setFiltroAtendente}>
        <SelectTrigger className="w-28 h-7 text-[10px]"><SelectValue placeholder="Atendente" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {atendentes?.map(a => <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filtroProduto} onValueChange={setFiltroProduto}>
        <SelectTrigger className="w-28 h-7 text-[10px]"><SelectValue placeholder="Produto" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {dadosComerciais.receitaPorProduto.map(p => <SelectItem key={p.produto} value={p.produto}>{p.produto}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filtroEtapaFunil} onValueChange={setFiltroEtapaFunil}>
        <SelectTrigger className="w-32 h-7 text-[10px]"><SelectValue placeholder="Etapa funil" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas</SelectItem>
          <SelectItem value="negociacao">Em negociação</SelectItem>
          <SelectItem value="vendido">Vendido</SelectItem>
          <SelectItem value="perdido">Perdido</SelectItem>
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setPersonalizarOpen(true)}>
        <Settings2 className="h-3 w-3 mr-1" /> Personalizar
      </Button>
      <Button size="sm" className="h-7 text-[10px]" onClick={handleAplicarFiltros}>Aplicar</Button>
    </div>
  );

  const renderFiltrosProdutividade = () => (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-border/60 bg-muted/20">
      <Filter className="h-3 w-3 text-muted-foreground" />
      <PeriodPicker />
      <Select value={filtroSetor} onValueChange={setFiltroSetor}>
        <SelectTrigger className="w-32 h-7 text-[10px]"><SelectValue placeholder="Setor" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {setores?.map(s => <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filtroAtendente} onValueChange={setFiltroAtendente}>
        <SelectTrigger className="w-32 h-7 text-[10px]"><SelectValue placeholder="Atendente" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {atendentes?.map(a => <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setPersonalizarOpen(true)}>
        <Settings2 className="h-3 w-3 mr-1" /> Personalizar
      </Button>
      <Button size="sm" className="h-7 text-[10px]" onClick={handleAplicarFiltros}>Aplicar</Button>
    </div>
  );

  const renderFiltrosQualidade = () => (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-border/60 bg-muted/20">
      <Filter className="h-3 w-3 text-muted-foreground" />
      <PeriodPicker />
      <Select value={filtroSetor} onValueChange={setFiltroSetor}>
        <SelectTrigger className="w-32 h-7 text-[10px]"><SelectValue placeholder="Setor" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {setores?.map(s => <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filtroUnidade} onValueChange={setFiltroUnidade}>
        <SelectTrigger className="w-32 h-7 text-[10px]"><SelectValue placeholder="Unidade" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas</SelectItem>
          {unidades?.map(u => <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>)}
        </SelectContent>
      </Select>
      <Select value={filtroAtendente} onValueChange={setFiltroAtendente}>
        <SelectTrigger className="w-32 h-7 text-[10px]"><SelectValue placeholder="Atendente" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todos</SelectItem>
          {atendentes?.map(a => <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setPersonalizarOpen(true)}>
        <Settings2 className="h-3 w-3 mr-1" /> Personalizar
      </Button>
      <Button size="sm" className="h-7 text-[10px]" onClick={handleAplicarFiltros}>Aplicar</Button>
    </div>
  );

  const renderFiltrosDistribuicao = () => (
    <div className="flex flex-wrap items-center gap-2 p-3 rounded-lg border border-border/60 bg-muted/20">
      <Filter className="h-3 w-3 text-muted-foreground" />
      <PeriodPicker />
      <Select value={filtroUnidade} onValueChange={setFiltroUnidade}>
        <SelectTrigger className="w-32 h-7 text-[10px]"><SelectValue placeholder="Unidade" /></SelectTrigger>
        <SelectContent>
          <SelectItem value="todos">Todas</SelectItem>
          {unidades?.map(u => <SelectItem key={u.id} value={u.id}>{u.nome}</SelectItem>)}
        </SelectContent>
      </Select>
      <Button variant="outline" size="sm" className="h-7 text-[10px]" onClick={() => setPersonalizarOpen(true)}>
        <Settings2 className="h-3 w-3 mr-1" /> Personalizar
      </Button>
      <Button size="sm" className="h-7 text-[10px]" onClick={handleAplicarFiltros}>Aplicar</Button>
    </div>
  );

  const getFiltrosForReport = (id: string) => {
    switch (id) {
      case "atendimento": return renderFiltrosAtendimento();
      case "comercial": return renderFiltrosComercial();
      case "produtividade": return renderFiltrosProdutividade();
      case "qualidade": return renderFiltrosQualidade();
      case "distribuicao": return renderFiltrosDistribuicao();
      default: return renderFiltrosAtendimento();
    }
  };

  // ─── Report detail rendering ─────
  const renderRelatorioDetalhe = (id: string) => {
    const cat = relatorioCategories.find(c => c.id === id);
    if (!cat) return null;

    const renderReportContent = () => {
      switch (id) {
        case "atendimento":
          return (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
                <MetricCard label="Total de conversas" value="2.847" accent trend="+12%" trendUp />
                <MetricCard label="TMA" value="3m 42s" trend="-8%" trendUp />
                <MetricCard label="TME" value="5m 11s" trend="+3%" trendUp={false} />
                <MetricCard label="SLA atendido" value="87%" accent />
                <MetricCard label="Reabertas" value="231" />
                <MetricCard label="Abandono" value="4,2%" trend="-1,5%" trendUp />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard title="Atendimentos por dia">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosEmpresaGrande.atendimentosPorDia}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                      <XAxis dataKey="dia" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="atendimentos" fill="hsl(214, 85%, 51%)" radius={[5, 5, 0, 0]} />
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
                <ChartCard title="TMA x TME (min)">
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
                <ChartCard title="Atendimentos por hora">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosEmpresaGrande.horariosPico}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                      <XAxis dataKey="horario" tick={{ fontSize: 10 }} tickFormatter={(v) => `${v}h`} />
                      <YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="msgs" name="Mensagens" radius={[5, 5, 0, 0]}>
                        {dadosEmpresaGrande.horariosPico.map((item, i) => (
                          <Cell key={i} fill={
                            item.nivel === "Muito Alto" ? "hsl(0, 84%, 60%)" :
                            item.nivel === "Alto" ? "hsl(38, 92%, 50%)" :
                            item.nivel === "Médio" ? "hsl(214, 85%, 51%)" :
                            "hsl(142, 71%, 45%)"
                          } />
                        ))}
                      </Bar>
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              {/* Tabela detalhada */}
              <Card className="p-4 border-border/60">
                <h4 className="text-xs font-semibold mb-3">Detalhamento por Atendente</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Atendente</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Conversas</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">TMA</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">TME</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">SLA</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Reaberturas</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Finalizados</th>
                      </tr>
                    </thead>
                    <tbody>
                      {[
                        { nome: "Geovana", conversas: 314, tma: "3m12s", tme: "4m30s", sla: "92%", reaberturas: 8, finalizados: 298 },
                        { nome: "Paloma", conversas: 287, tma: "3m28s", tme: "5m02s", sla: "89%", reaberturas: 12, finalizados: 271 },
                        { nome: "Emilly", conversas: 274, tma: "3m05s", tme: "4m18s", sla: "94%", reaberturas: 6, finalizados: 262 },
                        { nome: "Marcos", conversas: 251, tma: "4m52s", tme: "6m30s", sla: "78%", reaberturas: 18, finalizados: 230 },
                        { nome: "Bianca", conversas: 229, tma: "3m45s", tme: "5m15s", sla: "85%", reaberturas: 10, finalizados: 215 },
                      ].map((row, i) => (
                        <tr key={i} className="border-b border-border/30 hover:bg-muted/20">
                          <td className="py-2 px-2 font-medium">{row.nome}</td>
                          <td className="text-center py-2 px-2">{row.conversas}</td>
                          <td className="text-center py-2 px-2">{row.tma}</td>
                          <td className="text-center py-2 px-2">{row.tme}</td>
                          <td className="text-center py-2 px-2">{row.sla}</td>
                          <td className="text-center py-2 px-2">{row.reaberturas}</td>
                          <td className="text-center py-2 px-2">{row.finalizados}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          );

        case "comercial":
          return (
            <>
              {/* KPIs Comerciais */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard label="Leads recebidos" value="190" accent trend="+18%" trendUp />
                <MetricCard label="Orçamentos enviados" value="142" trend="+10%" trendUp />
                <MetricCard label="Vendas fechadas" value="65" accent trend="+22%" trendUp />
                <MetricCard label="Taxa de conversão" value="34,2%" accent trend="+5%" trendUp />
              </div>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard label="Ticket médio" value="R$ 3.569" trend="+3%" trendUp />
                <MetricCard label="Receita no período" value="R$ 231.985" accent trend="+15%" trendUp />
                <MetricCard label="Ciclo médio de venda" value="6,4 dias" trend="-0,8d" trendUp />
                <MetricCard label="Motivo principal de perda" value="Preço alto" />
              </div>

              {/* Projeção + Top 3 */}
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-3">
                <Card className="p-4 border-border/60 bg-primary/5 col-span-1">
                  <div className="flex items-center gap-2 mb-3">
                    <TrendingUp className="h-4 w-4 text-primary" />
                    <h4 className="text-xs font-semibold">Projeção do Período</h4>
                  </div>
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground">Receita estimada</span>
                      <span className="text-sm font-bold text-primary">R$ 298.500</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-[10px] text-muted-foreground">Meta</span>
                      <span className="text-sm font-bold">R$ 320.000</span>
                    </div>
                    <div className="w-full bg-muted rounded-full h-2 mt-2">
                      <div className="bg-primary rounded-full h-2" style={{ width: "93%" }} />
                    </div>
                    <p className="text-[10px] text-muted-foreground text-center">93% da meta atingida</p>
                  </div>
                </Card>
                <Card className="p-4 border-border/60 col-span-2">
                  <div className="flex items-center gap-2 mb-3">
                    <Trophy className="h-4 w-4 text-amber-500" />
                    <h4 className="text-xs font-semibold">Top 3 Atendentes do Período</h4>
                  </div>
                  <div className="grid grid-cols-3 gap-3">
                    {dadosComerciais.conversaoPorAtendente.slice(0, 3).map((a, i) => {
                      const medals = ["🥇", "🥈", "🥉"];
                      const bgColors = ["bg-amber-50 border-amber-200", "bg-slate-50 border-slate-200", "bg-orange-50 border-orange-200"];
                      return (
                        <div key={i} className={cn("p-3 rounded-lg border text-center", bgColors[i])}>
                          <span className="text-lg">{medals[i]}</span>
                          <p className="text-xs font-semibold mt-1">{a.nome}</p>
                          <p className="text-[10px] text-muted-foreground">{a.vendas} vendas</p>
                          <p className="text-xs font-bold text-primary mt-1">R$ {(a.receita / 1000).toFixed(0)}k</p>
                        </div>
                      );
                    })}
                  </div>
                </Card>
              </div>

              {/* Funil */}
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4 border-border/60">
                  <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
                    <Briefcase className="h-3.5 w-3.5 text-primary" /> Funil de Vendas
                  </h4>
                  <div className="space-y-3">
                    {dadosComerciais.funil.map((stage, i) => {
                      const total = dadosComerciais.funil.reduce((a, b) => a + b.value, 0);
                      const pct = ((stage.value / total) * 100).toFixed(1);
                      return (
                        <div key={i}>
                          <div className="flex items-center justify-between mb-1">
                            <span className="text-[10px] font-medium">{stage.name}</span>
                            <span className="text-[10px] font-bold">{stage.value} ({pct}%)</span>
                          </div>
                          <div className="w-full bg-muted rounded-full h-3">
                            <div className="rounded-full h-3 transition-all" style={{ width: `${pct}%`, backgroundColor: stage.fill }} />
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
                <ChartCard title="Vendas por dia">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dadosComerciais.vendasPorDia}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                      <XAxis dataKey="dia" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line type="monotone" dataKey="vendas" stroke="hsl(142, 71%, 45%)" strokeWidth={2} dot={{ r: 3 }} name="Vendas" />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Receita por produto">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosComerciais.receitaPorProduto} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                      <XAxis type="number" tick={{ fontSize: 10 }} tickFormatter={(v) => `R$${(v/1000).toFixed(0)}k`} />
                      <YAxis dataKey="produto" type="category" width={90} tick={{ fontSize: 9 }} />
                      <Tooltip contentStyle={tooltipStyle} formatter={(v: any) => `R$ ${v.toLocaleString()}`} />
                      <Bar dataKey="receita" fill="hsl(214, 85%, 51%)" radius={[0, 5, 5, 0]} name="Receita" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Motivos de perda">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosComerciais.motivosPerda} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="motivo" type="category" width={80} tick={{ fontSize: 9 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="quantidade" fill="hsl(0, 84%, 60%)" radius={[0, 5, 5, 0]} name="Leads perdidos" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>

              {/* Tabela comercial */}
              <Card className="p-4 border-border/60">
                <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
                  <BarChart2 className="h-3.5 w-3.5 text-primary" /> Ranking de Conversão por Atendente
                </h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Atendente</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Leads</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Orçamentos</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Vendas</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Conversão</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Ticket Médio</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Receita</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Ciclo Médio</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosComerciais.conversaoPorAtendente.map((row, i) => (
                        <tr key={i} className="border-b border-border/30 hover:bg-muted/20">
                          <td className="py-2 px-2 font-medium">{row.nome}</td>
                          <td className="text-center py-2 px-2">{row.leads}</td>
                          <td className="text-center py-2 px-2">{Math.round(row.leads * 0.75)}</td>
                          <td className="text-center py-2 px-2 font-semibold text-primary">{row.vendas}</td>
                          <td className="text-center py-2 px-2">{row.conversao}%</td>
                          <td className="text-center py-2 px-2">R$ {row.ticket.toLocaleString()}</td>
                          <td className="text-center py-2 px-2 font-semibold">R$ {row.receita.toLocaleString()}</td>
                          <td className="text-center py-2 px-2">{row.ciclo}d</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          );

        case "produtividade":
          return (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard label="Atendimentos / atendente" value="271" accent />
                <MetricCard label="Tempo online médio" value="7h10" />
                <MetricCard label="Tempo em pausa" value="54min" />
                <MetricCard label="Resolutividade" value="88%" accent trend="+2%" trendUp />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard title="Ranking de Produtividade">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosProdutividade.ranking} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                      <XAxis type="number" tick={{ fontSize: 10 }} />
                      <YAxis dataKey="nome" type="category" width={60} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Bar dataKey="atendimentos" fill="hsl(214, 85%, 51%)" radius={[0, 5, 5, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Distribuição de Carga por Atendente">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dadosEmpresaGrande.distribuicaoPorAtendente} cx="50%" cy="50%" labelLine={false}
                        label={({ nome, atendimentos }) => `${nome}: ${atendimentos}`} outerRadius={75} innerRadius={35}
                        dataKey="atendimentos" nameKey="nome" strokeWidth={0}>
                        {dadosEmpresaGrande.distribuicaoPorAtendente.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              <Card className="p-4 border-border/60">
                <h4 className="text-xs font-semibold mb-3">Detalhamento por Atendente</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Atendente</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Atendimentos</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Online</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Pausa</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Resolutividade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosProdutividade.ranking.map((row, i) => (
                        <tr key={i} className="border-b border-border/30 hover:bg-muted/20">
                          <td className="py-2 px-2 font-medium">{row.nome}</td>
                          <td className="text-center py-2 px-2">{row.atendimentos}</td>
                          <td className="text-center py-2 px-2">{row.online}</td>
                          <td className="text-center py-2 px-2">{row.pausa}</td>
                          <td className="text-center py-2 px-2">{row.resolutividade}%</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          );

        case "qualidade":
          return (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard label="NPS Geral" value="92" accent />
                <MetricCard label="Promotores" value="168" />
                <MetricCard label="Neutros" value="22" />
                <MetricCard label="Detratores" value="18" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <ChartCard title="Evolução do NPS">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={npsComparativo.evolucaoMensal}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                      <XAxis dataKey="mes" tick={{ fontSize: 10 }} /><YAxis domain={[70, 100]} tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={tooltipStyle} />
                      <Line type="monotone" dataKey="nps" stroke="hsl(214, 85%, 51%)" strokeWidth={2} dot={{ r: 3 }} />
                    </LineChart>
                  </ResponsiveContainer>
                </ChartCard>
                <ChartCard title="Promotores / Neutros / Detratores">
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
                <ChartCard title="Sentimento no período" className="lg:col-span-2">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosNpsQualidade.sentimento}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.08} />
                      <XAxis dataKey="periodo" tick={{ fontSize: 10 }} /><YAxis tick={{ fontSize: 10 }} />
                      <Tooltip contentStyle={tooltipStyle} /><Legend wrapperStyle={{ fontSize: 10 }} />
                      <Bar dataKey="positivo" fill="hsl(142, 71%, 45%)" stackId="a" name="Positivo" />
                      <Bar dataKey="neutro" fill="hsl(48, 89%, 48%)" stackId="a" name="Neutro" />
                      <Bar dataKey="negativo" fill="hsl(0, 84%, 60%)" stackId="a" name="Negativo" />
                    </BarChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
              <Card className="p-4 border-border/60">
                <h4 className="text-xs font-semibold mb-3">NPS por Atendente</h4>
                <div className="overflow-x-auto">
                  <table className="w-full text-[10px]">
                    <thead>
                      <tr className="border-b border-border/50">
                        <th className="text-left py-2 px-2 font-semibold text-muted-foreground">Atendente</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">NPS</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Sentimento</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">TMA</th>
                        <th className="text-center py-2 px-2 font-semibold text-muted-foreground">Alertas críticos</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dadosNpsQualidade.tabelaAtendentes.map((row, i) => (
                        <tr key={i} className="border-b border-border/30 hover:bg-muted/20">
                          <td className="py-2 px-2 font-medium">{row.nome}</td>
                          <td className="text-center py-2 px-2 font-bold text-primary">{row.nps}</td>
                          <td className="text-center py-2 px-2">
                            <Badge variant={row.sentimento === "Positivo" ? "default" : "secondary"} className="text-[9px]">{row.sentimento}</Badge>
                          </td>
                          <td className="text-center py-2 px-2">{row.tma}</td>
                          <td className="text-center py-2 px-2">{row.alertas}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </Card>
            </>
          );

        case "distribuicao":
          return (
            <>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <MetricCard label="Clientes com endereço" value="1.343" accent />
                <MetricCard label="Sem endereço" value="204" />
                <MetricCard label="Top estado" value="ES" />
                <MetricCard label="Top cidade" value="Vitória" />
              </div>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4 border-border/60">
                  <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
                    <Globe className="h-3.5 w-3.5 text-primary" /> Clientes por Estado
                  </h4>
                  <div className="space-y-2">
                    {dadosDistribuicao.estados.map((e, i) => {
                      const max = dadosDistribuicao.estados[0].clientes;
                      return (
                        <div key={i} className="flex items-center gap-2">
                          <span className="text-[10px] font-semibold w-6">{e.estado}</span>
                          <div className="flex-1 bg-muted rounded-full h-4 relative">
                            <div className="bg-primary/80 rounded-full h-4 flex items-center justify-end pr-2 transition-all"
                              style={{ width: `${(e.clientes / max) * 100}%` }}>
                              <span className="text-[9px] font-bold text-primary-foreground">{e.clientes}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </Card>
                <ChartCard title="Origem do Lead">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={dadosDistribuicao.origens} cx="50%" cy="50%" labelLine={false}
                        label={({ name, value }) => `${name}: ${value}%`} outerRadius={75} innerRadius={35}
                        dataKey="value" strokeWidth={0}>
                        {dadosDistribuicao.origens.map((_, i) => (
                          <Cell key={i} fill={COLORS[i % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip contentStyle={tooltipStyle} />
                    </PieChart>
                  </ResponsiveContainer>
                </ChartCard>
              </div>
            </>
          );

        case "equipe":
          return <RelatorioEquipePanel />;

        default: return null;
      }
    };

    return (
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="sm" className="h-7 text-[10px]" onClick={() => { setRelatorioDetalhe(null); setFiltrosAplicados(false); setGerandoRelatorio(false); }}>
            <ChevronLeft className="h-3 w-3 mr-1" /> Voltar
          </Button>
          <div className="flex items-center gap-2">
            {exportButtons}
            <Button variant="outline" size="sm" className="h-7 text-[10px]" disabled={!filtrosAplicados} onClick={() => toast.success("Modelo salvo!")}>
              <FileDown className="h-3 w-3 mr-1" /> Salvar Modelo
            </Button>
          </div>
        </div>

        <div className="flex items-center gap-2 mb-1">
          <cat.icon className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-semibold">{cat.nome}</h3>
        </div>

        {id === "equipe" ? (
          <RelatorioEquipePanel />
        ) : (
          <>
            {getFiltrosForReport(id)}

            {gerandoRelatorio ? (
              <Card className="p-12 border-border/60 flex flex-col items-center justify-center text-center">
                <Loader2 className="h-6 w-6 text-primary animate-spin mb-3" />
                <p className="text-xs text-muted-foreground">Gerando relatório...</p>
              </Card>
            ) : !filtrosAplicados ? (
              <Card className="p-8 border-border/60 flex flex-col items-center justify-center text-center">
                <CalendarDays className="h-8 w-8 text-muted-foreground/40 mb-3" />
                <p className="text-xs text-muted-foreground">Selecione o período e filtros para gerar o relatório.</p>
              </Card>
            ) : (
              <div className="space-y-4">
                {renderReportContent()}
              </div>
            )}
          </>
        )}
      </div>
    );
  };

  const renderRelatorios = () => {
    if (relatorioDetalhe) {
      return renderRelatorioDetalhe(relatorioDetalhe);
    }

    return (
      <div className="space-y-4">
        <div className="space-y-2">
          {relatorioCategories.map((cat) => (
            <div key={cat.id} onClick={() => { setRelatorioDetalhe(cat.id); setFiltrosAplicados(false); setGerandoRelatorio(false); }}
              className="flex items-center gap-3 p-4 rounded-lg border border-border/50 hover:bg-muted/30 transition-colors cursor-pointer group">
              <div className="p-2.5 rounded-md bg-primary/10">
                <cat.icon className="h-4.5 w-4.5 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-semibold text-foreground">{cat.nome}</h4>
                <p className="text-[10px] text-muted-foreground mt-0.5">{cat.desc}</p>
                <div className="flex flex-wrap gap-1 mt-1.5">
                  {cat.indicadores.slice(0, 4).map(ind => (
                    <Badge key={ind.id} variant="outline" className="text-[9px] py-0 font-normal">{ind.nome}</Badge>
                  ))}
                  {cat.indicadores.length > 4 && (
                    <Badge variant="outline" className="text-[9px] py-0 font-normal">+{cat.indicadores.length - 4}</Badge>
                  )}
                </div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-foreground transition-colors" />
            </div>
          ))}
        </div>
      </div>
    );
  };

  // Thalí Preditiva (Visão Estratégica)
  const renderPreditivaEstrategica = () => (
    <div className="space-y-5">
      <Card className="p-4 border-border/60 bg-primary/5">
        <div className="flex items-start gap-3">
          <Brain className="h-5 w-5 text-primary mt-0.5" />
          <div>
            <h4 className="text-xs font-semibold mb-1">Thalí Preditiva</h4>
            <p className="text-[10px] text-muted-foreground leading-relaxed">
              A Thalí Preditiva analisa dados históricos e comportamentais para gerar insights estratégicos para a gestão.
            </p>
          </div>
        </div>
      </Card>

      <Tabs defaultValue="previsao" className="w-full">
        <TabsList className="grid w-full grid-cols-3 mb-4">
          <TabsTrigger value="previsao" className="text-xs">Previsão</TabsTrigger>
          <TabsTrigger value="alertas" className="text-xs flex items-center gap-1.5">
            <AlertTriangle className="h-3 w-3" /> Alertas Ativos
          </TabsTrigger>
          <TabsTrigger value="feedback_thali" className="text-xs flex items-center gap-1.5">
            <ThumbsUp className="h-3 w-3" /> Feedback Thalí
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
        <TabsContent value="feedback_thali">
          {renderFeedback()}
        </TabsContent>
      </Tabs>
    </div>
  );

  const renderContent = () => {
    switch (activeSection) {
      // Visão Estratégica
      case "dashboard": return renderDashboard();
      case "relatorios": return renderRelatorios();
      case "preditiva_estrategica": return renderPreditivaEstrategica();
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
      case "motivos_transferencia": return <MotivosTransferenciaPanel />;
      case "motivos_finalizacao": return <MotivosFinalizacaoPanel />;
      // Controle
      case "alertas_config": return renderAlertasConfig();
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

  // Get current report category for contextual personalizar
  const currentReportCat = relatorioDetalhe ? relatorioCategories.find(c => c.id === relatorioDetalhe) : null;
  const personalizarCats = currentReportCat ? [currentReportCat] : relatorioCategories;

  return (
    <>
      <div className="h-screen flex flex-col bg-background">
        {/* Header */}
        <div className="px-5 py-3.5 border-b border-border/60 flex items-center justify-between flex-shrink-0">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
              <Sparkles className="h-4 w-4 text-primary-foreground" />
            </div>
            <div>
              <h2 className="text-sm font-bold text-foreground leading-tight">CONNECT</h2>
              <p className="text-[10px] text-muted-foreground leading-tight">Sistema de Gestão</p>
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

      {/* Dialog Personalizar Indicadores - Contextual */}
      <Dialog open={personalizarOpen} onOpenChange={setPersonalizarOpen}>
        <DialogContent className="sm:max-w-lg max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="text-sm">
              Personalizar {currentReportCat ? `— ${currentReportCat.nome}` : "Indicadores"}
            </DialogTitle>
          </DialogHeader>
          <p className="text-[10px] text-muted-foreground mb-3">
            {currentReportCat
              ? `Ative ou desative os indicadores do relatório de ${currentReportCat.nome}.`
              : "Ative ou desative os indicadores que deseja visualizar nos relatórios."
            }
          </p>
          <div className="space-y-4">
            {personalizarCats.map((cat) => (
              <div key={cat.id}>
                {!currentReportCat && (
                  <p className="text-[10px] font-semibold text-muted-foreground uppercase tracking-wider mb-2">{cat.nome}</p>
                )}
                <div className="space-y-1.5">
                  {cat.indicadores.map((ind) => (
                    <div key={ind.id} className="flex items-center justify-between p-2 rounded-lg border border-border/50">
                      <span className="text-xs font-medium">{ind.nome}</span>
                      <Switch
                        checked={indicadoresAtivos[ind.id] !== false}
                        onCheckedChange={(c) => setIndicadoresAtivos({ ...indicadoresAtivos, [ind.id]: c })}
                      />
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
          <Button size="sm" className="w-full mt-4 h-8 text-xs" onClick={() => { setPersonalizarOpen(false); toast.success("Indicadores atualizados!"); }}>
            <Save className="h-3.5 w-3.5 mr-1.5" /> Salvar Preferências
          </Button>
        </DialogContent>
      </Dialog>
    </>
  );
};
