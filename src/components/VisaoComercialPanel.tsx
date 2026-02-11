import { useState, useEffect } from "react";
import {
  Download, Filter, Calendar, Users, Building2, Stethoscope,
  TrendingUp, TrendingDown, ArrowUpRight, ArrowDownRight,
  DollarSign, UserCheck, FileText, Target, BarChart3, PieChart as PieChartIcon
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  BarChart, Bar, LineChart, Line, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from "recharts";
import { supabase } from "@/integrations/supabase/client";
import { cn } from "@/lib/utils";

const COLORS = ["#0A2647", "#144272", "#205295", "#2C74B3", "#3B82F6", "#64748B"];

const STAGE_LABELS: Record<string, string> = {
  NEW: "Novo contato",
  IN_SERVICE: "Em atendimento",
  BUDGET_SENT: "Orçamento enviado",
  NEGOTIATION: "Em negociação",
  WON: "Fechado",
  LOST: "Perdido",
};

const STAGE_COLORS: Record<string, string> = {
  NEW: "#0A2647",
  IN_SERVICE: "#144272",
  BUDGET_SENT: "#205295",
  NEGOTIATION: "#2C74B3",
  WON: "#22C55E",
  LOST: "#EF4444",
};

// Mock data for initial display
const mockCommercialData = {
  receitaRealizada: 892000,
  receitaPrevista: 1250000,
  taxaConversao: 10.95,
  ticketMedio: 2859,
  novosContatos: 2847,
  orcamentosEnviados: 847,
  emNegociacao: 523,
  fechados: 312,
  perdidos: 279,
  funnel: [
    { stage: "NEW", label: "Novo contato", value: 2847 },
    { stage: "IN_SERVICE", label: "Em atendimento", value: 1823 },
    { stage: "BUDGET_SENT", label: "Orçamento enviado", value: 847 },
    { stage: "NEGOTIATION", label: "Em negociação", value: 523 },
    { stage: "WON", label: "Fechado", value: 312 },
    { stage: "LOST", label: "Perdido", value: 279 },
  ],
  motivosPerda: [
    { motivo: "Valor", total: 89 },
    { motivo: "Convênio negou", total: 67 },
    { motivo: "Sem retorno", total: 56 },
    { motivo: "Fez com outro profissional", total: 42 },
    { motivo: "Adiou/Desistiu", total: 25 },
  ],
  tendenciaSemanal: [
    { semana: "Sem 1", receita: 180000 },
    { semana: "Sem 2", receita: 210000 },
    { semana: "Sem 3", receita: 245000 },
    { semana: "Sem 4", receita: 257000 },
  ],
  performanceAtendentes: [
    { nome: "Geovana", contatos: 312, orcamentos: 187, fechados: 98, perdidos: 45, conversao: 31.4, tempoResposta: "2m 12s" },
    { nome: "Emilly", contatos: 289, orcamentos: 168, fechados: 82, perdidos: 52, conversao: 28.4, tempoResposta: "2m 45s" },
    { nome: "Paloma", contatos: 276, orcamentos: 156, fechados: 74, perdidos: 48, conversao: 26.8, tempoResposta: "3m 10s" },
    { nome: "Marcos", contatos: 245, orcamentos: 122, fechados: 42, perdidos: 58, conversao: 17.1, tempoResposta: "4m 32s" },
    { nome: "Bianca", contatos: 258, orcamentos: 134, fechados: 56, perdidos: 42, conversao: 21.7, tempoResposta: "3m 48s" },
  ],
  performanceMedicos: [
    { nome: "Dr. Carlos Silva", fechados: 67, receita: 234500, conversao: 42.5, cicloMedio: 4.2 },
    { nome: "Dra. Marina Santos", fechados: 54, receita: 198700, conversao: 38.1, cicloMedio: 5.1 },
    { nome: "Dr. Ricardo Lima", fechados: 48, receita: 167300, conversao: 35.8, cicloMedio: 6.3 },
    { nome: "Dra. Ana Costa", fechados: 41, receita: 143200, conversao: 33.2, cicloMedio: 5.8 },
  ],
};

export const VisaoComercialPanel = () => {
  const [periodo, setPeriodo] = useState("7d");
  const [mes, setMes] = useState("janeiro");
  const [ano, setAno] = useState("2026");
  const [empresa, setEmpresa] = useState("todas");
  const [setor, setSetor] = useState("todos");
  const [atendente, setAtendente] = useState("todos");
  const [medico, setMedico] = useState("todos");
  const [tipoServico, setTipoServico] = useState("todos");

  const [setores, setSetores] = useState<Array<{ id: string; nome: string }>>([]);
  const [atendentes, setAtendentes] = useState<Array<{ id: string; nome: string }>>([]);
  const [serviceTypes, setServiceTypes] = useState<Array<{ id: string; nome: string }>>([]);
  const [providers, setProviders] = useState<Array<{ id: string; nome: string }>>([]);

  useEffect(() => {
    const fetchFilters = async () => {
      const [setoresRes, atendentesRes, stRes, provRes] = await Promise.all([
        supabase.from("setores").select("id, nome").eq("ativo", true),
        supabase.from("atendentes").select("id, nome").eq("ativo", true),
        supabase.from("service_types").select("id, nome").eq("ativo", true).order("ordem"),
        supabase.from("providers").select("id, nome").eq("ativo", true),
      ]);
      if (setoresRes.data) setSetores(setoresRes.data);
      if (atendentesRes.data) setAtendentes(atendentesRes.data);
      if (stRes.data) setServiceTypes(stRes.data);
      if (provRes.data) setProviders(provRes.data);
    };
    fetchFilters();
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", { style: "currency", currency: "BRL" });

  const data = mockCommercialData;

  return (
    <div className="space-y-4">
      {/* Filtros completos */}
      <div className="flex flex-wrap gap-3 p-4 bg-muted/30 rounded-lg border">
        <Filter className="h-4 w-4 text-muted-foreground mt-2" />
        
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-32">
            <Calendar className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Período" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="hoje">Hoje</SelectItem>
            <SelectItem value="7d">7 dias</SelectItem>
            <SelectItem value="30d">30 dias</SelectItem>
            <SelectItem value="90d">90 dias</SelectItem>
            <SelectItem value="custom">Personalizado</SelectItem>
          </SelectContent>
        </Select>

        <Select value={mes} onValueChange={setMes}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Mês" />
          </SelectTrigger>
          <SelectContent>
            {["Janeiro","Fevereiro","Março","Abril","Maio","Junho","Julho","Agosto","Setembro","Outubro","Novembro","Dezembro"].map(m => (
              <SelectItem key={m} value={m.toLowerCase()}>{m}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={ano} onValueChange={setAno}>
          <SelectTrigger className="w-24">
            <SelectValue placeholder="Ano" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="2025">2025</SelectItem>
            <SelectItem value="2026">2026</SelectItem>
            <SelectItem value="2027">2027</SelectItem>
          </SelectContent>
        </Select>

        <Select value={setor} onValueChange={setSetor}>
          <SelectTrigger className="w-36">
            <Building2 className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Setor" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Setores</SelectItem>
            {setores.map(s => (
              <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={atendente} onValueChange={setAtendente}>
          <SelectTrigger className="w-36">
            <Users className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Atendente" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Atendentes</SelectItem>
            {atendentes.map(a => (
              <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={medico} onValueChange={setMedico}>
          <SelectTrigger className="w-36">
            <Stethoscope className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Médico" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos Médicos</SelectItem>
            {providers.map(p => (
              <SelectItem key={p.id} value={p.id}>{p.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={tipoServico} onValueChange={setTipoServico}>
          <SelectTrigger className="w-40">
            <FileText className="h-3 w-3 mr-1" />
            <SelectValue placeholder="Tipo Serviço" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="todos">Todos os Tipos</SelectItem>
            {serviceTypes.map(st => (
              <SelectItem key={st.id} value={st.id}>{st.nome}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* LINHA 1 - KPIs Estratégicos */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="p-4 border-l-4 border-l-primary">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <DollarSign className="h-4 w-4" />
            Receita Realizada
          </div>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(data.receitaRealizada)}
          </div>
          <div className="text-xs text-green-600 flex items-center mt-1">
            <ArrowUpRight className="h-3 w-3" /> +12.5% vs mês anterior
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-blue-400">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <Target className="h-4 w-4" />
            Receita Prevista
          </div>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(data.receitaPrevista)}
          </div>
          <div className="text-xs text-muted-foreground mt-1">Pipeline aberto</div>
        </Card>
        <Card className="p-4 border-l-4 border-l-green-500">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <UserCheck className="h-4 w-4" />
            Taxa de Conversão
          </div>
          <div className="text-2xl font-bold text-foreground">
            {data.taxaConversao}%
          </div>
          <div className="text-xs text-muted-foreground mt-1">
            {data.fechados} fechados / {data.novosContatos} contatos
          </div>
        </Card>
        <Card className="p-4 border-l-4 border-l-amber-500">
          <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
            <BarChart3 className="h-4 w-4" />
            Ticket Médio
          </div>
          <div className="text-2xl font-bold text-foreground">
            {formatCurrency(data.ticketMedio)}
          </div>
        </Card>
      </div>

      {/* LINHA 2 - Contadores do Processo Comercial */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
        <Card className="p-3 text-center">
          <div className="text-xs text-muted-foreground">Novos Contatos</div>
          <div className="text-2xl font-bold text-foreground">{data.novosContatos.toLocaleString()}</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xs text-muted-foreground">Orçamentos Enviados</div>
          <div className="text-2xl font-bold text-foreground">{data.orcamentosEnviados.toLocaleString()}</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xs text-muted-foreground">Em Negociação</div>
          <div className="text-2xl font-bold text-foreground">{data.emNegociacao.toLocaleString()}</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xs text-muted-foreground">Fechados</div>
          <div className="text-2xl font-bold text-green-600">{data.fechados.toLocaleString()}</div>
        </Card>
        <Card className="p-3 text-center">
          <div className="text-xs text-muted-foreground">Perdidos</div>
          <div className="text-2xl font-bold text-red-500">{data.perdidos.toLocaleString()}</div>
        </Card>
      </div>

      {/* LINHA 3 - Gráficos Principais */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Funil Comercial */}
        <Card className="p-4">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingDown className="h-4 w-4" />
            Funil Comercial
          </h4>
          <div className="space-y-2">
            {data.funnel.map((etapa, idx) => {
              const maxVal = data.funnel[0].value;
              const widthPct = (etapa.value / maxVal) * 100;
              return (
                <div key={idx} className="flex items-center gap-2">
                  <div className="w-28 text-xs font-medium truncate">{etapa.label}</div>
                  <div className="flex-1 h-7 bg-muted rounded relative">
                    <div
                      className="h-full rounded flex items-center justify-end pr-2 transition-all"
                      style={{
                        width: `${Math.max(widthPct, 10)}%`,
                        backgroundColor: STAGE_COLORS[etapa.stage] || COLORS[idx],
                      }}
                    >
                      <span className="text-white text-xs font-medium">
                        {etapa.value.toLocaleString()}
                      </span>
                    </div>
                  </div>
                  <div className="w-12 text-right text-xs text-muted-foreground">
                    {idx > 0
                      ? `${((etapa.value / data.funnel[idx - 1].value) * 100).toFixed(0)}%`
                      : "100%"}
                  </div>
                </div>
              );
            })}
          </div>
          <div className="mt-3 p-2 bg-muted/30 rounded text-center">
            <span className="text-xs text-muted-foreground">Taxa total: </span>
            <span className="font-bold text-sm">
              {((data.fechados / data.novosContatos) * 100).toFixed(1)}%
            </span>
          </div>
        </Card>

        {/* Motivos de Perda */}
        <Card className="p-4">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <PieChartIcon className="h-4 w-4" />
            Motivos de Perda
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={data.motivosPerda}
                  cx="50%"
                  cy="50%"
                  innerRadius={40}
                  outerRadius={70}
                  dataKey="total"
                  labelLine={false}
                  label={({ motivo, percent }) => `${motivo}: ${(percent * 100).toFixed(0)}%`}
                >
                  {data.motivosPerda.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </Card>

        {/* Tendência Semanal */}
        <Card className="p-4">
          <h4 className="font-semibold mb-4 flex items-center gap-2">
            <TrendingUp className="h-4 w-4" />
            Tendência (Receita)
          </h4>
          <div className="h-48">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={data.tendenciaSemanal}>
                <CartesianGrid strokeDasharray="3 3" opacity={0.2} />
                <XAxis dataKey="semana" tick={{ fontSize: 11 }} />
                <YAxis tickFormatter={(v) => `${v / 1000}k`} tick={{ fontSize: 11 }} />
                <Tooltip formatter={(value: number) => formatCurrency(value)} />
                <Line
                  type="monotone"
                  dataKey="receita"
                  stroke="#0A2647"
                  strokeWidth={3}
                  dot={{ r: 4, fill: "#0A2647" }}
                  name="Receita"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </Card>
      </div>

      {/* LINHA 4 - Rankings */}
      <Card className="p-4">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Users className="h-4 w-4" />
          Performance por Atendente
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium text-muted-foreground">Atendente</th>
                <th className="text-center p-2 font-medium text-muted-foreground">Contatos</th>
                <th className="text-center p-2 font-medium text-muted-foreground">Orçamentos</th>
                <th className="text-center p-2 font-medium text-muted-foreground">Fechados</th>
                <th className="text-center p-2 font-medium text-muted-foreground">Perdidos</th>
                <th className="text-center p-2 font-medium text-muted-foreground">Conversão</th>
                <th className="text-center p-2 font-medium text-muted-foreground">1ª Resposta</th>
              </tr>
            </thead>
            <tbody>
              {data.performanceAtendentes.map((a, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-2 font-medium flex items-center gap-2">
                    <div className={cn(
                      "w-6 h-6 rounded-full flex items-center justify-center text-white text-xs font-bold",
                      idx === 0 ? "bg-yellow-500" : idx === 1 ? "bg-gray-400" : idx === 2 ? "bg-amber-600" : "bg-muted-foreground"
                    )}>
                      {idx + 1}
                    </div>
                    {a.nome}
                  </td>
                  <td className="text-center p-2">{a.contatos}</td>
                  <td className="text-center p-2">{a.orcamentos}</td>
                  <td className="text-center p-2 text-green-600 font-medium">{a.fechados}</td>
                  <td className="text-center p-2 text-red-500">{a.perdidos}</td>
                  <td className="text-center p-2">
                    <Badge variant={a.conversao >= 25 ? "default" : "secondary"} className="text-xs">
                      {a.conversao}%
                    </Badge>
                  </td>
                  <td className="text-center p-2 text-muted-foreground">{a.tempoResposta}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>

      {/* Performance Médicos */}
      <Card className="p-4">
        <h4 className="font-semibold mb-4 flex items-center gap-2">
          <Stethoscope className="h-4 w-4" />
          Performance por Médico
        </h4>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b">
                <th className="text-left p-2 font-medium text-muted-foreground">Médico</th>
                <th className="text-center p-2 font-medium text-muted-foreground">Fechados</th>
                <th className="text-center p-2 font-medium text-muted-foreground">Receita</th>
                <th className="text-center p-2 font-medium text-muted-foreground">Conversão</th>
                <th className="text-center p-2 font-medium text-muted-foreground">Ciclo médio (dias)</th>
              </tr>
            </thead>
            <tbody>
              {data.performanceMedicos.map((m, idx) => (
                <tr key={idx} className="border-b hover:bg-muted/30 transition-colors">
                  <td className="p-2 font-medium">{m.nome}</td>
                  <td className="text-center p-2 text-green-600 font-medium">{m.fechados}</td>
                  <td className="text-center p-2">{formatCurrency(m.receita)}</td>
                  <td className="text-center p-2">
                    <Badge variant="outline" className="text-xs">{m.conversao}%</Badge>
                  </td>
                  <td className="text-center p-2">{m.cicloMedio}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
};
