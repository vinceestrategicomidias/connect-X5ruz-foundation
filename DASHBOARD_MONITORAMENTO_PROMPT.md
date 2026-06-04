# Dashboard de Monitoramento — Prompt de Contexto (Standalone)

> Documento auto-contido para ser usado como **prompt** na criação de uma tela de Dashboard de Monitoramento em um projeto novo, consumindo uma **API externa**. Não depende de nenhum código ou componente pré-existente. Todas as referências visuais, comportamentais e de dados estão descritas aqui.

---

## 1. Visão geral

Construa uma **única tela web** chamada **"Dashboard de Monitoramento"**, voltada para gestores e supervisores de um call center / atendimento omnichannel (chat + voz). A tela deve funcionar tanto em desktop quanto em **modo TV/wallboard fullscreen**, atualizando-se automaticamente a cada **5 segundos** via chamadas a uma API REST externa.

A tela responde a 4 perguntas, em uma única visão:

1. **O que está acontecendo agora?** — fila, atendimentos ativos, atendentes em pausa/ligação.
2. **Como estamos performando hoje?** — TMA, TME, SLA, NPS, vendas vs meta.
3. **Quem são os destaques do dia?** — ranking Top 3 de atendentes.
4. **Onde estão nossos clientes?** — distribuição geográfica por estado.

---

## 2. Stack sugerida

- React 18 + TypeScript + Vite.
- TailwindCSS com **design tokens semânticos em HSL** (não use cores fixas em componentes).
- shadcn/ui (`Card`, `Badge`, `Dialog`, `Input`, `ScrollArea`, `Select`, `Button`, `Tooltip`).
- `recharts` para gráficos.
- `lucide-react` para ícones.
- `fetch` ou `@tanstack/react-query` para a API externa (com `refetchInterval: 5000`).

---

## 3. Layout geral

Resolução-alvo: **1440–1920px**. Container raiz: `min-h-screen bg-background p-4`. Empilhamento vertical:

```
┌─────────────────────────────────────────────────────────────────────────┐
│ HEADER  título · subtítulo                          filtros · fullscreen │
├─────────────────────────────────────────────────────────────────────────┤
│ LINHA 1 — 4 KPIs primários                                              │
│ [Em atendimento] [Na fila] [TMA] [TME]                                  │
├─────────────────────────────────────────────────────────────────────────┤
│ LINHA 2 — 4 KPIs secundários                                            │
│ [SLA resposta] [NPS médio] [Em pausa] [Em ligação]                      │
├─────────────────────────────────────────────────────────────────────────┤
│ LINHA 3 — 2 painéis                                                     │
│ ┌─ Fila em tempo real ──────────┐  ┌─ Ranking Top 3 do dia ───────────┐ │
│ │ lista scrollável + toggle de  │  │ 3 atendentes c/ avatar, medalha  │ │
│ │ altura (compacto/médio/expand)│  │ e métricas (atend, TMA, NPS)     │ │
│ └───────────────────────────────┘  └──────────────────────────────────┘ │
├─────────────────────────────────────────────────────────────────────────┤
│ LINHA 4 — 3 gráficos                                                    │
│ [Atendimentos/hora]  [TMA & TME/hora]  [Vendas/hora vs Meta]            │
├─────────────────────────────────────────────────────────────────────────┤
│ LINHA 5 — Mapa do Brasil (heatmap por UF)                               │
└─────────────────────────────────────────────────────────────────────────┘
```

Grids: `grid-cols-4` (KPIs), `grid-cols-2` (painéis), `grid-cols-3` (gráficos). Gaps: `gap-4` em KPIs, `gap-6` em painéis/gráficos. Margem entre seções: `mb-6`.

---

## 4. Header

Layout: `flex items-center justify-between mb-6`.

**Esquerda**
- Botão "voltar" (ícone `ArrowLeft`, `variant=ghost`, `size=icon`) — opcional, leva para a home da aplicação consumidora.
- `<h1>` `text-3xl font-bold`: **"Dashboard de Monitoramento"**.
- Subtítulo `text-sm text-muted-foreground`: *"Atualização automática a cada 5 segundos"*.

**Direita** (todos `w-48`)
1. **Unidade** (`Select`): Todas / Sede / Unidades específicas.
2. **Setor** (`Select`): Todos / Pré-venda / Venda / Pós-venda.
3. **Período** (`Select`): Agora / Hoje / Últimas 2h / Últimas 24h.
4. Botão **fullscreen** (`Maximize2`, `variant=outline`, `size=icon`) — alterna `document.documentElement.requestFullscreen()` ↔ `document.exitFullscreen()`.

