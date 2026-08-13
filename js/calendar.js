// ══════════════════════════════════════════════════════════
//  CALENDÁRIO — unificado (todas as disciplinas) e filtrável por
//  disciplina (calendário "separado"), com visões Mês/Semana/Dia/Provas
//  e sincronização opcional com a Google Agenda do usuário logado.
// ══════════════════════════════════════════════════════════

const GCAL_APP_CALENDAR_NAME = '🎓 Medicina 8º Sem — 117';

let calendarInstance = null;
let calendarFilters = {};   // disciplineId -> bool (visível?)
let calendarCurrentView = 'mes';

function buildAllEvents() {
  const events = [];
  userDisciplines.forEach(d => {
    (d.schedule || []).forEach((ev, idx) => {
      const isProva = ev.type === 'prova';
      events.push({
        id: `${d.id}-${idx}`,
        title: `${d.emoji} ${ev.title}`,
        start: ev.date + (ev.time ? 'T' + ev.time : ''),
        allDay: !ev.time,
        backgroundColor: isProva ? '#e11d48' : d.color,
        borderColor: isProva ? '#e11d48' : d.color,
        extendedProps: {
          disciplineId: d.id, disciplineLabel: d.label, disciplineEmoji: d.emoji,
          type: ev.type, rawTitle: ev.title, dateRaw: ev.date
        }
      });
    });
  });
  return events;
}

function getFilteredEvents() {
  return buildAllEvents().filter(e => calendarFilters[e.extendedProps.disciplineId] !== false);
}

function renderCalendarTab() {
  userDisciplines.forEach(d => { if (calendarFilters[d.id] === undefined) calendarFilters[d.id] = true; });

  const chips = userDisciplines.map(d => {
    const on = calendarFilters[d.id] !== false;
    return `<div class="cal-chip ${on ? 'on' : ''}" style="${on ? `background:${d.color};border-color:${d.color}` : ''}" onclick="toggleCalFilter('${d.id}')">${d.emoji} ${d.label}</div>`;
  }).join('');

  const views = [
    { id: 'mes', label: 'Mês' }, { id: 'semana', label: 'Semana' },
    { id: 'dia', label: 'Dia' }, { id: 'provas', label: '📝 Provas' }
  ];
  const viewBtns = views.map(v => `<button class="cal-view-btn ${calendarCurrentView === v.id ? 'active' : ''}" onclick="setCalView('${v.id}')">${v.label}</button>`).join('');

  return `
    <div class="dash-title" style="margin-bottom:14px">📅 Calendário do Semestre</div>
    <div class="info-box">Marque/desmarque as disciplinas abaixo para ver o <b>calendário unificado</b> ou <b>filtrar uma única disciplina</b>. Use "Sincronizar Google Agenda" para copiar os eventos para a sua própria conta Google (cria uma agenda chamada "${GCAL_APP_CALENDAR_NAME}").</div>
    <div class="cal-toolbar">
      <div class="cal-filters">${chips}</div>
      <div style="display:flex;gap:10px;align-items:center;flex-wrap:wrap">
        <div class="cal-view-switch">${viewBtns}</div>
        <button class="gcal-btn" id="gcal-sync-btn" onclick="syncToGoogleCalendar()">🗓️ Sincronizar Google Agenda</button>
      </div>
    </div>
    <div class="gcal-status" id="gcal-status" style="margin-bottom:12px"></div>
    <div id="calendar-el" style="display:${calendarCurrentView === 'provas' ? 'none' : 'block'}"></div>
    <div id="provas-table-wrap" style="display:${calendarCurrentView === 'provas' ? 'block' : 'none'}">${calendarCurrentView === 'provas' ? renderProvasTable() : ''}</div>
  `;
}

function initFullCalendarIfNeeded() {
  const el = document.getElementById('calendar-el');
  if (!el || typeof FullCalendar === 'undefined') return;
  if (calendarInstance) { calendarInstance.destroy(); calendarInstance = null; }
  const viewMap = { mes: 'dayGridMonth', semana: 'timeGridWeek', dia: 'timeGridDay' };
  calendarInstance = new FullCalendar.Calendar(el, {
    initialView: viewMap[calendarCurrentView] || 'dayGridMonth',
    height: 'auto',
    locale: 'pt-br',
    firstDay: 1,
    headerToolbar: { left: 'prev,next today', center: 'title', right: '' },
    events: getFilteredEvents(),
    eventClick: function (info) {
      const p = info.event.extendedProps;
      alert(`${p.disciplineEmoji} ${p.disciplineLabel}\n${p.rawTitle}\n📅 ${p.dateRaw}`);
    }
  });
  calendarInstance.render();
}

function toggleCalFilter(dId) {
  calendarFilters[dId] = !calendarFilters[dId];
  renderAll();
}

function setCalView(view) {
  calendarCurrentView = view;
  renderAll();
}

function renderProvasTable() {
  const events = buildAllEvents()
    .filter(e => e.extendedProps.type === 'prova')
    .filter(e => calendarFilters[e.extendedProps.disciplineId] !== false)
    .sort((a, b) => a.start.localeCompare(b.start));

  if (!events.length) return `<div class="agenda-empty">Nenhuma prova cadastrada para as disciplinas selecionadas.</div>`;

  const rows = events.map(e => {
    const p = e.extendedProps;
    const d = new Date(p.dateRaw + 'T00:00:00');
    const dataFmt = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric', weekday: 'short' });
    const diffDays = Math.ceil((d - new Date(new Date().toDateString())) / 86400000);
    const diffLabel = diffDays < 0 ? 'já passou' : diffDays === 0 ? 'hoje!' : `em ${diffDays} dias`;
    return `<tr>
      <td><b>${dataFmt}</b><br><span style="color:var(--slate);font-size:.72rem">${diffLabel}</span></td>
      <td><span class="st-badge neut" style="background:${p.disciplineEmoji ? '' : ''}">${p.disciplineEmoji} ${p.disciplineLabel}</span></td>
      <td>${p.rawTitle}</td>
    </tr>`;
  }).join('');

  return `<table class="provas-table"><thead><tr><th>Data</th><th>Disciplina</th><th>Prova</th></tr></thead><tbody>${rows}</tbody></table>`;
}

