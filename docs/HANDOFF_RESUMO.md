# Handoff — Resumo (lê este primeiro)

> Atualizado em: 07/05/2026 (segunda revisão)
> Para detalhes completos: [`HANDOFF.md`](./HANDOFF.md)

## Estado atual

MVP completo, deployado, rodando em mock. **Reestruturação 3 fluxos + 1º caso real consolidado**: 3 fluxos modulares (3D / 2D / Pose Transfer), Biblioteca C, blocos modulares (Acessórios / Estilo / Estética / Proporção / Realismo / Material / Técnico), upload clicável, lightbox. Primeiro caso real do 3D (`accessoriesMode = keep` + `styleSource = image1`) registrado e ativo. Demais casos aguardando prompts.

## Última mudança — Terceiro caso real do 3D Flow (07/05/2026 — quarta revisão)

- **Caso novo consolidado**: `accessoriesMode = "remove"` + `styleSource = "image2"`.
  - Constante `PROMPT_3D_CASE_REMOVE_IMAGE2` em `js/prompts.js`. Image 1 = só estrutura. Image 2 = identidade + estilo (sem acessórios externos). Acessórios removíveis suprimidos; identidade/cabelo/rosto/armadura/roupa principal preservados.
  - Entrada `'remove__image2'` adicionada ao lookup do `build3DCharacterPrompt`.
- Casos consolidados ativos: `keep__image1`, `remove__image1`, `remove__image2`. Demais combinações caem em placeholder + warning no console.
- `docs/PROMPTS_TODO.md` atualizado: linha 3 na tabela de "Casos consolidados".

### Casos anteriores (referência)

- `keep__image1` — `PROMPT_3D_CASE_KEEP_IMAGE1`. Image 1 = estrutura + estilo. Image 2 = identidade + acessórios preservados.
- `remove__image1` — `PROMPT_3D_CASE_REMOVE_IMAGE1`. Image 1 = estrutura + estilo. Image 2 = identidade pura.
- Pipeline: `js/api.js → gerarImagensFluxo1` chama o builder; `js/ui.js → executarGeracao` passa `appState.threeDFlowOptions`.
- UI da "Personalização manual" aparece só com `styleSource = "manual"`.

### Casos anteriores (referência)

- `keep__image1` (07/05, segunda revisão) — `PROMPT_3D_CASE_KEEP_IMAGE1`. Image 1 = estrutura + estilo. Image 2 = identidade + acessórios preservados.
- Pipeline: `js/api.js → gerarImagensFluxo1` chama o builder; `js/ui.js → executarGeracao` passa `appState.threeDFlowOptions`.
- UI da "Personalização manual" aparece só com `styleSource = "manual"` (já implementado pela camada modular).

- **App**: https://stlai-asset-generator.vercel.app
- **Repo**: https://github.com/tiagotsuisilva/stlai-asset-generator
- **Local**: `C:\Users\tiago\Downloads\stlai-asset-generator\stlai-asset-generator`
- **Demo Day**: 08/05/2026

## Última mudança — 3 fluxos modulares + Pose Transfer (07/05/2026)

### Landing
- 3 cards centrais: **3D Character Flow**, **2D Character Flow**, **Pose Transfer Flow**.

### 3D Character Flow
- Upload **clicável** (área substitui o botão UPLOAD antigo).
- Removida Biblioteca B desta tela. Biblioteca A é a única.
- Blocos modulares com state em `appState.threeDFlowOptions`:
  - **Acessórios** (segmented, single): `keep` | `remove`.
  - **Direção de estilo** (segmented, single): `image1` | `image2` | `manual`.
  - Quando `manual`: aparece bloco com 5 sub-eixos em grid:
    - **Estética** (chips, multi): cute / toy / premium_collectible / designer_toy / stylized_statue.
    - **Proporção** (segmented, single): default | chibi.
    - **Nível de realismo** (segmented, single): stylized | semi_realistic | realistic.
    - **Material** (segmented, single): matte_vinyl | smooth_resin | painted_collectible_resin.
    - **Regras técnicas** (chips, multi): print_friendly.

### 2D Character Flow
- Layout em **2 colunas** com design dark:
  - Esquerda: upload clicável + Biblioteca B (alimenta `fluxo3` — SVG textual).
  - Direita: textarea + Biblioteca A (alimenta `fluxo2` — SVG por imagem).

### Pose Transfer Flow (novo)
- Tela própria com upload clicável + textarea + mesmos blocos modulares do 3D Flow (state em `appState.poseFlowOptions`).
- Labels da Direção de estilo adaptadas: "Estilo do personagem / Estilo da pose / Escolher estilo".
- Botão Biblioteca C abre poses; após geração, vai pro screen-preview com CTA "Baixar selecionadas".

