# Prompts do 3D Character Flow

> Atualizado em: 08/05/2026
> Status: 3/12 prompts definitivos preenchidos (`THREED_KEEP_ACCESSORIES_STYLE_IMAGE1`, `THREED_REMOVE_ACCESSORIES_STYLE_IMAGE1`, `THREED_KEEP_ACCESSORIES_STYLE_IMAGE2`). 9 ainda em placeholder.

## Estratégia

A estratégia anterior (montar o prompt final concatenando blocos pequenos: acessórios + direção de estilo + estética + proporção + realismo + material + técnico) gerava resultados inconsistentes e era difícil de depurar.

A nova estratégia é **prompt completo por caso/combinação**:

- A interface define um "caso" a partir do estado (`accessoriesMode`, `styleSource`, e — quando `styleSource = manual` — o preset principal).
- Cada caso aponta para **um único prompt completo**, identificado por `promptId`.
- O prompt completo já contém todas as regras necessárias daquele cenário.
- A função `resolve3DCharacterPromptId(options)` devolve o `promptId` adequado.
- O builder `build3DCharacterPrompt(options, blocoExtra)` busca o prompt no mapa `PROMPTS_3D_CHARACTER_FLOW` e anexa o `USER ADDITIONAL INSTRUCTIONS` se houver.

A montagem modular antiga foi marcada como **DEPRECATED** em `js/prompts.js` e não é mais chamada pelo pipeline.

A UI continua igual (acessórios, direção de estilo, estética, proporção, realismo, material, regras técnicas) — ela só não monta mais o prompt por blocos, agora ela seleciona um prompt completo.

## Tabela de prompts

| promptId | Quando usar | Estado da UI | Status |
|---|---|---|---|
| `THREED_KEEP_ACCESSORIES_STYLE_IMAGE1` | Estilo da Imagem 1 com acessórios preservados | `accessoriesMode=keep`, `styleSource=image1` | ✅ definitivo |
| `THREED_REMOVE_ACCESSORIES_STYLE_IMAGE1` | Estilo da Imagem 1 sem acessórios | `accessoriesMode=remove`, `styleSource=image1` | ✅ definitivo |
| `THREED_KEEP_ACCESSORIES_STYLE_IMAGE2` | Estilo da Imagem 2 com acessórios preservados | `accessoriesMode=keep`, `styleSource=image2` | ✅ definitivo |
| `THREED_REMOVE_ACCESSORIES_STYLE_IMAGE2` | Estilo da Imagem 2 sem acessórios | `accessoriesMode=remove`, `styleSource=image2` | ⏳ placeholder |
| `THREED_MANUAL_CUTE_TOY_PREMIUM_MATTE_PRINT_KEEP_ACCESSORIES` | Preset cute + toy + premium collectible em matte vinyl, print friendly, acessórios preservados | `styleSource=manual`, `aestheticModifiers⊇{cute, toy, premium_collectible}`, `materialFinish=matte_vinyl`, `technicalModifiers⊇{print_friendly}`, `accessoriesMode=keep` | ⏳ placeholder |
| `THREED_MANUAL_CUTE_TOY_PREMIUM_MATTE_PRINT_REMOVE_ACCESSORIES` | Mesmo preset, sem acessórios | idem com `accessoriesMode=remove` | ⏳ placeholder |
| `THREED_MANUAL_CHIBI_CUTE_TOY_MATTE_KEEP_ACCESSORIES` | Preset chibi + cute + toy em matte vinyl, acessórios preservados | `styleSource=manual`, `proportionPreset=chibi`, `aestheticModifiers⊇{cute, toy}`, `materialFinish=matte_vinyl`, `accessoriesMode=keep` | ⏳ placeholder |
| `THREED_MANUAL_CHIBI_CUTE_TOY_MATTE_REMOVE_ACCESSORIES` | Mesmo preset, sem acessórios | idem com `accessoriesMode=remove` | ⏳ placeholder |
| `THREED_MANUAL_SEMIREALISTIC_STATUE_RESIN_KEEP_ACCESSORIES` | Preset semi-realista, statue, resina (smooth ou painted), acessórios preservados | `styleSource=manual`, `realismLevel=semi_realistic`, `aestheticModifiers⊇{stylized_statue}`, `materialFinish ∈ {smooth_resin, painted_collectible_resin}`, `accessoriesMode=keep` | ⏳ placeholder |
| `THREED_MANUAL_SEMIREALISTIC_STATUE_RESIN_REMOVE_ACCESSORIES` | Mesmo preset, sem acessórios | idem com `accessoriesMode=remove` | ⏳ placeholder |
| `THREED_MANUAL_REALISTIC_PAINTED_RESIN_KEEP_ACCESSORIES` | Preset realista em painted resin, acessórios preservados | `styleSource=manual`, `realismLevel=realistic`, `materialFinish=painted_collectible_resin`, `accessoriesMode=keep` | ⏳ placeholder |
| `THREED_MANUAL_REALISTIC_PAINTED_RESIN_REMOVE_ACCESSORIES` | Mesmo preset, sem acessórios | idem com `accessoriesMode=remove` | ⏳ placeholder |

