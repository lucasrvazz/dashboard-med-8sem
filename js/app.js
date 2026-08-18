// ══════════════════════════════════════════════════════════
//  APP — estado, renderização e interações
// ══════════════════════════════════════════════════════════

let userDisciplines = [];
let userGrades = { si: '' };
let userSettings = {};
let activeTab = 'resumo';
let currentUser = null;

// ── AUTH ──────────────────────────────────────────────────
auth.onAuthStateChanged(async user => {
  if (user) {
    currentUser = user;
    document.getElementById('user-name').textContent = (user.displayName || 'Usuário').split(' ')[0];
    const av = document.getElementById('user-avatar');
    av.innerHTML = user.photoURL ? `<img src="${user.photoURL}" alt="">` : (user.displayName || 'U')[0];
    await loadFromFirestore();
    showScreen('app');
    startCountdown();
    renderAll();
  } else {
    showScreen('login');
  }
});

function showScreen(which) {
  document.getElementById('loading-screen').style.display = which === 'loading' ? 'flex' : 'none';
  document.getElementById('login-screen').style.display = which === 'login' ? 'flex' : 'none';
  document.getElementById('app').style.display = which === 'app' ? 'block' : 'none';
  const about = document.getElementById('about-static');
  if (about) about.style.display = which === 'app' ? 'none' : 'block';
}

// ── PROGRESSO DO CHECKLIST ───────────────────────────────
function getDiscProgress(d) {
  let score = 0, max = 0, counts = [0, 0, 0, 0];
  (d.sections || []).forEach(s => (s.items || []).forEach(i => {
    const st = i.status || 0;
    counts[st]++; score += st; max += 3;
  }));
  return { score, max, counts, pct: max ? Math.round((score / max) * 100) : 0 };
}
function globalProgress() {
  let score = 0, max = 0;
  userDisciplines.forEach(d => { const p = getDiscProgress(d); score += p.score; max += p.max; });
  return { pct: max ? Math.round((score / max) * 100) : 0 };
}

// ── RENDER ────────────────────────────────────────────────
function renderAll() {
  try {
    renderTabs();
    const panels = document.getElementById('panels');
    let html = `<div class="panel ${activeTab === 'resumo' ? 'active' : ''}" id="panel-resumo">${activeTab === 'resumo' ? renderResumo() : ''}</div>`;
    userDisciplines.forEach(d => {
      html += `<div class="panel ${activeTab === d.id ? 'active' : ''}" id="panel-${d.id}">${activeTab === d.id ? renderDiscPanel(d) : ''}</div>`;
    });
    html += `<div class="panel ${activeTab === 'calendario' ? 'active' : ''}" id="panel-calendario">${activeTab === 'calendario' ? renderCalendarTab() : ''}</div>`;
    html += `<div class="panel ${activeTab === 'provas' ? 'active' : ''}" id="panel-provas">${activeTab === 'provas' ? renderProvasTab() : ''}</div>`;
    panels.innerHTML = html;

    if (activeTab === 'calendario' && calendarCurrentView !== 'provas') {
      requestAnimationFrame(initFullCalendarIfNeeded);
    }
    if (activeTab === 'provas' && provasTabView === 'calendario') {
      requestAnimationFrame(initProvasCalendarIfNeeded);
    }
  } catch (err) {
    console.error('Erro fatal na renderização:', err);
    document.getElementById('panels').innerHTML = `<div class="error-box"><b>🚨 Erro na interface!</b><br><i>${err.message}</i></div>`;
  }
}

function renderTabs() {
  const all = [
    { id: 'resumo', label: 'Dashboard', emoji: '📊', color: 'var(--navy)' },
    ...userDisciplines.map(d => ({ id: d.id, label: d.label, emoji: d.emoji, color: d.color })),
    { id: 'calendario', label: 'Calendário', emoji: '📅', color: 'var(--indigo)' },
    { id: 'provas', label: 'Provas', emoji: '📝', color: 'var(--rose)' }
  ];
  document.getElementById('tabs').innerHTML = all.map(t => {
    const active = t.id === activeTab ? 'active' : '';
    return `<div class="tab ${active}" style="--tab-color:${t.color}" onclick="switchTab('${t.id}')">${t.emoji} ${t.label}</div>`;
  }).join('');
}

