// ══════════════════════════════════════════════════════════
//  RODÍZIO DE OFTALMOLOGIA — Cirurgia 2
//  Dados extraídos de "Grupos - Cirurgia 4.xlsx" (abas "Grupos" e "Oftalmo").
//  Dinâmica combinada pela turma para evitar superlotação no ambulatório:
//  - Quem tem Ped 2 (ambulatório) na terça à tarde é "fixo" e só vai à oftalmo
//    nas segundas-feiras do bloco do seu grupo.
//  - Os demais alunos de cada grupo formam 2 subgrupos que se revezam:
//    numa semana vão à segunda, na semana seguinte à terça (novo horário
//    exclusivo da oftalmo), ao longo de 6 sessões no semestre.
// ══════════════════════════════════════════════════════════

// Rosters (referência) — exatamente como na planilha, para você confirmar seu nome.
const GRUPOS_CIRURGIA = {
  A: ['Filipe Téofilo','Martina Fortes','João Pedro','Ana Clara','Rafael Lopes','Joziane','Victor Matheus','Julia','Laryssa','Letícia','Nicholas','Duda','Victor Gabriel','Biatriz','Isabela Paulista'],
  B: ['Isabella','Itamara','Henry','Rafaella','Dávia','Gabriela','Clara','Lalesca','Fiuza','Gustavo','Ana Pinto','Emillen','Daniel Luiz','Patrícia','Milena'],
  C: ['Gabriel Frota','Lucas Feliciano','Pedro Guedes','Pedro Vicenzo','Rafael Machado','Pedro César','Lucas Vaz','Luís Filipe','Débora','Pedro Luís','Vitor José','Maria Clara Brito','Ludmila','Dainara','Geovana'],
  D: ['Deivys','ALMUETASIM ALBEKSH','Sthefan Bruno','Luiza Barros','Audir Guimaraes','Endrio','Maria Mercedes','Milene','Miriã','Luana','Ana Carolina','Paulo','Rodrigo','Estevão','Guilherme']
};

const OFTALMO_SUBGRUPOS = {
  A1: ['Nicholas','Laryssa','Letícia','Duda'],
  A2: ['Isabela Paulista','Victor Gabriel','Julia','Biatriz'],
  B1: ['Gabriela','Lalesca','Clara','Fiuza','Gustavo'],
  B2: ['Ana Pinto','Emillen','Daniel Luiz','Patrícia','Milena'],
  C1: ['Pedro César','Lucas Vaz','Luís Filipe','Geovana','Débora'],
  C2: ['Pedro Luís','Maria Clara Brito','Vitor José','Dainara','Ludmila'],
  D1: ['Ana Carolina','Paulo','Luana','Estevão','Guilherme'],
  D2: ['Rodrigo','Milene','Maria Mercedes','Miriã']
};

// Datas do rodízio (uma sessão = 14h-16h). A1=C1 e A2=C2, B1=D1 e B2=D2 sempre
// se revezam juntos (mesma data), por isso os subgrupos "espelho" compartilham a lista.
const OFTALMO_DATES = {
  AC1: ['2026-09-28','2026-10-06','2026-10-19','2026-11-24','2026-11-30','2026-12-08'],
  AC2: ['2026-09-29','2026-10-05','2026-10-20','2026-11-23','2026-12-01','2026-12-07'],
  BD1: ['2026-08-17','2026-08-25','2026-08-31','2026-10-27','2026-11-09','2026-11-17'],
  BD2: ['2026-08-18','2026-08-24','2026-09-01','2026-10-26','2026-11-10','2026-11-16'],
  FIXO_AC: ['2026-09-28','2026-10-05','2026-10-19','2026-11-23','2026-11-30','2026-12-07'],
  FIXO_BD: ['2026-08-17','2026-08-24','2026-08-31','2026-10-26','2026-11-09','2026-11-16']
};

