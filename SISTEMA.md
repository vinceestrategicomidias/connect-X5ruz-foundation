# CONNECT — Plataforma de Atendimento Omnichannel com IA (Thalí)

Sistema unificado de atendimento ao cliente, CRM de vendas e gestão operacional para empresas que operam com múltiplos setores, unidades e atendentes. Combina chat omnichannel, telefonia, IA assistiva (Thalí) e um painel de gestão completo.

---

## 1. Funcionalidades do Sistema

### 1.1 Atendimento (Chat)
- **Chat omnichannel** com filas por setor, transferências com justificativa obrigatória e finalização com motivo cadastrado.
- **Atribuição automática** do paciente ao atendente no primeiro contato.
- **Mensagens rápidas** via slash command, **encaminhamento estilo WhatsApp** (multi-seleção) e **mensagens favoritadas**.
- **Gravação e transcrição de áudio** client-side (Whisper local, sem chave OpenAI).
- **Emojis, figurinhas e pacote customizado da Thalí**.
- **Assinatura automática** do atendente nas mensagens.
- **Edição de contato e busca** no header da conversa, com máscara +55.
- **Chat interno de equipe** ("Connect") com ordenação inteligente e badges.

### 1.2 Thalí — Assistente de IA
- Análise de **sentimento** da conversa em tempo real.
- **Sugestões de resposta** (empática, objetiva, pergunta).
- **Resumo de conversa** por período (até 30 dias).
- **Comandos rápidos** (resposta empática, objetiva, sugerir ligação).
- **Base de conhecimento** carregável (documentos) para responder dúvidas dos atendentes.
- **Visão Estratégica preditiva** (NPS, churn, oportunidades).
- **Geração de figurinhas e avatares** com Gemini.

### 1.3 Telefonia
- Discador manual e integrado.
- **Card flutuante de chamada** com posicionamento em 4 cantos.
- **Anotações e transcrição de ligações** durante o expediente.

### 1.4 CRM / Funil de Vendas
- Funil com etapas customizadas (sem "Qualificados").
- **Orçamentos sequenciais** com template editável e variáveis dinâmicas (`{descricao}`, `{valor_produto}`, `{desconto}`, `{total}`).
- **Classificação Venda vs. Apenas contato** — só gera lead quando é venda real.
- **Reabertura auditada** de leads perdidos (`reaberto_por_nome`).
- **Catálogo de Serviços e Produtos** com import/export Excel, cadastro diferenciado (duração/profissional para serviço, SKU/estoque para produto).

### 1.5 Gestão (Painel Unificado)
- **6 blocos**: Operação, Controle, Relatórios, Dashboards, Estratégia, Configurações.
- **Controle**: setores, unidades, usuários, perfis de acesso, etiquetas, motivos de transferência e finalização (multi-setor + multi-unidade), serviços e produtos.
- **Relatórios**: Atendimento, Comercial, Produtividade, Qualidade, Distribuição e **Relatório de Equipe** (por atendente, com filtro de data e indicadores customizáveis: NPS, TMA, TME, ciclo de venda, conversão, histórico, ranking, ideias, visão Thalí).
- **Dashboards**: produtividade, ranking Top 3 diário, mapa de localização 3 níveis, horários de pico com cores condicionais.
- **Monitoramento ao vivo** ("Modo Gestor") com intervenção e histórico de 30 dias.
- **Auditoria de ações** e simulações de validação de perfil.
- **Central de Ideias das Estrelas** (sugestões dos atendentes).
- **Configuração de alertas** com salvamento manual e limites.
- **Editor de Roteiros** com nós de dupla escolha.

### 1.6 Infraestrutura
- **Lovable Cloud** (Supabase) com RLS, edge functions, realtime.
- **API pública** com webhooks, logs e documentação embarcada.
- Autenticação por e-mail/senha + Google.

---

## 2. Análise SWOT

### Forças (Strengths)
- **Tudo-em-um**: atendimento + telefonia + CRM + gestão + IA em uma única plataforma — elimina a necessidade de Zendesk + RD Station + PABX + BI separados.
- **IA proprietária (Thalí)** profundamente integrada ao fluxo do atendente, não um chatbot bolt-on.
- **Profundidade operacional**: motivos cadastráveis, justificativas obrigatórias, auditoria — sinal de produto desenhado com gestores reais.
- **Multi-setor e multi-unidade nativos** (cadastro de motivos, perfis, relatórios) — pronto para redes/franquias.
- **Relatório de Equipe customizável** com indicadores selecionáveis: diferencial forte vs. relatórios engessados de concorrentes.
- **Transcrição client-side** (Whisper local) reduz custo de IA e protege dados sensíveis.
- **Design system consistente** (tokens HSL, minimalismo azul) — UX coesa.

### Fraquezas (Weaknesses)
- **Complexidade alta**: 6 blocos de gestão, dezenas de painéis — curva de aprendizado íngreme para empresas pequenas.
- **Dependência de mocks** em vários módulos (ranking, simulações) — risco de divergência entre demo e produção.
- **Acoplamento ao vocabulário clínico** ("paciente", "Thalí") — limita venda fora do nicho saúde sem rebranding.
- **Ausência aparente de app mobile nativo** — atendentes em mobilidade ficam no navegador.
- **Sem integrações nativas visíveis** com WhatsApp Business API oficial, Meta, Instagram DM, e-mail — apenas chat interno do sistema.
- **Single-tenant operacional**: estrutura de uma marca ("CONNECT/Grupo Liruz") sugere foco em um cliente âncora, não SaaS multi-tenant maduro.

