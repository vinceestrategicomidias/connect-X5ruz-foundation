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

    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ erro: 'Token de autenticação necessário' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');
    
    const { data: apiConfig } = await supabaseClient
      .from('api_config')
      .select('*')
      .eq('api_key', apiKey)
      .single();

    if (!apiConfig) {
      return new Response(
        JSON.stringify({ erro: 'API Key inválida' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const body = await req.json();

    if (!body.atendimento_id || !body.mensagem) {
      return new Response(
        JSON.stringify({ erro: 'Campos obrigatórios: atendimento_id, mensagem' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Criar mensagem
    const { data: mensagem, error: mensagemError } = await supabaseClient
      .from('mensagens')
      .insert({
        conversa_id: body.atendimento_id,
        texto: body.mensagem,
        tipo: body.tipo || 'texto',
        autor: 'Sistema',
        horario: new Date().toISOString(),
      })
      .select()
      .single();

    if (mensagemError) throw mensagemError;

    // Atualizar última mensagem do paciente
    const { data: conversa } = await supabaseClient
      .from('conversas')
      .select('paciente_id')
      .eq('id', body.atendimento_id)
      .single();

    if (conversa) {
      await supabaseClient
        .from('pacientes')
        .update({ ultima_mensagem: body.mensagem })
        .eq('id', conversa.paciente_id);
    }

    // Disparar webhook
    await triggerWebhook(supabaseClient, apiConfig.empresa_id, 'nova_mensagem', {
      atendimento_id: body.atendimento_id,
      mensagem: body.mensagem,
      tipo: body.tipo || 'texto',
      horario: new Date().toISOString(),
    });

    return new Response(
      JSON.stringify({ 
        status: 'mensagem_enviada',
        mensagem_id: mensagem.id,
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
