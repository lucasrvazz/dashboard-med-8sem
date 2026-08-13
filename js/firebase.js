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

// Escopos extras solicitados no login para poder ler/escrever na
// Google Agenda do próprio usuário (ver README.md para configuração
// necessária no Google Cloud Console: ativar Calendar API + consent screen).
const GCAL_SCOPE_EVENTS = 'https://www.googleapis.com/auth/calendar.events';

let gcalAccessToken = null;
let gcalTokenExpiry = 0;

function buildGoogleProvider() {
  const provider = new firebase.auth.GoogleAuthProvider();
  provider.addScope(GCAL_SCOPE_EVENTS);
  provider.setCustomParameters({ prompt: 'select_account' });
  return provider;
}

function captureAccessToken(result) {
  const cred = firebase.auth.GoogleAuthProvider.credentialFromResult(result);
  if (cred && cred.accessToken) {
    gcalAccessToken = cred.accessToken;
    gcalTokenExpiry = Date.now() + 55 * 60 * 1000; // tokens do Google Identity duram ~1h
  }
  return cred;
}

function signIn() {
  auth.signInWithPopup(buildGoogleProvider())
    .then(captureAccessToken)
    .catch(e => alert('Erro ao entrar: ' + e.message));
}

function doSignOut() {
  if (confirm('Sair da conta?')) {
    gcalAccessToken = null;
    auth.signOut();
  }
}

// Reautentica via popup só para renovar o token de acesso à Agenda
// (usado sob demanda quando o usuário clica em "Sincronizar Google Agenda").
async function ensureGCalToken() {
  if (gcalAccessToken && Date.now() < gcalTokenExpiry) return gcalAccessToken;
  const result = await auth.signInWithPopup(buildGoogleProvider());
  const cred = captureAccessToken(result);
  if (!cred || !cred.accessToken) throw new Error('Não foi possível obter permissão da Google Agenda.');
  return gcalAccessToken;
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