// ── "ACONTECENDO AGORA" + "LOGO EM SEGUIDA" ────────────────
// Lê os eventos de todas as disciplinas (via buildAllEvents) e mostra no topo
// do Dashboard o que está rolando neste minuto e o próximo evento futuro.
// Considera duração real (dur) e cronogramas dinâmicos (ambulatório, oftalmo,
// rodízio) automaticamente.
function findNowAndNext() {
  const now = new Date();
  const events = buildAllEvents()
    .filter(e => !e.allDay && e.start && e.end)
    .map(e => ({
      ev: e,
      startDt: new Date(e.start),
      endDt: new Date(e.end)
    }))
    .sort((a, b) => a.startDt - b.startDt);

  const nowEvents = events.filter(x => x.startDt <= now && now < x.endDt);
  const nextEvents = events.filter(x => x.startDt > now).slice(0, 3);
  return { nowEvents, nextEvents };
}

function formatHHMM(dt) {
  return dt.toTimeString().slice(0, 5);
}

function formatRelative(dt) {
  const now = new Date();
  const diffMs = dt - now;
  const diffMin = Math.round(diffMs / 60000);
  if (diffMin < 60) return `em ${diffMin} min`;
  const diffH = Math.floor(diffMin / 60);
  const restMin = diffMin % 60;
  if (diffH < 24) return restMin ? `em ${diffH}h${restMin.toString().padStart(2, '0')}` : `em ${diffH}h`;
  const diffD = Math.floor(diffH / 24);
  return `em ${diffD} dia${diffD === 1 ? '' : 's'}`;
}

function eventCardHTML({ ev, startDt, endDt }, kind) {
  const p = ev.extendedProps;
  const meta = EVENT_TYPE_META[p.type] || { label: p.type, color: '#94a3b8' };
  const dateFmt = startDt.toLocaleDateString('pt-BR', { weekday: 'short', day: '2-digit', month: '2-digit' });
  const timeRange = `${formatHHMM(startDt)}–${formatHHMM(endDt)}`;
  if (kind === 'now') {
    const totalMs = endDt - startDt;
    const doneMs = new Date() - startDt;
    const pctDone = Math.max(0, Math.min(100, (doneMs / totalMs) * 100));
    const minsLeft = Math.max(0, Math.round((endDt - new Date()) / 60000));
    return `
      <div class="nn-card nn-now" style="border-left-color:${ev.backgroundColor}" onclick="switchTab('${p.disciplineId}')">
        <div class="nn-head">
          <div class="nn-eyebrow" style="color:${ev.backgroundColor}">🔴 ACONTECENDO AGORA · ${p.disciplineEmoji} ${p.disciplineLabel}</div>
          <span class="nn-type" style="background:${meta.color}22;color:${meta.color}">${meta.label}</span>
        </div>
        <div class="nn-title">${p.rawTitle}</div>
        <div class="nn-meta">${dateFmt} · ${timeRange} · <b>termina em ${minsLeft} min</b></div>
        <div class="nn-progress"><div class="nn-progress-fill" style="width:${pctDone}%; background:${ev.backgroundColor}"></div></div>
      </div>`;
  }
  return `
    <div class="nn-card nn-next" style="border-left-color:${ev.backgroundColor}" onclick="switchTab('${p.disciplineId}')">
      <div class="nn-head">
        <div class="nn-eyebrow" style="color:var(--slate)">⏭️ ${kind === 'firstNext' ? 'LOGO EM SEGUIDA' : 'DEPOIS'} · ${p.disciplineEmoji} ${p.disciplineLabel}</div>
        <span class="nn-type" style="background:${meta.color}22;color:${meta.color}">${meta.label}</span>
      </div>
      <div class="nn-title">${p.rawTitle}</div>
      <div class="nn-meta">${dateFmt} · ${timeRange} · <b>${formatRelative(startDt)}</b></div>
    </div>`;
}

