# Prompts do 3D Character Flow

> Atualizado em: 08/05/2026
> Status: **12/12 prompts definitivos preenchidos** 🎉 — todos os casos do 3D Character Flow estão com prompt definitivo no mapa `PROMPTS_3D_CHARACTER_FLOW`.

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
| `THREED_REMOVE_ACCESSORIES_STYLE_IMAGE2` | Estilo da Imagem 2 sem acessórios | `accessoriesMode=remove`, `styleSource=image2` | ✅ definitivo |
| `THREED_MANUAL_CUTE_TOY_PREMIUM_MATTE_PRINT_KEEP_ACCESSORIES` | Preset cute + toy + premium collectible em matte vinyl, print friendly, acessórios preservados | `styleSource=manual`, `aestheticModifiers⊇{cute, toy, premium_collectible}`, `materialFinish=matte_vinyl`, `technicalModifiers⊇{print_friendly}`, `accessoriesMode=keep` | ✅ definitivo |
| `THREED_MANUAL_CUTE_TOY_PREMIUM_MATTE_PRINT_REMOVE_ACCESSORIES` | Mesmo preset, sem acessórios | idem com `accessoriesMode=remove` | ✅ definitivo |
| `THREED_MANUAL_CHIBI_CUTE_TOY_MATTE_KEEP_ACCESSORIES` | Preset chibi + cute + toy em matte vinyl, acessórios preservados | `styleSource=manual`, `proportionPreset=chibi`, `aestheticModifiers⊇{cute, toy}`, `materialFinish=matte_vinyl`, `accessoriesMode=keep` | ✅ definitivo |
| `THREED_MANUAL_CHIBI_CUTE_TOY_MATTE_REMOVE_ACCESSORIES` | Mesmo preset, sem acessórios | idem com `accessoriesMode=remove` | ✅ definitivo |
| `THREED_MANUAL_SEMIREALISTIC_STATUE_RESIN_KEEP_ACCESSORIES` | Preset semi-realista, statue, resina (smooth ou painted), acessórios preservados | `styleSource=manual`, `realismLevel=semi_realistic`, `aestheticModifiers⊇{stylized_statue}`, `materialFinish ∈ {smooth_resin, painted_collectible_resin}`, `accessoriesMode=keep` | ✅ definitivo |
| `THREED_MANUAL_SEMIREALISTIC_STATUE_RESIN_REMOVE_ACCESSORIES` | Mesmo preset, sem acessórios | idem com `accessoriesMode=remove` | ✅ definitivo |
| `THREED_MANUAL_REALISTIC_PAINTED_RESIN_KEEP_ACCESSORIES` | Preset realista em painted resin, acessórios preservados | `styleSource=manual`, `realismLevel=realistic`, `materialFinish=painted_collectible_resin`, `accessoriesMode=keep` | ✅ definitivo |
| `THREED_MANUAL_REALISTIC_PAINTED_RESIN_REMOVE_ACCESSORIES` | Mesmo preset, sem acessórios | idem com `accessoriesMode=remove` | ✅ definitivo |

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
Remove props/acessórios removíveis da Imagem 2, usa estrutura/pose/proporções/crop da Imagem 1 e mantém o estilo visual da Imagem 2.

Prompt:

```
MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
CASE: REMOVE ACCESSORIES + STYLE FROM IMAGE 2

You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, sheets, turnarounds, or multiple views.

CORE LOGIC

IMAGE 1 = STRUCTURE SOURCE
IMAGE 2 = CHARACTER + STYLE SOURCE

The final image must show the character from Image 2 transformed into the structure, pose, framing, and body visibility of Image 1, while preserving the visual style of Image 2, without non-essential props or removable accessories from Image 2.

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
- Preserve expression from Image 2 when compatible with the structure.
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
- the accessories removal rule of this case

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
- do not preserve non-essential removable props from Image 2
- do not confuse props with clothing, armor, anatomy, or identity-defining traits
```

---

## THREED_MANUAL_CUTE_TOY_PREMIUM_MATTE_PRINT_KEEP_ACCESSORIES

Estado da UI:

- `accessoriesMode = keep`
- `styleSource = manual`
- `aestheticModifiers = cute, toy, premium_collectible`
- `proportionPreset = default`
- `realismLevel = stylized`
- `materialFinish = matte_vinyl`
- `technicalModifiers = print_friendly`

Descrição:
Preserva eventuais props/acessórios da Imagem 2, usa estrutura/pose/proporções/crop da Imagem 1, usa identidade/personagem da Imagem 2 e aplica um estilo manual cute toy premium collectible com acabamento matte vinyl e regras 3D print friendly.

Prompt:

```
MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
CASE: KEEP ACCESSORIES + MANUAL STYLE — CUTE TOY PREMIUM MATTE VINYL PRINT FRIENDLY

You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, sheets, turnarounds, or multiple views.

CORE LOGIC

IMAGE 1 = STRUCTURE SOURCE
IMAGE 2 = CHARACTER + ACCESSORIES SOURCE
MANUAL STYLE = FINAL VISUAL STYLE SOURCE

The final image must show the character from Image 2 transformed into the structure, pose, framing, and body visibility of Image 1, while applying the manual style defined in this prompt.

Do not use Image 1 or Image 2 as the primary visual style source.
Use Image 1 only for structure.
Use Image 2 only for character identity, design, colors, clothing, and accessories.

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

Do not use Image 1 as:
- character identity source
- face source
- hair source
- clothing identity source
- color source
- species source
- primary visual style source

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
- primary visual style

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

MANUAL STYLE RULE — CUTE TOY PREMIUM COLLECTIBLE

Apply a cute toy premium collectible aesthetic.
The final result should feel like a high-quality stylized collectible toy.
Use:
- cute and emotionally appealing design language
- friendly simplified facial treatment
- softened forms
- polished toy-like shapes
- clean sculpted masses
- readable silhouette
- premium collectible finish
- intentional stylization
- refined presentation
- charming, approachable character appeal

Do not use the visual style of Image 1 as the main style.
Do not use the visual style of Image 2 as the main style.
The style must come from this manual style rule.

PROPORTION RULE — DEFAULT COLLECTIBLE PROPORTIONS

Use default stylized collectible proportions.
- Preserve the visible proportional logic from Image 1.
- Do not force chibi proportions.
- Do not dramatically enlarge the head unless Image 1 already supports that relationship.
- Do not shrink the body into a chibi format.
- Keep the character toy-like and cute through shape language, not through forced chibi anatomy.

MATERIAL RULE — MATTE VINYL

Use a matte vinyl toy finish.
Surfaces should be:
- smooth
- clean
- softly reflective
- premium soft-matte
- simplified and polished
- suitable for a collectible vinyl-style toy

Avoid:
- realistic skin pores
- gritty surface noise
- cheap glossy plastic
- messy texture
- overly complex material breakup

TECHNICAL RULE — 3D PRINT FRIENDLY

Make the design 3D-print-friendly.
Use:
- solid readable shapes
- simplified sculpted details
- clean silhouette logic
- robust forms
- continuous volumes
- manufacturable design logic
- thicker, cleaner shapes where possible

Avoid:
- fragile thin elements
- floating unsupported details
- wispy hair strands
- tiny detached ornaments
- overly delicate shapes
- excessive micro-detail
- complex transparent effects
- fragile loose accessories

Prefer forms that would be easier to interpret as a future 3D model.
Do not change the pose, crop, or visible body logic from Image 1.
Do not remove core character identity from Image 2.

PARTIAL OR NON-HUMAN CHARACTER RULES

If Image 2 is partial, cropped, bust-only, or head-only:
- use its visible identity traits to infer missing character areas only as needed to fit the structure and body visibility of Image 1
- inferred areas must remain consistent with the identity, species, colors, outfit logic, and visual traits of Image 2

If Image 2 is an animal and Image 1 is humanoid:
- adapt the animal into a cute stylized anthropomorphic humanoid collectible
- preserve the animal species identity from Image 2
- preserve key animal traits such as head shape, muzzle or beak, ears, horns, eyes, nose, fur, feathers, scales, markings, and color patterns
- use the body visibility, pose, posture, crop, and framing from Image 1
- do not preserve the original quadruped pose from Image 2
- do not humanize the face so much that the animal identity becomes unclear

If Image 2 is a robot, monster, creature, mask, bust, or partial fantasy character:
- infer missing body areas consistently with the visible identity from Image 2
- do not create a generic human body if Image 2 suggests a specific species, creature type, robot design, monster design, or fantasy identity
- adapt the inferred body to the structure from Image 1 and the manual cute toy collectible style

USER ADDITIONAL INSTRUCTIONS

Apply user additional instructions only if they do not conflict with:
- the structure, crop, body visibility, and pose from Image 1
- the character identity from Image 2
- the accessories rule of this case
- the manual cute toy premium matte vinyl print-friendly style

If user instructions conflict with those priorities, preserve the priorities above.

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not use Image 1 as character identity
- do not use Image 2 as pose source
- do not use Image 1 as primary style source
- do not use Image 2 as primary style source
- do not merge identities between the images
- do not invent body visibility beyond Image 1
- do not force full body if Image 1 is cropped
- do not force chibi proportions
- do not create a base unless Image 1 has one or the user explicitly asks for one
- do not remove identity-defining clothing or traits from Image 2
- do not confuse props with clothing, armor, anatomy, or identity-defining traits
- do not create photorealistic skin detail
- do not create messy texture
- do not create cheap glossy plastic
```

