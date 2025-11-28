import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const { conversa_id, contexto } = await req.json();

    // Buscar histórico da conversa
    const { data: mensagens } = await supabaseClient
      .from('mensagens')
      .select('*')
      .eq('conversa_id', conversa_id)
      .order('created_at', { ascending: true })
      .limit(10);

    const historico = mensagens?.map(m => `${m.autor}: ${m.texto}`).join('\n') || '';

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const prompt = `Com base no histórico da conversa, sugira 3 respostas adequadas para o atendente usar:

Histórico da conversa:
${historico}

Contexto adicional: ${contexto || 'Atendimento médico hospitalar'}

Gere respostas profissionais, empáticas e úteis. Responda APENAS com JSON:
{
  "sugestoes": [
    {
      "texto": "string",
      "tipo": "informativa|procedimento|empatica|administrativa",
      "confianca": 0.0-1.0
    }
  ]
}`;

    const aiResponse = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash',
        messages: [
          {
            role: 'system',
            content: 'Você é um assistente especializado em atendimento médico hospitalar. Sempre seja profissional, empático e claro. Responda apenas com JSON válido.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.7,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ erro: 'Erro ao gerar sugestões' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const sugestoesTexto = aiData.choices[0].message.content;
    
    const jsonMatch = sugestoesTexto.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Resposta da IA não contém JSON válido');
    }
    
    const resultado = JSON.parse(jsonMatch[0]);

    return new Response(
      JSON.stringify({ 
        success: true,
        sugestoes: resultado.sugestoes
      }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro desconhecido';
    return new Response(
      JSON.stringify({ erro: errorMessage }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
