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

type SecaoPainel =
  | "dashboards"
  | "roteiros"
  | "relatorios"
  | "nps"
  | "alertas"
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

const menuItems: MenuItem[] = [
  { id: "dashboards", label: "Dashboards", icon: LayoutGrid },
  { id: "roteiros", label: "Roteiros", icon: FileText },
  { id: "nps", label: "Net Promoter Score (NPS)", icon: ThumbsUp },
  { id: "alertas", label: "Alertas", icon: Bell },
  { id: "preditiva", label: "Thalí Preditiva", icon: TrendingUp },
  { id: "feedback", label: "Feedback da Thalí", icon: MessageSquare },
  { id: "indicadores", label: "Indicadores", icon: Activity },
  { id: "ideias", label: "Ideias", icon: Lightbulb },
  { id: "etiquetas", label: "Etiquetas", icon: Award, apenasGestor: true },
  { id: "relatorios", label: "Relatórios Inteligentes", icon: BarChart3 },
  { id: "configuracoes", label: "Configurações", icon: Settings, apenasGestor: true },
  { id: "auditoria", label: "Auditoria", icon: History },
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
    { name: "Promotores", value: 168, color: "#22C55E" },
    { name: "Neutros", value: 22, color: "#F59E0B" },
    { name: "Detratores", value: 18, color: "#EF4444" },
  ]
};

// Dados simulados de GRANDE EMPRESA
const dadosEmpresaGrande = {
  // Cards superiores
  totalAtendimentos: 2847,
  tmaSetor: "3m 42s",
  tmeSetor: "5m 11s",
  taxaConclusao: 87,

  // Atendimentos por dia
  atendimentosPorDia: [
    { dia: "Seg", atendimentos: 412 },
    { dia: "Ter", atendimentos: 386 },
    { dia: "Qua", atendimentos: 502 },
    { dia: "Qui", atendimentos: 631 },
    { dia: "Sex", atendimentos: 713 },
    { dia: "Sáb", atendimentos: 279 },
    { dia: "Dom", atendimentos: 194 },
  ],

  // TMA e TME por dia
  tmaTmePorDia: [
    { dia: "Seg", TMA: 3.2, TME: 4.8 },
    { dia: "Ter", TMA: 3.4, TME: 5.3 },
    { dia: "Qua", TMA: 3.5, TME: 6.1 },
    { dia: "Qui", TMA: 3.2, TME: 5.8 },
    { dia: "Sex", TMA: 2.9, TME: 4.7 },
    { dia: "Sáb", TMA: 4.6, TME: 7.4 },
    { dia: "Dom", TMA: 5.1, TME: 8.1 },
  ],

  // Distribuição por atendente
  distribuicaoPorAtendente: [
    { nome: "Geovana", atendimentos: 314 },
    { nome: "Paloma", atendimentos: 287 },
    { nome: "Emilly", atendimentos: 274 },
    { nome: "Marcos", atendimentos: 251 },
    { nome: "Bianca", atendimentos: 229 },
  ],

  // Status de atendimentos
  statusAtendimentos: [
    { name: "Finalizados", value: 1124 },
    { name: "Em Atendimento", value: 382 },
    { name: "Aguardando Resposta", value: 514 },
    { name: "Em Fila", value: 827 },
  ],

  // Horários de pico
  horariosPico: [
    { horario: "08-09", msgs: 45, nivel: "Médio", cor: "bg-blue-100 text-blue-700" },
    { horario: "09-10", msgs: 62, nivel: "Alto", cor: "bg-orange-100 text-orange-700" },
    { horario: "10-11", msgs: 88, nivel: "Muito Alto", cor: "bg-red-100 text-red-700" },
    { horario: "11-12", msgs: 44, nivel: "Médio", cor: "bg-blue-100 text-blue-700" },
    { horario: "12-13", msgs: 29, nivel: "Baixo", cor: "bg-green-100 text-green-700" },
    { horario: "13-14", msgs: 56, nivel: "Alto", cor: "bg-orange-100 text-orange-700" },
  ],

  // Relatórios inteligentes
  npsGeral: 92,
  porcentagemTransferencia: 13,
  taxaReabertura: 8,
  rankingTop3: [
    { atendente: "Geovana", atendimentos: 314, tempoMedio: "3m21s", nps: 95 },
    { atendente: "Emilly", atendimentos: 298, tempoMedio: "3m48s", nps: 92 },
    { atendente: "Paloma", atendimentos: 283, tempoMedio: "4m01s", nps: 93 },
  ],

  // Transferências
  transferencias: [
    { hora: "09:33", de: "Marcos", para: "Geovana", paciente: "Ana Cristina" },
    { hora: "10:14", de: "Paloma", para: "Emilly", paciente: "Luiz Fernando" },
    { hora: "11:03", de: "Emilly", para: "Gestão", paciente: "Caso especial" },
    { hora: "13:27", de: "Bianca", para: "Marcos", paciente: "José Silva" },
    { hora: "14:52", de: "Geovana", para: "Paloma", paciente: "Maria Santos" },
  ],

  // NPS Feedback
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

  // Alertas da Thalí
  alertas: [
    { tipo: "Fila alta", setor: "Pré-venda", detalhes: "14 pacientes aguardando acima de 10 minutos.", cor: "red" },
    { tipo: "NPS baixo", atendente: "Marcos", detalhes: "NPS nas últimas 24h caiu para 74.", cor: "orange" },
    { tipo: "Tempo médio alto", atendente: "Bianca", detalhes: "TMA subiu para 4m52s.", cor: "yellow" },
  ],

  // Thalí Preditiva
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

  // Feedback da Thalí
  feedbackIA: {
    elogios: [
      { atendente: "Geovana", motivo: "Maior índice de satisfação do setor" },
      { atendente: "Emilly", motivo: "Tempo médio extremamente eficiente" },
    ],
    melhorias: [
      { atendente: "Marcos", motivo: "NPS baixo recorrente nas últimas 72h" },
    ],
  },

  // Indicadores personalizados
  indicadores: [
    { nome: "Volume mensal", valor: "12.214" },
    { nome: "Atendimentos complexos", valor: "431" },
    { nome: "Taxa de resolutividade", valor: "89%" },
  ],

  // Auditoria de ações
  auditoria: [
    { acao: "Alteração de URA", por: "Gestor", horario: "08:12", data: "Hoje" },
    { acao: "Edição de Roteiro", por: "Coordenação", horario: "10:47", data: "Hoje" },
    { acao: "Validação de perfil", por: "Coordenação", horario: "14:19", data: "Hoje" },
  ],

  // Ideias
  ideias: [
    { usuario: "Paloma", ideia: "Criar scripts automáticos de resposta rápida.", status: "Em análise" },
    { usuario: "Marcos", ideia: "Otimizar fila com Thalí.", status: "Implementada" },
    { usuario: "Emilly", ideia: "Criar modo escuro mais suave.", status: "Aprovada" },
  ],
  reconhecimentoSemana: { usuario: "Emilly", motivo: "Melhor evolução de NPS" },
};