function renderNowAndNext() {
  const { nowEvents, nextEvents } = findNowAndNext();

  if (!nowEvents.length && !nextEvents.length) {
    return `<div class="nn-empty">🏖️ Nenhum evento agendado à frente — o semestre acabou ou o cronograma ainda não começou.</div>`;
  }

  const nowHtml = nowEvents.length
    ? nowEvents.map(x => eventCardHTML(x, 'now')).join('')
    : `<div class="nn-card nn-idle">
        <div class="nn-eyebrow" style="color:var(--slate)">🔵 AGORA</div>
        <div class="nn-title" style="color:var(--slate);font-weight:500">Nada acontecendo neste momento</div>
      </div>`;

  const nextHtml = nextEvents.map((x, i) => eventCardHTML(x, i === 0 ? 'firstNext' : 'next')).join('');

  return `<div class="nn-wrap">${nowHtml}${nextHtml}</div>`;
}

function renderResumo() {
  const { pct } = globalProgress();
  const overview = calcSemesterOverview();

  const semesterCard = overview ? `
    <div class="semester-card">
      <div class="dash-title">🎓 Painel do Semestre — aprovação com nota ≥ 50%</div>
      <div class="sem-grid">
        <div class="sem-stat"><div class="lbl">Média atual (todas as disciplinas)</div><div class="val">${overview.mediaAtual.toFixed(2)}</div></div>
        <div class="sem-stat"><div class="lbl">Faixa possível (mín – máx)</div><div class="val">${overview.mediaMin.toFixed(2)} – ${overview.mediaMax.toFixed(2)}</div></div>
        <div class="sem-stat"><div class="lbl">Disciplinas aprovadas / em risco / reprovadas</div><div class="val">${overview.countOk} / ${overview.countWarn} / ${overview.countDanger}</div></div>
      </div>
    </div>` : '';

  const cardsHtml = userDisciplines.map(d => {
    const m = calcSubjectMetrics(d.id);
    const p = getDiscProgress(d);
    return `
      <div class="d-card" onclick="switchTab('${d.id}')" style="border-top: 4px solid ${d.color}">
        <div class="d-card-header">
          <div class="d-card-title">${d.emoji} ${d.label}</div>
          <div class="d-card-nota"><div class="lbl">Acumulado</div><div class="val" style="color:${d.color}">${m.atual}</div></div>
        </div>
        <div>
          <div class="prog-labels"><span>Progresso da Matéria</span><span>${p.pct}%</span></div>
          <div class="mini-track"><div class="mini-fill" style="width:${p.pct}%; background:${d.color}"></div></div>
        </div>
        <div class="state-counts">
          <div class="sc-pill s-0"><div class="icon">📚</div>${p.counts[0]}</div>
          <div class="sc-pill s-1"><div class="icon">✅</div>${p.counts[1]}</div>
          <div class="sc-pill s-2"><div class="icon">🔄</div>${p.counts[2]}</div>
          <div class="sc-pill s-3"><div class="icon">⭐</div>${p.counts[3]}</div>
        </div>
        <div style="margin-top:4px">
          ${renderGradeBar(m)}
          <div style="text-align:right; margin-top:6px"><span class="st-badge ${m.cls}">${m.status}</span></div>
        </div>
      </div>`;
  }).join('');

  return `
    ${renderNowAndNext()}

    <div class="dash-grid-top">
      <div class="dash-card">
        <div class="dash-title">⏳ Contagem Regressiva (fim do semestre — 14/12/2026)</div>
        <div class="cd-timer" id="cd-val">--:--:--</div>
        <div class="cd-labels"><span>DIAS</span><span>HORAS</span><span>MIN</span></div>
      </div>
      <div class="dash-card">
        <div class="dash-title">📈 Visão Geral do Semestre</div>
        <div class="prog-val">${pct}% <span style="font-size:1rem;color:var(--slate);font-weight:600">Completado Globalmente</span></div>
        <div class="bar-track-dark"><div class="bar-fill-dark" style="width:${pct}%"></div></div>
      </div>
    </div>

    ${semesterCard}

    <div class="global-pi-box">
      <label>⭐ Nota do Seminário Integrador (comum às disciplinas que somam essa nota):</label>
      <input type="number" step="0.1" min="0" max="10" value="${userGrades.si}" placeholder="0-10" onblur="updateGlobalSI(this.value)">
      <span style="font-size:0.75rem; color:var(--slate); margin-left:10px">Pesa entre 0% e 25% dependendo da disciplina — veja o card "Como funciona a nota" em cada aba.</span>
    </div>

    <div class="disc-cards-grid">${cardsHtml}</div>
  `;
}

