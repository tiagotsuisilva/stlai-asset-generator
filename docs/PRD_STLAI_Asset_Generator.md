# PRD — STLAI Asset Generator

**MVP de Validação para Vibe Coding**

---

## Identificação

| Campo | Valor |
|---|---|
| Empresa | STLFLIX |
| Subbrand | STLAI (IA aplicada ao desenvolvimento de drops) |
| Produto | STLAI Asset Generator |
| Tipo | Ferramenta interna |
| Versão | MVP de validação (HTML/CSS/JS local) |
| Demo Day | 08/05/2026 |
| Status | PRD aprovado, pronto para vibe coding |

---

## 1. Visão geral

A STLFLIX desenvolve drops de produtos digitais para impressão 3D. O time de desenvolvimento prepara variações dos produtos (bobbleheads, chaveiros, fidgets, displays, home decor, caixas temáticas, produtos baseados em SVG e personagens 3D) e enfrenta um gargalo recorrente: **a geração manual de assets visuais para liberação de qualidade**, que consome entre 10 e 30 horas por drop.

O **STLAI Asset Generator** é uma ferramenta interna que automatiza essa etapa, permitindo geração em lote de:

1. **Personagens 3D** (com integração à Tripo).
2. **SVGs a partir de imagens estilizadas**.
3. **SVGs textuais estilizados**.

A ferramenta **não substitui** a aplicação manual nos produtos (Blender, booleanas, montagem). Ela acelera apenas a etapa de geração dos insumos visuais.

---

## 2. Contexto e problema (DORA)

### Dor
Time de desenvolvimento de drops da STLFLIX, em especial designers responsáveis por preparar variações para qualidade.

### Observação
A geração de assets visuais (imagens, SVGs e bases 3D) é feita manualmente, item por item. Para cada variação:

1. Buscar referência visual.
2. Pensar no estilo adequado.
3. Criar e ajustar prompt.
4. Gerar imagem.
5. Testar variações.
6. Converter em SVG ou modelo 3D.
7. Gerar arquivos utilizáveis.
8. Repetir para cada item do drop.

Em drops com múltiplas variações, esse processo consome **10–30 horas (estimativa)** e se torna gargalo recorrente na etapa final.

### Resultado esperado
Reduzir o tempo de geração de assets por drop de **10–30h para 3–8h (estimativa)**.

### Agora
Demo Day em **08/05/2026** (apresentação interna no contexto de aprendizado coletivo de vibe coding).

### Frase síntese
> O time de drops da STLFLIX perde 10–30h por projeto gerando assets manualmente item a item, tornando a etapa final um gargalo. Meta: reduzir para 3–8h até o Demo Day.

---

## 3. JTBD (Jobs to Be Done)

### Persona primária — Designer de produtos

**Job principal**:
> "Quando chego na etapa de preparar os produtos para qualidade, eu quero gerar rapidamente todas as variações visuais necessárias, para conseguir liberar o drop sem perder horas em tarefas repetitivas."

**Situação que dispara o job**: definição do produto pronta, é necessário criar todas as variações para validação, impressão e mídia.

**Critério de sucesso**:
> "Consegui gerar todas as variações que preciso de forma rápida e consistente, sem ficar repetindo o mesmo processo manual várias vezes."

### Persona secundária — Time de pesquisa e concept

Pode usar a ferramenta como **complemento de pesquisa**, especialmente o Fluxo 1 (geração de personagens 3D) para explorar conceitos. Não é foco prioritário do MVP. A ferramenta pode evoluir para atendê-los de forma mais específica em versões futuras.

---

## 4. Solução

Pipeline semi-automatizado para geração de assets visuais. A partir de inputs estruturados (imagem de referência + biblioteca curada + prompt), a ferramenta gera variações em lote de:

- **Imagens estilizadas em formato collectible** (Fluxo 1).
- **SVGs estilizados a partir de imagens da biblioteca** (Fluxo 2).
- **SVGs textuais com estilo aplicado por imagem de referência** (Fluxo 3).

No Fluxo 1, as imagens aprovadas são enviadas para a **API da Tripo** para geração dos modelos 3D base. A aplicação final dos assets nos produtos continua **manual** — o foco do MVP não é automatizar Blender, booleanas, montagem ou posicionamento.

---

## 5. Fluxos detalhados

### 5.1. Fluxo 1 — Personagem 3D

