import { useState, useMemo } from "react";
import { 
  Download, Filter, Calendar, Users, Building2, Package,
  TrendingUp, TrendingDown, Target, BarChart3, PieChart as PieChartIcon,
  ArrowUpRight, ArrowDownRight, Clock, DollarSign, UserCheck, FileText,
  Star, Lightbulb, CheckCircle2, Brain, CalendarClock, Trophy, Medal
} from "lucide-react";
import { VisaoComercialPanel } from "./VisaoComercialPanel";
import { DateRangeFilter } from "./DateRangeFilter";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
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
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { cn } from "@/lib/utils";
import { ThaliAvatar } from "./ThaliAvatar";

// --- SEED-BASED SIMULATION ---
function seededRandom(seed: string) {
  let h = 0;
  for (let i = 0; i < seed.length; i++) {
    h = Math.imul(31, h) + seed.charCodeAt(i) | 0;
  }
  return () => {
    h = Math.imul(h ^ (h >>> 16), 0x45d9f3b);
    h = Math.imul(h ^ (h >>> 13), 0x45d9f3b);
    h ^= h >>> 16;
    return (h >>> 0) / 4294967296;
  };
}

function generateMockForFilters(filters: Record<string, string>) {
  const seed = Object.values(filters).sort().join("|");
  const rng = seededRandom(seed);
  const r = (min: number, max: number) => Math.floor(rng() * (max - min + 1)) + min;
  return {
    total: r(400, 1200),
    aprovados: r(200, 800),
    rejeitados: r(50, 300),
    pendentes: r(30, 200),
    valorTotal: r(500000, 2000000),
    valorAprovado: r(300000, 1500000),
    porDia: ["Seg","Ter","Qua","Qui","Sex","Sáb","Dom"].map(dia => ({
      dia, enviados: r(40, 200), aprovados: r(20, 120)
    })),
    porAtendente: [
      { nome: "Geovana", enviados: r(100, 250), taxa: r(55, 75) },
      { nome: "Paloma", enviados: r(80, 200), taxa: r(50, 70) },
      { nome: "Emilly", enviados: r(80, 200), taxa: r(55, 75) },
      { nome: "Marcos", enviados: r(70, 180), taxa: r(45, 65) },
      { nome: "Bianca", enviados: r(60, 170), taxa: r(48, 68) },
    ],
    funilVendas: [
      { etapa: "Leads", valor: r(1500, 3500), fill: "#0A2647" },
      { etapa: "Orçamento", valor: r(500, 1200), fill: "#205295" },
      { etapa: "Negociação", valor: r(300, 800), fill: "#2C74B3" },
      { etapa: "Fechados", valor: r(100, 500), fill: "#3B82F6" },
    ],
    motivosPerda: [
      { motivo: "Preço alto", quantidade: r(50, 120), percentual: r(25, 40) },
      { motivo: "Concorrência", quantidade: r(30, 90), percentual: r(15, 30) },
      { motivo: "Sem retorno", quantidade: r(20, 80), percentual: r(12, 25) },
      { motivo: "Prazo", quantidade: r(15, 60), percentual: r(8, 20) },
      { motivo: "Outros", quantidade: r(10, 40), percentual: r(5, 15) },
    ],
    cicloMedio: {
      mediaGeral: +(3 + rng() * 5).toFixed(1),
      mediaMes: +(2 + rng() * 4).toFixed(1),
      evolucao: ["Jul","Ago","Set","Out","Nov","Dez"].map(mes => ({
        mes, dias: +(3 + rng() * 5).toFixed(1)
      })),
      porProduto: [
        { produto: "Cirurgia A", dias: +(5 + rng() * 5).toFixed(1) },
        { produto: "Consulta", dias: +(1 + rng() * 3).toFixed(1) },
        { produto: "Exame", dias: +(0.5 + rng() * 2).toFixed(1) },
        { produto: "Cirurgia B", dias: +(6 + rng() * 5).toFixed(1) },
        { produto: "Procedimento", dias: +(2 + rng() * 4).toFixed(1) },
      ],
    },
    // Product data for commercial
    topProdutos: [
      { produto: "Cirurgia A", qtd: r(80, 200), receita: r(200000, 800000) },
      { produto: "Consulta Premium", qtd: r(120, 300), receita: r(100000, 500000) },
      { produto: "Exame Completo", qtd: r(60, 150), receita: r(80000, 300000) },
    ],
    produtosFunil: [
      { produto: "Cirurgia A", enviados: r(100, 250), negociacao: r(50, 120), vendidos: r(30, 80), perdidos: r(10, 40) },
      { produto: "Consulta Premium", enviados: r(80, 200), negociacao: r(40, 100), vendidos: r(25, 70), perdidos: r(8, 30) },
      { produto: "Exame Completo", enviados: r(60, 150), negociacao: r(30, 80), vendidos: r(15, 50), perdidos: r(5, 25) },
      { produto: "Procedimento", enviados: r(40, 120), negociacao: r(20, 60), vendidos: r(10, 35), perdidos: r(5, 20) },
    ],
  };
}

