// ══════════════════════════════════════════════════════════
//  LISTA DE ALUNOS POR DIA DE OSCE — SFC 5
//  Referência (para você confirmar seu nome), como nas listas de grupos
//  de Cirurgia 2 e Psicomed 8 — cada aluno faz o OSCE em uma única data.
// ══════════════════════════════════════════════════════════

const OSCE_ROSTERS = {
  '2026-09-09': ['Miriã','Joziane','Endrio','Letícia','Maria Eduarda','Laryssa','Gustavo','Ludmila','Dainara','Milene','Gabriela','Biatriz','Nicholas','Débora','Victor Gabriel','Julia','Isabela Paulista','Maria Clara Amorim','Itamara','Maria Mercedes','Pedro Luís'],
  '2026-11-25': ['Daniel Cuoco','Ana Carolina','Paulo','Luana','Emillen','Henry','Isabella','Ana Luiza Pinto','Milena','Ana Clara','João Pedro','Caetano','Vitor José','Rafael Medeiros','Rodrigo','Daniel Luiz','Pedro Vicenzo','Lucas Feliciano Lopes','Rafael Machado'],
  '2026-12-09': ['Guilherme','Filipe','Martina','Dávia Toledo','Rafaella Thomas','Lalesca','Geovana','Sthefan Bruno','Luiza Barros','Audir Guimaraes','Deivys','Gabriel Frota','Pedro César','Luís Filipe','Lucas Vaz','Maria Clara B','ALMUETASIM','Victor Matheus','Pedro Fiuza','Estêvão André','Pedro Guedes']
};

function renderOsceRoster() {
  const fmt = iso => new Date(iso + 'T00:00:00').toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit' });
  const blocks = Object.entries(OSCE_ROSTERS).map(([date, names], i) => `
    <div>
      <b>OSCE ${i + 1} — ${fmt(date)}</b>
      <div class="pill-list">${names.map(n => `<span>${n}</span>`).join('')}</div>
    </div>
  `).join('');
  return `
    <div class="import-preview" style="margin-top:12px;margin-bottom:16px">
      <h4>🧪 Lista de alunos por dia de OSCE</h4>
      <div style="font-size:.78rem;color:var(--slate);margin-bottom:10px">Cada aluno faz o OSCE em uma única data — procure seu nome pra saber a sua.</div>
      <div style="display:grid;gap:14px">${blocks}</div>
    </div>`;
}