**Objetivo**: gerar personagens em 3D a partir da combinação de uma imagem de referência (define pose/composição) + personagens da Biblioteca A (define identidade visual) + prompt base + bloco extra opcional.

**APIs envolvidas**:
- **OpenAI GPT-Image-2** — geração das imagens a partir de duas imagens + prompt.
- **Tripo** — conversão das imagens aprovadas em modelos 3D.

**Jornada do usuário**:

1. Usuário acessa a **Home (lado esquerdo)**: faz upload da imagem de referência (que define pose/composição), preenche o campo de instruções adicionais (bloco extra) se quiser, e clica no botão **Biblioteca A** para iniciar o Fluxo 1.
2. **Tela de seleção da Biblioteca A**:
   - Grid com os personagens da Biblioteca A (visualização + nome).
   - Seleção múltipla via clique (até 20 itens).
   - Contador "X de 20 selecionados".
   - Botão **Gerar imagens** (ativa só com upload na Home + ao menos 1 personagem selecionado).
3. **Tela de preview das imagens geradas**:
   - **Mesma interface da Biblioteca A** (grid de cards com clique para selecionar), mas exibindo as imagens **geradas pela OpenAI** (1 por personagem selecionado).
   - Seleção múltipla via clique para definir quais avançam para a Tripo.
   - Botões: **Voltar** | **Avançar para 3D** (ativo só se ao menos 1 selecionado).
4. **Tela de configuração 3D** (parâmetros da Tripo):
   - Lista compacta dos personagens selecionados.
   - Parâmetros da Tripo: Versão do Modelo (dropdown), Mesh Resolution (toggle Standard/Ultra), Polycount (slider com opção Auto), Formato de saída (dropdown, padrão GLB), Nome do arquivo (input).
   - Botões: **Gerar 3D** | **Limpar**.
5. **Tela de resultado / loading**:
   - Status da geração 3D ("X de N processados").
   - Botão **Download ZIP** com modelos 3D + imagens geradas (ativo quando todos terminarem).

**Output esperado**:
- Imagens geradas pela OpenAI (PNG).
- Modelos 3D gerados pela Tripo (formato a definir conforme implementação atual).
- Arquivo ZIP único com todos os resultados.

**Regras**:
- Cada personagem selecionado da Biblioteca A gera **1 output** (sem variações múltiplas do mesmo).
- Limite máximo: **20 personagens por geração**.
- Aprovação manual antes de enviar para a Tripo (filtro de qualidade + controle de custo de API).

**O que o Fluxo 1 NÃO faz**:
- Não aplica os modelos 3D automaticamente nos produtos.
- Não executa booleanas.
- Não posiciona no Blender.
- Não prepara para impressão.
- Não substitui validação manual.

### 5.2. Fluxo 2 — SVG a partir de imagem

**Objetivo**: gerar SVGs estilizados em lote a partir de imagens da biblioteca, aplicando um estilo definido por prompt.

**APIs envolvidas**:
- **OpenAI GPT-Image-2** — estilização das imagens via prompt.
- **Conversor para SVG** — placeholder no MVP (mock que retorna SVG de exemplo); será integrado posteriormente com solução do conhecido.

**Jornada do usuário**:

1. Usuário acessa a **Home (lado direito)**: preenche o campo de prompt (define o estilo do SVG) e clica no botão **Biblioteca A** para iniciar o Fluxo 2.
2. **Tela de seleção da Biblioteca A**:
   - Grid com as imagens da Biblioteca A.
   - Seleção múltipla via clique (até 20 itens).
   - Contador "X de 20 selecionados".
   - Botão **Gerar** (ativa só com prompt preenchido + ao menos 1 imagem selecionada).
3. **Tela de resultado / loading**:
   - Loading durante a geração ("X de N gerados").
   - Preview das imagens estilizadas + SVGs convertidos (placeholder visual).
   - Botão **Download ZIP**.

**Output esperado**:
- SVGs gerados em lote.
- Imagens preview (PNG estilizado).
- Arquivo ZIP com todos os SVGs e previews.

**Regras**:
- **Sem upload do usuário**: a entrada é apenas a seleção da biblioteca + prompt.
- Cada imagem selecionada gera 1 SVG.

**O que o Fluxo 2 NÃO faz**:
- Não aplica os SVGs automaticamente nos modelos.
- Não valida espessura, encaixe ou printabilidade.
- Não organiza arquivos no Blender.

### 5.3. Fluxo 3 — SVG textual estilizado

