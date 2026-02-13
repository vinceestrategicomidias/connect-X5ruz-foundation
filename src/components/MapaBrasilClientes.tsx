import { useState, useEffect } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Calendar, AlertTriangle, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";

interface PacienteSemEndereco {
  id: string;
  nome: string;
  telefone: string;
}

// Dados por estado (UF) com quantidades realistas por período
const dadosPorEstado: Record<string, Record<string, number>> = {
  tempo_real: { SP: 28, RJ: 12, MG: 9, ES: 14, BA: 4, PR: 5, RS: 3, SC: 2, DF: 7, GO: 2, PE: 3, CE: 2, PA: 1, AM: 1, MA: 1, MT: 1, MS: 1, RN: 1, PB: 1, AL: 1, SE: 1, PI: 0, TO: 0, RO: 0, AC: 0, AP: 0, RR: 0 },
  "7dias": { SP: 145, RJ: 61, MG: 48, ES: 72, BA: 16, PR: 28, RS: 22, SC: 14, DF: 38, GO: 12, PE: 22, CE: 15, PA: 5, AM: 5, MA: 8, MT: 4, MS: 6, RN: 7, PB: 5, AL: 4, SE: 3, PI: 2, TO: 3, RO: 1, AC: 0, AP: 1, RR: 0 },
  "30dias": { SP: 420, RJ: 185, MG: 142, ES: 210, BA: 55, PR: 95, RS: 67, SC: 38, DF: 120, GO: 35, PE: 80, CE: 48, PA: 18, AM: 18, MA: 22, MT: 12, MS: 15, RN: 19, PB: 14, AL: 11, SE: 8, PI: 6, TO: 7, RO: 3, AC: 2, AP: 2, RR: 1 },
  ano: { SP: 4850, RJ: 2120, MG: 1580, ES: 2340, BA: 620, PR: 1050, RS: 780, SC: 410, DF: 1380, GO: 420, PE: 890, CE: 540, PA: 198, AM: 198, MA: 280, MT: 150, MS: 170, RN: 210, PB: 160, AL: 120, SE: 90, PI: 70, TO: 85, RO: 35, AC: 20, AP: 15, RR: 10 },
};

// Cidades por estado (simuladas para tooltip)
const cidadesPorEstado: Record<string, { nome: string; qtd: number }[]> = {
  SP: [{ nome: "São Paulo", qtd: 180 }, { nome: "Campinas", qtd: 45 }, { nome: "Santos", qtd: 30 }, { nome: "Ribeirão Preto", qtd: 25 }],
  RJ: [{ nome: "Rio de Janeiro", qtd: 120 }, { nome: "Niterói", qtd: 25 }, { nome: "Petrópolis", qtd: 15 }],
  MG: [{ nome: "Belo Horizonte", qtd: 80 }, { nome: "Uberlândia", qtd: 22 }, { nome: "Juiz de Fora", qtd: 15 }],
  ES: [{ nome: "Vitória", qtd: 110 }, { nome: "Vila Velha", qtd: 45 }, { nome: "Serra", qtd: 30 }, { nome: "Cariacica", qtd: 15 }],
  BA: [{ nome: "Salvador", qtd: 30 }, { nome: "Feira de Santana", qtd: 10 }],
  PR: [{ nome: "Curitiba", qtd: 55 }, { nome: "Londrina", qtd: 15 }, { nome: "Maringá", qtd: 12 }],
  RS: [{ nome: "Porto Alegre", qtd: 40 }, { nome: "Caxias do Sul", qtd: 12 }],
  DF: [{ nome: "Brasília", qtd: 120 }],
  PE: [{ nome: "Recife", qtd: 55 }, { nome: "Olinda", qtd: 12 }],
  CE: [{ nome: "Fortaleza", qtd: 35 }, { nome: "Sobral", qtd: 5 }],
  GO: [{ nome: "Goiânia", qtd: 25 }, { nome: "Anápolis", qtd: 5 }],
};