### Oportunidades (Opportunities)
- **Verticalização em saúde** (clínicas, consultórios, redes odontológicas, estética) onde "paciente" é nativo — TAM grande e mal atendido no Brasil.
- **Expansão para franquias e redes de varejo** aproveitando o multi-unidade.
- **Marketplace de templates** de roteiros, motivos e scripts por segmento.
- **IA preditiva como upsell**: módulo Thalí Pro com previsão de churn, recomendação de upsell, score de lead.
- **Integração WhatsApp Cloud API oficial** — desbloqueia volume.
- **White-label** para grupos hospitalares e operadoras.
- **LGPD compliance pack** como diferencial regulatório.

### Ameaças (Threats)
- **Concorrentes consolidados**: Zenvia, Take Blip, Octadesk, Huggy, Sirena, Kommo — todos com WhatsApp oficial e bases instaladas.
- **Big techs**: Meta lançando ferramentas nativas de atendimento no WhatsApp Business reduzem dor que justifica a compra.
- **Commoditização da IA**: GPT/Gemini direto via plugins tornam "assistente de IA" menos diferencial em 12-24 meses.
- **Custo de IA** escalando com volume se a Thalí ficar dependente de modelos premium.
- **Mudanças na política do WhatsApp** (preço, janelas, templates) podem inviabilizar modelos de negócio.
- **Risco de lock-in reverso**: profundidade do produto = alta fricção de onboarding = ciclo de venda longo.

---

## 3. Perfil Ideal de Cliente (ICP)

### Empresa
- **Segmento primário**: Clínicas e redes de saúde (odontologia, estética, oftalmologia, dermatologia, reprodução humana, medicina diagnóstica).
- **Segmento secundário**: Educação (escolas/cursos com captação ativa), imobiliárias de alto ticket, concessionárias, franquias de serviços.
- **Porte**: **Médio** — 30 a 300 funcionários, faturamento R$ 5M-R$ 80M/ano.
- **Estrutura**: 2 a 20 unidades, múltiplos setores (recepção, comercial, financeiro, pós-venda).
- **Volume de atendimento**: 1.500+ conversas/mês por unidade.

### Dor que paga
1. Perde lead por demora de resposta e falta de visibilidade do gestor.
2. Atendentes com qualidade desigual — gestor não consegue auditar nem padronizar.
3. Tem CRM, tem chat, tem telefonia — **mas nada conversa** e o relatório consolidado não existe.
4. Cresceu por unidades e perdeu controle operacional (TMA/TME, conversão por unidade, ranking).
5. Quer usar IA mas não sabe por onde começar.

### Decisor e influenciadores
- **Decisor**: Diretor de Operações, COO, ou sócio-proprietário em redes médias.
- **Comprador econômico**: CFO (foco em conversão comercial + produtividade).
- **Champion interno**: Gerente de atendimento / Supervisor de call center.
- **Usuário**: Atendentes (precisam que a Thalí simplifique, não atrapalhe).

### Sinais de fit (qualificação)
- ✅ Já usa WhatsApp como canal principal de vendas.
- ✅ Tem mais de 5 atendentes em escala.
- ✅ Possui pelo menos 2 unidades/filiais.
- ✅ Cobra metas de conversão dos atendentes (existe noção de funil).
- ✅ Já frustrou-se com Zendesk/RD/Pipedrive (genéricos demais) ou planilhas (caos).
- ✅ Tem alguém responsável por "qualidade de atendimento".

### Anti-ICP (não vender)
- ❌ MEI / micro com 1-3 atendentes (sobra produto, falta uso).
- ❌ E-commerce puro com volume massivo automatizado (precisa de bot, não de assistido).
- ❌ Empresa sem gestor dedicado a operação (ninguém para extrair valor dos relatórios).
- ❌ Setores altamente regulados que exijam on-premise (ex.: bancos tier-1).

---

## Principais pontos (resumo executivo)

> O **CONNECT** é uma plataforma omnichannel + CRM + gestão operacional com IA proprietária (**Thalí**), desenhada com profundidade de produto incomum — motivos cadastráveis multi-setor, relatórios customizáveis por atendente, auditoria nativa, monitoramento ao vivo com intervenção.
>
> **Forte** em profundidade operacional, IA integrada e multi-unidade. **Fraco** em integrações de canal externas (WhatsApp oficial, redes sociais) e em mobile. **Oportunidade clara** em redes de saúde de porte médio no Brasil. **Ameaça principal** é a comoditização da IA e a consolidação de concorrentes já com base instalada.
>
> **ICP**: rede de clínicas com 2-20 unidades, 30-300 colaboradores, 5+ atendentes em escala, gestor de operações dedicado e cultura de meta comercial. Decisor é o COO/sócio; champion é o supervisor de atendimento.
>
> **Próximos movimentos sugeridos**: (1) integração WhatsApp Cloud API oficial, (2) verticalização explícita em saúde com landing/cases, (3) modularização do produto para reduzir fricção de onboarding, (4) app mobile do atendente.