**Objetivo**: gerar SVGs de frases pré-definidas com estilo visual definido por uma imagem de referência do usuário.

**APIs envolvidas**:
- **OpenAI GPT-Image-2** — geração estilizada usando duas imagens (estrutura igual ao Fluxo 1).
- **Conversor para SVG** — mesmo placeholder do Fluxo 2.

**Jornada do usuário**:

1. Usuário acessa a **Home (lado esquerdo)**: faz upload da imagem de referência de estilo e clica no botão **Biblioteca B** para iniciar o Fluxo 3. (O bloco extra do lado esquerdo pertence ao Fluxo 1 e é ignorado neste fluxo.)
2. **Tela de seleção da Biblioteca B**:
   - Grid com as frases ilustradas da Biblioteca B.
   - Seleção múltipla via clique (até 20 itens).
   - Contador "X de 20 selecionados".
   - O prompt usado neste fluxo é fixo no MVP (ainda a ser definido durante implementação) e roda no fundo, sem exposição direta para o usuário.
   - Botão **Gerar** (ativa só com upload na Home + ao menos 1 frase selecionada).
3. **Tela de resultado / loading**:
   - Loading durante a geração ("X de N gerados").
   - Preview dos textos gerados em estilo aplicado + SVGs convertidos.
   - Botão **Download ZIP**.

**Output esperado**:
- SVG individual para cada frase selecionada.
- Arquivo ZIP com todos os SVGs.
- Preview visual.

**Regras**:
- A imagem do usuário é **só estilo**, não substitui as frases (mesma lógica de "Image 1 = blueprint, Image 2 = appearance" do Fluxo 1, mas adaptada).
- Cada frase selecionada gera 1 SVG.

**O que o Fluxo 3 NÃO faz**:
- Não cria automaticamente o produto final.
- Não posiciona no modelo.
- Não ajusta curvas complexas.
- Não valida printabilidade.

---

## 6. Escopo do MVP

### Incluído

- Tela inicial (Home) com escolha do tipo de asset.
- Os três fluxos: Personagem 3D, SVG por imagem, SVG textual.
- Upload de imagens (Fluxos 1 e 3).
- Seleção múltipla nas bibliotecas (todos os fluxos).
- Campo de prompt com prompt base e bloco extra editável (Fluxo 1).
- Geração via API OpenAI GPT-Image-2.
- Integração com API da Tripo (Fluxo 1).
- Geração em lote (todos os fluxos).
- Preview dos resultados.
- Download em ZIP.
- Botão "salvar este prompt" (versão simples, sem dashboard).
- Limite de 20 itens por geração.

### Excluído (fora do MVP)

- Login/autenticação.
- Histórico de gerações.
- Aplicação automática no Blender.
- Booleanas automáticas.
- Ajuste de malha.
- Validação de printabilidade.
- Integração com pipeline completo de qualidade.
- Dashboard analítico.
- Automação de ficha técnica.
- Automação de apresentação para dev.
- Edição avançada dos SVGs.
- Gerenciamento das bibliotecas pela interface (admin via edição direta de JSON/pasta).
- Persistência em banco de dados.
- Deploy em servidor.

---

## 7. Telas e arquitetura de informação

### 7.1. Tela 1 — Home (hub central)

A Home é o **único ponto de entrada** dos três fluxos. Layout em **duas colunas verticais**, divididas ao meio.

**Header** (comum):
- Logo STLAI.
- Título / subtítulo curto da ferramenta.

**Coluna esquerda — entradas com upload (Fluxos 1 e 3)**:
- Janela de **preview da imagem** (placeholder antes do upload).
- Botão **UPLOAD** (drop zone + click para escolher arquivo).
- Campo de texto **"Instruções adicionais (opcional)"** — bloco extra do Fluxo 1. Placeholder: *"ex: pose com mãos levantadas, expressão de surpresa..."*. Posicionado entre o botão UPLOAD e o botão Biblioteca A.
- Botão **Biblioteca A** → dispara o **Fluxo 1 — Personagem 3D** (usa upload + bloco extra).
- Botão **Biblioteca B** → dispara o **Fluxo 3 — SVG textual** (usa apenas o upload; ignora o bloco extra).

**Coluna direita — entrada apenas por prompt (Fluxo 2)**:
- Campo de texto **PROMPT** (textarea) para definir o estilo do SVG.
- Botão **Biblioteca A** → dispara o **Fluxo 2 — SVG por imagem**.