// Dados para Relatório Geral por Atendente
const relatorioGeralAtendente: Record<string, any> = {
  geovana: {
    nome: "Geovana Silva", dataCadastro: "15/03/2023", setor: "Pré-venda",
    tempoEmpresa: "1 ano e 10 meses", nps: 95, resolutividade: 92, tma: "3m 21s", tme: "1m 12s",
    totalAtendimentos: 4287, orcamentosEnviados: 187, vendasRealizadas: 127, leadsRecebidos: 312,
    ticketMedio: 1850, cicloMedioVenda: 4.2,
    ideias: { adicionadas: 12, aprovadas: 8, lista: [
      { titulo: "Automação de follow-up", status: "Aprovada" },
      { titulo: "Template de orçamento", status: "Aprovada" },
      { titulo: "Integração com agenda", status: "Em análise" },
    ]},
    radarData: [
      { metric: "NPS", valor: 95, media: 88 }, { metric: "Resolutividade", valor: 92, media: 85 },
      { metric: "TMA", valor: 88, media: 75 }, { metric: "Follow-up", valor: 85, media: 70 },
      { metric: "Conversão", valor: 68, media: 55 },
    ],
    historicoAtendimentos: [
      { data: "05/03/2026", paciente: "Ricardo Fernandes", tipo: "Orçamento", resultado: "Vendido", valor: "R$ 1.050,00" },
      { data: "04/03/2026", paciente: "Maria Silva", tipo: "Consulta", resultado: "Agendado", valor: "-" },
      { data: "04/03/2026", paciente: "João Santos", tipo: "Orçamento", resultado: "Em negociação", valor: "R$ 350,00" },
      { data: "03/03/2026", paciente: "Ana Costa", tipo: "Retorno", resultado: "Finalizado", valor: "-" },
      { data: "03/03/2026", paciente: "Carlos Lima", tipo: "Orçamento", resultado: "Perdido", valor: "R$ 2.200,00" },
    ],
    analiseThalí: {
      elogios: [
        "Geovana mantém consistentemente o maior NPS da equipe (95%), demonstrando excelente capacidade de relacionamento.",
        "Seu TMA de 3m 21s está 15% abaixo da média do setor, evidenciando eficiência.",
        "Análise de sentimento indica que 94% das conversas terminam com tom positivo."
      ],
      sugestoes: [
        "Compartilhar técnicas de atendimento com a equipe para elevar o NPS geral.",
        "Considerar mentoria para novos colaboradores do setor."
      ]
    }
  },
  paloma: {
    nome: "Paloma Santos", dataCadastro: "22/06/2023", setor: "Pré-venda",
    tempoEmpresa: "1 ano e 7 meses", nps: 93, resolutividade: 89, tma: "4m 01s", tme: "1m 30s",
    totalAtendimentos: 3892, orcamentosEnviados: 156, vendasRealizadas: 97, leadsRecebidos: 276,
    ticketMedio: 1620, cicloMedioVenda: 5.1,
    ideias: { adicionadas: 8, aprovadas: 5, lista: [
      { titulo: "Dashboard de métricas", status: "Aprovada" },
      { titulo: "Alertas automáticos", status: "Aprovada" },
    ]},
    radarData: [
      { metric: "NPS", valor: 93, media: 88 }, { metric: "Resolutividade", valor: 89, media: 85 },
      { metric: "TMA", valor: 82, media: 75 }, { metric: "Follow-up", valor: 78, media: 70 },
      { metric: "Conversão", valor: 62, media: 55 },
    ],
    historicoAtendimentos: [
      { data: "05/03/2026", paciente: "Lucas Mendes", tipo: "Orçamento", resultado: "Vendido", valor: "R$ 800,00" },
      { data: "04/03/2026", paciente: "Beatriz Alves", tipo: "Consulta", resultado: "Agendado", valor: "-" },
    ],
    analiseThalí: {
      elogios: [
        "Paloma apresenta NPS consistente de 93%, entre os melhores da equipe.",
        "Taxa de resolutividade de 89% demonstra competência técnica.",
      ],
      sugestoes: [
        "Trabalhar a redução do TMA em atendimentos mais complexos.",
        "Aumentar taxa de follow-up para melhorar conversões."
      ]
    }
  },
  emilly: {
    nome: "Emilly Oliveira", dataCadastro: "10/09/2023", setor: "Pré-venda",
    tempoEmpresa: "1 ano e 4 meses", nps: 92, resolutividade: 91, tma: "3m 48s", tme: "1m 18s",
    totalAtendimentos: 3654, orcamentosEnviados: 148, vendasRealizadas: 105, leadsRecebidos: 289,
    ticketMedio: 1540, cicloMedioVenda: 4.6,
    ideias: { adicionadas: 15, aprovadas: 11, lista: [
      { titulo: "Modo escuro suave", status: "Aprovada" },
      { titulo: "Notificações personalizadas", status: "Aprovada" },
      { titulo: "Filtros avançados", status: "Em análise" },
    ]},
    radarData: [
      { metric: "NPS", valor: 92, media: 88 }, { metric: "Resolutividade", valor: 91, media: 85 },
      { metric: "TMA", valor: 85, media: 75 }, { metric: "Follow-up", valor: 80, media: 70 },
      { metric: "Conversão", valor: 65, media: 55 },
    ],
    historicoAtendimentos: [
      { data: "05/03/2026", paciente: "Pedro Oliveira", tipo: "Retorno", resultado: "Finalizado", valor: "-" },
    ],
    analiseThalí: {
      elogios: [
        "Emilly é a colaboradora mais ativa na Central de Ideias com 11 ideias aprovadas.",
        "Excelente evolução de NPS nos últimos 3 meses, subindo de 87 para 92.",
        "Melhor resolutividade da equipe com 91%."
      ],
      sugestoes: [
        "Continuar compartilhando insights e práticas com a equipe.",
      ]
    }
  },
  marcos: {
    nome: "Marcos Souza", dataCadastro: "05/01/2024", setor: "Suporte",
    tempoEmpresa: "1 ano", nps: 74, resolutividade: 78, tma: "5m 12s", tme: "2m 05s",
    totalAtendimentos: 2876, orcamentosEnviados: 142, vendasRealizadas: 71, leadsRecebidos: 245,
    ticketMedio: 1320, cicloMedioVenda: 6.8,
    ideias: { adicionadas: 3, aprovadas: 1, lista: [
      { titulo: "Otimizar fila com Thalí", status: "Implementada" },
    ]},
    radarData: [
      { metric: "NPS", valor: 74, media: 88 }, { metric: "Resolutividade", valor: 78, media: 85 },
      { metric: "TMA", valor: 62, media: 75 }, { metric: "Follow-up", valor: 65, media: 70 },
      { metric: "Conversão", valor: 50, media: 55 },
    ],
    historicoAtendimentos: [
      { data: "05/03/2026", paciente: "Fernanda Lima", tipo: "Orçamento", resultado: "Em negociação", valor: "R$ 1.500,00" },
    ],
    analiseThalí: {
      elogios: [
        "Marcos demonstra proatividade ao sugerir melhorias no sistema.",
        "Bom potencial de crescimento identificado nos últimos atendimentos."
      ],
      sugestoes: [
        "Reduzir TMA que está 30% acima da média do setor.",
        "Trabalhar técnicas de rapport para melhorar NPS.",
        "Aumentar engajamento na Central de Ideias.",
        "Análise de sentimento indica necessidade de melhorar tom nas conversas."
      ]
    }
  },
  bianca: {
    nome: "Bianca Lima", dataCadastro: "18/04/2024", setor: "Pós-venda",
    tempoEmpresa: "9 meses", nps: 88, resolutividade: 85, tma: "4m 32s", tme: "1m 45s",
    totalAtendimentos: 2234, orcamentosEnviados: 134, vendasRealizadas: 70, leadsRecebidos: 258,
    ticketMedio: 1410, cicloMedioVenda: 5.5,
    ideias: { adicionadas: 6, aprovadas: 4, lista: [
      { titulo: "Tags automáticas", status: "Aprovada" },
      { titulo: "Resumo diário", status: "Aprovada" },
    ]},
    radarData: [
      { metric: "NPS", valor: 88, media: 88 }, { metric: "Resolutividade", valor: 85, media: 85 },
      { metric: "TMA", valor: 75, media: 75 }, { metric: "Follow-up", valor: 72, media: 70 },
      { metric: "Conversão", valor: 52, media: 55 },
    ],
    historicoAtendimentos: [
      { data: "05/03/2026", paciente: "Laura Rodrigues", tipo: "Consulta", resultado: "Agendado", valor: "-" },
    ],
    analiseThalí: {
      elogios: [
        "Bianca apresenta desempenho na média da equipe com apenas 9 meses.",
        "Boa aderência às práticas da equipe.",
      ],
      sugestoes: [
        "Continuar desenvolvimento para superar métricas médias.",
        "Investir em técnicas de conversão de leads."
      ]
    }
  },
};

