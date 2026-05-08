# PROMPTS_TODO — placeholders e arquitetura modular

> ⚠️ **DEPRECATED para o 3D Character Flow** (08/05/2026).
> A estratégia modular (montar prompt final concatenando bloquinhos) foi substituída por **prompt completo por caso**.
> Para o 3D Character Flow, ver: [`PROMPTS_3D_CHARACTER_FLOW.md`](./PROMPTS_3D_CHARACTER_FLOW.md).
> Este arquivo permanece como referência histórica das constantes modulares (ainda usadas por outros fluxos / mantidas como código DEPRECATED em `js/prompts.js`).
>
> Status anterior: 5 casos consolidados do 3D Flow (3 via imagem + 2 via modo manual). Módulos manuais (Estética / Proporção / Realismo / Material / Técnico) registrados.
> Última atualização: 07/05/2026 (quinta revisão — modo manual completo).

## Casos consolidados (com prompt aprovado)

| # | Fluxo | Combinação de state | Constante / builder |
|---|---|---|---|
| 1 | 3D Character Flow | `accessoriesMode = "keep"` + `styleSource = "image1"` | `PROMPT_3D_CASE_KEEP_IMAGE1` em `js/prompts.js` |
| 2 | 3D Character Flow | `accessoriesMode = "remove"` + `styleSource = "image1"` | `PROMPT_3D_CASE_REMOVE_IMAGE1` em `js/prompts.js` |
| 3 | 3D Character Flow | `accessoriesMode = "remove"` + `styleSource = "image2"` | `PROMPT_3D_CASE_REMOVE_IMAGE2` em `js/prompts.js` |
| 4 | 3D Character Flow | `accessoriesMode = "keep"` + `styleSource = "manual"` | `build3DManualPromptBody({ accessoriesMode: 'keep', ... })` em `js/prompts.js` |
| 5 | 3D Character Flow | `accessoriesMode = "remove"` + `styleSource = "manual"` | `build3DManualPromptBody({ accessoriesMode: 'remove', ... })` em `js/prompts.js` |

Roteamento atual:
- `js/api.js → gerarImagensFluxo1` chama `window.build3DCharacterPrompt(opcoes, blocoExtra)`.
- O builder primeiro detecta `styleSource === "manual"` (com `accessoriesMode` válido) e delega para `build3DManualPromptBody`, que monta o prompt dinamicamente a partir dos módulos manuais.
- Para os demais casos, usa o **lookup table** com chave `${accessoriesMode}__${styleSource}`. Resolvem hoje: `keep__image1`, `remove__image1`, `remove__image2`.
- Combinações restantes (ex: `keep__image2`) caem num placeholder `[AGUARDANDO PROMPT DEFINITIVO PARA: ...]` e logam um warning no console.

Próximos casos prioritários a escrever (sugestão):
- `keep` + `image2`

> Documento serve como mapa dos prompts que serão escritos depois (fora do Claude). Não escrever prompts finais aqui — só preencher quando aprovados.

---

## Como o prompt final é montado (3D CHARACTER FLOW)

A montagem futura segue esta ordem de concatenação:

1. **Prompt base** do fluxo (3D, 2D ou Pose Transfer)
2. **Bloco de Acessórios** (`accessoriesMode`)
3. **Bloco de Direção de estilo** (`styleSource`)
4. **Blocos manuais** (só quando `styleSource = manual`):
   - Estética (`aestheticModifiers[]`)
   - Proporção (`proportionPreset`)
   - Realismo (`realismLevel`)
   - Material (`materialFinish`)
   - Técnico (`technicalModifiers[]`)
5. **Instruções adicionais do usuário** (textarea livre)
6. **Regras globais anti-interferência** (sempre por último)

---

## 1. Prompt base — 3D CHARACTER FLOW

**Trigger**: fluxo 3D selecionado a partir da landing.
**Constante**: `PROMPT_3D_CHARACTER_BASE`

```
[AGUARDANDO PROMPT DEFINITIVO]
```

---

## 2. Prompt base — 2D CHARACTER FLOW

**Trigger**: fluxo 2D selecionado a partir da landing.
**Constante**: `PROMPT_2D_CHARACTER_BASE`

```
[AGUARDANDO PROMPT DEFINITIVO]
```

---

## 3. Prompt base — POSE TRANSFER FLOW

**Trigger**: fluxo Pose Transfer selecionado a partir da landing.
**Constante**: `PROMPT_POSE_TRANSFER_BASE`

Conceito: upload do usuário = identidade/aparência. Imagem da Biblioteca C = pose/estrutura/proporção/crop/composição/câmera. Resultado = personagem do upload aplicado na pose.

```
[AGUARDANDO PROMPT DEFINITIVO]
```

---

## 4. Módulo — Acessórios preservados