const pacientesSemEndereco: Record<string, PacienteSemEndereco[]> = {
  tempo_real: [
    { id: "1", nome: "Carlos Menezes", telefone: "(27) 99123-4567" },
    { id: "2", nome: "Fernanda Costa", telefone: "(11) 98765-4321" },
    { id: "3", nome: "Roberto Alves", telefone: "(21) 97654-3210" },
  ],
  "7dias": [
    { id: "1", nome: "Carlos Menezes", telefone: "(27) 99123-4567" },
    { id: "2", nome: "Fernanda Costa", telefone: "(11) 98765-4321" },
    { id: "3", nome: "Roberto Alves", telefone: "(21) 97654-3210" },
    { id: "4", nome: "Ana Beatriz", telefone: "(31) 96543-2109" },
    { id: "5", nome: "Marcos Vinícius", telefone: "(41) 95432-1098" },
  ],
  "30dias": [
    { id: "1", nome: "Carlos Menezes", telefone: "(27) 99123-4567" },
    { id: "2", nome: "Fernanda Costa", telefone: "(11) 98765-4321" },
    { id: "3", nome: "Roberto Alves", telefone: "(21) 97654-3210" },
    { id: "4", nome: "Ana Beatriz", telefone: "(31) 96543-2109" },
    { id: "5", nome: "Marcos Vinícius", telefone: "(41) 95432-1098" },
    { id: "6", nome: "Patricia Oliveira", telefone: "(51) 94321-0987" },
    { id: "7", nome: "Lucas Ferreira", telefone: "(61) 93210-9876" },
    { id: "8", nome: "Juliana Santos", telefone: "(71) 92109-8765" },
  ],
  ano: [
    { id: "1", nome: "Carlos Menezes", telefone: "(27) 99123-4567" },
    { id: "2", nome: "Fernanda Costa", telefone: "(11) 98765-4321" },
    { id: "3", nome: "Roberto Alves", telefone: "(21) 97654-3210" },
    { id: "4", nome: "Ana Beatriz", telefone: "(31) 96543-2109" },
    { id: "5", nome: "Marcos Vinícius", telefone: "(41) 95432-1098" },
    { id: "6", nome: "Patricia Oliveira", telefone: "(51) 94321-0987" },
    { id: "7", nome: "Lucas Ferreira", telefone: "(61) 93210-9876" },
    { id: "8", nome: "Juliana Santos", telefone: "(71) 92109-8765" },
    { id: "9", nome: "Ricardo Lima", telefone: "(81) 91098-7654" },
    { id: "10", nome: "Camila Rocha", telefone: "(85) 90987-6543" },
  ],
};

