import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { expressao, contexto, nome } = await req.json();
    
    if (!expressao || !nome) {
      return new Response(
        JSON.stringify({ error: 'Expressão e nome são obrigatórios' }),
        { status: 400, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log('Gerando figurinha da Thalí:', { expressao, contexto, nome });

    const LOVABLE_API_KEY = Deno.env.get('LOVABLE_API_KEY');
    if (!LOVABLE_API_KEY) {
      throw new Error('LOVABLE_API_KEY não configurada');
    }

    // Criar prompt detalhado para gerar a figurinha da Thalí
    const prompt = `Create a cute sticker-style illustration of Thalí, a friendly AI healthcare assistant with purple/violet theme colors. 
Expression: ${expressao}
Context: ${contexto || 'Healthcare assistant'}
Style: Kawaii/chibi character design, bright colors, transparent background suitable for a sticker, expressive face, professional healthcare setting elements.
The character should be welcoming and approachable, with a modern tech aesthetic mixed with healthcare professionalism.
Size: 512x512px, sticker format with transparent background.`;

    console.log('Prompt gerado:', prompt);

    // Chamar Lovable AI para gerar a imagem
    const response = await fetch('https://ai.gateway.lovable.dev/v1/chat/completions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${LOVABLE_API_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'google/gemini-2.5-flash-image-preview',
        messages: [
          {
            role: 'user',
            content: prompt
          }
        ],
        modalities: ['image', 'text']
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Erro na API Lovable AI:', response.status, errorText);
      
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: 'Limite de requisições excedido. Tente novamente em alguns instantes.' }),
          { status: 429, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }
      
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: 'Créditos insuficientes. Adicione créditos em Settings → Workspace → Usage.' }),
          { status: 402, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
        );
      }

      throw new Error(`Erro na API: ${response.status} - ${errorText}`);
    }

    const data = await response.json();
    console.log('Resposta recebida da API');

    const imageBase64 = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;
    
    if (!imageBase64) {
      console.error('Resposta da API sem imagem:', JSON.stringify(data));
      throw new Error('Nenhuma imagem foi gerada');
    }

    // Extrair apenas o base64 (remover o prefixo data:image/png;base64,)
    const base64Data = imageBase64.split(',')[1] || imageBase64;
    
    // Converter base64 para blob
    const binaryString = atob(base64Data);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    console.log('Imagem convertida, iniciando upload...');

    // Inicializar cliente Supabase
    const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
    const supabaseServiceKey = Deno.env.get('SUPABASE_SERVICE_ROLE_KEY')!;
    const supabase = createClient(supabaseUrl, supabaseServiceKey);

    // Upload para storage
    const fileName = `thali_${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from('figurinhas')
      .upload(fileName, bytes, {
        contentType: 'image/png',
        cacheControl: '3600',
        upsert: false
      });

    if (uploadError) {
      console.error('Erro ao fazer upload:', uploadError);
      throw uploadError;
    }

    console.log('Upload realizado:', uploadData);

    // Obter URL pública
    const { data: { publicUrl } } = supabase.storage
      .from('figurinhas')
      .getPublicUrl(fileName);

    console.log('URL pública:', publicUrl);

    // Buscar pacote Thalí
    const { data: pacote, error: pacoteError } = await supabase
      .from('pacotes_figurinhas')
      .select('id')
      .eq('tipo', 'thali')
      .single();

    if (pacoteError || !pacote) {
      console.error('Erro ao buscar pacote Thalí:', pacoteError);
      throw new Error('Pacote Thalí não encontrado');
    }

    // Registrar figurinha no banco
    const { data: figurinha, error: dbError } = await supabase
      .from('figurinhas')
      .insert({
        pacote_id: pacote.id,
        nome,
        descricao: `${expressao} - ${contexto || 'Gerado com IA'}`,
        url_imagem: publicUrl,
        tags: [expressao, 'thali', 'ai-generated'],
      })
      .select()
      .single();

    if (dbError) {
      console.error('Erro ao salvar no banco:', dbError);
      // Tentar limpar arquivo
      await supabase.storage.from('figurinhas').remove([fileName]);
      throw dbError;
    }

    console.log('Figurinha criada com sucesso:', figurinha.id);

    return new Response(
      JSON.stringify({ 
        success: true,
        figurinha,
        message: 'Figurinha da Thalí gerada com sucesso!'
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Erro na função:', error);
    const errorMessage = error instanceof Error ? error.message : 'Erro ao gerar figurinha';
    const errorDetails = error instanceof Error ? error.toString() : String(error);
    
    return new Response(
      JSON.stringify({ 
        error: errorMessage,
        details: errorDetails
      }),
      { 
        status: 500, 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' } 
      }
    );
  }
});
