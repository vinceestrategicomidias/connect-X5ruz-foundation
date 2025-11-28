import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from "https://esm.sh/@supabase/supabase-js@2.39.3";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

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

    // Verificar se o avatar já existe
    const { data: existingFiles } = await supabaseAdmin.storage
      .from('thali-avatar')
      .list();

    if (existingFiles && existingFiles.length > 0) {
      const { data: publicData } = supabaseAdmin.storage
        .from('thali-avatar')
        .getPublicUrl(existingFiles[0].name);
      
      console.log("Avatar já existe, retornando URL existente");
      return new Response(
        JSON.stringify({ avatarUrl: publicData.publicUrl }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    console.log("Gerando avatar da Thalí com IA...");

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
            content: "Professional avatar portrait of a friendly female AI assistant named Thalí. Young adult woman (25-30 years old), fair white skin, medium brown curly hair at medium length with natural soft waves, warm brown eyes with an attentive and empathetic expression, subtle gentle smile without showing teeth. Slightly oval face shape, trustworthy and welcoming appearance. Modern digital assistant aesthetic, clean and professional style. Neutral gradient background suitable for circular cropping. High quality, 1:1 aspect ratio, front-facing portrait view, suitable for small circular icons. Ultra high resolution."
          }
        ],
        modalities: ["image", "text"]
      })
    });

    if (!aiResponse.ok) {
      const errorText = await aiResponse.text();
      console.error("Erro na API de IA:", aiResponse.status, errorText);
      throw new Error(`AI API error: ${aiResponse.status}`);
    }

    const aiData = await aiResponse.json();
    const imageUrl = aiData.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      throw new Error("Nenhuma imagem foi gerada pela IA");
    }

    console.log("Imagem gerada com sucesso, fazendo upload para storage...");

    // Converter base64 para blob
    const base64Data = imageUrl.split(',')[1];
    const imageBlob = Uint8Array.from(atob(base64Data), c => c.charCodeAt(0));

    // Upload para o storage
    const fileName = `thali-avatar-${Date.now()}.png`;
    const { data: uploadData, error: uploadError } = await supabaseAdmin.storage
      .from('thali-avatar')
      .upload(fileName, imageBlob, {
        contentType: 'image/png',
        upsert: false
      });

    if (uploadError) {
      console.error("Erro no upload:", uploadError);
      throw uploadError;
    }

    console.log("Upload concluído:", uploadData);

    // Obter URL pública
    const { data: publicData } = supabaseAdmin.storage
      .from('thali-avatar')
      .getPublicUrl(fileName);

    return new Response(
      JSON.stringify({ 
        avatarUrl: publicData.publicUrl,
        message: "Avatar da Thalí gerado e armazenado com sucesso!"
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error("Erro ao gerar avatar:", error);
    return new Response(
      JSON.stringify({ error: error instanceof Error ? error.message : 'Erro desconhecido' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});