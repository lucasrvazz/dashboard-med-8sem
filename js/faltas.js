// ══════════════════════════════════════════════════════════
//  CONTROLE DE FALTAS — por disciplina
//  A carga horária total é calculada somando a duração real (dur)
//  de todos os eventos com horário definido no cronograma da
//  disciplina — incluindo os dinâmicos (ambulatório, oftalmo,
//  rodízio). O limite de faltas segue o Regimento da UnB (25%
//  da CH; abaixo disso, o aluno é reprovado com menção SR).
// ══════════════════════════════════════════════════════════

const FALTA_TYPES_COUNT = new Set(['aula', 'seminario', 'estagio', 'prova', 'reposicao']);
const FALTA_LIMIT_PCT = 0.25;

// Chave estável de um evento (data+horário+posição no array ordenado).
// Só usa caracteres alfanuméricos/hífen/underscore de propósito — essa chave
// vai direto num atributo HTML (onchange="..."), então texto livre do título
// (que pode ter aspas, acentos etc.) quebraria o HTML.
function faltaKeyFor(ev, idx) {
  return `${ev.date}_${(ev.time || 'ad').replace(':', '')}_${idx}`;
}

// Reúne todos os eventos "que contam para carga horária" de uma disciplina,
// incluindo os gerados dinamicamente (ambulatório de Ped 2, oftalmo/rodízios
// de Cirurgia 2).
function faltaEventsFor(d) {
  let sched = (d.schedule || []).slice();
  if (d.id === 'ped2' && typeof buildPed2AmbulatorioEvents === 'function') sched = sched.concat(buildPed2AmbulatorioEvents());
  if (d.id === 'cir2') {
    if (typeof buildOftalmoEvents === 'function') sched = sched.concat(buildOftalmoEvents());
    if (typeof buildCirurgiaRodizioEvents === 'function') sched = sched.concat(buildCirurgiaRodizioEvents());
  }
  return sched
    .filter(ev => ev.time && FALTA_TYPES_COUNT.has(ev.type))
    .sort((a, b) => a.date.localeCompare(b.date) || (a.time || '').localeCompare(b.time || ''));
}

function getDisciplineAbsenceMap(disciplineId) {
  if (!userSettings.absences) userSettings.absences = {};
  if (!userSettings.absences[disciplineId]) userSettings.absences[disciplineId] = {};
  return userSettings.absences[disciplineId];
}

function calcFaltasStats(d) {
  const events = faltaEventsFor(d);
  const absMap = getDisciplineAbsenceMap(d.id);
  let totalMin = 0, absentMin = 0;
  events.forEach((ev, idx) => {
    const dur = ev.dur || 60;
    totalMin += dur;
    if (absMap[faltaKeyFor(ev, idx)]) absentMin += dur;
  });
  const totalH = totalMin / 60;
  const absentH = absentMin / 60;
  const maxAbsentH = totalH * FALTA_LIMIT_PCT;
  const remainingH = Math.max(0, maxAbsentH - absentH);
  const pct = totalH ? (absentH / totalH) : 0;
  let statusCls = 'ok', statusMsg = 'OK — dentro do limite.';
  if (absentH >= maxAbsentH) {
    statusCls = 'danger';
    statusMsg = `⚠️ Estourou 25% (${(pct * 100).toFixed(1)}%) — risco de reprovação por frequência (SR).`;
  } else if (pct >= 0.15) {
    statusCls = 'warn';
    statusMsg = `Atenção — já usou ${(pct * 100).toFixed(1)}% dos 25% permitidos.`;
  }
  return { totalH, absentH, maxAbsentH, remainingH, pct, statusCls, statusMsg, events };
}

// Lembra se a lista de aulas está expandida por disciplina, pra não fechar
// sozinha toda vez que uma falta é marcada/desmarcada (o que re-renderiza a página).
let faltasListOpen = {};

