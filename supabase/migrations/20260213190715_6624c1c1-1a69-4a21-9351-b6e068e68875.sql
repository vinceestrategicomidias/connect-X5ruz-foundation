
ALTER TABLE public.leads_funil ADD COLUMN perdido_por_id uuid REFERENCES public.atendentes(id);