### Biblioteca C (nova)
- `bibliotecaC/bibliotecaC.json` com 7 placeholders de pose (id, title, description, image, tags, poseType, visibilityType).
- Sem imagens reais ainda — placeholders renderizam o SVG fallback do app.

### Lightbox no preview
- Click na imagem do preview/result → abre lightbox com botão de download.
- Botão de seleção (checkmark circular) separado no canto superior esquerdo do card.

### Prompts modulares (placeholders)
- `docs/PROMPTS_TODO.md` — mapa completo de prompts futuros, com seção pra cada módulo + regras anti-interferência + conflitos conhecidos.
- `js/prompts.js` — constantes placeholder pra todos os módulos. Substituir `[AGUARDANDO PROMPT DEFINITIVO]` quando os prompts forem aprovados.

### API
- `js/api.js` ganhou `gerarImagensFluxoPose` (mock + estrutura pronta pra prompt real).

## Arquivos novos / alterados (07/05)

- **Novos**:
  - `bibliotecaC/bibliotecaC.json`
  - `docs/PROMPTS_TODO.md`
  - `js/ui-flows.js` (handlers modulares + lightbox + click-to-upload)
- **Alterados**:
  - `index.html` (3º card landing, novos screen-flow-3d / 2d / pose, lightbox)
  - `css/style.css` (option-block, segmented, chips, manual-block, flow-2col, lightbox, upload-zone)
  - `js/ui.js` (state expandido, biblioteca por fluxo, fluxoPose handler)
  - `js/api.js` (gerarImagensFluxoPose)
  - `js/prompts.js` (placeholders)

## Pendências críticas (bloqueantes pro Demo Day)

1. Renomear 7 .jpg da Biblioteca A pros IDs corretos (lista no `HANDOFF.md`).
2. **Escrever os prompts definitivos** em `js/prompts.js` substituindo os `[AGUARDANDO PROMPT DEFINITIVO]`. Mapa em `docs/PROMPTS_TODO.md`.
3. Validar nome do modelo OpenAI (`gpt-image-2` vs `gpt-image-1`).
4. Substituir stub `callTripoAPI()` pela integração real da STLFLIX.

## Pendências secundárias

5. Popular Biblioteca B (11 imagens).
6. Popular Biblioteca C com imagens reais de poses (hoje só JSON placeholder).
7. Smoke test final na URL pública (3 fluxos, blocos modulares, lightbox).
8. Eventual refinamento das telas internas (biblioteca/preview/tripo) seguindo o novo visual.

## State modular dos fluxos (referência rápida)

```js
appState.threeDFlowOptions = {
  accessoriesMode: 'keep',           // keep | remove
  styleSource: 'image1',             // image1 | image2 | manual
  aestheticModifiers: [],            // multi: cute|toy|premium_collectible|designer_toy|stylized_statue
  proportionPreset: 'default',       // default | chibi
  realismLevel: 'stylized',          // stylized | semi_realistic | realistic
  materialFinish: 'matte_vinyl',     // matte_vinyl | smooth_resin | painted_collectible_resin
  technicalModifiers: [],            // multi: print_friendly
};
// appState.poseFlowOptions tem a mesma estrutura.
```

## Como rodar local

```powershell
cd C:\Users\tiago\Downloads\stlai-asset-generator\stlai-asset-generator
npx serve
```

## Fluxo de trabalho

- **Planejamento e revisão**: ChatGPT (ver [`CHATGPT_INSTRUCTIONS.md`](./CHATGPT_INSTRUCTIONS.md)).
- **Execução com arquivos / commits**: Claude Cowork (ver [`../CLAUDE.md`](../CLAUDE.md)).
- **Memória entre sessões**: este arquivo + `HANDOFF.md`.

---

## Prompt de abertura — copiar e colar em conversa nova do Claude Cowork

```
Estou continuando o projeto STLAI Asset Generator.

Pasta local do projeto:
C:\Users\tiago\Downloads\stlai-asset-generator\stlai-asset-generator

Por favor:
1. Pede acesso a essa pasta (use a ferramenta request_cowork_directory com esse caminho exato).
2. Depois que a pasta estiver conectada, lê o `CLAUDE.md` na raiz dela.
3. Lê também `docs/HANDOFF_RESUMO.md`.
4. Só lê outros arquivos (HANDOFF.md, PRD, código) se a tarefa pedir contexto profundo.
5. Me diz em 2-3 linhas onde estamos e qual é a próxima tarefa lógica.
```
