/* ============================================================
   STLAI Asset Generator — Prompts dos fluxos
   ------------------------------------------------------------
   Os prompts ficam em constantes JS para serem fáceis de editar
   sem rebuildar nada. A IA programadora deve referenciar essas
   constantes nas chamadas para a OpenAI (api.js).
   ============================================================ */


/* ------------------------------------------------------------
   FLUXO 1 — Personagem 3D
   ------------------------------------------------------------
   Estrutura definida no Anexo A do PRD (versão 1.1):
     • Image 1 = pose / proporção / composição / câmera (BLUEPRINT).
     • Image 2 = identidade visual / aparência / outfit (APPEARANCE).
     • {bloco_extra_do_usuario} é substituído em runtime pelo conteúdo
       do textarea da Home (lado esquerdo).

   IMPORTANTE — duas alterações já aplicadas neste template:
     [1] Em HARD RULES, "do not drift toward bobble-head or chibi
         proportions" foi substituído por
         "do not drift toward proportions different from Image 1".
     [2] Bloco "USER ADDITIONAL INSTRUCTIONS" inserido logo antes
         de "ABSOLUTE DO NOTs", recebendo {bloco_extra_do_usuario}.

   AÇÃO MANUAL DO TIAGO:
   O conteúdo completo do prompt original ainda precisa ser colado
   nas seções marcadas com [COLAR AQUI ...]. Use a versão genérica
   final que conversamos (sem referências a bobblehead/chibi e sem
   instruções textuais específicas de pose).
*/

const PROMPT_FLUXO1_BASE = `MULTI-IMAGE INSTRUCTION — STRICT ROLE SEPARATION
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

[COLAR AQUI: continuação da seção IMAGE 1 com as instruções de
"do NOT use Image 1 for..." (cor, textura, identidade, outfit, etc.)]

IMAGE 2 = APPEARANCE / IDENTITY / OUTFIT / STYLE ONLY
[COLAR AQUI: lista da Image 2 — usar Image 2 para identidade,
proporções faciais (mas mantendo o ratio cabeça/corpo da Image 1),
tom de pele, cabelo, barba, expressão, outfit, paleta, materiais,
texturas, etc. + lista de "do NOT use Image 2 for..." (pose,
câmera, composição).]

[COLAR AQUI: seção GLOBAL STYLE / collectible look / iluminação /
fundo / acabamento / etc.]

HARD RULES
[COLAR AQUI: lista de hard rules. Lembrar de manter a linha
substituída pela versão genérica:]
– do not drift toward proportions different from Image 1

[COLAR AQUI: demais hard rules.]

USER ADDITIONAL INSTRUCTIONS
{bloco_extra_do_usuario}

ABSOLUTE DO NOTs
[COLAR AQUI: lista final de "absolute do nots".]
`;


/* ------------------------------------------------------------
   FLUXO 2 — SVG por imagem
   ------------------------------------------------------------
   No Fluxo 2 o prompt vem do USUÁRIO (textarea da coluna direita
   da Home). Esta constante é apenas um placeholder default,
   opcional, caso queiramos sugerir um prompt inicial.
*/

const PROMPT_FLUXO2_DEFAULT = ``;


/* ------------------------------------------------------------
   FLUXO 3 — SVG textual
   ------------------------------------------------------------
   TBD durante implementação. Mesma lógica de duas imagens do Fluxo 1:
     • Image 1 = composição da frase (Biblioteca B).
     • Image 2 = estilo visual (upload do usuário).
   Roda no fundo, sem campo de prompt exposto na Home.
*/

const PROMPT_FLUXO3_BASE = `[A DEFINIR — ver item 4 dos "Itens em aberto" do PRD]`;


const PLACEHOLDER = '[AGUARDANDO PROMPT DEFINITIVO]';

// Bases por fluxo — ainda placeholders (substituir quando o prompt base
// for definido para 2D / Pose / 3D base genérica).
const PROMPT_3D_CHARACTER_BASE = PLACEHOLDER;
const PROMPT_2D_CHARACTER_BASE = PLACEHOLDER;
const PROMPT_POSE_TRANSFER_BASE = PLACEHOLDER;

// Módulos de direção de estilo via imagem — continuam placeholders
// (são tratados nos casos consolidados image1 / image2 já existentes).
const PROMPT_MODULE_STYLE_IMAGE_1 = PLACEHOLDER;
const PROMPT_MODULE_STYLE_IMAGE_2 = PLACEHOLDER;


/* ============================================================
   MÓDULOS DO MODO MANUAL — 3D CHARACTER FLOW
   ------------------------------------------------------------
   Usados APENAS quando styleSource = "manual".
   São concatenados pelo build3DManualPromptBody na ordem:
     1) PROMPT_3D_MANUAL_SHELL_BASE
     2) PROMPT_MODULE_STYLE_SOURCE_MANUAL
     3) PROMPT_MODULE_ACCESSORIES_KEEP | _REMOVE
     4) Estética (combinável)
     5) Proporção (escolha única)
     6) Realismo (escolha única)
     7) Material (escolha única)
     8) Técnico (combinável)
     9) PROMPT_GLOBAL_ANTI_INTERFERENCE
    10) USER ADDITIONAL INSTRUCTIONS (no builder principal)
   ============================================================ */