**Trigger**: `accessoriesMode = "keep"` (default).
**Constante**: `PROMPT_MODULE_ACCESSORIES_KEEP`

Conceito: acessórios são itens externos/removíveis (espada, escudo, bolsa, mochila, cajado, props segurados na mão). NÃO incluir como acessórios removíveis: roupa principal, armadura, cabelo, rosto, corpo, calçado, capa quando central pra identidade.

Status: ✅ Registrado em `js/prompts.js`. Usado pelo `build3DManualPromptBody` no caso `keep__manual`.

---

## 5. Módulo — Acessórios removidos

**Trigger**: `accessoriesMode = "remove"`.
**Constante**: `PROMPT_MODULE_ACCESSORIES_REMOVE`

Status: ✅ Registrado em `js/prompts.js`. Usado pelo `build3DManualPromptBody` no caso `remove__manual`.

---

## 6. Módulo — Direção de estilo: imagem 1

**Trigger**: `styleSource = "image1"` (default).
**Constante**: `PROMPT_MODULE_STYLE_IMAGE_1`

Conceito: a imagem 1 (referência principal / upload) influencia pose/estrutura E também a linguagem visual do resultado.

```
[AGUARDANDO PROMPT DEFINITIVO]
```

---

## 7. Módulo — Direção de estilo: imagem 2

**Trigger**: `styleSource = "image2"`.
**Constante**: `PROMPT_MODULE_STYLE_IMAGE_2`

Conceito: a estrutura vem da imagem 1, mas a estética visual principal acompanha a imagem 2 (item da biblioteca).

```
[AGUARDANDO PROMPT DEFINITIVO]
```

> No POSE TRANSFER FLOW os labels de UI mudam pra "Estilo do personagem" / "Estilo da pose", mas a constante de prompt é a mesma (a fonte estética é a única coisa que muda).

---

## 7-bis. Bloco base do modo manual e regra de fonte de estilo

**Trigger**: `styleSource = "manual"` (em qualquer combinação de `accessoriesMode`).

Dois blocos âncora do modo manual, sempre concatenados:

| Constante | Função |
|---|---|
| `PROMPT_3D_MANUAL_SHELL_BASE` | Header geral do modo manual (MULTI-IMAGE INSTRUCTION + IMAGE ROLE LOGIC com Image 1 = só estrutura, Image 2 = só identidade + STRUCTURE RULES + CHARACTER IDENTITY RULES + DEFAULT PRESENTATION + GLOBAL DO NOTS). |
| `PROMPT_MODULE_STYLE_SOURCE_MANUAL` | Bloco "STYLE SOURCE RULE — MANUAL STYLE": fixa que estilo NÃO vem das imagens, mas dos módulos selecionados. |

Status: ✅ Ambos registrados em `js/prompts.js`. Concatenados pelo `build3DManualPromptBody`.

---

## 8. Módulos — Estética manual (combináveis)

**Trigger**: `styleSource = "manual"` E o slug correspondente está em `aestheticModifiers[]`.
São combináveis (multi-select).

| Constante | Slug | Trigger | Status |
|---|---|---|---|
| `PROMPT_MODULE_AESTHETIC_CUTE` | `cute` | "Cute" | ✅ Registrado |
| `PROMPT_MODULE_AESTHETIC_TOY` | `toy` | "Toy" | ✅ Registrado |
| `PROMPT_MODULE_AESTHETIC_PREMIUM_COLLECTIBLE` | `premium_collectible` | "Premium collectible" | ✅ Registrado |
| `PROMPT_MODULE_AESTHETIC_DESIGNER_TOY` | `designer_toy` | "Designer toy" | ✅ Registrado |
| `PROMPT_MODULE_AESTHETIC_STYLIZED_STATUE` | `stylized_statue` | "Stylized statue" | ✅ Registrado |

Roteados via `AESTHETIC_PROMPT_MAP` em `js/prompts.js`.

---

## 9. Módulos — Proporção (escolha única)

**Trigger**: `styleSource = "manual"` E `proportionPreset = <slug>`.

| Constante | Slug | Trigger | Status |
|---|---|---|---|
| `PROMPT_MODULE_PROPORTION_DEFAULT` | `default` | "Padrão" (default) | ✅ Registrado |
| `PROMPT_MODULE_PROPORTION_CHIBI` | `chibi` | "Chibi" | ✅ Registrado |

Observação: Chibi altera proporção corporal de forma significativa. Não é uma simples tag estética — é bloco forte de prompt. Conflitos com Realistic / Semi-realistic estão em "Conflitos conhecidos".

---

## 10. Módulos — Nível de realismo (escolha única)

**Trigger**: `styleSource = "manual"` E `realismLevel = <slug>`.

