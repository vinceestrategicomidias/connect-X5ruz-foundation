import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar } from "lucide-react";

interface LocalizacaoCliente {
  local: string;
  uf: string;
  clientes: number;
  intensidade: "muito_baixa" | "baixa" | "média" | "alta" | "muito_alta";
  lat: number;
  lng: number;
}

const dadosLocalizacao: Record<string, LocalizacaoCliente[]> = {
  "7dias": [
    { local: "São Paulo", uf: "SP", clientes: 145, intensidade: "muito_alta", lat: -23.55, lng: -46.63 },
    { local: "Vitória", uf: "ES", clientes: 72, intensidade: "alta", lat: -20.32, lng: -40.34 },
    { local: "Rio de Janeiro", uf: "RJ", clientes: 61, intensidade: "alta", lat: -22.91, lng: -43.17 },
    { local: "Brasília", uf: "DF", clientes: 38, intensidade: "média", lat: -15.79, lng: -47.88 },
    { local: "Curitiba", uf: "PR", clientes: 28, intensidade: "média", lat: -25.43, lng: -49.27 },
    { local: "Recife", uf: "PE", clientes: 22, intensidade: "baixa", lat: -8.05, lng: -34.88 },
    { local: "Salvador", uf: "BA", clientes: 16, intensidade: "baixa", lat: -12.97, lng: -38.51 },
    { local: "Manaus", uf: "AM", clientes: 5, intensidade: "muito_baixa", lat: -3.12, lng: -60.02 },
  ],
  "30dias": [
    { local: "São Paulo", uf: "SP", clientes: 420, intensidade: "muito_alta", lat: -23.55, lng: -46.63 },
    { local: "Vitória", uf: "ES", clientes: 210, intensidade: "alta", lat: -20.32, lng: -40.34 },
    { local: "Rio de Janeiro", uf: "RJ", clientes: 185, intensidade: "alta", lat: -22.91, lng: -43.17 },
    { local: "Brasília", uf: "DF", clientes: 120, intensidade: "média", lat: -15.79, lng: -47.88 },
    { local: "Curitiba", uf: "PR", clientes: 95, intensidade: "média", lat: -25.43, lng: -49.27 },
    { local: "Recife", uf: "PE", clientes: 80, intensidade: "média", lat: -8.05, lng: -34.88 },
    { local: "Salvador", uf: "BA", clientes: 55, intensidade: "baixa", lat: -12.97, lng: -38.51 },
    { local: "Manaus", uf: "AM", clientes: 18, intensidade: "muito_baixa", lat: -3.12, lng: -60.02 },
    { local: "Belo Horizonte", uf: "MG", clientes: 142, intensidade: "alta", lat: -19.92, lng: -43.94 },
    { local: "Porto Alegre", uf: "RS", clientes: 67, intensidade: "média", lat: -30.03, lng: -51.23 },
    { local: "Fortaleza", uf: "CE", clientes: 48, intensidade: "baixa", lat: -3.72, lng: -38.54 },
    { local: "Goiânia", uf: "GO", clientes: 35, intensidade: "baixa", lat: -16.68, lng: -49.26 },
  ],
  "ano": [
    { local: "São Paulo", uf: "SP", clientes: 4850, intensidade: "muito_alta", lat: -23.55, lng: -46.63 },
    { local: "Vitória", uf: "ES", clientes: 2340, intensidade: "alta", lat: -20.32, lng: -40.34 },
    { local: "Rio de Janeiro", uf: "RJ", clientes: 2120, intensidade: "alta", lat: -22.91, lng: -43.17 },
    { local: "Brasília", uf: "DF", clientes: 1380, intensidade: "alta", lat: -15.79, lng: -47.88 },
    { local: "Belo Horizonte", uf: "MG", clientes: 1580, intensidade: "alta", lat: -19.92, lng: -43.94 },
    { local: "Curitiba", uf: "PR", clientes: 1050, intensidade: "média", lat: -25.43, lng: -49.27 },
    { local: "Recife", uf: "PE", clientes: 890, intensidade: "média", lat: -8.05, lng: -34.88 },
    { local: "Salvador", uf: "BA", clientes: 620, intensidade: "média", lat: -12.97, lng: -38.51 },
    { local: "Manaus", uf: "AM", clientes: 198, intensidade: "baixa", lat: -3.12, lng: -60.02 },
    { local: "Porto Alegre", uf: "RS", clientes: 780, intensidade: "média", lat: -30.03, lng: -51.23 },
    { local: "Fortaleza", uf: "CE", clientes: 540, intensidade: "média", lat: -3.72, lng: -38.54 },
    { local: "Goiânia", uf: "GO", clientes: 420, intensidade: "baixa", lat: -16.68, lng: -49.26 },
  ],
};