// ── RODÍZIO COMPLETO DE SEGUNDA-FEIRA (manhã + tarde) ──
// Cada grupo passa por 4 blocos de 3 segundas-feiras ao longo do semestre,
// alternando entre 4 estações da manhã (Anestesia CC, Ortopedia Consultório,
// Anestesia Simulação, Ortopedia B) e a estação da tarde correspondente
// (Otorrino ou Oftalmo). Só a tarde de Oftalmo tem o revezamento por subgrupo
// (ver OFTALMO_DATES acima) — Otorrino e as 4 manhãs valem para o grupo inteiro.
const CIRURGIA_RODIZIO_BLOCKS = {
  A: [
    { mondays: ['2026-08-17', '2026-08-24', '2026-08-31'], manha: 'Anestesia CC', tarde: 'Otorrino' },
    { mondays: ['2026-09-28', '2026-10-05', '2026-10-19'], manha: 'Ortopedia (Consultório)', tarde: 'Oftalmo' },
    { mondays: ['2026-10-26', '2026-11-09', '2026-11-16'], manha: 'Anestesia (Simulação)', tarde: 'Otorrino' },
    { mondays: ['2026-11-23', '2026-11-30', '2026-12-07'], manha: 'Ortopedia B', tarde: 'Oftalmo' }
  ],
  B: [
    { mondays: ['2026-08-17', '2026-08-24', '2026-08-31'], manha: 'Ortopedia (Consultório)', tarde: 'Oftalmo' },
    { mondays: ['2026-09-28', '2026-10-05', '2026-10-19'], manha: 'Anestesia (Simulação)', tarde: 'Otorrino' },
    { mondays: ['2026-10-26', '2026-11-09', '2026-11-16'], manha: 'Ortopedia B', tarde: 'Oftalmo' },
    { mondays: ['2026-11-23', '2026-11-30', '2026-12-07'], manha: 'Anestesia CC', tarde: 'Otorrino' }
  ],
  C: [
    { mondays: ['2026-08-17', '2026-08-24', '2026-08-31'], manha: 'Anestesia (Simulação)', tarde: 'Otorrino' },
    { mondays: ['2026-09-28', '2026-10-05', '2026-10-19'], manha: 'Ortopedia B', tarde: 'Oftalmo' },
    { mondays: ['2026-10-26', '2026-11-09', '2026-11-16'], manha: 'Anestesia CC', tarde: 'Otorrino' },
    { mondays: ['2026-11-23', '2026-11-30', '2026-12-07'], manha: 'Ortopedia (Consultório)', tarde: 'Oftalmo' }
  ],
  D: [
    { mondays: ['2026-08-17', '2026-08-24', '2026-08-31'], manha: 'Ortopedia B', tarde: 'Oftalmo' },
    { mondays: ['2026-09-28', '2026-10-05', '2026-10-19'], manha: 'Anestesia CC', tarde: 'Otorrino' },
    { mondays: ['2026-10-26', '2026-11-09', '2026-11-16'], manha: 'Ortopedia (Consultório)', tarde: 'Oftalmo' },
    { mondays: ['2026-11-23', '2026-11-30', '2026-12-07'], manha: 'Anestesia (Simulação)', tarde: 'Otorrino' }
  ]
};

// dias da semana (para o rótulo do evento — todas as datas acima já vêm marcadas
// como Seg ou Ter na planilha original; recalculamos aqui a partir da própria data)
function oftalmoDiaLabel(iso) {
  const dow = new Date(iso + 'T00:00:00').getDay();
  return dow === 1 ? 'Segunda' : dow === 2 ? 'Terça' : '?';
}

function getOftalmoDatesFor(grupo, tipo) {
  if (!grupo || !tipo) return [];
  const par = (grupo === 'A' || grupo === 'C') ? 'AC' : 'BD';
  if (tipo === 'fixo') return OFTALMO_DATES['FIXO_' + par];
  if (tipo === 'sub1') return OFTALMO_DATES[par + '1'];
  if (tipo === 'sub2') return OFTALMO_DATES[par + '2'];
  return [];
}

function buildOftalmoEvents() {
  const grupo = userSettings.cirurgiaGrupo, tipo = userSettings.cirurgiaOftalmoTipo;
  const dates = getOftalmoDatesFor(grupo, tipo);
  return dates.map((iso, i) => ({
    date: iso, time: '14:00', type: 'estagio',
    title: `Rodízio tarde — Oftalmo (${oftalmoDiaLabel(iso)} — Grupo ${grupo}${tipo === 'fixo' ? ', fixo' : tipo === 'sub1' ? ', subgrupo 1' : ', subgrupo 2'})`,
    _key: 'oft-' + i
  }));
}

// Gera os eventos de manhã (todas as 4 estações) e de Otorrino à tarde — sempre
// para o grupo inteiro, sem revezamento por subgrupo (isso só existe na Oftalmo).
function buildCirurgiaRodizioEvents() {
  const grupo = userSettings.cirurgiaGrupo;
  const blocks = CIRURGIA_RODIZIO_BLOCKS[grupo];
  if (!blocks) return [];
  const out = [];
  let i = 0;
  blocks.forEach(block => {
    block.mondays.forEach(date => {
      out.push({ date, time: '08:00', type: 'estagio', title: `Rodízio manhã — ${block.manha} (Grupo ${grupo})`, _key: 'rodm-' + (i++) });
      if (block.tarde === 'Otorrino') {
        out.push({ date, time: '14:00', type: 'estagio', title: `Rodízio tarde — Otorrino (Grupo ${grupo})`, _key: 'rodt-' + (i++) });
      }
      // A tarde de Oftalmo é gerada à parte por buildOftalmoEvents(), pois depende do subgrupo.
    });
  });
  return out;
}

