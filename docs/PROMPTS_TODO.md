# PROMPTS_TODO — placeholders e arquitetura modular

> Status: aguardando prompts definitivos.
> Última atualização: 07/05/2026.
>
> Este documento serve como **mapa** dos prompts que serão escritos depois (fora do Claude).
> Cada seção lista o gatilho da UI/state e contém um placeholder a ser preenchido.
> Não escrever os prompts aqui — só preencher quando estiverem aprovados.

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

```
[AGUARDANDO PROMPT DEFINITIVO]
```

---

## 5. Módulo — Acessórios removidos

**Trigger**: `accessoriesMode = "remove"`.
**Constante**: `PROMPT_MODULE_ACCESSORIES_REMOVE`

```
[AGUARDANDO PROMPT DEFINITIVO]
```

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

## 8. Módulos — Estética manual (combináveis)

**Trigger**: `styleSource = "manual"` E o slug correspondente está em `aestheticModifiers[]`.
São combináveis (multi-select).

| Constante | Slug | Trigger |
|---|---|---|
| `PROMPT_MODULE_AESTHETIC_CUTE` | `cute` | usuário marca "Cute" |
| `PROMPT_MODULE_AESTHETIC_TOY` | `toy` | "Toy" |
| `PROMPT_MODULE_AESTHETIC_PREMIUM_COLLECTIBLE` | `premium_collectible` | "Premium collectible" |
| `PROMPT_MODULE_AESTHETIC_DESIGNER_TOY` | `designer_toy` | "Designer toy" |
| `PROMPT_MODULE_AESTHETIC_STYLIZED_STATUE` | `stylized_statue` | "Stylized statue" |

```
[AGUARDANDO PROMPT DEFINITIVO — UM PARA CADA]
```

---

## 9. Módulos — Proporção (escolha única)

**Trigger**: `styleSource = "manual"` E `proportionPreset = <slug>`.

| Constante | Slug | Trigger |
|---|---|---|
| `PROMPT_MODULE_PROPORTION_DEFAULT` | `default` | "Padrão" (default) |
| `PROMPT_MODULE_PROPORTION_CHIBI` | `chibi` | "Chibi" |

Observação: Chibi altera proporção corporal de forma significativa. Não é uma simples tag estética — vai virar bloco forte de prompt.

```
[AGUARDANDO PROMPT DEFINITIVO]
```

---

## 10. Módulos — Nível de realismo (escolha única)

**Trigger**: `styleSource = "manual"` E `realismLevel = <slug>`.

| Constante | Slug | Trigger |
|---|---|---|
| `PROMPT_MODULE_REALISM_STYLIZED` | `stylized` | "Estilizado" (default) |
| `PROMPT_MODULE_REALISM_SEMI_REALISTIC` | `semi_realistic` | "Semi-realistic" |
| `PROMPT_MODULE_REALISM_REALISTIC` | `realistic` | "Realistic" |

```
[AGUARDANDO PROMPT DEFINITIVO]
```

---

## 11. Módulos — Material (escolha única)

**Trigger**: `styleSource = "manual"` E `materialFinish = <slug>`.

| Constante | Slug | Trigger |
|---|---|---|
| `PROMPT_MODULE_MATERIAL_MATTE_VINYL` | `matte_vinyl` | "Matte vinyl" (default) |
| `PROMPT_MODULE_MATERIAL_SMOOTH_RESIN` | `smooth_resin` | "Smooth resin" |
| `PROMPT_MODULE_MATERIAL_PAINTED_RESIN` | `painted_collectible_resin` | "Painted collectible resin" |

```
[AGUARDANDO PROMPT DEFINITIVO]
```

---

## 12. Módulos — Técnico (combináveis)

**Trigger**: `styleSource = "manual"` E o slug está em `technicalModifiers[]`.

| Constante | Slug | Trigger |
|---|---|---|
| `PROMPT_MODULE_TECHNICAL_PRINT_FRIENDLY` | `print_friendly` | "3D print friendly" |

Conceito: regra técnica, não estilo visual. Ativa: formas sólidas, detalhes robustos, evitar partes muito finas, evitar elementos flutuantes, evitar fios soltos, silhueta limpa.

```
[AGUARDANDO PROMPT DEFINITIVO]
```

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

```
[AGUARDANDO PROMPT DEFINITIVO]
```

---

## 14. Conflitos conhecidos (documentação para os prompts)

Combinações que podem produzir resultados inconsistentes. Pra MVP **não bloquear** na UI, só documentar:

- **Chibi + Realistic** → conflito de proporção corporal vs realismo.
- **Chibi + Semi-realistic** → idem, embora menos forte.
- **Matte vinyl + Realistic** → o material não combina bem com renderização realista.

Recomendação ao escrever os prompts manuais: incluir desambiguações dentro dos próprios módulos, ou criar regras de prioridade (ex: "se Chibi, ignore Realistic").

---

## Arquivos relacionados

- `js/prompts.js` — define as constantes placeholder. Substituir os valores quando os prompts forem aprovados.
- `js/api.js` — futuramente vai chamar funções que montam o prompt final concatenando os módulos baseado no state do fluxo.
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
