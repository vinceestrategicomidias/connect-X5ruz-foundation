# Dashboard de Monitoramento — Especificação Visual e Funcional Completa

> Documento de contexto para recriar a tela do **Dashboard de Monitoramento** consumindo endpoints de uma **API externa**. Cobre exclusivamente a tela do dashboard (sem demais módulos do sistema).

---

## 1. Propósito da tela

Painel de **operação em tempo real** voltado para gestores e supervisores de call center / atendimento omnichannel. Mostra, em uma única visão (single-pane-of-glass):

- O que está acontecendo **agora** (fila, atendimentos ativos, atendentes ocupados/em pausa).
- Como a operação **está performando hoje** (TMA, TME, SLA, NPS, vendas vs meta).
- **Quem** são os melhores do dia (ranking).
- **Onde** estão os clientes (distribuição geográfica).

A tela é otimizada para **TV/wallboard** (modo fullscreen) e para uso em desktop por supervisores. Atualiza automaticamente a cada **5 segundos**.

---

## 2. Layout geral (estrutura visual)

Resolução base de design: **1440–1920px** (desktop / TV).
Container: `min-h-screen`, padding `p-4`, fundo `bg-background`.

Empilhamento vertical (top → bottom):

```
┌─────────────────────────────────────────────────────────────────────────┐
│  HEADER (título + filtros + fullscreen)                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  LINHA 1 — KPIs primários (4 cards):                                    │
│  [Em atendimento] [Na fila] [TMA] [TME]                                 │
├─────────────────────────────────────────────────────────────────────────┤
│  LINHA 2 — KPIs secundários (4 cards):                                  │
│  [SLA resposta] [NPS médio] [Em pausa] [Em ligação]                     │
├─────────────────────────────────────────────────────────────────────────┤
│  LINHA 3 — Painéis (2 colunas):                                         │
│  ┌─────────────────────────┐  ┌─────────────────────────┐               │
│  │ Fila em tempo real      │  │ Ranking Top 3 do dia    │               │
│  │ (lista scrollável, com  │  │ (3 atendentes com foto, │               │
│  │ toggle de altura)       │  │ medalhas e métricas)    │               │
│  └─────────────────────────┘  └─────────────────────────┘               │
├─────────────────────────────────────────────────────────────────────────┤
│  LINHA 4 — Gráficos (3 colunas):                                        │
│  [Atendimentos/hora]  [TMA e TME/hora]  [Vendas/hora vs Meta]           │
├─────────────────────────────────────────────────────────────────────────┤
│  LINHA 5 — Mapa do Brasil (heatmap de clientes/atendimentos por UF)     │
└─────────────────────────────────────────────────────────────────────────┘
```

Grid: `grid-cols-4` nas linhas de KPI, `grid-cols-2` em painéis, `grid-cols-3` em gráficos.
Gap entre cards: `gap-4` (KPIs) e `gap-6` (painéis/gráficos).
Margem inferior entre seções: `mb-6`.

---

## 3. Header (topo da tela)

Layout: `flex items-center justify-between mb-6`.

**Lado esquerdo:**
- Botão "voltar" (ícone `ArrowLeft`, `variant=ghost`, `size=icon`) que retorna para `/chat`.
- Título `h1` 3xl bold: **"Dashboard de Monitoramento"**.
- Subtítulo `text-sm text-muted-foreground`: *"Atualização automática a cada 5 segundos"*.

**Lado direito (filtros, todos com largura `w-48`):**
1. **Unidade** (Select): Todas / Sede - Vitória / Unidade São Paulo / Unidade Rio de Janeiro.
2. **Setor** (Select): Todos / Pré-venda / Venda / Pós-venda.
3. **Período** (Select): Agora (tempo real) / Hoje / Últimas 2 horas / Últimas 24 horas.
4. **Botão fullscreen** (ícone `Maximize2`, `variant=outline`, `size=icon`) — chama `document.documentElement.requestFullscreen()`.

> Quando a tela é embutida em outro container (prop `embedded=true`), o header é omitido.

---

## 4. KPIs — Cards de métrica

Componente reutilizável `MetricCard`, com 3 props: `icon`, `label`, `value`, `alert?`.

Estrutura visual:
- `Card` com `p-4`.
- Linha horizontal `flex items-center gap-3`.
- Bloco ícone: `p-2 rounded-lg bg-primary/10` com ícone `h-5 w-5 text-primary`.
- Bloco texto: valor em `text-2xl font-bold`, label em `text-xs text-muted-foreground`.

**Modo alerta** (`alert=true`): borda e fundo destrutivos (`border-destructive bg-destructive/5`, ícone em `text-destructive` com fundo `bg-destructive/10`). Disparado por:
- `Na fila > 25`
- `TMA > 4 min`
- `TME > 7 min`
- `SLA < 85%`

