import { Card } from "@/components/ui/card";
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

  return (
    <div className="flex items-center gap-2">
      {ranking.map((atendente) => (
        <Card
          key={atendente.posicao}
          className={`px-3 py-2 flex items-center gap-2 transition-all hover:scale-105 ${
            atendente.posicao === 1
              ? "bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-300"
              : atendente.posicao === 2
              ? "bg-gradient-to-br from-gray-50 to-gray-100 border-gray-300"
              : "bg-gradient-to-br from-orange-50 to-orange-100 border-orange-300"
          }`}
        >
          <Trophy
            className={`h-4 w-4 ${
              atendente.posicao === 1
                ? "text-yellow-600"
                : atendente.posicao === 2
                ? "text-gray-500"
                : "text-orange-600"
            }`}
          />
          <div className="text-left">
            <div className="text-xs font-semibold text-foreground">
              {atendente.nome.split(" ")[0]}
            </div>
            <div className="text-[10px] text-muted-foreground">
              {atendente.atendimentos} atend. • NPS {atendente.nps}
            </div>
          </div>
        </Card>
      ))}
    </div>
  );
};