---

## THREED_MANUAL_CUTE_TOY_PREMIUM_MATTE_PRINT_REMOVE_ACCESSORIES

Estado da UI:

- `accessoriesMode = remove`
- `styleSource = manual`
- `aestheticModifiers = cute, toy, premium_collectible`
- `proportionPreset = default`
- `realismLevel = stylized`
- `materialFinish = matte_vinyl`
- `technicalModifiers = print_friendly`

Descrição:
Remove props/acessórios removíveis da Imagem 2, usa estrutura/pose/proporções/crop da Imagem 1, usa identidade/personagem da Imagem 2 e aplica um estilo manual cute toy premium collectible com acabamento matte vinyl e regras 3D print friendly.

Prompt:

```
MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
CASE: REMOVE ACCESSORIES + MANUAL STYLE — CUTE TOY PREMIUM MATTE VINYL PRINT FRIENDLY

You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, sheets, turnarounds, or multiple views.

CORE LOGIC

IMAGE 1 = STRUCTURE SOURCE
IMAGE 2 = CHARACTER SOURCE
MANUAL STYLE = FINAL VISUAL STYLE SOURCE

The final image must show the character from Image 2 transformed into the structure, pose, framing, and body visibility of Image 1, while applying the manual style defined in this prompt and removing non-essential props or removable accessories from Image 2.

Do not use Image 1 or Image 2 as the primary visual style source.
Use Image 1 only for structure.
Use Image 2 only for character identity, design, colors, clothing, and core appearance.

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

Do not use Image 1 as:
- character identity source
- face source
- hair source
- clothing identity source
- color source
- species source
- primary visual style source

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
- primary visual style
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
- Preserve expression from Image 2 when compatible with the structure.
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

If Image 1 structurally contains a prop, support object, or base, use only its structural logic when necessary for the pose, but do not copy its identity, design, or appearance.

MANUAL STYLE RULE — CUTE TOY PREMIUM COLLECTIBLE

Apply a cute toy premium collectible aesthetic.
The final result should feel like a high-quality stylized collectible toy.
Use:
- cute and emotionally appealing design language
- friendly simplified facial treatment
- softened forms
- polished toy-like shapes
- clean sculpted masses
- readable silhouette
- premium collectible finish
- intentional stylization
- refined presentation
- charming, approachable character appeal

Do not use the visual style of Image 1 as the main style.
Do not use the visual style of Image 2 as the main style.
The style must come from this manual style rule.

PROPORTION RULE — DEFAULT COLLECTIBLE PROPORTIONS

Use default stylized collectible proportions.
- Preserve the visible proportional logic from Image 1.
- Do not force chibi proportions.
- Do not dramatically enlarge the head unless Image 1 already supports that relationship.
- Do not shrink the body into a chibi format.
- Keep the character toy-like and cute through shape language, not through forced chibi anatomy.

MATERIAL RULE — MATTE VINYL

Use a matte vinyl toy finish.
Surfaces should be:
- smooth
- clean
- softly reflective
- premium soft-matte
- simplified and polished
- suitable for a collectible vinyl-style toy

Avoid:
- realistic skin pores
- gritty surface noise
- cheap glossy plastic
- messy texture
- overly complex material breakup

TECHNICAL RULE — 3D PRINT FRIENDLY

Make the design 3D-print-friendly.
Use:
- solid readable shapes
- simplified sculpted details
- clean silhouette logic
- robust forms
- continuous volumes
- manufacturable design logic
- thicker, cleaner shapes where possible

Avoid:
- fragile thin elements
- floating unsupported details
- wispy hair strands
- tiny detached ornaments
- overly delicate shapes
- excessive micro-detail
- complex transparent effects
- fragile loose accessories
- unnecessary dangling elements

Prefer forms that would be easier to interpret as a future 3D model.
Do not change the pose, crop, or visible body logic from Image 1.
Do not remove core character identity from Image 2.

PARTIAL OR NON-HUMAN CHARACTER RULES

If Image 2 is partial, cropped, bust-only, or head-only:
- use its visible identity traits to infer missing character areas only as needed to fit the structure and body visibility of Image 1
- inferred areas must remain consistent with the identity, species, colors, outfit logic, and visual traits of Image 2

If Image 2 is an animal and Image 1 is humanoid:
- adapt the animal into a cute stylized anthropomorphic humanoid collectible
- preserve the animal species identity from Image 2
- preserve key animal traits such as head shape, muzzle or beak, ears, horns, eyes, nose, fur, feathers, scales, markings, and color patterns
- use the body visibility, pose, posture, crop, and framing from Image 1
- do not preserve the original quadruped pose from Image 2
- do not humanize the face so much that the animal identity becomes unclear

If Image 2 is a robot, monster, creature, mask, bust, or partial fantasy character:
- infer missing body areas consistently with the visible identity from Image 2
- do not create a generic human body if Image 2 suggests a specific species, creature type, robot design, monster design, or fantasy identity
- adapt the inferred body to the structure from Image 1 and the manual cute toy collectible style

USER ADDITIONAL INSTRUCTIONS

Apply user additional instructions only if they do not conflict with:
- the structure, crop, body visibility, and pose from Image 1
- the character identity from Image 2
- the accessories removal rule of this case
- the manual cute toy premium matte vinyl print-friendly style

If user instructions conflict with those priorities, preserve the priorities above.

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not use Image 1 as character identity
- do not use Image 2 as pose source
- do not use Image 1 as primary style source
- do not use Image 2 as primary style source
- do not merge identities between the images
- do not invent body visibility beyond Image 1
- do not force full body if Image 1 is cropped
- do not force chibi proportions
- do not create a base unless Image 1 has one or the user explicitly asks for one
- do not remove identity-defining clothing or traits from Image 2
- do not preserve non-essential removable props from Image 2
- do not confuse props with clothing, armor, anatomy, or identity-defining traits
- do not create photorealistic skin detail
- do not create messy texture
- do not create cheap glossy plastic
```