### 4.1. Linha 1 — KPIs primários

| # | Ícone | Label | Valor (formato) | Fonte sugerida na API |
|---|---|---|---|---|
| 1 | `Users` | Em atendimento | inteiro | `GET /metrics/realtime?metric=in_service` (clicável → abre modal de monitoramento) |
| 2 | `Clock` | Na fila agora | inteiro | `GET /queue/current` (com alerta) |
| 3 | `Timer` | TMA | `X.X min` | `GET /metrics/today?metric=tma` |
| 4 | `Timer` | TME | `X.X min` | `GET /metrics/today?metric=tme` |

### 4.2. Linha 2 — KPIs secundários

| # | Ícone | Label | Valor | Observação |
|---|---|---|---|---|
| 1 | `Target` | SLA resposta | `XX%` | alerta se < 85% |
| 2 | `Award` | NPS médio hoje | inteiro | — |
| 3 | `Coffee` | Em pausa | inteiro | abre modal com lista de atendentes em pausa |
| 4 | `PhoneCall` | Em ligação | inteiro | abre modal com lista de atendentes em chamada |

Os dois últimos cards são renderizados pelo bloco `StatusAtendentesBlock`, que internamente abre um `Dialog` com:
- Lista filtrável por nome.
- Cada item: avatar do atendente, nome, setor • unidade, badge com tempo no status (ordenado decrescente por tempo).
- Indicador de status (bolinha colorida — amarela para pausa, roxa para ligação).

---

## 5. Painel "Fila em tempo real" (coluna esquerda, linha 3)

`Card p-4` com:

**Cabeçalho** (`flex items-center justify-between mb-4`):
- Título "Fila em tempo real" + `Badge` secundário com a contagem total.
- Botão à direita para **alternar tamanho** (3 estados: `compacto` 250px → `medio` 400px → `expandido` 600px → volta para compacto). Ícone muda: `ChevronDown` (compacto), `Minus` (médio), `ChevronUp` (expandido). Rótulo lateral em `text-muted-foreground capitalize` mostra o estado atual.

**Conteúdo:** `ScrollArea` com altura conforme estado. Lista ordenada **decrescente por tempo na fila** (paciente mais antigo no topo).

**Item da fila** (`p-3 rounded-lg border hover:bg-muted/50`):
- Linha superior: avatar (`size=sm`) + nome + `Badge` colorido com tempo em minutos.
- Linha do meio: última mensagem (truncada, `text-xs text-muted-foreground`).
- Linha inferior: `setor • unidade` em `text-xs text-muted-foreground`.

**Regra de cor do badge de tempo (semáforo):**
- `tempo < 15 min` → verde (`bg-green-100 text-green-700` / dark `bg-green-900/30 text-green-400`).
- `15 ≤ tempo < 30 min` → amarelo.
- `tempo ≥ 30 min` → vermelho.

Endpoint sugerido: `GET /queue?status=waiting&order=tempo_na_fila:desc`.

---

## 6. Painel "Ranking Diário — Top 3" (coluna direita, linha 3)

`Card p-4` com título "Ranking Diário - Top 3".
Lista vertical de 3 cards (`space-y-4`).

Cada item (`flex items-center gap-4 p-4 rounded-lg`):
- Fundo tonalizado pela cor da medalha (`bg-yellow-500/10`, `bg-gray-400/10`, `bg-orange-500/10`).
- Avatar (`size=md`) com **ring colorido** (amarelo/cinza/laranja conforme posição).
- Badge circular sobreposto no canto superior direito do avatar com a **posição** (1, 2 ou 3).
- Texto: nome em `font-semibold text-base`; abaixo, métricas em linha — `X atend.` • `TMA: X.X min` • `NPS: XX` (em `text-sm text-muted-foreground`).

Cores:
- 1º lugar — amarelo (ouro): `text-yellow-500`, ring `ring-yellow-400`.
- 2º lugar — cinza (prata): `text-gray-400`, ring `ring-gray-300`.
- 3º lugar — laranja (bronze): `text-orange-500`, ring `ring-orange-400`.

Endpoint sugerido: `GET /ranking/today?limit=3` retornando `[{posicao, nome, avatar_url, atendimentos, tma, nps}]`.

---

## 7. Linha de gráficos (linha 4) — biblioteca `recharts`

Três cards lado a lado, cada um com título `text-lg font-semibold mb-4` e `ResponsiveContainer` de altura 250px.

### 7.1. Atendimentos por hora (hoje) — BarChart
- Eixo X: `hora` (string `HH:00`).
- Eixo Y: contagem.
- Barra única, cor `hsl(var(--primary))`.
- Endpoint: `GET /metrics/hourly?metric=atendimentos&date=today`.

