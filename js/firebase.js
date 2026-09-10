// ══════════════════════════════════════════════════════════
//  FIREBASE — AUTENTICAÇÃO GOOGLE + SINCRONIZAÇÃO (FIRESTORE)
//  Reaproveita o mesmo projeto Firebase do dashboard do 7º semestre
//  (checklist-d7a01), mas grava os dados do 8º semestre em um
//  documento Firestore SEPARADO ('data_8sem'), sem misturar os dados.
// ══════════════════════════════════════════════════════════

const firebaseConfig = {
  apiKey:            "AIzaSyBf3ZgjZ4W_Vr2XaWRHurU2I3cDpJeLLFs",
  authDomain:        "checklist-d7a01.firebaseapp.com",
  projectId:         "checklist-d7a01",
  storageBucket:     "checklist-d7a01.firebasestorage.app",
  messagingSenderId: "829528262319",
  appId:             "1:829528262319:web:8929dc37ecd62e8a8c765a"
};

firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db   = firebase.firestore();
db.enablePersistence().catch(() => {});

const FIRESTORE_DOC = 'data_8sem'; // documento separado do dashboard do 7º semestre

function signIn() {
  auth.signInWithPopup(new firebase.auth.GoogleAuthProvider())
    .catch(e => alert('Erro ao entrar: ' + e.message));
}

function doSignOut() {
  if (confirm('Sair da conta?')) {
    gcalAccessToken = null;
    auth.signOut();
  }
}

// ── PERMISSÃO DA GOOGLE AGENDA (Google Identity Services) ──────
// Pedida separadamente do login, só quando o usuário clica em "Sincronizar
// Google Agenda". Usamos a biblioteca do próprio Google (não o Firebase Auth)
// porque pedir esse escopo extra a uma sessão já logada pelo Firebase se
// mostrou pouco confiável (o Firebase às vezes não devolve o token de acesso).
// Usamos o escopo "calendar" (completo) em vez de "calendar.events", porque
// o app também precisa LISTAR agendas e CRIAR uma agenda nova (calendarList,
// calendars.insert) — operações que "calendar.events" (só eventos) não cobre.
const GCAL_SCOPE_EVENTS = 'https://www.googleapis.com/auth/calendar';
const GOOGLE_WEB_CLIENT_ID = '829528262319-gv0o3ir63r0vpgujhv84761vhmldmpuh.apps.googleusercontent.com';

let gcalAccessToken = null;
let gcalTokenExpiry = 0;
let gisTokenClient = null;

function getGisTokenClient() {
  if (typeof google === 'undefined' || !google.accounts || !google.accounts.oauth2) {
    throw new Error('A biblioteca do Google ainda não carregou. Recarregue a página e tente de novo.');
  }
  if (!gisTokenClient) {
    gisTokenClient = google.accounts.oauth2.initTokenClient({
      client_id: GOOGLE_WEB_CLIENT_ID,
      scope: GCAL_SCOPE_EVENTS,
      callback: () => {} // sobrescrito a cada chamada de ensureGCalToken()
    });
  }
  return gisTokenClient;
}