function toggleFalta(disciplineId, key) {
  const absMap = getDisciplineAbsenceMap(disciplineId);
  if (absMap[key]) delete absMap[key]; else absMap[key] = true;
  faltasListOpen[disciplineId] = true;
  scheduleSave();
  renderAll();
}

function renderFaltasSection(d) {
  const s = calcFaltasStats(d);
  if (!s.events.length) {
    return `<div class="dash-title">📋 Controle de Faltas</div>
      <div class="info-box">Sem eventos com horário definido no cronograma desta disciplina — nada para computar aqui.</div>`;
  }

  const absMap = getDisciplineAbsenceMap(d.id);
  const today = new Date().toISOString().slice(0, 10);

  const rows = s.events.map((ev, idx) => {
    const key = faltaKeyFor(ev, idx);
    const faltou = !!absMap[key];
    const meta = EVENT_TYPE_META[ev.type] || { label: ev.type, color: '#94a3b8' };
    const past = ev.date < today;
    const dt = new Date(ev.date + 'T00:00:00');
    const dateFmt = dt.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', weekday: 'short' });
    const durH = ((ev.dur || 60) / 60).toFixed(1).replace('.0', '') + 'h';
    return `
      <label class="falta-row ${faltou ? 'faltei' : ''} ${past ? '' : 'futura'}">
        <input type="checkbox" ${faltou ? 'checked' : ''} onchange="toggleFalta('${d.id}', '${key}')">
        <div class="falta-info">
          <div class="falta-title">${ev.title}</div>
          <div class="falta-meta">${dateFmt} · ${ev.time} · <span style="color:${meta.color}">${meta.label}</span> · ${durH}${past ? '' : ' · <i>futura</i>'}</div>
        </div>
      </label>
    `;
  }).join('');

  const barPct = Math.min(100, (s.pct / FALTA_LIMIT_PCT) * 100);

  return `
    <div class="dash-title">📋 Controle de Faltas</div>
    <div class="grades-input-panel" style="flex-direction:column;align-items:stretch;gap:14px">
      <div class="calc-info-box">
        <strong>Regra da UnB:</strong> presença mínima de 75% (máximo <b>25%</b> de faltas na carga horária). Ultrapassar isso reprova com menção SR, mesmo se todas as notas forem altas.
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:10px">
        <div class="sem-stat" style="background:#f1f5f9;color:var(--text)"><div class="lbl" style="color:var(--slate)">CH total (cronograma)</div><div class="val" style="color:${d.color}">${s.totalH.toFixed(1)}h</div></div>
        <div class="sem-stat" style="background:#f1f5f9;color:var(--text)"><div class="lbl" style="color:var(--slate)">Máx. de faltas (25%)</div><div class="val" style="color:${d.color}">${s.maxAbsentH.toFixed(1)}h</div></div>
        <div class="sem-stat" style="background:#f1f5f9;color:var(--text)"><div class="lbl" style="color:var(--slate)">Faltas registradas</div><div class="val" style="color:${d.color}">${s.absentH.toFixed(1)}h</div></div>
        <div class="sem-stat" style="background:#f1f5f9;color:var(--text)"><div class="lbl" style="color:var(--slate)">Restam</div><div class="val" style="color:${d.color}">${s.remainingH.toFixed(1)}h</div></div>
      </div>
      <div>
        <div class="mini-track" style="height:10px"><div class="mini-fill" style="width:${barPct}%; background:${s.statusCls === 'danger' ? 'var(--rose)' : s.statusCls === 'warn' ? '#f59e0b' : d.color}"></div></div>
        <div style="text-align:right;margin-top:6px"><span class="st-badge ${s.statusCls}">${s.statusMsg}</span></div>
      </div>
      <details ${faltasListOpen[d.id] ? 'open' : ''} ontoggle="faltasListOpen['${d.id}']=this.open">
        <summary style="cursor:pointer;font-weight:700;font-size:.85rem;color:var(--slate)">📅 Ver aulas / marcar faltas (${s.events.length} eventos)</summary>
        <div class="falta-list">${rows}</div>
      </details>
    </div>
  `;
}