// Bloco base do modo manual — abre o prompt e fixa as funções
// de Image 1 (estrutura) e Image 2 (identidade), sem dar estilo
// pra nenhuma das duas. Estilo vem dos módulos manuais.
const PROMPT_3D_MANUAL_SHELL_BASE = `MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW (MANUAL STYLE)
You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, or multiple views.

IMAGE ROLE LOGIC

IMAGE 1 = STRUCTURE SOURCE ONLY
Use Image 1 for:
- pose
- posture
- body visibility
- visible proportions
- crop
- framing
- camera angle
- composition
- silhouette
- visible body logic
- support logic
- presence or absence of base or support surface
Image 1 defines the structural logic of the final result.
Do not use Image 1 as the identity source.
Do not use Image 1 as the visual style source.

IMAGE 2 = CHARACTER IDENTITY SOURCE ONLY
Use Image 2 for:
- character identity
- face and facial features
- hairstyle or hair absence
- facial hair or lack of facial hair
- expression
- outfit / costume / armor / clothing
- colors
- species identity, if non-human
- recognizable visual traits
- core body appearance
- essential clothing and identity-defining visual elements
- accessories according to the selected accessories mode
Use Image 2 as the appearance and identity source only.
Do not use Image 2 to define pose, framing, crop, or composition.
Do not use Image 2 as the visual style source.

CORE GOAL
Create a polished 3D character render that:
- follows the structural logic of Image 1
- preserves the character identity from Image 2
- applies the visual style from the selected manual style modules only

STRUCTURE RULES
- Match the visible pose and body logic of Image 1.
- Respect the visible crop from Image 1.
- If Image 1 shows only bust, generate only bust.
- If Image 1 shows half body, generate only half body.
- If Image 1 crops the body, respect the same crop.
- Do not invent missing anatomy.
- Do not force full body.
- Do not force feet, legs, hands, base, or props unless supported by Image 1.
- Do not force seated pose, standing pose, action pose, or display base unless supported by Image 1.

CHARACTER IDENTITY RULES
- Preserve the target character identity from Image 2.
- Preserve face, hair, outfit, colors, and recognizable character traits from Image 2.
- Preserve essential clothing and identity-defining outfit elements.
- Do not merge identities between Image 1 and Image 2.
- The final result must clearly read as the character from Image 2.

DEFAULT PRESENTATION
- polished 3D render
- collectible-quality finish
- clean shapes
- readable silhouette
- clean lighting
- uncluttered presentation

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not use Image 1 as identity source
- do not use Image 1 or Image 2 as the primary visual style source
- do not force a pose that is not supported by Image 1
- do not invent missing body parts
- do not add random scenery or props
- do not crop unexpectedly
- do not create a base unless it is supported by Image 1`;


// Bloco que ancora o modo manual: estilo vem dos módulos, não das imagens.
const PROMPT_MODULE_STYLE_SOURCE_MANUAL = `STYLE SOURCE RULE — MANUAL STYLE
Do not use Image 1 or Image 2 as the primary style source.
Use Image 1 only for:
- structure
- pose
- posture
- visible proportions
- crop
- framing
- camera angle
- composition
- silhouette
- visible body logic
- presence or absence of base or support surface
Use Image 2 only for:
- character identity
- face and facial features
- hairstyle or hair absence
- facial hair or lack of facial hair
- expression
- outfit / costume / armor / clothing
- colors
- species identity, if non-human
- recognizable character traits
- accessories according to the selected accessories mode
The final visual style must come from the selected manual style modules only.
Do not transfer the aesthetic language of Image 1.
Do not transfer the aesthetic language of Image 2.
Do not use Image 1 material, render style, or surface treatment.
Do not use Image 2 material, render style, or surface treatment unless a selected manual module explicitly requests something similar.
The result should combine:
- structure from Image 1
- character identity from Image 2
- style direction from the active manual modules`;


// Acessórios — KEEP. Usado tanto no caso keep__manual quanto isolado.
const PROMPT_MODULE_ACCESSORIES_KEEP = `ACCESSORIES RULE
Preserve visible accessories, handheld props, weapons, shields, bags, tools, capes when clearly treated as accessories, and other external character items from Image 2 when they are compatible with the final pose and composition.
Adapt them naturally to the pose from Image 1 without changing the structural logic.
Do not remove accessories that are clearly part of the character identity.`;


// Acessórios — REMOVE.
const PROMPT_MODULE_ACCESSORIES_REMOVE = `ACCESSORIES RULE
Remove non-essential accessories and detachable props from the final result.
Do not include handheld props, weapons, shields, bags, tools, or external removable items from Image 2.
Preserve the core character identity, face, hair, outfit, body, colors, and essential clothing.
Do not remove elements that are clearly part of the main outfit or core character identity.
If an item is structurally required by Image 1, preserve only the structural logic from Image 1, not the identity or design of any accessory from Image 1.`;


// Estética — combináveis. Ativados quando o slug está em aestheticModifiers[].
const PROMPT_MODULE_AESTHETIC_CUTE = `AESTHETIC MODIFIER — CUTE
Make the character feel cute, appealing, friendly, and emotionally approachable.
Use:
- softened forms
- charming facial treatment
- friendly proportions within the active structure logic
- appealing simplified details
- a warm and collectible visual tone
Preserve the character identity from Image 2.
Preserve the structure, pose, crop, and visible body logic from Image 1.
Do not turn the result into an unrelated cartoon.
Do not force chibi proportions unless the Chibi proportion preset is active.
Do not alter the pose or crop from Image 1.`;

const PROMPT_MODULE_AESTHETIC_TOY = `AESTHETIC MODIFIER — TOY
Render the character as a toy-like 3D object.
Use:
- simplified forms
- clean sculpted masses
- readable shapes
- clear edges
- collectible toy sensibility
- polished object-like presentation
Preserve the character identity from Image 2.
Preserve the structure, pose, crop, and visible body logic from Image 1.
Avoid hyper-real texture noise.
Avoid messy surface detail.
Do not force chibi proportions unless the Chibi proportion preset is active.
Do not change the structural logic from Image 1.`;

const PROMPT_MODULE_AESTHETIC_PREMIUM_COLLECTIBLE = `AESTHETIC MODIFIER — PREMIUM COLLECTIBLE
Give the result a premium collectible quality.
Use:
- refined sculpted forms
- polished presentation
- strong silhouette readability
- balanced visual hierarchy
- high-quality collectible finish
- clean premium render treatment
- display-worthy character presentation
The result should feel like a high-quality collectible item, not a rough concept or casual render.
Preserve the character identity from Image 2.
Preserve the structure, pose, crop, and visible body logic from Image 1.
Do not add random display elements unless supported by Image 1 or explicitly requested.
Do not force a base unless Image 1 has a base or the user explicitly asks for one.`;

