import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { Maximize2, Users, Clock, TrendingUp, Phone, MessageSquare, Timer, Target, Award, UserCheck, Coffee, ArrowLeft, ChevronUp, ChevronDown, Minus } from "lucide-react";
import { StatusAtendentesBlock } from "@/components/StatusAtendentesBlock";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { usePacientes } from "@/hooks/usePacientes";
import { useChamadas } from "@/hooks/useChamadas";
import { useAtendentes } from "@/hooks/useAtendentes";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { ConnectAvatar } from "@/components/ConnectAvatar";
import { LineChart, Line, BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart, ReferenceLine } from "recharts";
import { MapaBrasilClientes } from "@/components/MapaBrasilClientes";
import { MonitoramentoAtendentesPanel } from "@/components/MonitoramentoAtendentesPanel";

interface DashboardMetrics {
  emAtendimento: number;
  naFila: number;
  aguardandoResposta: number;
  tma: number;
  tme: number;
  sla: number;
  nps: number;
  encerradosHoje: number;
  atendentesOnline: number;
  atendentesPausa: number;
}

export default function DashboardMonitoramento() {
  const navigate = useNavigate();
  const { atendenteLogado, isCoordenacao, isGestor } = useAtendenteContext();
  const { data: pacientes } = usePacientes();
  const { data: chamadas } = useChamadas();
  const { data: atendentes } = useAtendentes();
  
  const [metrics, setMetrics] = useState<DashboardMetrics>({
    emAtendimento: 0,
    naFila: 0,
    aguardandoResposta: 0,
    tma: 0,
    tme: 0,
    sla: 0,
    nps: 0,
    encerradosHoje: 0,
    atendentesOnline: 0,
    atendentesPausa: 0,
  });
  
  const [unidadeFiltro, setUnidadeFiltro] = useState("todas");
  const [setorFiltro, setSetorFiltro] = useState("todos");
  const [periodoFiltro, setPeriodoFiltro] = useState("agora");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [tamanhoFila, setTamanhoFila] = useState<"compacto" | "medio" | "expandido">("medio");
  const [monitoramentoOpen, setMonitoramentoOpen] = useState(false);

  // Alturas do bloco Fila em tempo real
  const alturasFila = {
    compacto: "h-[250px]",
    medio: "h-[400px]",
    expandido: "h-[600px]"
  };

  const ciclarTamanhoFila = () => {
    setTamanhoFila(prev => {
      if (prev === "compacto") return "medio";
      if (prev === "medio") return "expandido";
      return "compacto";
    });
  };

  const getIconeTamanho = () => {
    if (tamanhoFila === "compacto") return <ChevronDown className="h-4 w-4" />;
    if (tamanhoFila === "expandido") return <ChevronUp className="h-4 w-4" />;
    return <Minus className="h-4 w-4" />;
  };

  // Auto-refresh a cada 5 segundos
  useEffect(() => {
    const interval = setInterval(() => {
      calcularMetricas();
    }, 5000);
    
    calcularMetricas();
    return () => clearInterval(interval);
  }, [pacientes, chamadas, atendentes]);

  const calcularMetricas = () => {
    if (!pacientes || !chamadas || !atendentes) return;

    const hoje = new Date();
    hoje.setHours(0, 0, 0, 0);

    const emAtendimento = pacientes.filter(p => p.status === "em_atendimento").length;
    const naFila = pacientes.filter(p => p.status === "fila").length;
    const aguardandoResposta = pacientes.filter(p => 
      p.status === "em_atendimento" && (p.tempo_na_fila || 0) > 5
    ).length;

    const chamadasHoje = chamadas.filter(c => new Date(c.horario_inicio) >= hoje);
    const chamadasAtendidas = chamadasHoje.filter(c => c.status === "atendida");
    
    const tmaTotal = chamadasAtendidas.reduce((acc, c) => acc + (c.duracao || 0), 0);
    const tma = chamadasAtendidas.length > 0 ? tmaTotal / chamadasAtendidas.length / 60 : 0;
    
    const tmeTotal = pacientes.reduce((acc, p) => acc + (p.tempo_na_fila || 0), 0);
    const tme = pacientes.length > 0 ? tmeTotal / pacientes.length : 0;
    
    const sla = chamadasHoje.length > 0 
      ? (chamadasAtendidas.length / chamadasHoje.length) * 100 
      : 100;

    const nps = 85 + Math.random() * 10; // Simulado
    const encerradosHoje = chamadasAtendidas.length;
    const atendentesOnline = atendentes.length;
    const atendentesPausa = Math.floor(atendentes.length * 0.2); // Simulado

    setMetrics({
      emAtendimento,
      naFila,
      aguardandoResposta,
      tma,
      tme,
      sla,
      nps,
      encerradosHoje,
      atendentesOnline,
      atendentesPausa,
    });
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      document.exitFullscreen();
      setIsFullscreen(false);
    }
  };

  const MetricCard = ({ 
    icon: Icon, 
    label, 
    value, 
    alert = false 
  }: { 
    icon: any; 
    label: string; 
    value: string | number; 
    alert?: boolean;
  }) => (
    <Card className={`p-4 ${alert ? 'border-destructive bg-destructive/5' : ''}`}>
      <div className="flex items-center gap-3">
        <div className={`p-2 rounded-lg ${alert ? 'bg-destructive/10' : 'bg-primary/10'}`}>
          <Icon className={`h-5 w-5 ${alert ? 'text-destructive' : 'text-primary'}`} />
        </div>
        <div>
          <p className="text-2xl font-bold">{value}</p>
          <p className="text-xs text-muted-foreground">{label}</p>
        </div>
      </div>
    </Card>
  );

  // Dados simulados para gráficos
  const dadosAtendimentosPorHora = [
    { hora: "08:00", atendimentos: 35 },
    { hora: "09:00", atendimentos: 62 },
    { hora: "10:00", atendimentos: 88 },
    { hora: "11:00", atendimentos: 54 },
    { hora: "12:00", atendimentos: 29 },
    { hora: "13:00", atendimentos: 47 },
    { hora: "14:00", atendimentos: 71 },
    { hora: "15:00", atendimentos: 65 },
  ];

  const dadosTmaTme = [
    { hora: "08:00", tma: 3.2, tme: 4.1 },
    { hora: "09:00", tma: 3.8, tme: 5.2 },
    { hora: "10:00", tma: 4.1, tme: 6.3 },
    { hora: "11:00", tma: 3.5, tme: 4.8 },
    { hora: "12:00", tma: 3.9, tme: 5.1 },
    { hora: "13:00", tma: 3.7, tme: 4.6 },
    { hora: "14:00", tma: 4.2, tme: 5.9 },
    { hora: "15:00", tma: 3.6, tme: 4.4 },
  ];

  const dadosVendas = [
    { hora: "08:00", vendas: 8, meta: 10 },
    { hora: "09:00", vendas: 15, meta: 10 },
    { hora: "10:00", vendas: 22, meta: 10 },
    { hora: "11:00", vendas: 12, meta: 10 },
    { hora: "12:00", vendas: 6, meta: 10 },
    { hora: "13:00", vendas: 14, meta: 10 },
    { hora: "14:00", vendas: 18, meta: 10 },
    { hora: "15:00", vendas: 16, meta: 10 },
  ];

  const filaEmTempoReal = pacientes?.filter(p => p.status === "fila")
    .sort((a, b) => (b.tempo_na_fila || 0) - (a.tempo_na_fila || 0)) || [];

  return (
    <div className="min-h-screen bg-background p-4">
      {/* Header com filtros */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" onClick={() => navigate("/chat")}>
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <div>
            <h1 className="text-3xl font-bold">Dashboard de Monitoramento</h1>
            <p className="text-sm text-muted-foreground">Atualização automática a cada 5 segundos</p>
          </div>
        </div>
        
        <div className="flex items-center gap-3">
          <Select value={unidadeFiltro} onValueChange={setUnidadeFiltro}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Unidade" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todas">Todas as unidades</SelectItem>
              <SelectItem value="sede">Sede - Vitória</SelectItem>
              <SelectItem value="sp">Unidade São Paulo</SelectItem>
              <SelectItem value="rj">Unidade Rio de Janeiro</SelectItem>
            </SelectContent>
          </Select>

          <Select value={setorFiltro} onValueChange={setSetorFiltro}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Setor" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os setores</SelectItem>
              <SelectItem value="prevenda">Pré-venda</SelectItem>
              <SelectItem value="venda">Venda</SelectItem>
              <SelectItem value="posvenda">Pós-venda</SelectItem>
            </SelectContent>
          </Select>

          <Select value={periodoFiltro} onValueChange={setPeriodoFiltro}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Período" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="agora">Agora (tempo real)</SelectItem>
              <SelectItem value="hoje">Hoje</SelectItem>
              <SelectItem value="2h">Últimas 2 horas</SelectItem>
              <SelectItem value="24h">Últimas 24 horas</SelectItem>
            </SelectContent>
          </Select>

          <Button variant="outline" size="icon" onClick={toggleFullscreen}>
            <Maximize2 className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Indicadores principais */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <div 
          className="cursor-pointer transition-transform hover:scale-105"
          onClick={() => setMonitoramentoOpen(true)}
        >
          <MetricCard icon={Users} label="Em atendimento" value={metrics.emAtendimento} />
        </div>
        <MetricCard icon={Clock} label="Na fila agora" value={metrics.naFila} alert={metrics.naFila > 25} />
        <MetricCard icon={Timer} label="TMA" value={`${metrics.tma.toFixed(1)} min`} alert={metrics.tma > 4} />
        <MetricCard icon={Timer} label="TME" value={`${metrics.tme.toFixed(1)} min`} alert={metrics.tme > 7} />
      </div>

      <div className="grid grid-cols-4 gap-4 mb-6">
        <MetricCard icon={Target} label="SLA resposta" value={`${metrics.sla.toFixed(0)}%`} alert={metrics.sla < 85} />
        <MetricCard icon={Award} label="NPS médio hoje" value={metrics.nps.toFixed(0)} />
        <StatusAtendentesBlock onOpenMonitoramento={() => setMonitoramentoOpen(true)} />
      </div>

      {/* Painéis principais */}
      <div className="grid grid-cols-2 gap-6 mb-6">
        {/* Fila em tempo real - com controle de tamanho */}
        <Card className="p-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <h3 className="text-lg font-semibold">Fila em tempo real</h3>
              <Badge variant="secondary" className="text-sm font-medium">
                {filaEmTempoReal.length}
              </Badge>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={ciclarTamanhoFila}
              className="gap-1 text-xs"
              title={`Tamanho: ${tamanhoFila} - Clique para alternar`}
            >
              {getIconeTamanho()}
              <span className="text-muted-foreground capitalize">{tamanhoFila}</span>
            </Button>
          </div>
          <ScrollArea className={alturasFila[tamanhoFila]}>
            <div className="space-y-2">
              {filaEmTempoReal.map((paciente) => {
                const tempo = paciente.tempo_na_fila || 0;
                const corBadge = tempo >= 30 
                  ? "bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400"
                  : tempo >= 15
                    ? "bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-400"
                    : "bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400";
                return (
                  <div 
                    key={paciente.id}
                    className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                  >
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <ConnectAvatar name={paciente.nome} size="sm" />
                        <span className="font-medium text-sm">{paciente.nome}</span>
                      </div>
                      <Badge className={corBadge}>
                        {tempo} min
                      </Badge>
                    </div>
                    <p className="text-xs text-muted-foreground truncate">{paciente.ultima_mensagem || "Sem mensagem"}</p>
                    <p className="text-xs text-muted-foreground mt-0.5">Pré-venda • Sede - Vitória</p>
                  </div>
                );
              })}
            </div>
          </ScrollArea>
        </Card>

        {/* Ranking Top 3 - com fotos */}
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Ranking Diário - Top 3</h3>
          <div className="space-y-4">
            {[
              { posicao: 1, nome: "Emily", atendimentos: 36, tma: "3.2 min", nps: 94, cor: "text-yellow-500", bg: "bg-yellow-500/10", ring: "ring-yellow-400" },
              { posicao: 2, nome: "Geovana", atendimentos: 33, tma: "3.6 min", nps: 95, cor: "text-gray-400", bg: "bg-gray-400/10", ring: "ring-gray-300" },
              { posicao: 3, nome: "Paloma", atendimentos: 29, tma: "3.9 min", nps: 92, cor: "text-orange-500", bg: "bg-orange-500/10", ring: "ring-orange-400" },
            ].map((atendente) => (
              <div key={atendente.posicao} className={`flex items-center gap-4 p-4 rounded-lg ${atendente.bg}`}>
                <div className="relative">
                  <div className={`ring-2 ${atendente.ring} rounded-full`}>
                    <ConnectAvatar name={atendente.nome} size="md" />
                  </div>
                  <div className={`absolute -top-1 -right-1 flex items-center justify-center w-5 h-5 rounded-full ${atendente.bg} ${atendente.cor} font-bold text-xs`}>
                    {atendente.posicao}
                  </div>
                </div>
                <div className="flex-1">
                  <p className="font-semibold text-base">{atendente.nome}</p>
                  <div className="flex items-center gap-4 text-sm text-muted-foreground">
                    <span>{atendente.atendimentos} atend.</span>
                    <span>TMA: {atendente.tma}</span>
                    <span>NPS: {atendente.nps}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </Card>
      </div>

      {/* Gráficos */}
      <div className="grid grid-cols-3 gap-6 mb-6">
        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Atendimentos por hora (hoje)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dadosAtendimentosPorHora}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip />
              <Bar dataKey="atendimentos" fill="hsl(var(--primary))" />
            </BarChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">TMA e TME por hora</h3>
          <ResponsiveContainer width="100%" height={250}>
            <LineChart data={dadosTmaTme}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="tma" stroke="hsl(var(--primary))" name="TMA (min)" />
              <Line type="monotone" dataKey="tme" stroke="hsl(var(--destructive))" name="TME (min)" />
            </LineChart>
          </ResponsiveContainer>
        </Card>

        <Card className="p-4">
          <h3 className="text-lg font-semibold mb-4">Vendas por hora (hoje)</h3>
          <ResponsiveContainer width="100%" height={250}>
            <BarChart data={dadosVendas}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="hora" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="vendas" fill="hsl(142, 76%, 36%)" name="Vendas" />
              <Line type="monotone" dataKey="meta" stroke="hsl(var(--destructive))" name="Meta" strokeDasharray="5 5" />
            </BarChart>
          </ResponsiveContainer>
        </Card>
      </div>

      {/* Mapa do Brasil */}
      <div className="mb-6">
        <MapaBrasilClientes />
      </div>

      {/* Painel de Monitoramento */}
      <MonitoramentoAtendentesPanel
        open={monitoramentoOpen}
        onOpenChange={setMonitoramentoOpen}
      />
    </div>
  );
}
