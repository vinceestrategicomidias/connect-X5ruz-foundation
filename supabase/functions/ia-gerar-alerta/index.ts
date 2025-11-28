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

    // Buscar configurações de IA
    const { data: configs } = await supabaseClient
      .from('ia_config')
      .select('*')
      .eq('ia_ativa', true)
      .eq('alertas_inteligentes_ativos', true);

    if (!configs || configs.length === 0) {
      return new Response(
        JSON.stringify({ message: 'Alertas inteligentes não estão ativos' }),
        { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    const config = configs[0];

    // Verificar fila alta
    const { data: pacientesFila } = await supabaseClient
      .from('pacientes')
      .select('id, setor_id')
      .eq('status', 'fila');

    if (pacientesFila && pacientesFila.length > config.limite_fila_alta) {
      await supabaseClient.from('ia_alertas').insert({
        tipo: 'fila_alta',
        severidade: 'warning',
        titulo: 'Fila em Alta',
        descricao: `Fila com ${pacientesFila.length} pacientes aguardando, acima do limite de ${config.limite_fila_alta}`,
        dados_contexto: { quantidade: pacientesFila.length, limite: config.limite_fila_alta },
        acao_recomendada: 'Realocar atendentes ou ativar modo de contingência',
        destinatarios: ['coordenacao', 'gestor'],
      });
    }

    // Verificar NPS baixo por atendente (simulado)
    const { data: atendentes } = await supabaseClient
      .from('atendentes')
      .select('id, nome')
      .limit(5);

    for (const atendente of atendentes || []) {
      const npsSimulado = Math.floor(Math.random() * 10);
      if (npsSimulado < config.limite_nps_baixo) {
        await supabaseClient.from('ia_alertas').insert({
          tipo: 'nps_baixo',
          severidade: 'info',
          titulo: 'NPS Baixo Detectado',
          descricao: `Atendente ${atendente.nome} com NPS ${npsSimulado}, abaixo do limite ${config.limite_nps_baixo}`,
          dados_contexto: { atendente_id: atendente.id, nps: npsSimulado, limite: config.limite_nps_baixo },
          acao_recomendada: 'Analisar padrão de atendimento e oferecer feedback',
          destinatarios: ['coordenacao'],
        });
      }
    }

    return new Response(
      JSON.stringify({ 
        success: true,
        message: 'Alertas processados com sucesso'
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