| Constante | Slug | Trigger | Status |
|---|---|---|---|
| `PROMPT_MODULE_REALISM_STYLIZED` | `stylized` | "Estilizado" (default) | ✅ Registrado |
| `PROMPT_MODULE_REALISM_SEMI_REALISTIC` | `semi_realistic` | "Semi-realistic" | ✅ Registrado |
| `PROMPT_MODULE_REALISM_REALISTIC` | `realistic` | "Realistic" | ✅ Registrado |

---

## 11. Módulos — Material (escolha única)

**Trigger**: `styleSource = "manual"` E `materialFinish = <slug>`.

| Constante | Slug | Trigger | Status |
|---|---|---|---|
| `PROMPT_MODULE_MATERIAL_MATTE_VINYL` | `matte_vinyl` | "Matte vinyl" (default) | ✅ Registrado |
| `PROMPT_MODULE_MATERIAL_SMOOTH_RESIN` | `smooth_resin` | "Smooth resin" | ✅ Registrado |
| `PROMPT_MODULE_MATERIAL_PAINTED_RESIN` | `painted_collectible_resin` | "Painted collectible resin" | ✅ Registrado |

---

## 12. Módulos — Técnico (combináveis)

**Trigger**: `styleSource = "manual"` E o slug está em `technicalModifiers[]`.

| Constante | Slug | Trigger | Status |
|---|---|---|---|
| `PROMPT_MODULE_TECHNICAL_PRINT_FRIENDLY` | `print_friendly` | "3D print friendly" | ✅ Registrado |

Conceito: regra técnica, não estilo visual. Ativa: formas sólidas, detalhes robustos, evitar partes muito finas, evitar elementos flutuantes, evitar fios soltos, silhueta limpa.

---

## 13. Regras globais anti-interferência

**Trigger**: sempre concatenadas no fim do prompt final.
**Constante**: `PROMPT_GLOBAL_ANTI_INTERFERENCE`

Lógica obrigatoriamente **condicional**, NUNCA fixa. As regras precisam ler o que existe na imagem de pose/referência e respeitar; não devem forçar nada que não está lá.

Não usar regras fixas que forcem:
- personagem sentado
- base
- pés visíveis
- mãos apoiadas
- pernas estendidas
- corpo inteiro
- câmera específica
- contato com base
- postura específica

A lógica futura precisa ser condicional:
- Se a pose tiver base → preservar base.
- Se a pose não tiver base → não criar base.
- Se for busto → gerar apenas busto.
- Se for meio-corpo → gerar apenas meio-corpo.
- Se houver crop → respeitar o crop.
- Se não tiver pernas → não inventar pernas.
- Se não tiver pés → não inventar pés.
- Se estiver em pé → não forçar sentado.
- Se estiver sentado → preservar sentado.
- Se houver mãos visíveis → respeitar a posição.
- Se não tiver mãos visíveis → não inventar mãos.

Status: ✅ Registrado em `js/prompts.js` como `PROMPT_GLOBAL_ANTI_INTERFERENCE`. Concatenado por último no `build3DManualPromptBody`, antes do bloco `USER ADDITIONAL INSTRUCTIONS`.

---

## 14. Conflitos conhecidos (documentação para os prompts)

Combinações que podem produzir resultados inconsistentes. Pra MVP **não bloquear** na UI, só documentar:

- **Chibi + Realistic** → conflito de proporção corporal vs realismo.
- **Chibi + Semi-realistic** → idem, embora menos forte.
- **Matte vinyl + Realistic** → o material não combina bem com renderização realista.

Recomendação ao escrever os prompts manuais: incluir desambiguações dentro dos próprios módulos, ou criar regras de prioridade (ex: "se Chibi, ignore Realistic").

---

## Arquivos relacionados

- `js/prompts.js` — define as constantes placeholder + casos consolidados. Substituir `[AGUARDANDO PROMPT DEFINITIVO]` quando os prompts forem aprovados.
- `js/api.js` — `gerarImagensFluxo1` chama `window.build3DCharacterPrompt(opcoes, blocoExtra)` pra escolher o prompt do caso.
- State do 3D Flow: `appState.threeDFlowOptions`. State do Pose Flow: `appState.poseFlowOptions`. Estrutura idêntica:

```js
{
  accessoriesMode: "keep",      // "keep" | "remove"
  styleSource: "image1",        // "image1" | "image2" | "manual"
  aestheticModifiers: [],       // array de slugs
  proportionPreset: "default",  // "default" | "chibi"
  realismLevel: "stylized",     // "stylized" | "semi_realistic" | "realistic"
  materialFinish: "matte_vinyl",// "matte_vinyl" | "smooth_resin" | "painted_collectible_resin"
  technicalModifiers: []        // array de slugs (ex: ["print_friendly"])
}
```
