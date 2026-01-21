import { useState } from "react";
import { 
  Download, Filter, Calendar, Users, Building2, Package,
  TrendingUp, TrendingDown, Target, BarChart3, PieChart as PieChartIcon,
  ArrowUpRight, ArrowDownRight, Clock, DollarSign, UserCheck, FileText
} from "lucide-react";
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
} from "recharts";
import { cn } from "@/lib/utils";

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
    { etapa: "Qualificados", valor: 1823, fill: "#144272" },
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

  const formatCurrency = (value: number) => {
    return value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });
  };

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
          <TabsTrigger value="conversao_por_atendente" className="text-xs">
            <UserCheck className="h-3 w-3 mr-1" />
            Conversão
          </TabsTrigger>
          <TabsTrigger value="funil_de_vendas" className="text-xs">
            <TrendingDown className="h-3 w-3 mr-1" />
            Funil
          </TabsTrigger>
          <TabsTrigger value="motivos_de_perda" className="text-xs">
            <TrendingDown className="h-3 w-3 mr-1" />
            Motivos Perda
          </TabsTrigger>
          <TabsTrigger value="follow_up" className="text-xs">
            <Target className="h-3 w-3 mr-1" />
            Follow-up
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

            {/* Dashboard Comercial */}
            <TabsContent value="dashboard_comercial" className="mt-0 space-y-4">
              <FiltrosRelatorio filtros={["Data", "Mês", "Ano", "Setor"]} />

              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Vendas do Mês</div>
                  <div className="text-2xl font-bold text-[#0A2647]">
                    {formatCurrency(mockData.dashboardComercial.vendasMes)}
                  </div>
                  <div className="text-xs text-green-600 flex items-center">
                    <ArrowUpRight className="h-3 w-3" />
                    +{mockData.dashboardComercial.crescimento}%
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Meta do Mês</div>
                  <div className="text-2xl font-bold text-muted-foreground">
                    {formatCurrency(mockData.dashboardComercial.metaMes)}
                  </div>
                  <div className="w-full h-2 bg-muted rounded-full mt-2">
                    <div 
                      className="h-full bg-[#0A2647] rounded-full" 
                      style={{ width: `${(mockData.dashboardComercial.vendasMes / mockData.dashboardComercial.metaMes) * 100}%` }}
                    />
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Ticket Médio</div>
                  <div className="text-2xl font-bold text-[#0A2647]">
                    {formatCurrency(mockData.dashboardComercial.ticketMedio)}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Novos Clientes</div>
                  <div className="text-2xl font-bold text-[#0A2647]">
                    {mockData.dashboardComercial.novosClientes}
                  </div>
                </Card>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Vendas por Setor</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={mockData.dashboardComercial.vendasPorSetor}
                          cx="50%"
                          cy="50%"
                          labelLine={false}
                          label={({ setor, percent }) => `${setor}: ${(percent * 100).toFixed(0)}%`}
                          outerRadius={80}
                          dataKey="valor"
                        >
                          {mockData.dashboardComercial.vendasPorSetor.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </Card>

                <Card className="p-4">
                  <h4 className="font-semibold mb-4">Tendência Semanal</h4>
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={mockData.dashboardComercial.tendencia}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                        <XAxis dataKey="semana" />
                        <YAxis tickFormatter={(value) => `${value/1000}k`} />
                        <Tooltip formatter={(value: number) => formatCurrency(value)} />
                        <Line 
                          type="monotone" 
                          dataKey="vendas" 
                          stroke="#0A2647" 
                          strokeWidth={3}
                          dot={{ r: 5, fill: "#0A2647" }}
                          name="Vendas"
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </Card>
              </div>
            </TabsContent>

            {/* Conversão por Atendente */}
            <TabsContent value="conversao_por_atendente" className="mt-0 space-y-4">
              <FiltrosRelatorio filtros={["Data", "Mês", "Ano", "Produto", "Atendente"]} />

              <Card className="p-4">
                <h4 className="font-semibold mb-4">Taxa de Conversão por Atendente</h4>
                <div className="space-y-4">
                  {mockData.conversaoPorAtendente.map((atendente, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-3">
                          <div className={cn(
                            "w-8 h-8 rounded-full flex items-center justify-center text-white font-bold text-sm",
                            idx === 0 ? "bg-yellow-500" : idx === 1 ? "bg-gray-400" : idx === 2 ? "bg-orange-400" : "bg-muted-foreground"
                          )}>
                            {idx + 1}
                          </div>
                          <span className="font-semibold">{atendente.nome}</span>
                        </div>
                        <Badge variant={atendente.taxa >= 55 ? "default" : "secondary"}>
                          {atendente.taxa}% conversão
                        </Badge>
                      </div>
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Leads: </span>
                          <span className="font-medium">{atendente.leads}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Conversões: </span>
                          <span className="font-medium text-green-600">{atendente.conversoes}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          {atendente.taxa >= 55 ? (
                            <TrendingUp className="h-4 w-4 text-green-600" />
                          ) : (
                            <TrendingDown className="h-4 w-4 text-red-600" />
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
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
                    {((mockData.funilVendas[4].valor / mockData.funilVendas[0].valor) * 100).toFixed(1)}%
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

            {/* Follow-up e Recontato */}
            <TabsContent value="follow_up" className="mt-0 space-y-4">
              <FiltrosRelatorio filtros={["Data", "Mês", "Ano", "Atendente", "Setor"]} />

              <div className="grid grid-cols-2 lg:grid-cols-3 gap-4">
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Pendentes</div>
                  <div className="text-3xl font-bold text-orange-600">
                    {mockData.followUp.pendentes}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Realizados</div>
                  <div className="text-3xl font-bold text-green-600">
                    {mockData.followUp.realizados}
                  </div>
                </Card>
                <Card className="p-4">
                  <div className="text-sm text-muted-foreground">Taxa de Retorno</div>
                  <div className="text-3xl font-bold text-[#0A2647]">
                    {mockData.followUp.taxaRetorno}%
                  </div>
                </Card>
              </div>

              <Card className="p-4">
                <h4 className="font-semibold mb-4">Follow-up por Atendente</h4>
                <div className="space-y-3">
                  {mockData.followUp.porAtendente.map((atendente, idx) => (
                    <div key={idx} className="p-4 border rounded-lg">
                      <div className="flex items-center justify-between mb-2">
                        <span className="font-semibold">{atendente.nome}</span>
                        <Badge 
                          variant={atendente.taxa >= 65 ? "default" : "secondary"}
                          className={atendente.taxa >= 65 ? "bg-green-600" : ""}
                        >
                          {atendente.taxa}% retorno
                        </Badge>
                      </div>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-orange-500" />
                          <span className="text-muted-foreground">Pendentes: </span>
                          <span className="font-medium">{atendente.pendentes}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-green-500" />
                          <span className="text-muted-foreground">Realizados: </span>
                          <span className="font-medium">{atendente.realizados}</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </Card>
            </TabsContent>
          </div>
        </ScrollArea>
      </Tabs>
    </div>
  );
};
