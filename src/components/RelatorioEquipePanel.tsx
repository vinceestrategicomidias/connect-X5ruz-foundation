import { useState, useMemo } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  Clock, TrendingUp, Users, Star, MessageSquare, Phone,
  Calendar, Award, Target, Timer, ShoppingCart, BarChart3,
  Smile, Brain, Lightbulb, Medal, Trophy, Radar,
} from "lucide-react";
import {
  ResponsiveContainer, RadarChart, PolarGrid, PolarAngleAxis,
  PolarRadiusAxis, Radar as RechartsRadar, BarChart, Bar,
  XAxis, YAxis, CartesianGrid, Tooltip, LineChart, Line,
} from "recharts";
import { useSetores } from "@/hooks/useSetores";
import { useAtendentes } from "@/hooks/useAtendentes";
import { format } from "date-fns";
import { ptBR } from "date-fns/locale";

// ─── Mock data generator per attendant ───
const gerarDadosProdutividade = (nome: string) => {
  const seed = nome.length * 7;
  const r = (min: number, max: number) => min + ((seed * 13 + min * 7) % (max - min + 1));

  return {
    nps: r(60, 98),
    tmaMinutos: r(2, 8),
    tmaSegundos: r(10, 55),
    tmeMinutos: r(3, 12),
    tmeSegundos: r(5, 50),
    cicloVendaDias: r(3, 21),
    totalAtendimentos: r(120, 980),
    atendimentosMes: r(40, 180),
    conversaoLeads: r(15, 65),
    conversaoOrcamentos: r(25, 75),
    conversaoVendas: r(10, 50),
    leadsTotal: r(30, 150),
    orcamentosEnviados: r(20, 100),
    vendasFechadas: r(5, 50),
    ticketMedio: r(800, 5000),
    historicoMeses: [
      { mes: "Jan", atendimentos: r(30, 100), nps: r(60, 95) },
      { mes: "Fev", atendimentos: r(30, 100), nps: r(60, 95) },
      { mes: "Mar", atendimentos: r(30, 100), nps: r(60, 95) },
      { mes: "Abr", atendimentos: r(30, 100), nps: r(60, 95) },
      { mes: "Mai", atendimentos: r(30, 100), nps: r(60, 95) },
      { mes: "Jun", atendimentos: r(30, 100), nps: r(60, 95) },
    ],
    radarMetricas: [
      { metrica: "NPS", valor: r(60, 100), equipe: r(50, 85) },
      { metrica: "TMA", valor: r(50, 95), equipe: r(55, 80) },
      { metrica: "TME", valor: r(45, 90), equipe: r(50, 78) },
      { metrica: "Conversão", valor: r(40, 95), equipe: r(45, 75) },
      { metrica: "Volume", valor: r(50, 100), equipe: r(55, 82) },
      { metrica: "Resolutividade", valor: r(55, 98), equipe: r(60, 85) },
    ],
    ideias: [
      "Usar abordagem consultiva para aumentar conversão",
      "Reduzir tempo de resposta com templates personalizados",
      "Sugerir upsell nos atendimentos de pós-venda",
    ],
    visaoThali: "Atendente com perfil analítico e boa capacidade de resolução. Destaque em empatia e comunicação clara. Recomendação: investir em técnicas de fechamento de vendas para elevar conversão comercial.",
    setoresHistorico: ["Pré-venda", "Suporte", "Pós-venda"],
  };
};