> **Observação**: o mesmo nome "Biblioteca A" aparece em ambas as colunas porque ambos os fluxos consomem a mesma biblioteca de imagens. O fluxo disparado depende de qual lado da Home o usuário acionar.

### 7.2. Tela 2 — Seleção da Biblioteca (compartilhada entre Fluxos 1, 2 e 3)

Mesmo padrão visual reutilizado para Biblioteca A e Biblioteca B.

- Header com indicação do fluxo ativo (ex.: "Fluxo 1 — Personagem 3D").
- Grid com cards das imagens da biblioteca correspondente (miniatura + nome).
- Seleção múltipla via clique no card (estado visual de selecionado).
- Contador "X de 20 selecionados".
- Botões: **Voltar** | **Gerar imagens** (Fluxo 1) / **Gerar** (Fluxos 2 e 3).
  - Só ativa quando os pré-requisitos da Home estão atendidos + ao menos 1 item selecionado.

### 7.3. Tela 3 — Preview das imagens geradas (Fluxo 1)

Usada **apenas no Fluxo 1**, entre a seleção da Biblioteca A e a configuração da Tripo.

- Mesmo padrão visual da Tela 2 (grid de cards com seleção por clique), porém exibindo as **imagens geradas pela OpenAI** em vez das imagens da biblioteca.
- 1 card por personagem selecionado na etapa anterior.
- Loading state durante a geração ("X de N gerados").
- Cada card permite seleção múltipla por clique para definir quais imagens avançam para a Tripo.
- Botões: **Voltar** | **Avançar para 3D** (ativo se ao menos 1 imagem selecionada).

### 7.4. Tela 4 — Configuração 3D / Tripo (Fluxo 1)

Tela específica do Fluxo 1, após o preview.

- Lista compacta dos personagens / imagens selecionados na tela anterior.
- Parâmetros da Tripo:
  - **Versão do Modelo** — dropdown.
  - **Mesh Resolution** — toggle Standard / Ultra.
  - **Polycount** — slider com opção Auto.
  - **Formato de saída** — dropdown (padrão GLB).
  - **Nome do arquivo** — input de texto.
- Botões: **Gerar 3D** | **Limpar**.

### 7.5. Tela 5 — Resultado / Download (todos os fluxos)

Tela final compartilhada por todos os fluxos, com pequenas variações de conteúdo.

- Status da geração ("Processando X de N" → "Concluído").
- Lista / preview dos arquivos gerados:
  - **Fluxo 1**: imagens geradas + modelos 3D.
  - **Fluxo 2**: imagens estilizadas + SVGs convertidos.
  - **Fluxo 3**: textos estilizados + SVGs convertidos.
- Botão **Download ZIP** (ativo quando o processamento termina).
- Botão **Voltar para a Home**.

---

## 8. Estrutura de dados

### 8.1. Bibliotecas (JSON local)

**`bibliotecaA.json`** (personagens — Fluxos 1 e 2):
```json
[
  {
    "id": "drago_lava",
    "nome": "Dragão de Fogo",
    "categoria": "criatura_fantastica",
    "arquivo": "bibliotecaA/drago_lava.png",
    "descricao": "Dragão sentado com escamas pretas e veias incandescentes."
  },
  {
    "id": "husky",
    "nome": "Husky",
    "categoria": "animal_real",
    "arquivo": "bibliotecaA/husky.png",
    "descricao": "Husky marrom e branco sentado em fundo neutro."
  }
  // ... demais itens
]
```

**`bibliotecaB.json`** (frases ilustradas — Fluxo 3):
```json
[
  {
    "id": "birthday_gift",
    "nome": "Birthday Gift",
    "categoria": "gift",
    "arquivo": "bibliotecaB/birthday_gift.png"
  },
  {
    "id": "your_pet",
    "nome": "Your Pet",
    "categoria": "your",
    "arquivo": "bibliotecaB/your_pet.png"
  }
  // ... demais itens
]
```

### 8.2. Prompts (arquivos)

- **`prompts/fluxo1_base.txt`** — prompt completo do Fluxo 1 (versão genérica). Ver Anexo A.
- **`prompts/fluxo2_default.txt`** — prompt sugerido para o Fluxo 2 (placeholder editável pelo usuário).
- **`prompts/fluxo3_base.txt`** — prompt do Fluxo 3 (placeholder, a definir durante implementação).

