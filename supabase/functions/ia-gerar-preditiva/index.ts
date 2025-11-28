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

    const { unidade_id } = await req.json();

    // Buscar dados históricos dos últimos 30 dias
    const dataInicio = new Date();
    dataInicio.setDate(dataInicio.getDate() - 30);

    const { data: historicoMensagens } = await supabaseClient
      .from('mensagens')
      .select('created_at, conversa_id')
      .gte('created_at', dataInicio.toISOString());

    const { data: historicoAtendimentos } = await supabaseClient
      .from('conversas')
      .select('created_at, updated_at')
      .gte('created_at', dataInicio.toISOString());

    // Preparar dados para análise
    const dadosHistoricos = {
      total_mensagens: historicoMensagens?.length || 0,
      total_atendimentos: historicoAtendimentos?.length || 0,
      media_diaria: Math.round((historicoMensagens?.length || 0) / 30),
      dia_semana_atual: new Date().getDay(),
    };

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const prompt = `Com base nos dados históricos dos últimos 30 dias, faça uma previsão para hoje:

Dados históricos:
- Total mensagens (30 dias): ${dadosHistoricos.total_mensagens}
- Média diária: ${dadosHistoricos.media_diaria}
- Dia da semana atual: ${dadosHistoricos.dia_semana_atual}

Preveja e responda APENAS com JSON:
{
  "volume_esperado_hoje": número_inteiro,
  "horarios_pico": [{"inicio": "HH:MM", "fim": "HH:MM", "intensidade": "baixa|media|alta"}],
  "setores_alta_demanda": [{"setor": "string", "previsao_volume": número}],
  "risco_sla": "baixo|medio|alto",
  "recomendacoes": ["string"],
  "confianca": 0.0-1.0
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
            content: 'Você é um especialista em análise preditiva de atendimento médico. Sempre responda apenas com JSON válido.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.5,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ erro: 'Erro ao processar previsão' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const previsaoTexto = aiData.choices[0].message.content;
    
    const jsonMatch = previsaoTexto.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Resposta da IA não contém JSON válido');
    }
    
    const previsao = JSON.parse(jsonMatch[0]);

    // Salvar previsão no banco
    const { data: preditiva, error: preditivaError } = await supabaseClient
      .from('ia_preditiva')
      .insert({
        unidade_id,
        data_previsao: new Date().toISOString().split('T')[0],
        volume_esperado: previsao.volume_esperado_hoje,
        horarios_pico: previsao.horarios_pico,
        setores_alta_demanda: previsao.setores_alta_demanda,
        risco_sla: previsao.risco_sla,
        recomendacoes: previsao.recomendacoes,
        acuracia_anterior: previsao.confianca * 100,
      })
      .select()
      .single();

    if (preditivaError) throw preditivaError;

    return new Response(
      JSON.stringify({ 
        success: true,
        preditiva
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