const PROMPT_MODULE_AESTHETIC_DESIGNER_TOY = `AESTHETIC MODIFIER — DESIGNER TOY
Give the result a designer toy aesthetic.
Use:
- bold simplified masses
- curated collectible design language
- intentional stylization
- strong silhouette readability
- clean premium object feel
- gallery-quality toy presentation
The character should feel like a stylized designer collectible, not a realistic figure.
Preserve the character identity from Image 2.
Preserve the structure, pose, crop, and visible body logic from Image 1.
Avoid excessive realism.
Avoid messy micro-detail.
Avoid random decorative elements not present in the character identity or selected options.`;

const PROMPT_MODULE_AESTHETIC_STYLIZED_STATUE = `AESTHETIC MODIFIER — STYLIZED STATUE
Render the character as a stylized statue-like collectible.
Use:
- sculpted form clarity
- display-piece presence
- balanced volume treatment
- refined figurine presentation
- solid sculptural shapes
- premium statue-like finish
The result should feel more like a statue or figurine than a soft toy.
Preserve the character identity from Image 2.
Preserve the structure, pose, crop, and visible body logic from Image 1.
Do not force a base unless Image 1 has a base or the user explicitly asks for one.
Do not force full body if Image 1 is cropped.
Do not add statue elements that conflict with the structure from Image 1.`;


// Proporção — escolha única.
const PROMPT_MODULE_PROPORTION_DEFAULT = `PROPORTION PRESET — DEFAULT
Preserve the visible proportional logic from Image 1.
Do not force exaggerated proportions.
Do not force chibi proportions.
Do not enlarge or shrink the character beyond what is required by the active structure logic and selected aesthetic modules.`;

const PROMPT_MODULE_PROPORTION_CHIBI = `PROPORTION PRESET — CHIBI
Transform the character into a chibi-style collectible.
Use:
- noticeably larger head
- smaller body
- simplified anatomy
- shorter limbs
- cute stylized proportion system
- compact and appealing silhouette
Preserve the core character identity from Image 2.
Preserve the overall pose direction, crop, and composition from Image 1 as much as possible within the chibi proportion system.
Do not make the character realistic.
Do not mix chibi proportions with realistic anatomy.
Do not force full body if Image 1 is cropped.
Do not invent missing body parts that are not supported by Image 1.
Important:
Chibi intentionally changes proportions, but it must not ignore the pose, crop, body visibility, or composition from Image 1.`;


// Realismo — escolha única.
const PROMPT_MODULE_REALISM_STYLIZED = `REALISM LEVEL — STYLIZED
Use a stylized 3D character treatment.
Prioritize clean forms, readable silhouette, simplified details, and collectible-friendly presentation.
Do not add unnecessary photorealistic skin pores, gritty noise, or messy realism.
Preserve the identity from Image 2 and the structure from Image 1.`;

const PROMPT_MODULE_REALISM_SEMI_REALISTIC = `REALISM LEVEL — SEMI-REALISTIC
Use a semi-realistic 3D treatment.
Preserve stylization and collectible readability, but increase:
- anatomical believability
- surface nuance
- clothing definition
- material credibility
- form depth
- facial structure clarity
Do not become fully photorealistic.
Do not add messy skin pores or gritty noise.
Do not override the pose, crop, or body visibility from Image 1.
Do not erase the character identity from Image 2.`;

const PROMPT_MODULE_REALISM_REALISTIC = `REALISM LEVEL — REALISTIC
Use a realistic 3D character treatment.
Increase realism in:
- facial structure
- anatomy treatment
- clothing behavior
- material interpretation
- surface credibility
- believable form transitions
Preserve a clean rendered look.
Preserve the character identity from Image 2.
Preserve the structure, pose, crop, and body visibility from Image 1.
Do not turn the result into a cheap plastic toy.
Do not use exaggerated chibi proportions.
Do not force full body, base, feet, hands, or legs if they are not supported by Image 1.
Do not add random environment or props.`;


// Material — escolha única.
const PROMPT_MODULE_MATERIAL_MATTE_VINYL = `MATERIAL RULE — MATTE VINYL
Use a matte vinyl toy finish.
Surfaces should be:
- smooth
- clean
- softly reflective
- premium soft-matte
- simplified and polished
Avoid:
- realistic skin pores
- gritty surface noise
- cheap glossy plastic
- messy texture
Preserve the structure from Image 1.
Preserve the character identity from Image 2.`;

const PROMPT_MODULE_MATERIAL_SMOOTH_RESIN = `MATERIAL RULE — SMOOTH RESIN
Use a smooth resin collectible finish.
Surfaces should feel:
- solid
- refined
- premium
- cleanly sculpted
- subtly detailed
- suitable for a polished collectible figurine
Avoid noisy micro-texture.
Avoid cheap plastic appearance.
Avoid rough unfinished surfaces.
Preserve the structure from Image 1.
Preserve the character identity from Image 2.`;

const PROMPT_MODULE_MATERIAL_PAINTED_RESIN = `MATERIAL RULE — PAINTED COLLECTIBLE RESIN
Render the character as a painted collectible resin figure.
Use:
- clean painted-sculpt presentation
- refined material separation
- premium figurine finish
- display-quality treatment
- readable painted details
- polished collectible surface
Avoid messy weathering unless explicitly requested.
Avoid random grime, damage, or dirt.
Avoid cheap toy plastic.
Preserve the structure from Image 1.
Preserve the character identity from Image 2.`;


// Técnico — combinável.
const PROMPT_MODULE_TECHNICAL_PRINT_FRIENDLY = `TECHNICAL RULE — 3D PRINT FRIENDLY
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
Do not remove core character identity from Image 2.`;


