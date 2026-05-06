# Handoff — Resumo (lê este primeiro)

> Atualizado em: 06/05/2026
> Para detalhes completos: [`HANDOFF.md`](./HANDOFF.md)

## Estado atual

MVP completo, deployado, rodando em mock. **UI redesenhada (06/05)**: nova landing com dois fluxos, tema dark/premium com glow roxo/lilás/magenta, background reativo ao mouse. Falta popular dados reais e integrar Tripo.

- **App**: https://stlai-asset-generator.vercel.app
- **Repo**: https://github.com/tiagotsuisilva/stlai-asset-generator
- **Local**: `C:\Users\tiago\Downloads\stlai-asset-generator\stlai-asset-generator`
- **Demo Day**: 08/05/2026

## Última mudança — Reestruturação visual + efeito água-viva (06/05/2026)

- App agora abre numa **landing page** dark/minimalista com dois cards principais:
  - **3D CHARACTER FLOW** → tela com upload + bloco extra + botões Biblioteca A/B
  - **2D CHARACTER FLOW** → tela com prompt textual + botão Biblioteca A
- Telas: `screen-home` (landing), `screen-flow-3d`, `screen-flow-2d` + restante intacto.
- CSS reescrito: tokens novos (dark, glows roxo/lilás/magenta), botões arredondados, cards com vidro fosco (backdrop-filter).
- **Novo efeito de background "água-viva"** (substitui o spotlight simples):
  - Goo/metaball via SVG (`feGaussianBlur` + `feColorMatrix` threshold).
  - Trail de 12 blobs com easing decrescente — mouse parado vira bola pulsante; rápido forma cauda alongada.
  - Cor reage à velocidade: violeta → magenta → coral.
  - Implementado em `js/bg.js` (separado do `ui.js` por causa de limite de tamanho do disco).
  - Desligado em mobile (<880px) e em `prefers-reduced-motion`.
- Funcionalidade dos fluxos preservada (mesmos IDs, mesmas chamadas a `iniciarFluxo`).
- Botão "Voltar" das telas internas (biblioteca/preview/result) volta pra flow screen ativa, não pra landing — preserva contexto.

## Arquivos novos / alterados

- `index.html` — landing + screen-flow-3d + screen-flow-2d; inclui `js/bg.js`.
- `css/style.css` — reescrito (tokens dark, landing, flow-screens, goo-bg).
- `js/ui.js` — navegação landing/flows, back-home volta pra flow screen.
- `js/bg.js` (novo) — efeito goo trail interativo.

## Pendências críticas (bloqueantes pro Demo Day)

1. Renomear 7 .jpg da Biblioteca A pros IDs corretos (lista no `HANDOFF.md`).
2. Colar prompt completo do Fluxo 1 em `js/prompts.js` (placeholders `[COLAR AQUI: ...]`).
3. Validar nome do modelo OpenAI (`gpt-image-2` vs `gpt-image-1`).
4. Substituir stub `callTripoAPI()` pela integração real da STLFLIX.

## Pendências secundárias

5. Popular Biblioteca B (11 imagens).
6. Definir prompt do Fluxo 3.
7. Smoke test final na URL pública (especialmente da nova landing/dark UI).
8. Eventual refinamento das telas internas (biblioteca/preview/tripo) seguindo o novo visual — hoje já herdam tokens dark, mas podem ganhar polish.

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

> Cola este bloco INTEIRO no Claude Cowork sempre que abrir uma sessão nova. Ele já dá o caminho da pasta, manda o Claude pedir acesso e ler os arquivos certos.

```
Estou continuando o projeto STLAI Asset Generator.

Pasta local do projeto:
C:\Users\tiago\Downloads\stlai-asset-generator\stlai-asset-generator

Por favor:
1. Pede acesso a essa pasta (use a ferramenta request_cowork_directory com esse caminho exato).
2. Depois que a pasta estiver conectada, lê o `CLAUDE.md` na raiz dela.
3. Lê também `docs/HANDOFF_RESUMO.md`.
4. Só lê outros arquivos (HANDOFF.md, PRD, código) se a tarefa pedir contexto profundo — não leia "por garantia".
5. Me diz em 2-3 linhas onde estamos e qual é a próxima tarefa lógica.
```

Pra tarefas específicas vindas do ChatGPT, use o prompt do **CHECKPOINT** entregue por ele em vez deste — esse é só pro caso de "abertura sem agenda".
