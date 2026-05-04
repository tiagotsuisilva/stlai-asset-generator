# Handoff — Resumo (lê este primeiro)

> Atualizado em: 04/05/2026
> Para detalhes completos: [`HANDOFF.md`](./HANDOFF.md)

## Estado atual

MVP completo, deployado, rodando em mock. Falta popular dados reais e integrar Tripo.

- **App**: https://stlai-asset-generator.vercel.app
- **Repo**: https://github.com/tiagotsuisilva/stlai-asset-generator
- **Local**: `C:\Users\tiago\Downloads\stlai-asset-generator\stlai-asset-generator`
- **Demo Day**: 08/05/2026

## Pendências críticas (bloqueantes pro Demo Day)

1. Renomear 7 .jpg da Biblioteca A pros IDs corretos (lista no `HANDOFF.md`).
2. Colar prompt completo do Fluxo 1 em `js/prompts.js` (placeholders `[COLAR AQUI: ...]`).
3. Validar nome do modelo OpenAI (`gpt-image-2` vs `gpt-image-1`).
4. Substituir stub `callTripoAPI()` pela integração real da STLFLIX.

## Pendências secundárias

5. Popular Biblioteca B (11 imagens).
6. Definir prompt do Fluxo 3.
7. Smoke test final na URL pública.

## Como rodar local

```powershell
cd C:\Users\tiago\Downloads\stlai-asset-generator\stlai-asset-generator
npx serve
```

## Fluxo de trabalho

- **Planejamento e revisão**: ChatGPT (ver [`CHATGPT_INSTRUCTIONS.md`](./CHATGPT_INSTRUCTIONS.md)).
- **Execução com arquivos / commits**: Claude Cowork (ver [`../CLAUDE.md`](../CLAUDE.md)).
- **Memória entre sessões**: este arquivo + `HANDOFF.md`.