### 8.3. Prompts salvos pelo usuário (local, sem persistência server)

- **`localStorage`** ou arquivo JSON local com lista de prompts marcados como "favoritos" pelo usuário. Estrutura simples:
```json
[
  {
    "fluxo": "fluxo1_extra",
    "texto": "pose com mãos levantadas em poder",
    "criado_em": "2026-04-30"
  }
]
```

> **Nota**: como o MVP roda local sem login, prompts salvos ficam no navegador do usuário. Essa é uma limitação aceita do MVP de validação.

### 8.4. APIs e secrets

- **`config.js`** com `OPENAI_API_KEY` e `TRIPO_API_KEY` hardcoded.
- ⚠️ **Não comitar em repositório público.** Adicionar `config.js` ao `.gitignore` e disponibilizar `config.example.js` como template.

---

## 9. Bibliotecas curadas

### 9.1. Biblioteca A — Personagens (Fluxos 1 e 2)

**Estado inicial: 7 imagens**, expandível pelo administrador.

| ID | Categoria | Descrição |
|---|---|---|
| `drago_lava` | criatura_fantastica | Dragão sentado, escamas pretas e veias incandescentes |
| `husky` | animal_real | Husky marrom e branco sentado em fundo neutro |
| `gato_malhado` | animal_real | Gato malhado preto/cinza/branco sentado |
| `mulher_asiatica_mechas_verdes` | humano | Mulher de cabelo longo escuro com mechas verdes, camiseta STLFLIX |
| `mulher_castanha_piercing` | humano | Mulher castanha sorridente com piercing, camiseta STLFLIX |
| `homem_careca_barba_ruiva` | humano | Homem careca de barba ruiva, sorridente, camiseta STLFLIX |
| `homem_cabelo_curto_barba` | humano | Homem de cabelo curto e barba, leve sorriso, camiseta STLFLIX |

**Decisão de branding**: as quatro pessoas usam camiseta STLFLIX como assinatura intencional nos outputs. O prompt do Fluxo 1 preserva o outfit da Image 2, então essa camiseta aparece nos personagens 3D gerados.

**Diretrizes para futuras adições**:
- Manter fundo neutro de estúdio (cinza/lavanda claro).
- Iluminação frontal consistente.
- Pose padrão: sentado de frente, busto/corpo centralizado.
- Resolução mínima: 768x1280 ou similar.

### 9.2. Biblioteca B — Frases ilustradas (Fluxo 3)

**Estado inicial: 11 imagens**, com previsão de mais 13 a serem adicionadas (total de 24).

**Série "GIFT" (6)**:
- BIRTHDAY GIFT (bolo com velas)
- HOLIDAY GIFT (calendário)
- FESTIVAL GIFT (barraca de festival)
- FREEBIE GIFT (caixa de presente)
- FRIENDSHIP GIFT (fist bump)
- CORPORATIVE GIFT (handshake com check)

**Série "YOUR" (5)**:
- YOUR QUOTE (aspas duplas)
- YOUR PET (silhueta de gato)
- YOUR PHOTO (câmera fotográfica)
- YOUR LOGO (logo S da STLAI)
- YOUR HERO (chapéu de mago)

**Padrão visual obrigatório**:
- Silhueta preta sobre fundo branco.
- Tipografia mista (fonte fina em cima, bold embaixo).
- Ícone simples e geométrico acima do texto.
- Composição centralizada vertical.

---

## 10. Critérios de sucesso

### Métrica principal (qualitativa para Demo Day)

Frase esperada do usuário após uso real:
> "Eu consegui gerar as variações do drop de uma vez, com consistência, e só precisei revisar e aplicar manualmente depois."

### Métrica quantitativa (estimativa, validação posterior)

- Reduzir o tempo de geração de assets por drop de **10–30h para 3–8h**.
- Como o número 10–30h é estimativa, fica como ponto a medir após o primeiro uso real (cronômetro do designer).

### Validação no Demo Day

Demonstração com **caso real em produção** — um drop ativo da STLFLIX, não simulação.

---

## 11. Regras do produto

1. A ferramenta **não entrega o produto final**, apenas os assets.
2. A aplicação no produto **continua manual**.
3. O usuário precisa conseguir **controlar o estilo final** (via prompt + bloco extra + escolha de biblioteca).
4. O sistema **prioriza geração em lote**.
5. O output é **organizado para uso posterior** (ZIPs nomeados de forma consistente).
6. O MVP é **simples o suficiente para ser construído rapidamente** (HTML/CSS/JS local).
7. As bibliotecas são **curadas pelo administrador** (Tiago), não gerenciadas pelos usuários finais via interface.

