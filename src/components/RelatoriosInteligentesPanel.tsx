import { useState } from "react";
import { 
  Download, Filter, Calendar, Users, Building2, Package,
  TrendingUp, TrendingDown, Target, BarChart3, PieChart as PieChartIcon,
  ArrowUpRight, ArrowDownRight, Clock, DollarSign, UserCheck, FileText,
  Star, Lightbulb, CheckCircle2, Brain, CalendarClock
} from "lucide-react";
import { VisaoComercialPanel } from "./VisaoComercialPanel";
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
  FunnelChart,
  Funnel,
  LabelList,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
} from "recharts";
import { cn } from "@/lib/utils";
import { ThaliAvatar } from "./ThaliAvatar";

// Mock data para os relatórios
const mockData = {
  orcamentosEnviados: {
    total: 847,
    aprovados: 523,
    rejeitados: 189,
    pendentes: 135,
    valorTotal: 1250000,
    valorAprovado: 892000,
    porDia: [
      { dia: "Seg", enviados: 142, aprovados: 89 },
      { dia: "Ter", enviados: 128, aprovados: 76 },
      { dia: "Qua", enviados: 156, aprovados: 98 },
      { dia: "Qui", enviados: 134, aprovados: 82 },
      { dia: "Sex", enviados: 167, aprovados: 102 },
      { dia: "Sáb", enviados: 78, aprovados: 48 },
      { dia: "Dom", enviados: 42, aprovados: 28 },
    ],
    porAtendente: [
      { nome: "Geovana", enviados: 187, taxa: 68 },
      { nome: "Paloma", enviados: 156, taxa: 62 },
      { nome: "Emilly", enviados: 148, taxa: 71 },
      { nome: "Marcos", enviados: 142, taxa: 55 },
      { nome: "Bianca", enviados: 134, taxa: 59 },
    ],
  },
  cicloMedioVenda: {
    mediaGeral: 5.2,
    mediaMes: 4.8,
    evolucao: [
      { mes: "Jul", dias: 6.1 },
      { mes: "Ago", dias: 5.8 },
      { mes: "Set", dias: 5.4 },
      { mes: "Out", dias: 5.2 },
      { mes: "Nov", dias: 4.9 },
      { mes: "Dez", dias: 4.8 },
    ],
    porProduto: [
      { produto: "Cirurgia A", dias: 7.2 },
      { produto: "Consulta", dias: 2.1 },
      { produto: "Exame", dias: 1.5 },
      { produto: "Cirurgia B", dias: 8.4 },
      { produto: "Procedimento", dias: 4.3 },
    ],
  },
  dashboardComercial: {
    vendasMes: 892000,
    metaMes: 1000000,
    crescimento: 12.5,
    ticketMedio: 1708,
    novosClientes: 523,
    vendasPorSetor: [
      { setor: "Pré-venda", valor: 450000 },
      { setor: "Pós-venda", valor: 220000 },
      { setor: "Suporte", valor: 122000 },
      { setor: "Financeiro", valor: 100000 },
    ],
    tendencia: [
      { semana: "Sem 1", vendas: 180000 },
      { semana: "Sem 2", vendas: 210000 },
      { semana: "Sem 3", vendas: 245000 },
      { semana: "Sem 4", vendas: 257000 },
    ],
  },
  conversaoPorAtendente: [
    { nome: "Geovana", leads: 312, conversoes: 187, taxa: 59.9 },
    { nome: "Emilly", leads: 289, conversoes: 168, taxa: 58.1 },
    { nome: "Paloma", leads: 276, conversoes: 156, taxa: 56.5 },
    { nome: "Bianca", leads: 258, conversoes: 134, taxa: 51.9 },
    { nome: "Marcos", leads: 245, conversoes: 122, taxa: 49.8 },
  ],
  funilVendas: [
    { etapa: "Leads", valor: 2847, fill: "#0A2647" },
    
    { etapa: "Orçamento", valor: 847, fill: "#205295" },
    { etapa: "Negociação", valor: 523, fill: "#2C74B3" },
    { etapa: "Fechados", valor: 312, fill: "#3B82F6" },
  ],
  motivosPerda: [
    { motivo: "Preço alto", quantidade: 89, percentual: 32 },
    { motivo: "Concorrência", quantidade: 67, percentual: 24 },
    { motivo: "Sem retorno", quantidade: 56, percentual: 20 },
    { motivo: "Prazo", quantidade: 42, percentual: 15 },
    { motivo: "Outros", quantidade: 25, percentual: 9 },
  ],
  followUp: {
    pendentes: 234,
    realizados: 1823,
    taxaRetorno: 67,
    porAtendente: [
      { nome: "Geovana", pendentes: 42, realizados: 312, taxa: 72 },
      { nome: "Paloma", pendentes: 38, realizados: 289, taxa: 68 },
      { nome: "Emilly", pendentes: 45, realizados: 298, taxa: 65 },
      { nome: "Marcos", pendentes: 52, realizados: 267, taxa: 61 },
      { nome: "Bianca", pendentes: 57, realizados: 245, taxa: 58 },
    ],
  },
};

