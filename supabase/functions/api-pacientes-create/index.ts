import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

interface CreatePacienteRequest {
  nome: string;
  cpf?: string;
  telefone: string;
  email?: string;
  unidade?: string;
  setor_inicial?: string;
}

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

    // Verificar autenticação via Bearer Token
    const authHeader = req.headers.get('Authorization');
    if (!authHeader?.startsWith('Bearer ')) {
      return new Response(
        JSON.stringify({ erro: 'Token de autenticação necessário' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const apiKey = authHeader.replace('Bearer ', '');
    
    // Validar API Key
    const { data: apiConfig, error: apiError } = await supabaseClient
      .from('api_config')
      .select('*')
      .eq('api_key', apiKey)
      .single();

    if (apiError || !apiConfig) {
      await logRequest(supabaseClient, null, '/api/pacientes/create', 'POST', 401, Date.now() - startTime, req);
      return new Response(
        JSON.stringify({ erro: 'API Key inválida' }),
        { status: 401, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar rate limit
    const rateLimitOk = await checkRateLimit(supabaseClient, apiConfig.id);
    if (!rateLimitOk) {
      await logRequest(supabaseClient, apiConfig.id, '/api/pacientes/create', 'POST', 429, Date.now() - startTime, req);
      return new Response(
        JSON.stringify({ erro: 'Limite de requisições excedido' }),
        { 
          status: 429, 
          headers: { 
            ...corsHeaders, 
            'Content-Type': 'application/json',
            'Retry-After': '60'
          } 
        }
      );
    }

    const body: CreatePacienteRequest = await req.json();

    // Validar campos obrigatórios
    if (!body.nome || !body.telefone) {
      await logRequest(supabaseClient, apiConfig.id, '/api/pacientes/create', 'POST', 400, Date.now() - startTime, req, body);
      return new Response(
        JSON.stringify({ erro: 'Campos obrigatórios: nome, telefone' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Verificar se paciente já existe
    const { data: existente } = await supabaseClient
      .from('pacientes')
      .select('id')
      .eq('telefone', body.telefone)
      .single();

    if (existente) {
      await logRequest(supabaseClient, apiConfig.id, '/api/pacientes/create', 'POST', 409, Date.now() - startTime, req, body);
      return new Response(
        JSON.stringify({ erro: 'Paciente já existente', paciente_id: existente.id }),
        { status: 409, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Buscar setor por nome se fornecido
    let setorId = null;
    if (body.setor_inicial) {
      const { data: setor } = await supabaseClient
        .from('setores')
        .select('id')
        .eq('nome', body.setor_inicial)
        .single();
      setorId = setor?.id;
    }

    // Criar paciente
    const { data: paciente, error: createError } = await supabaseClient
      .from('pacientes')
      .insert({
        nome: body.nome,
        telefone: body.telefone,
        status: 'fila',
        setor_id: setorId,
        avatar: `https://ui-avatars.com/api/?name=${encodeURIComponent(body.nome)}&background=random`,
      })
      .select()
      .single();

    if (createError) {
      await logRequest(supabaseClient, apiConfig.id, '/api/pacientes/create', 'POST', 500, Date.now() - startTime, req, body);
      throw createError;
    }

    await logRequest(supabaseClient, apiConfig.id, '/api/pacientes/create', 'POST', 200, Date.now() - startTime, req, body);

    // Disparar webhook se configurado
    await triggerWebhook(supabaseClient, apiConfig.empresa_id, 'novo_paciente', {
      paciente_id: paciente.id,
      nome: paciente.nome,
      telefone: paciente.telefone,
    });

    return new Response(
      JSON.stringify({ 
        status: 'sucesso', 
        paciente_id: paciente.id,
        dados: paciente
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

async function checkRateLimit(supabase: any, apiKeyId: string): Promise<boolean> {
  const currentMinute = new Date();
  currentMinute.setSeconds(0, 0);

  const { data, error } = await supabase
    .from('api_rate_limits')
    .select('contador')
    .eq('api_key_id', apiKeyId)
    .eq('minuto', currentMinute.toISOString())
    .single();

  if (error && error.code !== 'PGRST116') {
    return false;
  }

  const currentCount = data?.contador || 0;

  if (currentCount >= 1000) {
    return false;
  }

  await supabase
    .from('api_rate_limits')
    .upsert({
      api_key_id: apiKeyId,
      minuto: currentMinute.toISOString(),
      contador: currentCount + 1,
    });

  return true;
}

async function logRequest(
  supabase: any, 
  apiKeyId: string | null, 
  endpoint: string, 
  metodo: string, 
  statusCode: number, 
  tempoResposta: number,
  req: Request,
  payload?: any
) {
  await supabase.from('api_logs').insert({
    api_key_id: apiKeyId,
    endpoint,
    metodo,
    ip_origem: req.headers.get('x-forwarded-for') || 'unknown',
    status_code: statusCode,
    tempo_resposta_ms: tempoResposta,
    payload_resumido: payload ? { resumo: JSON.stringify(payload).substring(0, 500) } : null,
    user_agent: req.headers.get('user-agent'),
  });
}

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

      await supabase
        .from('webhooks')
        .update({ ultima_tentativa: new Date().toISOString(), tentativas_falhas: 0 })
        .eq('id', webhook.id);
    } catch (error) {
      await supabase
        .from('webhooks')
        .update({ 
          ultima_tentativa: new Date().toISOString(),
          tentativas_falhas: webhook.tentativas_falhas + 1,
        })
        .eq('id', webhook.id);
    }
  }
}