## Fallback

Se `styleSource = manual` e a combinação atual não bater com nenhum dos 8 presets manuais, `resolve3DCharacterPromptId(options)` retorna `null`. Nesse caso, `build3DCharacterPrompt` mostra um warning detalhado no console e devolve um placeholder genérico — o app não quebra.

---

## THREED_KEEP_ACCESSORIES_STYLE_IMAGE1

Estado da UI:

- `accessoriesMode = keep`
- `styleSource = image1`

Descrição:
Preserva eventuais acessórios/props da Imagem 2, usa estrutura/pose/proporções/crop da Imagem 1 e mantém o estilo visual da Imagem 1.

Prompt:

```
MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
CASE: KEEP ACCESSORIES + STYLE FROM IMAGE 1

You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, sheets, turnarounds, or multiple views.

CORE LOGIC

IMAGE 1 = STRUCTURE + STYLE SOURCE
IMAGE 2 = CHARACTER + ACCESSORIES SOURCE

The final image must show the character from Image 2 transformed into the structure, pose, framing, and visual style of Image 1.

IMAGE 1 ROLE — STRUCTURE SOURCE

Use Image 1 as the source for:
- pose
- posture
- body visibility
- body crop
- framing
- camera angle
- camera distance
- composition
- silhouette
- visible body proportions
- head-to-body relationship
- limb placement
- hand placement
- foot placement, if visible
- support/contact logic
- presence or absence of base or support surface

Image 1 defines how much of the body exists and is visible in the final result.

IMAGE 1 ROLE — STYLE SOURCE

Also use Image 1 as the primary visual style source.
Use Image 1 for:
- stylization level
- shape language
- material feel
- surface treatment
- simplification level
- finish quality
- lighting mood
- render language
- overall aesthetic treatment

Do not use Image 1 as the character identity source.
Do not copy the face, hair, clothing identity, colors, species, or character identity from Image 1.

IMAGE 2 ROLE — CHARACTER SOURCE

Use Image 2 as the source for:
- character identity
- face and facial features
- facial expression
- hairstyle or hair absence
- facial hair or lack of facial hair
- outfit / costume / armor / clothing
- colors
- species identity, if non-human
- recognizable body traits
- recognizable character design
- props/accessories, according to the accessories rule below

Do not use Image 2 for:
- pose
- posture
- body stance
- camera angle
- framing
- crop
- composition
- final body visibility
- visual style, unless it is inseparable from the character identity

STRUCTURE RULES

Follow Image 1 for all structural decisions.
- Match the pose and body logic of Image 1.
- Match the visible body crop of Image 1.
- Match the camera angle and composition of Image 1.
- Match the visible body proportions of Image 1.
- If Image 1 shows only bust, generate only bust.
- If Image 1 shows half body, generate only half body.
- If Image 1 shows full body, generate full body.
- If Image 1 crops the body, respect the same crop.
- If Image 1 has a base or support surface, preserve its structural logic.
- If Image 1 does not have a base, do not create a base automatically.
- Do not invent body parts outside the visible body logic of Image 1.
- Do not force full body if Image 1 is cropped.
- Do not force feet, legs, hands, base, or support elements unless supported by Image 1.
- Do not force seated, standing, action, or display-base logic unless supported by Image 1.

CHARACTER IDENTITY RULES

Preserve the character identity from Image 2.
- Preserve the face identity from Image 2.
- Preserve hairstyle, facial hair or absence of facial hair from Image 2.
- Preserve expression from Image 2 when compatible with the structure and style.
- Preserve outfit, armor, clothing, colors, and recognizable design traits from Image 2.
- Preserve species identity if Image 2 is non-human.
- The final result must clearly read as the character from Image 2.
- Do not merge identities between Image 1 and Image 2.
- Do not borrow face, hair, outfit, colors, or species identity from Image 1.

ACCESSORIES RULE — KEEP ACCESSORIES FROM IMAGE 2

Preserve visible props and removable accessories from Image 2 when compatible with the pose, crop, and composition from Image 1.

Props/accessories may include:
- weapons
- shields
- tools
- staffs
- bags
- backpacks
- handheld objects
- external carried items
- objects attached externally to the character

Adapt these props naturally into the structure and pose from Image 1 without changing the pose logic.
Do not preserve props from Image 2 if they conflict with the body visibility or crop from Image 1.

Do not treat the following as removable accessories:
- main clothing
- armor
- boots
- gloves
- hair
- beard
- body parts
- wings, horns, tail, or anatomy
- skin, fur, feathers, scales, or natural markings
- identity-defining outfit elements

If a cape, necklace, belt, sash, or ornament is central to the identity of Image 2, preserve it as part of the character design, not as a removable prop.

STYLE RULES — USE STYLE FROM IMAGE 1

Use the visual style language of Image 1 as the final aesthetic direction.
Transfer:
- stylization level
- material finish
- sculptural simplification
- render treatment
- lighting language
- surface cleanliness
- overall visual mood

The final result should feel like the character from Image 2 was recreated inside the style system of Image 1.
Do not use the visual style of Image 2 as the main style.
Use Image 2 only for identity, design, colors, clothing, and accessories.

PARTIAL OR NON-HUMAN CHARACTER RULES

If Image 2 is partial, cropped, bust-only, or head-only:
- use its visible identity traits to infer missing character areas only as needed to fit the structure and body visibility of Image 1
- inferred areas must remain consistent with the identity, species, colors, outfit logic, and visual traits of Image 2

If Image 2 is an animal and Image 1 is humanoid:
- adapt the animal into a stylized anthropomorphic humanoid character
- preserve the animal species identity from Image 2
- preserve key animal traits such as head shape, muzzle or beak, ears, horns, eyes, nose, fur, feathers, scales, markings, and color patterns
- use the body visibility, pose, posture, crop, and framing from Image 1
- do not preserve the original quadruped pose from Image 2
- do not humanize the face so much that the animal identity becomes unclear

If Image 2 is a robot, monster, creature, mask, bust, or partial fantasy character:
- infer missing body areas consistently with the visible identity from Image 2
- do not create a generic human body if Image 2 suggests a specific species, creature type, robot design, monster design, or fantasy identity
- adapt the inferred body to the structure and style of Image 1

USER ADDITIONAL INSTRUCTIONS

Apply user additional instructions only if they do not conflict with:
- the structure, crop, body visibility, and pose from Image 1
- the visual style from Image 1
- the character identity from Image 2
- the accessories rule of this case

If user instructions conflict with those priorities, preserve the priorities above.

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not use Image 1 as character identity
- do not use Image 2 as pose source
- do not use Image 2 as primary style source
- do not merge identities between the images
- do not invent body visibility beyond Image 1
- do not force full body if Image 1 is cropped
- do not create a base unless Image 1 has one or the user explicitly asks for one
- do not remove identity-defining clothing or traits from Image 2
- do not confuse props with clothing, armor, anatomy, or identity-defining traits
```