Os 3 filtros viram **query params globais** enviados em todas as chamadas: `?unidade_id=&setor_id=&periodo=agora|hoje|2h|24h`.

---

## 5. Componente `MetricCard` (KPI)

Reutilizável. Props: `icon`, `label`, `value`, `alert?: boolean`, `onClick?`.

Estrutura:
- `Card p-4`, conteúdo `flex items-center gap-3`.
- Bloco do ícone: `p-2 rounded-lg bg-primary/10`, ícone `h-5 w-5 text-primary`.
- Texto: valor `text-2xl font-bold`; label `text-xs text-muted-foreground`.

**Modo alerta** (`alert=true`): `border-destructive bg-destructive/5`; ícone `text-destructive` em `bg-destructive/10`.

### 5.1. KPIs primários (linha 1)

| Posição | Ícone | Label | Formato | Endpoint |
|---|---|---|---|---|
| 1 | `Users` | Em atendimento | inteiro | `GET /metrics/realtime` → `em_atendimento` |
| 2 | `Clock` | Na fila agora | inteiro (alerta se > 25) | `GET /metrics/realtime` → `na_fila` |
| 3 | `Timer` | TMA | `X.X min` (alerta se > 4) | `GET /metrics/today` → `tma` |
| 4 | `Timer` | TME | `X.X min` (alerta se > 7) | `GET /metrics/today` → `tme` |

O card "Em atendimento" é clicável e abre o **Modal de Monitoramento** (seção 10).

### 5.2. KPIs secundários (linha 2)

| Posição | Ícone | Label | Formato | Observação |
|---|---|---|---|---|
| 1 | `Target` | SLA resposta | `XX%` (alerta se < 85) | — |
| 2 | `Award` | NPS médio hoje | inteiro | — |
| 3 | `Coffee` | Em pausa | inteiro | clicável → modal lista de atendentes em pausa |
| 4 | `PhoneCall` | Em ligação | inteiro | clicável → modal lista de atendentes em ligação |

**Modais de status (pausa/ligação)**: `Dialog` `sm:max-w-md` com:
- Título: bolinha colorida (amarela=pausa, roxa=ligação) + label + `Badge` com contagem.
- Campo `Input` de busca por nome (ícone `Search` à esquerda).
- `ScrollArea max-h-[360px]` com lista de itens (`p-2.5 rounded-lg hover:bg-muted/50`): avatar + nome + `setor • unidade` + `Badge outline` com tempo no status.
- Ordenação: **descendente por tempo no status**.
- Clique em um item abre o Modal de Monitoramento (seção 10).

---

## 6. Painel "Fila em tempo real" (linha 3, coluna esquerda)

`Card p-4`.

**Cabeçalho** (`flex items-center justify-between mb-4`):
- Esquerda: título "Fila em tempo real" + `Badge secondary` com a contagem total.
- Direita: botão **toggle de altura** com 3 estados cíclicos:
  - `compacto` (250px) — ícone `ChevronDown`
  - `medio` (400px) — ícone `Minus`
  - `expandido` (600px) — ícone `ChevronUp`
  - Rótulo lateral `text-xs text-muted-foreground capitalize` com o estado atual.

**Conteúdo**: `ScrollArea` com altura conforme estado. Lista **ordenada descendente por `tempo_na_fila`** (mais antigo no topo).

**Item da fila** (`p-3 rounded-lg border hover:bg-muted/50`):
- Linha 1: avatar (sm) + nome (`text-sm font-medium`) + `Badge` colorido com `XX min`.
- Linha 2: última mensagem truncada (`text-xs text-muted-foreground line-clamp-1`).
- Linha 3: `setor • unidade` (`text-xs text-muted-foreground`).

**Semáforo do badge de tempo**:
- `< 15 min`  → verde  (`bg-green-100 text-green-700` / dark `bg-green-900/30 text-green-400`)
- `15–29 min` → amarelo (`bg-yellow-100 text-yellow-700` / dark `bg-yellow-900/30 text-yellow-400`)
- `>= 30 min` → vermelho (`bg-red-100 text-red-700` / dark `bg-red-900/30 text-red-400`)