// Regras globais anti-interferência — concatenadas no fim do modo manual.
// Lógica obrigatoriamente condicional, nunca fixa.
const PROMPT_GLOBAL_ANTI_INTERFERENCE = `GLOBAL ANTI-INTERFERENCE RULES
The following rules must remain conditional, never fixed.
Read what exists in Image 1 and respect it. Do not force anything that is not there.

Do not force:
- a seated pose
- a base or support surface
- full body
- visible feet
- hands resting on something
- visible legs
- a specific camera angle
- contact with a base
- any specific pose that may not exist in Image 1

Conditional logic to follow:
- If Image 1 is a bust, generate only a bust.
- If Image 1 is a half-body, generate only a half-body.
- If Image 1 is cropped, respect the crop.
- If Image 1 has no base, do not create a base.
- If Image 1 has a base or support, preserve the base or support logic.
- If Image 1 has no legs visible, do not invent legs.
- If Image 1 has no feet visible, do not invent feet.
- If Image 1 is standing, do not force a seated pose.
- If Image 1 is seated, preserve the seated pose.
- If Image 1 has visible hands, respect the hand position.
- If Image 1 has no visible hands, do not invent hands.`;


/* ============================================================
   [DEPRECATED] CASOS CONSOLIDADOS ANTIGOS — 3D CHARACTER FLOW
   ------------------------------------------------------------
   Mantidos APENAS como referência histórica.
   A nova estratégia é "prompt completo por caso" via
   PROMPTS_3D_CHARACTER_FLOW + resolve3DCharacterPromptId
   (definidos mais abaixo neste arquivo).

   NÃO chame estas constantes diretamente do pipeline. Quando os
   prompts definitivos ficarem prontos, o conteúdo deve ser colado
   no novo mapa PROMPTS_3D_CHARACTER_FLOW.
   ============================================================ */

// CASO 1 — accessoriesMode = "keep" + styleSource = "image1"
// Image 1 = estrutura + estilo. Image 2 = identidade + acessórios.
const PROMPT_3D_CASE_KEEP_IMAGE1 = `MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, or multiple views.

IMAGE ROLE LOGIC

IMAGE 1 = STRUCTURE AND STYLE SOURCE
Use Image 1 for:
- pose
- posture
- body visibility
- crop
- framing
- camera angle
- composition
- silhouette
- visible body proportions
- support logic
- presence or absence of base or support surface
- primary visual style language
Image 1 defines the structural logic of the final result.
Also use Image 1 as the main style source for:
- stylization level
- shape language
- material feel
- simplification level
- overall visual treatment
Do not use Image 1 as the identity source unless its identity is already meant to be preserved, which is not the case here.

IMAGE 2 = CHARACTER IDENTITY AND ACCESSORIES SOURCE
Use Image 2 for:
- character identity
- face and facial features
- hairstyle or hair absence
- facial hair or lack of facial hair
- expression
- outfit / costume / armor / clothing
- colors
- recognizable visual traits
- visible accessories and removable props
Use Image 2 as the appearance source only.
Do not use Image 2 to define pose, framing, crop, or composition.

CORE GOAL
Create a polished 3D character render that:
- follows the structural logic of Image 1
- follows the visual style language of Image 1
- preserves the character identity from Image 2
- preserves visible accessories from Image 2 when compatible with the pose

STRUCTURE RULES
- Match the visible pose and body logic of Image 1.
- Respect the visible crop from Image 1.
- If Image 1 shows only bust, generate only bust.
- If Image 1 shows half body, generate only half body.
- If Image 1 crops the body, respect the same crop.
- Do not invent missing anatomy.
- Do not force full body.
- Do not force feet, legs, hands, base, or props unless supported by Image 1.
- Do not force seated pose, standing pose, action pose, or display base unless supported by Image 1.

STYLE RULES
- Use Image 1 as the main visual style source.
- Transfer the aesthetic language of Image 1, including stylization level, material feel, shape simplification, and overall visual treatment.
- Do not transfer the identity of Image 1.

CHARACTER IDENTITY RULES
- Preserve the target character identity from Image 2.
- Preserve face, hair, outfit, colors, and recognizable character traits from Image 2.
- Do not merge identities between Image 1 and Image 2.
- The final result must clearly read as the character from Image 2.

ACCESSORIES RULE
- Preserve visible accessories, handheld props, weapons, shields, bags, tools, capes when clearly treated as accessories, and other external character items from Image 2 when they are compatible with the final pose and composition.
- Adapt them naturally to the pose from Image 1 without changing the structural logic.
- Do not remove accessories that are clearly part of the character identity.

DEFAULT PRESENTATION
- polished 3D render
- collectible-quality finish
- clean shapes
- readable silhouette
- clean lighting
- uncluttered presentation

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not force a pose that is not supported by Image 1
- do not invent missing body parts
- do not add random scenery or props
- do not crop unexpectedly
- do not create a base unless it is supported by Image 1`;


