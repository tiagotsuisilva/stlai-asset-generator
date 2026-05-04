# Guia: Como continuar o projeto em casa

> Este guia foi gerado no fim da sessão de deploy (30/04/2026) pra te orientar a retomar o projeto na máquina de casa.

---

## Resumo do que está pronto

- **App rodando localmente** no PC do trabalho via `npx serve` (em `http://localhost:3000`).
- **Código subido no GitHub**: `https://github.com/tiagotsuisilva/stlai-asset-generator`
- **App deployado na Vercel**: `https://stlai-asset-generator.vercel.app`
- **PRD na pasta `docs/`** do projeto (este arquivo de guia também).

A cada `git push`, a Vercel faz redeploy automático em ~30 segundos.

---

## Setup na máquina de casa (uma vez só)

### 1. Verificar o que já está instalado

Abre PowerShell em casa e roda:

```
git --version
node --version
```

Se ambos retornarem versão (ex: `git version 2.x` e `v20.x.x` ou similar), pula pro passo 2.

Se algum disser "não reconhecido como comando":

- **Git ausente**: baixa em `https://git-scm.com/download/win`. No instalador, vai dando Next em tudo (no passo "Adjusting your PATH" mantém a opção do meio).
- **Node ausente**: baixa LTS em `https://nodejs.org`. No instalador, vai dando Next em tudo. Pode pular a opção "necessary tools / Visual Studio Build Tools" (deixa desmarcada).

### 2. Clonar o projeto

Abre PowerShell e:

```
cd C:\Users\TEU_USUARIO\Desktop
git clone https://github.com/tiagotsuisilva/stlai-asset-generator.git
cd stlai-asset-generator
```

Substitui `TEU_USUARIO` pelo nome de usuário do Windows da máquina de casa.

Isso baixa a versão mais atualizada do projeto direto do GitHub.

### 3. Configurar Git localmente

```
git config --global user.name "Tiago Silva"
git config --global user.email "tiago.tsui.silva@gmail.com"
```

(Use o mesmo email da conta GitHub.)

### 4. Rodar o servidor local (opcional)

Dentro da pasta do projeto:

```
npx serve
```

Abre o navegador em `http://localhost:3000`.

> **Atenção**: na primeira vez que rodar `npx`, pode aparecer erro de "execução de scripts desabilitada". Resolução:
>
> ```
> Set-ExecutionPolicy -Scope CurrentUser -ExecutionPolicy RemoteSigned
> ```
>
> Confirma com `S` e roda `npx serve` de novo.

**Alternativa rápida**: pra testes simples, abre direto a URL pública: `https://stlai-asset-generator.vercel.app`. Não precisa rodar nada local.

---

## Onde achar o PRD em casa

Três caminhos, escolhe o mais conveniente:

### a) Direto no GitHub (sem instalar nada)

`https://github.com/tiagotsuisilva/stlai-asset-generator/blob/main/docs/PRD_STLAI_Asset_Generator.md`

Renderiza bonitinho, formatado como Markdown. Pode ler no navegador, no celular, em qualquer lugar com internet.

### b) Localmente após clonar

`Desktop/stlai-asset-generator/docs/PRD_STLAI_Asset_Generator.md` — abrir em editor de texto (Notepad, VS Code).

`Desktop/stlai-asset-generator/docs/PRD_STLAI_Asset_Generator.docx` — abrir no Word.

### c) Versão Word baixada por outros meios

Se já mandou o `.docx` pra você mesmo via Google Drive/email no PC do trabalho, vai estar lá também.

---

## Continuar a conversa com o Claude em casa

A conversa específica que tivemos no Cowork **fica salva apenas no PC do trabalho** — Cowork não sincroniza entre máquinas.

Mas isso não é problema. Em casa, abre o Cowork e cola este prompt:

> Estou continuando o projeto STLAI Asset Generator. Lê o PRD em `Desktop/stlai-asset-generator/docs/PRD_STLAI_Asset_Generator.md` e o README em `Desktop/stlai-asset-generator/README.md` pra pegar contexto. Já tenho o app deployado em `https://stlai-asset-generator.vercel.app` e o repo no GitHub `https://github.com/tiagotsuisilva/stlai-asset-generator`.

Eu (a versão de casa) vou ler os dois arquivos, pegar contexto em 1 minuto, e continuamos do mesmo ponto.

---

## Próximas tarefas que esperam você

1. **Renomear imagens da Biblioteca A** localmente (PNG/JPG corretos com os nomes que estão no `bibliotecaA.json`). Depois `git add . && git commit -m "Imagens biblioteca A" && git push`. Vercel re-deploya automaticamente em ~30s.

2. **Colar o prompt completo do Fluxo 1** no `js/prompts.js` (substituir os marcadores `[COLAR AQUI: ...]` pelo conteúdo real). Pode pedir ajuda pro Claude — só me cola o prompt e eu atualizo o arquivo.

3. **Configurar API keys** no Settings da URL pública e fazer primeiros testes reais com OpenAI (sugiro começar pelo Fluxo 2, que tá mais pronto).

4. **Definir prompt do Fluxo 3** — segue mesma estrutura de duas imagens do Fluxo 1.

5. **Adicionar 11 imagens da Biblioteca B** com nomes que batem com o `bibliotecaB.json`.

6. **Substituir o stub `callTripoAPI()`** pela integração real do MVP existente da STLFLIX.

---

## Cheat sheet de comandos Git

Pra qualquer mudança que você fizer, o ciclo é sempre o mesmo:

```
git add .
git commit -m "Descrição curta da mudança"
git push
```

Pra puxar mudanças que o Claude (ou você de outra máquina) fizer:

```
git pull
```

**Sempre faz `git pull` antes de começar a editar** se você usa duas máquinas — pra não trabalhar em cima de versão velha.

---

## Workflow recomendado entre as duas máquinas

**No PC do trabalho:**

1. `git pull` (puxa mudanças que possam ter sido feitas em casa).
2. Trabalha no projeto.
3. `git add . && git commit -m "..." && git push`.

**No PC de casa:**

1. `git pull` (puxa mudanças que foram feitas no trabalho).
2. Trabalha no projeto.
3. `git add . && git commit -m "..." && git push`.

Se em algum momento der erro de conflito (`merge conflict`), me avisa que eu te ajudo — não é catastrófico, só requer um passo extra.

---

## Se algo der errado

- **`git push` pede senha**: o Git Credential Manager deve abrir uma janela do navegador pra autenticar com GitHub. Se não abrir, me avisa.
- **`npx serve` não funciona**: roda o `Set-ExecutionPolicy` mostrado acima.
- **App carrega mas tela em branco**: provavelmente cache. Aperta `Ctrl + Shift + R` no navegador.
- **Imagens das bibliotecas aparecem como "imagem ausente"**: nome dos arquivos não bate com o `.json`. Renomear localmente e dar push.
- **OpenAI 401**: chave incorreta. Reabre Settings e confirma a chave.
- **OpenAI 404 model not found**: nome do modelo mudou. Tenta `gpt-image-1` no Settings em vez de `gpt-image-2`.

---

**Boa noite e até em casa!** 🚀