---

## THREED_MANUAL_CHIBI_CUTE_TOY_MATTE_KEEP_ACCESSORIES

Estado da UI:

- `accessoriesMode = keep`
- `styleSource = manual`
- `aestheticModifiers = cute, toy`
- `proportionPreset = chibi`
- `realismLevel = stylized`
- `materialFinish = matte_vinyl`

Descrição:
Preserva eventuais props/acessórios da Imagem 2, usa estrutura/pose/crop da Imagem 1, usa identidade/personagem da Imagem 2 e aplica um estilo manual chibi cute toy com acabamento matte vinyl.

Prompt:

```
MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
CASE: KEEP ACCESSORIES + MANUAL STYLE — CHIBI CUTE TOY MATTE VINYL

You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, sheets, turnarounds, or multiple views.

CORE LOGIC

IMAGE 1 = STRUCTURE SOURCE
IMAGE 2 = CHARACTER + ACCESSORIES SOURCE
MANUAL STYLE = FINAL VISUAL STYLE SOURCE

The final image must show the character from Image 2 transformed into the pose, crop, framing, camera, and composition of Image 1, while applying the manual chibi cute toy style defined in this prompt.

Do not use Image 1 or Image 2 as the primary visual style source.
Use Image 1 for structure, pose, body visibility, crop, camera, and composition.
Use Image 2 for character identity, face, clothing, colors, species, recognizable design, and accessories.

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
- limb placement
- hand placement
- foot placement, if visible
- support/contact logic
- presence or absence of base or support surface

Image 1 defines the final pose, crop, camera, body visibility, and composition.

Because this is a chibi preset, proportions may be stylized into a chibi format, but the final result must still respect:
- the pose direction from Image 1
- the body visibility from Image 1
- the crop from Image 1
- the camera angle from Image 1
- the composition from Image 1
- the presence or absence of base/support from Image 1

Do not use Image 1 as:
- character identity source
- face source
- hair source
- clothing identity source
- color source
- species source
- primary visual style source

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
- primary visual style

STRUCTURE RULES

Follow Image 1 for all structural decisions, except where the chibi preset intentionally changes proportions.
- Match the pose logic of Image 1.
- Match the visible body crop of Image 1.
- Match the camera angle and composition of Image 1.
- Match the final body visibility from Image 1.
- If Image 1 shows only bust, generate only a chibi bust.
- If Image 1 shows half body, generate only chibi half body.
- If Image 1 shows full body, generate chibi full body.
- If Image 1 crops the body, respect the same crop.
- If Image 1 has a base or support surface, preserve its structural logic.
- If Image 1 does not have a base, do not create a base automatically.
- Do not force full body if Image 1 is cropped.
- Do not force feet, legs, hands, base, or support elements unless supported by Image 1.
- Do not force seated, standing, action, or display-base logic unless supported by Image 1.

CHIBI PROPORTION RULE

Transform the character into a chibi-style collectible.
Use:
- noticeably larger head
- smaller simplified body
- short compact limbs
- cute stylized proportion system
- simplified anatomy
- soft rounded silhouette
- charming toy-like proportions

Important:
Chibi changes the proportions, but it must not ignore the pose, crop, body visibility, camera, or composition from Image 1.

Do not use realistic anatomy.
Do not mix chibi proportions with realistic anatomy.
Do not make the result semi-realistic or realistic.
Do not create a standard adult-proportioned figure.
Do not generate extra body parts outside the visible body logic of Image 1.

CHARACTER IDENTITY RULES

Preserve the character identity from Image 2 in chibi form.
- Preserve the face identity from Image 2, simplified into a cute chibi treatment.
- Preserve hairstyle, facial hair or absence of facial hair from Image 2.
- Preserve expression from Image 2 when compatible with the chibi style.
- Preserve outfit, armor, clothing, colors, and recognizable design traits from Image 2.
- Preserve species identity if Image 2 is non-human.
- The final result must clearly read as the character from Image 2.
- Do not merge identities between Image 1 and Image 2.
- Do not borrow face, hair, outfit, colors, or species identity from Image 1.

ACCESSORIES RULE — KEEP ACCESSORIES FROM IMAGE 2

Preserve visible props and removable accessories from Image 2 when compatible with the chibi pose, crop, and composition from Image 1.

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

Adapt these props into simplified, chibi-friendly forms.
Rules for accessories:
- make props thicker, cleaner, and less fragile when needed
- simplify tiny details
- keep them readable
- integrate them naturally with the chibi body
- do not let props break the pose logic from Image 1
- do not preserve props if they conflict with the crop or body visibility of Image 1

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

MANUAL STYLE RULE — CHIBI CUTE TOY

Apply a chibi cute toy aesthetic.
The final result should feel like a cute chibi collectible toy.
Use:
- charming oversized head
- simplified cute facial treatment
- soft rounded forms
- compact toy-like body
- clean sculpted masses
- cute expressive silhouette
- playful but polished toy design
- approachable and friendly personality
- simplified readable costume details

Do not use the visual style of Image 1 as the main style.
Do not use the visual style of Image 2 as the main style.
The style must come from this manual chibi cute toy rule.

MATERIAL RULE — MATTE VINYL

Use a matte vinyl toy finish.
Surfaces should be:
- smooth
- clean
- softly reflective
- premium soft-matte
- simplified and polished
- suitable for a collectible vinyl-style toy

Avoid:
- realistic skin pores
- gritty surface noise
- cheap glossy plastic
- messy texture
- overly complex material breakup

TECHNICAL RULE — CHIBI TOY READABILITY

Keep the design readable and object-like.
Use:
- solid shapes
- simplified sculpted details
- robust forms
- clean silhouette
- thicker accessory shapes when accessories are present
- simplified hair masses
- no thin wispy strands
- no fragile micro-details

Do not change the pose, crop, or visible body logic from Image 1.
Do not remove core character identity from Image 2.

PARTIAL OR NON-HUMAN CHARACTER RULES

If Image 2 is partial, cropped, bust-only, or head-only:
- use its visible identity traits to infer missing character areas only as needed to fit the structure and body visibility of Image 1
- inferred areas must remain consistent with the identity, species, colors, outfit logic, and visual traits of Image 2
- adapt inferred areas into the chibi toy style

If Image 2 is an animal and Image 1 is humanoid:
- adapt the animal into a cute chibi anthropomorphic humanoid collectible
- preserve the animal species identity from Image 2
- preserve key animal traits such as head shape, muzzle or beak, ears, horns, eyes, nose, fur, feathers, scales, markings, and color patterns
- use the body visibility, pose, posture, crop, and framing from Image 1
- do not preserve the original quadruped pose from Image 2
- do not humanize the face so much that the animal identity becomes unclear

If Image 2 is a robot, monster, creature, mask, bust, or partial fantasy character:
- infer missing body areas consistently with the visible identity from Image 2
- do not create a generic human body if Image 2 suggests a specific species, creature type, robot design, monster design, or fantasy identity
- adapt the inferred body to the structure from Image 1 and the manual chibi cute toy style

USER ADDITIONAL INSTRUCTIONS

Apply user additional instructions only if they do not conflict with:
- the structure, crop, body visibility, and pose from Image 1
- the character identity from Image 2
- the accessories rule of this case
- the manual chibi cute toy matte vinyl style

If user instructions conflict with those priorities, preserve the priorities above.

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not use Image 1 as character identity
- do not use Image 2 as pose source
- do not use Image 1 as primary style source
- do not use Image 2 as primary style source
- do not merge identities between the images
- do not invent body visibility beyond Image 1
- do not force full body if Image 1 is cropped
- do not create a base unless Image 1 has one or the user explicitly asks for one
- do not remove identity-defining clothing or traits from Image 2
- do not confuse props with clothing, armor, anatomy, or identity-defining traits
- do not create photorealistic skin detail
- do not create realistic anatomy
- do not create messy texture
- do not create cheap glossy plastic
```