// CASO 2 — accessoriesMode = "remove" + styleSource = "image1"
// Image 1 = estrutura + estilo. Image 2 = identidade pura (sem acessórios externos).
const PROMPT_3D_CASE_REMOVE_IMAGE1 = `MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, or multiple views.

IMAGE ROLE LOGIC

IMAGE 1 = STRUCTURE AND STYLE SOURCE
Use Image 1 for:
- pose
- posture
- body visibility
- crop
- framing
- camera angle
- composition
- silhouette
- visible body proportions
- support logic
- presence or absence of base or support surface
- primary visual style language
Image 1 defines the structural logic of the final result.
Also use Image 1 as the main style source for:
- stylization level
- shape language
- material feel
- simplification level
- overall visual treatment
Do not use Image 1 as the identity source unless its identity is already meant to be preserved, which is not the case here.

IMAGE 2 = CHARACTER IDENTITY SOURCE ONLY
Use Image 2 for:
- character identity
- face and facial features
- hairstyle or hair absence
- facial hair or lack of facial hair
- expression
- outfit / costume / armor / clothing
- colors
- recognizable visual traits
- core body appearance
- essential clothing and identity-defining visual elements
Use Image 2 as the appearance and identity source only.
Do not use Image 2 to define pose, framing, crop, or composition.
Do not preserve non-essential accessories or detachable props from Image 2 in this case.

CORE GOAL
Create a polished 3D character render that:
- follows the structural logic of Image 1
- follows the visual style language of Image 1
- preserves the character identity from Image 2
- removes non-essential accessories and detachable props from Image 2

STRUCTURE RULES
- Match the visible pose and body logic of Image 1.
- Respect the visible crop from Image 1.
- If Image 1 shows only bust, generate only bust.
- If Image 1 shows half body, generate only half body.
- If Image 1 crops the body, respect the same crop.
- Do not invent missing anatomy.
- Do not force full body.
- Do not force feet, legs, hands, base, or props unless supported by Image 1.
- Do not force seated pose, standing pose, action pose, or display base unless supported by Image 1.

STYLE RULES
- Use Image 1 as the main visual style source.
- Transfer the aesthetic language of Image 1, including stylization level, material feel, shape simplification, and overall visual treatment.
- Do not transfer the identity of Image 1.

CHARACTER IDENTITY RULES
- Preserve the target character identity from Image 2.
- Preserve face, hair, outfit, colors, and recognizable character traits from Image 2.
- Preserve essential clothing and identity-defining outfit elements.
- Do not merge identities between Image 1 and Image 2.
- The final result must clearly read as the character from Image 2.

ACCESSORIES RULE
- Remove non-essential accessories and detachable props from the final result.
- Do not include handheld props, weapons, shields, bags, tools, or external removable items from Image 2.
- Preserve the core character identity, face, hair, outfit, body, colors, and essential clothing.
- Do not remove elements that are clearly part of the main outfit or core character identity.
- If an item is structurally required by Image 1, preserve only the structural logic from Image 1, not the identity or design of any accessory from Image 1.

DEFAULT PRESENTATION
- polished 3D render
- collectible-quality finish
- clean shapes
- readable silhouette
- clean lighting
- uncluttered presentation

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not use Image 1 as identity source
- do not preserve non-essential accessories from Image 2
- do not force a pose that is not supported by Image 1
- do not invent missing body parts
- do not add random scenery or props
- do not crop unexpectedly
- do not create a base unless it is supported by Image 1`;


// CASO 3 — accessoriesMode = "remove" + styleSource = "image2"
// Image 1 = estrutura. Image 2 = identidade + estilo (sem acessórios externos).
const PROMPT_3D_CASE_REMOVE_IMAGE2 = `MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
You will use TWO input images with different functions.

FINAL OUTPUT REQUIREMENT
Generate a SINGLE final image only.
Do not output text, labels, panels, or multiple views.

IMAGE ROLE LOGIC

IMAGE 1 = STRUCTURE SOURCE
Use Image 1 for:
- pose
- posture
- body visibility
- crop
- framing
- camera angle
- composition
- silhouette
- visible body proportions
- support logic
- presence or absence of base or support surface
Image 1 defines the structural logic of the final result.
Do not use Image 1 as the identity source.
Do not use Image 1 as the visual style source in this case.

IMAGE 2 = CHARACTER IDENTITY AND STYLE SOURCE
Use Image 2 for:
- character identity
- face and facial features
- hairstyle or hair absence
- facial hair or lack of facial hair
- expression
- outfit / costume / armor / clothing
- colors
- recognizable visual traits
- core body appearance
- essential clothing and identity-defining visual elements
- primary visual style language
Also use Image 2 as the main style source for:
- stylization level
- shape language
- material feel
- simplification level
- surface treatment
- overall visual treatment
Do not use Image 2 to define pose, framing, crop, or composition.
Do not preserve non-essential accessories or detachable props from Image 2 in this case.

CORE GOAL
Create a polished 3D character render that:
- follows the structural logic of Image 1
- preserves the character identity from Image 2
- follows the visual style language of Image 2
- removes non-essential accessories and detachable props from Image 2

STRUCTURE RULES
- Match the visible pose and body logic of Image 1.
- Respect the visible crop from Image 1.
- If Image 1 shows only bust, generate only bust.
- If Image 1 shows half body, generate only half body.
- If Image 1 crops the body, respect the same crop.
- Do not invent missing anatomy.
- Do not force full body.
- Do not force feet, legs, hands, base, or props unless supported by Image 1.
- Do not force seated pose, standing pose, action pose, or display base unless supported by Image 1.

STYLE RULES
- Use Image 2 as the main visual style source.
- Transfer the aesthetic language of Image 2, including stylization level, material feel, shape simplification, surface treatment, and overall visual treatment.
- Do not transfer pose, framing, or composition from Image 2.

CHARACTER IDENTITY RULES
- Preserve the target character identity from Image 2.
- Preserve face, hair, outfit, colors, and recognizable character traits from Image 2.
- Preserve essential clothing and identity-defining outfit elements.
- Do not merge identities between Image 1 and Image 2.
- The final result must clearly read as the character from Image 2.

ACCESSORIES RULE
- Remove non-essential accessories and detachable props from the final result.
- Do not include handheld props, weapons, shields, bags, tools, or external removable items from Image 2.
- Preserve the core character identity, face, hair, outfit, body, colors, and essential clothing.
- Do not remove elements that are clearly part of the main outfit or core character identity.
- If an item is structurally required by Image 1, preserve only the structural logic from Image 1, not the identity or design of any accessory from Image 1.

DEFAULT PRESENTATION
- polished 3D render
- collectible-quality finish
- clean shapes
- readable silhouette
- clean lighting
- uncluttered presentation

GLOBAL DO NOTS
- do not generate multiple views
- do not generate a turnaround sheet
- do not output text
- do not use Image 1 as identity source
- do not use Image 1 as visual style source in this case
- do not preserve non-essential accessories from Image 2
- do not force a pose that is not supported by Image 1
- do not invent missing body parts
- do not add random scenery or props
- do not crop unexpectedly
- do not create a base unless it is supported by Image 1`;