function renderCirurgiaBlocksSummary(grupo) {
  const blocks = CIRURGIA_RODIZIO_BLOCKS[grupo];
  if (!blocks) return '';
  const rows = blocks.map(b => {
    const ini = b.mondays[0], fim = b.mondays[b.mondays.length - 1];
    const fmt = iso => new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
    return `<tr><td>${fmt(ini)} – ${fmt(fim)}</td><td>${b.manha}</td><td>${b.tarde}${b.tarde === 'Oftalmo' ? ' (segue seu subgrupo)' : ''}</td></tr>`;
  }).join('');
  return `<table class="provas-table" style="margin-top:10px"><thead><tr><th>Semanas</th><th>Manhã (8h-10h)</th><th>Tarde (14h-16h)</th></tr></thead><tbody>${rows}</tbody></table>`;
}

function renderOftalmoPicker() {
  const grupo = userSettings.cirurgiaGrupo || '';
  const tipo = userSettings.cirurgiaOftalmoTipo || '';
  const grupoOpts = ['', 'A', 'B', 'C', 'D'].map(g => `<option value="${g}" ${grupo === g ? 'selected' : ''}>${g ? 'Grupo ' + g : 'Escolher grupo...'}</option>`).join('');
  const tipoOpts = [
    { v: '', l: 'Escolher situação...' },
    { v: 'fixo', l: 'Fixo (tenho Ped 2 na terça à tarde — só vou segunda)' },
    { v: 'sub1', l: 'Subgrupo 1 (reveza segunda/terça)' },
    { v: 'sub2', l: 'Subgrupo 2 (reveza segunda/terça)' }
  ].map(o => `<option value="${o.v}" ${tipo === o.v ? 'selected' : ''}>${o.l}</option>`).join('');

  let rosterHtml = '';
  if (grupo) {
    const s1 = OFTALMO_SUBGRUPOS[grupo + '1'] || [], s2 = OFTALMO_SUBGRUPOS[grupo + '2'] || [];
    rosterHtml = `
      <div class="import-preview" style="margin-top:12px">
        <h4>👥 Rodízio de Oftalmo — Grupo ${grupo}</h4>
        <div style="display:grid;grid-template-columns:1fr 1fr;gap:16px;margin-top:8px">
          <div><b>Subgrupo 1</b><div class="pill-list">${s1.map(n => `<span>${n}</span>`).join('')}</div></div>
          <div><b>Subgrupo 2</b><div class="pill-list">${s2.map(n => `<span>${n}</span>`).join('')}</div></div>
        </div>
        <div style="margin-top:10px;font-size:.78rem;color:var(--slate)">Quem do Grupo ${grupo} não está em nenhuma lista acima tem conflito de horário com Ped 2 na terça e é <b>"Fixo"</b> — vai só às segundas.</div>
      </div>`;
  }

  return `
    <div class="global-pi-box" style="border-color:${grupo && tipo ? 'var(--sky)' : '#cbd5e1'};flex-direction:column;align-items:flex-start;gap:10px">
      <label>🔬 Rodízios de Cirurgia 2 (Anestesia, Ortopedia, Otorrino, Oftalmo) — selecione seu grupo e situação:</label>
      <div style="display:flex;gap:10px;flex-wrap:wrap">
        <select onchange="updateCirurgiaGrupo(this.value)" style="padding:8px;border-radius:8px;border:1px solid #94a3b8;font-family:'DM Mono',monospace">${grupoOpts}</select>
        <select onchange="updateCirurgiaOftalmoTipo(this.value)" style="padding:8px;border-radius:8px;border:1px solid #94a3b8;font-family:'DM Mono',monospace">${tipoOpts}</select>
      </div>
      ${grupo && tipo ? `<span style="font-size:0.75rem;color:var(--slate)">Todos os seus rodízios (manhã + tarde) já aparecem na agenda abaixo e no calendário.</span>` : grupo ? `<span style="font-size:0.75rem;color:var(--rose)">Escolha sua situação (fixo/subgrupo 1/subgrupo 2) para a tarde de Oftalmo entrar certinha na agenda — as manhãs e o Otorrino já valem só com o grupo escolhido.</span>` : ''}
      ${grupo ? renderCirurgiaBlocksSummary(grupo) : ''}
      ${rosterHtml}
    </div>
  `;
}
function updateCirurgiaGrupo(val) { userSettings.cirurgiaGrupo = val || null; scheduleSave(); renderAll(); }
function updateCirurgiaOftalmoTipo(val) { userSettings.cirurgiaOftalmoTipo = val || null; scheduleSave(); renderAll(); }