// Sector-attendant mapping
const SETOR_ATENDENTES: Record<string, string[]> = {
  "pre-venda": ["geovana", "paloma", "emilly"],
  "suporte": ["marcos"],
  "pos-venda": ["bianca"],
};

const TODOS_ATENDENTES = [
  { key: "geovana", nome: "Geovana Silva" },
  { key: "paloma", nome: "Paloma Santos" },
  { key: "emilly", nome: "Emilly Oliveira" },
  { key: "marcos", nome: "Marcos Souza" },
  { key: "bianca", nome: "Bianca Lima" },
];

const COLORS = ["#0A2647", "#144272", "#205295", "#2C74B3", "#3B82F6"];

// Componente de Filtros com DateRange
const FiltrosRelatorio = ({
  filtros,
  startDate,
  endDate,
  onChangeStart,
  onChangeEnd,
  filtroProduto,
  onChangeProduto,
  filtroAtendente,
  onChangeAtendente,
  filtroSetor,
  onChangeSetor,
  filtrosAplicados,
  onAplicar,
}: {
  filtros: string[];
  startDate: Date | undefined;
  endDate: Date | undefined;
  onChangeStart: (d: Date | undefined) => void;
  onChangeEnd: (d: Date | undefined) => void;
  filtroProduto?: string;
  onChangeProduto?: (v: string) => void;
  filtroAtendente?: string;
  onChangeAtendente?: (v: string) => void;
  filtroSetor?: string;
  onChangeSetor?: (v: string) => void;
  filtrosAplicados: boolean;
  onAplicar: () => void;
}) => {
  return (
    <div className="flex flex-wrap items-end gap-3 p-4 bg-muted/30 rounded-lg border mb-4">
      <Filter className="h-4 w-4 text-muted-foreground mt-2" />
      
      <div className="space-y-1">
        <span className="text-[10px] text-muted-foreground">Período</span>
        <DateRangeFilter
          startDate={startDate}
          endDate={endDate}
          onChangeStart={onChangeStart}
          onChangeEnd={onChangeEnd}
        />
      </div>

      {filtros.includes("Produto") && onChangeProduto && (
        <Select value={filtroProduto || "todos"} onValueChange={onChangeProduto}>
          <SelectTrigger className="w-36">
            <Package className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Produto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="cirurgia-a">Cirurgia A</SelectItem>
            <SelectItem value="consulta-premium">Consulta Premium</SelectItem>
            <SelectItem value="exame-completo">Exame Completo</SelectItem>
            <SelectItem value="procedimento">Procedimento</SelectItem>
          </SelectContent>
        </Select>
      )}
      {filtros.includes("Atendente") && onChangeAtendente && (
        <Select value={filtroAtendente || "todos"} onValueChange={onChangeAtendente}>
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
      )}
      {filtros.includes("Setor") && onChangeSetor && (
        <Select value={filtroSetor || "todos"} onValueChange={onChangeSetor}>
          <SelectTrigger className="w-36">
            <Building2 className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Setor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="pre-venda">Pré-venda</SelectItem>
            <SelectItem value="pos-venda">Pós-venda</SelectItem>
            <SelectItem value="suporte">Suporte</SelectItem>
            <SelectItem value="financeiro">Financeiro</SelectItem>
          </SelectContent>
        </Select>
      )}

      <Button size="sm" onClick={onAplicar} className="h-9">
        Aplicar filtros
      </Button>
    </div>
  );
};

// Empty state placeholder
const EmptyFilterState = () => (
  <div className="flex flex-col items-center justify-center py-16 text-center">
    <Filter className="h-12 w-12 text-muted-foreground/30 mb-4" />
    <h4 className="text-lg font-medium text-muted-foreground">Selecione os filtros</h4>
    <p className="text-sm text-muted-foreground/70 mt-1 max-w-sm">
      Escolha o período e os filtros desejados, depois clique em "Aplicar filtros" para gerar o relatório.
    </p>
  </div>
);