/* ============================================================
   [DEPRECATED] BUILDER DO MODO MANUAL — 3D CHARACTER FLOW
   ------------------------------------------------------------
   Mantido como referência. NÃO é mais chamado pelo
   build3DCharacterPrompt — a nova estratégia é "prompt completo
   por caso" via PROMPTS_3D_CHARACTER_FLOW + resolve3DCharacterPromptId.

   A montagem dinâmica por blocos pequenos (acessórios + estética +
   proporção + realismo + material + técnico) gerava resultados
   inconsistentes e difíceis de depurar. Foi substituída por prompts
   completos individuais por preset.

   Estes mapas e função foram preservados pra:
     - documentar a lógica de combinação histórica;
     - permitir reativação parcial caso necessário (não é o plano).
   ============================================================ */

const AESTHETIC_PROMPT_MAP = {
  'cute':                PROMPT_MODULE_AESTHETIC_CUTE,
  'toy':                 PROMPT_MODULE_AESTHETIC_TOY,
  'premium_collectible': PROMPT_MODULE_AESTHETIC_PREMIUM_COLLECTIBLE,
  'designer_toy':        PROMPT_MODULE_AESTHETIC_DESIGNER_TOY,
  'stylized_statue':     PROMPT_MODULE_AESTHETIC_STYLIZED_STATUE,
};

const PROPORTION_PROMPT_MAP = {
  'default': PROMPT_MODULE_PROPORTION_DEFAULT,
  'chibi':   PROMPT_MODULE_PROPORTION_CHIBI,
};

const REALISM_PROMPT_MAP = {
  'stylized':       PROMPT_MODULE_REALISM_STYLIZED,
  'semi_realistic': PROMPT_MODULE_REALISM_SEMI_REALISTIC,
  'realistic':      PROMPT_MODULE_REALISM_REALISTIC,
};

const MATERIAL_PROMPT_MAP = {
  'matte_vinyl':                PROMPT_MODULE_MATERIAL_MATTE_VINYL,
  'smooth_resin':               PROMPT_MODULE_MATERIAL_SMOOTH_RESIN,
  'painted_collectible_resin':  PROMPT_MODULE_MATERIAL_PAINTED_RESIN,
};

const TECHNICAL_PROMPT_MAP = {
  'print_friendly': PROMPT_MODULE_TECHNICAL_PRINT_FRIENDLY,
};

function build3DManualPromptBody(opcoes) {
  const o = opcoes || {};
  const partes = [
    PROMPT_3D_MANUAL_SHELL_BASE,
    PROMPT_MODULE_STYLE_SOURCE_MANUAL,
  ];

  // Acessórios (default keep)
  const accMode = o.accessoriesMode === 'remove' ? 'remove' : 'keep';
  partes.push(
    accMode === 'remove'
      ? PROMPT_MODULE_ACCESSORIES_REMOVE
      : PROMPT_MODULE_ACCESSORIES_KEEP
  );

  // Estética (multi)
  const aesthetics = Array.isArray(o.aestheticModifiers) ? o.aestheticModifiers : [];
  aesthetics.forEach(slug => {
    const bloco = AESTHETIC_PROMPT_MAP[slug];
    if (bloco) partes.push(bloco);
    else console.warn('[prompts] Estética desconhecida ignorada:', slug);
  });

  // Proporção (single)
  const proportion = PROPORTION_PROMPT_MAP[o.proportionPreset] || PROMPT_MODULE_PROPORTION_DEFAULT;
  partes.push(proportion);

  // Realismo (single)
  const realism = REALISM_PROMPT_MAP[o.realismLevel] || PROMPT_MODULE_REALISM_STYLIZED;
  partes.push(realism);

  // Material (single)
  const material = MATERIAL_PROMPT_MAP[o.materialFinish] || PROMPT_MODULE_MATERIAL_MATTE_VINYL;
  partes.push(material);

  // Técnico (multi)
  const tech = Array.isArray(o.technicalModifiers) ? o.technicalModifiers : [];
  tech.forEach(slug => {
    const bloco = TECHNICAL_PROMPT_MAP[slug];
    if (bloco) partes.push(bloco);
    else console.warn('[prompts] Técnico desconhecido ignorado:', slug);
  });

  // Anti-interferência sempre por último (antes do USER block).
  partes.push(PROMPT_GLOBAL_ANTI_INTERFERENCE);

  return partes.join('\n\n');
}


/* ============================================================
   ESTRATÉGIA ATIVA — PROMPT COMPLETO POR CASO
   ------------------------------------------------------------
   A interface define um "caso" (combinação dos eixos). Cada caso
   aponta para UM prompt completo, identificado por promptId.
   Os prompts completos serão fornecidos depois — por enquanto,
   tudo é placeholder claro e o app não quebra.

   Casos com estilo da imagem:
     - THREED_KEEP_ACCESSORIES_STYLE_IMAGE1
     - THREED_REMOVE_ACCESSORIES_STYLE_IMAGE1
     - THREED_KEEP_ACCESSORIES_STYLE_IMAGE2
     - THREED_REMOVE_ACCESSORIES_STYLE_IMAGE2

   Casos com "Escolher estilo" (preset principal, não montado por
   bloquinhos pequenos):
     - THREED_MANUAL_CUTE_TOY_PREMIUM_MATTE_PRINT_KEEP_ACCESSORIES
     - THREED_MANUAL_CUTE_TOY_PREMIUM_MATTE_PRINT_REMOVE_ACCESSORIES
     - THREED_MANUAL_CHIBI_CUTE_TOY_MATTE_KEEP_ACCESSORIES
     - THREED_MANUAL_CHIBI_CUTE_TOY_MATTE_REMOVE_ACCESSORIES
     - THREED_MANUAL_SEMIREALISTIC_STATUE_RESIN_KEEP_ACCESSORIES
     - THREED_MANUAL_SEMIREALISTIC_STATUE_RESIN_REMOVE_ACCESSORIES
     - THREED_MANUAL_REALISTIC_PAINTED_RESIN_KEEP_ACCESSORIES
     - THREED_MANUAL_REALISTIC_PAINTED_RESIN_REMOVE_ACCESSORIES

   Documento de referência: docs/PROMPTS_3D_CHARACTER_FLOW.md
   ============================================================ */