// Sub-aba ativa dentro de cada disciplina (uma entrada por disciplina, assim
// trocar de matéria não perde o lugar em que você estava em cada uma).
let discSubTabs = {};
const DISC_SUBTABS = [
  { id: 'notas', label: '📊 Notas' },
  { id: 'cronograma', label: '📅 Cronograma' },
  { id: 'faltas', label: '📋 Faltas' },
  { id: 'conteudo', label: '✅ Conteúdo' }
];
function setDiscSubTab(dId, tab) { discSubTabs[dId] = tab; renderAll(); }

function renderDiscPanel(d) {
  const grades = getSubjectGrades(d.id);
  const m = calcSubjectMetrics(d.id);
  const assessments = d.assessments || [];
  const inputsHtml = assessments.map(av => `
    <div class="grade-box">
      <label title="${av.label}">${av.label}</label>
      <input type="number" step="0.1" max="${av.max || 10}" value="${grades[av.id] !== undefined ? grades[av.id] : ''}" placeholder="0–${av.max || 10}" onblur="updateGrade('${d.id}', '${av.id}', this.value)">
    </div>`).join('');

  const sectionsHtml = (d.sections || []).map((s, si) => renderSection(d, s, si)).join('');
  const subTab = discSubTabs[d.id] || 'notas';
  const subTabsHtml = DISC_SUBTABS.map(t => `<button class="disc-subtab ${subTab === t.id ? 'active' : ''}" style="--tab-color:${d.color}" onclick="setDiscSubTab('${d.id}','${t.id}')">${t.label}</button>`).join('');

  const notasHtml = `
    <div class="grades-input-panel">
      ${d.calcDesc ? `<div class="calc-info-box"><strong>ℹ️ Como funciona a nota:</strong> ${d.calcDesc}</div>` : ''}
      ${inputsHtml}
      ${d.siWeight ? `<div class="grade-box"><label>⭐ Seminário Integrador (${(d.siWeight * 100).toFixed(0)}%)</label><input type="number" step="0.1" value="${userGrades.si || ''}" placeholder="0-10" onblur="updateGlobalSI(this.value)"></div>` : ''}
      <div class="grade-result-box">
        <div style="font-size:0.75rem; color:var(--slate); font-weight:700">Nota Acumulada</div>
        <div style="font-size:1.8rem; font-weight:700; color:${d.color}; font-family:'DM Mono',monospace">${m.atual}</div>
        ${renderGradeBar(m)}
        <div style="text-align:right; margin-top:8px"><span class="st-badge ${m.cls}">${m.status}</span></div>
      </div>
    </div>`;

  const cronogramaHtml = `
    ${d.id === 'ped2' ? renderAmbulatorioPicker() : ''}
    ${d.id === 'cir2' ? renderOftalmoPicker() : ''}
    ${d.id === 'psicomed8' ? renderPsicomedPicker() : ''}
    <div class="dash-title">📅 Próximas aulas e provas</div>
    ${renderDisciplineAgenda(d)}
    <div style="margin-bottom:20px">
      <button class="gcal-btn" onclick="syncToGoogleCalendar('${d.id}')">🗓️ Sincronizar só esta disciplina com a Google Agenda</button>
      <span class="gcal-status" id="gcal-status" style="margin-left:10px"></span>
    </div>`;

  const faltasHtml = renderFaltasSection(d);
  const conteudoHtml = sectionsHtml || `<div class="agenda-empty">Sem conteúdo/checklist cadastrado ainda para esta disciplina.</div>`;

  const bodyBySubTab = { notas: notasHtml, cronograma: cronogramaHtml, faltas: faltasHtml, conteudo: conteudoHtml };

  return `
    <div class="disc-header">
      <div class="disc-title" style="color:${d.color}; font-size:1.4rem">${d.emoji} ${d.fullLabel}</div>
      ${d.code ? `<span style="color:var(--slate);font-size:.78rem;font-family:'DM Mono',monospace">${d.code}</span>` : ''}
    </div>
    <div class="disc-subtabs">${subTabsHtml}</div>
    <div class="disc-subtab-body">${bodyBySubTab[subTab] || ''}</div>
  `;
}

