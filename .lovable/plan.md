

## Plan: Move "Relatório de Equipe" into Reports Module with Date Filter and Customizable Indicators

### What changes

#### 1. `src/components/GestaoUnificada.tsx`
- **Remove** `relatorio_equipe` from the sidebar menu (`menuBlocks` line 308)
- **Remove** the `case "relatorio_equipe"` from `renderContent` (line 1895)
- **Add** a new entry in `relatorioCategories` array after "distribuicao" (line 1028):
  ```
  { id: "equipe", icon: Users, nome: "Relatório de Equipe", desc: "Produtividade individual com NPS, TMA, TME, conversão e visão da Thalí", indicadores: [...] }
  ```
  With indicators: NPS, TMA, TME, Ciclo de Venda, Conversão Comercial, Orçamentos Enviados, Histórico de Atendimentos, Ranking Radar, Ideias das Estrelas, Visão da Thalí
- **Add** `case "equipe"` inside `renderRelatorioDetalhe` to render the `RelatorioEquipePanel` component

#### 2. `src/components/RelatorioEquipePanel.tsx`
- **Add date filter** using `DateRangeFilter` component (already exists in the project) alongside the sector/attendant selectors
- **Add "Personalizar Indicadores" checkboxes** — a list of toggleable sections so management can choose which blocks appear in the report:
  - NPS, TMA, TME, Ciclo de Venda, Conversão Comercial, Histórico de Atendimentos, Ranking Radar vs Equipe, Ideias das Estrelas, Visão da Thalí
- Each section in the report body will only render if its corresponding checkbox is enabled
- All checkboxes default to checked

### Technical Details
- The `RelatorioEquipePanel` receives no props change — it already self-contains sector/attendant filters via hooks
- The date range state (`startDate`, `endDate`) will be added to the component's local state and displayed in the filter bar
- The customizable indicators will use a `Record<string, boolean>` state with toggle checkboxes rendered in a collapsible "Personalizar" popover button next to the filters

