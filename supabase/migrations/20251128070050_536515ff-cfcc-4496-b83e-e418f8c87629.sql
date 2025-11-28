-- Criar bucket público para avatares da IA
INSERT INTO storage.buckets (id, name, public, file_size_limit, allowed_mime_types)
VALUES (
  'thali-avatar',
  'thali-avatar',
  true,
  2097152, -- 2MB limit
  ARRAY['image/png', 'image/jpeg', 'image/webp']
)
ON CONFLICT (id) DO NOTHING;

-- Política para permitir leitura pública do avatar da Thalí
CREATE POLICY "Avatar da Thalí é público"
ON storage.objects FOR SELECT
USING (bucket_id = 'thali-avatar');

-- Política para permitir upload do avatar (apenas funções autorizadas)
CREATE POLICY "Sistema pode fazer upload do avatar"
ON storage.objects FOR INSERT
WITH CHECK (bucket_id = 'thali-avatar');