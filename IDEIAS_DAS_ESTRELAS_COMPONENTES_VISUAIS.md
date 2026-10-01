# Ideias das Estrelas — Especificação Completa dos Componentes Visuais

## 1. Objetivo deste documento

Este documento descreve, de forma independente e detalhada, toda a experiência visual da funcionalidade **Ideias das Estrelas** do sistema CONNECT. Ele cobre as duas perspectivas da funcionalidade:

1. **Tela de Gestão** — ambiente usado por gestores e coordenadores para acompanhar, filtrar, aprovar ou reprovar ideias.
2. **Tela Meu Perfil** — ambiente usado pelo colaborador para enviar uma ideia, acompanhar suas próprias ideias, consultar ideias públicas do setor, votar e visualizar ideias aprovadas.

O foco é a composição visual, a hierarquia das informações, os componentes, estados, textos, comportamentos e relações entre as duas telas. A descrição pode ser usada como referência para desenho, prototipação ou reconstrução da interface.

---

## 2. Conceito visual da funcionalidade

**Ideias das Estrelas** é um canal interno de participação e reconhecimento. Visualmente, a experiência deve comunicar quatro ideias principais:

- **Participação:** qualquer colaborador pode propor melhorias e compartilhar sugestões.
- **Transparência:** o autor acompanha o estado da proposta e a resposta da coordenação.
- **Colaboração:** ideias públicas ficam visíveis para colegas do mesmo setor e podem receber votos.
- **Reconhecimento:** ideias aprovadas ou implementadas recebem destaque visual e ajudam a valorizar seus autores.

A linguagem visual combina o padrão institucional do CONNECT — interface clara, compacta e predominantemente azul — com cores semânticas para diferenciar tipos e estados. Estrelas, brilho, troféu e medalha são usados como símbolos de incentivo, sem transformar a tela em uma experiência infantil.

---

## 3. Vocabulário visual compartilhado

### 3.1 Tipos de envio

Cada registro possui um tipo, representado por texto e ícone:

| Tipo | Ícone | Papel visual |
|---|---|---|
| Ideia | Lâmpada | Representa uma proposta nova ou oportunidade de melhoria. |
| Sugestão | Estrela | Representa recomendação prática ou ajuste em algo existente. |
| Dúvida | Círculo com interrogação | Representa pergunta encaminhada à equipe ou coordenação. |
| Solicitação | Documento | Representa um pedido formal ou necessidade operacional. |

Na listagem, o tipo aparece em uma etiqueta compacta com contorno. O ícone recebe cor própria, enquanto o texto mantém boa legibilidade.

### 3.2 Estados da ideia

| Estado | Ícone | Cor semântica | Significado visual |
|---|---|---|---|
| Pendente | Relógio | Amarelo/alerta | Aguarda avaliação da coordenação. |
| Aprovada | Círculo com check | Verde/sucesso | Foi aceita pela coordenação. |
| Rejeitada | Círculo com X | Vermelho/erro | Não foi aceita. Pode conter justificativa. |
| Implementada | Brilhos | Azul institucional ou roxo de destaque | Já foi colocada em prática. É o nível máximo de reconhecimento. |

Os estados são exibidos como etiquetas com fundo suave, texto colorido, borda tonal e ícone pequeno. A cor nunca deve ser o único meio de diferenciação; o texto e o ícone permanecem sempre visíveis.

### 3.3 Visibilidade

A ideia possui uma das duas visibilidades:

- **Público:** representado pelo ícone de pessoas. Colegas do setor podem visualizar e votar.
- **Coordenação:** representado pelo cadeado. O conteúdo é privado e visível somente para gestão/coordenação e para o autor em seu histórico.

A visibilidade aparece como etiqueta de contorno nos cartões e como escolha destacada no formulário de envio.

### 3.4 Dados visuais de uma ideia

Um cartão completo pode apresentar:

- foto ou iniciais do autor;
- nome do autor;
- tipo;
- estado;
- visibilidade;
- data de envio;
- título;
- descrição;
- quantidade de votos “Bom”;
- quantidade de votos “Ruim”;
- voto atual do usuário, quando aplicável;
- resposta ou feedback da coordenação;
- indicação de autoria própria;
- indicação de destaque;
- ações administrativas, quando o usuário é gestor.