function ensureGCalToken() {
  if (gcalAccessToken && Date.now() < gcalTokenExpiry) return Promise.resolve(gcalAccessToken);
  return new Promise((resolve, reject) => {
    let client;
    try { client = getGisTokenClient(); } catch (e) { reject(e); return; }
    client.callback = (resp) => {
      if (resp.error) {
        reject(new Error('O Google recusou a permissão (' + resp.error + '). Tente de novo e aceite a permissão da Google Agenda na janela que abrir.'));
        return;
      }
      // resp.scope lista as permissões que o token REALMENTE recebeu (dado do
      // próprio GIS, no navegador — sem depender de chamada externa que possa
      // falhar por CORS). Guardamos para diagnóstico e conferimos aqui.
      window.__lastGcalScope = resp.scope || '(vazio)';
      console.log('Permissões concedidas ao token:', resp.scope);
      const grantedScopes = (resp.scope || '').split(' ');
      if (!grantedScopes.includes(GCAL_SCOPE_EVENTS)) {
        reject(new Error('O token veio SEM a permissão da Agenda. Permissões recebidas: [' + (resp.scope || 'nenhuma') + ']. Na próxima janela do Google, marque a caixinha "Google Agenda"; se ela não aparecer, o escopo precisa estar salvo em "Acesso a dados" no Google Cloud Console.'));
        return;
      }
      gcalAccessToken = resp.access_token;
      gcalTokenExpiry = Date.now() + (resp.expires_in - 60) * 1000;
      resolve(gcalAccessToken);
    };
    // prompt:'consent' força o Google a sempre mostrar a tela pedindo a
    // permissão da Agenda, em vez de reaproveitar silenciosamente uma
    // autorização antiga que não tinha esse escopo (causa do erro 403
    // "insufficient authentication scopes").
    client.requestAccessToken({ prompt: 'consent', ...(currentUser && currentUser.email ? { hint: currentUser.email } : {}) });
  });
}

// Mescla as seções de conteúdo do template (js/data.js — sempre a versão mais
// atual, editada por nós) com as seções salvas do usuário. As seções são
// casadas por POSIÇÃO (não por título — título é editável pelo usuário, então
// usá-lo como chave quebraria a mesclagem assim que ele renomeasse algo).
// Regras:
//  - Tópicos novos do template (ainda não vistos pelo usuário) entram no fim.
//  - A ORDEM que o usuário arrastou é sempre respeitada — nunca reordenamos
//    de volta para a ordem do template.
//  - O TÍTULO que o usuário editou é preservado (só usamos o do template se o
//    usuário nunca tiver essa seção salva ainda).
//  - Tópicos removidos do template mas presentes no salvo (ou adicionados à
//    mão pelo usuário) continuam existindo — nunca apagamos conteúdo do usuário.
//  - Cada seção salva é casada com a seção do template que tem mais tópicos em
//    comum (não pela posição) — assim, se uma seção do template for dividida em
//    duas (ex.: "Ortopedia/Oftalmologia" virando "Ortopedia" + "Oftalmologia"),
//    renomeada ou reordenada, o progresso marcado não se perde nem "vaza" pra
//    seção errada.
//  - Além disso, o status (concluído ou não) de cada tópico é lembrado por texto
//    globalmente entre todas as seções salvas, como uma segunda rede de segurança:
//    mesmo um tópico que "mudou de seção" continua com o progresso certo.
function mergeSections(tmplSections, savedSections) {
  tmplSections = tmplSections || [];
  savedSections = savedSections || [];

  const globalStatus = {};
  savedSections.forEach(sec => (sec.items || []).forEach(i => {
    if (i && i.label != null && globalStatus[i.label] === undefined) globalStatus[i.label] = { id: i.id, status: i.status || 0 };
  }));

  const usedSavedIdx = new Set();
  const merged = tmplSections.map(tmplSec => {
    const tmplLabelSet = new Set(tmplSec.items);

    // Acha a seção salva com mais tópicos em comum com esta seção do template
    // (ainda não usada por outra seção do template).
    let bestIdx = -1, bestScore = 0;
    savedSections.forEach((s, i) => {
      if (usedSavedIdx.has(i)) return;
      const score = (s.items || []).filter(it => tmplLabelSet.has(it.label)).length;
      if (score > bestScore) { bestScore = score; bestIdx = i; }
    });
    const savedSec = bestIdx !== -1 ? savedSections[bestIdx] : null;
    if (bestIdx !== -1) usedSavedIdx.add(bestIdx);

    const title = savedSec && savedSec.title ? savedSec.title : tmplSec.title;
    const savedItems = (savedSec && savedSec.items) || [];
    const usedLabels = new Set();

    // 1) Mantém a ordem salva (respeita qualquer drag-and-drop já feito), só dos
    // tópicos que ainda pertencem a esta seção no template atual.
    const items = savedItems
      .filter(i => tmplLabelSet.has(i.label))
      .map(i => { usedLabels.add(i.label); return { id: i.id || genId(), label: i.label, status: i.status || 0 }; });

    // 2) Acrescenta no fim os tópicos do template que faltam aqui — recuperando o
    // status salvo mesmo que o tópico estivesse em outra seção antes.
    tmplSec.items.forEach(label => {
      if (!usedLabels.has(label)) {
        const g = globalStatus[label];
        items.push({ id: (g && g.id) || genId(), label, status: (g && g.status) || 0 });
      }
    });

    return { title, items };
  });

  // Preserva seções extras que o usuário já tinha e que não corresponderam a
  // nenhuma seção do template hoje (ex.: seção totalmente customizada).
  savedSections.forEach((s, i) => { if (!usedSavedIdx.has(i)) merged.push(s); });

  return merged;
}

