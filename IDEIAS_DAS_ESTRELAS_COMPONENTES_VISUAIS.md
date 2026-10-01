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

---

# PARTE VI — CÓDIGO REACT DOS COMPONENTES

## 33. Observações para reutilização

Os exemplos abaixo correspondem aos componentes React usados atualmente no CONNECT. Eles utilizam TypeScript, utilitários de estilo, ícones e componentes visuais já disponíveis no projeto. O componente de **Meu Perfil** inclui também a aba de dados pessoais porque a área **Ideias das Estrelas** está integrada ao mesmo modal.

Ao levar estes componentes para outro projeto, será necessário adaptar os caminhos das importações e conectar ideias, votos, estados e respostas à fonte de dados desse projeto.

## 34. Componente React — Tela de Gestão

Arquivo de referência: `CentralIdeiasPanel.tsx`

```tsx
import { useState } from "react";
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Lightbulb,
  Star,
  ThumbsUp,
  ThumbsDown,
  Award,
  MessageCircle,
  HelpCircle,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles,
  Users,
  Lock,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useAtendenteContext } from "@/contexts/AtendenteContext";

type TipoEnvio = "ideia" | "sugestao" | "duvida" | "solicitacao";
type StatusIdeia = "pendente" | "aprovada" | "rejeitada" | "implementada";
type Visibilidade = "coordenacao" | "publico";

interface Ideia {
  id: string;
  autor: string;
  avatar?: string;
  tipo: TipoEnvio;
  titulo: string;
  descricao: string;
  status: StatusIdeia;
  visibilidade: Visibilidade;
  curtidas: number;
  descurtidas: number;
  meuVoto?: "up" | "down";
  dataEnvio: string;
  destaque?: boolean;
  respostaCoordenador?: string;
}

const ideiasSimuladas: Ideia[] = [
  {
    id: "1",
    autor: "Paloma",
    tipo: "ideia",
    titulo: "Scripts automáticos de resposta rápida",
    descricao: "Criar templates de respostas rápidas que podem ser personalizados por cada atendente, agilizando o atendimento.",
    status: "implementada",
    visibilidade: "publico",
    curtidas: 15,
    descurtidas: 1,
    dataEnvio: "15/01/2026",
    destaque: true,
  },
  {
    id: "2",
    autor: "Marcos",
    tipo: "sugestao",
    titulo: "Otimizar fila com Thalí",
    descricao: "Utilizar a IA para redistribuir automaticamente pacientes quando um atendente fica sobrecarregado.",
    status: "aprovada",
    visibilidade: "publico",
    curtidas: 12,
    descurtidas: 2,
    dataEnvio: "12/01/2026",
    destaque: true,
  },
  {
    id: "3",
    autor: "Emilly",
    tipo: "ideia",
    titulo: "Modo escuro mais suave",
    descricao: "Ajustar as cores do modo escuro para serem mais confortáveis durante uso prolongado.",
    status: "aprovada",
    visibilidade: "publico",
    curtidas: 8,
    descurtidas: 0,
    dataEnvio: "10/01/2026",
  },
  {
    id: "4",
    autor: "Geovana",
    tipo: "duvida",
    titulo: "Como acessar relatórios antigos?",
    descricao: "Gostaria de saber onde encontro os relatórios de meses anteriores.",
    status: "aprovada",
    visibilidade: "coordenacao",
    curtidas: 3,
    descurtidas: 0,
    dataEnvio: "08/01/2026",
    respostaCoordenador: "Você pode acessar no Painel Estratégico > Relatórios > Histórico.",
  },
  {
    id: "5",
    autor: "Bianca",
    tipo: "solicitacao",
    titulo: "Solicitar férias em Março",
    descricao: "Gostaria de solicitar férias no período de 15/03 a 30/03.",
    status: "pendente",
    visibilidade: "coordenacao",
    curtidas: 0,
    descurtidas: 0,
    dataEnvio: "05/01/2026",
  },
  {
    id: "6",
    autor: "Pedro",
    tipo: "ideia",
    titulo: "Atalhos de teclado personalizados",
    descricao: "Permitir que cada atendente configure seus próprios atalhos de teclado para ações frequentes.",
    status: "pendente",
    visibilidade: "publico",
    curtidas: 5,
    descurtidas: 1,
    dataEnvio: "18/01/2026",
  },
];

const tiposEnvio = [
  { value: "ideia", label: "Ideia", icon: Lightbulb, cor: "text-warning" },
  { value: "sugestao", label: "Sugestão", icon: Star, cor: "text-primary" },
  { value: "duvida", label: "Dúvida", icon: HelpCircle, cor: "text-primary" },
  { value: "solicitacao", label: "Solicitação", icon: FileText, cor: "text-success" },
];

const statusConfig = {
  pendente: { label: "Pendente", icon: Clock, cor: "bg-warning/10 text-warning border-warning/20" },
  aprovada: { label: "Aprovada", icon: CheckCircle, cor: "bg-success/10 text-success border-success/20" },
  rejeitada: { label: "Rejeitada", icon: XCircle, cor: "bg-destructive/10 text-destructive border-destructive/20" },
  implementada: { label: "Implementada", icon: Sparkles, cor: "bg-primary/10 text-primary border-primary/20" },
};

export const CentralIdeiasPanel = () => {
  const { isCoordenacao, isGestor } = useAtendenteContext();
  const [ideias, setIdeias] = useState<Ideia[]>(ideiasSimuladas);
  const [filtroStatus, setFiltroStatus] = useState<string>("todas");
  const [filtroTipo, setFiltroTipo] = useState<string>("todos");
  const [filtroVisibilidade, setFiltroVisibilidade] = useState<string>("todas");
  
  const [feedbackDialog, setFeedbackDialog] = useState<{
    open: boolean;
    ideiaId: string;
    acao: "aprovar" | "reprovar";
  }>({ open: false, ideiaId: "", acao: "aprovar" });
  const [feedbackTexto, setFeedbackTexto] = useState("");

  const handleAprovar = (ideiaId: string) => {
    setFeedbackDialog({ open: true, ideiaId, acao: "aprovar" });
    setFeedbackTexto("");
  };

  const handleReprovar = (ideiaId: string) => {
    setFeedbackDialog({ open: true, ideiaId, acao: "reprovar" });
    setFeedbackTexto("");
  };

  const confirmarAcao = () => {
    setIdeias(prev => prev.map(ideia => {
      if (ideia.id === feedbackDialog.ideiaId) {
        return {
          ...ideia,
          status: feedbackDialog.acao === "aprovar" ? "aprovada" : "rejeitada",
          respostaCoordenador: feedbackTexto.trim() || undefined,
        };
      }
      return ideia;
    }));
    setFeedbackDialog({ open: false, ideiaId: "", acao: "aprovar" });
    setFeedbackTexto("");
  };

  const ideiasFiltradas = ideias.filter(ideia => {
    if (filtroStatus !== "todas" && ideia.status !== filtroStatus) return false;
    if (filtroTipo !== "todos" && ideia.tipo !== filtroTipo) return false;
    if (filtroVisibilidade !== "todas" && ideia.visibilidade !== filtroVisibilidade) return false;
    return true;
  });

  const ideiasDestaque = ideias.filter(i => i.destaque && (i.status === "aprovada" || i.status === "implementada"));
  const reconhecimentoSemana = { usuario: "Emilly", motivo: "Melhor evolução de NPS" };
  const totalPendentes = ideias.filter(i => i.status === "pendente").length;

  return (
    <div className="space-y-5">
      {/* Reconhecimento da Semana */}
      <Card className="p-5 border-border/60 bg-warning/5">
        <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
          <Award className="h-3.5 w-3.5 text-warning" />
          Reconhecimento da Semana
        </h4>
        <div className="p-3 bg-background rounded-lg border border-border/40">
          <div className="text-sm font-semibold mb-0.5">{reconhecimentoSemana.usuario}</div>
          <p className="text-xs text-muted-foreground">{reconhecimentoSemana.motivo}</p>
        </div>
      </Card>

      {/* Ideias em Destaque */}
      {ideiasDestaque.length > 0 && (
        <Card className="p-5 border-primary/20 bg-primary/5">
          <h4 className="text-xs font-semibold mb-3 flex items-center gap-1.5">
            <Star className="h-3.5 w-3.5 text-primary fill-primary" />
            Ideias em Destaque
          </h4>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {ideiasDestaque.map((ideia) => {
              const StatusIcon = statusConfig[ideia.status].icon;
              return (
                <div key={ideia.id} className="p-3 rounded-lg bg-background border border-primary/20">
                  <div className="flex items-center gap-2 mb-1.5">
                    <Sparkles className="h-3 w-3 text-warning" />
                    <span className="text-xs font-semibold">{ideia.autor}</span>
                    <Badge className={cn("text-[10px]", statusConfig[ideia.status].cor)}>
                      <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
                      {statusConfig[ideia.status].label}
                    </Badge>
                  </div>
                  <h5 className="text-xs font-medium mb-1">{ideia.titulo}</h5>
                  <p className="text-[10px] text-muted-foreground line-clamp-2">{ideia.descricao}</p>
                  <div className="flex items-center gap-2 mt-2 text-[10px] text-muted-foreground">
                    <span className="flex items-center gap-0.5">
                      <ThumbsUp className="h-2.5 w-2.5" /> {ideia.curtidas}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </Card>
      )}

      {/* Tabs e Filtros */}
      <Tabs defaultValue="pendentes" className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <TabsList>
            <TabsTrigger value="pendentes" className="text-xs gap-1">
              <Clock className="h-3 w-3" />
              Pendentes
              {totalPendentes > 0 && (
                <Badge variant="secondary" className="ml-1 h-4 px-1 text-[10px]">
                  {totalPendentes}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="todas" className="text-xs">Todas</TabsTrigger>
            <TabsTrigger value="aprovadas" className="text-xs">Aprovadas</TabsTrigger>
          </TabsList>

          <div className="flex gap-2 flex-wrap">
            <Select value={filtroVisibilidade} onValueChange={setFiltroVisibilidade}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Visibilidade" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todas</SelectItem>
                <SelectItem value="coordenacao">
                  <span className="flex items-center gap-1">
                    <Lock className="h-3 w-3" /> Coordenação
                  </span>
                </SelectItem>
                <SelectItem value="publico">
                  <span className="flex items-center gap-1">
                    <Users className="h-3 w-3" /> Público
                  </span>
                </SelectItem>
              </SelectContent>
            </Select>

            <Select value={filtroTipo} onValueChange={setFiltroTipo}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos</SelectItem>
                {tiposEnvio.map(tipo => (
                  <SelectItem key={tipo.value} value={tipo.value}>
                    {tipo.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Select value={filtroStatus} onValueChange={setFiltroStatus}>
              <SelectTrigger className="w-32 h-8 text-xs">
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todas">Todos</SelectItem>
                <SelectItem value="pendente">Pendente</SelectItem>
                <SelectItem value="aprovada">Aprovada</SelectItem>
                <SelectItem value="implementada">Implementada</SelectItem>
                <SelectItem value="rejeitada">Rejeitada</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <TabsContent value="pendentes" className="space-y-3">
          {ideiasFiltradas
            .filter(i => i.status === "pendente")
            .map((ideia) => (
              <IdeiaCardGestao 
                key={ideia.id} 
                ideia={ideia}
                onAprovar={handleAprovar}
                onReprovar={handleReprovar}
              />
            ))}
          {ideiasFiltradas.filter(i => i.status === "pendente").length === 0 && (
            <Card className="p-8 text-center text-muted-foreground border-border/60">
              <CheckCircle className="h-10 w-10 mx-auto mb-3 text-success" />
              <p className="text-sm font-medium">Nenhuma ideia pendente!</p>
              <p className="text-xs">Todas as ideias foram analisadas.</p>
            </Card>
          )}
        </TabsContent>

        <TabsContent value="todas" className="space-y-3">
          {ideiasFiltradas.map((ideia) => (
            <IdeiaCardGestao 
              key={ideia.id} 
              ideia={ideia}
              onAprovar={ideia.status === "pendente" ? handleAprovar : undefined}
              onReprovar={ideia.status === "pendente" ? handleReprovar : undefined}
            />
          ))}
        </TabsContent>

        <TabsContent value="aprovadas" className="space-y-3">
          {ideiasFiltradas
            .filter(i => i.status === "aprovada" || i.status === "implementada")
            .map((ideia) => (
              <IdeiaCardGestao 
                key={ideia.id} 
                ideia={ideia}
              />
            ))}
        </TabsContent>
      </Tabs>

      {/* Dialog Feedback/Resposta */}
      <Dialog open={feedbackDialog.open} onOpenChange={(open) => !open && setFeedbackDialog({ open: false, ideiaId: "", acao: "aprovar" })}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle className="text-sm flex items-center gap-2">
              {feedbackDialog.acao === "aprovar" ? (
                <>
                  <CheckCircle className="h-4 w-4 text-success" />
                  Aprovar Ideia
                </>
              ) : (
                <>
                  <XCircle className="h-4 w-4 text-destructive" />
                  Reprovar Ideia
                </>
              )}
            </DialogTitle>
          </DialogHeader>

          <div className="space-y-4 py-4">
            <div>
              <label className="text-xs font-medium mb-2 block">
                Feedback para o autor (opcional)
              </label>
              <Textarea
                placeholder={
                  feedbackDialog.acao === "aprovar" 
                    ? "Parabéns! Sua ideia foi muito bem recebida..."
                    : "Explique o motivo da reprovação..."
                }
                rows={4}
                className="text-xs"
                value={feedbackTexto}
                onChange={(e) => setFeedbackTexto(e.target.value)}
              />
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" size="sm" className="h-8 text-xs" onClick={() => setFeedbackDialog({ open: false, ideiaId: "", acao: "aprovar" })}>
              Cancelar
            </Button>
            <Button 
              size="sm"
              className={cn("h-8 text-xs", feedbackDialog.acao === "aprovar" ? "bg-success hover:bg-success/90" : "bg-destructive hover:bg-destructive/90")}
              onClick={confirmarAcao}
            >
              {feedbackDialog.acao === "aprovar" ? (
                <>
                  <CheckCircle className="h-3.5 w-3.5 mr-1" />
                  Confirmar Aprovação
                </>
              ) : (
                <>
                  <XCircle className="h-3.5 w-3.5 mr-1" />
                  Confirmar Reprovação
                </>
              )}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

interface IdeiaCardGestaoProps {
  ideia: Ideia;
  onAprovar?: (id: string) => void;
  onReprovar?: (id: string) => void;
}

const IdeiaCardGestao = ({ ideia, onAprovar, onReprovar }: IdeiaCardGestaoProps) => {
  const tipoInfo = tiposEnvio.find(t => t.value === ideia.tipo);
  const TipoIcon = tipoInfo?.icon || Lightbulb;
  const StatusIcon = statusConfig[ideia.status].icon;

  return (
    <Card className={cn(
      "p-4 transition-all border-border/60",
      ideia.destaque && "border-primary/30 bg-primary/5",
      ideia.status === "pendente" && "border-warning/30 bg-warning/5"
    )}>
      <div className="flex items-start gap-3">
        <Avatar className="h-8 w-8 flex-shrink-0">
          <AvatarImage src={ideia.avatar} />
          <AvatarFallback className="text-[10px] bg-primary/10 text-primary">
            {ideia.autor.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-1.5 flex-wrap mb-1">
            <span className="text-xs font-semibold">{ideia.autor}</span>
            <Badge variant="outline" className="text-[10px] gap-0.5">
              <TipoIcon className={cn("h-2.5 w-2.5", tipoInfo?.cor)} />
              {tipoInfo?.label}
            </Badge>
            <Badge className={cn("text-[10px]", statusConfig[ideia.status].cor)}>
              <StatusIcon className="h-2.5 w-2.5 mr-0.5" />
              {statusConfig[ideia.status].label}
            </Badge>
            <Badge variant="outline" className="text-[10px] gap-0.5">
              {ideia.visibilidade === "publico" ? (
                <>
                  <Users className="h-2.5 w-2.5" />
                  Público
                </>
              ) : (
                <>
                  <Lock className="h-2.5 w-2.5" />
                  Coordenação
                </>
              )}
            </Badge>
            <span className="text-[10px] text-muted-foreground">{ideia.dataEnvio}</span>
          </div>

          <h5 className="text-xs font-medium mb-0.5">{ideia.titulo}</h5>
          <p className="text-[10px] text-muted-foreground line-clamp-2">{ideia.descricao}</p>

          {ideia.respostaCoordenador && (
            <div className="mt-2.5 p-2.5 rounded-lg bg-primary/5 border border-primary/20">
              <div className="flex items-center gap-1 text-[10px] text-primary mb-0.5">
                <MessageCircle className="h-2.5 w-2.5" />
                Resposta da Coordenação
              </div>
              <p className="text-xs text-foreground">{ideia.respostaCoordenador}</p>
            </div>
          )}

          <div className="flex items-center justify-between mt-2.5">
            <div className="flex items-center gap-2.5 text-[10px] text-muted-foreground">
              <span className="flex items-center gap-0.5">
                <ThumbsUp className="h-3 w-3" />
                {ideia.curtidas}
              </span>
              <span className="flex items-center gap-0.5">
                <ThumbsDown className="h-3 w-3" />
                {ideia.descurtidas}
              </span>
            </div>

            {onAprovar && onReprovar && ideia.status === "pendente" && (
              <div className="flex gap-1.5">
                <Button 
                  variant="outline" 
                  size="sm" 
                  className="h-7 text-[10px] text-destructive hover:bg-destructive/5 border-destructive/20"
                  onClick={() => onReprovar(ideia.id)}
                >
                  <XCircle className="h-3 w-3 mr-0.5" />
                  Reprovar
                </Button>
                <Button 
                  size="sm" 
                  className="h-7 text-[10px] bg-success hover:bg-success/90"
                  onClick={() => onAprovar(ideia.id)}
                >
                  <CheckCircle className="h-3 w-3 mr-0.5" />
                  Aprovar
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

```