// SVG paths para os estados do Brasil (simplificados)
const ESTADOS_SVG: Record<string, { path: string; labelX: number; labelY: number; nome: string }> = {
  AM: { path: "M80,60 L140,45 L170,50 L175,75 L160,90 L120,95 L85,90 Z", labelX: 125, labelY: 72, nome: "Amazonas" },
  PA: { path: "M175,50 L240,40 L260,55 L255,90 L220,100 L175,95 L160,90 L175,75 Z", labelX: 215, labelY: 72, nome: "Pará" },
  MA: { path: "M260,55 L290,50 L300,65 L290,85 L270,90 L255,90 L260,70 Z", labelX: 278, labelY: 72, nome: "Maranhão" },
  CE: { path: "M300,55 L320,50 L325,70 L310,80 L300,75 Z", labelX: 312, labelY: 66, nome: "Ceará" },
  RN: { path: "M325,55 L340,55 L340,68 L325,70 Z", labelX: 333, labelY: 62, nome: "R. G. do Norte" },
  PB: { path: "M325,70 L340,68 L340,78 L320,80 Z", labelX: 332, labelY: 74, nome: "Paraíba" },
  PE: { path: "M310,80 L340,78 L340,88 L305,90 Z", labelX: 325, labelY: 85, nome: "Pernambuco" },
  AL: { path: "M330,88 L340,88 L340,96 L330,96 Z", labelX: 336, labelY: 92, nome: "Alagoas" },
  SE: { path: "M325,96 L340,96 L338,103 L325,102 Z", labelX: 333, labelY: 100, nome: "Sergipe" },
  BA: { path: "M270,90 L325,96 L325,102 L335,110 L320,140 L280,145 L255,130 L260,105 Z", labelX: 290, labelY: 118, nome: "Bahia" },
  MG: { path: "M255,130 L280,145 L310,150 L310,175 L280,185 L250,180 L240,165 L240,140 Z", labelX: 275, labelY: 162, nome: "Minas Gerais" },
  ES: { path: "M310,150 L330,148 L330,168 L310,175 Z", labelX: 320, labelY: 160, nome: "Espírito Santo" },
  RJ: { path: "M290,180 L320,175 L325,185 L300,195 Z", labelX: 308, labelY: 186, nome: "Rio de Janeiro" },
  SP: { path: "M240,175 L280,185 L290,195 L270,210 L240,210 L225,195 Z", labelX: 257, labelY: 195, nome: "São Paulo" },
  PR: { path: "M215,205 L260,210 L260,230 L220,235 L205,220 Z", labelX: 235, labelY: 220, nome: "Paraná" },
  SC: { path: "M220,235 L255,235 L250,250 L225,252 Z", labelX: 238, labelY: 244, nome: "Santa Catarina" },
  RS: { path: "M205,250 L250,250 L240,285 L210,290 L195,270 Z", labelX: 222, labelY: 270, nome: "R. G. do Sul" },
  MS: { path: "M195,170 L240,175 L240,210 L225,215 L205,220 L190,200 Z", labelX: 215, labelY: 195, nome: "Mato Grosso do Sul" },
  MT: { path: "M140,95 L200,100 L210,130 L200,165 L195,170 L160,160 L135,130 Z", labelX: 170, labelY: 132, nome: "Mato Grosso" },
  GO: { path: "M210,130 L255,130 L250,165 L240,175 L195,170 L200,165 Z", labelX: 225, labelY: 152, nome: "Goiás" },
  DF: { path: "M250,150 L260,148 L262,155 L252,157 Z", labelX: 256, labelY: 153, nome: "Distrito Federal" },
  TO: { path: "M220,85 L260,90 L260,105 L255,130 L210,130 L200,100 Z", labelX: 230, labelY: 108, nome: "Tocantins" },
  RO: { path: "M100,95 L140,95 L135,130 L110,140 L90,120 Z", labelX: 115, labelY: 118, nome: "Rondônia" },
  AC: { path: "M50,100 L100,95 L90,120 L55,120 Z", labelX: 72, labelY: 110, nome: "Acre" },
  RR: { path: "M115,20 L145,15 L155,35 L140,45 L120,40 Z", labelX: 135, labelY: 32, nome: "Roraima" },
  AP: { path: "M200,20 L225,15 L235,35 L220,45 L195,40 Z", labelX: 215, labelY: 32, nome: "Amapá" },
  PI: { path: "M270,65 L300,65 L300,90 L280,90 L270,82 Z", labelX: 285, labelY: 78, nome: "Piauí" },
};

const getCorEstado = (qtd: number, maxQtd: number) => {
  if (qtd === 0) return "fill-muted/40 dark:fill-muted/20";
  const ratio = qtd / maxQtd;
  if (ratio > 0.6) return "fill-red-500/80 dark:fill-red-500/70";
  if (ratio > 0.3) return "fill-orange-400/80 dark:fill-orange-400/70";
  if (ratio > 0.15) return "fill-yellow-400/80 dark:fill-yellow-400/70";
  if (ratio > 0.05) return "fill-green-400/80 dark:fill-green-400/70";
  return "fill-green-300/60 dark:fill-green-300/40";
};