function renderAmbulatorioPicker() {
  const dia = userSettings.ambulatorioPedDia || '';
  const opts = [
    { v: '', l: 'Escolher...' },
    { v: 'terca', l: 'Terça-feira' },
    { v: 'quinta', l: 'Quinta-feira' },
    { v: 'sexta', l: 'Sexta-feira' }
  ].map(o => `<option value="${o.v}" ${dia === o.v ? 'selected' : ''}>${o.l}</option>`).join('');
  return `
    <div class="global-pi-box" style="border-color:${dia ? 'var(--sky)' : '#cbd5e1'}">
      <label>🏥 Dia do Ambulatório de Ped 2 (14h-18h, escolha um: terça, quinta ou sexta):</label>
      <select onchange="updateAmbulatorioDia(this.value)" style="padding:8px;border-radius:8px;border:1px solid #94a3b8;font-family:'DM Mono',monospace">${opts}</select>
      ${dia ? `<span style="font-size:0.75rem;color:var(--slate)">Os eventos já aparecem no calendário e na agenda desta disciplina.</span>` : `<span style="font-size:0.75rem;color:var(--rose)">Escolha um dia para os eventos do ambulatório aparecerem no calendário.</span>`}
    </div>
  `;
}
function updateAmbulatorioDia(val) { userSettings.ambulatorioPedDia = val || null; scheduleSave(); renderAll(); }

function renderSection(d, s, si) {
  const items = s.items || [];
  const { score, max } = getDiscProgress({ sections: [s] });
  const pct = max ? Math.round((score / max) * 100) : 0;

  const itemsHtml = items.map(item => {
    const state = REV_STATES[item.status || 0];
    return `
      <div class="item ${item.status === 3 ? 'done' : ''}" data-id="${item.id}" draggable="true" ondragstart="dragStart(event, '${d.id}', ${si}, '${item.id}')">
        <div class="cb-badge ${state.cls}" onclick="cycleStatus('${d.id}', ${si}, '${item.id}')">${state.label}</div>
        <div class="itext">${item.label}</div>
        <div class="item-actions"><button class="del-btn" onclick="deleteItem('${d.id}', ${si}, '${item.id}')">Excluir</button></div>
      </div>`;
  }).join('');

  return `<div class="section" id="sec-${d.id}-${si}">
    <div class="sec-head">
      <div class="sec-title"><span class="editable-title" contenteditable="true" onblur="updateTitle('${d.id}', ${si}, this.innerText)">${s.title}</span></div>
      <div style="font-size:0.85rem; font-family:'DM Mono', monospace; font-weight:700; color:var(--slate)">${pct}% Concluído</div>
    </div>
    <div class="mini-track" style="margin-bottom:16px; height:8px"><div class="mini-fill" style="width:${pct}%;background:${d.color}"></div></div>
    <div class="checklist" ondragover="event.preventDefault()" ondrop="drop(event, '${d.id}', ${si})">${itemsHtml}</div>
    <button class="add-btn" onclick="addItem('${d.id}', ${si})">+ Adicionar tópico de estudo</button>
  </div>`;
}