export const RelatorioEquipePanel = () => {
  const { data: setores } = useSetores();
  const [setorSelecionado, setSetorSelecionado] = useState<string>("");
  const { data: atendentes } = useAtendentes(setorSelecionado || undefined);
  const [atendenteSelecionado, setAtendenteSelecionado] = useState<string>("");

  const atendente = useMemo(
    () => atendentes?.find((a) => a.id === atendenteSelecionado),
    [atendentes, atendenteSelecionado]
  );

  const dados = useMemo(
    () => (atendente ? gerarDadosProdutividade(atendente.nome) : null),
    [atendente]
  );

  const getInitials = (name: string) => {
    const words = name.trim().split(" ");
    return words.length >= 2
      ? `${words[0][0]}${words[1][0]}`.toUpperCase()
      : name.substring(0, 2).toUpperCase();
  };

  const npsColor = (nps: number) =>
    nps >= 80 ? "text-emerald-500" : nps >= 60 ? "text-amber-500" : "text-destructive";

  return (
    <div className="space-y-6">
      {/* Filtros */}
      <div className="flex gap-4 items-end flex-wrap">
        <div className="space-y-1.5 min-w-[200px]">
          <label className="text-sm font-medium text-muted-foreground">Setor</label>
          <Select value={setorSelecionado} onValueChange={(v) => { setSetorSelecionado(v); setAtendenteSelecionado(""); }}>
            <SelectTrigger><SelectValue placeholder="Selecione o setor" /></SelectTrigger>
            <SelectContent>
              {setores?.map((s) => (
                <SelectItem key={s.id} value={s.id}>{s.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        <div className="space-y-1.5 min-w-[200px]">
          <label className="text-sm font-medium text-muted-foreground">Atendente</label>
          <Select value={atendenteSelecionado} onValueChange={setAtendenteSelecionado} disabled={!setorSelecionado}>
            <SelectTrigger><SelectValue placeholder="Selecione o atendente" /></SelectTrigger>
            <SelectContent>
              {atendentes?.filter(a => a.ativo).map((a) => (
                <SelectItem key={a.id} value={a.id}>{a.nome}</SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      {!atendente && (
        <div className="flex flex-col items-center justify-center py-20 text-muted-foreground">
          <Users className="h-12 w-12 mb-4 opacity-40" />
          <p className="text-lg font-medium">Selecione um setor e atendente</p>
          <p className="text-sm">para visualizar o relatório completo</p>
        </div>
      )}

      {atendente && dados && (
        <ScrollArea className="h-[calc(100vh-220px)]">
          <div className="space-y-6 pr-4">
            {/* Header do atendente */}
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center gap-5">
                  <Avatar className="h-20 w-20 text-xl">
                    <AvatarImage src={atendente.avatar || undefined} alt={atendente.nome} />
                    <AvatarFallback className="bg-primary text-primary-foreground text-xl font-bold">
                      {getInitials(atendente.nome)}
                    </AvatarFallback>
                  </Avatar>
                  <div className="flex-1">
                    <h2 className="text-2xl font-bold text-foreground">{atendente.nome}</h2>
                    <div className="flex flex-wrap gap-2 mt-1">
                      <Badge variant="secondary" className="capitalize">{atendente.cargo}</Badge>
                      <Badge variant="outline">{atendente.setor_nome || "Sem setor"}</Badge>
                      {atendente.email && <Badge variant="outline">{atendente.email}</Badge>}
                    </div>
                    <div className="flex items-center gap-4 mt-3 text-sm text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3.5 w-3.5" />
                        Cadastrado em: {format(new Date(atendente.created_at || new Date()), "dd/MM/yyyy", { locale: ptBR })}
                      </span>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-4xl font-black ${npsColor(dados.nps)}`}>{dados.nps}</div>
                    <div className="text-sm text-muted-foreground font-medium">NPS Score</div>
                  </div>
                </div>

                {/* Setores Histórico */}
                <div className="mt-4 pt-4 border-t border-border">
                  <p className="text-xs text-muted-foreground mb-2 font-medium">Histórico de setores:</p>
                  <div className="flex gap-2 flex-wrap">
                    {dados.setoresHistorico.map((s, i) => (
                      <Badge key={i} variant="outline" className="text-xs">{s}</Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* KPIs principais */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <MetricCard icon={Smile} label="NPS" value={`${dados.nps}`} color="text-emerald-500" bgColor="bg-emerald-500/10" />
              <MetricCard icon={Clock} label="TMA" value={`${dados.tmaMinutos}m ${dados.tmaSegundos}s`} color="text-blue-500" bgColor="bg-blue-500/10" />
              <MetricCard icon={Timer} label="TME" value={`${dados.tmeMinutos}m ${dados.tmeSegundos}s`} color="text-amber-500" bgColor="bg-amber-500/10" />
              <MetricCard icon={Target} label="Ciclo de Venda" value={`${dados.cicloVendaDias} dias`} color="text-violet-500" bgColor="bg-violet-500/10" />
            </div>

            {/* Conversão Comercial */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <ShoppingCart className="h-4 w-4 text-primary" />
                  Conversão Comercial
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-3 gap-4 mb-4">
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">{dados.leadsTotal}</p>
                    <p className="text-xs text-muted-foreground">Leads</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">{dados.orcamentosEnviados}</p>
                    <p className="text-xs text-muted-foreground">Orçamentos</p>
                  </div>
                  <div className="text-center p-3 rounded-lg bg-muted/50">
                    <p className="text-2xl font-bold text-foreground">{dados.vendasFechadas}</p>
                    <p className="text-xs text-muted-foreground">Vendas</p>
                  </div>
                </div>
                <div className="flex gap-4 text-sm">
                  <span className="text-muted-foreground">Conv. Leads: <strong className="text-foreground">{dados.conversaoLeads}%</strong></span>
                  <span className="text-muted-foreground">Conv. Orçamentos: <strong className="text-foreground">{dados.conversaoOrcamentos}%</strong></span>
                  <span className="text-muted-foreground">Conv. Vendas: <strong className="text-foreground">{dados.conversaoVendas}%</strong></span>
                  <span className="text-muted-foreground">Ticket Médio: <strong className="text-foreground">R$ {dados.ticketMedio.toLocaleString("pt-BR")}</strong></span>
                </div>
              </CardContent>
            </Card>

            {/* Histórico */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <BarChart3 className="h-4 w-4 text-primary" />
                  Histórico de Atendimentos
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[220px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={dados.historicoMeses}>
                      <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" />
                      <XAxis dataKey="mes" tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <YAxis tick={{ fontSize: 12 }} stroke="hsl(var(--muted-foreground))" />
                      <Tooltip />
                      <Bar dataKey="atendimentos" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} name="Atendimentos" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Ranking Radar vs Equipe */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Radar className="h-4 w-4 text-primary" />
                  Ranking Radar vs Equipe
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[280px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadarChart data={dados.radarMetricas}>
                      <PolarGrid stroke="hsl(var(--border))" />
                      <PolarAngleAxis dataKey="metrica" tick={{ fontSize: 11 }} stroke="hsl(var(--muted-foreground))" />
                      <PolarRadiusAxis angle={30} domain={[0, 100]} tick={{ fontSize: 10 }} />
                      <RechartsRadar name={atendente.nome} dataKey="valor" stroke="hsl(var(--primary))" fill="hsl(var(--primary))" fillOpacity={0.3} />
                      <RechartsRadar name="Média Equipe" dataKey="equipe" stroke="hsl(var(--muted-foreground))" fill="hsl(var(--muted-foreground))" fillOpacity={0.15} />
                      <Tooltip />
                    </RadarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Ideias das Estrelas */}
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Lightbulb className="h-4 w-4 text-amber-500" />
                  Ideias das Estrelas
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {dados.ideias.map((ideia, i) => (
                    <li key={i} className="flex items-start gap-2 text-sm">
                      <Star className="h-4 w-4 text-amber-400 mt-0.5 shrink-0" />
                      <span className="text-foreground">{ideia}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>

            {/* Visão da Thalí */}
            <Card className="border-primary/20 bg-primary/5">
              <CardHeader className="pb-2">
                <CardTitle className="text-base flex items-center gap-2">
                  <Brain className="h-4 w-4 text-primary" />
                  Visão da Thalí
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-foreground leading-relaxed">{dados.visaoThali}</p>
              </CardContent>
            </Card>
          </div>
        </ScrollArea>
      )}
    </div>
  );
};

// ─── Sub-component ───
const MetricCard = ({ icon: Icon, label, value, color, bgColor }: {
  icon: any; label: string; value: string; color: string; bgColor: string;
}) => (
  <Card>
    <CardContent className="p-4 flex items-center gap-3">
      <div className={`p-2.5 rounded-lg ${bgColor}`}>
        <Icon className={`h-5 w-5 ${color}`} />
      </div>
      <div>
        <p className="text-xl font-bold text-foreground">{value}</p>
        <p className="text-xs text-muted-foreground">{label}</p>
      </div>
    </CardContent>
  </Card>
);
