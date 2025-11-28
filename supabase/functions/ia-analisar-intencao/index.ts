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

    const { texto, paciente_id, conversa_id } = await req.json();

    if (!texto) {
      return new Response(
        JSON.stringify({ erro: 'Texto é obrigatório' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    
    const prompt = `Analise a seguinte mensagem de um paciente e identifique:
1. Intenção principal (agendamento, orçamento, dúvida sobre convênio, reclamação, etc)
2. Intenções secundárias se houver
3. Nível de urgência (normal, alta, crítica)
4. Tipo de procedimento mencionado
5. Dados importantes como nome, CPF, telefone, convênio

Responda APENAS com um JSON válido neste formato:
{
  "intencao_principal": "string",
  "intencoes_secundarias": ["string"],
  "nivel_urgencia": "normal|alta|critica",
  "tipo_procedimento": "string ou null",
  "dados_extraidos": {
    "nome": "string ou null",
    "cpf": "string ou null",
    "telefone": "string ou null",
    "convenio": "string ou null"
  },
  "confianca": 0.0-1.0
}

Mensagem do paciente: "${texto}"`;

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
            content: 'Você é um assistente especializado em análise de mensagens para atendimento médico. Sempre responda apenas com JSON válido.'
          },
          { role: 'user', content: prompt }
        ],
        temperature: 0.3,
      }),
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error('AI Gateway error:', aiResponse.status, errorText);
      return new Response(
        JSON.stringify({ erro: 'Erro ao processar análise de IA' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const aiData = await aiResponse.json();
    const analiseTexto = aiData.choices[0].message.content;
    
    // Extrair JSON da resposta
    const jsonMatch = analiseTexto.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      throw new Error('Resposta da IA não contém JSON válido');
    }
    
    const analise = JSON.parse(jsonMatch[0]);

    // Salvar análise no banco
    const { data: analiseData, error: analiseError } = await supabaseClient
      .from('ia_analise_intencao')
      .insert({
        paciente_id,
        conversa_id,
        texto_analisado: texto,
        intencao_principal: analise.intencao_principal,
        intencoes_secundarias: analise.intencoes_secundarias || [],
        nivel_urgencia: analise.nivel_urgencia,
        tipo_procedimento: analise.tipo_procedimento,
        dados_extraidos: analise.dados_extraidos,
        confianca: analise.confianca,
      })
      .select()
      .single();

    if (analiseError) throw analiseError;

    return new Response(
      JSON.stringify({ 
        success: true,
        analise: analiseData
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