const PROMPTS_3D_CHARACTER_FLOW = {
  // --- Casos com estilo da imagem ---
  THREED_KEEP_ACCESSORIES_STYLE_IMAGE1: `MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
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
- do not confuse props with clothing, armor, anatomy, or identity-defining traits`,
  THREED_REMOVE_ACCESSORIES_STYLE_IMAGE1: `MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
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
- do not confuse props with clothing, armor, anatomy, or identity-defining traits`,
  THREED_KEEP_ACCESSORIES_STYLE_IMAGE2: `MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
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
- do not confuse props with clothing, armor, anatomy, or identity-defining traits`,
  THREED_REMOVE_ACCESSORIES_STYLE_IMAGE2: `MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
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
- do not confuse props with clothing, armor, anatomy, or identity-defining traits`,

  // --- Casos manuais (preset principal) ---
  THREED_MANUAL_CUTE_TOY_PREMIUM_MATTE_PRINT_KEEP_ACCESSORIES: `MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
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
- do not create cheap glossy plastic`,
  THREED_MANUAL_CUTE_TOY_PREMIUM_MATTE_PRINT_REMOVE_ACCESSORIES: `MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
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
- do not create cheap glossy plastic`,
  THREED_MANUAL_CHIBI_CUTE_TOY_MATTE_KEEP_ACCESSORIES: `MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
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
- do not create cheap glossy plastic`,
  THREED_MANUAL_CHIBI_CUTE_TOY_MATTE_REMOVE_ACCESSORIES: `MULTI-IMAGE INSTRUCTION — 3D CHARACTER FLOW
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
- do not create cheap glossy plastic`,
  THREED_MANUAL_SEMIREALISTIC_STATUE_RESIN_KEEP_ACCESSORIES:      PLACEHOLDER,
  THREED_MANUAL_SEMIREALISTIC_STATUE_RESIN_REMOVE_ACCESSORIES:    PLACEHOLDER,
  THREED_MANUAL_REALISTIC_PAINTED_RESIN_KEEP_ACCESSORIES:         PLACEHOLDER,
  THREED_MANUAL_REALISTIC_PAINTED_RESIN_REMOVE_ACCESSORIES:       PLACEHOLDER,
};


/**
 * Resolve qual promptId corresponde ao state atual da UI do 3D Flow.
 *
 * Regras:
 * - styleSource = image1 → THREED_(KEEP|REMOVE)_ACCESSORIES_STYLE_IMAGE1
 * - styleSource = image2 → THREED_(KEEP|REMOVE)_ACCESSORIES_STYLE_IMAGE2
 * - styleSource = manual → tenta casar com um dos presets principais.
 *   Se nada bater, retorna null e build3DCharacterPrompt mostra
 *   placeholder genérico + warning no console (não quebra o app).
 *
 * Os 8 presets manuais são identificados por uma heurística sobre
 * realismo + material + estética + proporção + técnico. A heurística
 * é intencionalmente generosa: enquanto os prompts definitivos
 * estiverem como placeholder, o match exato não muda o resultado
 * visual (todos retornam o mesmo placeholder).
 *
 * @param {Object} options state do appState.threeDFlowOptions
 * @returns {string|null} promptId ou null se nenhum match.
 */
function resolve3DCharacterPromptId(options) {
  const o = options || {};
  const accSuffix = o.accessoriesMode === 'remove' ? 'REMOVE' : 'KEEP';

  if (o.styleSource === 'image1') {
    return `THREED_${accSuffix}_ACCESSORIES_STYLE_IMAGE1`;
  }
  if (o.styleSource === 'image2') {
    return `THREED_${accSuffix}_ACCESSORIES_STYLE_IMAGE2`;
  }
  if (o.styleSource !== 'manual') return null;

  // styleSource = manual — heurística por preset.
  const aest      = new Set(Array.isArray(o.aestheticModifiers) ? o.aestheticModifiers : []);
  const tech      = new Set(Array.isArray(o.technicalModifiers) ? o.technicalModifiers : []);
  const proportion = o.proportionPreset || 'default';
  const realism    = o.realismLevel    || 'stylized';
  const material   = o.materialFinish  || 'matte_vinyl';

  // Preset 1: REALISTIC + PAINTED RESIN.
  if (realism === 'realistic' && material === 'painted_collectible_resin') {
    return `THREED_MANUAL_REALISTIC_PAINTED_RESIN_${accSuffix}_ACCESSORIES`;
  }

  // Preset 2: SEMI-REALISTIC + STYLIZED STATUE + RESIN (smooth ou painted).
  if (realism === 'semi_realistic'
      && aest.has('stylized_statue')
      && (material === 'smooth_resin' || material === 'painted_collectible_resin')) {
    return `THREED_MANUAL_SEMIREALISTIC_STATUE_RESIN_${accSuffix}_ACCESSORIES`;
  }

  // Preset 3: CHIBI + CUTE + TOY + MATTE.
  if (proportion === 'chibi'
      && aest.has('cute') && aest.has('toy')
      && material === 'matte_vinyl') {
    return `THREED_MANUAL_CHIBI_CUTE_TOY_MATTE_${accSuffix}_ACCESSORIES`;
  }

  // Preset 4: CUTE + TOY + PREMIUM + MATTE + PRINT FRIENDLY.
  if (aest.has('cute') && aest.has('toy') && aest.has('premium_collectible')
      && material === 'matte_vinyl'
      && tech.has('print_friendly')) {
    return `THREED_MANUAL_CUTE_TOY_PREMIUM_MATTE_PRINT_${accSuffix}_ACCESSORIES`;
  }

  // Sem match exato — sinaliza pro builder usar placeholder genérico.
  return null;
}