---

## THREED_MANUAL_CHIBI_CUTE_TOY_MATTE_REMOVE_ACCESSORIES

Estado da UI:

- `accessoriesMode = remove`
- `styleSource = manual`
- `aestheticModifiers = cute, toy`
- `proportionPreset = chibi`
- `realismLevel = stylized`
- `materialFinish = matte_vinyl`

Descrição:
Remove props/acessórios removíveis da Imagem 2, usa estrutura/pose/crop da Imagem 1, usa identidade/personagem da Imagem 2 e aplica um estilo manual chibi cute toy com acabamento matte vinyl.

Prompt:

```
MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
CASE: REMOVE ACCESSORIES + MANUAL STYLE — CHIBI CUTE TOY MATTE VINYL

You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, sheets, turnarounds, or multiple views.

CORE LOGIC

IMAGE 1 = STRUCTURE SOURCE
IMAGE 2 = CHARACTER SOURCE
MANUAL STYLE = FINAL VISUAL STYLE SOURCE

The final image must show the character from Image 2 transformed into the pose, crop, framing, camera, and composition of Image 1, while applying the manual chibi cute toy style defined in this prompt and removing non-essential props or removable accessories from Image 2.

Do not use Image 1 or Image 2 as the primary visual style source.
Use Image 1 for structure, pose, body visibility, crop, camera, and composition.
Use Image 2 for character identity, face, clothing, colors, species, and recognizable design.

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
- limb placement
- hand placement
- foot placement, if visible
- support/contact logic
- presence or absence of base or support surface

Image 1 defines the final pose, crop, camera, body visibility, and composition.

Because this is a chibi preset, proportions may be stylized into a chibi format, but the final result must still respect:
- the pose direction from Image 1
- the body visibility from Image 1
- the crop from Image 1
- the camera angle from Image 1
- the composition from Image 1
- the presence or absence of base/support from Image 1

Do not use Image 1 as:
- character identity source
- face source
- hair source
- clothing identity source
- color source
- species source
- primary visual style source

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
- primary visual style
- non-essential removable props or accessories

STRUCTURE RULES

Follow Image 1 for all structural decisions, except where the chibi preset intentionally changes proportions.
- Match the pose logic of Image 1.
- Match the visible body crop of Image 1.
- Match the camera angle and composition of Image 1.
- Match the final body visibility from Image 1.
- If Image 1 shows only bust, generate only a chibi bust.
- If Image 1 shows half body, generate only chibi half body.
- If Image 1 shows full body, generate chibi full body.
- If Image 1 crops the body, respect the same crop.
- If Image 1 has a base or support surface, preserve its structural logic.
- If Image 1 does not have a base, do not create a base automatically.
- Do not force full body if Image 1 is cropped.
- Do not force feet, legs, hands, base, or support elements unless supported by Image 1.
- Do not force seated, standing, action, or display-base logic unless supported by Image 1.

CHIBI PROPORTION RULE

Transform the character into a chibi-style collectible.
Use:
- noticeably larger head
- smaller simplified body
- short compact limbs
- cute stylized proportion system
- simplified anatomy
- soft rounded silhouette
- charming toy-like proportions

Important:
Chibi changes the proportions, but it must not ignore the pose, crop, body visibility, camera, or composition from Image 1.

Do not use realistic anatomy.
Do not mix chibi proportions with realistic anatomy.
Do not make the result semi-realistic or realistic.
Do not create a standard adult-proportioned figure.
Do not generate extra body parts outside the visible body logic of Image 1.

CHARACTER IDENTITY RULES

Preserve the character identity from Image 2 in chibi form.
- Preserve the face identity from Image 2, simplified into a cute chibi treatment.
- Preserve hairstyle, facial hair or absence of facial hair from Image 2.
- Preserve expression from Image 2 when compatible with the chibi style.
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

If Image 1 structurally contains a prop, support object, or base, use only its structural logic when necessary for the pose, but do not copy its identity, design, or appearance.

MANUAL STYLE RULE — CHIBI CUTE TOY

Apply a chibi cute toy aesthetic.
The final result should feel like a cute chibi collectible toy.
Use:
- charming oversized head
- simplified cute facial treatment
- soft rounded forms
- compact toy-like body
- clean sculpted masses
- cute expressive silhouette
- playful but polished toy design
- approachable and friendly personality
- simplified readable costume details

Do not use the visual style of Image 1 as the main style.
Do not use the visual style of Image 2 as the main style.
The style must come from this manual chibi cute toy rule.

MATERIAL RULE — MATTE VINYL

Use a matte vinyl toy finish.
Surfaces should be:
- smooth
- clean
- softly reflective
- premium soft-matte
- simplified and polished
- suitable for a collectible vinyl-style toy

Avoid:
- realistic skin pores
- gritty surface noise
- cheap glossy plastic
- messy texture
- overly complex material breakup

TECHNICAL RULE — CHIBI TOY READABILITY

Keep the design readable and object-like.
Use:
- solid shapes
- simplified sculpted details
- robust forms
- clean silhouette
- simplified hair masses
- no thin wispy strands
- no fragile micro-details
- no unnecessary dangling elements
- no floating unsupported decorative pieces

Do not change the pose, crop, or visible body logic from Image 1.
Do not remove core character identity from Image 2.

PARTIAL OR NON-HUMAN CHARACTER RULES

If Image 2 is partial, cropped, bust-only, or head-only:
- use its visible identity traits to infer missing character areas only as needed to fit the structure and body visibility of Image 1
- inferred areas must remain consistent with the identity, species, colors, outfit logic, and visual traits of Image 2
- adapt inferred areas into the chibi toy style

If Image 2 is an animal and Image 1 is humanoid:
- adapt the animal into a cute chibi anthropomorphic humanoid collectible
- preserve the animal species identity from Image 2
- preserve key animal traits such as head shape, muzzle or beak, ears, horns, eyes, nose, fur, feathers, scales, markings, and color patterns
- use the body visibility, pose, posture, crop, and framing from Image 1
- do not preserve the original quadruped pose from Image 2
- do not humanize the face so much that the animal identity becomes unclear

If Image 2 is a robot, monster, creature, mask, bust, or partial fantasy character:
- infer missing body areas consistently with the visible identity from Image 2
- do not create a generic human body if Image 2 suggests a specific species, creature type, robot design, monster design, or fantasy identity
- adapt the inferred body to the structure from Image 1 and the manual chibi cute toy style

USER ADDITIONAL INSTRUCTIONS

Apply user additional instructions only if they do not conflict with:
- the structure, crop, body visibility, and pose from Image 1
- the character identity from Image 2
- the accessories removal rule of this case
- the manual chibi cute toy matte vinyl style

If user instructions conflict with those priorities, preserve the priorities above.

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not use Image 1 as character identity
- do not use Image 2 as pose source
- do not use Image 1 as primary style source
- do not use Image 2 as primary style source
- do not merge identities between the images
- do not invent body visibility beyond Image 1
- do not force full body if Image 1 is cropped
- do not create a base unless Image 1 has one or the user explicitly asks for one
- do not preserve non-essential removable props from Image 2
- do not remove identity-defining clothing or traits from Image 2
- do not confuse props with clothing, armor, anatomy, or identity-defining traits
- do not create photorealistic skin detail
- do not create realistic anatomy
- do not create messy texture
- do not create cheap glossy plastic
```

