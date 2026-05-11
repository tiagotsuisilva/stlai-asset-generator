# Handoff — Resumo (lê este primeiro)

> Atualizado em: 11/05/2026 (vigésima revisão — **Pasta local movida pra `C:\projetos_claude\`**)
> Para detalhes completos: [`HANDOFF.md`](./HANDOFF.md)

## Estado atual

MVP completo, deployado, rodando em mock. **Pasta local agora em `C:\projetos_claude\stlai-asset-generator`** (saiu de `Downloads/`). Vercel e GitHub não afetados — auto-deploy continua funcionando normalmente. **Biblioteca C (poses) populada com 17 imagens reais** (`pose1.png`..`pose17.png`) — Pose Transfer Flow agora pode ser navegado de ponta a ponta. **Estratégia de prompts do 3D Character Flow é "prompt completo por caso"**: a montagem modular antiga foi desativada e marcada como DEPRECATED em `js/prompts.js`. A UI seleciona um único `promptId` que aponta para um prompt completo no mapa `PROMPTS_3D_CHARACTER_FLOW`. **12/12 prompts definitivos** — todo o 3D Character Flow está com prompts completos: 4 casos por imagem (image1/image2 × keep/remove) + 4 pares manuais (cute toy premium, chibi cute toy, semi-realistic statue resin, realistic painted resin × keep/remove).

## Última mudança — Pasta local movida (11/05/2026 — vigésima revisão)

- Pasta local saiu de `C:\Users\tiago\Downloads\stlai-asset-generator\stlai-asset-generator` pra `C:\projetos_claude\stlai-asset-generator`. Motivo: Downloads não é bom local pra projeto longo-prazo; OneDrive foi descartado por causa de conflitos potenciais com `.git`.
- Vercel e GitHub não afetados — o deploy continua sendo trigger do push pra `main` no GitHub, independente da pasta local.
- Path antigo substituído em `CLAUDE.md`, `docs/HANDOFF.md`, `docs/HANDOFF_RESUMO.md`, `docs/CHATGPT_INSTRUCTIONS.md`. Nome final é tudo minúsculo com underscore (`projetos_claude`) — sem espaço, então blocos PowerShell não precisam de aspas no `cd`.

## Última mudança — Biblioteca C populada (08/05/2026 — décima nona revisão)

- **17 poses reais** copiadas de `C:\Users\tiago\Downloads\POSES_STLAI_ASSET\` pra `bibliotecaC/` (mantidos como `pose1.png`..`pose17.png`).
- `bibliotecaC/bibliotecaC.json` reescrito: 17 entradas com `id`, `title`, `description`, `image`, `tags`, `poseType` (standing/action), `visibilityType` (full_body em todas).
- Catalogação manual: 5 standing (em pé com gestos casuais/heroicos) + 12 action (combate, lunge, soco, chute, fisiculturismo, espada+escudo, espadão, arco e flecha, conjurando energia).
- `js/ui.js → renderBiblioteca`: novo mapa `POSE_TYPE_LABELS` (`standing→"Em pé"`, `action→"Ação"`, etc.) e fallback de meta agora prefere `poseType` traduzido sobre `visibilityType` (que era uniforme "full_body" e aparecia feio no card).
- Sem mudança em arquitetura, no estado, no fluxo de geração ou em outras telas — `executarGeracao` e `gerarImagensFluxoPose` já estavam compatíveis com a Biblioteca C.

## Última mudança — 3D Character Flow 100% preenchido (08/05/2026 — décima oitava revisão)

- `THREED_MANUAL_REALISTIC_PAINTED_RESIN_REMOVE_ACCESSORIES` preenchido em `js/prompts.js` (template literal dentro do mapa) e em `docs/PROMPTS_3D_CHARACTER_FLOW.md` (seção do prompt + status na tabela como ✅ definitivo, descrição expandida com state completo da UI).
- Caso correspondente: `accessoriesMode = remove` + `styleSource = manual` + proporção default + realismo realistic + painted_collectible_resin.
- **Marco final**: o mapa `PROMPTS_3D_CHARACTER_FLOW` está com **0 placeholders** — todos os 12 IDs apontam pra um prompt completo. Qualquer combinação válida da UI no 3D Flow agora resolve pra um prompt definitivo, sem warnings de placeholder no console.
- Sem mudança em arquitetura, na UI ou em outros fluxos.

## Próximas etapas sugeridas

Agora que o 3D Flow tem prompts completos, as próximas frentes são:

- **Validação**: testar no real (com OpenAI) cada um dos 12 casos pra confirmar que os prompts entregam o resultado esperado. Pode começar pelos casos por imagem (mais usados) e ir pros presets manuais.
- **Prompts do 2D Flow e Pose Transfer Flow**: ainda em placeholder. A mesma estratégia de "prompt completo por caso" pode (e deve) ser aplicada se o número de combinações for tratável.
- **Renomear 7 .jpg da Biblioteca A** (pendência crítica antiga, lista no `HANDOFF.md`).
- **Validar nome do modelo OpenAI** (`gpt-image-2` vs `gpt-image-1`).
- **Substituir stub `callTripoAPI()`** pela integração real da STLFLIX.

A área "Personalização Manual" do 3D Flow estava aparecendo mesmo quando deveria ficar escondida (CSS `.manual-block { display: flex }` sobrescrevia o atributo `[hidden]`). Agora há regra `.manual-block[hidden] { display: none }` — área aparece **apenas** quando `styleSource = manual`, e o botão "Abrir Biblioteca A" sobe naturalmente quando ela está oculta. Mesma correção aplicada implicitamente ao Pose Flow (mesmo seletor).

## Última mudança — Estratégia "prompt completo por caso" (08/05/2026 — sexta revisão)

### Por que mudou

A montagem modular antiga (5 casos consolidados: 3 via imagem + 2 via modo manual via `build3DManualPromptBody`) gerava resultados inconsistentes em runtime e era difícil de depurar. Trocamos por um modelo simples: cada combinação importante da UI → um `promptId` → um prompt completo autocontido.

### O que mudou no código

- **`js/prompts.js`**:
  - Novo mapa `PROMPTS_3D_CHARACTER_FLOW` com 12 `promptId`s, todos `[AGUARDANDO PROMPT DEFINITIVO]`.
  - Nova função `resolve3DCharacterPromptId(options)` — recebe `appState.threeDFlowOptions` e devolve o `promptId` correspondente (ou `null` se for combinação manual sem preset definido).
  - `build3DCharacterPrompt(opcoes, blocoExtra)` reescrito: usa o resolver e o mapa novo. Anexa `USER ADDITIONAL INSTRUCTIONS` se houver bloco extra.
  - `build3DManualPromptBody`, `PROMPT_3D_CASE_*` e mapas auxiliares (`AESTHETIC_PROMPT_MAP` etc.) marcados como **DEPRECATED** via comentários — mantidos no arquivo só como referência histórica, não chamados pelo pipeline.
  - Exports novos: `window.PROMPTS_3D_CHARACTER_FLOW`, `window.resolve3DCharacterPromptId`.

- **`css/style.css`**: regra nova `.manual-block[hidden] { display: none; }` corrige o bug em que a área manual ficava sempre visível.

- **`js/api.js`**: sem mudanças — continua chamando `window.build3DCharacterPrompt(opcoes, blocoExtra)` (a interface do builder é a mesma).

- **`index.html`**: sem mudanças — UI permanece idêntica. Os blocos da Personalização Manual já tinham `hidden` por padrão; o handler em `ui-flows.js` já liga/desliga via `data-toggle-manual="manual-block-3d"`. Só faltava a regra CSS pra `[hidden]` ser respeitada.

### Resolução do `promptId`

| `styleSource` | `accessoriesMode` | `promptId` |
|---|---|---|
| `image1` | `keep` | `THREED_KEEP_ACCESSORIES_STYLE_IMAGE1` |
| `image1` | `remove` | `THREED_REMOVE_ACCESSORIES_STYLE_IMAGE1` |
| `image2` | `keep` | `THREED_KEEP_ACCESSORIES_STYLE_IMAGE2` |
| `image2` | `remove` | `THREED_REMOVE_ACCESSORIES_STYLE_IMAGE2` |
| `manual` | (varia) | um dos 8 presets manuais — match heurístico, ou `null` (placeholder genérico + warning) |

Os 8 presets manuais e regras de match estão documentados em [`PROMPTS_3D_CHARACTER_FLOW.md`](./PROMPTS_3D_CHARACTER_FLOW.md).

### Documentação

- [`PROMPTS_3D_CHARACTER_FLOW.md`](./PROMPTS_3D_CHARACTER_FLOW.md) — **fonte da verdade** para os prompts do 3D Flow daqui pra frente. Tabela + seção por `promptId` + regras de match + processo de preenchimento.
- [`PROMPTS_TODO.md`](./PROMPTS_TODO.md) — marcado como DEPRECATED para o 3D Flow no topo do arquivo. Permanece como referência histórica e ainda relevante para os outros fluxos (2D, Pose).

## Última mudança — Modo manual completo do 3D Flow (07/05/2026 — quinta revisão)

- **Casos novos consolidados**: `accessoriesMode = "keep"` + `styleSource = "manual"` e `accessoriesMode = "remove"` + `styleSource = "manual"`.
- **Builder dinâmico** `build3DManualPromptBody(opcoes)` em `js/prompts.js` concatena, nesta ordem:
  1. `PROMPT_3D_MANUAL_SHELL_BASE` — header (Image 1 = só estrutura, Image 2 = só identidade).
  2. `PROMPT_MODULE_STYLE_SOURCE_MANUAL` — fixa que estilo NÃO vem das imagens.
  3. `PROMPT_MODULE_ACCESSORIES_KEEP` ou `_REMOVE`.
  4. Estética (cada slug em `aestheticModifiers[]`, multi).
  5. Proporção (`PROMPT_MODULE_PROPORTION_DEFAULT` ou `_CHIBI`).
  6. Realismo (`_STYLIZED` / `_SEMI_REALISTIC` / `_REALISTIC`).
  7. Material (`_MATTE_VINYL` / `_SMOOTH_RESIN` / `_PAINTED_RESIN`).
  8. Técnico (cada slug em `technicalModifiers[]`, multi).
  9. `PROMPT_GLOBAL_ANTI_INTERFERENCE` — regras condicionais por último.
  10. `USER ADDITIONAL INSTRUCTIONS` (anexado pelo `build3DCharacterPrompt`).
- `build3DCharacterPrompt` ganhou roteamento: se `styleSource === "manual"` (com `accessoriesMode` `keep` ou `remove`), delega pro builder modular. Demais casos seguem usando o lookup table dos casos consolidados (`keep__image1`, `remove__image1`, `remove__image2`).
- Casos consolidados antigos preservados — smoke test confirma que blocos manuais não vazam pra eles.
- `PROMPT_GLOBAL_ANTI_INTERFERENCE` substituído pelo conteúdo definitivo (regras condicionais, nunca fixas).
- Mapas auxiliares: `AESTHETIC_PROMPT_MAP`, `PROPORTION_PROMPT_MAP`, `REALISM_PROMPT_MAP`, `MATERIAL_PROMPT_MAP`, `TECHNICAL_PROMPT_MAP`.
- `docs/PROMPTS_TODO.md` atualizado: 5 casos consolidados na tabela, todos os módulos manuais marcados como ✅ Registrado.

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
- **Local**: `C:\projetos_claude\stlai-asset-generator`
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
2. ~~Preencher prompts do 3D Character Flow~~ ✅ **12/12 concluído** — todos os prompts definitivos preenchidos.
3. Validar nome do modelo OpenAI (`gpt-image-2` vs `gpt-image-1`).
4. Substituir stub `callTripoAPI()` pela integração real da STLFLIX.

## Pendências secundárias

5. Popular Biblioteca B (11 imagens).
6. ~~Popular Biblioteca C com imagens reais de poses~~ ✅ **17/17 concluído** (08/05/2026).
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
cd C:\projetos_claude\stlai-asset-generator
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
C:\projetos_claude\stlai-asset-generator

Por favor:
1. Pede acesso a essa pasta (use a ferramenta request_cowork_directory com esse caminho exato).
2. Depois que a pasta estiver conectada, lê o `CLAUDE.md` na raiz dela.
3. Lê também `docs/HANDOFF_RESUMO.md`.
4. Só lê outros arquivos (HANDOFF.md, PRD, código) se a tarefa pedir contexto profundo.
5. Me diz em 2-3 linhas onde estamos e qual é a próxima tarefa lógica.
```