---

# PARTE I — IDEIAS DAS ESTRELAS NA TELA DE GESTÃO

## 4. Localização e acesso

A funcionalidade aparece no **Sistema de Gestão** do CONNECT.

Caminho visual:

```text
Sistema de Gestão
└── Menu lateral
    └── Controle
        └── Ideias das Estrelas
```

No menu lateral:

- o grupo é identificado pelo título **CONTROLE**, em caixa alta, pequeno e discreto;
- o item usa o ícone de **brilhos**;
- o texto do item é **Ideias das Estrelas**;
- no estado selecionado, o item recebe fundo azul muito claro, texto azul e peso de fonte maior;
- no estado normal, usa texto secundário e recebe fundo suave ao passar o cursor.

## 5. Estrutura geral da tela de gestão

A área de gestão ocupa o conteúdo principal à direita do menu lateral. A estrutura vertical é:

```text
Título da seção: [ícone de brilhos] Ideias das Estrelas

[Reconhecimento da Semana]

[Ideias em Destaque]

[Abas de listagem]                       [Filtros]

[Lista de cartões de ideias]

[Modal de aprovação ou reprovação, quando acionado]
```

A tela usa espaçamento vertical consistente entre blocos, fundo geral neutro e cartões com borda discreta. O conteúdo é rolável sem mover o cabeçalho principal do sistema.

## 6. Cabeçalho do conteúdo

O cabeçalho da área apresenta:

- ícone de brilhos em azul institucional;
- título **Ideias das Estrelas**;
- tipografia compacta e sem excesso de elementos;
- alinhamento horizontal entre ícone e título.

Ele serve apenas para identificar a seção. Não há subtítulo longo ou texto promocional ocupando o topo.

## 7. Bloco “Reconhecimento da Semana”

### 7.1 Finalidade

Destacar um colaborador e o motivo de seu reconhecimento, reforçando o aspecto de incentivo da funcionalidade.

### 7.2 Composição visual

O bloco é um cartão com:

- espaçamento interno médio;
- borda sutil;
- fundo amarelo muito suave;
- título pequeno e semibold;
- ícone de medalha/troféu em amarelo de alerta;
- uma área interna branca ou com fundo principal, separada por borda suave.

Dentro da área interna aparecem:

1. nome do colaborador em destaque;
2. motivo do reconhecimento em texto menor e secundário.

Exemplo visual:

```text
🏅 Reconhecimento da Semana
┌──────────────────────────────────────────┐
│ Emilly                                   │
│ Melhor evolução de NPS                   │
└──────────────────────────────────────────┘
```

O bloco deve ser percebido como reconhecimento institucional, não como um alerta operacional.

## 8. Bloco “Ideias em Destaque”

### 8.1 Regra de exibição

O bloco só aparece quando existem ideias marcadas como destaque e com estado **Aprovada** ou **Implementada**.

### 8.2 Aparência do bloco

- cartão com borda azul suave;
- fundo azul muito claro;
- título com estrela preenchida em azul;
- grade responsiva de cartões internos;
- uma coluna em telas estreitas e duas colunas em telas médias ou maiores.

### 8.3 Cartão interno de destaque

Cada ideia destacada apresenta:

- ícone de brilhos em amarelo;
- nome do autor;
- etiqueta de estado;
- título da ideia;
- descrição limitada visualmente a duas linhas;
- ícone de aprovação positiva e contagem de votos.

Esses cartões internos usam fundo principal e borda azul clara. São mais compactos do que os cartões da listagem geral e funcionam como uma vitrine.

## 9. Barra de abas e filtros

A navegação da lista é dividida entre abas à esquerda e filtros à direita. Em larguras menores, os elementos quebram para uma nova linha sem sobreposição.

### 9.1 Abas

Existem três abas:

1. **Pendentes** — aba inicial.
2. **Todas** — reúne todos os estados.
3. **Aprovadas** — reúne ideias aprovadas e implementadas.

A aba **Pendentes** inclui:

- ícone de relógio;
- contador compacto com a quantidade pendente;
- destaque visual quando selecionada.

### 9.2 Filtro de visibilidade

Controle de seleção com largura compacta. Opções:

- Todas;
- Coordenação, com cadeado;
- Público, com ícone de pessoas.

