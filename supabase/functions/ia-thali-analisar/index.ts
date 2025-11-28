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
    const { paciente, conversaTexto } = await req.json();
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");

    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    const systemPrompt = `Você é Thalí, uma assistente de IA especializada em atendimento ao cliente do Grupo Liruz.
Sua função é analisar conversas e fornecer sugestões inteligentes para os atendentes.

Analise o contexto da conversa e retorne um JSON com:
1. sentimento: classifique como "muito_positivo", "positivo", "neutro", "negativo" ou "muito_negativo"
2. sugestoes: array com 2-3 sugestões de resposta, cada uma com "texto" e "tipo" (empatica, objetiva ou pergunta)
3. resumo: um resumo breve da conversa (máximo 2 frases)
4. proximosPassos: array com 2-3 próximos passos recomendados

Seja empática, profissional e focada em resolver o problema do paciente.`;

    const userPrompt = `Paciente: ${paciente.nome}
Status: ${paciente.status}
Última mensagem: ${paciente.ultima_mensagem}

Histórico da conversa:
${conversaTexto || "Sem histórico disponível"}

Analise esta conversa e forneça suas recomendações.`;

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash",
        messages: [
          { role: "system", content: systemPrompt },
          { role: "user", content: userPrompt },
        ],
        tools: [
          {
            type: "function",
            function: {
              name: "analisar_contexto",
              description: "Retorna análise completa do contexto da conversa",
              parameters: {
                type: "object",
                properties: {
                  sentimento: {
                    type: "string",
                    enum: ["muito_positivo", "positivo", "neutro", "negativo", "muito_negativo"],
                  },
                  sugestoes: {
                    type: "array",
                    items: {
                      type: "object",
                      properties: {
                        texto: { type: "string" },
                        tipo: { type: "string", enum: ["empatica", "objetiva", "pergunta"] },
                      },
                      required: ["texto", "tipo"],
                    },
                  },
                  resumo: { type: "string" },
                  proximosPassos: {
                    type: "array",
                    items: { type: "string" },
                  },
                },
                required: ["sentimento", "sugestoes", "resumo", "proximosPassos"],
              },
            },
          },
        ],
        tool_choice: { type: "function", function: { name: "analisar_contexto" } },
      }),
    });

    if (!response.ok) {
      const error = await response.text();
      console.error("Erro da API:", error);
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    const toolCall = data.choices[0]?.message?.tool_calls?.[0];

    if (!toolCall) {
      throw new Error("Resposta inválida da IA");
    }

    const analise = JSON.parse(toolCall.function.arguments);

    return new Response(JSON.stringify(analise), {
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