---

## THREED_MANUAL_SEMIREALISTIC_STATUE_RESIN_KEEP_ACCESSORIES

Estado da UI:

- `accessoriesMode = keep`
- `styleSource = manual`
- `aestheticModifiers = stylized_statue`
- `proportionPreset = default`
- `realismLevel = semi_realistic`
- `materialFinish = smooth_resin`

Descrição:
Preserva eventuais props/acessórios da Imagem 2, usa estrutura/pose/proporções/crop da Imagem 1, usa identidade/personagem da Imagem 2 e aplica um estilo manual semi-realistic stylized statue com acabamento smooth resin.

Prompt:

```
MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
CASE: KEEP ACCESSORIES + MANUAL STYLE — SEMI-REALISTIC STYLIZED STATUE SMOOTH RESIN

You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, sheets, turnarounds, or multiple views.

CORE LOGIC

IMAGE 1 = STRUCTURE SOURCE
IMAGE 2 = CHARACTER + ACCESSORIES SOURCE
MANUAL STYLE = FINAL VISUAL STYLE SOURCE

The final image must show the character from Image 2 transformed into the structure, pose, framing, and body visibility of Image 1, while applying the manual semi-realistic stylized statue smooth resin style defined in this prompt.

Do not use Image 1 or Image 2 as the primary visual style source.
Use Image 1 only for structure.
Use Image 2 only for character identity, design, colors, clothing, and accessories.

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

Do not use Image 1 as:
- character identity source
- face source
- hair source
- clothing identity source
- color source
- species source
- primary visual style source

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
- primary visual style

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
- Preserve expression from Image 2 when compatible with the structure and semi-realistic statue style.
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

For this semi-realistic statue style:
- simplify fragile props into solid sculpted forms
- preserve the recognizable design of important props
- make props feel like part of a premium resin statue
- avoid overly thin, weak, or floating prop details

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

MANUAL STYLE RULE — SEMI-REALISTIC STYLIZED STATUE

Apply a semi-realistic stylized statue aesthetic.
The final result should feel like a premium stylized resin statue or collectible figurine.
Use:
- semi-realistic form treatment
- believable anatomy within the structure of Image 1
- refined sculptural masses
- statue-like presence
- premium collectible composition
- clean but detailed facial structure
- readable clothing and armor forms
- elegant sculpted surfaces
- balanced stylization, not full photorealism

Do not use the visual style of Image 1 as the main style.
Do not use the visual style of Image 2 as the main style.
The style must come from this manual semi-realistic stylized statue rule.

REALISM RULE — SEMI-REALISTIC

Use a semi-realistic 3D treatment.
Increase:
- anatomical believability
- facial structure clarity
- clothing definition
- material credibility
- form depth
- sculptural realism

But preserve:
- collectible readability
- clean presentation
- controlled stylization
- premium statue-like finish

Do not become fully photorealistic.
Do not add messy skin pores, gritty noise, or photographic imperfections.
Do not turn the result into a realistic human photo.
Do not override the pose, crop, or body visibility from Image 1.

PROPORTION RULE — DEFAULT STATUE PROPORTIONS

Use default semi-realistic collectible proportions.
- Preserve the visible proportional logic from Image 1.
- Do not force chibi proportions.
- Do not dramatically enlarge the head unless Image 1 already supports that relationship.
- Do not shrink the body into a toy/chibi format.
- Keep the figure believable and statue-like while respecting Image 1.

MATERIAL RULE — SMOOTH RESIN

Use a smooth resin collectible finish.
Surfaces should feel:
- solid
- refined
- premium
- cleanly sculpted
- subtly detailed
- suitable for a polished collectible figurine

Use smooth transitions and controlled surface detail.

Avoid:
- noisy micro-texture
- cheap plastic appearance
- rough unfinished surfaces
- gritty skin pores
- messy material breakup
- excessive gloss

TECHNICAL RULE — STATUE READABILITY

Keep the design readable as a sculptural collectible.
Use:
- solid sculpted forms
- clear silhouette
- controlled details
- readable costume forms
- clean anatomical transitions
- strong sculptural presence

Avoid:
- fragile thin elements
- floating unsupported details
- excessive micro-detail
- wispy hair strands
- messy texture
- random decorative noise

Do not change the pose, crop, or visible body logic from Image 1.
Do not remove core character identity from Image 2.

PARTIAL OR NON-HUMAN CHARACTER RULES

If Image 2 is partial, cropped, bust-only, or head-only:
- use its visible identity traits to infer missing character areas only as needed to fit the structure and body visibility of Image 1
- inferred areas must remain consistent with the identity, species, colors, outfit logic, and visual traits of Image 2
- adapt inferred areas into the semi-realistic stylized statue style

If Image 2 is an animal and Image 1 is humanoid:
- adapt the animal into a semi-realistic anthropomorphic humanoid statue
- preserve the animal species identity from Image 2
- preserve key animal traits such as head shape, muzzle or beak, ears, horns, eyes, nose, fur, feathers, scales, markings, and color patterns
- use the body visibility, pose, posture, crop, and framing from Image 1
- do not preserve the original quadruped pose from Image 2
- do not humanize the face so much that the animal identity becomes unclear

If Image 2 is a robot, monster, creature, mask, bust, or partial fantasy character:
- infer missing body areas consistently with the visible identity from Image 2
- do not create a generic human body if Image 2 suggests a specific species, creature type, robot design, monster design, or fantasy identity
- adapt the inferred body to the structure from Image 1 and the manual semi-realistic statue style

USER ADDITIONAL INSTRUCTIONS

Apply user additional instructions only if they do not conflict with:
- the structure, crop, body visibility, and pose from Image 1
- the character identity from Image 2
- the accessories rule of this case
- the manual semi-realistic stylized statue smooth resin style

If user instructions conflict with those priorities, preserve the priorities above.

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not use Image 1 as character identity
- do not use Image 2 as pose source
- do not use Image 1 as primary style source
- do not use Image 2 as primary style source
- do not merge identities between the images
- do not invent body visibility beyond Image 1
- do not force full body if Image 1 is cropped
- do not force chibi proportions
- do not create a base unless Image 1 has one or the user explicitly asks for one
- do not remove identity-defining clothing or traits from Image 2
- do not confuse props with clothing, armor, anatomy, or identity-defining traits
- do not create photorealistic skin pores
- do not create messy texture
- do not create cheap glossy plastic
- do not create toy-like vinyl proportions
```