## 35. Componente React — Meu Perfil

Arquivo de referência: `MeuPerfilDialog.tsx`

```tsx
import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useAtendenteContext } from "@/contexts/AtendenteContext";
import { useCriarValidacao } from "@/hooks/usePerfilValidacoes";
import { 
  Upload, 
  Save, 
  User, 
  Lightbulb, 
  Star, 
  ThumbsUp, 
  ThumbsDown, 
  Send,
  HelpCircle,
  FileText,
  CheckCircle,
  Clock,
  XCircle,
  Sparkles,
  MessageCircle,
  Users,
  Lock,
  Trophy,
} from "lucide-react";
import { cn } from "@/lib/utils";

interface MeuPerfilDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type TipoEnvio = "ideia" | "sugestao" | "duvida" | "solicitacao";
type StatusIdeia = "pendente" | "aprovada" | "rejeitada" | "implementada";
type Visibilidade = "coordenacao" | "publico";

interface MinhaIdeia {
  id: string;
  autor: string;
  avatar?: string;
  tipo: TipoEnvio;
  titulo: string;
  descricao: string;
  status: StatusIdeia;
  visibilidade: Visibilidade;
  curtidas: number;
  descurtidas: number;
  meuVoto?: "up" | "down";
  dataEnvio: string;
  respostaCoordenador?: string;
}

// Ideias do próprio atendente
const minhasIdeiasSimuladas: MinhaIdeia[] = [
  {
    id: "1",
    autor: "Geovana",
    tipo: "ideia",
    titulo: "Criar modo escuro mais suave",
    descricao: "Ajustar as cores do modo escuro para serem mais confortáveis durante uso prolongado.",
    status: "aprovada",
    visibilidade: "publico",
    curtidas: 8,
    descurtidas: 0,
    dataEnvio: "10/01/2026",
  },
  {
    id: "2",
    autor: "Geovana",
    tipo: "duvida",
    titulo: "Como acessar relatórios antigos?",
    descricao: "Gostaria de saber onde encontro os relatórios de meses anteriores.",
    status: "aprovada",
    visibilidade: "coordenacao",
    curtidas: 0,
    descurtidas: 0,
    dataEnvio: "08/01/2026",
    respostaCoordenador: "Você pode acessar no Painel Estratégico > Relatórios > Histórico.",
  },
  {
    id: "3",
    autor: "Geovana",
    tipo: "sugestao",
    titulo: "Notificação sonora para mensagens",
    descricao: "Adicionar opção de som personalizado quando chega mensagem nova.",
    status: "pendente",
    visibilidade: "publico",
    curtidas: 2,
    descurtidas: 0,
    dataEnvio: "15/01/2026",
  },
];

// Ideias públicas dos colegas do setor
const ideiasPublicasSetor: MinhaIdeia[] = [
  {
    id: "p1",
    autor: "Paloma",
    tipo: "ideia",
    titulo: "Scripts automáticos de resposta rápida",
    descricao: "Criar templates de respostas rápidas que podem ser personalizados por cada atendente.",
    status: "implementada",
    visibilidade: "publico",
    curtidas: 15,
    descurtidas: 1,
    dataEnvio: "15/01/2026",
  },
  {
    id: "p2",
    autor: "Marcos",
    tipo: "sugestao",
    titulo: "Otimizar fila com Thalí",
    descricao: "Utilizar a IA para redistribuir automaticamente pacientes quando um atendente fica sobrecarregado.",
    status: "aprovada",
    visibilidade: "publico",
    curtidas: 12,
    descurtidas: 2,
    dataEnvio: "12/01/2026",
  },
  {
    id: "p3",
    autor: "Emilly",
    tipo: "ideia",
    titulo: "Atalhos de teclado personalizados",
    descricao: "Permitir que cada atendente configure seus próprios atalhos de teclado para ações frequentes.",
    status: "pendente",
    visibilidade: "publico",
    curtidas: 5,
    descurtidas: 1,
    dataEnvio: "18/01/2026",
  },
  {
    id: "p4",
    autor: "Bianca",
    tipo: "sugestao",
    titulo: "Dashboard personalizado",
    descricao: "Cada atendente poder escolher quais métricas aparecem no seu painel inicial.",
    status: "pendente",
    visibilidade: "publico",
    curtidas: 7,
    descurtidas: 0,
    dataEnvio: "16/01/2026",
  },
];

const tiposEnvio = [
  { value: "ideia", label: "Ideia", icon: Lightbulb, cor: "text-yellow-600" },
  { value: "sugestao", label: "Sugestão", icon: Star, cor: "text-purple-600" },
  { value: "duvida", label: "Dúvida", icon: HelpCircle, cor: "text-blue-600" },
  { value: "solicitacao", label: "Solicitação", icon: FileText, cor: "text-green-600" },
];

const statusConfig = {
  pendente: { label: "Pendente", icon: Clock, cor: "bg-yellow-100 text-yellow-700 border-yellow-200" },
  aprovada: { label: "Aprovada", icon: CheckCircle, cor: "bg-green-100 text-green-700 border-green-200" },
  rejeitada: { label: "Rejeitada", icon: XCircle, cor: "bg-red-100 text-red-700 border-red-200" },
  implementada: { label: "Implementada", icon: Sparkles, cor: "bg-purple-100 text-purple-700 border-purple-200" },
};

export const MeuPerfilDialog = ({ open, onOpenChange }: MeuPerfilDialogProps) => {
  const { atendenteLogado } = useAtendenteContext();
  const criarValidacao = useCriarValidacao();

  const [formData, setFormData] = useState({
    nome: "",
    assinatura: "",
    avatar: "",
  });

  const [minhasIdeias, setMinhasIdeias] = useState<MinhaIdeia[]>(minhasIdeiasSimuladas);
  const [ideiasSetor, setIdeiasSetor] = useState<MinhaIdeia[]>(ideiasPublicasSetor);
  const [novaIdeia, setNovaIdeia] = useState({
    tipo: "ideia" as TipoEnvio,
    titulo: "",
    descricao: "",
    visibilidade: "publico" as Visibilidade,
  });

  useEffect(() => {
    if (atendenteLogado && open) {
      setFormData({
        nome: atendenteLogado.nome || "",
        assinatura: atendenteLogado.nome || "",
        avatar: atendenteLogado.avatar || "",
      });
    }
  }, [atendenteLogado, open]);

  const handleSave = async () => {
    if (!atendenteLogado) return;

    const camposAlterados: Record<string, boolean> = {};
    const valoresNovos: Record<string, any> = {};

    if (formData.nome !== atendenteLogado.nome) {
      camposAlterados.nome = true;
      valoresNovos.nome = formData.nome;
    }

    if (formData.avatar !== (atendenteLogado.avatar || "")) {
      camposAlterados.avatar = true;
      valoresNovos.avatar = formData.avatar;
    }

    if (Object.keys(camposAlterados).length === 0) {
      onOpenChange(false);
      return;
    }

    await criarValidacao.mutateAsync({
      usuario_id: atendenteLogado.id,
      campos_alterados: camposAlterados,
      valores_novos: valoresNovos,
    });

    onOpenChange(false);
  };

  const handleEnviarIdeia = () => {
    if (!novaIdeia.titulo.trim() || !novaIdeia.descricao.trim()) return;

    const nova: MinhaIdeia = {
      id: Date.now().toString(),
      autor: atendenteLogado?.nome || "Você",
      avatar: atendenteLogado?.avatar,
      tipo: novaIdeia.tipo,
      titulo: novaIdeia.titulo,
      descricao: novaIdeia.descricao,
      status: "pendente",
      visibilidade: novaIdeia.visibilidade,
      curtidas: 0,
      descurtidas: 0,
      dataEnvio: new Date().toLocaleDateString("pt-BR"),
    };

    setMinhasIdeias(prev => [nova, ...prev]);
    
    // Se for público, adiciona também às ideias do setor
    if (novaIdeia.visibilidade === "publico") {
      setIdeiasSetor(prev => [nova, ...prev]);
    }
    
    setNovaIdeia({ tipo: "ideia", titulo: "", descricao: "", visibilidade: "publico" });
  };

  const handleVotoSetor = (ideiaId: string, tipo: "up" | "down") => {
    setIdeiasSetor(prev => prev.map(ideia => {
      if (ideia.id === ideiaId) {
        const votoAnterior = ideia.meuVoto;
        let novasCurtidas = ideia.curtidas;
        let novasDescurtidas = ideia.descurtidas;

        if (votoAnterior === "up") novasCurtidas--;
        if (votoAnterior === "down") novasDescurtidas--;

        if (votoAnterior !== tipo) {
          if (tipo === "up") novasCurtidas++;
          if (tipo === "down") novasDescurtidas++;
        }

        return {
          ...ideia,
          curtidas: novasCurtidas,
          descurtidas: novasDescurtidas,
          meuVoto: votoAnterior === tipo ? undefined : tipo,
        };
      }
      return ideia;
    }));
  };

  // Ideias aprovadas (minhas + dos colegas)
  const ideiasAprovadas = [
    ...minhasIdeias.filter(i => i.status === "aprovada" || i.status === "implementada"),
    ...ideiasSetor.filter(i => (i.status === "aprovada" || i.status === "implementada") && i.autor !== atendenteLogado?.nome),
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <DialogTitle className="text-[#0A2647]">Meu Perfil</DialogTitle>
        </DialogHeader>

        <Tabs defaultValue="perfil" className="w-full">
          <TabsList className="w-full grid grid-cols-2">
            <TabsTrigger value="perfil" className="gap-2">
              <User className="h-4 w-4" />
              Dados Pessoais
            </TabsTrigger>
            <TabsTrigger value="ideias" className="gap-2">
              <Star className="h-4 w-4 fill-yellow-500 text-yellow-500" />
              Ideias das Estrelas
            </TabsTrigger>
          </TabsList>

          <TabsContent value="perfil" className="mt-4">
            <ScrollArea className="h-[450px] pr-4">
              <div className="space-y-6">
                {/* Avatar */}
                <div className="flex flex-col items-center gap-4">
                  <Avatar className="h-24 w-24">
                    <AvatarImage src={formData.avatar} />
                    <AvatarFallback className="text-2xl">
                      {formData.nome.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2)}
                    </AvatarFallback>
                  </Avatar>
                  <Button variant="outline" size="sm">
                    <Upload className="h-4 w-4 mr-2" />
                    Alterar Foto
                  </Button>
                </div>

                {/* Campos Editáveis */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="nome">Nome Completo *</Label>
                    <Input
                      id="nome"
                      value={formData.nome}
                      onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                      className="mt-1.5"
                    />
                  </div>

                  <div>
                    <Label htmlFor="assinatura">Assinatura *</Label>
                    <Input
                      id="assinatura"
                      value={formData.assinatura}
                      onChange={(e) => setFormData({ ...formData, assinatura: e.target.value })}
                      className="mt-1.5"
                      placeholder="Nome que aparece ao enviar mensagens"
                    />
                  </div>

                  {/* Campos Não Editáveis */}
                  <div className="pt-4 border-t border-border space-y-3">
                    <div>
                      <Label className="text-muted-foreground">E-mail</Label>
                      <p className="text-sm font-medium mt-1">
                        {(atendenteLogado as any)?.email || "Não informado"}
                      </p>
                    </div>

                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label className="text-muted-foreground">Cargo</Label>
                        <p className="text-sm font-medium mt-1 capitalize">
                          {atendenteLogado?.cargo || "-"}
                        </p>
                      </div>
                      <div>
                        <Label className="text-muted-foreground">Unidade</Label>
                        <p className="text-sm font-medium mt-1">Matriz</p>
                      </div>
                    </div>

                    <div>
                      <Label className="text-muted-foreground">Setor</Label>
                      <p className="text-sm font-medium mt-1">Atendimento Geral</p>
                    </div>
                  </div>
                </div>

                {/* Status de Validação Pendente */}
                {criarValidacao.isPending && (
                  <Card className="p-4 border-yellow-200 bg-yellow-50">
                    <div className="flex items-center gap-3">
                      <Clock className="h-5 w-5 text-yellow-600 animate-pulse" />
                      <div>
                        <p className="font-medium text-yellow-800">Aguardando validação</p>
                        <p className="text-xs text-yellow-600">Suas alterações foram enviadas para aprovação da coordenação</p>
                      </div>
                    </div>
                  </Card>
                )}

                {/* Botões */}
                <div className="flex gap-3 pt-4">
                  <Button
                    variant="outline"
                    className="flex-1"
                    onClick={() => onOpenChange(false)}
                  >
                    Cancelar
                  </Button>
                  <Button
                    className="flex-1 bg-[#0A2647] hover:bg-[#0A2647]/90"
                    onClick={handleSave}
                    disabled={criarValidacao.isPending}
                  >
                    <Save className="h-4 w-4 mr-2" />
                    {criarValidacao.isPending ? "Enviando..." : "Salvar Alterações"}
                  </Button>
                </div>

                <p className="text-xs text-muted-foreground text-center pb-2">
                  * Alterações serão enviadas para validação da coordenação
                </p>
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="ideias" className="mt-4">
            <Tabs defaultValue="enviar" className="w-full">
              <TabsList className="w-full grid grid-cols-3 mb-4">
                <TabsTrigger value="enviar" className="gap-1 text-xs sm:text-sm">
                  <Send className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Enviar</span>
                </TabsTrigger>
                <TabsTrigger value="setor" className="gap-1 text-xs sm:text-sm">
                  <Users className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Setor</span>
                </TabsTrigger>
                <TabsTrigger value="aprovadas" className="gap-1 text-xs sm:text-sm">
                  <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                  <span className="hidden sm:inline">Aprovadas</span>
                </TabsTrigger>
              </TabsList>

              {/* Tab Enviar Ideia */}
              <TabsContent value="enviar">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-6">
                    {/* Formulário para enviar nova ideia */}
                    <Card className="p-4 border-primary/20 bg-primary/5">
                      <h4 className="font-semibold mb-4 flex items-center gap-2">
                        <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                        Nova Ideia
                      </h4>

                      <div className="space-y-4">
                        {/* Destino */}
                        <div>
                          <Label className="text-sm mb-3 block">Enviar para</Label>
                          <RadioGroup
                            value={novaIdeia.visibilidade}
                            onValueChange={(v) => setNovaIdeia({ ...novaIdeia, visibilidade: v as Visibilidade })}
                            className="grid grid-cols-2 gap-3"
                          >
                            <Label
                              htmlFor="publico"
                              className={cn(
                                "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                                novaIdeia.visibilidade === "publico"
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <RadioGroupItem value="publico" id="publico" />
                              <Users className="h-4 w-4 text-blue-600" />
                              <div>
                                <p className="font-medium text-sm">Público</p>
                                <p className="text-xs text-muted-foreground">Colegas podem ver e curtir</p>
                              </div>
                            </Label>
                            <Label
                              htmlFor="coordenacao"
                              className={cn(
                                "flex items-center gap-2 p-3 rounded-lg border-2 cursor-pointer transition-all",
                                novaIdeia.visibilidade === "coordenacao"
                                  ? "border-primary bg-primary/10"
                                  : "border-border hover:border-primary/50"
                              )}
                            >
                              <RadioGroupItem value="coordenacao" id="coordenacao" />
                              <Lock className="h-4 w-4 text-orange-600" />
                              <div>
                                <p className="font-medium text-sm">Coordenação</p>
                                <p className="text-xs text-muted-foreground">Privado, só gestão vê</p>
                              </div>
                            </Label>
                          </RadioGroup>
                        </div>

                        {/* Tipo */}
                        <div>
                          <Label className="text-sm mb-2 block">Tipo</Label>
                          <div className="grid grid-cols-4 gap-2">
                            {tiposEnvio.map(tipo => {
                              const Icon = tipo.icon;
                              return (
                                <Button
                                  key={tipo.value}
                                  variant={novaIdeia.tipo === tipo.value ? "default" : "outline"}
                                  size="sm"
                                  className={cn(
                                    "text-xs",
                                    novaIdeia.tipo === tipo.value && "bg-[#0A2647]"
                                  )}
                                  onClick={() => setNovaIdeia({ ...novaIdeia, tipo: tipo.value as TipoEnvio })}
                                >
                                  <Icon className={cn("h-3 w-3 mr-1", novaIdeia.tipo !== tipo.value && tipo.cor)} />
                                  {tipo.label}
                                </Button>
                              );
                            })}
                          </div>
                        </div>

                        <div>
                          <Label className="text-sm mb-2 block">Título</Label>
                          <Input
                            placeholder="Resumo breve..."
                            value={novaIdeia.titulo}
                            onChange={(e) => setNovaIdeia({ ...novaIdeia, titulo: e.target.value })}
                          />
                        </div>

                        <div>
                          <Label className="text-sm mb-2 block">Descrição</Label>
                          <Textarea
                            placeholder="Descreva com detalhes..."
                            rows={3}
                            value={novaIdeia.descricao}
                            onChange={(e) => setNovaIdeia({ ...novaIdeia, descricao: e.target.value })}
                          />
                        </div>

                        <Button 
                          className="w-full bg-[#0A2647] hover:bg-[#144272]"
                          onClick={handleEnviarIdeia}
                          disabled={!novaIdeia.titulo.trim() || !novaIdeia.descricao.trim()}
                        >
                          <Send className="h-4 w-4 mr-2" />
                          Enviar Ideia
                        </Button>
                      </div>
                    </Card>

                    {/* Minhas ideias enviadas */}
                    <div>
                      <h4 className="font-semibold mb-3 flex items-center gap-2">
                        <Lightbulb className="h-4 w-4 text-primary" />
                        Minhas Ideias Enviadas
                      </h4>

                      <div className="space-y-3">
                        {minhasIdeias.map((ideia) => (
                          <IdeiaCardSimples key={ideia.id} ideia={ideia} />
                        ))}

                        {minhasIdeias.length === 0 && (
                          <div className="text-center py-8 text-muted-foreground">
                            <Lightbulb className="h-12 w-12 mx-auto mb-3 opacity-50" />
                            <p>Você ainda não enviou nenhuma ideia.</p>
                            <p className="text-sm">Use o formulário acima para compartilhar suas sugestões!</p>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Tab Ideias do Setor */}
              <TabsContent value="setor">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Users className="h-5 w-5 text-blue-600" />
                      <h4 className="font-semibold">Ideias Públicas do Setor</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Veja as ideias compartilhadas pelos colegas do seu setor e vote nas que você mais gosta!
                    </p>

                    {ideiasSetor.map((ideia) => (
                      <IdeiaCardVotavel 
                        key={ideia.id} 
                        ideia={ideia} 
                        onVoto={handleVotoSetor}
                        podeVotar={ideia.autor !== atendenteLogado?.nome}
                      />
                    ))}

                    {ideiasSetor.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Users className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Nenhuma ideia pública no setor ainda.</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>

              {/* Tab Aprovadas */}
              <TabsContent value="aprovadas">
                <ScrollArea className="h-[400px] pr-4">
                  <div className="space-y-4">
                    <div className="flex items-center gap-2 mb-2">
                      <Trophy className="h-5 w-5 text-yellow-500" />
                      <h4 className="font-semibold">Ideias Aprovadas</h4>
                    </div>
                    <p className="text-sm text-muted-foreground mb-4">
                      Confira as ideias que foram aprovadas pela coordenação! 🎉
                    </p>

                    {ideiasAprovadas.map((ideia) => (
                      <Card 
                        key={ideia.id} 
                        className={cn(
                          "p-4 border-2",
                          ideia.status === "implementada" 
                            ? "border-purple-300 bg-purple-50/50" 
                            : "border-green-300 bg-green-50/50"
                        )}
                      >
                        <div className="flex items-start gap-3">
                          <Avatar className="h-8 w-8 flex-shrink-0">
                            <AvatarImage src={ideia.avatar} />
                            <AvatarFallback className="text-xs bg-primary/10 text-primary">
                              {ideia.autor.slice(0, 2).toUpperCase()}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 flex-wrap mb-1">
                              {ideia.autor === atendenteLogado?.nome && (
                                <Badge className="bg-primary text-xs">Sua ideia!</Badge>
                              )}
                              <span className="font-medium text-sm">{ideia.autor}</span>
                              <Badge className={cn("text-xs", statusConfig[ideia.status].cor)}>
                                {ideia.status === "implementada" ? (
                                  <><Sparkles className="h-3 w-3 mr-1" /> Implementada</>
                                ) : (
                                  <><CheckCircle className="h-3 w-3 mr-1" /> Aprovada</>
                                )}
                              </Badge>
                            </div>
                            <h5 className="font-medium text-sm mb-1">{ideia.titulo}</h5>
                            <p className="text-xs text-muted-foreground line-clamp-2">{ideia.descricao}</p>

                            {ideia.respostaCoordenador && (
                              <div className="mt-2 p-2 rounded-lg bg-blue-50 border border-blue-200">
                                <div className="flex items-center gap-1 text-xs text-blue-700 mb-1">
                                  <MessageCircle className="h-3 w-3" />
                                  Feedback da Coordenação
                                </div>
                                <p className="text-xs text-blue-800">{ideia.respostaCoordenador}</p>
                              </div>
                            )}

                            <div className="flex items-center gap-3 mt-2 text-xs text-muted-foreground">
                              <span className="flex items-center gap-1">
                                <ThumbsUp className="h-3 w-3" /> {ideia.curtidas}
                              </span>
                              <span>{ideia.dataEnvio}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}

                    {ideiasAprovadas.length === 0 && (
                      <div className="text-center py-8 text-muted-foreground">
                        <Trophy className="h-12 w-12 mx-auto mb-3 opacity-50" />
                        <p>Nenhuma ideia aprovada ainda.</p>
                        <p className="text-sm">Continue enviando suas ideias!</p>
                      </div>
                    )}
                  </div>
                </ScrollArea>
              </TabsContent>
            </Tabs>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

// Card simples para minhas ideias (sem votação)
const IdeiaCardSimples = ({ ideia }: { ideia: MinhaIdeia }) => {
  const tipoInfo = tiposEnvio.find(t => t.value === ideia.tipo);
  const TipoIcon = tipoInfo?.icon || Lightbulb;
  const StatusIcon = statusConfig[ideia.status].icon;

  return (
    <Card className="p-4">
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 flex-wrap">
          <Badge variant="outline" className="text-xs gap-1">
            <TipoIcon className={cn("h-3 w-3", tipoInfo?.cor)} />
            {tipoInfo?.label}
          </Badge>
          <Badge className={cn("text-xs", statusConfig[ideia.status].cor)}>
            <StatusIcon className="h-3 w-3 mr-1" />
            {statusConfig[ideia.status].label}
          </Badge>
          <Badge variant="outline" className="text-xs gap-1">
            {ideia.visibilidade === "publico" ? (
              <><Users className="h-3 w-3" /> Público</>
            ) : (
              <><Lock className="h-3 w-3" /> Coordenação</>
            )}
          </Badge>
        </div>
        <span className="text-xs text-muted-foreground flex-shrink-0">{ideia.dataEnvio}</span>
      </div>

      <h5 className="font-medium mb-1">{ideia.titulo}</h5>
      <p className="text-sm text-muted-foreground line-clamp-2">{ideia.descricao}</p>

      {ideia.respostaCoordenador && (
        <div className="mt-3 p-3 rounded-lg bg-blue-50 border border-blue-200">
          <div className="flex items-center gap-1 text-xs text-blue-700 mb-1">
            <MessageCircle className="h-3 w-3" />
            Resposta da Coordenação
          </div>
          <p className="text-sm text-blue-800">{ideia.respostaCoordenador}</p>
        </div>
      )}

      {ideia.visibilidade === "publico" && (
        <div className="flex items-center gap-3 mt-3 text-sm text-muted-foreground">
          <span className="flex items-center gap-1">
            <ThumbsUp className="h-3 w-3" /> {ideia.curtidas}
          </span>
          <span className="flex items-center gap-1">
            <ThumbsDown className="h-3 w-3" /> {ideia.descurtidas}
          </span>
        </div>
      )}
    </Card>
  );
};

// Card com votação para ideias do setor
interface IdeiaCardVotavelProps {
  ideia: MinhaIdeia;
  onVoto: (id: string, tipo: "up" | "down") => void;
  podeVotar: boolean;
}

const IdeiaCardVotavel = ({ ideia, onVoto, podeVotar }: IdeiaCardVotavelProps) => {
  const tipoInfo = tiposEnvio.find(t => t.value === ideia.tipo);
  const TipoIcon = tipoInfo?.icon || Lightbulb;
  const StatusIcon = statusConfig[ideia.status].icon;

  return (
    <Card className={cn(
      "p-4 transition-all hover:shadow-md",
      ideia.status === "implementada" && "border-purple-200 bg-purple-50/30",
      ideia.status === "aprovada" && "border-green-200 bg-green-50/30"
    )}>
      <div className="flex items-start gap-3">
        <Avatar className="h-10 w-10 flex-shrink-0">
          <AvatarImage src={ideia.avatar} />
          <AvatarFallback className="text-sm bg-primary/10 text-primary">
            {ideia.autor.slice(0, 2).toUpperCase()}
          </AvatarFallback>
        </Avatar>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 flex-wrap mb-1">
            <span className="font-semibold">{ideia.autor}</span>
            <Badge variant="outline" className="text-xs gap-1">
              <TipoIcon className={cn("h-3 w-3", tipoInfo?.cor)} />
              {tipoInfo?.label}
            </Badge>
            <Badge className={cn("text-xs", statusConfig[ideia.status].cor)}>
              <StatusIcon className="h-3 w-3 mr-1" />
              {statusConfig[ideia.status].label}
            </Badge>
            <span className="text-xs text-muted-foreground">{ideia.dataEnvio}</span>
          </div>

          <h5 className="font-medium mb-1">{ideia.titulo}</h5>
          <p className="text-sm text-muted-foreground line-clamp-2">{ideia.descricao}</p>

          <div className="flex items-center gap-2 mt-3">
            {podeVotar ? (
              <>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3",
                    ideia.meuVoto === "up" && "text-green-600 bg-green-50"
                  )}
                  onClick={() => onVoto(ideia.id, "up")}
                >
                  <ThumbsUp className="h-4 w-4 mr-1" />
                  Bom ({ideia.curtidas})
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className={cn(
                    "h-8 px-3",
                    ideia.meuVoto === "down" && "text-red-600 bg-red-50"
                  )}
                  onClick={() => onVoto(ideia.id, "down")}
                >
                  <ThumbsDown className="h-4 w-4 mr-1" />
                  Ruim ({ideia.descurtidas})
                </Button>
              </>
            ) : (
              <div className="flex items-center gap-3 text-sm text-muted-foreground">
                <span className="flex items-center gap-1">
                  <ThumbsUp className="h-4 w-4 text-green-600" /> {ideia.curtidas}
                </span>
                <span className="flex items-center gap-1">
                  <ThumbsDown className="h-4 w-4 text-red-600" /> {ideia.descurtidas}
                </span>
                <span className="text-xs italic">(sua ideia)</span>
              </div>
            )}
          </div>
        </div>
      </div>
    </Card>
  );
};

```