/**
 * Builder do prompt do 3D CHARACTER FLOW (estratégia ativa).
 *
 * Resolve um promptId a partir das opções da UI e devolve o prompt
 * completo correspondente, anexando "USER ADDITIONAL INSTRUCTIONS"
 * se houver bloco extra. Enquanto os prompts definitivos não forem
 * preenchidos, devolve o placeholder e loga warning.
 */
function build3DCharacterPrompt(opcoes, blocoExtra) {
  const o = opcoes || {};
  const promptId = resolve3DCharacterPromptId(o);

  let body;
  if (promptId && Object.prototype.hasOwnProperty.call(PROMPTS_3D_CHARACTER_FLOW, promptId)) {
    body = PROMPTS_3D_CHARACTER_FLOW[promptId];
    if (!body || body === PLACEHOLDER) {
      console.warn(
        '[prompts] Prompt definitivo ainda nao preenchido para %s. Usando placeholder.',
        promptId
      );
      body = `[AGUARDANDO PROMPT DEFINITIVO — ${promptId}]`;
    }
  } else {
    console.warn(
      '[prompts] Combinacao manual sem preset correspondente. ' +
      'state: accessoriesMode=%s, styleSource=%s, proportion=%s, realism=%s, material=%s, aesthetic=%o, technical=%o',
      o.accessoriesMode, o.styleSource, o.proportionPreset, o.realismLevel, o.materialFinish,
      o.aestheticModifiers, o.technicalModifiers
    );
    body = '[AGUARDANDO PROMPT DEFINITIVO — combinação manual sem preset correspondente]';
  }

  const extra = (blocoExtra || '').trim();
  if (extra) {
    body += `\n\nUSER ADDITIONAL INSTRUCTIONS\n${extra}`;
  }
  return body;
}


// Disponibilizar globalmente
window.PROMPT_FLUXO1_BASE = PROMPT_FLUXO1_BASE;
window.PROMPT_FLUXO2_DEFAULT = PROMPT_FLUXO2_DEFAULT;
window.PROMPT_FLUXO3_BASE = PROMPT_FLUXO3_BASE;
window.PROMPT_3D_CHARACTER_BASE = PROMPT_3D_CHARACTER_BASE;
window.PROMPT_2D_CHARACTER_BASE = PROMPT_2D_CHARACTER_BASE;
window.PROMPT_POSE_TRANSFER_BASE = PROMPT_POSE_TRANSFER_BASE;
window.PROMPT_MODULE_ACCESSORIES_KEEP = PROMPT_MODULE_ACCESSORIES_KEEP;
window.PROMPT_MODULE_ACCESSORIES_REMOVE = PROMPT_MODULE_ACCESSORIES_REMOVE;
window.PROMPT_MODULE_STYLE_IMAGE_1 = PROMPT_MODULE_STYLE_IMAGE_1;
window.PROMPT_MODULE_STYLE_IMAGE_2 = PROMPT_MODULE_STYLE_IMAGE_2;
window.PROMPT_MODULE_AESTHETIC_CUTE = PROMPT_MODULE_AESTHETIC_CUTE;
window.PROMPT_MODULE_AESTHETIC_TOY = PROMPT_MODULE_AESTHETIC_TOY;
window.PROMPT_MODULE_AESTHETIC_PREMIUM_COLLECTIBLE = PROMPT_MODULE_AESTHETIC_PREMIUM_COLLECTIBLE;
window.PROMPT_MODULE_AESTHETIC_DESIGNER_TOY = PROMPT_MODULE_AESTHETIC_DESIGNER_TOY;
window.PROMPT_MODULE_AESTHETIC_STYLIZED_STATUE = PROMPT_MODULE_AESTHETIC_STYLIZED_STATUE;
window.PROMPT_MODULE_PROPORTION_DEFAULT = PROMPT_MODULE_PROPORTION_DEFAULT;
window.PROMPT_MODULE_PROPORTION_CHIBI = PROMPT_MODULE_PROPORTION_CHIBI;
window.PROMPT_MODULE_REALISM_STYLIZED = PROMPT_MODULE_REALISM_STYLIZED;
window.PROMPT_MODULE_REALISM_SEMI_REALISTIC = PROMPT_MODULE_REALISM_SEMI_REALISTIC;
window.PROMPT_MODULE_REALISM_REALISTIC = PROMPT_MODULE_REALISM_REALISTIC;
window.PROMPT_MODULE_MATERIAL_MATTE_VINYL = PROMPT_MODULE_MATERIAL_MATTE_VINYL;
window.PROMPT_MODULE_MATERIAL_SMOOTH_RESIN = PROMPT_MODULE_MATERIAL_SMOOTH_RESIN;
window.PROMPT_MODULE_MATERIAL_PAINTED_RESIN = PROMPT_MODULE_MATERIAL_PAINTED_RESIN;
window.PROMPT_MODULE_TECHNICAL_PRINT_FRIENDLY = PROMPT_MODULE_TECHNICAL_PRINT_FRIENDLY;
window.PROMPT_GLOBAL_ANTI_INTERFERENCE = PROMPT_GLOBAL_ANTI_INTERFERENCE;
window.PROMPT_3D_CASE_KEEP_IMAGE1 = PROMPT_3D_CASE_KEEP_IMAGE1;
window.PROMPT_3D_CASE_REMOVE_IMAGE1 = PROMPT_3D_CASE_REMOVE_IMAGE1;
window.PROMPT_3D_CASE_REMOVE_IMAGE2 = PROMPT_3D_CASE_REMOVE_IMAGE2;
window.PROMPT_3D_MANUAL_SHELL_BASE = PROMPT_3D_MANUAL_SHELL_BASE;
window.PROMPT_MODULE_STYLE_SOURCE_MANUAL = PROMPT_MODULE_STYLE_SOURCE_MANUAL;
window.build3DCharacterPrompt = build3DCharacterPrompt;
window.build3DManualPromptBody = build3DManualPromptBody; // [DEPRECATED]
window.PROMPTS_3D_CHARACTER_FLOW = PROMPTS_3D_CHARACTER_FLOW;
window.resolve3DCharacterPromptId = resolve3DCharacterPromptId;
