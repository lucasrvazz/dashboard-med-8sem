# 🎓 Dashboard MED 117 — 8º Semestre

Site estático (sem servidor próprio) para acompanhar as 5 disciplinas do 8º semestre — notas, conteúdo de prova, cronograma e calendário integrado à Google Agenda. Os dados ficam salvos na nuvem (Firebase) associados ao login Google de cada pessoa que usar o site.

Disciplinas já carregadas a partir dos planos de ensino oficiais: **UE-PED** (Urgência e Emergência em Pediatria 3), **SFC 5**, **Psicomed 8**, **Ped 2** (Saúde da Criança e do Adolescente 2) e **Cirurgia 2** (Saúde do Adulto Cir II).

> ⚠️ **Cirurgia 2**: o cronograma oficial não trazia os pesos das 3 provas nem a nota mínima — o site está usando 33,3% para cada prova como estimativa até você atualizar com o plano de ensino completo (pela aba "Importar Ementa").
> Algumas datas nos documentos originais têm pequenas inconsistências (ex.: datas de término que não batem com o cronograma) — foram reproduzidas como constam nos PDFs, sem correção.

---

## 1. Rodar localmente

Não dá pra abrir o `index.html` direto no navegador (`file://`) porque o login do Google exige um servidor http. Rode um servidor simples:

```bash
cd ~/dashboard-med-8sem
python3 -m http.server 8080
```

Depois abra `http://localhost:8080` no navegador.

---

## 2. Firebase (login + salvar notas/checklist na nuvem)

O site reaproveita o **mesmo projeto Firebase** do seu dashboard do 7º semestre (`checklist-d7a01`), mas grava os dados do 8º semestre em um documento separado no Firestore (`data_8sem`), então nada se mistura com o semestre anterior.

Único passo necessário: garantir que o domínio de onde o site vai rodar está autorizado.

1. Acesse [console.firebase.google.com](https://console.firebase.google.com/project/checklist-d7a01/authentication/settings) → **Authentication → Settings → Authorized domains**.
2. Confirme que `localhost` já está na lista (geralmente vem por padrão).
3. Depois de publicar no GitHub Pages (passo 5), adicione o domínio final ali também (ex.: `seu-usuario.github.io`).

---

## 3. Google Agenda (sincronizar cronograma com sua conta)

A sincronização usa o mesmo login do Firebase, pedindo também a permissão `calendar.events`. Como é um **escopo sensível do Google**, ele só funciona se o projeto Google Cloud por trás do Firebase tiver a Calendar API ativada e você (ou quem for testar) estiver autorizado a usá-la enquanto o app não é verificado publicamente pelo Google.

1. Acesse [console.cloud.google.com/apis/library/calendar-json.googleapis.com](https://console.cloud.google.com/apis/library/calendar-json.googleapis.com?project=checklist-d7a01) e clique em **Ativar** (o projeto já vem selecionado: `checklist-d7a01`).
2. Vá em **APIs e Serviços → Tela de permissão OAuth** (OAuth consent screen):
   - Se o app estiver em modo "Testing" (padrão), clique em **+ Add users** e adicione os e-mails Google de quem for usar o site (incluindo o seu). Sem isso, o Google bloqueia o consentimento do escopo do Calendar com "app não verificado".
   - Se quiser liberar para qualquer colega da turma sem precisar cadastrar cada e-mail, o app precisaria passar pela verificação do Google (processo mais demorado, geralmente desnecessário para uso pessoal/turma pequena).
3. Pronto — ao clicar em "Sincronizar Google Agenda" no site, uma nova agenda chamada **"🎓 Medicina 8º Sem — 117"** é criada automaticamente na conta do usuário logado, com todos os eventos do cronograma (aulas, provas, seminários).

---

## 4. Gemini (importar ementas em PDF automaticamente)

Cada pessoa usa **sua própria chave de API**, gratuita:

1. Acesse [aistudio.google.com/apikey](https://aistudio.google.com/apikey) e gere uma chave.
2. No site, vá na aba **"Importar Ementa"**, cole a chave (fica salva só no seu navegador — `localStorage`, nunca sai do seu computador exceto para chamar a própria API do Google).
3. Arraste o PDF do plano de ensino da nova disciplina. O Gemini lê o documento inteiro e devolve a composição de notas, o conteúdo programático e o cronograma já estruturados — você confere e clica em "Adicionar disciplina".

**Atenção de segurança:** como este é um site estático (sem backend), a chave do Gemini trafega diretamente do navegador para a API do Google. Isso é seguro para uso pessoal, mas se for compartilhar o link publicamente, restrinja a chave no [Google Cloud Console](https://console.cloud.google.com/apis/credentials) por referenciador HTTP (HTTP referrer), limitando-a ao domínio do seu GitHub Pages.

---

## 5. Publicar no GitHub Pages

```bash
cd ~/dashboard-med-8sem
git add .
git commit -m "Dashboard MED 117 - 8º semestre"
```

Depois, no GitHub:

1. Crie um repositório novo (público ou privado) em [github.com/new](https://github.com/new) — **sem** inicializar com README.
2. Copie os comandos que o GitHub mostrar na tela "…or push an existing repository from the command line", algo como:

```bash
git remote add origin https://github.com/SEU_USUARIO/NOME_DO_REPO.git
git branch -M main
git push -u origin main
```

3. No repositório, vá em **Settings → Pages** → em "Build and deployment", escolha **Deploy from a branch**, branch `main`, pasta `/ (root)`.
4. Em alguns minutos o site estará em `https://SEU_USUARIO.github.io/NOME_DO_REPO/`.
5. Volte ao passo 2 e adicione esse domínio nos **Authorized domains** do Firebase.

---

## Estrutura dos arquivos

```
index.html          shell da página, carrega todos os scripts
css/style.css        todo o visual do dashboard
js/data.js            dados oficiais das 5 disciplinas (notas, conteúdo, cronograma)
js/grades.js          motor de cálculo de notas (mínima/máxima/aprovação)
js/firebase.js        login Google + salvar/carregar dados na nuvem
js/calendar.js         calendário (FullCalendar) + sincronização com Google Agenda
js/gemini.js           upload de PDF → Gemini → nova disciplina estruturada
js/app.js              estado geral, abas, painéis, checklist
```

Para editar pesos de nota, conteúdo de prova ou datas de uma disciplina já existente, edite diretamente `js/data.js` (ou use "Importar Ementa" para reprocessar o PDF atualizado).