// ── INTERACTIONS ──────────────────────────────────────────
function switchTab(id) { activeTab = id; renderAll(); window.scrollTo(0, 0); }
function cycleStatus(dId, si, itemId) {
  const d = userDisciplines.find(x => x.id === dId);
  const item = d.sections[si].items.find(i => i.id === itemId);
  if (item) { item.status = ((item.status || 0) + 1) % 4; scheduleSave(); renderAll(); }
}
function updateGlobalSI(val) { userGrades.si = val; scheduleSave(); renderAll(); }
function updateGrade(dId, avId, val) { if (!userGrades[dId]) userGrades[dId] = {}; userGrades[dId][avId] = val; scheduleSave(); renderAll(); }
function updateTitle(dId, si, text) { text = text.trim(); if (!text) return; userDisciplines.find(x => x.id === dId).sections[si].title = text; scheduleSave(); }
function addItem(dId, si) {
  const text = prompt('Nome do novo tópico:');
  if (text && text.trim()) { userDisciplines.find(x => x.id === dId).sections[si].items.push({ id: genId(), label: text.trim(), status: 0 }); scheduleSave(); renderAll(); }
}
function deleteItem(dId, si, itemId) {
  if (confirm('Tem certeza que deseja excluir este tópico?')) {
    const s = userDisciplines.find(x => x.id === dId).sections[si];
    s.items = s.items.filter(i => i.id !== itemId); scheduleSave(); renderAll();
  }
}

// ── DRAG & DROP (checklist) ──────────────────────────────
let dragContext = null;
function dragStart(e, dId, si, itemId) {
  dragContext = { dId, si, itemId };
  e.dataTransfer.setData('text/plain', itemId);
  setTimeout(() => e.target.classList.add('dragging'), 0);
}
function drop(e, targetDId, targetSi) {
  e.preventDefault();
  if (!dragContext || dragContext.dId !== targetDId) return alert('Só é possível arrastar dentro da mesma disciplina.');
  const d = userDisciplines.find(x => x.id === targetDId);
  const srcSec = d.sections[dragContext.si], tgtSec = d.sections[targetSi];
  const itemIdx = srcSec.items.findIndex(i => i.id === dragContext.itemId);
  if (itemIdx === -1) return;
  const [movedItem] = srcSec.items.splice(itemIdx, 1);
  const dropTarget = e.target.closest('.item');
  if (dropTarget) {
    const tIdx = tgtSec.items.findIndex(i => i.id === dropTarget.dataset.id);
    if (tIdx !== -1) tgtSec.items.splice(tIdx, 0, movedItem); else tgtSec.items.push(movedItem);
  } else { tgtSec.items.push(movedItem); }
  dragContext = null; scheduleSave(); renderAll();
}

// ── COUNTDOWN ─────────────────────────────────────────────
function startCountdown() {
  const target = new Date('2026-12-14T23:59:59').getTime();
  setInterval(() => {
    const now = new Date().getTime(), diff = target - now;
    const el = document.getElementById('cd-val');
    if (!el) return;
    if (diff < 0) { el.textContent = 'FIM!'; return; }
    const d = Math.floor(diff / 86400000), h = Math.floor((diff % 86400000) / 3600000), m = Math.floor((diff % 3600000) / 60000);
    el.textContent = `${d.toString().padStart(2, '0')}:${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}`;
  }, 1000);
  // Atualiza o "Acontecendo agora" a cada 60s, sem re-renderizar o dashboard
  // inteiro (para não perder foco de inputs abertos em outras abas).
  setInterval(() => {
    const wrap = document.querySelector('#panel-resumo .nn-wrap, #panel-resumo .nn-empty');
    if (wrap && activeTab === 'resumo') {
      const container = document.createElement('div');
      container.innerHTML = renderNowAndNext();
      wrap.replaceWith(container.firstElementChild);
    }
  }, 60 * 1000);
}
