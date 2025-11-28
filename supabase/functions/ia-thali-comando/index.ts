import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { comando, paciente } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    const comandosPrompts: Record<string, string> = {
      resumir: "Crie um resumo breve e objetivo da conversa com este paciente, destacando os pontos principais.",
      empatica: "Crie uma resposta empática e acolhedora para continuar este atendimento, demonstrando cuidado e compreensão.",
      objetiva: "Crie uma resposta direta e objetiva para avançar no atendimento, focando em próximos passos práticos.",
      ligacao: "Sugira quando e por que seria apropriado fazer uma ligação para este paciente, considerando o contexto.",
    };

    const promptBase = comandosPrompts[comando] || comandosPrompts.resumir;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          {
            role: "system",
            content: "Você é Thalí, assistente de IA do Grupo Liruz. Seja clara, empática e profissional.",
          },
          {
            role: "user",
            content: `${promptBase}\n\nPaciente: ${paciente.nome}\nStatus: ${paciente.status}\nÚltima mensagem: ${paciente.ultima_mensagem}`,
          },
        ],
      }),
    });

    if (!response.ok) {
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    const resposta = data.choices[0]?.message?.content || "";

    return new Response(JSON.stringify({ resposta }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("Erro:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : "Erro desconhecido" }),
      {
        status: 500,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      }
    );
  }
});