Endpoint: `GET /queue?status=waiting&order=tempo_na_fila:desc`.

---

## 7. Painel "Ranking Diário — Top 3" (linha 3, coluna direita)

`Card p-4`, título "Ranking Diário - Top 3", lista vertical `space-y-4` com 3 itens.

Cada item (`flex items-center gap-4 p-4 rounded-lg`):
- Fundo tonalizado pela medalha:
  - 1º: `bg-yellow-500/10`, ring `ring-yellow-400`, ícone `Trophy text-yellow-500 fill-yellow-500`.
  - 2º: `bg-gray-400/10`,  ring `ring-gray-300`,   ícone `Trophy text-gray-400 fill-gray-400`.
  - 3º: `bg-orange-500/10`,ring `ring-orange-400`, ícone `Trophy text-orange-600 fill-orange-600`.
- Avatar `h-10 w-10` com `ring-2` da cor da medalha.
- Badge circular com a posição (1, 2 ou 3) sobreposto no canto superior direito do avatar.
- Texto à direita: nome `font-semibold`, e abaixo `X atend. · TMA: X.X min · NPS: XX` (`text-sm text-muted-foreground`).

Endpoint: `GET /ranking/today?limit=3` → `[{posicao, nome, avatar_url, atendimentos, tma, nps}]`.

---

## 8. Gráficos (linha 4) — `recharts`

3 `Card p-4` lado a lado, cada um com título `text-lg font-semibold mb-4` e `<ResponsiveContainer width="100%" height={250}>`. Todos usam `<CartesianGrid strokeDasharray="3 3" />`, `<Tooltip />` e `<XAxis dataKey="hora" />` (`HH:00`).

### 8.1. Atendimentos por hora — `BarChart`
- 1 barra: `dataKey="atendimentos"`, `fill="hsl(var(--primary))"`.
- Endpoint: `GET /metrics/hourly?metric=atendimentos&date=today`.

### 8.2. TMA e TME por hora — `LineChart`
- 2 linhas + `<Legend />`:
  - `tma` em `hsl(var(--primary))`.
  - `tme` em `hsl(var(--destructive))`.
- Endpoint: `GET /metrics/hourly?metric=tma,tme&date=today`.

### 8.3. Vendas por hora vs Meta — `BarChart` composto
- Barras `vendas` em verde `hsl(142, 76%, 36%)`.
- Linha tracejada `meta` em `hsl(var(--destructive))` com `strokeDasharray="5 5"`.
- Endpoint: `GET /metrics/hourly?metric=vendas,meta&date=today`.

---

## 9. Mapa do Brasil (linha 5)

`Card p-4` largura total. Renderiza um **mapa do Brasil em SVG** com heatmap (intensidade de cor por UF baseada em `total`). Tooltip ao hover mostrando `UF · total clientes`. Opcionalmente, clique em um estado faz drill-down por cidade.

Endpoint: `GET /clientes/distribuicao-geografica?group_by=uf` → `[{uf: "SP", total: 1234}, ...]`.

Sugestão de implementação: usar `react-simple-maps` com um GeoJSON dos estados do Brasil, ou um SVG inline com `path` por estado.

---

## 10. Modal "Monitoramento de Atendentes"

`Dialog` em tela quase cheia (`max-w-6xl`). Abre ao clicar:
- No card KPI "Em atendimento".
- Em qualquer item das listas de pausa/ligação.

Conteúdo mínimo:
- Lista lateral de atendentes ativos (avatar, nome, status, tempo no status).
- Painel central com a conversa ao vivo do atendente selecionado (read-only) e botão "Intervir" (envia mensagem como gestor).
- Botão "Fechar".

> Esta tela é secundária; sua implementação pode ser um placeholder inicial. Use `GET /atendentes/:id/conversa-ativa` quando for implementar.

---

## 11. Comportamento dinâmico

- **Auto-refresh**: hook próprio com `setInterval(fetchAll, 5000)` ou `useQuery({ refetchInterval: 5000 })` por bloco. Limpar no `unmount`.
- **Filtros globais**: estado no nível da página; mudanças disparam refetch imediato em todos os blocos.
- **Fullscreen**: alterna `requestFullscreen` / `exitFullscreen` no `document.documentElement`. Atualizar ícone para `Minimize2` quando ativo.
- **Toggle altura da fila**: estado local `tamanhoFila: 'compacto' | 'medio' | 'expandido'`, não persistido.
- **Skeletons**: enquanto carrega pela primeira vez, mostrar `Skeleton` com a mesma altura dos cards/itens.