const getIntensidadeCor = (intensidade: string) => {
  switch (intensidade) {
    case "muito_alta":
      return { bg: "bg-red-500", size: "w-10 h-10", text: "text-red-700" };
    case "alta":
      return { bg: "bg-orange-500", size: "w-8 h-8", text: "text-orange-700" };
    case "média":
      return { bg: "bg-yellow-500", size: "w-6 h-6", text: "text-yellow-700" };
    case "baixa":
      return { bg: "bg-blue-400", size: "w-5 h-5", text: "text-blue-600" };
    case "muito_baixa":
      return { bg: "bg-blue-300", size: "w-4 h-4", text: "text-blue-500" };
    default:
      return { bg: "bg-gray-400", size: "w-4 h-4", text: "text-gray-600" };
  }
};

// Mapear coordenadas para posição no mapa (SVG simplificado)
const coordToPosition = (lat: number, lng: number) => {
  // Brasil aproximado: lat -5 a -33, lng -35 a -74
  const x = ((lng + 74) / (74 - 35)) * 100;
  const y = ((lat + 5) / (33 - 5)) * 100;
  return { x: Math.min(95, Math.max(5, x)), y: Math.min(90, Math.max(5, y)) };
};

export const MapaBrasilClientes = () => {
  const [periodo, setPeriodo] = useState("30dias");
  const dados = dadosLocalizacao[periodo];
  const totalClientes = dados.reduce((acc, d) => acc + d.clientes, 0);

  return (
    <Card className="p-6">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h3 className="text-lg font-semibold">Distribuição de Clientes por Localização</h3>
          <p className="text-sm text-muted-foreground">Total: {totalClientes.toLocaleString()} clientes</p>
        </div>
        <div className="flex items-center gap-2">
          <Calendar className="h-4 w-4 text-muted-foreground" />
          <Select value={periodo} onValueChange={setPeriodo}>
            <SelectTrigger className="w-44">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="7dias">Últimos 7 dias</SelectItem>
              <SelectItem value="30dias">Últimos 30 dias</SelectItem>
              <SelectItem value="ano">Último ano</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Mapa do Brasil estilizado */}
      <div className="relative bg-gradient-to-br from-blue-50 to-green-50 dark:from-blue-950/20 dark:to-green-950/20 rounded-xl overflow-hidden" style={{ height: 400 }}>
        {/* SVG simplificado do Brasil */}
        <svg viewBox="0 0 100 100" className="absolute inset-0 w-full h-full opacity-20">
          <path
            d="M 45 5 L 75 10 L 85 25 L 90 45 L 85 65 L 70 80 L 50 90 L 30 85 L 20 70 L 15 50 L 20 30 L 35 15 Z"
            fill="currentColor"
            className="text-primary/30"
          />
        </svg>

        {/* Marcadores de cidades */}
        {dados.map((loc) => {
          const pos = coordToPosition(loc.lat, loc.lng);
          const style = getIntensidadeCor(loc.intensidade);
          
          return (
            <div
              key={loc.local}
              className="absolute transform -translate-x-1/2 -translate-y-1/2 group cursor-pointer"
              style={{ left: `${pos.x}%`, top: `${pos.y}%` }}
            >
              <div className={`${style.bg} ${style.size} rounded-full opacity-70 animate-pulse shadow-lg flex items-center justify-center`}>
                <span className="text-white text-[8px] font-bold">
                  {loc.clientes >= 1000 ? `${(loc.clientes / 1000).toFixed(1)}k` : loc.clientes}
                </span>
              </div>
              
              {/* Tooltip */}
              <div className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 px-3 py-2 bg-popover border border-border rounded-lg shadow-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-10">
                <p className="font-semibold text-sm">{loc.local} - {loc.uf}</p>
                <p className={`text-sm ${style.text} font-medium`}>{loc.clientes.toLocaleString()} clientes</p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Legenda */}
      <div className="flex flex-wrap items-center justify-center gap-4 mt-4 pt-4 border-t">
        {[
          { label: "Muito baixa", cor: "bg-blue-300" },
          { label: "Baixa", cor: "bg-blue-400" },
          { label: "Média", cor: "bg-yellow-500" },
          { label: "Alta", cor: "bg-orange-500" },
          { label: "Muito alta", cor: "bg-red-500" },
        ].map((item) => (
          <div key={item.label} className="flex items-center gap-2">
            <div className={`w-3 h-3 rounded-full ${item.cor}`} />
            <span className="text-xs text-muted-foreground">{item.label}</span>
          </div>
        ))}
      </div>

      {/* Lista resumida */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mt-4">
        {dados.slice(0, 8).map((loc) => {
          const style = getIntensidadeCor(loc.intensidade);
          return (
            <div key={loc.local} className="flex items-center gap-2 p-2 rounded-lg bg-muted/30">
              <div className={`w-2.5 h-2.5 rounded-full ${style.bg}`} />
              <div className="flex-1 min-w-0">
                <p className="text-xs font-medium truncate">{loc.local}</p>
                <p className="text-xs text-muted-foreground">{loc.clientes.toLocaleString()}</p>
              </div>
            </div>
          );
        })}
      </div>
    </Card>
  );
};