export const RelatoriosInteligentesPanel = () => {
  const [activeTab, setActiveTab] = useState("orcamentos_enviados");
  const [atendenteRelatorio, setAtendenteRelatorio] = useState("geovana");

  // Shared filter state
  const [startDate, setStartDate] = useState<Date | undefined>();
  const [endDate, setEndDate] = useState<Date | undefined>();
  const [filtroProduto, setFiltroProduto] = useState("todos");
  const [filtroAtendente, setFiltroAtendente] = useState("todos");
  const [filtroSetor, setFiltroSetor] = useState("todos");
  const [filtroSetorAtendente, setFiltroSetorAtendente] = useState("todos");
  const [filtrosAplicados, setFiltrosAplicados] = useState(false);

  // Filter attendants by sector
  const atendentesFiltrados = useMemo(() => {
    if (filtroSetorAtendente === "todos") return TODOS_ATENDENTES;
    const keys = SETOR_ATENDENTES[filtroSetorAtendente] || [];
    return TODOS_ATENDENTES.filter(a => keys.includes(a.key));
  }, [filtroSetorAtendente]);

  const handleAplicar = () => {
    setFiltrosAplicados(true);
  };

  // Reset filters on tab change
  const handleTabChange = (tab: string) => {
    setActiveTab(tab);
    setFiltrosAplicados(false);
  };

  // Generate consistent mock data based on filters
  const mockData = useMemo(() => {
    if (!filtrosAplicados) return null;
    return generateMockForFilters({
      start: startDate?.toISOString() || "",
      end: endDate?.toISOString() || "",
      produto: filtroProduto,
      atendente: filtroAtendente,
      setor: filtroSetor,
      tab: activeTab,
    });
  }, [filtrosAplicados, startDate, endDate, filtroProduto, filtroAtendente, filtroSetor, activeTab]);

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

  const dadosAtendente = relatorioGeralAtendente[atendenteRelatorio];

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-2xl font-bold text-[#0A2647]">
          Relatórios Inteligentes
        </h3>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" disabled={!filtrosAplicados}>
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" size="sm" disabled={!filtrosAplicados}>
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="w-full">
        <TabsList className="w-full flex-wrap h-auto gap-1 bg-muted/50 p-1">
          <TabsTrigger value="orcamentos_enviados" className="text-xs">
            <FileText className="h-3 w-3 mr-1" />
            Orçamentos
          </TabsTrigger>
          <TabsTrigger value="ciclo_medio_venda" className="text-xs">
            <Clock className="h-3 w-3 mr-1" />
            Ciclo de Venda
          </TabsTrigger>
          <TabsTrigger value="dashboard_comercial" className="text-xs">
            <BarChart3 className="h-3 w-3 mr-1" />
            Visão Comercial
          </TabsTrigger>
          <TabsTrigger value="funil_de_vendas" className="text-xs">
            <TrendingDown className="h-3 w-3 mr-1" />
            Funil
          </TabsTrigger>
          <TabsTrigger value="motivos_de_perda" className="text-xs">
            <TrendingDown className="h-3 w-3 mr-1" />
            Motivos Perda
          </TabsTrigger>
          <TabsTrigger value="etiquetas" className="text-xs">
            <Star className="h-3 w-3 mr-1" />
            Etiquetas
          </TabsTrigger>
          <TabsTrigger value="relatorio_geral_atendente" className="text-xs">
            <Brain className="h-3 w-3 mr-1" />
            Relatório Atendente
          </TabsTrigger>
          <TabsTrigger value="relatorio_completo_atendente" className="text-xs">
            <UserCheck className="h-3 w-3 mr-1" />
            Completo Atendente
          </TabsTrigger>
        </TabsList>

        <ScrollArea className="h-[calc(100vh-320px)] mt-4">
          <div className="pr-4">
            {/* Orçamentos Enviados */}
            <TabsContent value="orcamentos_enviados" className="mt-0 space-y-4">
              <FiltrosRelatorio
                filtros={["Produto", "Atendente"]}
                startDate={startDate} endDate={endDate}
                onChangeStart={setStartDate} onChangeEnd={setEndDate}
                filtroProduto={filtroProduto} onChangeProduto={setFiltroProduto}
                filtroAtendente={filtroAtendente} onChangeAtendente={setFiltroAtendente}
                filtrosAplicados={filtrosAplicados} onAplicar={handleAplicar}
              />

              {!filtrosAplicados || !mockData ? <EmptyFilterState /> : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground">Total Enviados</div>
                      <div className="text-3xl font-bold text-[#0A2647]">{mockData.total}</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground">Aprovados</div>
                      <div className="text-3xl font-bold text-green-600">{mockData.aprovados}</div>
                      <div className="text-xs text-green-600 flex items-center">
                        <ArrowUpRight className="h-3 w-3" />
                        {((mockData.aprovados / mockData.total) * 100).toFixed(1)}%
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground">Valor Total</div>
                      <div className="text-2xl font-bold text-[#0A2647]">{formatCurrency(mockData.valorTotal)}</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground">Valor Aprovado</div>
                      <div className="text-2xl font-bold text-green-600">{formatCurrency(mockData.valorAprovado)}</div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-4">Orçamentos por Dia</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={mockData.porDia}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="dia" />
                            <YAxis />
                            <Tooltip />
                            <Legend />
                            <Bar dataKey="enviados" fill="#0A2647" name="Enviados" />
                            <Bar dataKey="aprovados" fill="#22C55E" name="Aprovados" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-semibold mb-4">Taxa por Atendente</h4>
                      <div className="space-y-3">
                        {mockData.porAtendente.map((atendente, idx) => (
                          <div key={idx} className="flex items-center gap-3">
                            <div className="w-24 text-sm font-medium truncate">{atendente.nome}</div>
                            <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                              <div className="h-full bg-[#0A2647] rounded-full" style={{ width: `${atendente.taxa}%` }} />
                            </div>
                            <div className="w-12 text-sm text-right">{atendente.taxa}%</div>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Ciclo Médio de Venda */}
            <TabsContent value="ciclo_medio_venda" className="mt-0 space-y-4">
              <FiltrosRelatorio
                filtros={["Produto", "Setor"]}
                startDate={startDate} endDate={endDate}
                onChangeStart={setStartDate} onChangeEnd={setEndDate}
                filtroProduto={filtroProduto} onChangeProduto={setFiltroProduto}
                filtroSetor={filtroSetor} onChangeSetor={setFiltroSetor}
                filtrosAplicados={filtrosAplicados} onAplicar={handleAplicar}
              />

              {!filtrosAplicados || !mockData ? <EmptyFilterState /> : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground">Média Geral</div>
                      <div className="text-3xl font-bold text-[#0A2647]">{mockData.cicloMedio.mediaGeral} dias</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground">Média Mês Atual</div>
                      <div className="text-3xl font-bold text-green-600">{mockData.cicloMedio.mediaMes} dias</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground">Tendência</div>
                      <div className="flex items-center gap-2">
                        <TrendingDown className="h-6 w-6 text-green-600" />
                        <span className="text-lg font-semibold text-green-600">Em queda</span>
                      </div>
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-4">Evolução do Ciclo</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <LineChart data={mockData.cicloMedio.evolucao}>
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis dataKey="mes" />
                            <YAxis />
                            <Tooltip />
                            <Line type="monotone" dataKey="dias" stroke="#0A2647" strokeWidth={3} dot={{ r: 5 }} name="Dias" />
                          </LineChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-semibold mb-4">Ciclo por Produto</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={mockData.cicloMedio.porProduto} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis type="number" />
                            <YAxis dataKey="produto" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="dias" fill="#144272" radius={[0, 4, 4, 0]} name="Dias" />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Visão Comercial */}
            <TabsContent value="dashboard_comercial" className="mt-0">
              <VisaoComercialPanel />
            </TabsContent>

            {/* Funil de Vendas com produto filter + Top 3 */}
            <TabsContent value="funil_de_vendas" className="mt-0 space-y-4">
              <FiltrosRelatorio
                filtros={["Produto", "Atendente", "Setor"]}
                startDate={startDate} endDate={endDate}
                onChangeStart={setStartDate} onChangeEnd={setEndDate}
                filtroProduto={filtroProduto} onChangeProduto={setFiltroProduto}
                filtroAtendente={filtroAtendente} onChangeAtendente={setFiltroAtendente}
                filtroSetor={filtroSetor} onChangeSetor={setFiltroSetor}
                filtrosAplicados={filtrosAplicados} onAplicar={handleAplicar}
              />

              {!filtrosAplicados || !mockData ? <EmptyFilterState /> : (
                <>
                  {/* Top 3 Produtos Vendidos */}
                  {filtroProduto === "todos" && (
                    <Card className="p-4">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Trophy className="h-4 w-4 text-yellow-500" />
                        Top 3 Produtos Vendidos
                      </h4>
                      <div className="grid grid-cols-3 gap-3">
                        {mockData.topProdutos.map((p, idx) => {
                          const medals = ["🥇", "🥈", "🥉"];
                          const colors = ["bg-yellow-50 border-yellow-200", "bg-gray-50 border-gray-200", "bg-orange-50 border-orange-200"];
                          return (
                            <div key={idx} className={cn("p-3 rounded-lg border text-center", colors[idx])}>
                              <div className="text-2xl mb-1">{medals[idx]}</div>
                              <p className="font-semibold text-sm">{p.produto}</p>
                              <p className="text-xs text-muted-foreground">{p.qtd} vendas</p>
                              <p className="text-sm font-bold mt-1">{formatCurrency(p.receita)}</p>
                            </div>
                          );
                        })}
                      </div>
                    </Card>
                  )}

                  {/* Funil por produto - stacked bars */}
                  <Card className="p-4">
                    <h4 className="font-semibold mb-4">Funil por Produto</h4>
                    <div className="h-72">
                      <ResponsiveContainer width="100%" height="100%">
                        <BarChart data={mockData.produtosFunil}>
                          <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                          <XAxis dataKey="produto" />
                          <YAxis />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="enviados" stackId="a" fill="#0A2647" name="Enviados" />
                          <Bar dataKey="negociacao" stackId="a" fill="#2C74B3" name="Em negociação" />
                          <Bar dataKey="vendidos" stackId="a" fill="#22C55E" name="Vendidos" />
                          <Bar dataKey="perdidos" stackId="a" fill="#EF4444" name="Perdidos" />
                        </BarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Funnel visual */}
                  <Card className="p-4">
                    <h4 className="font-semibold mb-4">Funil de Vendas</h4>
                    <div className="space-y-2">
                      {mockData.funilVendas.map((etapa, idx) => {
                        const widthPercent = (etapa.valor / mockData.funilVendas[0].valor) * 100;
                        return (
                          <div key={idx} className="flex items-center gap-4">
                            <div className="w-28 text-sm font-medium">{etapa.etapa}</div>
                            <div className="flex-1 h-8 bg-muted rounded relative">
                              <div
                                className="h-full rounded flex items-center justify-end pr-3"
                                style={{ width: `${widthPercent}%`, backgroundColor: etapa.fill }}
                              >
                                <span className="text-white text-sm font-medium">{etapa.valor.toLocaleString()}</span>
                              </div>
                            </div>
                            <div className="w-16 text-right text-sm text-muted-foreground">
                              {idx > 0 ? `${((etapa.valor / mockData.funilVendas[idx - 1].valor) * 100).toFixed(0)}%` : "100%"}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                    <div className="mt-4 p-3 bg-muted/30 rounded-lg">
                      <div className="text-sm text-muted-foreground">Taxa de conversão total:</div>
                      <div className="text-2xl font-bold text-[#0A2647]">
                        {((mockData.funilVendas[mockData.funilVendas.length - 1].valor / mockData.funilVendas[0].valor) * 100).toFixed(1)}%
                      </div>
                    </div>
                  </Card>

                  {/* Tabela detalhada por produto */}
                  <Card className="p-4">
                    <h4 className="font-semibold mb-4">Detalhamento por Produto</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 font-medium">Produto</th>
                            <th className="text-center py-2 px-2 font-medium">Enviados</th>
                            <th className="text-center py-2 px-2 font-medium">Negociação</th>
                            <th className="text-center py-2 px-2 font-medium">Vendidos</th>
                            <th className="text-center py-2 px-2 font-medium">Perdidos</th>
                            <th className="text-center py-2 px-2 font-medium">Conversão</th>
                          </tr>
                        </thead>
                        <tbody>
                          {mockData.produtosFunil.map((p, idx) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="py-2 px-3 font-medium">{p.produto}</td>
                              <td className="text-center py-2 px-2">{p.enviados}</td>
                              <td className="text-center py-2 px-2">{p.negociacao}</td>
                              <td className="text-center py-2 px-2 text-green-600 font-medium">{p.vendidos}</td>
                              <td className="text-center py-2 px-2 text-destructive">{p.perdidos}</td>
                              <td className="text-center py-2 px-2 font-medium">
                                {p.enviados > 0 ? ((p.vendidos / p.enviados) * 100).toFixed(1) : 0}%
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Motivos de Perda */}
            <TabsContent value="motivos_de_perda" className="mt-0 space-y-4">
              <FiltrosRelatorio
                filtros={["Produto", "Atendente"]}
                startDate={startDate} endDate={endDate}
                onChangeStart={setStartDate} onChangeEnd={setEndDate}
                filtroProduto={filtroProduto} onChangeProduto={setFiltroProduto}
                filtroAtendente={filtroAtendente} onChangeAtendente={setFiltroAtendente}
                filtrosAplicados={filtrosAplicados} onAplicar={handleAplicar}
              />

              {!filtrosAplicados || !mockData ? <EmptyFilterState /> : (
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-4">Distribuição de Motivos</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                          <Pie
                            data={mockData.motivosPerda}
                            cx="50%" cy="50%" labelLine={false}
                            label={({ motivo, percentual }) => `${motivo}: ${percentual}%`}
                            outerRadius={80} dataKey="quantidade"
                          >
                            {mockData.motivosPerda.map((_, index) => (
                              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                          </Pie>
                          <Tooltip />
                        </PieChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>
                  <Card className="p-4">
                    <h4 className="font-semibold mb-4">Detalhamento</h4>
                    <div className="space-y-3">
                      {mockData.motivosPerda.map((motivo, idx) => (
                        <div key={idx} className="flex items-center gap-3 p-3 border rounded-lg">
                          <div className="w-4 h-4 rounded-full flex-shrink-0" style={{ backgroundColor: COLORS[idx % COLORS.length] }} />
                          <div className="flex-1 min-w-0">
                            <div className="font-medium truncate">{motivo.motivo}</div>
                            <div className="text-sm text-muted-foreground">{motivo.quantidade} ocorrências</div>
                          </div>
                          <Badge variant="outline">{motivo.percentual}%</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>
                </div>
              )}
            </TabsContent>

            {/* Relatório por Etiquetas */}
            <TabsContent value="etiquetas" className="mt-0 space-y-4">
              <FiltrosRelatorio
                filtros={["Setor"]}
                startDate={startDate} endDate={endDate}
                onChangeStart={setStartDate} onChangeEnd={setEndDate}
                filtroSetor={filtroSetor} onChangeSetor={setFiltroSetor}
                filtrosAplicados={filtrosAplicados} onAplicar={handleAplicar}
              />

              {!filtrosAplicados ? <EmptyFilterState /> : (
                <>
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground">Total Etiquetados</div>
                      <div className="text-3xl font-bold text-[#0A2647]">1.187</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground">Etiqueta Mais Usada</div>
                      <div className="text-lg font-bold text-purple-600">Convênio (312)</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground">VIPs Ativos</div>
                      <div className="text-3xl font-bold text-amber-600">47</div>
                    </Card>
                    <Card className="p-4">
                      <div className="text-sm text-muted-foreground">Em Negociação</div>
                      <div className="text-3xl font-bold text-orange-600">128</div>
                    </Card>
                  </div>
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-4">Volume por Etiqueta</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <BarChart data={[
                            { nome: "Convênio", total: 312 },
                            { nome: "Primeira Consulta", total: 234 },
                            { nome: "Particular", total: 198 },
                            { nome: "Retorno", total: 156 },
                            { nome: "Negociação", total: 128 },
                            { nome: "Proposta Enviada", total: 89 },
                            { nome: "VIP", total: 47 },
                            { nome: "Urgente", total: 23 },
                          ]} layout="vertical">
                            <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                            <XAxis type="number" />
                            <YAxis dataKey="nome" type="category" width={100} />
                            <Tooltip />
                            <Bar dataKey="total" fill="#0A2647" radius={[0, 8, 8, 0]} />
                          </BarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-semibold mb-4">Gargalos Identificados</h4>
                      <div className="space-y-3">
                        <div className="p-3 border-l-4 border-l-red-500 bg-red-50 rounded-r-lg">
                          <p className="font-medium text-red-900">Alta taxa em "Proposta Enviada"</p>
                          <p className="text-sm text-red-700">89 pacientes aguardando retorno há mais de 5 dias</p>
                        </div>
                        <div className="p-3 border-l-4 border-l-orange-500 bg-orange-50 rounded-r-lg">
                          <p className="font-medium text-orange-900">Negociações prolongadas</p>
                          <p className="text-sm text-orange-700">32% das negociações estão acima de 7 dias</p>
                        </div>
                        <div className="p-3 border-l-4 border-l-green-500 bg-green-50 rounded-r-lg">
                          <p className="font-medium text-green-900">Oportunidade: Retornos</p>
                          <p className="text-sm text-green-700">156 pacientes prontos para nova oferta</p>
                        </div>
                      </div>
                    </Card>
                  </div>
                </>
              )}
            </TabsContent>

            {/* Relatório Geral por Atendente (existing) */}
            <TabsContent value="relatorio_geral_atendente" className="mt-0 space-y-4">
              <div className="flex flex-wrap items-end gap-3 p-4 bg-muted/30 rounded-lg border mb-4">
                <Filter className="h-4 w-4 text-muted-foreground mt-2" />
                <Select value={filtroSetorAtendente} onValueChange={(v) => {
                  setFiltroSetorAtendente(v);
                  // Reset attendant if not in new sector
                  const keys = v === "todos" ? TODOS_ATENDENTES.map(a => a.key) : (SETOR_ATENDENTES[v] || []);
                  if (!keys.includes(atendenteRelatorio)) {
                    setAtendenteRelatorio(keys[0] || "geovana");
                  }
                }}>
                  <SelectTrigger className="w-36">
                    <Building2 className="h-3 w-3 mr-1" />
                    <SelectValue placeholder="Setor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os setores</SelectItem>
                    <SelectItem value="pre-venda">Pré-venda</SelectItem>
                    <SelectItem value="suporte">Suporte</SelectItem>
                    <SelectItem value="pos-venda">Pós-venda</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={atendenteRelatorio} onValueChange={setAtendenteRelatorio}>
                  <SelectTrigger className="w-44">
                    <Users className="h-3 w-3 mr-1" />
                    <SelectValue placeholder="Atendente" />
                  </SelectTrigger>
                  <SelectContent>
                    {atendentesFiltrados.map(a => (
                      <SelectItem key={a.key} value={a.key}>{a.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <DateRangeFilter
                  startDate={startDate} endDate={endDate}
                  onChangeStart={setStartDate} onChangeEnd={setEndDate}
                />
                <Button size="sm" onClick={handleAplicar} className="h-9">Aplicar filtros</Button>
              </div>

              {!filtrosAplicados ? <EmptyFilterState /> : dadosAtendente && (
                <>
                  {/* Profile */}
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-foreground">{dadosAtendente.nome}</h4>
                        <p className="text-sm text-muted-foreground">{dadosAtendente.setor} • Desde {dadosAtendente.dataCadastro} • {dadosAtendente.tempoEmpresa}</p>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div><div className="text-xs text-muted-foreground">Total Atendimentos</div><div className="text-sm font-medium">{dadosAtendente.totalAtendimentos.toLocaleString()}</div></div>
                          <div><div className="text-xs text-muted-foreground">Setor</div><div className="text-sm font-medium">{dadosAtendente.setor}</div></div>
                          <div><div className="text-xs text-muted-foreground">Tempo de Empresa</div><div className="text-sm font-medium">{dadosAtendente.tempoEmpresa}</div></div>
                          <div><div className="text-xs text-muted-foreground">Data de Cadastro</div><div className="text-sm font-medium">{dadosAtendente.dataCadastro}</div></div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* KPI Cards: NPS, Resolutividade, TMA, TME */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-1"><Star className="h-4 w-4 text-yellow-500" /><span className="text-sm text-muted-foreground">NPS</span></div>
                      <div className={cn("text-3xl font-bold", dadosAtendente.nps >= 85 ? "text-green-600" : dadosAtendente.nps >= 70 ? "text-yellow-600" : "text-destructive")}>{dadosAtendente.nps}%</div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-1"><CheckCircle2 className="h-4 w-4 text-green-500" /><span className="text-sm text-muted-foreground">Resolutividade</span></div>
                      <div className={cn("text-3xl font-bold", dadosAtendente.resolutividade >= 85 ? "text-green-600" : "text-yellow-600")}>{dadosAtendente.resolutividade}%</div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-1"><Clock className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">TMA</span></div>
                      <div className="text-3xl font-bold text-foreground">{dadosAtendente.tma}</div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-1"><CalendarClock className="h-4 w-4 text-primary" /><span className="text-sm text-muted-foreground">TME</span></div>
                      <div className="text-3xl font-bold text-foreground">{dadosAtendente.tme}</div>
                    </Card>
                  </div>

                  {/* Ciclo de Venda + Conversão Comercial */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3 text-sm">Ciclo de Venda</h4>
                      <div className="text-center p-4 bg-muted/30 rounded-lg">
                        <div className="text-3xl font-bold text-foreground">{dadosAtendente.cicloMedioVenda} dias</div>
                        <div className="text-xs text-muted-foreground mt-1">Ciclo médio de venda</div>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-semibold mb-3 text-sm">Conversão Comercial</h4>
                      <div className="grid grid-cols-2 gap-3">
                        <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                          <div className="text-2xl font-bold text-blue-600">{dadosAtendente.orcamentosEnviados}</div>
                          <div className="text-[10px] text-muted-foreground">Orçamentos</div>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">{dadosAtendente.vendasRealizadas}</div>
                          <div className="text-[10px] text-muted-foreground">Vendas</div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg text-center">
                          <div className="text-2xl font-bold">{dadosAtendente.leadsRecebidos}</div>
                          <div className="text-[10px] text-muted-foreground">Leads</div>
                        </div>
                        <div className="p-3 bg-muted/30 rounded-lg text-center">
                          <div className="text-2xl font-bold">{formatCurrency(dadosAtendente.ticketMedio)}</div>
                          <div className="text-[10px] text-muted-foreground">Ticket médio</div>
                        </div>
                      </div>
                    </Card>
                  </div>

                  {/* Histórico de Atendimentos */}
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 text-sm">Histórico de Atendimentos</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 font-medium">Data</th>
                            <th className="text-left py-2 px-3 font-medium">Paciente</th>
                            <th className="text-left py-2 px-3 font-medium">Tipo</th>
                            <th className="text-left py-2 px-3 font-medium">Resultado</th>
                            <th className="text-right py-2 px-3 font-medium">Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(dadosAtendente.historicoAtendimentos || []).map((h: any, idx: number) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="py-2 px-3 text-muted-foreground">{h.data}</td>
                              <td className="py-2 px-3 font-medium">{h.paciente}</td>
                              <td className="py-2 px-3"><Badge variant="outline" className="text-[10px]">{h.tipo}</Badge></td>
                              <td className="py-2 px-3">
                                <Badge variant={h.resultado === "Vendido" ? "default" : h.resultado === "Perdido" ? "destructive" : "secondary"} className="text-[10px]">{h.resultado}</Badge>
                              </td>
                              <td className="py-2 px-3 text-right text-muted-foreground">{h.valor}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Radar + Ideias */}
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <h4 className="font-semibold mb-4">Ranking Radar vs Equipe</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={dadosAtendente.radarData}>
                            <PolarGrid /><PolarAngleAxis dataKey="metric" /><PolarRadiusAxis domain={[0, 100]} />
                            <Radar name={dadosAtendente.nome.split(' ')[0]} dataKey="valor" stroke="#0A2647" fill="#0A2647" fillOpacity={0.5} />
                            <Radar name="Média Equipe" dataKey="media" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.3} />
                            <Legend /><Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>
                    <Card className="p-4">
                      <h4 className="font-semibold mb-4 flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" />Ideias das Estrelas</h4>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <div className="text-2xl font-bold">{dadosAtendente.ideias.adicionadas}</div>
                          <div className="text-xs text-muted-foreground">Enviadas</div>
                        </div>
                        <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                          <div className="text-2xl font-bold text-green-600">{dadosAtendente.ideias.aprovadas}</div>
                          <div className="text-xs text-muted-foreground">Aprovadas</div>
                        </div>
                      </div>
                      <div className="space-y-2 max-h-32 overflow-y-auto">
                        {dadosAtendente.ideias.lista.map((ideia: any, idx: number) => (
                          <div key={idx} className="flex items-center justify-between p-2 border rounded-lg">
                            <span className="text-sm truncate flex-1">{ideia.titulo}</span>
                            <Badge variant={ideia.status === "Aprovada" || ideia.status === "Implementada" ? "default" : "secondary"} className="text-xs ml-2">{ideia.status}</Badge>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Visão da Thalí */}
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <ThaliAvatar size="sm" expression="pensativa" />
                      <div>
                        <h4 className="font-semibold">Visão da Thalí</h4>
                        <p className="text-xs text-muted-foreground">Baseada em TMA, Análise de Sentimento, NPS e Resolutividade</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                        <div className="flex items-center gap-2 mb-3"><Star className="h-5 w-5 text-green-600" /><h5 className="font-semibold text-green-700 dark:text-green-400">Pontos Fortes</h5></div>
                        <ul className="space-y-2">
                          {dadosAtendente.analiseThalí.elogios.map((elogio: string, idx: number) => (
                            <li key={idx} className="text-sm text-green-800 dark:text-green-300 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{elogio}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-900">
                        <div className="flex items-center gap-2 mb-3"><TrendingUp className="h-5 w-5 text-yellow-600" /><h5 className="font-semibold text-yellow-700 dark:text-yellow-400">Sugestões de Melhoria</h5></div>
                        <ul className="space-y-2">
                          {dadosAtendente.analiseThalí.sugestoes.map((sugestao: string, idx: number) => (
                            <li key={idx} className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{sugestao}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </TabsContent>

            {/* Relatório COMPLETO do Atendente — NEW */}
            <TabsContent value="relatorio_completo_atendente" className="mt-0 space-y-4">
              <div className="flex flex-wrap items-end gap-3 p-4 bg-muted/30 rounded-lg border mb-4">
                <Filter className="h-4 w-4 text-muted-foreground mt-2" />
                <Select value={filtroSetorAtendente} onValueChange={(v) => {
                  setFiltroSetorAtendente(v);
                  const keys = v === "todos" ? TODOS_ATENDENTES.map(a => a.key) : (SETOR_ATENDENTES[v] || []);
                  if (!keys.includes(atendenteRelatorio)) {
                    setAtendenteRelatorio(keys[0] || "geovana");
                  }
                }}>
                  <SelectTrigger className="w-36">
                    <Building2 className="h-3 w-3 mr-1" />
                    <SelectValue placeholder="Setor" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os setores</SelectItem>
                    <SelectItem value="pre-venda">Pré-venda</SelectItem>
                    <SelectItem value="suporte">Suporte</SelectItem>
                    <SelectItem value="pos-venda">Pós-venda</SelectItem>
                  </SelectContent>
                </Select>
                <Select value={atendenteRelatorio} onValueChange={setAtendenteRelatorio}>
                  <SelectTrigger className="w-44">
                    <Users className="h-3 w-3 mr-1" />
                    <SelectValue placeholder="Atendente *" />
                  </SelectTrigger>
                  <SelectContent>
                    {atendentesFiltrados.map(a => (
                      <SelectItem key={a.key} value={a.key}>{a.nome}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <Select defaultValue="todos">
                  <SelectTrigger className="w-36">
                    <Building2 className="h-3 w-3 mr-1" />
                    <SelectValue placeholder="Unidade" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todas</SelectItem>
                    <SelectItem value="unidade-1">Unidade 1</SelectItem>
                    <SelectItem value="unidade-2">Unidade 2</SelectItem>
                  </SelectContent>
                </Select>
                <DateRangeFilter
                  startDate={startDate} endDate={endDate}
                  onChangeStart={setStartDate} onChangeEnd={setEndDate}
                />
                <Button size="sm" onClick={handleAplicar} className="h-9">Aplicar filtros</Button>
              </div>

              <div className="p-3 bg-amber-50 dark:bg-amber-950/30 rounded-lg border border-amber-200 dark:border-amber-800 mb-4">
                <p className="text-xs text-amber-700 dark:text-amber-300 flex items-center gap-2">
                  <Target className="h-3 w-3" />
                  Acesso restrito à gestão e coordenação. Visão total desde o cadastro do atendente.
                </p>
              </div>

              {!filtrosAplicados ? <EmptyFilterState /> : dadosAtendente && (
                <>
                  {/* Profile card */}
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-foreground">{dadosAtendente.nome}</h4>
                        <p className="text-sm text-muted-foreground">{dadosAtendente.setor} • Desde {dadosAtendente.dataCadastro} • {dadosAtendente.tempoEmpresa}</p>
                      </div>
                    </div>
                  </Card>

                  {/* Resumo executivo */}
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 text-sm">Resumo Executivo</h4>
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <div className="text-xl font-bold">{dadosAtendente.totalAtendimentos.toLocaleString()}</div>
                        <div className="text-[10px] text-muted-foreground">Atendimentos</div>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <div className="text-xl font-bold">{dadosAtendente.resolutividade}%</div>
                        <div className="text-[10px] text-muted-foreground">Resolutividade</div>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <div className="text-xl font-bold">{dadosAtendente.tma}</div>
                        <div className="text-[10px] text-muted-foreground">TMA</div>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <div className="text-xl font-bold">{dadosAtendente.tme}</div>
                        <div className="text-[10px] text-muted-foreground">TME</div>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <div className={cn("text-xl font-bold", dadosAtendente.nps >= 85 ? "text-green-600" : "text-yellow-600")}>{dadosAtendente.nps}%</div>
                        <div className="text-[10px] text-muted-foreground">NPS Médio</div>
                      </div>
                      <div className="text-center p-2 bg-muted/30 rounded-lg">
                        <div className="text-xl font-bold">{dadosAtendente.cicloMedioVenda}d</div>
                        <div className="text-[10px] text-muted-foreground">Ciclo Venda</div>
                      </div>
                    </div>
                  </Card>

                  {/* Conversão comercial */}
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 text-sm">Conversão Comercial</h4>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
                      <div className="p-3 bg-blue-50 dark:bg-blue-950/30 rounded-lg text-center">
                        <div className="text-2xl font-bold text-blue-600">{dadosAtendente.orcamentosEnviados}</div>
                        <div className="text-xs text-muted-foreground">Orçamentos enviados</div>
                      </div>
                      <div className="p-3 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                        <div className="text-2xl font-bold text-green-600">{dadosAtendente.vendasRealizadas}</div>
                        <div className="text-xs text-muted-foreground">Vendas realizadas</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg text-center">
                        <div className="text-2xl font-bold">{dadosAtendente.leadsRecebidos}</div>
                        <div className="text-xs text-muted-foreground">Leads recebidos</div>
                      </div>
                      <div className="p-3 bg-muted/30 rounded-lg text-center">
                        <div className="text-2xl font-bold">{formatCurrency(dadosAtendente.ticketMedio)}</div>
                        <div className="text-xs text-muted-foreground">Ticket médio</div>
                      </div>
                    </div>
                  </Card>

                  {/* Ranking vs equipe */}
                  <Card className="p-4">
                    <h4 className="font-semibold mb-4">Métricas vs Média da Equipe</h4>
                    <div className="h-64">
                      <ResponsiveContainer width="100%" height="100%">
                        <RadarChart data={dadosAtendente.radarData}>
                          <PolarGrid /><PolarAngleAxis dataKey="metric" /><PolarRadiusAxis domain={[0, 100]} />
                          <Radar name={dadosAtendente.nome.split(' ')[0]} dataKey="valor" stroke="#0A2647" fill="#0A2647" fillOpacity={0.5} />
                          <Radar name="Média Equipe" dataKey="media" stroke="#9CA3AF" fill="#9CA3AF" fillOpacity={0.3} />
                          <Legend /><Tooltip />
                        </RadarChart>
                      </ResponsiveContainer>
                    </div>
                  </Card>

                  {/* Histórico de atendimentos */}
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 text-sm">Histórico de Atendimentos (últimos)</h4>
                    <div className="overflow-x-auto">
                      <table className="w-full text-sm">
                        <thead>
                          <tr className="border-b">
                            <th className="text-left py-2 px-3 font-medium">Data</th>
                            <th className="text-left py-2 px-3 font-medium">Paciente</th>
                            <th className="text-left py-2 px-3 font-medium">Tipo</th>
                            <th className="text-left py-2 px-3 font-medium">Resultado</th>
                            <th className="text-right py-2 px-3 font-medium">Valor</th>
                          </tr>
                        </thead>
                        <tbody>
                          {(dadosAtendente.historicoAtendimentos || []).map((h: any, idx: number) => (
                            <tr key={idx} className="border-b last:border-0">
                              <td className="py-2 px-3 text-muted-foreground">{h.data}</td>
                              <td className="py-2 px-3 font-medium">{h.paciente}</td>
                              <td className="py-2 px-3"><Badge variant="outline" className="text-[10px]">{h.tipo}</Badge></td>
                              <td className="py-2 px-3">
                                <Badge variant={h.resultado === "Vendido" ? "default" : h.resultado === "Perdido" ? "destructive" : "secondary"} className="text-[10px]">
                                  {h.resultado}
                                </Badge>
                              </td>
                              <td className="py-2 px-3 text-right">{h.valor}</td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </Card>

                  {/* Ideias */}
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 text-sm flex items-center gap-2"><Lightbulb className="h-4 w-4 text-yellow-500" />Ideias das Estrelas</h4>
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <div className="p-2 bg-muted/50 rounded-lg text-center">
                        <div className="text-xl font-bold">{dadosAtendente.ideias.adicionadas}</div>
                        <div className="text-[10px] text-muted-foreground">Enviadas</div>
                      </div>
                      <div className="p-2 bg-green-50 dark:bg-green-950/30 rounded-lg text-center">
                        <div className="text-xl font-bold text-green-600">{dadosAtendente.ideias.aprovadas}</div>
                        <div className="text-[10px] text-muted-foreground">Aprovadas</div>
                      </div>
                    </div>
                    <div className="space-y-1.5">
                      {dadosAtendente.ideias.lista.map((ideia: any, idx: number) => (
                        <div key={idx} className="flex items-center justify-between p-2 border rounded-lg">
                          <span className="text-sm truncate flex-1">{ideia.titulo}</span>
                          <Badge variant={ideia.status === "Aprovada" || ideia.status === "Implementada" ? "default" : "secondary"} className="text-xs ml-2">{ideia.status}</Badge>
                        </div>
                      ))}
                    </div>
                  </Card>

                  {/* Análise da Thalí */}
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <ThaliAvatar size="sm" expression="pensativa" />
                      <div>
                        <h4 className="font-semibold">Visão da Thalí</h4>
                        <p className="text-xs text-muted-foreground">Análise completa baseada em métricas, sentimento e histórico</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                        <div className="flex items-center gap-2 mb-3"><Star className="h-5 w-5 text-green-600" /><h5 className="font-semibold text-green-700 dark:text-green-400">Elogios</h5></div>
                        <ul className="space-y-2">
                          {dadosAtendente.analiseThalí.elogios.map((e: string, idx: number) => (
                            <li key={idx} className="text-sm text-green-800 dark:text-green-300 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{e}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-900">
                        <div className="flex items-center gap-2 mb-3"><TrendingUp className="h-5 w-5 text-yellow-600" /><h5 className="font-semibold text-yellow-700 dark:text-yellow-400">Pontos de Melhoria</h5></div>
                        <ul className="space-y-2">
                          {dadosAtendente.analiseThalí.sugestoes.map((s: string, idx: number) => (
                            <li key={idx} className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" /><span>{s}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </Card>
                </>
              )}
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
