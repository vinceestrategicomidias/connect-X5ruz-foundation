

## Plan: Fix Budget Sending, Date Filter, and Productivity Report

### Issues Identified

1. **Budget sending flow**: The `FunilClassificacaoModal` calls `onClassificar` on "Confirmar e enviar" which for "apenas_contato" immediately closes the modal AND sends the budget. The issue is that when "apenas_contato" is selected, `handleClassificacao` closes the modal and sends immediately -- but the user expects the modal to stay open until they explicitly click "Confirmar e Enviar", "Cancelar", or "X". Currently, the modal's `handleConfirmar` always fires `onClassificar` which always closes the modal via `setClassificacaoModalOpen(false)`. The real problem is the flow: clicking "Confirmar e enviar" in the classification modal should trigger the actual budget send to the chat. This seems to be working correctly based on the code. Let me re-read the user's complaint.

   The user says: "o orçamento, o template do orçamento deve ser enviado" -- the budget template must be sent. And for "apenas contato", the modal should only close on X, Cancelar, or Confirmar e Enviar. Looking at the code, when "apenas_contato" is selected, clicking "Confirmar e enviar" calls `onClassificar("apenas_contato")` which calls `handleClassificacao` -> closes modal -> calls `enviarOrcamentoDireto(undefined, true)`. This seems correct. The issue might be that the Dialog's `onOpenChange` also triggers close and resets `pendingEnvioOrcamento`, so clicking outside the modal cancels the send.

2. **DateRangeFilter**: The input field has `min-w-[220px]` but needs to be smaller and more compact within its container.

3. **Productivity report with sector-based attendant filtering**: The "Relatório Atendente" and "Completo Atendente" tabs have hardcoded attendant lists. Need to add sector filter that dynamically filters attendants. Also need to add sections for: Atendimentos, TMA, TME, NPS, Ciclo de Venda, Conversão Comercial, Histórico, Ideias das Estrelas, Ranking Radar, Visão da Thalí -- most of these already exist in the "Completo Atendente" tab but need to be present in the regular "Relatório Atendente" tab too.

### Changes

#### 1. `src/components/FunilClassificacaoModal.tsx`
- Ensure the modal only closes via explicit user actions (X, Cancelar, Confirmar e Enviar)
- Prevent closing by clicking outside (add `onInteractOutside` prevention on DialogContent)

#### 2. `src/components/RoteirosPanel.tsx`  
- Fix the `onOpenChange` handler to not auto-close and reset when the dialog is dismissed by overlay click. The budget should only send when "Confirmar e Enviar" is clicked.

#### 3. `src/components/DateRangeFilter.tsx`
- Reduce `min-w-[220px]` to `min-w-[190px]`, reduce height to `h-8`, and tighten padding for a more compact appearance inside the filter bar.

#### 4. `src/components/RelatoriosInteligentesPanel.tsx`
- **Sector-based attendant filtering**: Add a sector filter to the "Relatório Atendente" and "Completo Atendente" tabs. Map each mock attendant to a sector. When a specific sector is selected, only show attendants from that sector in the dropdown.
- **Productivity sections**: The "Relatório Atendente" tab already has NPS, TMA, Resolutividade, Ideias, Radar, and Thalí. Add the missing sections: TME, Ciclo de Venda, Conversão Comercial (orçamentos/vendas/leads/ticket médio), and Histórico de Atendimentos table -- mirroring what's in the "Completo Atendente" tab.
- Add example attendants mapped to different sectors (e.g., Geovana/Paloma/Emilly -> Pré-venda, Marcos -> Suporte, Bianca -> Pós-venda) to demonstrate the filtering logic.

### Technical Details

- `FunilClassificacaoModal`: Add `onInteractOutside={(e) => e.preventDefault()}` to `DialogContent` to prevent closing on outside click.
- Sector-attendant mapping: Create a simple map object `{ "pre-venda": ["geovana", "paloma", "emilly"], "suporte": ["marcos"], "pos-venda": ["bianca"] }` and use it to filter the attendant Select options.
- DateRangeFilter: Adjust classes to `h-8 text-[11px] min-w-[185px] pl-7 pr-2 py-1`.