---

## THREED_REMOVE_ACCESSORIES_STYLE_IMAGE1

Estado da UI:

- `accessoriesMode = remove`
- `styleSource = image1`

Descrição:
Remove props/acessórios removíveis da Imagem 2, usa estrutura/pose/proporções/crop da Imagem 1 e mantém o estilo visual da Imagem 1.

Prompt:

```
MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
CASE: REMOVE ACCESSORIES + STYLE FROM IMAGE 1

You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, sheets, turnarounds, or multiple views.

CORE LOGIC

IMAGE 1 = STRUCTURE + STYLE SOURCE
IMAGE 2 = CHARACTER SOURCE

The final image must show the character from Image 2 transformed into the structure, pose, framing, and visual style of Image 1, without non-essential props or removable accessories from Image 2.

IMAGE 1 ROLE — STRUCTURE SOURCE

Use Image 1 as the source for:
- pose
- posture
- body visibility
- body crop
- framing
- camera angle
- camera distance
- composition
- silhouette
- visible body proportions
- head-to-body relationship
- limb placement
- hand placement
- foot placement, if visible
- support/contact logic
- presence or absence of base or support surface

Image 1 defines how much of the body exists and is visible in the final result.

IMAGE 1 ROLE — STYLE SOURCE

Also use Image 1 as the primary visual style source.
Use Image 1 for:
- stylization level
- shape language
- material feel
- surface treatment
- simplification level
- finish quality
- lighting mood
- render language
- overall aesthetic treatment

Do not use Image 1 as the character identity source.
Do not copy the face, hair, clothing identity, colors, species, or character identity from Image 1.

IMAGE 2 ROLE — CHARACTER SOURCE

Use Image 2 as the source for:
- character identity
- face and facial features
- facial expression
- hairstyle or hair absence
- facial hair or lack of facial hair
- outfit / costume / armor / clothing
- colors
- species identity, if non-human
- recognizable body traits
- recognizable character design

Do not use Image 2 for:
- pose
- posture
- body stance
- camera angle
- framing
- crop
- composition
- final body visibility
- visual style, unless it is inseparable from the character identity
- non-essential removable props or accessories

STRUCTURE RULES

Follow Image 1 for all structural decisions.
- Match the pose and body logic of Image 1.
- Match the visible body crop of Image 1.
- Match the camera angle and composition of Image 1.
- Match the visible body proportions of Image 1.
- If Image 1 shows only bust, generate only bust.
- If Image 1 shows half body, generate only half body.
- If Image 1 shows full body, generate full body.
- If Image 1 crops the body, respect the same crop.
- If Image 1 has a base or support surface, preserve its structural logic.
- If Image 1 does not have a base, do not create a base automatically.
- Do not invent body parts outside the visible body logic of Image 1.
- Do not force full body if Image 1 is cropped.
- Do not force feet, legs, hands, base, or support elements unless supported by Image 1.
- Do not force seated, standing, action, or display-base logic unless supported by Image 1.

CHARACTER IDENTITY RULES

Preserve the character identity from Image 2.
- Preserve the face identity from Image 2.
- Preserve hairstyle, facial hair or absence of facial hair from Image 2.
- Preserve expression from Image 2 when compatible with the structure and style.
- Preserve outfit, armor, clothing, colors, and recognizable design traits from Image 2.
- Preserve species identity if Image 2 is non-human.
- The final result must clearly read as the character from Image 2.
- Do not merge identities between Image 1 and Image 2.
- Do not borrow face, hair, outfit, colors, or species identity from Image 1.

ACCESSORIES RULE — REMOVE ACCESSORIES FROM IMAGE 2

Remove non-essential props and detachable accessories from Image 2.

Do not include:
- weapons
- shields
- tools
- staffs
- bags
- backpacks
- handheld objects
- external carried items
- objects attached externally to the character when they are clearly removable props

Preserve the core character identity from Image 2:
- face
- hair
- expression
- outfit
- armor
- clothing
- body
- colors
- essential clothing
- species identity
- identity-defining visual traits

Do not remove elements that are part of the main outfit or core character identity.

Do not treat the following as removable accessories:
- main clothing
- armor
- boots
- gloves
- hair
- beard
- body parts
- wings, horns, tail, or anatomy
- skin, fur, feathers, scales, or natural markings
- identity-defining outfit elements

If a cape, necklace, belt, sash, or ornament is central to the identity of Image 2, preserve it as part of the character design, not as a removable prop.

If Image 1 structurally contains a prop or support object, use only its structural logic when necessary for the pose, but do not copy its identity, design, or appearance.

STYLE RULES — USE STYLE FROM IMAGE 1

Use the visual style language of Image 1 as the final aesthetic direction.
Transfer:
- stylization level
- material finish
- sculptural simplification
- render treatment
- lighting language
- surface cleanliness
- overall visual mood

The final result should feel like the character from Image 2 was recreated inside the style system of Image 1.
Do not use the visual style of Image 2 as the main style.
Use Image 2 only for identity, design, colors, clothing, and core character appearance.

PARTIAL OR NON-HUMAN CHARACTER RULES

If Image 2 is partial, cropped, bust-only, or head-only:
- use its visible identity traits to infer missing character areas only as needed to fit the structure and body visibility of Image 1
- inferred areas must remain consistent with the identity, species, colors, outfit logic, and visual traits of Image 2

If Image 2 is an animal and Image 1 is humanoid:
- adapt the animal into a stylized anthropomorphic humanoid character
- preserve the animal species identity from Image 2
- preserve key animal traits such as head shape, muzzle or beak, ears, horns, eyes, nose, fur, feathers, scales, markings, and color patterns
- use the body visibility, pose, posture, crop, and framing from Image 1
- do not preserve the original quadruped pose from Image 2
- do not humanize the face so much that the animal identity becomes unclear

If Image 2 is a robot, monster, creature, mask, bust, or partial fantasy character:
- infer missing body areas consistently with the visible identity from Image 2
- do not create a generic human body if Image 2 suggests a specific species, creature type, robot design, monster design, or fantasy identity
- adapt the inferred body to the structure and style of Image 1

USER ADDITIONAL INSTRUCTIONS

Apply user additional instructions only if they do not conflict with:
- the structure, crop, body visibility, and pose from Image 1
- the visual style from Image 1
- the character identity from Image 2
- the accessories removal rule of this case

If user instructions conflict with those priorities, preserve the priorities above.

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not use Image 1 as character identity
- do not use Image 2 as pose source
- do not use Image 2 as primary style source
- do not merge identities between the images
- do not invent body visibility beyond Image 1
- do not force full body if Image 1 is cropped
- do not create a base unless Image 1 has one or the user explicitly asks for one
- do not remove identity-defining clothing or traits from Image 2
- do not preserve non-essential removable props from Image 2
- do not confuse props with clothing, armor, anatomy, or identity-defining traits
```

