import { Trophy } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";
import avatarEmily from "@/assets/avatar-emily.png";
import avatarGeovanna from "@/assets/avatar-geovanna.png";
import avatarPaloma from "@/assets/avatar-paloma.png";

interface AtendenteRanking {
  nome: string;
  nomeCompleto: string;
  atendimentos: number;
  tma: string;
  nps: number;
  posicao: number;
  avatar: string;
}

// Dados fixos do ranking (Emily, Geovana, Paloma) com fotos
const rankingFixo: AtendenteRanking[] = [
  { posicao: 1, nome: "Emily", nomeCompleto: "Emily Santos", atendimentos: 36, tma: "3.2 min", nps: 94, avatar: avatarEmily },
  { posicao: 2, nome: "Geovanna", nomeCompleto: "Geovanna Silva", atendimentos: 33, tma: "3.6 min", nps: 95, avatar: avatarGeovanna },
  { posicao: 3, nome: "Paloma", nomeCompleto: "Paloma Oliveira", atendimentos: 29, tma: "3.9 min", nps: 92, avatar: avatarPaloma },
];

export const RankingTop3 = () => {
  const getCoresTaca = (posicao: number) => {
    if (posicao === 1) return "text-yellow-500 fill-yellow-500";
    if (posicao === 2) return "text-gray-400 fill-gray-400";
    return "text-orange-600 fill-orange-600";
  };

  const getBorderColor = (posicao: number) => {
    if (posicao === 1) return "ring-yellow-400";
    if (posicao === 2) return "ring-gray-300";
    return "ring-orange-400";
  };

  return (
    <div className="flex items-center gap-4">
      {rankingFixo.map((atendente) => (
        <Tooltip key={atendente.posicao}>
          <TooltipTrigger asChild>
            <div className="flex items-center gap-2 group transition-all hover:scale-105 cursor-pointer">
              <div className="relative">
                <div className={`ring-2 ${getBorderColor(atendente.posicao)} rounded-full overflow-hidden`}>
                  <img 
                    src={atendente.avatar} 
                    alt={atendente.nome}
                    className="h-10 w-10 object-cover"
                  />
                </div>
                <div className="absolute -top-1 -right-1">
                  <Trophy
                    className={`h-4 w-4 ${getCoresTaca(atendente.posicao)}`}
                    strokeWidth={1.5}
                  />
                </div>
              </div>
              <div className="text-left">
                <div className="text-xs font-semibold text-foreground leading-tight">
                  {atendente.nome}
                </div>
                <div className="flex flex-col text-[10px] text-muted-foreground leading-tight gap-0.5">
                  <span>{atendente.atendimentos} atend.</span>
                  <span>TMA: {atendente.tma}</span>
                  <span>NPS: {atendente.nps}</span>
                </div>
              </div>
            </div>
          </TooltipTrigger>
          <TooltipContent>
            <p>{atendente.nomeCompleto}</p>
          </TooltipContent>
        </Tooltip>
      ))}
    </div>
  );
};