---

## 12. Riscos e mitigações

### Risco 1 — Qualidade inconsistente da IA
As gerações podem variar e exigir curadoria manual.
**Mitigação**: prompt base robusto, bloco extra editável, regeneração rápida, biblioteca de prompts salvos.

### Risco 2 — Conversão SVG ruim
A conversão para SVG pode gerar arquivos sujos.
**Mitigação**: começar com casos simples, preview antes do download, refinamento manual fora do MVP, integração futura com conversor profissional.

### Risco 3 — Tripo gerar modelos inadequados
Modelos 3D podem precisar de ajustes antes de uso real.
**Mitigação**: tratar resultado como base, manter validação manual, permitir múltiplas seleções.

### Risco 4 — Escopo crescer demais
A ferramenta pode tentar virar pipeline completo.
**Mitigação**: limitar o MVP à geração de assets. Não automatizar Blender, aplicação ou qualidade.

### Risco 5 — Custo de API descontrolado
20 variações × N usuários × N drops escala custo da OpenAI/Tripo.
**Mitigação**: limite de 20 itens por geração, monitorar gasto da API key, considerar cap mensal.

### Risco 6 — Tempo de geração travando UX
Geração síncrona com 20 imagens via OpenAI + envio em série pra Tripo pode demorar minutos.
**Mitigação**: loading state com progresso ("X de 20 gerados"), permitir cancelar, considerar geração paralela onde possível.

### Risco 7 — GPT-Image-2 não suportar capacidade esperada
Se o modelo não suportar imagem-de-referência + imagem-a-customizar simultaneamente com a fidelidade necessária, o fluxo precisa ser repensado.
**Mitigação**: validar modelo na primeira semana de desenvolvimento, ter plano B (gpt-image-1 ou outro modelo).

### Risco 8 — Pose mal extraída pela IA da Imagem 1
Como o prompt base agora é genérico (sem instruções textuais de pose), a fidelidade depende 100% do GPT-Image-2 conseguir ler pose da imagem.
**Mitigação**: bloco extra existe como válvula de escape — usuário adiciona descrição textual de pose quando necessário. Validar isso na Semana 1.

---

## 13. Stack técnica (MVP de validação)

### Frontend
- HTML + CSS + JavaScript vanilla (sem framework).
- Estrutura de arquivos:
  ```
  /
  ├── index.html
  ├── fluxo1.html
  ├── fluxo2.html
  ├── fluxo3.html
  ├── css/
  │   └── style.css
  ├── js/
  │   ├── config.js (com API keys, em .gitignore)
  │   ├── prompts.js (prompt base do Fluxo 1)
  │   ├── api.js (chamadas OpenAI + Tripo)
  │   └── ui.js (renderização de telas)
  ├── bibliotecaA/
  │   ├── bibliotecaA.json
  │   └── *.png
  ├── bibliotecaB/
  │   ├── bibliotecaB.json
  │   └── *.png
  └── README.md
  ```

### APIs
- **OpenAI GPT-Image-2** — geração de imagens com input multi-imagem.
- **Tripo** — geração de modelos 3D (reaproveitar código do MVP existente).
- **Conversor SVG** — placeholder/mock no MVP, integração futura.

### Bibliotecas externas (via CDN)
- **JSZip** — empacotamento dos outputs.
- (opcional) **react-dropzone** equivalente em vanilla, ou drag-and-drop nativo.

### Como rodar
- Abrir `index.html` direto no navegador, ou rodar `npx serve` na pasta raiz.
- Sem necessidade de backend, banco ou deploy.

### API keys
- **Hardcoded** em `js/config.js` (uso interno na máquina do usuário).
- `config.js` no `.gitignore` para evitar exposição em repositório público.
- Cada usuário do time configura sua própria chave localmente (ou compartilha de forma controlada).

### Storage
- Outputs **não persistem** — são gerados, baixados em ZIP e descartados.
- Bibliotecas ficam em pasta local do projeto.
- Prompts salvos pelo usuário usam `localStorage` do navegador.

---

## 14. Plano de validação (Semana 1)

Antes de construir os 3 fluxos completos, validar premissas críticas:

1. **Validar GPT-Image-2 multi-imagem**: testar 3-5 chamadas reais com prompt base + duas imagens. Confirmar que o modelo respeita a separação "Image 1 = estrutura, Image 2 = aparência".
2. **Validar fidelidade de pose**: testar com 3-5 poses diferentes na Imagem 1. Se a pose não for respeitada, o "bloco extra" vira obrigatório (não opcional).
3. **Validar Tripo**: confirmar formato de input e output, latência da geração 3D, estabilidade da API com chamadas em série.
4. **Validar conversor SVG (placeholder)**: definir interface mínima do mock para que o desenvolvimento avance sem bloqueios.
5. **Cronômetro real**: um designer faz 1 drop completo no fluxo manual e mede tempo. Depois faz outro drop usando o MVP em construção. Compara.

---

## 15. Próximos passos (vibe coding)

### Antes de abrir o Cursor / Claude Code

1. Ler este PRD completo.
2. Ler o Anexo A (prompt do Fluxo 1) e o Anexo B (design brief).
3. Confirmar que as duas pastas de biblioteca (`bibliotecaA/` e `bibliotecaB/`) estão populadas com as 7 e 11 imagens respectivamente.
4. Criar `js/config.js` com `OPENAI_API_KEY` e `TRIPO_API_KEY` (não comitar).

### Primeiro prompt para a IA programadora

Sugestão de mensagem inicial para Cursor / Claude Code:

> "Vamos construir o STLAI Asset Generator, um MVP em HTML/CSS/JS vanilla. Anexei o PRD completo, o prompt base do Fluxo 1 e a design brief. Comece pela Tela 1 (Home) com os três cards. Use a paleta da design brief. Não use frameworks. Não inclua backend — todas as chamadas de API são feitas direto do browser via fetch, com as API keys lidas de `config.js`."

### Ordem de construção sugerida

1. **Setup**: estrutura de pastas, `index.html`, `config.js`, CSS base com paleta.
2. **Tela 1 — Home**: três cards, navegação para os fluxos.
3. **Fluxo 1 — Tela de configuração**: upload + biblioteca + prompt + bloco extra.
4. **Fluxo 1 — Integração OpenAI**: chamada real com 1 personagem para validar.
5. **Fluxo 1 — Tela de preview**: grid + seleção + ZIP.
6. **Fluxo 1 — Tela de configuração 3D + Tripo**: integração + ZIP final.
7. **Fluxo 2 e Fluxo 3**: replicar padrão do Fluxo 1 com as adaptações necessárias.
8. **Polish visual**: aplicar design brief com mais rigor, ajustar espaçamentos.

---

## Anexo A — Prompt base do Fluxo 1 (versão genérica)

> Este prompt é a versão final, com todas as referências a pose/postura removidas. A definição de pose vem 100% da Imagem 1 (upload do usuário). O bloco extra do usuário deve ser inserido como seção **USER ADDITIONAL INSTRUCTIONS** logo antes de **ABSOLUTE DO NOTs**.
>
> A linha sobre proporções foi atualizada para `"do not drift toward proportions different from Image 1"` (substituindo a referência específica a bobblehead/chibi).

```
MULTI-IMAGE INSTRUCTION — STRICT ROLE SEPARATION
You will use TWO input images with completely different functions.

IMAGE 1 = POSE / PROPORTION / COMPOSITION / CAMERA BLUEPRINT ONLY
Use Image 1 ONLY as a non-visual technical blueprint for:
– pose
– posture
– full body rig
– body proportions
– head-to-body ratio
– head size
– head direction
– head rotation
– head tilt
– leg length
– hand size
– hand placement
– foot placement
– support points
– contact points with the base when applicable
– center of gravity
– torso angle
– chest orientation
– shoulder posture
– neck placement
– overall body language
– silhouette balance
– camera position
– camera angle
– framing
– composition
– base size relative to the character
– empty margin around the subject and base

[... CONTEÚDO COMPLETO DO PROMPT FORNECIDO PELO TIAGO, COM ESTAS DUAS ALTERAÇÕES:]

[1] EM "HARD RULES", SUBSTITUIR:
"– do not drift toward bobble-head or chibi proportions"
POR:
"– do not drift toward proportions different from Image 1"

[2] INSERIR ANTES DE "ABSOLUTE DO NOTs":

USER ADDITIONAL INSTRUCTIONS
{bloco_extra_do_usuario}
```