---

## THREED_KEEP_ACCESSORIES_STYLE_IMAGE2

Estado da UI:

- `accessoriesMode = keep`
- `styleSource = image2`

Descrição:
Preserva props/acessórios removíveis da Imagem 2, usa estrutura/pose/proporções/crop da Imagem 1 e mantém o estilo visual da Imagem 2.

Prompt:

```
MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
CASE: KEEP ACCESSORIES + STYLE FROM IMAGE 2

You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, sheets, turnarounds, or multiple views.

CORE LOGIC

IMAGE 1 = STRUCTURE SOURCE
IMAGE 2 = CHARACTER + ACCESSORIES + STYLE SOURCE

The final image must show the character from Image 2 transformed into the structure, pose, framing, and body visibility of Image 1, while preserving the visual style of Image 2.

IMAGE 1 ROLE — STRUCTURE SOURCE

Use Image 1 as the source for:
- pose
- posture
- body visibility
- body crop
- framing
- camera angle
- camera distance
- composition
- silhouette
- visible body proportions
- head-to-body relationship
- limb placement
- hand placement
- foot placement, if visible
- support/contact logic
- presence or absence of base or support surface

Image 1 defines how much of the body exists and is visible in the final result.

Do not use Image 1 as the character identity source.
Do not use Image 1 as the primary visual style source in this case.
Do not copy the face, hair, clothing identity, colors, species, or character identity from Image 1.

IMAGE 2 ROLE — CHARACTER SOURCE

Use Image 2 as the source for:
- character identity
- face and facial features
- facial expression
- hairstyle or hair absence
- facial hair or lack of facial hair
- outfit / costume / armor / clothing
- colors
- species identity, if non-human
- recognizable body traits
- recognizable character design
- props/accessories, according to the accessories rule below

IMAGE 2 ROLE — STYLE SOURCE

Also use Image 2 as the primary visual style source.
Use Image 2 for:
- stylization level
- shape language
- material feel
- surface treatment
- simplification level
- finish quality
- lighting mood
- render language
- overall aesthetic treatment

Do not use Image 2 for:
- pose
- posture
- body stance
- camera angle
- framing
- crop
- composition
- final body visibility

STRUCTURE RULES

Follow Image 1 for all structural decisions.
- Match the pose and body logic of Image 1.
- Match the visible body crop of Image 1.
- Match the camera angle and composition of Image 1.
- Match the visible body proportions of Image 1.
- If Image 1 shows only bust, generate only bust.
- If Image 1 shows half body, generate only half body.
- If Image 1 shows full body, generate full body.
- If Image 1 crops the body, respect the same crop.
- If Image 1 has a base or support surface, preserve its structural logic.
- If Image 1 does not have a base, do not create a base automatically.
- Do not invent body parts outside the visible body logic of Image 1.
- Do not force full body if Image 1 is cropped.
- Do not force feet, legs, hands, base, or support elements unless supported by Image 1.
- Do not force seated, standing, action, or display-base logic unless supported by Image 1.

CHARACTER IDENTITY RULES

Preserve the character identity from Image 2.
- Preserve the face identity from Image 2.
- Preserve hairstyle, facial hair or absence of facial hair from Image 2.
- Preserve expression from Image 2 when compatible with the structure.
- Preserve outfit, armor, clothing, colors, and recognizable design traits from Image 2.
- Preserve species identity if Image 2 is non-human.
- The final result must clearly read as the character from Image 2.
- Do not merge identities between Image 1 and Image 2.
- Do not borrow face, hair, outfit, colors, or species identity from Image 1.

ACCESSORIES RULE — KEEP ACCESSORIES FROM IMAGE 2

Preserve visible props and removable accessories from Image 2 when compatible with the pose, crop, and composition from Image 1.

Props/accessories may include:
- weapons
- shields
- tools
- staffs
- bags
- backpacks
- handheld objects
- external carried items
- objects attached externally to the character

Adapt these props naturally into the structure and pose from Image 1 without changing the pose logic.
Do not preserve props from Image 2 if they conflict with the body visibility or crop from Image 1.

Do not treat the following as removable accessories:
- main clothing
- armor
- boots
- gloves
- hair
- beard
- body parts
- wings, horns, tail, or anatomy
- skin, fur, feathers, scales, or natural markings
- identity-defining outfit elements

If a cape, necklace, belt, sash, or ornament is central to the identity of Image 2, preserve it as part of the character design, not as a removable prop.

STYLE RULES — USE STYLE FROM IMAGE 2

Use the visual style language of Image 2 as the final aesthetic direction.
Transfer:
- stylization level
- material finish
- sculptural simplification
- render treatment
- lighting language
- surface cleanliness
- overall visual mood

The final result should feel like the character from Image 2 was re-posed into the structure of Image 1 while preserving the style system of Image 2.
Do not use the visual style of Image 1 as the main style.
Use Image 1 only for structure, pose, body visibility, crop, camera, and composition.

PARTIAL OR NON-HUMAN CHARACTER RULES

If Image 2 is partial, cropped, bust-only, or head-only:
- use its visible identity traits to infer missing character areas only as needed to fit the structure and body visibility of Image 1
- inferred areas must remain consistent with the identity, species, colors, outfit logic, and visual traits of Image 2

If Image 2 is an animal and Image 1 is humanoid:
- adapt the animal into a stylized anthropomorphic humanoid character
- preserve the animal species identity from Image 2
- preserve key animal traits such as head shape, muzzle or beak, ears, horns, eyes, nose, fur, feathers, scales, markings, and color patterns
- use the body visibility, pose, posture, crop, and framing from Image 1
- do not preserve the original quadruped pose from Image 2
- do not humanize the face so much that the animal identity becomes unclear

If Image 2 is a robot, monster, creature, mask, bust, or partial fantasy character:
- infer missing body areas consistently with the visible identity from Image 2
- do not create a generic human body if Image 2 suggests a specific species, creature type, robot design, monster design, or fantasy identity
- adapt the inferred body to the structure and style of Image 1

USER ADDITIONAL INSTRUCTIONS

Apply user additional instructions only if they do not conflict with:
- the structure, crop, body visibility, and pose from Image 1
- the character identity from Image 2
- the visual style from Image 2
- the accessories rule of this case

If user instructions conflict with those priorities, preserve the priorities above.

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not use Image 1 as character identity
- do not use Image 1 as primary style source
- do not use Image 2 as pose source
- do not merge identities between the images
- do not invent body visibility beyond Image 1
- do not force full body if Image 1 is cropped
- do not create a base unless Image 1 has one or the user explicitly asks for one
- do not remove identity-defining clothing or traits from Image 2
- do not confuse props with clothing, armor, anatomy, or identity-defining traits
```

