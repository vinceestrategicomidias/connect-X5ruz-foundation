import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers": "authorization, x-client-info, apikey, content-type",
};

serve(async (req) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { nome, genero } = await req.json();
    
    if (!nome) {
      return new Response(
        JSON.stringify({ error: "Nome é obrigatório" }),
        { status: 400, headers: { ...corsHeaders, "Content-Type": "application/json" } }
      );
    }

    const LOVABLE_API_KEY = Deno.env.get("LOVABLE_API_KEY");
    if (!LOVABLE_API_KEY) {
      throw new Error("LOVABLE_API_KEY não configurada");
    }

    // Determinar características baseadas no gênero ou nome
    const generoFinal = genero || inferirGenero(nome);
    
    const prompt = generoFinal === "feminino"
      ? `Professional headshot portrait of a Brazilian woman, age 25-45, warm friendly expression, natural lighting, clean background, photorealistic, high quality, suitable for profile picture. Do not include any text.`
      : `Professional headshot portrait of a Brazilian man, age 25-45, warm friendly expression, natural lighting, clean background, photorealistic, high quality, suitable for profile picture. Do not include any text.`;

    console.log(`Gerando avatar para ${nome} (${generoFinal})`);

    const response = await fetch("https://ai.gateway.lovable.dev/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${LOVABLE_API_KEY}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        model: "google/gemini-2.5-flash-image",
        messages: [
          {
            role: "user",
            content: prompt,
          },
        ],
        modalities: ["image", "text"],
      }),
    });

    if (!response.ok) {
      if (response.status === 429) {
        return new Response(
          JSON.stringify({ error: "Rate limit excedido, tente novamente mais tarde." }),
          { status: 429, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      if (response.status === 402) {
        return new Response(
          JSON.stringify({ error: "Créditos insuficientes, adicione créditos ao workspace." }),
          { status: 402, headers: { ...corsHeaders, "Content-Type": "application/json" } }
        );
      }
      const errorText = await response.text();
      console.error("Erro no gateway AI:", response.status, errorText);
      throw new Error(`Erro na API: ${response.status}`);
    }

    const data = await response.json();
    const imageUrl = data.choices?.[0]?.message?.images?.[0]?.image_url?.url;

    if (!imageUrl) {
      console.error("Resposta da API:", JSON.stringify(data));
      throw new Error("Nenhuma imagem foi gerada");
    }

    console.log(`Avatar gerado com sucesso para ${nome}`);

    return new Response(
      JSON.stringify({ 
        success: true, 
        avatarUrl: imageUrl,
        nome,
        genero: generoFinal,
      }),
      { headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );

  } catch (error: unknown) {
    console.error("Erro ao gerar avatar:", error);
    const errorMessage = error instanceof Error ? error.message : "Erro ao gerar avatar";
    return new Response(
      JSON.stringify({ error: errorMessage }),
      { status: 500, headers: { ...corsHeaders, "Content-Type": "application/json" } }
    );
  }
});

// Função simples para inferir gênero baseado em nomes comuns brasileiros
function inferirGenero(nome: string): "feminino" | "masculino" {
  const primeiroNome = nome.split(" ")[0].toLowerCase();
  
  const nomesFemininos = [
    "maria", "ana", "julia", "lucia", "lúcia", "vanessa", "patricia", "patrícia",
    "fernanda", "amanda", "camila", "bruna", "larissa", "beatriz", "carolina",
    "mariana", "gabriela", "leticia", "letícia", "aline", "juliana", "adriana",
    "paula", "sandra", "monica", "mônica", "renata", "simone", "carla", "denise",
    "cristina", "rosa", "helena", "tereza", "teresa", "francisca", "antonia",
    "antônia", "vitoria", "vitória", "isabela", "sophia", "sofia", "laura",
    "emilly", "emily", "geovana", "giovana", "paloma", "bianca"
  ];
  
  const nomesMasculinos = [
    "joao", "joão", "jose", "josé", "antonio", "antônio", "francisco", "carlos",
    "paulo", "pedro", "lucas", "marcos", "luis", "luís", "gabriel", "rafael",
    "daniel", "marcelo", "bruno", "eduardo", "felipe", "fernando", "rodrigo",
    "mario", "mário", "sergio", "sérgio", "jorge", "fabio", "fábio", "ricardo",
    "andre", "andré", "gustavo", "diego", "thiago", "tiago", "leandro", "matheus",
    "vitor", "victor", "henrique", "leonardo", "alex", "alessandro", "roberto"
  ];
  
  if (nomesFemininos.includes(primeiroNome)) {
    return "feminino";
  }
  
  if (nomesMasculinos.includes(primeiroNome)) {
    return "masculino";
  }
  
  // Heurística: nomes terminados em 'a' geralmente são femininos
  if (primeiroNome.endsWith("a") && !primeiroNome.endsWith("ia")) {
    return "feminino";
  }
  
  // Padrão: masculino
  return "masculino";
}
