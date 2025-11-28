import { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Card } from "@/components/ui/card";
import {
  BarChart3,
  Phone,
  MessageSquare,
  Users,
  Clock,
  TrendingUp,
  Award,
} from "lucide-react";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useChamadas } from "@/hooks/useChamadas";
import { usePacientes } from "@/hooks/usePacientes";
import { supabase } from "@/integrations/supabase/client";

interface Metricas {
  totalChamadas: number;
  chamadasAtendidas: number;
  chamadasPerdidas: number;
  duracaoMedia: number;
  totalMensagens: number;
  pacientesFila: number;
  pacientesAtendimento: number;
}

export const DashboardProdutividade = () => {
  const { atendenteLogado, isCoordenacao } = useAtendenteContext();
  const { data: chamadas } = useChamadas(
    isCoordenacao ? undefined : atendenteLogado?.id,
    isCoordenacao ? atendenteLogado?.setor_id : undefined
  );
  const { data: pacientes } = usePacientes(undefined, atendenteLogado?.setor_id);
  const [metricas, setMetricas] = useState<Metricas>({
    totalChamadas: 0,
    chamadasAtendidas: 0,
    chamadasPerdidas: 0,
    duracaoMedia: 0,
    totalMensagens: 0,
    pacientesFila: 0,
    pacientesAtendimento: 0,
  });
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const calcularMetricas = async () => {
      const hoje = new Date();
      hoje.setHours(0, 0, 0, 0);

      const chamadasHoje = chamadas?.filter(
        (c) => new Date(c.horario_inicio) >= hoje
      ) || [];

      const atendidas = chamadasHoje.filter((c) => c.status === "atendida");
      const perdidas = chamadasHoje.filter((c) => c.status === "perdida");

      const duracaoTotal = atendidas.reduce((acc, c) => acc + (c.duracao || 0), 0);
      const duracaoMedia = atendidas.length > 0 ? duracaoTotal / atendidas.length : 0;

      // Contar mensagens do dia
      const { count: totalMensagens } = await supabase
        .from("mensagens")
        .select("*", { count: "exact", head: true })
        .gte("created_at", hoje.toISOString())
        .eq("autor", "atendente");

      const fila = pacientes?.filter((p) => p.status === "fila").length || 0;
      const emAtendimento =
        pacientes?.filter((p) => p.status === "em_atendimento").length || 0;

      setMetricas({
        totalChamadas: chamadasHoje.length,
        chamadasAtendidas: atendidas.length,
        chamadasPerdidas: perdidas.length,
        duracaoMedia: Math.floor(duracaoMedia),
        totalMensagens: totalMensagens || 0,
        pacientesFila: fila,
        pacientesAtendimento: emAtendimento,
      });
    };

    calcularMetricas();
  }, [chamadas, pacientes]);

  const formatarTempo = (segundos: number) => {
    const mins = Math.floor(segundos / 60);
    const segs = segundos % 60;
    return `${mins}m ${segs}s`;
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <BarChart3 className="h-4 w-4 mr-2" />
          Dashboard
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle>Dashboard de Produtividade</DialogTitle>
          <DialogDescription>
            Métricas de hoje - {atendenteLogado?.nome}
            {isCoordenacao && " (visão do setor)"}
          </DialogDescription>
        </DialogHeader>

        <ScrollArea className="h-[500px]">
          <div className="grid grid-cols-2 gap-4 p-1">
            {/* Total de Chamadas */}
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <Phone className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metricas.totalChamadas}</p>
                  <p className="text-sm text-muted-foreground">Total de Chamadas</p>
                </div>
              </div>
            </Card>

            {/* Chamadas Atendidas */}
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-success/10 rounded-lg">
                  <Phone className="h-5 w-5 text-success" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metricas.chamadasAtendidas}</p>
                  <p className="text-sm text-muted-foreground">Atendidas</p>
                </div>
              </div>
            </Card>

            {/* Chamadas Perdidas */}
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-destructive/10 rounded-lg">
                  <Phone className="h-5 w-5 text-destructive" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metricas.chamadasPerdidas}</p>
                  <p className="text-sm text-muted-foreground">Perdidas</p>
                </div>
              </div>
            </Card>

            {/* Duração Média */}
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-accent/10 rounded-lg">
                  <Clock className="h-5 w-5 text-accent" />
                </div>
                <div>
                  <p className="text-2xl font-bold">
                    {formatarTempo(metricas.duracaoMedia)}
                  </p>
                  <p className="text-sm text-muted-foreground">Duração Média</p>
                </div>
              </div>
            </Card>

            {/* Total de Mensagens */}
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <MessageSquare className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metricas.totalMensagens}</p>
                  <p className="text-sm text-muted-foreground">Mensagens Enviadas</p>
                </div>
              </div>
            </Card>

            {/* Pacientes na Fila */}
            <Card className="p-4">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-warning/10 rounded-lg">
                  <Users className="h-5 w-5 text-warning" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metricas.pacientesFila}</p>
                  <p className="text-sm text-muted-foreground">Na Fila</p>
                </div>
              </div>
            </Card>

            {/* Pacientes em Atendimento */}
            <Card className="p-4 col-span-2">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-primary/10 rounded-lg">
                  <TrendingUp className="h-5 w-5 text-primary" />
                </div>
                <div>
                  <p className="text-2xl font-bold">{metricas.pacientesAtendimento}</p>
                  <p className="text-sm text-muted-foreground">Em Atendimento</p>
                </div>
              </div>
            </Card>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
