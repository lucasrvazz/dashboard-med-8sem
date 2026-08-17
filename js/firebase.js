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
const GCAL_SCOPE_EVENTS = 'https://www.googleapis.com/auth/calendar.events';
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

async function loadFromFirestore() {
  try {
    const snap = await db.collection('users').doc(currentUser.uid).collection('checklist8').doc(FIRESTORE_DOC).get();
    if (snap.exists) {
      const data = snap.data();
      userDisciplines = data.userDisciplines || buildInitialData();
      userGrades = data.userGrades || { si: '' };
      userSettings = data.userSettings || {};

      // Reaplica os metadados oficiais (pesos/conteúdo) das disciplinas padrão,
      // preservando apenas o progresso do checklist e permitindo que disciplinas
      // importadas via Gemini (fora do template) continuem intactas.
      userDisciplines.forEach(d => {
        const tmpl = TEMPLATE_DISCIPLINES.find(t => t.id === d.id);
        if (tmpl) {
          d.assessments = tmpl.assessments;
          d.siWeight = tmpl.siWeight;
          d.calcDesc = tmpl.calcDesc;
          d.schedule = tmpl.schedule;
          d.passingGrade = tmpl.passingGrade;
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