---

## THREED_REMOVE_ACCESSORIES_STYLE_IMAGE2

Estado da UI:

- `accessoriesMode = remove`
- `styleSource = image2`

Descrição:
Remove acessórios não-essenciais da imagem 2, usa estrutura/pose/proporções da imagem 1 e adota o estilo visual da imagem 2.

Prompt:
[AGUARDANDO PROMPT DEFINITIVO]

---

## THREED_MANUAL_CUTE_TOY_PREMIUM_MATTE_PRINT_KEEP_ACCESSORIES

Estado da UI:

- `styleSource = manual`
- `aestheticModifiers ⊇ { cute, toy, premium_collectible }`
- `materialFinish = matte_vinyl`
- `technicalModifiers ⊇ { print_friendly }`
- `accessoriesMode = keep`

Descrição:
Preset "premium collectible cute toy" em matte vinyl, otimizado para impressão 3D. Acessórios preservados.

Prompt:
[AGUARDANDO PROMPT DEFINITIVO]

---

## THREED_MANUAL_CUTE_TOY_PREMIUM_MATTE_PRINT_REMOVE_ACCESSORIES

Estado da UI:

- `styleSource = manual`
- `aestheticModifiers ⊇ { cute, toy, premium_collectible }`
- `materialFinish = matte_vinyl`
- `technicalModifiers ⊇ { print_friendly }`
- `accessoriesMode = remove`