const COLORS = ["#0A2647", "#144272", "#205295", "#2C74B3"];

interface PainelUnificadoProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const PainelUnificado = ({ open, onOpenChange }: PainelUnificadoProps) => {
  const [secaoAtiva, setSecaoAtiva] = useState<SecaoPainel>("dashboards");
  const { isCoordenacao, isGestor } = useAtendenteContext();

  const renderConteudo = () => {
    switch (secaoAtiva) {
      case "dashboards":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-2xl font-bold text-[#0A2647] truncate">
                Dashboards de Produtividade
              </h3>
              <select className="px-3 py-2 border border-border rounded-lg text-sm bg-background focus:outline-none focus:ring-2 focus:ring-primary/20 min-w-[160px]">
                <option>Últimos 7 dias</option>
                <option>Últimos 30 dias</option>
                <option>Últimos 90 dias</option>
              </select>
            </div>

            {/* Filtros por Setor e Unidade */}
            <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-lg border">
              <Filter className="h-4 w-4 text-muted-foreground mt-2" />
              <Select defaultValue="todos">
                <SelectTrigger className="w-40">
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
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Unidades" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todas">Todas as Unidades</SelectItem>
                  <SelectItem value="sede">Sede - Vitória</SelectItem>
                  <SelectItem value="sp">Unidade São Paulo</SelectItem>
                  <SelectItem value="rj">Unidade Rio de Janeiro</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cards de métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 bg-gradient-to-br from-[#0A2647]/5 to-[#0A2647]/10 border-[#0A2647]/20 overflow-hidden">
                <div className="text-4xl font-bold text-[#0A2647] mb-1 truncate">
                  {dadosEmpresaGrande.totalAtendimentos.toLocaleString()}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Total de Atendimentos
                </p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-[#144272]/5 to-[#144272]/10 border-[#144272]/20 overflow-hidden">
                <div className="text-4xl font-bold text-[#144272] mb-1 truncate">
                  {dadosEmpresaGrande.tmaSetor}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  TMA - Tempo Médio Atendimento
                </p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-[#205295]/5 to-[#205295]/10 border-[#205295]/20 overflow-hidden">
                <div className="text-4xl font-bold text-[#205295] mb-1 truncate">
                  {dadosEmpresaGrande.tmeSetor}
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  TME - Tempo Médio Espera
                </p>
              </Card>
              <Card className="p-6 bg-gradient-to-br from-[#2C74B3]/5 to-[#2C74B3]/10 border-[#2C74B3]/20 overflow-hidden">
                <div className="text-4xl font-bold text-[#2C74B3] mb-1 truncate">
                  {dadosEmpresaGrande.taxaConclusao}%
                </div>
                <p className="text-sm text-muted-foreground line-clamp-2">
                  Taxa de Resolutividade
                </p>
                <div className="text-xs text-muted-foreground mt-1 space-y-0.5">
                  <p>Pacientes no chat: 240</p>
                  <p>Finalizados: 180</p>
                </div>
              </Card>
            </div>

            {/* Gráficos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card className="p-6 overflow-hidden">
                <h4 className="font-semibold mb-4 text-[#0A2647] text-lg">
                  Atendimentos por Dia da Semana
                </h4>
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosEmpresaGrande.atendimentosPorDia}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="dia" />
                      <YAxis />
                      <Tooltip />
                      <Bar dataKey="atendimentos" fill="#0A2647" radius={[8, 8, 0, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6 overflow-hidden">
                <h4 className="font-semibold mb-4 text-[#0A2647] text-lg">
                  TMA e TME Diário (minutos)
                </h4>
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={dadosEmpresaGrande.tmaTmePorDia}>
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
                        dot={{ r: 5, fill: "#0A2647" }}
                        name="TMA"
                      />
                      <Line
                        type="monotone"
                        dataKey="TME"
                        stroke="#2C74B3"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#2C74B3" }}
                        name="TME"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6 overflow-hidden">
                <h4 className="font-semibold mb-4 text-[#0A2647] text-lg">
                  Distribuição por Atendente
                </h4>
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dadosEmpresaGrande.distribuicaoPorAtendente} layout="vertical">
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis type="number" />
                      <YAxis dataKey="nome" type="category" width={80} />
                      <Tooltip />
                      <Bar dataKey="atendimentos" fill="#144272" radius={[0, 8, 8, 0]} />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              <Card className="p-6 overflow-hidden">
                <h4 className="font-semibold mb-4 text-[#0A2647] text-lg">
                  Status de Atendimentos
                </h4>
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={dadosEmpresaGrande.statusAtendimentos}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {dadosEmpresaGrande.statusAtendimentos.map((entry, index) => (
                          <Cell
                            key={`cell-${index}`}
                            fill={COLORS[index % COLORS.length]}
                          />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>
            </div>

            {/* Horários de Pico */}
            <Card className="p-6 overflow-hidden">
              <h4 className="font-semibold mb-4 text-[#0A2647] text-lg">
                Horários de Pico (Classificação pela Thalí)
              </h4>
              <div className="space-y-2 max-h-[300px] overflow-y-auto">
                {dadosEmpresaGrande.horariosPico.map((item) => (
                  <div
                    key={item.horario}
                    className="flex justify-between items-center p-3 rounded-lg bg-muted/30 hover:bg-muted/50 transition-colors"
                  >
                    <span className="font-semibold text-foreground">{item.horario}h</span>
                    <span className="text-muted-foreground text-sm">
                      {item.msgs} mensagens
                    </span>
                    <span
                      className={cn(
                        "px-3 py-1 rounded-full text-xs font-bold whitespace-nowrap",
                        item.cor
                      )}
                    >
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
            {/* Header com botão de relatório */}
            <div className="flex items-center justify-between gap-4">
              <h3 className="text-2xl font-bold text-[#0A2647]">
                Net Promoter Score (NPS)
              </h3>
              <Button variant="outline" size="sm">
                <Download className="h-4 w-4 mr-2" />
                Gerar Relatório
              </Button>
            </div>

            {/* Filtros */}
            <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-lg border">
              <Filter className="h-4 w-4 text-muted-foreground mt-2" />
              <Select defaultValue="todos">
                <SelectTrigger className="w-36">
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
                <SelectTrigger className="w-32">
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
                <SelectTrigger className="w-28">
                  <SelectValue placeholder="Ano" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="2024">2024</SelectItem>
                  <SelectItem value="2025">2025</SelectItem>
                  <SelectItem value="2026">2026</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Cards de métricas */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
              <Card className="p-6 overflow-hidden">
                <div className="text-sm text-muted-foreground mb-1 truncate">
                  Total Respondido
                </div>
                <div className="text-4xl font-bold text-[#0A2647] truncate">
                  {dadosEmpresaGrande.nps.totalRespondido}
                </div>
              </Card>
              <Card className="p-6 overflow-hidden">
                <div className="text-sm text-muted-foreground mb-1 truncate">
                  NPS Médio
                </div>
                <div className="text-4xl font-bold text-green-600 truncate">
                  {dadosEmpresaGrande.nps.npsMedio}
                </div>
              </Card>
              <Card className="p-6 overflow-hidden">
                <div className="text-sm text-muted-foreground mb-1 truncate">
                  Promotores
                </div>
                <div className="text-4xl font-bold text-green-600 truncate">
                  {dadosEmpresaGrande.nps.promotores}
                </div>
              </Card>
              <Card className="p-6 overflow-hidden">
                <div className="text-sm text-muted-foreground mb-1 truncate">
                  Detratores
                </div>
                <div className="text-4xl font-bold text-destructive truncate">
                  {dadosEmpresaGrande.nps.detratores}
                </div>
              </Card>
            </div>

            {/* Gráficos comparativos */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* NPS por Atendente */}
              <Card className="p-6 overflow-hidden">
                <h4 className="font-semibold mb-4 text-[#0A2647] text-lg">
                  NPS por Atendente
                </h4>
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={npsComparativo.porAtendente}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="nome" />
                      <YAxis domain={[0, 100]} />
                      <Tooltip />
                      <Bar dataKey="nps" fill="#0A2647" radius={[8, 8, 0, 0]} name="NPS" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Evolução Mensal do NPS */}
              <Card className="p-6 overflow-hidden">
                <h4 className="font-semibold mb-4 text-[#0A2647] text-lg">
                  Evolução Mensal do NPS
                </h4>
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={npsComparativo.evolucaoMensal}>
                      <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                      <XAxis dataKey="mes" />
                      <YAxis domain={[80, 100]} />
                      <Tooltip />
                      <Line
                        type="monotone"
                        dataKey="nps"
                        stroke="#0A2647"
                        strokeWidth={3}
                        dot={{ r: 5, fill: "#0A2647" }}
                        name="NPS"
                      />
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Distribuição Promotores/Neutros/Detratores */}
              <Card className="p-6 overflow-hidden">
                <h4 className="font-semibold mb-4 text-[#0A2647] text-lg">
                  Distribuição de Respostas
                </h4>
                <div className="w-full h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={npsComparativo.distribuicao}
                        cx="50%"
                        cy="50%"
                        labelLine={false}
                        label={({ name, value }) => `${name}: ${value}`}
                        outerRadius={90}
                        fill="#8884d8"
                        dataKey="value"
                      >
                        {npsComparativo.distribuicao.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </Card>

              {/* Feedbacks Recentes */}
              <Card className="p-6 overflow-hidden col-span-1 lg:col-span-2">
                <h4 className="font-semibold mb-4 text-lg">Feedbacks Recentes</h4>
                {/* Filtros de Feedbacks Recentes */}
                <div className="flex flex-wrap gap-3 mb-4 p-3 bg-muted/30 rounded-lg border">
                  <Filter className="h-4 w-4 text-muted-foreground mt-2" />
                  <Select defaultValue="todos">
                    <SelectTrigger className="w-36">
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
                  <Select defaultValue="todos">
                    <SelectTrigger className="w-36">
                      <SelectValue placeholder="Setor" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="todos">Todos</SelectItem>
                      <SelectItem value="pre-venda">Pré-venda</SelectItem>
                      <SelectItem value="pos-venda">Pós-venda</SelectItem>
                      <SelectItem value="suporte">Suporte</SelectItem>
                    </SelectContent>
                  </Select>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <input type="date" className="px-2 py-1.5 border border-border rounded-md text-sm bg-background" placeholder="De" />
                    <span className="text-xs text-muted-foreground">até</span>
                    <input type="date" className="px-2 py-1.5 border border-border rounded-md text-sm bg-background" placeholder="Até" />
                  </div>
                </div>
                <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                  {dadosEmpresaGrande.nps.feedbacksRecentes.map((feedback, idx) => (
                    <div
                      key={idx}
                      className="p-4 rounded-lg border border-border"
                    >
                      <div className="flex items-center justify-between mb-2 gap-4">
                        <span className="font-semibold truncate">{feedback.atendente}</span>
                        <span className="text-2xl font-bold text-[#0A2647] flex-shrink-0">
                          {feedback.nota}/10
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground italic line-clamp-2">
                        "{feedback.comentario}"
                      </p>
                    </div>
                  ))}
                </div>
              </Card>
            </div>
          </div>
        );

      case "alertas":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <Bell className="h-6 w-6 text-[#0A2647]" />
              <h3 className="text-2xl font-bold text-[#0A2647]">
                Alertas Automáticos da Thalí
              </h3>
            </div>
            <div className="space-y-3 max-h-[600px] overflow-y-auto pr-2">
              {dadosEmpresaGrande.alertas.map((alerta, idx) => (
                <Card
                  key={idx}
                  className={cn(
                    "p-4 border-l-4 overflow-hidden",
                    alerta.cor === "red" && "border-l-red-500 bg-red-50/50",
                    alerta.cor === "orange" && "border-l-orange-500 bg-orange-50/50",
                    alerta.cor === "yellow" && "border-l-yellow-500 bg-yellow-50/50"
                  )}
                >
                  <div className="flex items-start gap-3">
                    <Bell className={cn(
                      "h-5 w-5 mt-0.5 flex-shrink-0",
                      alerta.cor === "red" && "text-red-500",
                      alerta.cor === "orange" && "text-orange-500",
                      alerta.cor === "yellow" && "text-yellow-600"
                    )} />
                    <div className="flex-1 min-w-0">
                      <h4 className="font-semibold mb-1 truncate">
                        {alerta.tipo}
                        {alerta.setor && ` - ${alerta.setor}`}
                        {alerta.atendente && ` - ${alerta.atendente}`}
                      </h4>
                      <p className="text-sm text-muted-foreground line-clamp-2">
                        {alerta.detalhes}
                      </p>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>
        );

      case "preditiva":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <TrendingUp className="h-6 w-6 text-[#0A2647]" />
              <h3 className="text-2xl font-bold text-[#0A2647]">
                Análise Preditiva da Thalí
              </h3>
            </div>

            <Card className="p-6 bg-gradient-to-br from-purple-50 to-blue-50 overflow-hidden">
              <h4 className="font-semibold mb-4 text-lg">Previsões para Hoje</h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground mb-1 truncate">
                    Horário de Pico Previsto
                  </div>
                  <div className="text-2xl font-bold text-[#0A2647] truncate">
                    {dadosEmpresaGrande.preditiva.horarioPicoPrevisto}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground mb-1 truncate">
                    Volume Esperado Hoje
                  </div>
                  <div className="text-2xl font-bold text-[#0A2647] truncate">
                    {dadosEmpresaGrande.preditiva.volumeEsperadoHoje}
                  </div>
                </div>
                <div className="min-w-0">
                  <div className="text-sm text-muted-foreground mb-1 truncate">
                    Setor Mais Demandado
                  </div>
                  <div className="text-2xl font-bold text-[#0A2647] truncate">
                    {dadosEmpresaGrande.preditiva.setorMaisDemandado}
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6 overflow-hidden">
              <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
                <Lightbulb className="h-5 w-5 text-yellow-500" />
                Recomendações da Thalí
              </h4>
              <div className="space-y-2 max-h-[400px] overflow-y-auto pr-2">
                {dadosEmpresaGrande.preditiva.recomendacoes.map((rec, idx) => (
                  <div
                    key={idx}
                    className="p-3 rounded-lg bg-muted/30 flex items-start gap-3"
                  >
                    <div className="w-6 h-6 rounded-full bg-primary/10 flex items-center justify-center flex-shrink-0 mt-0.5">
                      <span className="text-xs font-bold text-primary">{idx + 1}</span>
                    </div>
                    <p className="text-sm flex-1">{rec}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case "feedback":
        return (
          <div className="space-y-6">
            <div className="flex items-center gap-2">
              <MessageSquare className="h-6 w-6 text-[#0A2647]" />
              <h3 className="text-2xl font-bold text-[#0A2647]">
                Feedback Gerado pela Thalí
              </h3>
            </div>

            <Card className="p-6 overflow-hidden">
              <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
                <ThumbsUp className="h-5 w-5 text-green-600" />
                Elogios
              </h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {dadosEmpresaGrande.feedbackIA.elogios.map((elogio, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-green-50 border border-green-200"
                  >
                    <div className="font-semibold text-green-900 mb-1 truncate">
                      {elogio.atendente}
                    </div>
                    <p className="text-sm text-green-800">{elogio.motivo}</p>
                  </div>
                ))}
              </div>
            </Card>

            <Card className="p-6 overflow-hidden">
              <h4 className="font-semibold mb-4 text-lg flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-orange-600" />
                Oportunidades de Melhoria
              </h4>
              <div className="space-y-3 max-h-[300px] overflow-y-auto pr-2">
                {dadosEmpresaGrande.feedbackIA.melhorias.map((melhoria, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-lg bg-orange-50 border border-orange-200"
                  >
                    <div className="font-semibold text-orange-900 mb-1 truncate">
                      {melhoria.atendente}
                    </div>
                    <p className="text-sm text-orange-800">{melhoria.motivo}</p>
                  </div>
                ))}
              </div>
            </Card>
          </div>
        );

      case "indicadores":
        return (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h3 className="text-2xl font-bold text-[#0A2647]">
                Indicadores Personalizados
              </h3>
              {(isCoordenacao || isGestor) && (
                <Button className="bg-[#0A2647] hover:bg-[#144272]">
                  <Activity className="h-4 w-4 mr-2" />
                  Criar Indicador
                </Button>
              )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {dadosEmpresaGrande.indicadores.map((indicador, idx) => (
                <Card key={idx} className="p-6 overflow-hidden">
                  <div className="text-sm text-muted-foreground mb-1 truncate">
                    {indicador.nome}
                  </div>
                  <div className="text-4xl font-bold text-[#0A2647] truncate">
                    {indicador.valor}
                  </div>
                </Card>
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
          {/* Menu Lateral */}
          <div className="w-64 border-r border-border bg-muted/30 flex flex-col flex-shrink-0">
            <div className="p-4 border-b border-border flex-shrink-0">
              <div className="flex items-center gap-2 mb-1">
                <LayoutGrid className="h-5 w-5 text-[#0A2647]" />
                <h2 className="text-lg font-bold text-[#0A2647]">
                  Painel Estratégico
                </h2>
              </div>
              <p className="text-[10px] text-muted-foreground">
                Grupo Liruz
              </p>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-2 space-y-1">
                {menuItems
                  .filter(item => !item.apenasGestor || isGestor || isCoordenacao)
                  .map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setSecaoAtiva(item.id)}
                    className={cn(
                      "w-full flex items-center gap-3 px-3 py-2.5 rounded-lg text-left transition-all",
                      "hover:bg-primary/10",
                      secaoAtiva === item.id
                        ? "bg-[#0A2647] text-white shadow-md"
                        : "text-foreground"
                    )}
                  >
                    <item.icon className="h-4 w-4 flex-shrink-0" />
                    <span className="text-sm font-medium truncate">{item.label}</span>
                  </button>
                ))}
              </div>
            </ScrollArea>
          </div>

          {/* Área Principal */}
          <div className="flex-1 flex flex-col overflow-hidden min-w-0">
            <div className="px-6 py-4 border-b border-border bg-card flex items-center justify-between flex-shrink-0">
              <div className="flex items-center gap-2 min-w-0">
                {(() => {
                  const activeItem = menuItems.find((m) => m.id === secaoAtiva);
                  if (activeItem) {
                    const IconComponent = activeItem.icon;
                    return <IconComponent className="h-5 w-5 text-primary flex-shrink-0" />;
                  }
                  return null;
                })()}
                <h3 className="font-semibold text-lg truncate">
                  {menuItems.find((m) => m.id === secaoAtiva)?.label}
                </h3>
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => onOpenChange(false)}
                className="flex-shrink-0"
              >
                <X className="h-5 w-5" />
              </Button>
            </div>

            <ScrollArea className="flex-1">
              <div className="p-6 pb-8 max-w-full">{renderConteudo()}</div>
            </ScrollArea>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};