---

## THREED_MANUAL_SEMIREALISTIC_STATUE_RESIN_REMOVE_ACCESSORIES

Estado da UI:

- `accessoriesMode = remove`
- `styleSource = manual`
- `aestheticModifiers = stylized_statue`
- `proportionPreset = default`
- `realismLevel = semi_realistic`
- `materialFinish = smooth_resin`

Descrição:
Remove props/acessórios removíveis da Imagem 2, usa estrutura/pose/proporções/crop da Imagem 1, usa identidade/personagem da Imagem 2 e aplica um estilo manual semi-realistic stylized statue com acabamento smooth resin.

Prompt:

```
MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
CASE: REMOVE ACCESSORIES + MANUAL STYLE — SEMI-REALISTIC STYLIZED STATUE SMOOTH RESIN

You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, sheets, turnarounds, or multiple views.

CORE LOGIC

IMAGE 1 = STRUCTURE SOURCE
IMAGE 2 = CHARACTER SOURCE
MANUAL STYLE = FINAL VISUAL STYLE SOURCE

The final image must show the character from Image 2 transformed into the structure, pose, framing, and body visibility of Image 1, while applying the manual semi-realistic stylized statue smooth resin style defined in this prompt and removing non-essential props or removable accessories from Image 2.

Do not use Image 1 or Image 2 as the primary visual style source.
Use Image 1 only for structure.
Use Image 2 only for character identity, design, colors, clothing, and core appearance.

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

Do not use Image 1 as:
- character identity source
- face source
- hair source
- clothing identity source
- color source
- species source
- primary visual style source

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
- primary visual style
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
- Preserve expression from Image 2 when compatible with the structure and semi-realistic statue style.
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

If Image 1 structurally contains a prop, support object, or base, use only its structural logic when necessary for the pose, but do not copy its identity, design, or appearance.

MANUAL STYLE RULE — SEMI-REALISTIC STYLIZED STATUE

Apply a semi-realistic stylized statue aesthetic.
The final result should feel like a premium stylized resin statue or collectible figurine.
Use:
- semi-realistic form treatment
- believable anatomy within the structure of Image 1
- refined sculptural masses
- statue-like presence
- premium collectible composition
- clean but detailed facial structure
- readable clothing and armor forms
- elegant sculpted surfaces
- balanced stylization, not full photorealism

Do not use the visual style of Image 1 as the main style.
Do not use the visual style of Image 2 as the main style.
The style must come from this manual semi-realistic stylized statue rule.

REALISM RULE — SEMI-REALISTIC

Use a semi-realistic 3D treatment.
Increase:
- anatomical believability
- facial structure clarity
- clothing definition
- material credibility
- form depth
- sculptural realism

But preserve:
- collectible readability
- clean presentation
- controlled stylization
- premium statue-like finish

Do not become fully photorealistic.
Do not add messy skin pores, gritty noise, or photographic imperfections.
Do not turn the result into a realistic human photo.
Do not override the pose, crop, or body visibility from Image 1.

PROPORTION RULE — DEFAULT STATUE PROPORTIONS

Use default semi-realistic collectible proportions.
- Preserve the visible proportional logic from Image 1.
- Do not force chibi proportions.
- Do not dramatically enlarge the head unless Image 1 already supports that relationship.
- Do not shrink the body into a toy/chibi format.
- Keep the figure believable and statue-like while respecting Image 1.

MATERIAL RULE — SMOOTH RESIN

Use a smooth resin collectible finish.
Surfaces should feel:
- solid
- refined
- premium
- cleanly sculpted
- subtly detailed
- suitable for a polished collectible figurine

Use smooth transitions and controlled surface detail.

Avoid:
- noisy micro-texture
- cheap plastic appearance
- rough unfinished surfaces
- gritty skin pores
- messy material breakup
- excessive gloss

TECHNICAL RULE — STATUE READABILITY

Keep the design readable as a sculptural collectible.
Use:
- solid sculpted forms
- clear silhouette
- controlled details
- readable costume forms
- clean anatomical transitions
- strong sculptural presence
- no unnecessary dangling elements
- no loose unsupported props

Avoid:
- fragile thin elements
- floating unsupported details
- excessive micro-detail
- wispy hair strands
- messy texture
- random decorative noise

Do not change the pose, crop, or visible body logic from Image 1.
Do not remove core character identity from Image 2.

PARTIAL OR NON-HUMAN CHARACTER RULES

If Image 2 is partial, cropped, bust-only, or head-only:
- use its visible identity traits to infer missing character areas only as needed to fit the structure and body visibility of Image 1
- inferred areas must remain consistent with the identity, species, colors, outfit logic, and visual traits of Image 2
- adapt inferred areas into the semi-realistic stylized statue style

If Image 2 is an animal and Image 1 is humanoid:
- adapt the animal into a semi-realistic anthropomorphic humanoid statue
- preserve the animal species identity from Image 2
- preserve key animal traits such as head shape, muzzle or beak, ears, horns, eyes, nose, fur, feathers, scales, markings, and color patterns
- use the body visibility, pose, posture, crop, and framing from Image 1
- do not preserve the original quadruped pose from Image 2
- do not humanize the face so much that the animal identity becomes unclear

If Image 2 is a robot, monster, creature, mask, bust, or partial fantasy character:
- infer missing body areas consistently with the visible identity from Image 2
- do not create a generic human body if Image 2 suggests a specific species, creature type, robot design, monster design, or fantasy identity
- adapt the inferred body to the structure from Image 1 and the manual semi-realistic statue style

USER ADDITIONAL INSTRUCTIONS

Apply user additional instructions only if they do not conflict with:
- the structure, crop, body visibility, and pose from Image 1
- the character identity from Image 2
- the accessories removal rule of this case
- the manual semi-realistic stylized statue smooth resin style

If user instructions conflict with those priorities, preserve the priorities above.

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not use Image 1 as character identity
- do not use Image 2 as pose source
- do not use Image 1 as primary style source
- do not use Image 2 as primary style source
- do not merge identities between the images
- do not invent body visibility beyond Image 1
- do not force full body if Image 1 is cropped
- do not force chibi proportions
- do not create a base unless Image 1 has one or the user explicitly asks for one
- do not remove identity-defining clothing or traits from Image 2
- do not preserve non-essential removable props from Image 2
- do not confuse props with clothing, armor, anatomy, or identity-defining traits
- do not create photorealistic skin pores
- do not create messy texture
- do not create cheap glossy plastic
- do not create toy-like vinyl proportions
```