### 9.3 Filtro de tipo

Controle de seleção com opções:

- Todos;
- Ideia;
- Sugestão;
- Dúvida;
- Solicitação.

### 9.4 Filtro de estado

Controle de seleção com opções:

- Todos;
- Pendente;
- Aprovada;
- Implementada;
- Rejeitada.

### 9.5 Comportamento combinado

Os três filtros atuam simultaneamente. A lista visível precisa respeitar:

- a aba selecionada;
- a visibilidade escolhida;
- o tipo escolhido;
- o estado escolhido.

A aplicação é imediata; não existe botão adicional “Aplicar”.

## 10. Cartão de ideia na gestão

### 10.1 Estrutura

O cartão administrativo é horizontal e compacto:

```text
[Avatar] [Autor] [Tipo] [Estado] [Visibilidade] [Data]
         Título da ideia
         Descrição resumida
         [Resposta da Coordenação, se existir]
         [Bom] [Ruim]                         [Reprovar] [Aprovar]
```

### 10.2 Avatar

- formato circular;
- tamanho pequeno;
- quando não existe foto, exibe as duas primeiras letras do nome;
- fallback com fundo azul claro e texto azul.

### 10.3 Linha de metadados

A primeira linha combina:

- nome do autor em semibold;
- etiqueta do tipo;
- etiqueta do estado;
- etiqueta de visibilidade;
- data em texto pequeno e secundário.

A linha permite quebra para acomodar telas menores.

### 10.4 Conteúdo

- título com peso médio;
- descrição em texto secundário;
- descrição limitada a duas linhas na visão compacta;
- o cartão preserva a hierarquia mesmo quando o texto é longo.

### 10.5 Tratamento por estado

- ideia em **Pendente**: borda amarela e fundo amarelo muito suave;
- ideia em **Destaque**: borda azul e fundo azul muito suave;
- demais estados: fundo principal e borda neutra.

### 10.6 Resposta da coordenação

Quando existe resposta, aparece uma caixa interna abaixo da descrição:

- fundo azul muito claro;
- borda azul suave;
- ícone de balão de conversa;
- rótulo **Resposta da Coordenação**;
- texto da resposta em primeiro plano.

### 10.7 Indicadores de votação

Na base esquerda do cartão aparecem:

- ícone de polegar para cima + contagem;
- ícone de polegar para baixo + contagem.

Na tela de gestão, esses indicadores são informativos; não atuam como botões de votação.

### 10.8 Ações de avaliação

Somente ideias pendentes mostram, à direita:

- **Reprovar:** botão de contorno vermelho, com ícone de X;
- **Aprovar:** botão preenchido em verde, com ícone de check.

As ações são compactas e posicionadas no rodapé do cartão. Ideias já avaliadas não exibem esses botões.

## 11. Estado vazio da aba Pendentes

Quando não existem ideias pendentes após considerar os filtros, aparece um cartão centralizado com:

- ícone grande de check em verde;
- mensagem **Nenhuma ideia pendente!**;
- texto de apoio **Todas as ideias foram analisadas.**

O estado vazio mantém o mesmo espaço visual da listagem e comunica conclusão, não erro.

## 12. Modal de aprovação e reprovação

### 12.1 Abertura

Clicar em **Aprovar** ou **Reprovar** abre um modal central de largura média.

### 12.2 Título dinâmico

Para aprovação:

- ícone verde de check;
- título **Aprovar Ideia**.

Para reprovação:

- ícone vermelho de X;
- título **Reprovar Ideia**.

### 12.3 Campo de feedback

O modal contém:

- rótulo **Feedback para o autor (opcional)**;
- área de texto com quatro linhas;
- texto de exemplo adaptado à ação.

Exemplos:

- aprovação: “Parabéns! Sua ideia foi muito bem recebida...”;
- reprovação: “Explique o motivo da reprovação...”.

### 12.4 Rodapé

- botão secundário **Cancelar**;
- botão principal dinâmico:
  - **Confirmar Aprovação**, verde;
  - **Confirmar Reprovação**, vermelho.

Ao confirmar, o cartão muda de estado e, se houver texto, passa a mostrar a resposta da coordenação.

---

# PARTE II — IDEIAS DAS ESTRELAS EM “MEU PERFIL”

## 13. Localização e acesso

