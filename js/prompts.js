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
