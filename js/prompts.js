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

const PROMPT_3D_CHARACTER_BASE = PLACEHOLDER;
const PROMPT_2D_CHARACTER_BASE = PLACEHOLDER;
const PROMPT_POSE_TRANSFER_BASE = PLACEHOLDER;

const PROMPT_MODULE_ACCESSORIES_KEEP = PLACEHOLDER;
const PROMPT_MODULE_ACCESSORIES_REMOVE = PLACEHOLDER;

const PROMPT_MODULE_STYLE_IMAGE_1 = PLACEHOLDER;
const PROMPT_MODULE_STYLE_IMAGE_2 = PLACEHOLDER;

const PROMPT_MODULE_AESTHETIC_CUTE = PLACEHOLDER;
const PROMPT_MODULE_AESTHETIC_TOY = PLACEHOLDER;
const PROMPT_MODULE_AESTHETIC_PREMIUM_COLLECTIBLE = PLACEHOLDER;
const PROMPT_MODULE_AESTHETIC_DESIGNER_TOY = PLACEHOLDER;
const PROMPT_MODULE_AESTHETIC_STYLIZED_STATUE = PLACEHOLDER;

const PROMPT_MODULE_PROPORTION_DEFAULT = PLACEHOLDER;
const PROMPT_MODULE_PROPORTION_CHIBI = PLACEHOLDER;

const PROMPT_MODULE_REALISM_STYLIZED = PLACEHOLDER;
const PROMPT_MODULE_REALISM_SEMI_REALISTIC = PLACEHOLDER;
const PROMPT_MODULE_REALISM_REALISTIC = PLACEHOLDER;

const PROMPT_MODULE_MATERIAL_MATTE_VINYL = PLACEHOLDER;
const PROMPT_MODULE_MATERIAL_SMOOTH_RESIN = PLACEHOLDER;
const PROMPT_MODULE_MATERIAL_PAINTED_RESIN = PLACEHOLDER;

const PROMPT_MODULE_TECHNICAL_PRINT_FRIENDLY = PLACEHOLDER;

const PROMPT_GLOBAL_ANTI_INTERFERENCE = PLACEHOLDER;


/* ============================================================
   CASOS CONSOLIDADOS — 3D CHARACTER FLOW
   ------------------------------------------------------------
   Cada "caso" é uma combinação concreta de state modular que
   já tem prompt aprovado. Demais combinações continuam usando
   placeholders (e podem ser registradas conforme forem definidas).
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


/**
 * Builder do prompt do 3D CHARACTER FLOW.
 * Lida apenas com o primeiro caso consolidado por enquanto.
 */
function build3DCharacterPrompt(opcoes, blocoExtra) {
  const o = opcoes || {};
  // Lookup table dos casos consolidados.
  // Chave: `${accessoriesMode}__${styleSource}`.
  const cases = {
    'keep__image1':   PROMPT_3D_CASE_KEEP_IMAGE1,
    'remove__image1': PROMPT_3D_CASE_REMOVE_IMAGE1,
    'remove__image2': PROMPT_3D_CASE_REMOVE_IMAGE2,
  };
  const key = `${o.accessoriesMode}__${o.styleSource}`;

  let body = cases[key];
  if (!body) {
    console.warn(
      '[prompts] Combinacao ainda nao consolidada: accessoriesMode=%s, styleSource=%s. Usando placeholder.',
      o.accessoriesMode, o.styleSource
    );
    body = `[AGUARDANDO PROMPT DEFINITIVO PARA: accessoriesMode=${o.accessoriesMode}, styleSource=${o.styleSource}]`;
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
window.build3DCharacterPrompt = build3DCharacterPrompt;