A experiência do colaborador fica dentro do modal **Meu Perfil**, aberto pelo avatar do usuário na tela principal.

Caminho visual:

```text
Avatar do usuário
└── Meu Perfil
    └── Ideias das Estrelas
```

O modal tem largura máxima média/grande e altura limitada à janela. O conteúdo interno usa rolagem própria.

## 14. Primeiro nível de abas do modal

No topo do modal existem duas abas de mesma largura:

1. **Dados Pessoais**, com ícone de usuário;
2. **Ideias das Estrelas**, com estrela amarela preenchida.

A estrela preenchida reforça a identidade da funcionalidade. O título geral do modal continua sendo **Meu Perfil**.

## 15. Segundo nível de abas

Dentro de **Ideias das Estrelas**, há três áreas:

1. **Enviar**, com ícone de envio;
2. **Setor**, com ícone de pessoas;
3. **Aprovadas**, com ícone de troféu.

Em telas maiores, os textos aparecem ao lado dos ícones. Em telas estreitas, os textos podem ficar ocultos e os ícones permanecem como referência visual.

---

## 16. Aba “Enviar”

A área possui rolagem interna e duas seções:

1. formulário **Nova Ideia**;
2. histórico **Minhas Ideias Enviadas**.

## 17. Cartão “Nova Ideia”

### 17.1 Aparência

- cartão com espaçamento interno confortável;
- borda azul suave;
- fundo azul muito claro;
- título **Nova Ideia**;
- estrela amarela preenchida ao lado do título.

### 17.2 Escolha “Enviar para”

A escolha de destino usa dois cartões selecionáveis lado a lado.

#### Público

- ícone de pessoas em azul;
- título **Público**;
- descrição **Colegas podem ver e curtir**.

#### Coordenação

- ícone de cadeado em laranja;
- título **Coordenação**;
- descrição **Privado, só gestão vê**.

#### Estado selecionado

O cartão escolhido recebe:

- borda azul mais forte;
- fundo azul suave;
- seletor circular marcado.

O cartão não selecionado mantém borda neutra e realça a borda ao passar o cursor.

### 17.3 Escolha do tipo

O tipo é apresentado como grupo de quatro botões:

- Ideia;
- Sugestão;
- Dúvida;
- Solicitação.

Cada botão inclui seu ícone. O tipo ativo usa preenchimento azul escuro/institucional; os outros usam contorno e preservam a cor do ícone correspondente.

### 17.4 Campo “Título”

- rótulo **Título**;
- campo de uma linha;
- exemplo **Resumo breve...**.

### 17.5 Campo “Descrição”

- rótulo **Descrição**;
- campo de múltiplas linhas;
- exemplo **Descreva com detalhes...**;
- altura inicial aproximada de três linhas.

### 17.6 Botão de envio

- ocupa toda a largura;
- fundo azul escuro;
- ícone de envio;
- texto **Enviar Ideia**;
- fica desabilitado enquanto título ou descrição estiverem vazios.

Após o envio, os campos retornam ao padrão inicial e a nova ideia aparece no início de **Minhas Ideias Enviadas**. Se a visibilidade for pública, também aparece em **Setor**.

## 18. Seção “Minhas Ideias Enviadas”

### 18.1 Cabeçalho

- ícone de lâmpada azul;
- título **Minhas Ideias Enviadas**.

### 18.2 Cartão simples da própria ideia

O cartão apresenta:

- etiquetas de tipo, estado e visibilidade;
- data alinhada no extremo direito;
- título;
- descrição resumida em até duas linhas;
- resposta da coordenação, quando existir;
- votos positivos e negativos somente quando a ideia for pública.

Não existem botões de voto no próprio cartão do autor.

### 18.3 Resposta da coordenação

A resposta aparece em caixa interna azul clara com:

- ícone de conversa;
- rótulo **Resposta da Coordenação**;
- conteúdo textual.

### 18.4 Estado vazio

Quando o colaborador não possui ideias:

- lâmpada grande com baixa opacidade;
- mensagem **Você ainda não enviou nenhuma ideia.**;
- orientação **Use o formulário acima para compartilhar suas sugestões!**

---

## 19. Aba “Setor”

### 19.1 Cabeçalho

