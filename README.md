# STLAI Asset Generator

MVP de validação para geração em lote de assets visuais para drops da STLFLIX.
HTML + CSS + JavaScript vanilla, sem backend, rodando localmente.

> **Demo Day**: 08/05/2026.

## Documentação do projeto

- [`docs/HANDOFF_RESUMO.md`](docs/HANDOFF_RESUMO.md) — estado atual em 1 tela (lê primeiro a cada sessão nova).
- [`docs/HANDOFF.md`](docs/HANDOFF.md) — handoff completo (lê só quando precisar de contexto profundo).
- [`docs/PRD_STLAI_Asset_Generator.md`](docs/PRD_STLAI_Asset_Generator.md) — PRD v1.1 completo.
- [`CLAUDE.md`](CLAUDE.md) — instruções permanentes pro Claude Cowork (execução).
- [`docs/CHATGPT_INSTRUCTIONS.md`](docs/CHATGPT_INSTRUCTIONS.md) — instruções pro ChatGPT (planejamento).

---

## Como rodar

### 1. Servir os arquivos

A forma mais simples é usar o `npx serve` (precisa de Node instalado):

```bash
cd stlai-asset-generator
npx serve
```

E abrir o endereço que aparecer (ex: `http://localhost:3000`).

Alternativa com Python (se preferir):

```bash
python3 -m http.server 8000
```

> Abrir o `index.html` direto no navegador (`file://`) **não funciona bem** porque o `fetch` dos JSONs das bibliotecas é bloqueado por CORS local. Use sempre um servidor.

### 2. Configurar API keys (opcional)

Clique no ícone de **engrenagem** no header. Cole:

- **OpenAI API Key** — sua chave da OpenAI (`sk-...`).
- **OpenAI Image Model** — `gpt-image-2` (confirme o nome exato na docs atual da OpenAI).
- **Tripo API Key** — sua chave da Tripo.

As chaves ficam salvas no **localStorage do navegador** (não em arquivo — não comita acidentalmente).

> Se não configurar nada, o app roda em **modo Mock**: gera imagens placeholder bonitas via canvas e SVGs mock. Útil pra demonstrar o fluxo sem queimar API.

### 3. Popular as bibliotecas

Coloque os PNGs nas pastas com os nomes que estão nos JSONs:

- `bibliotecaA/` — 7 PNGs (ex: `drago_lava.png`, `husky.png`, `gato_malhado.png`, ...).
- `bibliotecaB/` — 11 PNGs (ex: `birthday_gift.png`, `your_pet.png`, ...).

Se faltar uma imagem, o app exibe um placeholder lavanda no lugar.

---

## Os 3 fluxos

**Fluxo 1 — Personagem 3D**
Home (lado esquerdo) → upload + bloco extra → Biblioteca A → Preview → Configuração Tripo → ZIP com modelos 3D.

**Fluxo 2 — SVG por imagem**
Home (lado direito) → prompt → Biblioteca A → ZIP com SVGs + imagens estilizadas.

**Fluxo 3 — SVG textual**
Home (lado esquerdo) → upload (estilo) → Biblioteca B → ZIP com SVGs textuais.

---

## Estrutura

```
stlai-asset-generator/
├── index.html              Single-page com todas as telas
├── css/style.css           Estilo completo (paleta da design brief)
├── js/
│   ├── config.js           Carrega/salva config do localStorage
│   ├── prompts.js          PROMPT_FLUXO1_BASE com placeholders
│   ├── api.js              OpenAI + Tripo + ImageTracer + Mock
│   └── ui.js               Navegação e estado da app
├── bibliotecaA/
│   ├── bibliotecaA.json    7 personagens já cadastrados
│   └── *.png               (você adiciona aqui)
├── bibliotecaB/
│   ├── bibliotecaB.json    11 frases ilustradas já cadastradas
│   └── *.png               (você adiciona aqui)
├── .gitignore
└── README.md
```

---

## Bibliotecas externas (via CDN)

- **JSZip** — empacotamento dos outputs em ZIP.
- **ImageTracer.js** — conversão raster (PNG) → vector (SVG) client-side.

Nenhum framework ou build step.

---

## Modo Mock — como funciona

Quando não há `OPENAI_API_KEY` configurada (ou `MOCK_MODE = true` no Settings):

- **Imagens geradas**: canvas com gradiente da paleta STLAI + nome do personagem + label "MOCK".
- **SVGs**: SVG simples com texto e círculo.
- **Modelos 3D**: arquivo de texto stub (`.glb`).

Tudo flui igualzinho — preview, seleção, Tripo, ZIP — só o conteúdo muda. Ideal pra demo Day se a key OpenAI ainda não estiver pronta.

Um badge amarelo **MODO MOCK** aparece no header sempre que esse modo estiver ativo.

---

## Próximos passos / Itens em aberto

- [ ] Colar o conteúdo completo do prompt do Fluxo 1 nas seções marcadas com `[COLAR AQUI ...]` em `js/prompts.js`.
- [ ] Adicionar os PNGs nas pastas das bibliotecas (7 + 11 imagens).
- [ ] Validar o nome exato do modelo OpenAI durante a Semana 1 do plano de validação.
- [ ] Substituir o stub `callTripoAPI()` em `js/api.js` pela integração real do MVP existente da STLFLIX.
- [ ] Definir o prompt do Fluxo 3 e atualizar `PROMPT_FLUXO3_BASE` em `js/prompts.js`.

---

## Troubleshooting

**"Falha ao carregar bibliotecas"**
Você abriu o `index.html` direto (`file://`)? Use `npx serve` ou `python3 -m http.server`.

**"OpenAI 401: Incorrect API key"**
Reabra o modal de Settings e confirme a chave. Ela fica em localStorage, então persiste entre reloads.

**"OpenAI 404: model gpt-image-2 not found"**
O nome do modelo pode ter mudado. Tente `gpt-image-1` no campo "OpenAI Image Model" do Settings.

**Imagens placeholder aparecem mesmo com a chave configurada**
Pode ser cache do navegador segurando o `MOCK_MODE`. Abra Settings, desmarque "Forçar modo Mock" e salve.

---

**Versão**: 1.0 — MVP completo (alinhado ao PRD v1.1).
