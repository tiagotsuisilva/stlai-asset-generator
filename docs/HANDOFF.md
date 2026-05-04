# Handoff — Estado atual do projeto (versão completa)

> Atualizado em: 30/04/2026 (fim da sessão de deploy)
> **Para retomar uma sessão rápido, lê primeiro [`HANDOFF_RESUMO.md`](./HANDOFF_RESUMO.md)** — este aqui é a versão longa, lida só quando precisar de contexto profundo.
>
> Fluxo de trabalho:
> - **Planejamento**: ChatGPT — ver [`CHATGPT_INSTRUCTIONS.md`](./CHATGPT_INSTRUCTIONS.md).
> - **Execução**: Claude Cowork — instruções permanentes em [`../CLAUDE.md`](../CLAUDE.md).

---

## ✅ O que está pronto

- **Código completo do MVP** (HTML/CSS/JS vanilla) na pasta `stlai-asset-generator/`.
- **6 telas funcionais**: Home, Biblioteca, Preview Fluxo 1, Tripo Config, Loading, Result.
- **Settings modal** com salvamento de API keys no `localStorage`.
- **Modo Mock automático** quando não há key OpenAI (canvas placeholders + SVG mock + .glb stub).
- **Repo no GitHub**: `https://github.com/tiagotsuisilva/stlai-asset-generator`
- **Deploy na Vercel**: `https://stlai-asset-generator.vercel.app`
- **Auto-deploy** ativado (cada `git push` na branch `main` redeploya em ~30s).
- **PRD v1.1** em `docs/PRD_STLAI_Asset_Generator.md` (e `.docx`).
- **Guia para continuar em outra máquina** em `docs/GUIA_CONTINUAR_EM_CASA.md`.

---

## ⏳ O que está pendente

1. **Imagens da Biblioteca A** — Tiago colou 7 arquivos `.jpg` com nomes "Generated Image April...". Os JSONs já foram ajustados de `.png` para `.jpg`, mas os arquivos precisam ser renomeados para os IDs esperados:
   - `drago_lava.jpg` (Dragão de Fogo)
   - `husky.jpg`
   - `gato_malhado.jpg`
   - `mulher_asiatica_mechas_verdes.jpg`
   - `mulher_castanha_piercing.jpg`
   - `homem_careca_barba_ruiva.jpg`
   - `homem_cabelo_curto_barba.jpg`

   Após renomear: `git add . && git commit -m "..." && git push`.

2. **Prompt completo do Fluxo 1** — `js/prompts.js` ainda tem placeholders `[COLAR AQUI: ...]` em várias seções. Só a lista IMAGE 1 BLUEPRINT está preenchida. As alterações combinadas já estão aplicadas (linha "do not drift toward proportions different from Image 1" + bloco USER ADDITIONAL INSTRUCTIONS com `{bloco_extra_do_usuario}`).

3. **Imagens da Biblioteca B** — pasta vazia, faltam 11 imagens.

4. **Prompt do Fluxo 3** — `PROMPT_FLUXO3_BASE` é placeholder ("[A DEFINIR]"). Mesma estrutura de 2 imagens do Fluxo 1.

5. **Tripo API real** — função `callTripoAPI()` em `js/api.js` é stub que joga erro. Substituir pela integração real do MVP existente da STLFLIX.

6. **Validar nome do modelo OpenAI** — atualmente `gpt-image-2` no Settings. Confirmar com a doc atual da OpenAI; pode ser `gpt-image-1` ou outro.

7. **Smoke test final na URL pública**:
   - Bibliotecas carregam: ✅ (a confirmar com imagens reais).
   - Settings abre/salva: ✅ (não testado em produção ainda).

---

## 📁 Arquivos-chave

| Arquivo | O que faz |
|---|---|
| `index.html` | Single-page com todas as telas |
| `css/style.css` | Estilo completo |
| `js/config.js` | Carrega/salva config do localStorage + `isMockMode()` |
| `js/prompts.js` | Constantes dos prompts (FLUXO1_BASE, FLUXO2_DEFAULT, FLUXO3_BASE) |
| `js/api.js` | OpenAI + Tripo (stub) + ImageTracer SVG + Mock generators |
| `js/ui.js` | State machine + render de todas as telas |
| `bibliotecaA/bibliotecaA.json` | 7 personagens (extensão `.jpg` após ajuste) |
| `bibliotecaB/bibliotecaB.json` | 11 frases ilustradas (extensão `.jpg` após ajuste) |

---

## 🚀 Como rodar localmente

```
cd C:\Users\tiago\Downloads\stlai-asset-generator\stlai-asset-generator
npx serve
```

Abre `http://localhost:3000` no navegador.

Pra mudanças aparecerem na URL pública: `git add . && git commit -m "..." && git push`.

---

## 💬 Prompt para abrir nova conversa no Cowork

Cola o bloco abaixo (entre as linhas tracejadas) **inteiro** numa conversa nova:

---

> Estou continuando o desenvolvimento do **STLAI Asset Generator** — MVP que já está deployado e rodando.
>
> Contexto rápido:
> - **App ao vivo**: https://stlai-asset-generator.vercel.app
> - **Repo GitHub**: https://github.com/tiagotsuisilva/stlai-asset-generator
> - **Pasta local**: `C:\Users\tiago\Downloads\stlai-asset-generator\stlai-asset-generator`
>
> Antes de qualquer coisa, lê estes 3 arquivos pra pegar contexto completo:
> 1. `C:\Users\tiago\Downloads\stlai-asset-generator\stlai-asset-generator\docs\HANDOFF.md` — estado atual e pendências
> 2. `C:\Users\tiago\Downloads\stlai-asset-generator\stlai-asset-generator\docs\PRD_STLAI_Asset_Generator.md` — PRD v1.1 completo
> 3. `C:\Users\tiago\Downloads\stlai-asset-generator\stlai-asset-generator\README.md` — instruções de uso
>
> Confirma quando tiver lido e me diz por onde começamos.

---

Pronto. Cola, ele lê os 3 arquivos, e estamos no mesmo ponto da conversa anterior.
