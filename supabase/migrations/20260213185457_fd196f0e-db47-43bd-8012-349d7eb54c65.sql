
-- Add column to track who closed the sale (different from who sent the budget)
ALTER TABLE public.leads_funil ADD COLUMN fechado_por_id uuid REFERENCES public.atendentes(id);