async function loadFromFirestore() {
  try {
    const snap = await db.collection('users').doc(currentUser.uid).collection('checklist8').doc(FIRESTORE_DOC).get();
    if (snap.exists) {
      const data = snap.data();
      userDisciplines = data.userDisciplines || buildInitialData();
      userGrades = data.userGrades || { si: '' };
      userSettings = data.userSettings || {};

      // Reaplica os metadados oficiais (pesos/conteúdo) das disciplinas padrão.
      // O conteúdo (sections) é MESCLADO, não substituído: os tópicos vêm sempre
      // atualizados de js/data.js, mas o status de revisão que você já marcou em
      // cada tópico é preservado (por texto do tópico), e tópicos que você
      // adicionou manualmente continuam existindo mesmo que não estejam no template.
      userDisciplines.forEach(d => {
        const tmpl = TEMPLATE_DISCIPLINES.find(t => t.id === d.id);
        if (tmpl) {
          d.assessments = tmpl.assessments;
          d.siWeight = tmpl.siWeight;
          d.calcDesc = tmpl.calcDesc;
          d.schedule = tmpl.schedule;
          d.passingGrade = tmpl.passingGrade;
          d.sections = mergeSections(tmpl.sections, d.sections);
        }
        if (!d.sections) d.sections = [];
        d.sections.forEach(s => s.items.forEach(i => { if (i.status === undefined) i.status = 0; }));
      });
      TEMPLATE_DISCIPLINES.forEach(td => {
        if (!userDisciplines.find(d => d.id === td.id)) userDisciplines.push(JSON.parse(JSON.stringify(td)));
      });
    } else {
      userDisciplines = buildInitialData();
      userGrades = { si: '' };
      userSettings = {};
    }
  } catch (e) {
    console.error('Erro ao carregar dados:', e);
    userDisciplines = buildInitialData();
    userGrades = { si: '' };
    userSettings = {};
  }
}

function buildInitialData() {
  const cloned = JSON.parse(JSON.stringify(TEMPLATE_DISCIPLINES));
  cloned.forEach(d => d.sections.forEach(s => { s.items = s.items.map(lbl => ({ id: genId(), label: lbl, status: 0 })); }));
  return cloned;
}

let saveTimer = null;
function scheduleSave() {
  const dot = document.getElementById('sync-dot');
  const lbl = document.getElementById('sync-lbl');
  if (dot) dot.className = 'sync-dot saving';
  if (lbl) lbl.textContent = 'salvando...';
  clearTimeout(saveTimer);
  saveTimer = setTimeout(async () => {
    try {
      await db.collection('users').doc(currentUser.uid).collection('checklist8').doc(FIRESTORE_DOC)
        .set({ userDisciplines, userGrades, userSettings, updatedAt: firebase.firestore.FieldValue.serverTimestamp() }, { merge: true });
      if (dot) dot.className = 'sync-dot';
      if (lbl) lbl.textContent = 'salvo';
    } catch (e) {
      if (dot) dot.className = 'sync-dot error';
      if (lbl) lbl.textContent = 'erro ao salvar';
    }
  }, 800);
}