---

## THREED_MANUAL_REALISTIC_PAINTED_RESIN_KEEP_ACCESSORIES

Estado da UI:

- `accessoriesMode = keep`
- `styleSource = manual`
- `proportionPreset = default`
- `realismLevel = realistic`
- `materialFinish = painted_collectible_resin`

Descrição:
Preserva eventuais props/acessórios da Imagem 2, usa estrutura/pose/proporções/crop da Imagem 1, usa identidade/personagem da Imagem 2 e aplica um estilo manual realistic com acabamento painted collectible resin.

Prompt:

```
MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
CASE: KEEP ACCESSORIES + MANUAL STYLE — REALISTIC PAINTED COLLECTIBLE RESIN

You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, sheets, turnarounds, or multiple views.

CORE LOGIC

IMAGE 1 = STRUCTURE SOURCE
IMAGE 2 = CHARACTER + ACCESSORIES SOURCE
MANUAL STYLE = FINAL VISUAL STYLE SOURCE

The final image must show the character from Image 2 transformed into the structure, pose, framing, and body visibility of Image 1, while applying the manual realistic painted collectible resin style defined in this prompt.

Do not use Image 1 or Image 2 as the primary visual style source.
Use Image 1 only for structure.
Use Image 2 only for character identity, design, colors, clothing, and accessories.

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

Do not use Image 1 as:
- character identity source
- face source
- hair source
- clothing identity source
- color source
- species source
- primary visual style source

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
- primary visual style

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
- Preserve expression from Image 2 when compatible with the structure and realistic painted resin style.
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

For this realistic painted resin style:
- preserve important prop identity and design
- make props feel like painted sculpted resin
- simplify fragile parts only when necessary
- keep props readable and physically plausible

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

MANUAL STYLE RULE — REALISTIC PAINTED COLLECTIBLE RESIN

Apply a realistic painted collectible resin aesthetic.
The final result should feel like a high-end painted resin collectible figure, not a toy and not a photographic human portrait.
Use:
- realistic 3D character treatment
- believable anatomy within the structure of Image 1
- realistic facial structure
- realistic clothing behavior
- painted sculpt finish
- premium collectible resin presentation
- refined material separation
- controlled surface detail
- clean studio render
- display-quality figure finish

Do not use the visual style of Image 1 as the main style.
Do not use the visual style of Image 2 as the main style.
The style must come from this manual realistic painted collectible resin rule.

REALISM RULE — REALISTIC

Use a realistic 3D character treatment.
Increase:
- facial structure realism
- anatomical believability
- clothing behavior
- material interpretation
- surface credibility
- believable form transitions
- body form clarity

But preserve:
- clean rendered presentation
- collectible figure readability
- controlled sculpted finish
- character identity from Image 2
- structure and body visibility from Image 1

Do not turn the result into a real-world photograph.
Do not add messy pores, gritty noise, acne, sweat, dirt, or uncontrolled photographic skin artifacts.
Do not exaggerate into chibi, cartoon, or toy-like proportions.

PROPORTION RULE — DEFAULT REALISTIC COLLECTIBLE PROPORTIONS

Use default realistic collectible proportions.
- Preserve the visible proportional logic from Image 1.
- Do not force chibi proportions.
- Do not dramatically enlarge the head unless Image 1 already supports that relationship.
- Do not shrink the body into a toy/chibi format.
- Keep the figure believable, realistic, and collectible while respecting Image 1.

MATERIAL RULE — PAINTED COLLECTIBLE RESIN

Render the character as a painted collectible resin figure.
Use:
- clean painted-sculpt presentation
- refined material separation
- premium figurine finish
- display-quality treatment
- readable painted details
- polished collectible surface
- resin figure material logic
- controlled finish, not raw plastic

Avoid:
- messy weathering unless explicitly requested
- random grime, damage, or dirt
- cheap toy plastic
- overly glossy plastic
- raw unfinished surfaces
- noisy micro-texture

TECHNICAL RULE — REALISTIC COLLECTIBLE READABILITY

Keep the design readable as a premium collectible figure.
Use:
- solid sculpted forms
- clear silhouette
- controlled realistic detail
- readable clothing and armor forms
- clean anatomical transitions
- physically plausible props
- polished presentation

Avoid:
- fragile thin elements
- floating unsupported details
- excessive micro-detail
- wispy hair strands
- messy texture
- random decorative noise
- uncontrolled realism that makes the figure look like a photograph instead of a collectible

Do not change the pose, crop, or visible body logic from Image 1.
Do not remove core character identity from Image 2.

PARTIAL OR NON-HUMAN CHARACTER RULES

If Image 2 is partial, cropped, bust-only, or head-only:
- use its visible identity traits to infer missing character areas only as needed to fit the structure and body visibility of Image 1
- inferred areas must remain consistent with the identity, species, colors, outfit logic, and visual traits of Image 2
- adapt inferred areas into the realistic painted resin collectible style

If Image 2 is an animal and Image 1 is humanoid:
- adapt the animal into a realistic anthropomorphic humanoid collectible figure
- preserve the animal species identity from Image 2
- preserve key animal traits such as head shape, muzzle or beak, ears, horns, eyes, nose, fur, feathers, scales, markings, and color patterns
- use the body visibility, pose, posture, crop, and framing from Image 1
- do not preserve the original quadruped pose from Image 2
- do not humanize the face so much that the animal identity becomes unclear

If Image 2 is a robot, monster, creature, mask, bust, or partial fantasy character:
- infer missing body areas consistently with the visible identity from Image 2
- do not create a generic human body if Image 2 suggests a specific species, creature type, robot design, monster design, or fantasy identity
- adapt the inferred body to the structure from Image 1 and the manual realistic painted resin collectible style

USER ADDITIONAL INSTRUCTIONS

Apply user additional instructions only if they do not conflict with:
- the structure, crop, body visibility, and pose from Image 1
- the character identity from Image 2
- the accessories rule of this case
- the manual realistic painted collectible resin style

If user instructions conflict with those priorities, preserve the priorities above.

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not use Image 1 as character identity
- do not use Image 2 as pose source
- do not use Image 1 as primary style source
- do not use Image 2 as primary style source
- do not merge identities between the images
- do not invent body visibility beyond Image 1
- do not force full body if Image 1 is cropped
- do not force chibi proportions
- do not create a base unless Image 1 has one or the user explicitly asks for one
- do not remove identity-defining clothing or traits from Image 2
- do not confuse props with clothing, armor, anatomy, or identity-defining traits
- do not create toy-like vinyl proportions
- do not create cartoon proportions
- do not create cheap glossy plastic
- do not create messy photographic skin artifacts
- do not turn the result into a real-world photo
```

