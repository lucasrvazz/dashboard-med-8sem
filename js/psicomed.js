// ══════════════════════════════════════════════════════════
//  GRUPOS DE PSICOMED 8 — apresentações de seminário
//  Cada grupo apresenta uma vez no semestre, na data e no tema
//  atribuídos pela imagem "Divisão de Grupos" da turma.
// ══════════════════════════════════════════════════════════

const PSICOMED_GROUPS = {
  1:  ['Endrio', 'Milene', 'Maria', 'Miriã'],
  2:  ['Martina', 'Ana Clara', 'João Pedro', 'Filipe'],
  3:  ['Rafael de Carvalho', 'Daniel', 'Rafael Medeiros', 'Pedro Guedes'],
  4:  ['Isa P', 'Portil', 'Julia', 'Milena'],
  5:  ['Luiza', 'Stephan', 'Audir', 'Itamara'],
  6:  ['Almuetasim', 'Deivys', 'Vicenzo', 'Vitor'],
  7:  ['Ana Carolina', 'Luana', 'Paulo', 'Emillen', 'Biatriz'],
  8:  ['Laryssa', 'Nich', 'Duda', 'Let', 'Joziane'],
  9:  ['Luis', 'Pedro Cesar', 'Débora', 'Geovana', 'Lucas Vaz'],
  10: ['Pedro Luís', 'Vitor José', 'Maria Brito', 'Ludmila', 'Dainara'],
  11: ['Ana', 'Dávia', 'Rafaella', 'Isabella', 'Henry'],
  12: ['Gabi', 'Clara', 'Lalesca', 'Fiuza', 'Gustavo'],
  13: ['Estêvão', 'Gabriel', 'Guilherme', 'Lucas Feliciano', 'Rodrigo']
};

// data-ISO → { grupo, tema } (bate com as datas já cadastradas em data.js para Psicomed)
const PSICOMED_PRESENTATIONS = {
  '2026-08-18': { grupo: 2,  tema: 'Motivações para escolha da especialidade' },
  '2026-08-25': { grupo: 12, tema: 'Clínica Médica' },
  '2026-09-01': { grupo: 3,  tema: 'Cirurgia Geral' },
  '2026-09-08': { grupo: 1,  tema: 'Medicina da Família e Comunidade' },
  '2026-09-29': { grupo: 8,  tema: 'Ginecologia e Obstetrícia' },
  '2026-10-06': { grupo: 6,  tema: 'Psiquiatria' },
  '2026-10-13': { grupo: 13, tema: 'Clínico-Cirúrgicas' },
  '2026-10-20': { grupo: 7,  tema: 'Pediatria' },
  '2026-10-27': { grupo: 9,  tema: 'Exclusivamente Clínicas' },
  '2026-11-03': { grupo: 5,  tema: 'Exclusivamente Cirúrgicas' },
  '2026-11-10': { grupo: 11, tema: 'Medicina de Imagem e Nuclear' },
  '2026-11-17': { grupo: 10, tema: 'Medicina Legal e Medicina do Trabalho' },
  '2026-11-24': { grupo: 4,  tema: 'Medicina Preventiva e Saúde Coletiva' }
};

function getPsicomedUserPresentation() {
  const grupo = Number(userSettings.psicomedGrupo);
  if (!grupo) return null;
  for (const [date, info] of Object.entries(PSICOMED_PRESENTATIONS)) {
    if (info.grupo === grupo) return { date, ...info };
  }
  return null;
}

// Dado uma data (ISO), retorna qual grupo apresenta nesse dia (ou null).
function getPsicomedPresenterOnDate(dateISO) {
  return PSICOMED_PRESENTATIONS[dateISO] || null;
}

function renderPsicomedPicker() {
  const grupo = userSettings.psicomedGrupo || '';
  const groupNums = Object.keys(PSICOMED_GROUPS).sort((a, b) => Number(a) - Number(b));
  const opts = [
    '<option value="">Escolher grupo...</option>',
    ...groupNums.map(g => `<option value="${g}" ${String(grupo) === g ? 'selected' : ''}>Grupo ${g}</option>`)
  ].join('');

  let info = '';
  if (grupo) {
    const membros = PSICOMED_GROUPS[grupo] || [];
    const pres = getPsicomedUserPresentation();
    const dateFmt = pres ? new Date(pres.date + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: 'long', weekday: 'long' }) : null;
    info = `
      <div class="import-preview" style="margin-top:12px">
        <h4>🎤 Grupo ${grupo}</h4>
        ${pres ? `<p style="font-size:.9rem;margin:8px 0;padding:10px;background:#f0f9ff;border-left:3px solid var(--sky);border-radius:6px"><b>Sua apresentação:</b> ${dateFmt} — <b>${pres.tema}</b></p>` : ''}
        <div style="margin-top:8px"><b>Membros:</b></div>
        <div class="pill-list">${membros.map(m => `<span>${m}</span>`).join('')}</div>
      </div>
    `;
  }

  return `
    <div class="global-pi-box" style="border-color:${grupo ? 'var(--sky)' : '#cbd5e1'};flex-direction:column;align-items:flex-start;gap:10px">
      <label>🎤 Grupo de Seminários — selecione seu grupo (a agenda vai destacar seu dia):</label>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <select onchange="updatePsicomedGrupo(this.value)" style="padding:8px;border-radius:8px;border:1px solid #94a3b8;font-family:'DM Mono',monospace">${opts}</select>
      </div>
      ${info}
    </div>
  `;
}

function updatePsicomedGrupo(val) {
  userSettings.psicomedGrupo = val || null;
  scheduleSave();
  renderAll();
}