export const MapaBrasilClientes = () => {
  const [periodo, setPeriodo] = useState("30dias");
  const [dialogSemEnderecoOpen, setDialogSemEnderecoOpen] = useState(false);
  const [ultimaAtualizacao, setUltimaAtualizacao] = useState(new Date());
  const [paisFiltro, setPaisFiltro] = useState("brasil");
  const [estadoFiltro, setEstadoFiltro] = useState("todos");
  const [cidadeFiltro, setCidadeFiltro] = useState("todas");
  const [hoveredEstado, setHoveredEstado] = useState<string | null>(null);

  const dados = dadosPorEstado[periodo] || dadosPorEstado["30dias"];
  const totalClientes = Object.values(dados).reduce((a, b) => a + b, 0);
  const maxQtd = Math.max(...Object.values(dados));
  const semEndereco = pacientesSemEndereco[periodo] || [];

  useEffect(() => {
    if (periodo !== "tempo_real") return;
    const interval = setInterval(() => setUltimaAtualizacao(new Date()), 30000);
    return () => clearInterval(interval);
  }, [periodo]);

  const estadosDisponiveis = Object.entries(ESTADOS_SVG).map(([uf, info]) => ({ uf, nome: info.nome })).sort((a, b) => a.nome.localeCompare(b.nome));
  const cidadesDoEstado = estadoFiltro !== "todos" ? (cidadesPorEstado[estadoFiltro] || []) : [];

  return (
    <>
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold">Distribuição de Clientes por Localização</h3>
            <p className="text-sm text-muted-foreground">
              Total: {totalClientes.toLocaleString()} clientes
              {estadoFiltro !== "todos" && ` • ${ESTADOS_SVG[estadoFiltro]?.nome}: ${dados[estadoFiltro] || 0}`}
            </p>
          </div>
          <div className="flex items-center gap-3">
            {semEndereco.length > 0 && (
              <Badge
                variant="outline"
                className="cursor-pointer hover:bg-muted flex items-center gap-1.5 py-1 px-2"
                onClick={() => setDialogSemEnderecoOpen(true)}
              >
                <AlertTriangle className="h-3.5 w-3.5 text-amber-500" />
                <span className="text-xs">Sem endereço: {semEndereco.length}</span>
              </Badge>
            )}
            {periodo === "tempo_real" && (
              <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
                <RefreshCw className="h-3.5 w-3.5 animate-spin" />
                <span>Atualizado {ultimaAtualizacao.toLocaleTimeString("pt-BR", { hour: "2-digit", minute: "2-digit" })}</span>
              </div>
            )}
            <div className="flex items-center gap-2">
              <Calendar className="h-4 w-4 text-muted-foreground" />
              <Select value={periodo} onValueChange={setPeriodo}>
                <SelectTrigger className="w-40">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="tempo_real">Tempo real</SelectItem>
                  <SelectItem value="7dias">Últimos 7 dias</SelectItem>
                  <SelectItem value="30dias">Últimos 30 dias</SelectItem>
                  <SelectItem value="ano">Último ano</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>

        {/* Filtros de localização */}
        <div className="flex items-center gap-3 mb-4">
          <Select value={paisFiltro} onValueChange={setPaisFiltro}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="País" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="brasil">Brasil</SelectItem>
            </SelectContent>
          </Select>

          <Select value={estadoFiltro} onValueChange={(v) => { setEstadoFiltro(v); setCidadeFiltro("todas"); }}>
            <SelectTrigger className="w-52">
              <SelectValue placeholder="Todos os estados" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="todos">Todos os estados</SelectItem>
              {estadosDisponiveis.map(e => (
                <SelectItem key={e.uf} value={e.uf}>{e.nome} ({e.uf})</SelectItem>
              ))}
            </SelectContent>
          </Select>

          {cidadesDoEstado.length > 0 && (
            <Select value={cidadeFiltro} onValueChange={setCidadeFiltro}>
              <SelectTrigger className="w-52">
                <SelectValue placeholder="Todas as cidades" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas as cidades</SelectItem>
                {cidadesDoEstado.map(c => (
                  <SelectItem key={c.nome} value={c.nome}>{c.nome} ({c.qtd})</SelectItem>
                ))}
              </SelectContent>
            </Select>
          )}
        </div>

        {/* Mapa SVG do Brasil */}
        <div className="relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-xl overflow-hidden" style={{ height: 420 }}>
          <svg viewBox="30 5 330 300" className="w-full h-full">
            {Object.entries(ESTADOS_SVG).map(([uf, info]) => {
              const qtd = dados[uf] || 0;
              const isHighlighted = estadoFiltro === uf || hoveredEstado === uf;
              const isFiltered = estadoFiltro !== "todos" && estadoFiltro !== uf;
              
              return (
                <g
                  key={uf}
                  onMouseEnter={() => setHoveredEstado(uf)}
                  onMouseLeave={() => setHoveredEstado(null)}
                  onClick={() => { setEstadoFiltro(uf === estadoFiltro ? "todos" : uf); setCidadeFiltro("todas"); }}
                  className="cursor-pointer transition-all"
                >
                  <path
                    d={info.path}
                    className={`${getCorEstado(qtd, maxQtd)} stroke-background dark:stroke-background/50 transition-all ${
                      isHighlighted ? "stroke-primary stroke-[2]" : "stroke-[0.8]"
                    } ${isFiltered ? "opacity-30" : "opacity-100"}`}
                  />
                  {/* UF label */}
                  <text
                    x={info.labelX}
                    y={info.labelY - 4}
                    textAnchor="middle"
                    className={`fill-foreground text-[7px] font-bold pointer-events-none ${isFiltered ? "opacity-20" : ""}`}
                  >
                    {uf}
                  </text>
                  {/* Quantity label */}
                  {qtd > 0 && (
                    <text
                      x={info.labelX}
                      y={info.labelY + 5}
                      textAnchor="middle"
                      className={`fill-foreground/70 text-[6px] pointer-events-none ${isFiltered ? "opacity-20" : ""}`}
                    >
                      {qtd >= 1000 ? `${(qtd / 1000).toFixed(1)}k` : qtd}
                    </text>
                  )}
                </g>
              );
            })}
          </svg>

          {/* Tooltip */}
          {hoveredEstado && (
            <div className="absolute top-4 right-4 bg-popover border border-border rounded-lg shadow-lg p-3 z-10 min-w-[160px]">
              <p className="font-semibold text-sm">{ESTADOS_SVG[hoveredEstado]?.nome} ({hoveredEstado})</p>
              <p className="text-lg font-bold text-primary">{(dados[hoveredEstado] || 0).toLocaleString()} clientes</p>
              {cidadesPorEstado[hoveredEstado] && (
                <div className="mt-2 pt-2 border-t space-y-1">
                  <p className="text-xs font-medium text-muted-foreground">Top cidades:</p>
                  {cidadesPorEstado[hoveredEstado].slice(0, 3).map(c => (
                    <div key={c.nome} className="flex justify-between text-xs">
                      <span>{c.nome}</span>
                      <span className="font-medium">{c.qtd}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>
      </Card>

      {/* Dialog de pacientes sem endereço */}
      <Dialog open={dialogSemEnderecoOpen} onOpenChange={setDialogSemEnderecoOpen}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-amber-500" />
              Pacientes sem endereço cadastrado
            </DialogTitle>
          </DialogHeader>
          <p className="text-sm text-muted-foreground mb-4">
            {semEndereco.length} paciente(s)
          </p>
          <ScrollArea className="h-[300px]">
            <div className="space-y-2">
              {semEndereco.map((paciente) => (
                <div
                  key={paciente.id}
                  className="p-3 rounded-lg border border-border hover:bg-muted/50 transition-colors"
                >
                  <p className="font-medium text-sm">{paciente.nome}</p>
                  <p className="text-xs text-muted-foreground">{paciente.telefone}</p>
                </div>
              ))}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </>
  );
};
