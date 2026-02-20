

# Central de Gestao - Formato de Menu

## Objetivo
Transformar a Central de Gestao de um layout de acordeao (cards colapsaveis empilhados verticalmente) para um layout de **menu lateral + area de conteudo**, mais organizado e minimalista.

## Estrutura Visual

```text
+----------------------------------------------------------+
| Central de Gestao                              [X]        |
+-------------+--------------------------------------------+
|             |                                            |
| VISAO       |   Conteudo da secao selecionada            |
|  Dashboard  |                                            |
|  Relatorios |   (Tabs internas, graficos, formularios)   |
|  NPS        |                                            |
|             |                                            |
| ESTRUTURA   |                                            |
|  Empresa    |                                            |
|  Unidades   |                                            |
|             |                                            |
| EQUIPE      |                                            |
|  Usuarios   |                                            |
|  Perfis     |                                            |
|             |                                            |
| OPERACAO    |                                            |
|  Msgs Rap.  |                                            |
|  URA        |                                            |
|             |                                            |
| CONTROLE    |                                            |
|  Alertas    |                                            |
|  Auditoria  |                                            |
|             |                                            |
| INTEGRACOES |                                            |
|  API        |                                            |
+-------------+--------------------------------------------+
```

## Mudancas Tecnicas

### Arquivo: `src/components/GestaoUnificada.tsx`

1. **Substituir o layout de acordeao** (SectionBlock/Collapsible) por um layout de duas colunas:
   - Menu lateral esquerdo (w-56) com os 6 blocos de menu agrupados por categoria
   - Area de conteudo principal a direita ocupando o restante

2. **Menu lateral**:
   - Cada bloco tem um titulo de categoria (texto pequeno uppercase) como separador
   - Itens de menu sao botoes com icone + texto
   - Item ativo recebe destaque visual (bg-primary/10, text-primary)
   - Menu compacto com icones h-3.5 e text-xs

3. **Itens do menu organizados em blocos**:
   - **Visao Estrategica**: Dashboard, Relatorios Inteligentes, NPS, Indicadores, Feedback Thali
   - **Estrutura**: Empresa, Unidades, Setores
   - **Equipe**: Usuarios, Perfis de Acesso, Validacoes
   - **Operacao**: Mensagens Rapidas, URA, Thali e Mensageria, Roteiros, Etiquetas
   - **Controle**: Config. Alertas, Thali Preditiva, Alertas Ativos, Auditoria, Central de Ideias
   - **Integracoes**: API e Webhooks, Configuracoes Gerais

4. **Area de conteudo**: renderiza diretamente o conteudo da secao selecionada (sem precisar de Tabs wrapper por secao, ja que o menu substitui as tabs de primeiro nivel)

5. **Drawer expandido**: manter largura w-[960px] max-w-[95vw] para acomodar menu + conteudo

6. **Remover**: componente SectionBlock, MetricCard de KPIs colapsados (nao necessarios no formato menu)

7. **State**: trocar `expandedSection` por `activeSection` (string com id do item ativo, default "dashboard")

### Sem alteracoes em outros arquivos
- ConnectNavbar.tsx permanece igual
- Todos os sub-paineis (RelatoriosInteligentesPanel, IAConfigPanel, etc.) permanecem intactos
- Nenhuma funcionalidade removida

