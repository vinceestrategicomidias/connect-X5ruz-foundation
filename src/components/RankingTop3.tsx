import { Trophy } from "lucide-react";
import { useEffect, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import { useAtendenteContext } from "@/contexts/AtendenteContext";

interface AtendenteRanking {
  nome: string;
  atendimentos: number;
  tma: number;
  nps: number;
  posicao: number;
}

export const RankingTop3 = () => {
  const [ranking, setRanking] = useState<AtendenteRanking[]>([]);
  const { atendenteLogado } = useAtendenteContext();

  useEffect(() => {
    const carregarRanking = async () => {
      if (!atendenteLogado?.setor_id) return;

      // Buscar chamadas do dia por atendente
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const { data: chamadasHoje } = await supabase
        .from("chamadas")
        .select("atendente_id, duracao, status")
        .gte("horario_inicio", hoje.toISOString())
        .eq("setor_origem", atendenteLogado.setor_id)
        .eq("status", "atendida");

      const { data: atendentes } = await supabase
        .from("atendentes")
        .select("id, nome")
        .eq("setor_id", atendenteLogado.setor_id);

      if (!chamadasHoje || !atendentes) return;

      // Calcular métricas por atendente
      const metricasPorAtendente = atendentes.map((atendente) => {
        const chamadasAtendente = chamadasHoje.filter(
          (c) => c.atendente_id === atendente.id
        );
        const totalAtendimentos = chamadasAtendente.length;
        const duracaoTotal = chamadasAtendente.reduce(
          (acc, c) => acc + (c.duracao || 0),
          0
        );
        const tma = totalAtendimentos > 0 ? duracaoTotal / totalAtendimentos : 0;

        // NPS simulado (entre 7-10)
        const nps = 7 + Math.random() * 3;

        // Pontuação: quantidade + (1/tma normalizado) + nps
        const pontuacao = totalAtendimentos * 10 + (tma > 0 ? 1000 / tma : 0) + nps * 5;

        return {
          nome: atendente.nome,
          atendimentos: totalAtendimentos,
          tma: Math.floor(tma),
          nps: parseFloat(nps.toFixed(1)),
          pontuacao,
        };
      });

      // Ordenar por pontuação e pegar top 3
      const top3 = metricasPorAtendente
        .sort((a, b) => b.pontuacao - a.pontuacao)
        .slice(0, 3)
        .map((item, idx) => ({
          ...item,
          posicao: idx + 1,
        }));

      setRanking(top3);
    };

    carregarRanking();
  }, [atendenteLogado]);

  if (ranking.length === 0) return null;

  const getCoresTaca = (posicao: number) => {
    if (posicao === 1) return "text-yellow-500 fill-yellow-500";
    if (posicao === 2) return "text-gray-400 fill-gray-400";
    return "text-orange-500 fill-orange-500";
  };

  return (
    <div className="flex items-center gap-3">
      {ranking.map((atendente) => (
        <div
          key={atendente.posicao}
          className="flex items-center gap-2 group transition-all hover:scale-105"
        >
          <div className="relative">
            <Trophy
              className={`h-6 w-6 ${getCoresTaca(atendente.posicao)} transition-transform group-hover:rotate-12`}
              strokeWidth={1.5}
            />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="text-[9px] font-bold text-background mt-[2px]">
                {atendente.posicao}
              </span>
            </div>
          </div>
          <div className="text-left">
            <div className="text-xs font-semibold text-foreground leading-tight">
              {atendente.nome.split(" ")[0]}
            </div>
            <div className="flex flex-col text-[10px] text-muted-foreground leading-tight gap-0.5">
              <span>{atendente.atendimentos} atend.</span>
              <span>TMA: {atendente.tma}s</span>
              <span>NPS: {atendente.nps}</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
