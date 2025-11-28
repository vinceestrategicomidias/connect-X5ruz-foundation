import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const expressions = [
  {
    name: 'neutral',
    prompt: 'Professional avatar portrait of a friendly female AI assistant named Thalí. Young adult woman (25-30 years old), fair white skin, medium brown curly hair at medium length with natural soft waves, warm brown eyes with a neutral, attentive and professional expression, subtle gentle smile without showing teeth. Slightly oval face shape, trustworthy and welcoming appearance. Modern digital assistant aesthetic, clean and professional style. Neutral gradient background suitable for circular cropping. High quality, 1:1 aspect ratio, front-facing portrait view. Ultra high resolution.'
  },
  {
    name: 'pensativa',
    prompt: 'Professional avatar portrait of a thoughtful female AI assistant named Thalí. Young adult woman (25-30 years old), fair white skin, medium brown curly hair at medium length with natural soft waves, warm brown eyes with a thoughtful, analytical and concentrated expression, lips slightly pursed in contemplation without showing teeth. Slightly oval face shape, intelligent and focused appearance. Modern digital assistant aesthetic, clean and professional style. Neutral gradient background suitable for circular cropping. High quality, 1:1 aspect ratio, front-facing portrait view. Ultra high resolution.'
  },
  {
    name: 'alertando',
    prompt: 'Professional avatar portrait of an alert female AI assistant named Thalí. Young adult woman (25-30 years old), fair white skin, medium brown curly hair at medium length with natural soft waves, warm brown eyes with a serious, concerned and attentive expression showing urgency, eyebrows slightly raised, lips in a focused expression without showing teeth. Slightly oval face shape, alert and professional appearance. Modern digital assistant aesthetic, clean and professional style. Neutral gradient background suitable for circular cropping. High quality, 1:1 aspect ratio, front-facing portrait view. Ultra high resolution.'
  },
  {
    name: 'feliz',
    prompt: 'Professional avatar portrait of a happy female AI assistant named Thalí. Young adult woman (25-30 years old), fair white skin, medium brown curly hair at medium length with natural soft waves, warm brown eyes with a joyful, warm and positive expression, genuine warm smile without showing teeth, eyes slightly crinkled with happiness. Slightly oval face shape, friendly and approachable appearance. Modern digital assistant aesthetic, clean and professional style. Neutral gradient background suitable for circular cropping. High quality, 1:1 aspect ratio, front-facing portrait view. Ultra high resolution.'
  }
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    const SUPABASE_URL = Deno.env.get("SUPABASE_URL");
    const SUPABASE_SERVICE_ROLE_KEY = Deno.env.get("SUPABASE_SERVICE_ROLE_KEY");

    if (!LOVABLE_API_KEY || !SUPABASE_URL || !SUPABASE_SERVICE_ROLE_KEY) {
      throw new Error("Missing required environment variables");
    }

    const supabaseAdmin = createClient(SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY);

    // Limpar arquivos antigos sem formato de expressão
    const { data: allFiles } = await supabaseAdmin.storage
      .from('thali-avatar')
      .list();
    
    if (allFiles) {
      const oldFiles = allFiles.filter(file => 
        file.name.match(/^thali-avatar-\d+\.png$/) // Formato antigo sem expressão
      );
      
      if (oldFiles.length > 0) {
        console.log(`Removendo ${oldFiles.length} arquivos antigos...`);
        await supabaseAdmin.storage
          .from('thali-avatar')
          .remove(oldFiles.map(f => f.name));
      }
    }

    // Verificar expressões já existentes
    const { data: existingFiles } = await supabaseAdmin.storage
      .from('thali-avatar')
      .list();

    const existingExpressions = existingFiles?.map(f => f.name.split('-')[2]?.split('.')[0]) || [];
    const results: { [key: string]: string } = {};

    console.log("Gerando expressões da Thalí...");

    for (const expression of expressions) {
      // Verificar se já existe
      if (existingExpressions.includes(expression.name)) {
        const existingFile = existingFiles?.find(f => f.name.includes(expression.name));
        if (existingFile) {
          const { data: publicData } = supabaseAdmin.storage
            .from('thali-avatar')
            .getPublicUrl(existingFile.name);
          results[expression.name] = publicData.publicUrl;
          console.log(`Expressão ${expression.name} já existe`);
          continue;
        }
      }

      console.log(`Gerando expressão: ${expression.name}`);

      // Gerar a imagem com Lovable AI
      const aiResponse = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${LOVABLE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          model: "google/gemini-2.5-flash-image-preview",
          messages: [
            {
              role: "user",
              content: expression.prompt
            }
          ],
          modalities: ["image", "text"]
        })
      });

      if (!aiResponse.ok) {
        const errorText = await aiResponse.text();
        console.error(`Erro ao gerar ${expression.name}:`, aiResponse.status, errorText);
        continue;
      }

      const aiData = await aiResponse.json();
      const imageUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

      if (!imageUrl) {
        console.error(`Nenhuma imagem gerada para ${expression.name}`);
        continue;
      }

      // Converter base64 para blob
      const base64Data = imageUrl.split(',')[1];
      const imageBlob = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

      // Upload para o storage
      const fileName = `thali-avatar-${expression.name}-${Date.now()}.png`;
      const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
        .from('thali-avatar')
        .upload(fileName, imageBlob, {
          contentType: 'image/png',
          upsert: false
        });

      if (uploadError) {
        console.error(`Erro no upload de ${expression.name}:`, uploadError);
        continue;
      }

      // Obter URL pública
      const { data: publicData } = supabaseAdmin.storage
        .from('thali-avatar')
        .getPublicUrl(fileName);

      results[expression.name] = publicData.publicUrl;
      console.log(`Expressão ${expression.name} gerada com sucesso`);

      // Aguardar um pouco entre as gerações para evitar rate limit
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    return new Response(
      JSON.stringify({ 
        expressions: results,
        message: `${Object.keys(results).length} expressões da Thalí disponíveis!`
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Erro ao gerar expressões:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});