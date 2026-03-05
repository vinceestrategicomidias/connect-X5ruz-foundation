

## Plan: Always Show Classification Modal + Reset Form After Send

### Problem
The previous plan proposed skipping the classification modal when `leadAtivo` exists and sending directly. The user explicitly rejects this: the modal must **always** reopen for every budget, allowing the user to classify, view/set the funnel stage, and link the new budget to the existing lead.

### Changes

#### 1. `src/components/FunilClassificacaoModal.tsx`
- **Add `leadAtivo` prop** (optional `LeadFunil`) to show current funnel state when a lead already exists
- **When `leadAtivo` is provided**: 
  - Show a banner indicating the lead already exists with its current stage (e.g., "Lead ativo: Em negociação")
  - Add a stage selector (Em negociação / Vendido / Perdido) so the user can update the stage for this new budget
  - Pre-select "Venda" and pre-fill product/value from the budget form
  - On confirm: call `onClassificar("venda", { ...dados, etapa_lead })` passing the selected stage
- **When no `leadAtivo`**: Keep current behavior (Venda vs Apenas contato radio)

#### 2. `src/components/RoteirosPanel.tsx`
- **`handleEnviarOrcamento`**: Already always opens the modal (line 248-250). No change needed here.
- **`handleClassificacao`**: When `leadAtivo` exists and user confirms "venda":
  - Do NOT create a new lead — instead link the budget to the existing `leadAtivo.id`
  - If the user changed the funnel stage, update the lead's `etapa` accordingly
  - Call `enviarOrcamentoDireto(leadAtivo.id, false)`
- **After successful send** (in `enviarOrcamentoDireto` `onSuccess`): Reset the form fields to empty values but keep the user on `no_template_orcamento` node:
  ```ts
  setOrcamento({ descricao: "", valorProduto: "", despesasAdicionais: "", valorDesconto: "" });
  ```
- **Pass `leadAtivo`** to `FunilClassificacaoModal` as a prop

#### 3. `handleClassificacao` updated logic
```
if leadAtivo exists:
  if tipo === "venda":
    - update lead stage if changed (via mutation)
    - enviarOrcamentoDireto(leadAtivo.id, false)
  if tipo === "apenas_contato":
    - enviarOrcamentoDireto(undefined, true)
else:
  - current behavior (create lead or send as apenas_contato)
```

### Technical Details
- Import `LeadFunil` type into the modal component
- Use existing `useAtualizarEtapaLead` (or equivalent mutation from `useLeadsFunil`) to update the lead stage when changed
- The `onClassificar` callback signature gains an optional `etapa` field in the `dados` object
- Form reset happens in the `onSuccess` callback of `enviarMensagem.mutate`, ensuring it only resets on successful send

