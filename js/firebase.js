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
// atual, editada por nós) com as seções salvas do usuário (que carregam o
// status de revisão marcado por ele). Tópicos do template sempre aparecem,
// com o status preservado quando o texto do tópico já existia antes; tópicos
// que o próprio usuário adicionou manualmente (fora do template) são mantidos
// no fim da seção correspondente; seções 100% customizadas pelo usuário
// (sem título correspondente no template) também são preservadas.
function mergeSections(tmplSections, savedSections) {
  savedSections = savedSections || [];
  const savedByTitle = {};
  savedSections.forEach(s => { savedByTitle[s.title] = s; });
  const usedTitles = new Set();

  const merged = (tmplSections || []).map(tmplSec => {
    usedTitles.add(tmplSec.title);
    const savedSec = savedByTitle[tmplSec.title];
    const savedStatusByLabel = {};
    if (savedSec) (savedSec.items || []).forEach(i => { savedStatusByLabel[i.label] = i.status; });

    const items = tmplSec.items.map(label => ({
      id: genId(),
      label,
      status: savedStatusByLabel[label] !== undefined ? savedStatusByLabel[label] : 0
    }));
    // Preserva tópicos que o usuário adicionou manualmente e não estão no template.
    if (savedSec) {
      (savedSec.items || []).forEach(i => {
        if (!tmplSec.items.includes(i.label)) items.push({ id: i.id || genId(), label: i.label, status: i.status || 0 });
      });
    }
    return { title: tmplSec.title, items };
  });

  // Preserva seções inteiramente customizadas pelo usuário (título que não existe no template).
  savedSections.forEach(s => { if (!usedTitles.has(s.title)) merged.push(s); });

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
