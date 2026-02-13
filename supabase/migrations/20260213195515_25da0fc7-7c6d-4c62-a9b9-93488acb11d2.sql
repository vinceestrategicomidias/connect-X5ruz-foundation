
-- Add reopening tracking columns to leads_funil
ALTER TABLE public.leads_funil 
ADD COLUMN IF NOT EXISTS historico_reaberturas jsonb DEFAULT '[]'::jsonb,
ADD COLUMN IF NOT EXISTS reaberto_por_id uuid REFERENCES public.atendentes(id),
ADD COLUMN IF NOT EXISTS reaberto_em timestamp with time zone;