- ícone de pessoas em azul;
- título **Ideias Públicas do Setor**;
- texto de apoio convidando o colaborador a consultar e votar nas ideias dos colegas.

A lista deve conter somente ideias públicas pertinentes ao setor do usuário.

### 19.2 Cartão votável

Estrutura:

```text
[Avatar] Autor [Tipo] [Estado] Data
         Título
         Descrição
         [Bom (n)] [Ruim (n)]
```

Elementos:

- avatar circular médio;
- nome do autor em semibold;
- etiqueta do tipo;
- etiqueta do estado;
- data em texto secundário;
- título;
- descrição limitada a duas linhas;
- ações de voto no rodapé.

### 19.3 Realce de ideias aprovadas e implementadas

- **Aprovada:** borda verde e fundo verde muito suave;
- **Implementada:** borda roxa e fundo roxo muito suave;
- demais ideias: cartão neutro.

Ao passar o cursor, o cartão recebe sombra discreta.

### 19.4 Botões “Bom” e “Ruim”

Para ideias de outros autores:

- **Bom (quantidade):** botão leve com polegar para cima;
- **Ruim (quantidade):** botão leve com polegar para baixo.

Quando selecionado:

- Bom recebe texto verde e fundo verde suave;
- Ruim recebe texto vermelho e fundo vermelho suave.

O usuário pode:

- votar em uma opção;
- trocar de opção;
- clicar novamente na mesma opção para retirar o voto.

### 19.5 Ideia do próprio usuário

O autor não pode votar em sua própria ideia. Nesse caso, os botões são substituídos por:

- contagem de votos positivos;
- contagem de votos negativos;
- indicação em itálico **(sua ideia)**.

### 19.6 Estado vazio

Quando não há ideias públicas no setor:

- ícone grande de pessoas com baixa opacidade;
- mensagem **Nenhuma ideia pública no setor ainda.**

---

## 20. Aba “Aprovadas”

### 20.1 Conteúdo

A aba combina:

- ideias aprovadas ou implementadas do próprio usuário;
- ideias aprovadas ou implementadas dos colegas;
- sem duplicar a ideia do usuário na parte importada da lista do setor.

### 20.2 Cabeçalho

- ícone de troféu amarelo;
- título **Ideias Aprovadas**;
- texto celebrativo convidando o usuário a conferir o que foi aprovado pela coordenação.

### 20.3 Cartão de reconhecimento

O cartão recebe borda mais visível do que os cartões comuns:

- ideia aprovada: borda verde e fundo verde muito claro;
- ideia implementada: borda roxa e fundo roxo muito claro.

Apresenta:

- avatar;
- etiqueta **Sua ideia!**, quando pertence ao usuário atual;
- nome do autor;
- estado Aprovada ou Implementada com ícone;
- título;
- descrição;
- feedback da coordenação, quando houver;
- quantidade de votos positivos;
- data de envio.

A etiqueta **Sua ideia!** usa azul institucional preenchido para facilitar o reconhecimento imediato.

### 20.4 Estado vazio

Quando não há ideias aprovadas:

- troféu grande com baixa opacidade;
- mensagem **Nenhuma ideia aprovada ainda.**;
- incentivo **Continue enviando suas ideias!**

---

# PARTE III — RELAÇÃO ENTRE AS DUAS EXPERIÊNCIAS

## 21. Fluxo visual completo

```text
COLABORADOR — MEU PERFIL
Seleciona destino + tipo + título + descrição
                 │
                 ▼
Nova ideia aparece em “Minhas Ideias Enviadas” como Pendente
                 │
                 ├── Se Público: também aparece para colegas na aba “Setor”
                 │
                 ▼
GESTÃO — IDEIAS DAS ESTRELAS
Ideia aparece na aba “Pendentes”
                 │
          ┌──────┴──────┐
          ▼             ▼
       Aprovar        Reprovar
          │             │
          ▼             ▼
Feedback opcional é registrado pela coordenação
          │             │
          ▼             ▼
COLABORADOR acompanha novo estado e resposta em “Minhas Ideias”
          │
          └── Se aprovada/implementada: entra também em “Aprovadas”
```

## 22. Correspondência dos componentes