Descrição:
Mesmo preset acima, mas com acessórios removidos.

Prompt:
[AGUARDANDO PROMPT DEFINITIVO]

---

## THREED_MANUAL_CHIBI_CUTE_TOY_MATTE_KEEP_ACCESSORIES

Estado da UI:

- `styleSource = manual`
- `proportionPreset = chibi`
- `aestheticModifiers ⊇ { cute, toy }`
- `materialFinish = matte_vinyl`
- `accessoriesMode = keep`

Descrição:
Preset chibi + cute + toy em matte vinyl, acessórios preservados.

Prompt:
[AGUARDANDO PROMPT DEFINITIVO]

---

## THREED_MANUAL_CHIBI_CUTE_TOY_MATTE_REMOVE_ACCESSORIES

Estado da UI:

- `styleSource = manual`
- `proportionPreset = chibi`
- `aestheticModifiers ⊇ { cute, toy }`
- `materialFinish = matte_vinyl`
- `accessoriesMode = remove`

Descrição:
Mesmo preset acima, mas com acessórios removidos.

Prompt:
[AGUARDANDO PROMPT DEFINITIVO]

---

## THREED_MANUAL_SEMIREALISTIC_STATUE_RESIN_KEEP_ACCESSORIES

Estado da UI:

- `styleSource = manual`
- `realismLevel = semi_realistic`
- `aestheticModifiers ⊇ { stylized_statue }`
- `materialFinish ∈ { smooth_resin, painted_collectible_resin }`
- `accessoriesMode = keep`