// Dados para Relatório Geral por Atendente
const relatorioGeralAtendente: Record<string, any> = {
  geovana: {
    nome: "Geovana Silva",
    dataCadastro: "15/03/2023",
    setor: "Pré-venda",
    tempoEmpresa: "1 ano e 10 meses",
    nps: 95,
    resolutividade: 92,
    tma: "3m 21s",
    totalAtendimentos: 4287,
    ideias: {
      adicionadas: 12,
      aprovadas: 8,
      lista: [
        { titulo: "Automação de follow-up", status: "Aprovada" },
        { titulo: "Template de orçamento", status: "Aprovada" },
        { titulo: "Integração com agenda", status: "Em análise" },
      ]
    },
    radarData: [
      { metric: "NPS", valor: 95, media: 88 },
      { metric: "Resolutividade", valor: 92, media: 85 },
      { metric: "TMA", valor: 88, media: 75 },
      { metric: "Follow-up", valor: 85, media: 70 },
      { metric: "Conversão", valor: 68, media: 55 },
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
    nome: "Paloma Santos",
    dataCadastro: "22/06/2023",
    setor: "Pré-venda",
    tempoEmpresa: "1 ano e 7 meses",
    nps: 93,
    resolutividade: 89,
    tma: "4m 01s",
    totalAtendimentos: 3892,
    ideias: {
      adicionadas: 8,
      aprovadas: 5,
      lista: [
        { titulo: "Dashboard de métricas", status: "Aprovada" },
        { titulo: "Alertas automáticos", status: "Aprovada" },
      ]
    },
    radarData: [
      { metric: "NPS", valor: 93, media: 88 },
      { metric: "Resolutividade", valor: 89, media: 85 },
      { metric: "TMA", valor: 82, media: 75 },
      { metric: "Follow-up", valor: 78, media: 70 },
      { metric: "Conversão", valor: 62, media: 55 },
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
    nome: "Emilly Oliveira",
    dataCadastro: "10/09/2023",
    setor: "Pré-venda",
    tempoEmpresa: "1 ano e 4 meses",
    nps: 92,
    resolutividade: 91,
    tma: "3m 48s",
    totalAtendimentos: 3654,
    ideias: {
      adicionadas: 15,
      aprovadas: 11,
      lista: [
        { titulo: "Modo escuro suave", status: "Aprovada" },
        { titulo: "Notificações personalizadas", status: "Aprovada" },
        { titulo: "Filtros avançados", status: "Em análise" },
      ]
    },
    radarData: [
      { metric: "NPS", valor: 92, media: 88 },
      { metric: "Resolutividade", valor: 91, media: 85 },
      { metric: "TMA", valor: 85, media: 75 },
      { metric: "Follow-up", valor: 80, media: 70 },
      { metric: "Conversão", valor: 65, media: 55 },
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
    nome: "Marcos Souza",
    dataCadastro: "05/01/2024",
    setor: "Pré-venda",
    tempoEmpresa: "1 ano",
    nps: 74,
    resolutividade: 78,
    tma: "5m 12s",
    totalAtendimentos: 2876,
    ideias: {
      adicionadas: 3,
      aprovadas: 1,
      lista: [
        { titulo: "Otimizar fila com Thalí", status: "Implementada" },
      ]
    },
    radarData: [
      { metric: "NPS", valor: 74, media: 88 },
      { metric: "Resolutividade", valor: 78, media: 85 },
      { metric: "TMA", valor: 62, media: 75 },
      { metric: "Follow-up", valor: 65, media: 70 },
      { metric: "Conversão", valor: 50, media: 55 },
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
    nome: "Bianca Lima",
    dataCadastro: "18/04/2024",
    setor: "Pré-venda",
    tempoEmpresa: "9 meses",
    nps: 88,
    resolutividade: 85,
    tma: "4m 32s",
    totalAtendimentos: 2234,
    ideias: {
      adicionadas: 6,
      aprovadas: 4,
      lista: [
        { titulo: "Tags automáticas", status: "Aprovada" },
        { titulo: "Resumo diário", status: "Aprovada" },
      ]
    },
    radarData: [
      { metric: "NPS", valor: 88, media: 88 },
      { metric: "Resolutividade", valor: 85, media: 85 },
      { metric: "TMA", valor: 75, media: 75 },
      { metric: "Follow-up", valor: 72, media: 70 },
      { metric: "Conversão", valor: 52, media: 55 },
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

const COLORS = ["#0A2647", "#144272", "#205295", "#2C74B3", "#3B82F6"];

// Componente de Filtros
const FiltrosRelatorio = ({ filtros }: { filtros: string[] }) => {
  return (
    <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-lg border mb-4">
      <Filter className="h-4 w-4 text-muted-foreground mt-2" />
      {filtros.includes("Data") && (
        <Select defaultValue="7dias">
          <SelectTrigger className="w-32">
            <Calendar className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Data" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hoje">Hoje</SelectItem>
            <SelectItem value="7dias">7 dias</SelectItem>
            <SelectItem value="30dias">30 dias</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>
      )}
      {filtros.includes("Mês") && (
        <Select defaultValue="jan">
          <SelectTrigger className="w-32">
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
      )}
      {filtros.includes("Ano") && (
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
      )}
      {filtros.includes("Produto") && (
        <Select defaultValue="todos">
          <SelectTrigger className="w-36">
            <Package className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Produto" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos</SelectItem>
            <SelectItem value="cirurgia-a">Cirurgia A</SelectItem>
            <SelectItem value="cirurgia-b">Cirurgia B</SelectItem>
            <SelectItem value="consulta">Consulta</SelectItem>
            <SelectItem value="exame">Exame</SelectItem>
          </SelectContent>
        </Select>
      )}
      {filtros.includes("Atendente") && (
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
      )}
      {filtros.includes("Setor") && (
        <Select defaultValue="todos">
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
    </div>
  );
};

export const RelatoriosInteligentesPanel = () => {
  const [activeTab, setActiveTab] = useState("orcamentos_enviados");
  const [atendenteRelatorio, setAtendenteRelatorio] = useState("geovana");

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
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar PDF
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" />
            Exportar Excel
          </Button>
        </div>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
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
        </TabsList>

        <ScrollArea className="h-[calc(100vh-320px)] mt-4">
          <div className="pr-4">
            {/* Orçamentos Enviados */}
            <TabsContent value="orcamentos_enviados" className="mt-0 space-y-4">
              <FiltrosRelatorio filtros={["Data", "Mês", "Ano", "Produto", "Atendente"]} />
              
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Total Enviados</div>
                  <div className="text-3xl font-bold text-[#0A2647]">
                    {mockData.orcamentosEnviados.total}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Aprovados</div>
                  <div className="text-3xl font-bold text-green-600">
                    {mockData.orcamentosEnviados.aprovados}
                  </div>
                  <div className="text-xs text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3" />
                    {((mockData.orcamentosEnviados.aprovados / mockData.orcamentosEnviados.total) * 100).toFixed(1)}%
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Valor Total</div>
                  <div className="text-2xl font-bold text-[#0A2647]">
                    {formatCurrency(mockData.orcamentosEnviados.valorTotal)}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Valor Aprovado</div>
                  <div className="text-2xl font-bold text-green-600">
                    {formatCurrency(mockData.orcamentosEnviados.valorAprovado)}
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Orçamentos por Dia</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockData.orcamentosEnviados.porDia}>
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
                    {mockData.orcamentosEnviados.porAtendente.map((atendente, idx) => (
                      <div key={idx} className="flex items-center gap-3">
                        <div className="w-24 text-sm font-medium truncate">{atendente.nome}</div>
                        <div className="flex-1 h-3 bg-muted rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[#0A2647] rounded-full" 
                            style={{ width: `${atendente.taxa}%` }}
                          />
                        </div>
                        <div className="w-12 text-sm text-right">{atendente.taxa}%</div>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Ciclo Médio de Venda */}
            <TabsContent value="ciclo_medio_venda" className="mt-0 space-y-4">
              <FiltrosRelatorio filtros={["Data", "Mês", "Ano", "Produto", "Setor"]} />

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Média Geral</div>
                  <div className="text-3xl font-bold text-[#0A2647]">
                    {mockData.cicloMedioVenda.mediaGeral} dias
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Média Mês Atual</div>
                  <div className="text-3xl font-bold text-green-600">
                    {mockData.cicloMedioVenda.mediaMes} dias
                  </div>
                  <div className="text-xs text-green-600 flex items-center">
                    <ArrowDownRight className="h-3 w-3" />
                    Melhorou 8%
                  </div>
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
                      <LineChart data={mockData.cicloMedioVenda.evolucao}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="mes" />
                        <YAxis />
                        <Tooltip />
                        <Line 
                          type="monotone" 
                          dataKey="dias" 
                          stroke="#0A2647" 
                          strokeWidth={3}
                          dot={{ r: 5 }}
                          name="Dias"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Ciclo por Produto</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={mockData.cicloMedioVenda.porProduto} layout="vertical">
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
            </TabsContent>

            {/* Visão Comercial */}
            <TabsContent value="dashboard_comercial" className="mt-0">
              <VisaoComercialPanel />
            </TabsContent>


            {/* Funil de Vendas */}
            <TabsContent value="funil_de_vendas" className="mt-0 space-y-4">
              <FiltrosRelatorio filtros={["Data", "Mês", "Ano", "Produto", "Atendente", "Setor"]} />

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
                            style={{ 
                              width: `${widthPercent}%`,
                              backgroundColor: etapa.fill
                            }}
                          >
                            <span className="text-white text-sm font-medium">
                              {etapa.valor.toLocaleString()}
                            </span>
                          </div>
                        </div>
                        <div className="w-16 text-right text-sm text-muted-foreground">
                          {idx > 0 ? (
                            `${((etapa.valor / mockData.funilVendas[idx-1].valor) * 100).toFixed(0)}%`
                          ) : (
                            "100%"
                          )}
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
            </TabsContent>

            {/* Motivos de Perda */}
            <TabsContent value="motivos_de_perda" className="mt-0 space-y-4">
              <FiltrosRelatorio filtros={["Data", "Mês", "Ano", "Produto", "Atendente"]} />

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Distribuição de Motivos</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockData.motivosPerda}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ motivo, percentual }) => `${motivo}: ${percentual}%`}
                          outerRadius={80}
                          dataKey="quantidade"
                        >
                          {mockData.motivosPerda.map((entry, index) => (
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
                        <div 
                          className="w-4 h-4 rounded-full flex-shrink-0"
                          style={{ backgroundColor: COLORS[idx % COLORS.length] }}
                        />
                        <div className="flex-1 min-w-0">
                          <div className="font-medium truncate">{motivo.motivo}</div>
                          <div className="text-sm text-muted-foreground">
                            {motivo.quantidade} ocorrências
                          </div>
                        </div>
                        <Badge variant="outline">{motivo.percentual}%</Badge>
                      </div>
                    ))}
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Relatório por Etiquetas */}
            <TabsContent value="etiquetas" className="mt-0 space-y-4">
              <FiltrosRelatorio filtros={["Data", "Mês", "Ano", "Setor"]} />

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
            </TabsContent>

            {/* Relatório Geral por Atendente */}
            <TabsContent value="relatorio_geral_atendente" className="mt-0 space-y-4">
              {/* Filtros completos */}
              <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-lg border">
                <Filter className="h-4 w-4 text-muted-foreground mt-2" />
                <Select value={atendenteRelatorio} onValueChange={setAtendenteRelatorio}>
                  <SelectTrigger className="w-44">
                    <Users className="h-3 w-3 mr-1" />
                    <SelectValue placeholder="Atendente" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="geovana">Geovana Silva</SelectItem>
                    <SelectItem value="paloma">Paloma Santos</SelectItem>
                    <SelectItem value="emilly">Emilly Oliveira</SelectItem>
                    <SelectItem value="marcos">Marcos Souza</SelectItem>
                    <SelectItem value="bianca">Bianca Lima</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="7dias">
                  <SelectTrigger className="w-32">
                    <Calendar className="h-3 w-3 mr-1" />
                    <SelectValue placeholder="Data" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hoje">Hoje</SelectItem>
                    <SelectItem value="7dias">7 dias</SelectItem>
                    <SelectItem value="30dias">30 dias</SelectItem>
                    <SelectItem value="90dias">90 dias</SelectItem>
                    <SelectItem value="custom">Personalizado</SelectItem>
                  </SelectContent>
                </Select>
                <Select defaultValue="jan">
                  <SelectTrigger className="w-32">
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
                <Select defaultValue="todos">
                  <SelectTrigger className="w-40">
                    <Target className="h-3 w-3 mr-1" />
                    <SelectValue placeholder="Atributos" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="todos">Todos os Atributos</SelectItem>
                    <SelectItem value="nps">NPS</SelectItem>
                    <SelectItem value="resolutividade">Resolutividade</SelectItem>
                    <SelectItem value="tempo_espera">Tempo de Espera</SelectItem>
                    <SelectItem value="tma">TMA</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {dadosAtendente && (
                <>
                  {/* Informações do Colaborador */}
                  <Card className="p-6">
                    <div className="flex items-start gap-4">
                      <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center">
                        <UserCheck className="h-8 w-8 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="text-xl font-bold text-foreground">{dadosAtendente.nome}</h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-3">
                          <div>
                            <div className="text-xs text-muted-foreground">Data de Cadastro</div>
                            <div className="text-sm font-medium">{dadosAtendente.dataCadastro}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Setor</div>
                            <div className="text-sm font-medium">{dadosAtendente.setor}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Tempo de Empresa</div>
                            <div className="text-sm font-medium">{dadosAtendente.tempoEmpresa}</div>
                          </div>
                          <div>
                            <div className="text-xs text-muted-foreground">Total Atendimentos</div>
                            <div className="text-sm font-medium">{dadosAtendente.totalAtendimentos.toLocaleString()}</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>

                  {/* KPIs principais */}
                  <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Star className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-muted-foreground">NPS</span>
                      </div>
                      <div className={cn(
                        "text-3xl font-bold",
                        dadosAtendente.nps >= 85 ? "text-green-600" : dadosAtendente.nps >= 70 ? "text-yellow-600" : "text-destructive"
                      )}>
                        {dadosAtendente.nps}%
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <CheckCircle2 className="h-4 w-4 text-green-500" />
                        <span className="text-sm text-muted-foreground">Resolutividade</span>
                      </div>
                      <div className={cn(
                        "text-3xl font-bold",
                        dadosAtendente.resolutividade >= 85 ? "text-green-600" : "text-yellow-600"
                      )}>
                        {dadosAtendente.resolutividade}%
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Clock className="h-4 w-4 text-primary" />
                        <span className="text-sm text-muted-foreground">TMA</span>
                      </div>
                      <div className="text-3xl font-bold text-foreground">
                        {dadosAtendente.tma}
                      </div>
                    </Card>
                    <Card className="p-4">
                      <div className="flex items-center gap-2 mb-1">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        <span className="text-sm text-muted-foreground">Ideias Aprovadas</span>
                      </div>
                      <div className="text-3xl font-bold text-foreground">
                        {dadosAtendente.ideias.aprovadas}/{dadosAtendente.ideias.adicionadas}
                      </div>
                    </Card>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {/* Gráfico Radar */}
                    <Card className="p-4">
                      <h4 className="font-semibold mb-4">Métricas vs Média da Equipe</h4>
                      <div className="h-64">
                        <ResponsiveContainer width="100%" height="100%">
                          <RadarChart data={dadosAtendente.radarData}>
                            <PolarGrid />
                            <PolarAngleAxis dataKey="metric" />
                            <PolarRadiusAxis domain={[0, 100]} />
                            <Radar
                              name={dadosAtendente.nome.split(' ')[0]}
                              dataKey="valor"
                              stroke="#0A2647"
                              fill="#0A2647"
                              fillOpacity={0.5}
                            />
                            <Radar
                              name="Média Equipe"
                              dataKey="media"
                              stroke="#9CA3AF"
                              fill="#9CA3AF"
                              fillOpacity={0.3}
                            />
                            <Legend />
                            <Tooltip />
                          </RadarChart>
                        </ResponsiveContainer>
                      </div>
                    </Card>

                    {/* Central de Ideias */}
                    <Card className="p-4">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-yellow-500" />
                        Central de Ideias
                      </h4>
                      <div className="grid grid-cols-2 gap-4 mb-4">
                        <div className="p-3 bg-muted/50 rounded-lg text-center">
                          <div className="text-2xl font-bold">{dadosAtendente.ideias.adicionadas}</div>
                          <div className="text-xs text-muted-foreground">Ideias Enviadas</div>
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
                            <Badge variant={ideia.status === "Aprovada" || ideia.status === "Implementada" ? "default" : "secondary"} className="text-xs ml-2">
                              {ideia.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </Card>
                  </div>

                  {/* Análise da Thalí */}
                  <Card className="p-6">
                    <div className="flex items-center gap-3 mb-4">
                      <ThaliAvatar size="sm" expression="pensativa" />
                      <div>
                        <h4 className="font-semibold">Análise da Thalí</h4>
                        <p className="text-xs text-muted-foreground">Baseada em TMA, Análise de Sentimento, NPS e Resolutividade</p>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {/* Elogios */}
                      <div className="p-4 bg-green-50 dark:bg-green-950/30 rounded-lg border border-green-200 dark:border-green-900">
                        <div className="flex items-center gap-2 mb-3">
                          <Star className="h-5 w-5 text-green-600" />
                          <h5 className="font-semibold text-green-700 dark:text-green-400">Pontos Fortes</h5>
                        </div>
                        <ul className="space-y-2">
                          {dadosAtendente.analiseThalí.elogios.map((elogio: string, idx: number) => (
                            <li key={idx} className="text-sm text-green-800 dark:text-green-300 flex items-start gap-2">
                              <CheckCircle2 className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>{elogio}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Sugestões de Melhoria */}
                      <div className="p-4 bg-yellow-50 dark:bg-yellow-950/30 rounded-lg border border-yellow-200 dark:border-yellow-900">
                        <div className="flex items-center gap-2 mb-3">
                          <TrendingUp className="h-5 w-5 text-yellow-600" />
                          <h5 className="font-semibold text-yellow-700 dark:text-yellow-400">Sugestões de Melhoria</h5>
                        </div>
                        <ul className="space-y-2">
                          {dadosAtendente.analiseThalí.sugestoes.map((sugestao: string, idx: number) => (
                            <li key={idx} className="text-sm text-yellow-800 dark:text-yellow-300 flex items-start gap-2">
                              <Lightbulb className="h-4 w-4 mt-0.5 flex-shrink-0" />
                              <span>{sugestao}</span>
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