---

## THREED_MANUAL_REALISTIC_PAINTED_RESIN_REMOVE_ACCESSORIES

Estado da UI:

- `accessoriesMode = remove`
- `styleSource = manual`
- `proportionPreset = default`
- `realismLevel = realistic`
- `materialFinish = painted_collectible_resin`

Descrição:
Remove props/acessórios removíveis da Imagem 2, usa estrutura/pose/proporções/crop da Imagem 1, usa identidade/personagem da Imagem 2 e aplica um estilo manual realistic com acabamento painted collectible resin.

Prompt:

```
MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
CASE: REMOVE ACCESSORIES + MANUAL STYLE — REALISTIC PAINTED COLLECTIBLE RESIN

You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, sheets, turnarounds, or multiple views.

CORE LOGIC

IMAGE 1 = STRUCTURE SOURCE
IMAGE 2 = CHARACTER SOURCE
MANUAL STYLE = FINAL VISUAL STYLE SOURCE

The final image must show the character from Image 2 transformed into the structure, pose, framing, and body visibility of Image 1, while applying the manual realistic painted collectible resin style defined in this prompt and removing non-essential props or removable accessories from Image 2.

Do not use Image 1 or Image 2 as the primary visual style source.
Use Image 1 only for structure.
Use Image 2 only for character identity, design, colors, clothing, and core appearance.

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

Do not use Image 1 as:
- character identity source
- face source
- hair source
- clothing identity source
- color source
- species source
- primary visual style source

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
- primary visual style
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
- Preserve expression from Image 2 when compatible with the structure and realistic painted resin style.
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

If Image 1 structurally contains a prop, support object, or base, use only its structural logic when necessary for the pose, but do not copy its identity, design, or appearance.

MANUAL STYLE RULE — REALISTIC PAINTED COLLECTIBLE RESIN

Apply a realistic painted collectible resin aesthetic.
The final result should feel like a high-end painted resin collectible figure, not a toy and not a photographic human portrait.
Use:
- realistic 3D character treatment
- believable anatomy within the structure of Image 1
- realistic facial structure
- realistic clothing behavior
- painted sculpt finish
- premium collectible resin presentation
- refined material separation
- controlled surface detail
- clean studio render
- display-quality figure finish

Do not use the visual style of Image 1 as the main style.
Do not use the visual style of Image 2 as the main style.
The style must come from this manual realistic painted collectible resin rule.

REALISM RULE — REALISTIC

Use a realistic 3D character treatment.
Increase:
- facial structure realism
- anatomical believability
- clothing behavior
- material interpretation
- surface credibility
- believable form transitions
- body form clarity

But preserve:
- clean rendered presentation
- collectible figure readability
- controlled sculpted finish
- character identity from Image 2
- structure and body visibility from Image 1

Do not turn the result into a real-world photograph.
Do not add messy pores, gritty noise, acne, sweat, dirt, or uncontrolled photographic skin artifacts.
Do not exaggerate into chibi, cartoon, or toy-like proportions.

PROPORTION RULE — DEFAULT REALISTIC COLLECTIBLE PROPORTIONS

Use default realistic collectible proportions.
- Preserve the visible proportional logic from Image 1.
- Do not force chibi proportions.
- Do not dramatically enlarge the head unless Image 1 already supports that relationship.
- Do not shrink the body into a toy/chibi format.
- Keep the figure believable, realistic, and collectible while respecting Image 1.

MATERIAL RULE — PAINTED COLLECTIBLE RESIN

Render the character as a painted collectible resin figure.
Use:
- clean painted-sculpt presentation
- refined material separation
- premium figurine finish
- display-quality treatment
- readable painted details
- polished collectible surface
- resin figure material logic
- controlled finish, not raw plastic

Avoid:
- messy weathering unless explicitly requested
- random grime, damage, or dirt
- cheap toy plastic
- overly glossy plastic
- raw unfinished surfaces
- noisy micro-texture

TECHNICAL RULE — REALISTIC COLLECTIBLE READABILITY

Keep the design readable as a premium collectible figure.
Use:
- solid sculpted forms
- clear silhouette
- controlled realistic detail
- readable clothing and armor forms
- clean anatomical transitions
- physically plausible forms
- polished presentation
- clean integration of body and clothing details

Avoid:
- fragile thin elements
- floating unsupported details
- excessive micro-detail
- wispy hair strands
- messy texture
- random decorative noise
- uncontrolled realism that makes the figure look like a photograph instead of a collectible

Do not change the pose, crop, or visible body logic from Image 1.
Do not remove core character identity from Image 2.

PARTIAL OR NON-HUMAN CHARACTER RULES

If Image 2 is partial, cropped, bust-only, or head-only:
- use its visible identity traits to infer missing character areas only as needed to fit the structure and body visibility of Image 1
- inferred areas must remain consistent with the identity, species, colors, outfit logic, and visual traits of Image 2
- adapt inferred areas into the realistic painted resin collectible style

If Image 2 is an animal and Image 1 is humanoid:
- adapt the animal into a realistic anthropomorphic humanoid collectible figure
- preserve the animal species identity from Image 2
- preserve key animal traits such as head shape, muzzle or beak, ears, horns, eyes, nose, fur, feathers, scales, markings, and color patterns
- use the body visibility, pose, posture, crop, and framing from Image 1
- do not preserve the original quadruped pose from Image 2
- do not humanize the face so much that the animal identity becomes unclear

If Image 2 is a robot, monster, creature, mask, bust, or partial fantasy character:
- infer missing body areas consistently with the visible identity from Image 2
- do not create a generic human body if Image 2 suggests a specific species, creature type, robot design, monster design, or fantasy identity
- adapt the inferred body to the structure from Image 1 and the manual realistic painted resin collectible style

USER ADDITIONAL INSTRUCTIONS

Apply user additional instructions only if they do not conflict with:
- the structure, crop, body visibility, and pose from Image 1
- the character identity from Image 2
- the accessories removal rule of this case
- the manual realistic painted collectible resin style

If user instructions conflict with those priorities, preserve the priorities above.

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not use Image 1 as character identity
- do not use Image 2 as pose source
- do not use Image 1 as primary style source
- do not use Image 2 as primary style source
- do not merge identities between the images
- do not invent body visibility beyond Image 1
- do not force full body if Image 1 is cropped
- do not force chibi proportions
- do not create a base unless Image 1 has one or the user explicitly asks for one
- do not remove identity-defining clothing or traits from Image 2
- do not preserve non-essential removable props from Image 2
- do not confuse props with clothing, armor, anatomy, or identity-defining traits
- do not create toy-like vinyl proportions
- do not create cartoon proportions
- do not create cheap glossy plastic
- do not create messy photographic skin artifacts
- do not turn the result into a real-world photo
```

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