Descrição:
Preset estátua semi-realista em resina, acessórios preservados.

Prompt:
[AGUARDANDO PROMPT DEFINITIVO]

---

## THREED_MANUAL_SEMIREALISTIC_STATUE_RESIN_REMOVE_ACCESSORIES

Estado da UI:

- `styleSource = manual`
- `realismLevel = semi_realistic`
- `aestheticModifiers ⊇ { stylized_statue }`
- `materialFinish ∈ { smooth_resin, painted_collectible_resin }`
- `accessoriesMode = remove`

Descrição:
Mesmo preset acima, mas com acessórios removidos.

Prompt:
[AGUARDANDO PROMPT DEFINITIVO]

---

## THREED_MANUAL_REALISTIC_PAINTED_RESIN_KEEP_ACCESSORIES

Estado da UI:

- `styleSource = manual`
- `realismLevel = realistic`
- `materialFinish = painted_collectible_resin`
- `accessoriesMode = keep`

Descrição:
Preset realista em painted collectible resin, acessórios preservados.

Prompt:
[AGUARDANDO PROMPT DEFINITIVO]

---

## THREED_MANUAL_REALISTIC_PAINTED_RESIN_REMOVE_ACCESSORIES

Estado da UI:

- `styleSource = manual`
- `realismLevel = realistic`
- `materialFinish = painted_collectible_resin`
- `accessoriesMode = remove`

Descrição:
Mesmo preset acima, mas com acessórios removidos.

Prompt:
[AGUARDANDO PROMPT DEFINITIVO]

---

## Como preencher um prompt definitivo

1. Encontre o `promptId` na tabela acima.
2. Substitua o conteúdo `[AGUARDANDO PROMPT DEFINITIVO]` na seção correspondente deste arquivo (registro humano).
3. Atualize a string correspondente em `js/prompts.js`, dentro do mapa `PROMPTS_3D_CHARACTER_FLOW`.
4. Marque o status na tabela como ✅ preenchido.
5. (Opcional) Smoke test: clique nas opções da UI e verifique no console se o `promptId` resolvido está certo.

## Convenções

- Não montar prompt final por concatenação de blocos pequenos.
- Cada `promptId` tem **um** prompt completo, autocontido.
- Quando criar um novo preset, adicionar entrada nesta doc, adicionar `PLACEHOLDER` no mapa em `js/prompts.js`, e estender `resolve3DCharacterPromptId` com a regra de match.
