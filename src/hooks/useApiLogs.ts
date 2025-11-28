import { useQuery } from "@tanstack/react-query";
import { supabase } from "@/integrations/supabase/client";

export interface ApiLog {
  id: string;
  api_key_id?: string;
  endpoint: string;
  metodo: string;
  ip_origem?: string;
  status_code?: number;
  tempo_resposta_ms?: number;
  payload_resumido?: any;
  user_agent?: string;
  created_at?: string;
}

export const useApiLogs = (limit: number = 100) => {
  return useQuery({
    queryKey: ["api_logs", limit],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_logs")
        .select("*")
        .order("created_at", { ascending: false })
        .limit(limit);

      if (error) throw error;
      return data as ApiLog[];
    },
  });
};

export const useApiStats = () => {
  return useQuery({
    queryKey: ["api_stats"],
    queryFn: async () => {
      const { data, error } = await supabase
        .from("api_logs")
        .select("endpoint, status_code, tempo_resposta_ms");

      if (error) throw error;

      // Calcular estatísticas
      const total = data.length;
      const sucessos = data.filter(log => log.status_code && log.status_code < 400).length;
      const erros = data.filter(log => log.status_code && log.status_code >= 400).length;
      const tempoMedio = data.reduce((acc, log) => acc + (log.tempo_resposta_ms || 0), 0) / total;

      const endpointStats = data.reduce((acc: any, log) => {
        if (!acc[log.endpoint]) {
          acc[log.endpoint] = { total: 0, sucessos: 0, erros: 0 };
        }
        acc[log.endpoint].total++;
        if (log.status_code && log.status_code < 400) {
          acc[log.endpoint].sucessos++;
        } else {
          acc[log.endpoint].erros++;
        }
        return acc;
      }, {});

      return {
        total,
        sucessos,
        erros,
        tempoMedio: Math.round(tempoMedio),
        taxaSucesso: Math.round((sucessos / total) * 100),
        porEndpoint: endpointStats,
      };
    },
  });
};