// ── AGENDA (lista) por disciplina — usada dentro do painel da matéria ──
function renderDisciplineAgenda(d) {
  const events = (d.schedule || []).slice().sort((a, b) => a.date.localeCompare(b.date));
  if (!events.length) return `<div class="agenda-empty">Sem cronograma cadastrado.</div>`;
  const today = new Date().toISOString().slice(0, 10);
  const items = events.map(ev => {
    const dt = new Date(ev.date + 'T00:00:00');
    const day = dt.getDate().toString().padStart(2, '0');
    const month = dt.toLocaleDateString('pt-BR', { month: 'short' }).replace('.', '');
    const meta = EVENT_TYPE_META[ev.type] || { label: ev.type, color: '#94a3b8' };
    const past = ev.date < today ? 'opacity:.5' : '';
    return `<div class="agenda-item" style="${past}">
      <div class="agenda-date"><div class="d">${day}</div><div class="m">${month}</div></div>
      <span class="agenda-type" style="background:${meta.color}22;color:${meta.color}">${meta.label}</span>
      <div class="agenda-body"><div class="agenda-title">${ev.title}</div></div>
    </div>`;
  }).join('');
  return `<div class="agenda-list">${items}</div>`;
}

// ── SINCRONIZAÇÃO COM GOOGLE AGENDA ──────────────────────────
async function gcalFetch(token, url, opts) {
  const resp = await fetch(url, { ...opts, headers: { Authorization: `Bearer ${token}`, 'Content-Type': 'application/json', ...(opts && opts.headers) } });
  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`Google Agenda API ${resp.status}: ${body.slice(0, 200)}`);
  }
  return resp.status === 204 ? null : resp.json();
}

async function getOrCreateAppCalendar(token) {
  const list = await gcalFetch(token, 'https://www.googleapis.com/calendar/v3/users/me/calendarList');
  const existing = (list.items || []).find(c => c.summary === GCAL_APP_CALENDAR_NAME);
  if (existing) return existing.id;
  const created = await gcalFetch(token, 'https://www.googleapis.com/calendar/v3/calendars', {
    method: 'POST',
    body: JSON.stringify({ summary: GCAL_APP_CALENDAR_NAME, description: 'Criado automaticamente pelo Dashboard MED 117 (8º semestre). Pode excluir esta agenda a qualquer momento nas configurações da Google Agenda.' })
  });
  return created.id;
}

async function upsertGCalEvent(token, calendarId, ev) {
  const q = new URLSearchParams({ privateExtendedProperty: `appEventId=${ev.id}` });
  const search = await gcalFetch(token, `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events?${q}`);
  const meta = EVENT_TYPE_META[ev.extendedProps.type] || { label: ev.extendedProps.type };
  const body = {
    summary: ev.title,
    description: `${ev.extendedProps.disciplineLabel} — ${meta.label}`,
    extendedProperties: { private: { appEventId: ev.id } }
  };
  if (ev.allDay) {
    body.start = { date: ev.extendedProps.dateRaw };
    body.end = { date: ev.extendedProps.dateRaw };
  } else {
    const startDt = new Date(ev.start);
    const endDt = new Date(startDt.getTime() + 60 * 60000);
    body.start = { dateTime: startDt.toISOString(), timeZone: 'America/Sao_Paulo' };
    body.end = { dateTime: endDt.toISOString(), timeZone: 'America/Sao_Paulo' };
  }
  if (search.items && search.items.length) {
    await gcalFetch(token, `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events/${search.items[0].id}`, { method: 'PATCH', body: JSON.stringify(body) });
  } else {
    await gcalFetch(token, `https://www.googleapis.com/calendar/v3/calendars/${encodeURIComponent(calendarId)}/events`, { method: 'POST', body: JSON.stringify(body) });
  }
}

async function syncToGoogleCalendar(onlyDisciplineId) {
  const btn = document.getElementById('gcal-sync-btn');
  const statusEl = document.getElementById('gcal-status');
  try {
    if (btn) btn.disabled = true;
    if (statusEl) statusEl.textContent = 'Conectando à Google Agenda (autorize o acesso na janela do Google)...';
    const token = await ensureGCalToken();
    const calendarId = await getOrCreateAppCalendar(token);
    let events = getFilteredEvents();
    if (onlyDisciplineId) events = events.filter(e => e.extendedProps.disciplineId === onlyDisciplineId);
    let done = 0;
    for (const ev of events) {
      await upsertGCalEvent(token, calendarId, ev);
      done++;
      if (statusEl) statusEl.textContent = `Sincronizando... ${done}/${events.length}`;
    }
    if (statusEl) statusEl.textContent = `✅ ${done} eventos sincronizados com "${GCAL_APP_CALENDAR_NAME}" na sua Google Agenda.`;
  } catch (e) {
    console.error(e);
    if (statusEl) statusEl.textContent = '❌ ' + e.message + ' — veja o README para configurar a Calendar API no Google Cloud Console.';
  } finally {
    if (btn) btn.disabled = false;
  }
}
