import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  const startTime = Date.now();
  
  try {
    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_SERVICE_ROLE_KEY') ?? ''
    );

    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ erro: 'Token de autenticação necessário' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');
    
    const { data: apiConfig, error: apiError } = await supabaseClient
      .from('api_config')
      .select('*')
      .eq('api_key', apiKey)
      .single();

    if (apiError || !apiConfig) {
      return new Response(
        JSON.stringify({ erro: 'API Key inválida' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();

    if (!body.paciente_id) {
      return new Response(
        JSON.stringify({ erro: 'Campo obrigatório: paciente_id' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se paciente existe
    const { data: paciente, error: pacienteError } = await supabaseClient
      .from('pacientes')
      .select('*')
      .eq('id', body.paciente_id)
      .single();

    if (pacienteError || !paciente) {
      return new Response(
        JSON.stringify({ erro: 'Paciente não encontrado' }),
        { status: 404, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar setor se fornecido
    let setorId = paciente.setor_id;
    if (body.setor) {
      const { data: setor } = await supabaseClient
        .from('setores')
        .select('id')
        .eq('nome', body.setor)
        .single();
      if (setor) setorId = setor.id;
    }

    // Criar conversa
    const { data: conversa, error: conversaError } = await supabaseClient
      .from('conversas')
      .insert({
        paciente_id: body.paciente_id,
      })
      .select()
      .single();

    if (conversaError) throw conversaError;

    // Atualizar status do paciente
    await supabaseClient
      .from('pacientes')
      .update({ 
        status: 'em_atendimento',
        setor_id: setorId,
      })
      .eq('id', body.paciente_id);

    // Disparar webhook
    await triggerWebhook(supabaseClient, apiConfig.empresa_id, 'inicio_atendimento', {
      atendimento_id: conversa.id,
      paciente_id: body.paciente_id,
      paciente_nome: paciente.nome,
      origem: body.origem || 'API',
    });

    return new Response(
      JSON.stringify({ 
        status: 'iniciado', 
        atendimento_id: conversa.id,
        paciente: paciente.nome,
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

async function triggerWebhook(supabase: any, empresaId: string, evento: string, dados: any) {
  const { data: webhooks } = await supabase
    .from('webhooks')
    .select('*')
    .eq('empresa_id', empresaId)
    .eq('evento', evento)
    .eq('ativo', true);

  if (!webhooks || webhooks.length === 0) return;

  for (const webhook of webhooks) {
    try {
      await fetch(webhook.url_destino, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Webhook-Secret': webhook.secret || '',
        },
        body: JSON.stringify({
          evento,
          data: dados,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (error) {
      console.error('Webhook error:', error);
    }
  }
}