---

## 12. Design tokens (Tailwind / `index.css`)

Defina em `:root` e `.dark` (HSL sem `hsl()`):

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222 47% 11%;
  --muted: 210 40% 96%;
  --muted-foreground: 215 16% 47%;
  --border: 214 32% 91%;
  --primary: 214 89% 50%;            /* azul ~ #1A73E8 */
  --primary-foreground: 0 0% 100%;
  --secondary: 210 40% 96%;
  --destructive: 0 84% 60%;
  --destructive-foreground: 0 0% 100%;
  --radius: 0.5rem;
}
```

Tipografia: H1 `text-3xl`, títulos de painel `text-lg font-semibold`, valores de KPI `text-2xl font-bold`, labels `text-xs text-muted-foreground`. Cantos: `rounded-lg`. **Nunca** use classes como `text-white`, `bg-black`, `bg-blue-500` em componentes — sempre via tokens.

---

## 13. Mapa de endpoints externos (contrato)

Base URL configurável via `VITE_API_BASE_URL`. Autenticação por header `Authorization: Bearer <token>` (se aplicável).

| Bloco | Método | Endpoint | Resposta |
|---|---|---|---|
| KPIs primários | GET | `/metrics/realtime` | `{ em_atendimento:number, na_fila:number, tma:number, tme:number }` |
| KPIs secundários | GET | `/metrics/today` | `{ sla:number, nps:number, atendentes_pausa:number, atendentes_ligacao:number }` |
| Atendentes por status | GET | `/atendentes?status=em_pausa\|em_ligacao` | `[{ id, nome, avatar_url, setor, unidade, status, tempo_no_status:string, tempo_minutos:number }]` |
| Fila em tempo real | GET | `/queue?status=waiting&order=tempo_na_fila:desc` | `[{ id, nome, avatar_url, ultima_mensagem, tempo_na_fila:number, setor, unidade }]` |
| Ranking Top 3 | GET | `/ranking/today?limit=3` | `[{ posicao:1\|2\|3, nome, avatar_url, atendimentos:number, tma:number, nps:number }]` |
| Atendimentos/hora | GET | `/metrics/hourly?metric=atendimentos&date=today` | `[{ hora:"HH:00", atendimentos:number }]` |
| TMA/TME por hora | GET | `/metrics/hourly?metric=tma,tme&date=today` | `[{ hora, tma:number, tme:number }]` |
| Vendas por hora | GET | `/metrics/hourly?metric=vendas,meta&date=today` | `[{ hora, vendas:number, meta:number }]` |
| Mapa do Brasil | GET | `/clientes/distribuicao-geografica?group_by=uf` | `[{ uf:string, total:number }]` |
| Conversa ativa (modal) | GET | `/atendentes/:id/conversa-ativa` | `{ paciente, mensagens:[{de, texto, timestamp}] }` |

Todos os endpoints aceitam os filtros globais: `?unidade_id=&setor_id=&periodo=agora|hoje|2h|24h`.

---

## 14. Thresholds de alerta (resumo)

| Métrica | Alerta |
|---|---|
| Na fila | `> 25` |
| TMA | `> 4 min` |
| TME | `> 7 min` |
| SLA | `< 85%` |
| Tempo na fila (item) | verde `<15`, amarelo `15–29`, vermelho `>=30` |

---

## 15. Critérios de aceite

- A tela renderiza em uma rota única (ex.: `/dashboard`).
- Todos os 5 blocos (KPIs ×2, painéis, gráficos, mapa) estão presentes e populados pelos endpoints listados.
- Auto-refresh a cada 5s funciona sem flicker (estado preservado entre refetches).
- Filtros de unidade/setor/período se propagam a todas as chamadas.
- Modo fullscreen entra e sai corretamente.
- Cores de alerta e semáforo seguem exatamente os thresholds da seção 14.
- Nenhuma cor hardcoded em componentes; tudo via tokens HSL.
- Layout responsivo a partir de 1280px (abaixo disso pode degradar; a tela é otimizada para desktop/TV).

---

Este documento é suficiente, por si só, para reconstruir a tela do Dashboard de Monitoramento em qualquer projeto React + Tailwind, consumindo qualquer backend que respeite o contrato de endpoints da seção 13.
