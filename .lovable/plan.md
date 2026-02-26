

## Plano de Atualização: Dashboard e Relatórios da Central de Gestão

### Resumo

Três mudanças principais solicitadas:

1. **Dashboard na Central de Gestão deve ser o mesmo Dashboard de Monitoramento** (tela `/dashboard`) -- ou seja, replicar o conteúdo real-time com métricas ao vivo, fila em tempo real, ranking top 3, gráficos por hora e mapa do Brasil.

2. **Relatórios - Visão Geral reorganizada** -- ao invés de valores brutos em cards, apresentar como um menu de relatórios listados (formato de lista/menu navegável com nome do relatório e descrição).

3. **Relatórios - Atendimento** -- não apenas gráficos, adicionar opção de "Personalizar Indicadores" e botões de **Exportar Relatório** (Word, Excel, PDF).

---

### Detalhamento Técnico

#### 1. Dashboard = Dashboard de Monitoramento

**Arquivo:** `src/components/GestaoUnificada.tsx`

- Substituir a função `renderDashboard()` (linhas 319-388) para importar e renderizar o componente `DashboardMonitoramento` diretamente, ou replicar sua lógica dentro da Central de Gestão.
- Como o `DashboardMonitoramento` é uma página completa com header e navegação própria, a abordagem mais limpa será **extrair o conteúdo interno** do dashboard (métricas, fila, ranking, gráficos, mapa) em um componente reutilizável, ou renderizar o conteúdo inline.
- Na prática: copiar a lógica de métricas em tempo real (useEffect com auto-refresh de 5s, cálculo de métricas via pacientes/chamadas/atendentes), os MetricCards com ícones, a fila em tempo real, ranking top 3, gráficos por hora (atendimentos, TMA/TME, vendas), mapa do Brasil e painel de monitoramento.
- Importar os hooks necessários (`usePacientes`, `useChamadas`) e componentes (`StatusAtendentesBlock`, `ConnectAvatar`, `MapaBrasilClientes`, `MonitoramentoAtendentesPanel`) no GestaoUnificada.

#### 2. Relatórios - Visão Geral como Menu

**Arquivo:** `src/components/GestaoUnificada.tsx`

- Substituir os MetricCards da aba "Visão Geral" (linhas 901-913) por uma lista de relatórios em formato de menu:
  - Cada item será uma linha clicável com: nome do relatório, descrição curta e valor resumido ao lado.
  - Relatórios listados: Total de Atendimentos, TMA, TME, Taxa de Resolutividade, Conversão, Receita, NPS Médio.
  - Estilo: cards de lista com hover, ícone discreto, valor à direita.

#### 3. Relatórios - Personalizar e Exportar

**Arquivo:** `src/components/GestaoUnificada.tsx`

- Na aba "Atendimento" dos Relatórios (linhas 915-958), adicionar:
  - **Botão "Personalizar Indicadores"** no topo direito -- abre um Dialog/modal com toggles para ativar/desativar indicadores e opção de reordenar.
  - **Botões de Exportar** (Word, Excel, PDF) -- grupo de botões com ícone `Download` e dropdown ou botões individuais para cada formato.
  - Os botões de exportar serão visuais (simulados) nesta fase, com toast de confirmação ao clicar.
- Aplicar os mesmos botões de exportar nas demais abas de relatórios para consistência.

---

### Arquivos Modificados

| Arquivo | Alteração |
|---|---|
| `src/components/GestaoUnificada.tsx` | Refatorar `renderDashboard()` com conteúdo do monitoramento real-time; refatorar `renderRelatorios()` Visão Geral como menu; adicionar Personalizar + Exportar em Atendimento |

### Resultado Esperado

- Dashboard na Central de Gestão mostra as mesmas métricas em tempo real da tela `/dashboard`
- Relatórios Visão Geral apresenta indicadores em formato de lista/menu organizado
- Aba Atendimento tem botão de personalizar e exportar (Word, Excel, PDF)