| Informação/ação | Meu Perfil | Gestão |
|---|---|---|
| Criar ideia | Sim | Não |
| Escolher Público/Coordenação | Sim | Filtro e leitura |
| Escolher tipo | Sim | Filtro e leitura |
| Ver próprias ideias | Sim | Gestor vê todas |
| Ver ideias do setor | Sim, somente públicas | Sim, conforme filtros |
| Votar Bom/Ruim | Sim, nas ideias dos colegas | Apenas consulta contagens |
| Aprovar/Reprovar | Não | Sim |
| Escrever feedback | Não | Sim |
| Ler resposta da coordenação | Sim | Sim |
| Ver destaques | Na aba Aprovadas | Bloco próprio no topo |
| Reconhecimento da semana | Não | Sim |

---

# PARTE IV — PADRÕES DE INTERFACE

## 23. Hierarquia tipográfica

A interface utiliza a tipografia padrão do CONNECT, sem fontes decorativas.

- títulos de seção: pequenos, semibold e objetivos;
- títulos de cartões: peso médio ou semibold;
- metadados, datas e etiquetas: tipografia reduzida;
- descrições: texto secundário, com boa altura de linha;
- feedback: texto em primeiro plano dentro de caixa tonal.

A tela de gestão é mais densa e compacta. O modal do perfil usa controles ligeiramente maiores por conter formulários e ações do colaborador.

## 24. Paleta funcional

- **Azul institucional:** navegação ativa, ações principais, seleção, respostas da coordenação e elementos da marca.
- **Amarelo:** estrela, reconhecimento e pendências.
- **Verde:** aprovação, sucesso e ideias aprovadas.
- **Vermelho:** reprovação e votos negativos.
- **Roxo:** ideias implementadas no perfil do colaborador.
- **Cinza/neutro:** textos secundários, bordas, datas e estados inativos.

Fundos semânticos devem ser claros e de baixa intensidade, preservando a leitura. Cores fortes ficam reservadas para ícones, textos importantes e botões de confirmação.

## 25. Iconografia

Os ícones são lineares, pequenos e consistentes. Principais símbolos:

- brilhos: identidade da funcionalidade e estado implementado;
- estrela: ideia, destaque e incentivo;
- lâmpada: criação de ideia;
- medalha/troféu: reconhecimento;
- pessoas: conteúdo público/setor;
- cadeado: conteúdo privado para coordenação;
- relógio: pendente;
- check: aprovado;
- X: rejeitado;
- conversa: resposta da coordenação;
- polegares: votos;
- documento: solicitação;
- interrogação: dúvida;
- avião/seta de envio: envio da ideia.

## 26. Cartões e bordas

- cantos discretamente arredondados;
- borda fina como separação principal;
- sombra usada com moderação, principalmente em interação;
- fundos tonais indicam estado ou prioridade;
- cartões internos não devem parecer desconectados do cartão principal;
- textos longos são truncados na listagem para manter densidade e ritmo visual.

## 27. Responsividade

### Gestão

- o menu lateral permanece como estrutura de navegação em desktop;
- a grade de destaques passa de duas para uma coluna em telas estreitas;
- abas e filtros quebram linha;
- metadados dos cartões permitem quebra;
- ações de aprovação permanecem acessíveis sem sobrepor o texto.

### Meu Perfil

- o modal respeita a altura disponível e usa rolagem interna;
- as duas opções de destino permanecem visualmente comparáveis;
- no segundo nível de abas, textos podem ser ocultados em telas pequenas, mantendo os ícones;
- botões de tipo devem quebrar ou reorganizar sem comprimir o texto;
- cartões votáveis mantêm contagens legíveis.

## 28. Estados interativos

Todo controle precisa apresentar:

- estado normal;
- foco visível para navegação por teclado;
- estado de passagem do cursor;
- estado selecionado;
- estado desabilitado, quando aplicável;
- resposta visual imediata após clique.

Exemplos:

- destino selecionado muda borda e fundo;
- tipo selecionado vira botão preenchido;
- voto selecionado recebe cor semântica;
- botão Enviar fica desabilitado sem conteúdo obrigatório;
- abas deixam evidente qual conteúdo está ativo;
- aprovação/reprovação abre modal antes da alteração final.

## 29. Acessibilidade visual