### 7.2. TMA e TME por hora — LineChart (duas linhas)
- Linha 1: `tma` em `hsl(var(--primary))`.
- Linha 2: `tme` em `hsl(var(--destructive))`.
- Tooltip + Legend ativos.
- Endpoint: `GET /metrics/hourly?metric=tma,tme&date=today`.

### 7.3. Vendas por hora (hoje) — BarChart com linha de meta
- Barras `vendas` em verde `hsl(142, 76%, 36%)`.
- Linha tracejada `meta` em `hsl(var(--destructive))` (`strokeDasharray="5 5"`).
- Endpoint: `GET /metrics/hourly?metric=vendas,meta&date=today`.

Todos os gráficos têm `CartesianGrid strokeDasharray="3 3"` e tooltip padrão.

---

## 8. Mapa do Brasil — Distribuição de clientes

Componente `MapaBrasilClientes` em largura total (linha 5).
Renderiza um mapa do Brasil colorido por densidade (heatmap) com:
- Contagem de clientes/atendimentos por UF.
- Tooltip ao passar o mouse sobre o estado.
- Possível drill-down para cidades.

Endpoint sugerido: `GET /clientes/distribuicao-geografica?group_by=uf` → `[{uf: "SP", total: 1234, ...}]`.

---

## 9. Modal "Monitoramento de Atendentes"

Aberto ao clicar:
- No card "Em atendimento".
- Em qualquer atendente listado nos modais de pausa/ligação.

Componente: `MonitoramentoAtendentesPanel` (Dialog em tela cheia). Permite ao gestor visualizar conversas em andamento ao vivo e intervir.

---

## 10. Comportamento dinâmico

- **Auto-refresh:** `setInterval(calcularMetricas, 5000)`. Reexecuta a cada 5s e ao trocar `pacientes`, `chamadas` ou `atendentes`.
- **Filtros (unidade, setor, período):** devem ser enviados como query params para todos os endpoints de métrica.
- **Fullscreen:** alterna `document.documentElement.requestFullscreen()` ↔ `document.exitFullscreen()`.
- **Toggle altura da fila:** estado local `tamanhoFila` (compacto/médio/expandido) — não persistido.

---

## 11. Design tokens utilizados

Todas as cores via **HSL semantic tokens** (não usar cores diretas):
- `--background`, `--foreground`, `--muted`, `--muted-foreground`, `--border`.
- `--primary` / `--primary-foreground` — destaque principal (azul Connect `#1A73E8`).
- `--destructive` — alertas e estados críticos (vermelho).
- `--secondary` — badges neutros.

Sombras e cantos: `rounded-lg` padrão, sombras suaves nos `Card` do shadcn.
Tipografia: H1 `text-3xl`, títulos de painel `text-lg font-semibold`, valores de KPI `text-2xl font-bold`, labels `text-xs text-muted-foreground`.

---

## 12. Mapa de endpoints externos (resumo)

| Bloco da UI | Endpoint sugerido | Método | Retorno |
|---|---|---|---|
| KPIs primários | `/metrics/realtime` | GET | `{em_atendimento, na_fila, tma, tme}` |
| KPIs secundários | `/metrics/today` | GET | `{sla, nps, atendentes_pausa, atendentes_ligacao}` |
| Lista de status atendentes | `/atendentes?status=em_pausa\|em_ligacao` | GET | `[{id, nome, avatar, setor, unidade, status, tempo_no_status}]` |
| Fila em tempo real | `/queue?status=waiting` | GET | `[{id, nome, avatar, ultima_mensagem, tempo_na_fila, setor, unidade}]` |
| Ranking Top 3 | `/ranking/today?limit=3` | GET | `[{posicao, nome, avatar, atendimentos, tma, nps}]` |
| Atendimentos/hora | `/metrics/hourly?metric=atendimentos` | GET | `[{hora, atendimentos}]` |
| TMA/TME/hora | `/metrics/hourly?metric=tma,tme` | GET | `[{hora, tma, tme}]` |
| Vendas/hora | `/metrics/hourly?metric=vendas,meta` | GET | `[{hora, vendas, meta}]` |
| Mapa do Brasil | `/clientes/distribuicao-geografica` | GET | `[{uf, total}]` |

Todos aceitam os filtros globais como query params: `?unidade_id=...&setor_id=...&periodo=agora|hoje|2h|24h`.

---

## 13. Resumo dos thresholds de alerta

| Métrica | Alerta quando |
|---|---|
| Na fila | `> 25` |
| TMA | `> 4 min` |
| TME | `> 7 min` |
| SLA | `< 85%` |
| Tempo na fila (item) | verde `<15`, amarelo `15–29`, vermelho `≥30` min |

---

Este documento descreve exclusivamente a tela do Dashboard de Monitoramento, suficiente para reconstruí-la consumindo qualquer API externa que respeite o contrato de campos descrito acima.
