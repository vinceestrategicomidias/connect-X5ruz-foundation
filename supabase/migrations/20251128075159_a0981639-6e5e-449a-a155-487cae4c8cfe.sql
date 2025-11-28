-- Criar pacote de figurinhas da Thalí se não existir
INSERT INTO public.pacotes_figurinhas (tipo, nome, descricao, ativo)
VALUES (
  'thali',
  'Thalí - Assistente IA',
  'Pacote exclusivo de figurinhas da Thalí, a assistente de IA do Grupo Liruz',
  true
)
ON CONFLICT DO NOTHING;

-- Gerar 5 figurinhas iniciais da Thalí
DO $$
DECLARE
  v_pacote_id uuid;
BEGIN
  -- Buscar o ID do pacote Thalí
  SELECT id INTO v_pacote_id 
  FROM public.pacotes_figurinhas 
  WHERE tipo = 'thali' 
  LIMIT 1;

  -- Inserir figurinha: Feliz
  INSERT INTO public.figurinhas (
    pacote_id, 
    nome, 
    descricao, 
    url_imagem, 
    tags, 
    ordem
  )
  SELECT 
    v_pacote_id,
    'Thalí Feliz',
    'feliz - Thalí com expressão alegre e acolhedora',
    'https://gcynyoxblhocmaewvqin.supabase.co/storage/v1/object/public/figurinhas/thali_feliz_initial.png',
    ARRAY['feliz', 'thali', 'ai-generated'],
    1
  WHERE NOT EXISTS (
    SELECT 1 FROM public.figurinhas 
    WHERE pacote_id = v_pacote_id AND nome = 'Thalí Feliz'
  );

  -- Inserir figurinha: Pensativa
  INSERT INTO public.figurinhas (
    pacote_id, 
    nome, 
    descricao, 
    url_imagem, 
    tags, 
    ordem
  )
  SELECT 
    v_pacote_id,
    'Thalí Pensativa',
    'pensativa - Thalí analisando e processando informações',
    'https://gcynyoxblhocmaewvqin.supabase.co/storage/v1/object/public/figurinhas/thali_pensativa_initial.png',
    ARRAY['pensativa', 'thali', 'ai-generated'],
    2
  WHERE NOT EXISTS (
    SELECT 1 FROM public.figurinhas 
    WHERE pacote_id = v_pacote_id AND nome = 'Thalí Pensativa'
  );

  -- Inserir figurinha: Animada
  INSERT INTO public.figurinhas (
    pacote_id, 
    nome, 
    descricao, 
    url_imagem, 
    tags, 
    ordem
  )
  SELECT 
    v_pacote_id,
    'Thalí Animada',
    'animada - Thalí empolgada para ajudar',
    'https://gcynyoxblhocmaewvqin.supabase.co/storage/v1/object/public/figurinhas/thali_animada_initial.png',
    ARRAY['animada', 'thali', 'ai-generated'],
    3
  WHERE NOT EXISTS (
    SELECT 1 FROM public.figurinhas 
    WHERE pacote_id = v_pacote_id AND nome = 'Thalí Animada'
  );

  -- Inserir figurinha: Atenta
  INSERT INTO public.figurinhas (
    pacote_id, 
    nome, 
    descricao, 
    url_imagem, 
    tags, 
    ordem
  )
  SELECT 
    v_pacote_id,
    'Thalí Atenta',
    'atenta - Thalí prestando atenção aos detalhes',
    'https://gcynyoxblhocmaewvqin.supabase.co/storage/v1/object/public/figurinhas/thali_atenta_initial.png',
    ARRAY['atenta', 'thali', 'ai-generated'],
    4
  WHERE NOT EXISTS (
    SELECT 1 FROM public.figurinhas 
    WHERE pacote_id = v_pacote_id AND nome = 'Thalí Atenta'
  );

  -- Inserir figurinha: Aprovação
  INSERT INTO public.figurinhas (
    pacote_id, 
    nome, 
    descricao, 
    url_imagem, 
    tags, 
    ordem
  )
  SELECT 
    v_pacote_id,
    'Thalí Aprovação',
    'aprovação - Thalí dando sinal positivo',
    'https://gcynyoxblhocmaewvqin.supabase.co/storage/v1/object/public/figurinhas/thali_aprovacao_initial.png',
    ARRAY['aprovação', 'thali', 'ai-generated'],
    5
  WHERE NOT EXISTS (
    SELECT 1 FROM public.figurinhas 
    WHERE pacote_id = v_pacote_id AND nome = 'Thalí Aprovação'
  );
END $$;