- ícone sempre acompanhado de texto em ações críticas;
- estado nunca comunicado apenas por cor;
- contraste suficiente entre texto e fundo tonal;
- áreas clicáveis confortáveis;
- foco de teclado visível;
- campos com rótulos persistentes;
- modal com título explícito;
- conteúdo rolável sem esconder ações essenciais;
- textos truncados devem permitir uma futura visualização completa quando necessário.

---

# PARTE V — ESTADOS E CONTEÚDOS NECESSÁRIOS

## 30. Estados que precisam ser previstos

### Estado inicial

- Gestão abre em **Pendentes**.
- Meu Perfil abre em **Enviar** dentro de Ideias das Estrelas.
- Formulário inicia em tipo **Ideia** e visibilidade **Público**.

### Carregamento

Mesmo quando os dados forem integrados a uma fonte externa, preservar a estrutura da tela com esqueletos visuais para:

- blocos de destaque;
- filtros;
- cartões da listagem;
- contadores.

### Sem resultados por filtro

Diferenciar:

- não há itens cadastrados;
- existem itens, mas nenhum corresponde aos filtros;
- não há pendências porque todas foram analisadas.

### Erro de carregamento

Exibir mensagem clara com ação de tentar novamente, sem remover permanentemente filtros e navegação.

### Envio em andamento

No botão **Enviar Ideia**:

- manter largura;
- substituir texto por estado de envio;
- bloquear novos cliques até concluir.

### Envio concluído

- limpar o formulário;
- inserir a ideia no topo do histórico;
- mostrar confirmação breve;
- manter o usuário na funcionalidade.

### Aprovação ou reprovação concluída

- fechar o modal;
- atualizar a etiqueta do cartão;
- remover o item de Pendentes quando deixar de ser pendente;
- manter o novo item disponível em Todas;
- aprovado também passa a integrar Aprovadas.

---

## 31. Inventário consolidado de componentes

### Componentes da Gestão

1. Item “Ideias das Estrelas” no menu lateral.
2. Cabeçalho da seção.
3. Cartão Reconhecimento da Semana.
4. Cartão Ideias em Destaque.
5. Mini cartões de destaque.
6. Abas Pendentes, Todas e Aprovadas.
7. Contador de pendências.
8. Filtro de visibilidade.
9. Filtro de tipo.
10. Filtro de estado.
11. Cartão administrativo de ideia.
12. Avatar/fallback de autor.
13. Etiqueta de tipo.
14. Etiqueta de estado.
15. Etiqueta de visibilidade.
16. Indicadores de votos.
17. Caixa de resposta da coordenação.
18. Botões Aprovar e Reprovar.
19. Estado vazio de pendências.
20. Modal de aprovação/reprovação.
21. Campo de feedback.
22. Botões Cancelar e Confirmar.

### Componentes de Meu Perfil

1. Modal Meu Perfil.
2. Aba principal Ideias das Estrelas.
3. Abas Enviar, Setor e Aprovadas.
4. Cartão Nova Ideia.
5. Seletor de destino Público/Coordenação.
6. Seletor de tipo em quatro botões.
7. Campo Título.
8. Campo Descrição.
9. Botão Enviar Ideia.
10. Seção Minhas Ideias Enviadas.
11. Cartão simples da própria ideia.
12. Estado vazio das próprias ideias.
13. Cabeçalho Ideias Públicas do Setor.
14. Cartão votável.
15. Botões Bom e Ruim.
16. Estado de voto selecionado.
17. Estado de ideia própria sem votação.
18. Estado vazio do setor.
19. Cabeçalho Ideias Aprovadas.
20. Cartão de reconhecimento aprovado/implementado.
21. Etiqueta Sua ideia!.
22. Caixa de feedback da coordenação.
23. Estado vazio das aprovadas.

---

## 32. Observação sobre o estado atual da funcionalidade

A composição visual e as interações descritas estão representadas na interface atual. As ideias, aprovações, votos e reconhecimentos exibidos são demonstrações mantidas no estado da própria tela. Para uso real compartilhado entre colaboradores e gestão, a mesma experiência visual precisa ser conectada a uma fonte persistente, com regras de acesso por usuário, setor, coordenação e visibilidade.

Essa observação é importante ao reutilizar este documento: ele especifica integralmente a tela e seus comportamentos visuais, mas a persistência e a sincronização dos registros devem ser tratadas pela integração escolhida no projeto de destino.