> **Nota para implementação**: o prompt completo (com a alteração [1] aplicada e o placeholder [2] inserido) deve ser salvo em `js/prompts.js` como constante `PROMPT_FLUXO1_BASE`. O bloco extra do usuário substitui `{bloco_extra_do_usuario}` em runtime.

---

## Anexo B — Design Brief

### Identidade

- **Nome da ferramenta**: STLAI Asset Generator
- **Subbrand**: STLAI (operação de IA da STLFLIX)

### Paleta de cores (baseada na identidade STLAI)

- **Background primário**: lavanda clara (`#C8B8E8` aproximado).
- **Background secundário / cards**: branco (`#FFFFFF`).
- **Texto primário**: cinza-escuro (`#2A2A35`) ou branco quando sobre fundo escuro.
- **Acentos do logo (gradiente)**: azul (`#5468FF`) → magenta (`#C770A8`).
- **Acentos vivos** (vindos dos personagens 3D STLAI): amarelo (`#F4C842`), coral (`#F58A6E`), cyan (`#4BB8E8`), verde-limão (`#C8DD3E`). **Usar com moderação**, apenas em hover, status, ou destaques.

### Tipografia

- **Fonte primária**: Inter, Geist, ou similar sans-serif moderna.
- **Hierarquia**:
  - H1 (título de tela): 32px, semi-bold.
  - H2 (subtítulo): 20px, semi-bold.
  - Body: 14-16px, regular.
  - Small / labels: 12px, medium.

### Tom geral

- **Profissional-clean com personalidade da marca**.
- Layout limpo e produtivo (referência mental: Linear, Vercel dashboard).
- Densidade média — nem apertado, nem espalhado demais.
- Foco em clareza e legibilidade.
- A paleta da STLAI (lavanda + branco + gradiente do logo) presente, mas sem dominar — é uma ferramenta de trabalho, não uma landing page.

### Componentes visuais sugeridos

- **Cards** com bordas arredondadas suaves (`border-radius: 12-16px`), sombra leve.
- **Botões primários**: gradiente azul→magenta do logo (efeito sutil), texto branco.
- **Botões secundários**: fundo branco, borda fina, texto escuro.
- **Drop zones**: bordas tracejadas, hover em lavanda, ícone central.
- **Inputs**: fundo branco, borda fina cinza-clara, foco em azul do logo.
- **Loading states**: barra de progresso ou spinner em gradiente do logo.

### O que evitar

- Excesso de cor (a marca tem cores vivas, mas a ferramenta interna não precisa estampar tudo).
- Densidade excessiva (apertar muitos elementos na mesma tela).
- Estilo "infantil saturado" — apesar da personalidade lúdica da marca, a ferramenta é de trabalho.
- Dark mode no MVP — manter light mode com lavanda/branco para consistência com a identidade STLAI.

---

## Itens em aberto / a confirmar durante implementação

1. **Modelo OpenAI exato**: confirmar nome do endpoint para "GPT-Image-2" na documentação atual da OpenAI no início do desenvolvimento.
2. **Conversor SVG**: substituir o placeholder pela solução do conhecido em momento posterior.
3. **Parâmetros da Tripo**: refinar a Tela 2C (configuração 3D) com base no MVP existente que o time já usa.
4. **Prompt do Fluxo 3**: definir versão específica para combinar imagem de estilo (upload) + frase ilustrada (Biblioteca B), seguindo a mesma lógica de duas imagens do Fluxo 1 (Image 1 = blueprint da composição da frase, Image 2 = estilo visual). Esse prompt roda no fundo, sem campo de texto exposto na Home.
5. **Biblioteca B — expansão**: adicionar as 13 imagens restantes (total de 24) ao longo do desenvolvimento.

---

**Versão**: 1.1
**Data**: 30/04/2026
**Próximo marco**: Demo Day em 08/05/2026.

**Changelog**
- **1.1** (30/04/2026): seção 5 (jornadas dos 3 fluxos) e seção 7 (telas) reescritas para refletir a Home final em 2 colunas. Bloco extra do Fluxo 1 reposicionado entre o botão UPLOAD e o botão Biblioteca A. Tela de preview do Fluxo 1 confirmada e padronizada com a mesma UI da Biblioteca. Tela de configuração da Tripo detalhada com os campos de referência (Versão do Modelo, Mesh Resolution, Polycount, Formato, Nome do arquivo, Gerar 3D / Limpar).
- **1.0** (30/04/2026): versão inicial após confirmação seção a seção do contexto do PRD.
