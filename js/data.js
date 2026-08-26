// ══════════════════════════════════════════════════════════
//  DADOS DAS DISCIPLINAS — 8º Semestre Medicina UnB — Turma 117 — 2/2026
//  Extraídos dos Planos de Ensino/Cronogramas oficiais em 2026-08-13.
//  Onde o documento não trouxe a informação, isso é indicado explicitamente
//  em calcDesc/notes — não foram inventados pesos ou datas.
// ══════════════════════════════════════════════════════════

const genId = () => Math.random().toString(36).substr(2, 9);

// Gera um cronograma semanal genérico (usado pelas disciplinas "placeholder" abaixo,
// que ainda não tiveram a ementa importada — só sabemos o horário fixo delas).
function buildWeeklyPlaceholderSchedule(startISO, endISO, dow, time, skipISO, label, local) {
  const out = [];
  const start = new Date(startISO + 'T00:00:00');
  const end = new Date(endISO + 'T00:00:00');
  const d = new Date(start);
  while (d.getDay() !== dow) d.setDate(d.getDate() + 1);
  while (d <= end) {
    const iso = d.toISOString().slice(0, 10);
    if (!skipISO.includes(iso)) out.push({ date: iso, time, dur: 120, type: 'aula', title: label, local });
    d.setDate(d.getDate() + 7);
  }
  return out;
}

// Estados do checklist de revisão (usados também pelo app.js)
const REV_STATES = [
  { label: '📚 Estudar', cls: 's-0', icon: '📚' },
  { label: '✅ Estudado', cls: 's-1', icon: '✅' },
  { label: '🔄 Rev. 1', cls: 's-2', icon: '🔄' },
  { label: '⭐ Dominado', cls: 's-3', icon: '⭐' }
];

const TEMPLATE_DISCIPLINES = [

// ────────────────────────────────────────────────────────
// 1) UE-PED — Urgência e Emergência em Pediatria 3 (FMD0056)
// ────────────────────────────────────────────────────────
{
  id: 'ueped', label: 'UE-PED', emoji: '🚑', fullLabel: 'Urgência e Emergência em Pediatria 3',
  code: 'FMD0056', color: '#dc2626', fill: '#f87171',
  siWeight: 0.25, passingGrade: 5.0,
  calcDesc: 'MF = (Avaliação 1 + Avaliação 2 + Seminário Integrador + Nota de Presença/Forms) ÷ 4 — cada componente vale 25%. Há bônus de até <b>+0,5</b> por boa participação/Forms &gt;8 e mais <b>+0,5</b> pela atividade de extensão em vídeo (não incluído automaticamente no cálculo — some manualmente se aplicável). Insira as notas de 0 a 10. Nota mínima para aprovação: 5,0. Segunda chamada disponível mediante atestado.',
  assessments: [
    { id: 'av1', label: 'Avaliação Parcial (20/10)', weight: 0.25, max: 10 },
    { id: 'av2', label: 'Avaliação Final (01/12)', weight: 0.25, max: 10 },
    { id: 'presenca', label: 'Nota de Presença/Forms', weight: 0.25, max: 10 }
  ],
  sections: [
    { title: '1ª Avaliação (até 20/10)', items: ['Introdução à disciplina / MINI PALS','Bronquiolite viral aguda','Distúrbios Respiratórios (Laringite/Crise; OVACE)','Asma — Crise','Convulsões em PS PED','PCR (Parada Cardiorrespiratória)','Oxigenoterapia','Lab. Simulação — Ventilação','Lab. Simulação — PCR','Febre sem sinais localizatórios','Criança Gravemente Enferma','Choque séptico','Cetoacidose diabética'] },
    { title: '2ª Avaliação (até 01/12)', items: ['Meningite e Encefalite','Hidratação em Emergência Pediátrica','ITU em Emergência','Intoxicações','Distúrbio Ácido-Básico','TCE (Traumatismo Cranioencefálico)','Urgências Dermatológicas','Queimados','Cefaleia','Emergências Hematológicas'] },
    { title: 'Atividade de Extensão (vídeos — entrega 24/11)', items: ['Reidratação oral em casa','Uso do DEA em ambiente público','RCP em público e em ambiente hospitalar','Desfibrilador manual (FV/TV sem pulso)','Convulsão febril no PS PED','Manobras de desengasgo (lactente/criança/adulto)','Laringite/crupe — quando pensar e tratar','Bronquiolite — quando pensar e tratar','Asma por faixa etária — abordagem no PS PED','Cetoacidose diabética — suspeita e tratamento','Plano de Ação para Asma'] }
  ],
  // Horário fixo semanal: Terça e Quarta, bloco 10h-11h (Turma A/C) ou 11h-12h (Turma B/D).
  // Exceção: os Laboratórios de Simulação (set/out) têm 5 turmas (A-E) em horários
  // específicos por sessão, conforme o cronograma atualizado em 2026-08 (ver abaixo).
  schedule: [
    {date:'2026-08-11', time:'10:00', type:'aula', title:'Introdução à disciplina', prof:'Meimei', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'},
    {date:'2026-08-12', time:'10:00', type:'aula', title:'MINI PALS', prof:'Meimei', local:'BSA Sul - Bloco Térreo (sala 41/10)'},
    {date:'2026-08-18', time:'10:00', type:'aula', title:'Bronquiolite viral aguda', prof:'Cássia', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'},
    {date:'2026-08-19', time:'10:00', type:'aula', title:'Distúrbios Respiratórios (Laringite/Crise; OVACE)', prof:'Cássia', local:'BSA Sul - Bloco Térreo (sala 41/10)'},
    {date:'2026-08-25', time:'10:00', type:'aula', title:'Convulsões em PS PED', prof:'Meimei', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'},
    {date:'2026-08-26', time:'10:00', type:'aula', title:'Asma — Crise', prof:'Cássia', local:'BSA Sul - Bloco Térreo (sala 41/10)'},
    {date:'2026-09-01', time:'10:00', type:'aula', title:'PCR', prof:'Meimei', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'},
    {date:'2026-09-02', time:'10:00', type:'aula', title:'Oxigenoterapia', prof:'Meimei', local:'BSA Sul - Bloco Térreo (sala 41/10)'},
    {date:'2026-09-08', time:'10:00', type:'estagio', title:'Lab. Simulação — Ventilação (Turma A)', local:'Lab. Simulação HUB - Unidade II', prof:'Cássia e Meimei'},
    {date:'2026-09-08', time:'12:00', type:'estagio', title:'Lab. Simulação — Ventilação (Turma B)', local:'Lab. Simulação HUB - Unidade II', prof:'Cássia e Meimei'},
    {date:'2026-09-09', time:'10:00', type:'aula', title:'PCR', prof:'Karina', local:'BSA Sul - Bloco Térreo (sala 41/10)'},
    {date:'2026-09-15', time:'10:00', type:'seminario', title:'Seminário Integrador (14 a 17/09)', prof:'Cássia e Meimei', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'},
    {date:'2026-09-16', time:'10:00', type:'seminario', title:'Seminário Integrador (14 a 17/09)', prof:'Meimei', local:'BSA Sul - Bloco Térreo (sala 41/10)'},
    {date:'2026-09-22', time:'10:00', type:'aula', title:'Febre sem sinais localizatórios', prof:'Cássia', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'},
    {date:'2026-09-23', time:'10:00', type:'aula', title:'Criança Gravemente Enferma', prof:'Felipe', local:'BSA Sul - Bloco Térreo (sala 41/10)'},
    {date:'2026-09-29', time:'10:00', type:'estagio', title:'Lab. Simulação — Ventilação (Turma C)', local:'Lab. Simulação HUB - Unidade II', prof:'Cássia e Meimei'},
    {date:'2026-09-29', time:'12:00', type:'estagio', title:'Lab. Simulação — Ventilação (Turma D)', local:'Lab. Simulação HUB - Unidade II', prof:'Cássia e Meimei'},
    {date:'2026-09-30', time:'10:00', type:'estagio', title:'Lab. Simulação — Ventilação (Turma E)', local:'Lab. Simulação HUB - Unidade II', prof:'Cássia e Meimei'},
    {date:'2026-09-30', time:'11:00', type:'estagio', title:'Lab. Simulação — PCR (Turma A)', local:'Lab. Simulação HUB - Unidade II', prof:'Cássia e Meimei'},
    {date:'2026-10-06', time:'10:00', type:'estagio', title:'Lab. Simulação — PCR (Turma B)', local:'Lab. Simulação HUB - Unidade II', prof:'Cássia e Meimei'},
    {date:'2026-10-06', time:'12:00', type:'estagio', title:'Lab. Simulação — PCR (Turma C)', local:'Lab. Simulação HUB - Unidade II', prof:'Cássia e Meimei'},
    {date:'2026-10-07', time:'10:00', type:'estagio', title:'Lab. Simulação — PCR (Turma D)', local:'Lab. Simulação HUB - Unidade II', prof:'Cássia e Meimei'},
    {date:'2026-10-07', time:'11:00', type:'estagio', title:'Lab. Simulação — PCR (Turma E)', local:'Lab. Simulação HUB - Unidade II', prof:'Cássia e Meimei'},
    {date:'2026-10-13', time:'10:00', type:'aula', title:'Choque séptico', prof:'Meimei', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'},
    {date:'2026-10-14', time:'10:00', type:'aula', title:'Cetoacidose diabética', prof:'Luiz Claudio', local:'BSA Sul - Bloco Térreo (sala 41/10)'},
    {date:'2026-10-20', time:'10:00', type:'prova', title:'PROVA PARCIAL', assessmentId:'av1', prof:'Cássia', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'},
    {date:'2026-10-21', time:'10:00', type:'aula', title:'Meningite e Encefalite', prof:'Karina', local:'BSA Sul - Bloco Térreo (sala 41/10)'},
    {date:'2026-10-27', time:'10:00', type:'aula', title:'Hidratação em Emergência Pediátrica (prática)', prof:'Meimei', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'},
    {date:'2026-10-28', type:'evento', title:'Ponto facultativo — sem aula'},
    {date:'2026-11-03', time:'10:00', type:'aula', title:'ITU em Emergência', prof:'Meimei', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'},
    {date:'2026-11-04', time:'10:00', type:'aula', title:'Intoxicações', prof:'Karina', local:'BSA Sul - Bloco Térreo (sala 41/10)'},
    {date:'2026-11-10', time:'10:00', type:'aula', title:'Distúrbio Ácido-Básico', prof:'Armando', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'},
    {date:'2026-11-11', time:'10:00', type:'aula', title:'TCE', prof:'Karina', local:'BSA Sul - Bloco Térreo (sala 41/10)'},
    {date:'2026-11-17', time:'10:00', type:'aula', title:'Urgências Dermatológicas', prof:'Danielle', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'},
    {date:'2026-11-18', time:'10:00', type:'aula', title:'Queimados', prof:'José Henrique', local:'BSA Sul - Bloco Térreo (sala 41/10)'},
    {date:'2026-11-24', type:'entrega', title:'Prazo final — vídeos atividade de extensão'},
    {date:'2026-11-24', time:'10:00', type:'aula', title:'Cefaleia', prof:'Jaene Amoras', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'},
    {date:'2026-11-25', time:'10:00', type:'aula', title:'Emergências Hematológicas', prof:'Karina', local:'BSA Sul - Bloco Térreo (sala 41/10)'},
    {date:'2026-12-01', time:'10:00', type:'prova', title:'PROVA FINAL', assessmentId:'av2', prof:'Cássia', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'},
    {date:'2026-12-02', time:'10:00', type:'aula', title:'Apresentação dos vídeos — atividade de extensão', prof:'Cássia e Meimei', local:'BSA Sul - Bloco Térreo (sala 41/10)'},
    {date:'2026-12-08', time:'10:00', type:'aula', title:'Feedback / Encerramento', prof:'Cássia e Meimei', local:'UCA - Sala Multiuso (Enfermaria, 1º andar)'}
  ]
},

// ────────────────────────────────────────────────────────
// 2) SFC 5 — Saúde da Família e Comunidade 5 (FMD0024)
// ────────────────────────────────────────────────────────
{
  id: 'sfc5', label: 'SFC 5', emoji: '🤝', fullLabel: 'Saúde da Família e Comunidade 5',
  code: 'FMD0024', color: '#059669', fill: '#10b981',
  siWeight: 0.20, passingGrade: 5.0,
  calcDesc: 'Soma ponderada: 3 Avaliações Teóricas (10% cada = 30%) + Simulação Realística (20%) + OSCE (20%) + 2 Visitas à UBS (5% cada = 10%) + Atividade Integradora (20%). Sistema de menções UnB: SS 9–10, MS 7–8,9, MM 5–6,9 (aprovado), MI 3–4,9, II 0,1–2,9, SR &lt;75% de frequência. Insira as notas de 0 a 10.',
  assessments: [
    { id: 'av1', label: 'Avaliação Teórica 1 (09/09)', weight: 0.10, max: 10 },
    { id: 'av2', label: 'Avaliação Teórica 2 (25/11)', weight: 0.10, max: 10 },
    { id: 'av3', label: 'Avaliação Teórica 3 (09/12)', weight: 0.10, max: 10 },
    { id: 'simulacao', label: 'Simulação Realística (grupo)', weight: 0.20, max: 10 },
    { id: 'osce', label: 'OSCE (1+2+3)', weight: 0.20, max: 10 },
    { id: 'ubs1', label: 'Visita à UBS 1', weight: 0.05, max: 10 },
    { id: 'ubs2', label: 'Visita à UBS 2', weight: 0.05, max: 10 }
  ],
  sections: [
    { title: 'Antes da Avaliação Teórica 1 (até 09/09)', items: ['Rede de Urgência e Emergência','Acolhimento e Classificação de Risco na APS','Queimadura, choque e anafilaxia','HAS e DM descompensados','Dor abdominal','Acidentes com animais peçonhentos'] },
    { title: 'Antes da Avaliação Teórica 2 (até 25/11)', items: ['Mordeduras: profilaxia da raiva e do tétano','Abordagem da violência na APS','Ansiedade e Reforma Psiquiátrica','Tontura, dor lombar, tosse, dispneia (simulações)','Cefaleia, disúria, depressão/ideação suicida, diarreia (simulações)','Julgamento Simulado CRM-DF'] },
    { title: 'Antes da Avaliação Teórica 3 (até 09/12)', items: ['Dor torácica','Álcool, dependência e abstinência'] },
    { title: 'Queixas clínicas prevalentes na APS', items: ['Cefaleia','Insônia','Dor miofascial','Tontura','Diarreia','Náusea e vômitos','Disúria','Abordagem aos sintomáticos respiratórios'] },
    { title: 'Urgência e emergência na APS', items: ['IAM','AVE','Trauma/queimadura','Choque','Anafilaxia','Dispneia','Dor torácica','Hiperglicemia','Pico hipertensivo','Acidentes com animais peçonhentos'] }
  ],
  // Horário fixo semanal: Quarta-feira, 13h às 17h.
  schedule: [
    {date:'2026-08-12', time:'13:00', dur:240, type:'aula', title:'Apresentação e divisão dos grupos; Rede de Urgência/Emergência; Acolhimento e Classificação de Risco', prof:'Felipe e Thiago', local:'Auditório BSA'},
    {date:'2026-08-19', time:'13:00', dur:240, type:'aula', title:'Queimadura, choque, anafilaxia; HAS e DM descompensados', prof:'Thiago', local:'Auditório BSA'},
    {date:'2026-08-26', time:'13:00', dur:240, type:'seminario', title:'Simulação Grupo A (animais peçonhentos); Dor abdominal', prof:'Thiago', local:'Auditório BSA'},
    {date:'2026-09-02', time:'13:00', dur:240, type:'prova', title:'Teste de Progresso ABEM', local:'Auditório BSA'},
    {date:'2026-09-09', time:'13:00', dur:240, type:'prova', title:'Avaliação Teórica 1 + OSCE 1 (A,B) / Prática em serviços (C,D,E,F)', assessmentId:'av1', local:'Auditório BSA'},
    {date:'2026-09-16', time:'13:00', dur:240, type:'evento', title:'Semana Integradora', local:'Auditório BSA'},
    {date:'2026-09-23', time:'13:00', dur:240, type:'evento', title:'SEMUNI', local:'Auditório BSA'},
    {date:'2026-09-30', time:'13:00', dur:240, type:'seminario', title:'Simulação Grupo D (tontura); Grupo E (dor lombar)', local:'Auditório BSA'},
    {date:'2026-10-07', time:'13:00', dur:240, type:'evento', title:'Julgamento Simulado CRM-DF', local:'Auditório BSA'},
    {date:'2026-10-14', time:'13:00', dur:240, type:'seminario', title:'Simulação Grupo F (tosse); Grupo G (dispneia)', local:'Auditório BSA'},
    {date:'2026-10-21', time:'13:00', dur:240, type:'aula', title:'Mordeduras: profilaxia raiva/tétano; Violência na APS', prof:'Felipe', local:'Auditório BSA'},
    {date:'2026-10-28', type:'evento', title:'Recesso do Dia do Servidor Público'},
    {date:'2026-11-04', time:'13:00', dur:240, type:'seminario', title:'Simulação Grupo B (cefaleia); Grupo C (disúria)', local:'Auditório BSA'},
    {date:'2026-11-11', time:'13:00', dur:240, type:'aula', title:'Ansiedade e Reforma Psiquiátrica; Filme "Si può fare"', prof:'Felipe', local:'Auditório BSA'},
    {date:'2026-11-18', time:'13:00', dur:240, type:'seminario', title:'Simulação Grupo H (depressão/ideação suicida); Grupo I (diarreia)', local:'Auditório BSA'},
    {date:'2026-11-25', time:'13:00', dur:240, type:'prova', title:'Avaliação Teórica 2 + OSCE 2', assessmentId:'av2', local:'Auditório BSA'},
    {date:'2026-12-02', time:'13:00', dur:240, type:'seminario', title:'Simulação Grupo J (álcool/dependência); Dor torácica', prof:'Thiago', local:'Auditório BSA'},
    {date:'2026-12-09', time:'13:00', dur:240, type:'prova', title:'Avaliação Teórica 3 + OSCE 3', assessmentId:'av3', local:'Auditório BSA'}
  ]
},

// ────────────────────────────────────────────────────────
// 3) Psicomed 8 — Psicologia Médica 8 (FMD0026)
// ────────────────────────────────────────────────────────
{
  id: 'psicomed8', label: 'Psicomed 8', emoji: '🧠', fullLabel: 'Psicologia Médica 8',
  code: 'FMD0026', color: '#7c3aed', fill: '#a78bfa',
  siWeight: 0.15, passingGrade: 5.0,
  calcDesc: 'Soma direta (não há prova escrita): Seminários (7,0 pts) + Participação nas aulas (1,5 pts) + Atividade/Seminário Integrador (1,5 pts) = 10 pts. Frequência mínima 75% (abaixo disso: SR). Insira as notas já na escala de 0 a 10 correspondente a cada item.',
  assessments: [
    { id: 'seminarios', label: 'Seminários (entrevista + publicidade CFM)', weight: 0.70, max: 10 },
    { id: 'participacao', label: 'Participação nas aulas', weight: 0.15, max: 10 }
  ],
  sections: [
    { title: 'Conteúdo programático geral', items: ['Possibilidades de atuação do médico','Escolha da especialidade médica','Prática médica privada, planos de saúde e SUS','Marketing pessoal e publicidade médica (CFM)','Mercado de trabalho e planejamento de carreira'] },
    { title: 'Especialidades apresentadas em seminário', items: ['Clínica médica','Cirurgia geral','Medicina da família e comunidade','Ginecologia-obstetrícia','Psiquiatria','Especialidades clínico-cirúrgicas','Pediatria','Especialidades exclusivamente clínicas','Especialidades exclusivamente cirúrgicas','Medicina de imagem e nuclear','Medicina legal e do trabalho','Medicina preventiva e saúde coletiva'] }
  ],
  // Horário fixo semanal: Terça-feira, 8h às 9h40.
  schedule: [
    {date:'2026-08-11', time:'08:00', dur:100, type:'aula', title:'Apresentação / divisão dos grupos / motivações para ser médico', prof:'Raphael', local:'BSA 11/13'},
    {date:'2026-08-18', time:'08:00', dur:100, type:'aula', title:'Motivações para escolha da especialidade (discussão de artigos)', prof:'Raphael', local:'BSA 11/13'},
    {date:'2026-08-25', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Clínica médica', prof:'Valter', local:'BSA 11/13'},
    {date:'2026-09-01', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Cirurgia geral', prof:'Valter', local:'BSA 11/13'},
    {date:'2026-09-08', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Medicina da família e comunidade', prof:'Valter', local:'BSA 11/13'},
    {date:'2026-09-15', time:'08:00', dur:100, type:'evento', title:'Semana da Atividade Integradora (vale 1,5 pts)', prof:'Raphael', local:'BSA 11/13'},
    {date:'2026-09-22', type:'evento', title:'Semana Universitária — sem aula'},
    {date:'2026-09-29', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Ginecologia-obstetrícia', prof:'Raphael', local:'BSA 11/13'},
    {date:'2026-10-06', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Psiquiatria', prof:'Valter', local:'BSA 11/13'},
    {date:'2026-10-13', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Especialidades clínico-cirúrgicas', prof:'Raphael', local:'BSA 11/13'},
    {date:'2026-10-20', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Pediatria', prof:'Valter', local:'BSA 11/13'},
    {date:'2026-10-27', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Especialidades exclusivamente clínicas', prof:'Raphael', local:'BSA 11/13'},
    {date:'2026-11-03', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Especialidades exclusivamente cirúrgicas', prof:'Valter', local:'BSA 11/13'},
    {date:'2026-11-10', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Medicina de imagem e nuclear', prof:'Raphael', local:'BSA 11/13'},
    {date:'2026-11-17', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Medicina legal e do trabalho', prof:'Valter', local:'BSA 11/13'},
    {date:'2026-11-24', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Medicina preventiva e saúde coletiva', prof:'Valter', local:'BSA 11/13'},
    {date:'2026-12-07', time:'08:00', dur:100, type:'evento', title:'Encerramento / Auto-avaliação', prof:'Raphael', local:'BSA 11/13'}
  ]
},

// ────────────────────────────────────────────────────────
// 4) Ped 2 — Saúde da Criança e do Adolescente 2 (FMD0052)
// ────────────────────────────────────────────────────────
{
  id: 'ped2', label: 'Ped 2', emoji: '👧', fullLabel: 'Saúde da Criança e do Adolescente 2',
  code: 'FMD0052', color: '#0284c7', fill: '#38bdf8',
  siWeight: 0.15, passingGrade: 5.0,
  calcDesc: 'MF = Módulo Clínica (70%) + Módulo Cirurgia (15%) + Atividade de Integração do Semestre (15%). O Módulo Clínica já é a soma ponderada de Seminários (15%), Extensão (15%), Ambulatório (40%) e 4 provas (7,5% cada) — os pesos abaixo já estão convertidos para o total da disciplina. Insira as notas de 0 a 10. Seminários e Extensão não podem ser repostos. Mais de 4 faltas no ambulatório = reprovação automática.',
  assessments: [
    { id: 'sd', label: 'Seminários da disciplina', weight: 0.105, max: 10 },
    { id: 'ae', label: 'Atividade de Extensão', weight: 0.105, max: 10 },
    { id: 'aamb', label: 'Atividades de Ambulatório', weight: 0.28, max: 10 },
    { id: 'prsc1', label: 'Prova Saúde da Criança 1 (13/10)', weight: 0.0525, max: 10 },
    { id: 'prsc2', label: 'Prova Saúde da Criança 2 (24/11)', weight: 0.0525, max: 10 },
    { id: 'prsa1', label: 'Prova Saúde do Adolescente 1 (08/10)', weight: 0.0525, max: 10 },
    { id: 'prsa2', label: 'Prova Saúde do Adolescente 2 (19/11)', weight: 0.0525, max: 10 },
    { id: 'cirurgia', label: 'Prova Módulo Cirurgia (27/11)', weight: 0.15, max: 10 }
  ],
  sections: [
    { title: 'Prova Parcial — Módulo Criança (13/10)', items: ['Uso de telas na pediatria','Como conduzir a criança com sopro','Pneumonia','Crescimento: pré-escolar ao pré-adolescente','Cuidados paliativos','Diagnóstico clínico/laboratorial em genética','Obesidade sindrômica/monogênica','Doença celíaca','Radiologia na Pediatria','Infecção do trato urinário'] },
    { title: 'Prova Final — Módulo Criança (24/11)', items: ['Calendário vacinal','Dermatite atópica','Transtorno do espectro autista','Homeopatia','Desidratação','Atividade física para crianças e adolescentes','Asma','Condições neurológicas crônicas'] },
    { title: 'Prova Parcial — Módulo Adolescente (08/10)', items: ['Puericultura do adolescente','Sexualidade na adolescência','Exame neurológico do lactente e criança maior','Sistema locomotor e diagnóstico diferencial de artralgia','Diagnóstico clínico/laboratorial de doenças genéticas'] },
    { title: 'Prova Final — Módulo Adolescente (19/11)', items: ['Infecção de vias aéreas superiores','Sepse','Asma','Depressão na adolescência','Violência contra criança e adolescente','Atividade física para crianças e adolescentes'] },
    { title: 'Prova Módulo Cirurgia Pediátrica (27/11)', items: ['Médicos Saudáveis, Pacientes Saudáveis','Erro Médico','Anestesiologia em Pediatria','Incongruência de gênero','Urologia Pediátrica cirúrgica','Cirurgias otorrinolaringológicas na pediatria','Controle clínico no pós-operatório','Deformidade da coluna/quadril da criança','TCE e hemorragia subaracnoidea','Oncologia Pediátrica','Gestação na adolescência','Desvio/dismetrias dos MMII; pé da criança e adolescente','Apendicite em pacientes pediátricos'] }
  ],
  // Horário fixo semanal (grade oficial): Terça 11h-12h (módulo Criança); Quinta 8h-10h (módulo
  // Criança) e 11h-12h (módulo Adolescente); Sexta 8h-10h (módulo Cirurgia).
  // Ambulatório (Terça/Quinta/Sexta 14h-18h) é gerado à parte — veja "Escolher dia do Ambulatório" na aba.
  schedule: [
    {date:'2026-08-11', time:'11:00', type:'aula', title:'Uso de telas na pediatria', prof:'Maria Eduarda', local:'UCA'},
    {date:'2026-08-13', time:'08:00', dur:120, type:'aula', title:'Apresentação da disciplina / Doença celíaca', prof:'Alessandra', local:'UCA'},
    {date:'2026-08-13', time:'11:00', type:'aula', title:'Puericultura do adolescente e principais problemas', prof:'Marilúcia Picanço', local:'UCA'},
    {date:'2026-08-14', time:'08:00', dur:120, type:'aula', title:'Médicos Saudáveis, Pacientes Saudáveis (online)', prof:'Michelly Wada', local:'UCA'},
    {date:'2026-08-18', time:'11:00', type:'aula', title:'Cuidados paliativos', prof:'Rúbria', local:'UCA'},
    {date:'2026-08-20', time:'08:00', dur:120, type:'aula', title:'Radiologia na Pediatria', prof:'Alexandre', local:'UCA'},
    {date:'2026-08-20', time:'11:00', type:'aula', title:'Sexualidade na adolescência', prof:'Marilúcia Picanço', local:'UCA'},
    {date:'2026-08-21', time:'08:00', dur:120, type:'aula', title:'Erro Médico', prof:'Rodrigo Garbero', local:'UCA'},
    {date:'2026-08-25', time:'11:00', type:'aula', title:'Pneumonia', prof:'Rodrigo', local:'UCA'},
    {date:'2026-08-27', time:'08:00', dur:120, type:'aula', title:'Adolescente — "Passando a bola"', prof:'Lisiane Segutti', local:'UCA'},
    {date:'2026-08-27', time:'11:00', type:'aula', title:'Exame neurológico do lactente e criança maior', prof:'Lisiane Segutti', local:'UCA'},
    {date:'2026-08-28', time:'08:00', dur:120, type:'aula', title:'Anestesiologia em Pediatria', prof:'Cátia', local:'UCA'},
    {date:'2026-09-01', time:'11:00', type:'aula', title:'Crescimento: pré-escolar ao pré-adolescente', prof:'Luiz Claudio', local:'UCA'},
    {date:'2026-09-03', time:'08:00', dur:120, type:'aula', title:'Discussão de casos — crescimento e puberdade', prof:'Luiz Cláudio', local:'UCA'},
    {date:'2026-09-03', time:'11:00', type:'aula', title:'Discussão de casos — crescimento e puberdade', prof:'Luiz Claudio', local:'UCA'},
    {date:'2026-09-04', time:'08:00', dur:120, type:'aula', title:'Incongruência de gênero', prof:'Luiz Claudio', local:'UCA'},
    {date:'2026-09-08', time:'11:00', type:'aula', title:'Como conduzir a criança com sopro', prof:'Antonella', local:'UCA'},
    {date:'2026-09-10', time:'08:00', dur:120, type:'aula', title:'Infecção do trato urinário', prof:'Maria do Carmo', local:'UCA'},
    {date:'2026-09-10', time:'11:00', type:'aula', title:'Sistema locomotor e diagnóstico diferencial de artralgia', prof:'Aline', local:'UCA'},
    {date:'2026-09-11', time:'08:00', dur:120, type:'aula', title:'Urologia Pediátrica cirúrgica', prof:'Mauricia', local:'UCA'},
    {date:'2026-09-15', time:'11:00', type:'seminario', title:'Atividade Integradora do Semestre (14 a 17/09)', local:'UCA'},
    {date:'2026-09-17', time:'08:00', dur:120, type:'seminario', title:'Atividade Integradora do Semestre (14 a 17/09)', local:'UCA'},
    {date:'2026-09-17', time:'11:00', type:'seminario', title:'Atividade Integradora do Semestre (14 a 17/09)', local:'UCA'},
    {date:'2026-09-18', time:'08:00', dur:120, type:'aula', title:'Cirurgias otorrinolaringológicas na pediatria', prof:'André', local:'UCA'},
    {date:'2026-09-22', type:'evento', title:'Semana Universitária'},
    {date:'2026-09-24', type:'evento', title:'Semana Universitária'},
    {date:'2026-09-25', type:'evento', title:'Semana Universitária'},
    {date:'2026-09-29', time:'11:00', type:'aula', title:'Diagnóstico clínico/laboratorial em genética', prof:'Juliane Mazzeu', local:'UCA'},
    {date:'2026-10-01', time:'08:00', dur:120, type:'aula', title:'Diagnóstico clínico/laboratorial de doenças genéticas', prof:'Juliana Mazzeu', local:'UCA'},
    {date:'2026-10-01', time:'11:00', type:'aula', title:'Diagnóstico clínico/laboratorial de doenças genéticas', prof:'Juliana Mazzeu', local:'UCA'},
    {date:'2026-10-02', time:'08:00', dur:120, type:'aula', title:'Controle clínico no pós-operatório', prof:'Karina', local:'UCA'},
    {date:'2026-10-06', time:'11:00', type:'aula', title:'Obesidade sindrômica/monogênica', prof:'Fernanda Lopes', local:'UCA'},
    {date:'2026-10-08', time:'08:00', dur:120, type:'prova', title:'PROVA PARCIAL — Módulo Adolescente', assessmentId:'prsa1', local:'UCA'},
    {date:'2026-10-08', time:'11:00', type:'aula', title:'Infecção de vias aéreas superiores', prof:'Celso', local:'UCA'},
    {date:'2026-10-09', time:'08:00', dur:120, type:'aula', title:'Deformidade da coluna/quadril da criança', prof:'Eugênio', local:'UCA'},
    {date:'2026-10-13', time:'11:00', type:'prova', title:'PROVA PARCIAL — Módulo Criança', assessmentId:'prsc1', local:'UCA'},
    {date:'2026-10-15', time:'08:00', dur:120, type:'aula', title:'Atividade física para crianças e adolescentes', prof:'Luiz Guilherme', local:'UCA'},
    {date:'2026-10-15', time:'11:00', type:'aula', title:'Sepse', prof:'Aline', local:'UCA'},
    {date:'2026-10-16', time:'08:00', dur:120, type:'aula', title:'TCE e hemorragia subaracnoidea', prof:'Fábio', local:'UCA'},
    {date:'2026-10-20', time:'11:00', type:'aula', title:'Calendário vacinal', prof:'Rafael', local:'UCA'},
    {date:'2026-10-22', time:'08:00', dur:120, type:'seminario', title:'Seminário da disciplina', local:'UCA'},
    {date:'2026-10-22', time:'11:00', type:'seminario', title:'Seminário da disciplina', local:'UCA'},
    {date:'2026-10-23', time:'08:00', dur:120, type:'aula', title:'Oncologia Pediátrica', prof:'Lucélia', local:'UCA'},
    {date:'2026-10-27', time:'11:00', type:'aula', title:'Dermatite atópica', prof:'Felipe Motta', local:'UCA'},
    {date:'2026-10-29', time:'08:00', dur:120, type:'aula', title:'Asma', prof:'Carmem Livia', local:'UCA'},
    {date:'2026-10-29', time:'11:00', type:'aula', title:'Asma', prof:'Carmen Lívia', local:'UCA'},
    {date:'2026-10-30', time:'08:00', dur:120, type:'aula', title:'Gestação na adolescência', prof:'Silândia', local:'UCA'},
    {date:'2026-11-03', time:'11:00', type:'aula', title:'Transtorno do espectro autista', prof:'Jaenne Amoras', local:'UCA'},
    {date:'2026-11-05', time:'08:00', dur:120, type:'aula', title:'Condições neurológicas crônicas', prof:'Lisiane Segutti', local:'UCA'},
    {date:'2026-11-05', time:'11:00', type:'aula', title:'Depressão na Adolescência', prof:'André', local:'UCA'},
    {date:'2026-11-06', time:'08:00', dur:120, type:'aula', title:'Desvio/dismetrias dos MMII; pé da criança e adolescente', prof:'Eugênio', local:'UCA'},
    {date:'2026-11-10', time:'11:00', type:'aula', title:'Homeopatia', prof:'Daniele Barbas', local:'UCA'},
    {date:'2026-11-12', time:'08:00', dur:120, type:'aula', title:'Atividade de Extensão', local:'UCA'},
    {date:'2026-11-12', time:'11:00', type:'aula', title:'Violência contra criança e adolescente', prof:'Indira', local:'UCA'},
    {date:'2026-11-13', time:'08:00', dur:120, type:'aula', title:'Apendicite em pacientes pediátricos', prof:'Andrea Pedrosa', local:'UCA'},
    {date:'2026-11-17', time:'11:00', type:'aula', title:'Desidratação', prof:'Karina', local:'UCA'},
    {date:'2026-11-19', time:'08:00', dur:240, type:'prova', title:'PROVA FINAL — Módulo Adolescente (8h-12h)', assessmentId:'prsa2', local:'UCA'},
    {date:'2026-11-20', type:'evento', title:'Feriado — Consciência Negra'},
    {date:'2026-11-24', time:'11:00', type:'prova', title:'PROVA FINAL — Módulo Criança', assessmentId:'prsc2', local:'UCA'},
    {date:'2026-11-26', time:'08:00', dur:240, type:'reposicao', title:'Reposição (com justificativa, 8h-12h)', local:'UCA'},
    {date:'2026-11-27', time:'08:00', dur:120, type:'prova', title:'PROVA — Módulo Cirurgia Pediátrica', assessmentId:'cirurgia', local:'UCA'},
    {date:'2026-12-01', type:'reposicao', title:'Reposição — Módulo Criança'},
    {date:'2026-12-03', type:'evento', title:'Avaliação da disciplina'},
    {date:'2026-12-04', type:'reposicao', title:'Reposição — Módulo Cirurgia'},
    {date:'2026-12-08', type:'evento', title:'Avaliação da disciplina'},
    {date:'2026-12-10', type:'evento', title:'Correção de provas/atividades do semestre'},
    {date:'2026-12-14', type:'evento', title:'Encerramento do semestre'}
  ]
},

// ────────────────────────────────────────────────────────
// 5) Cirurgia 2 — Saúde do Adulto Cir II
// ────────────────────────────────────────────────────────
{
  id: 'cir2', label: 'Cirurgia 2', emoji: '🔪', fullLabel: 'Saúde do Adulto — Cirurgia II',
  code: 'FMD0017', color: '#d97706', fill: '#fbbf24',
  siWeight: 0.10, passingGrade: 5.0,
  calcDesc: 'NFM = Prova Teórico-Prática — TP (70%) + Avaliação Prática — AP (20%) + Atividade de Integração — AI (10%, é o Seminário Integrador). A TP se divide pelos 4 sub-módulos (Anestesiologia, Ortopedia, Otorrino, Oftalmologia, 17,5% cada): a prova de Ortopedia/Oftalmologia cobre 2 sub-módulos (35%), Anestesia e Otorrino valem 17,5% cada. Insira as notas de 0 a 10 (a AP é definida pelos professores de cada sub-módulo ao final do rodízio prático). <b>Atenção:</b> segundo a ementa oficial, quem não atingir nota 5,0 em qualquer um dos 4 sub-módulos está <u>automaticamente reprovado</u>, mesmo com a média geral acima de 5 — o cálculo abaixo mostra a média ponderada, mas fique de olho nota por nota também. Frequência mínima 75% (falta &gt;25% total ou em um único sub-módulo = reprovação SR).',
  assessments: [
    { id: 'prova_ortoped_oftalmo', label: 'Prova Ortopedia/Oftalmologia (30/11)', weight: 0.35, max: 10 },
    { id: 'prova_anestesia', label: 'Prova de Anestesia (07/12)', weight: 0.175, max: 10 },
    { id: 'prova_orl', label: 'Prova de Otorrinolaringologia (07/12)', weight: 0.175, max: 10 },
    { id: 'avaliacao_pratica', label: 'Avaliação Prática (AP, 4 sub-módulos)', weight: 0.20, max: 10 }
  ],
  sections: [
    { title: 'Prova Ortopedia/Oftalmologia', items: ['Introdução à ortopedia e traumatologia','Conceitos básicos de ortopedia / investigação diagnóstica em ortopedia','Traumatologia: fraturas — classificação, aspectos clínicos e consolidação','Lesões traumáticas fundamentais: contusões, entorses, fraturas, luxações, lesões musculares e tendinopatias','Infecções osteoarticulares: osteomielite, artrite séptica, tuberculose','Lombalgias mecânicas, lombociatalgias','Osteoartroses','Tumores ósseos','Exame oftalmológico normal e ametropias','Diagnóstico diferencial de olho vermelho','Catarata','Glaucoma','Plástica ocular','Estrabismo','Retinopatia diabética e hipertensiva','Doenças sistêmicas e olho'] },
    { title: 'Prova de Anestesia', items: ['Avaliação e preparo pré-anestésico','Via aérea e ventilação','Anestesia geral','Anestesia regional','Complicações em anestesia','Dor: neurofisiologia e aspectos clínicos'] },
    { title: 'Prova de Otorrinolaringologia', items: ['Anatomo-fisiologia do órgão vestíbulo-coclear, cavidade nasal/seios paranasais, cavidade oral, faringe/laringe e pescoço','Otites e suas complicações — tratamento','Rinossinusites agudas e crônicas — complicações e tratamento','Indicações operatórias das doenças do anel linfático de Waldeyer','Produção da voz e da fala humana — disfonias e tratamentos','Principais doenças tumorais em ORL (câncer de cavidade oral e laringe)','Urgências e emergências em ORL: epistaxe, paralisia facial periférica, surdez súbita','Principais afecções das glândulas salivares'] }
  ],
  // Horário fixo semanal: Segunda-feira, blocos teóricos 11h-11:50h e 13h-13:50h — mais os
  // blocos práticos 8h-10h (anestesia/ortopedia) e 14h-16h (otorrino/oftalmo) da grade oficial,
  // cujo conteúdo semana a semana ainda não foi enviado (veja aviso em "Como funciona a nota").
  schedule: [
    {date:'2026-08-10', time:'11:00', type:'aula', title:'Avaliação/preparo pré-anestésico', prof:'Henrique', local:'Auditório 1'},
    {date:'2026-08-10', time:'13:00', type:'aula', title:'Exame oftalmológico normal e ametropias', prof:'Chalita', local:'Auditório 1'},
    {date:'2026-08-17', time:'11:00', type:'aula', title:'Conceitos básicos em ortopedia e investigação diagnóstica', prof:'Eugenio', local:'Auditório 1'},
    {date:'2026-08-17', time:'13:00', type:'aula', title:'Otites e suas complicações — tratamento', prof:'André', local:'Auditório 1'},
    {date:'2026-08-24', time:'11:00', type:'aula', title:'Traumatologia: classificação, aspectos clínicos e consolidação', prof:'Eugenio', local:'Auditório 1'},
    {date:'2026-08-24', time:'13:00', type:'aula', title:'Diagnóstico diferencial de olho vermelho', prof:'Chalita', local:'Auditório 1'},
    {date:'2026-08-31', time:'11:00', type:'aula', title:'Lesões traumáticas fundamentais: contusões, entorses, fraturas, luxações', prof:'Eugenio', local:'Auditório 1'},
    {date:'2026-08-31', time:'13:00', type:'aula', title:'Rinossinusites e suas complicações — tratamento', prof:'André', local:'Auditório 1'},
    {date:'2026-09-14', time:'11:00', type:'aula', title:'Via aérea e ventilação', prof:'Cátia', local:'Auditório 1'},
    {date:'2026-09-14', time:'13:00', type:'seminario', title:'Seminário Integrador', prof:'Alessandra e Chalita', local:'Auditório 1'},
    {date:'2026-09-21', type:'evento', title:'Semana Universitária'},
    {date:'2026-09-28', time:'11:00', type:'aula', title:'Anestesia regional', prof:'Henrique', local:'Auditório 1'},
    {date:'2026-09-28', time:'13:00', type:'aula', title:'Catarata', prof:'Chalita', local:'Auditório 1'},
    {date:'2026-10-05', time:'11:00', type:'aula', title:'Infecções osteoarticulares: osteomielite, artrite séptica, tuberculose', prof:'Eugenio', local:'Auditório 1'},
    {date:'2026-10-05', time:'13:00', type:'aula', title:'Doenças do anel linfático de Waldeyer — tratamento', prof:'André', local:'Auditório 1'},
    {date:'2026-10-19', time:'11:00', type:'aula', title:'Dor: neurofisiologia e aspectos clínicos', prof:'Helga', local:'Auditório 1'},
    {date:'2026-10-19', time:'13:00', type:'aula', title:'Glaucoma', prof:'Chalita', local:'Auditório 1'},
    {date:'2026-10-26', time:'11:00', type:'aula', title:'Lombalgias mecânicas, lombociatalgias', prof:'Eugenio', local:'Auditório 1'},
    {date:'2026-10-26', time:'13:00', type:'aula', title:'Produção humana da voz, disfonias e tratamentos', prof:'Alessandra', local:'Auditório 1'},
    {date:'2026-11-09', time:'11:00', type:'aula', title:'Anestesia geral inalatória', prof:'Cátia', local:'Auditório 1'},
    {date:'2026-11-09', time:'13:00', type:'aula', title:'Estrabismo', prof:'Chalita', local:'Auditório 1'},
    {date:'2026-11-16', time:'11:00', type:'aula', title:'Osteoartrose (joelho e quadril)', prof:'Eugenio', local:'Auditório 1'},
    {date:'2026-11-16', time:'13:00', type:'aula', title:'Principais doenças tumorais em ORL, tumores da boca e laringe', prof:'Alessandra', local:'Auditório 1'},
    {date:'2026-11-23', time:'11:00', type:'aula', title:'Anestesia geral venosa', prof:'Cátia', local:'Auditório 1'},
    {date:'2026-11-23', time:'13:00', type:'aula', title:'Retinopatia diabética e hipertensiva', prof:'Chalita', local:'Auditório 1'},
    {date:'2026-11-30', time:'11:00', type:'prova', title:'Prova — Ortopedia/Oftalmologia', assessmentId:'prova_ortoped_oftalmo', prof:'Eugenio', local:'Auditório 1'},
    {date:'2026-11-30', time:'13:00', type:'aula', title:'Principais afecções das glândulas salivares', prof:'Alessandra', local:'Auditório 1'},
    {date:'2026-12-07', time:'11:00', type:'prova', title:'Prova de Anestesia', assessmentId:'prova_anestesia', prof:'Henrique', local:'Auditório 1'},
    {date:'2026-12-07', time:'13:00', type:'prova', title:'Prova de Otorrinolaringologia', assessmentId:'prova_orl', prof:'André', local:'Auditório 1'}
  ]
},

// ────────────────────────────────────────────────────────
// 6) UE-Cirurgia — Urgência e Emergência (Cirurgia) — AGUARDANDO EMENTA
// ────────────────────────────────────────────────────────
{
  id: 'uecir', label: 'UE-Cir', emoji: '🚨', fullLabel: 'Urgência e Emergência 4 — Clínica Cirúrgica',
  code: 'FMD0021', color: '#be185d', fill: '#f472b6',
  siWeight: 0.10, passingGrade: 5.0,
  calcDesc: 'Nota final = Prova I (45%, 21/10) + Prova II (45%, 14/12) + Atividade Integradora/Seminário Integrador (10%, 16/09). Cada prova vale até 50 pontos na ementa (aqui normalizados para escala 0-10). Aprovação com nota final ≥ 5,0. Frequência mínima de 75%. Não há prova de recuperação ao final do módulo — só uma prova substitutiva em caso excepcional, mediante processo administrativo justificado.',
  assessments: [
    { id: 'prova1', label: 'Avaliação I (21/10)', weight: 0.45, max: 50 },
    { id: 'prova2', label: 'Avaliação II (14/12)', weight: 0.45, max: 50 }
  ],
  sections: [
    {
      title: 'Conteúdo — Avaliação I',
      items: [
        'Atendimento ao politraumatizado',
        'Urgências colorretais comuns no PS 1 (abscesso anorretal, fissura anal, trombose hemorroidária)',
        'Anestesiologia no politrauma (manejo de via aérea, manejo hemodinâmico)',
        'Urgências e emergências neurocirúrgicas (TCE, AVC hemorrágico, HIC, trauma raquimedular)',
        'Principais urgências e emergências em otorrinolaringologia',
        'Urgências e emergências músculo-esqueléticas (fraturas expostas, trauma músculo-esquelético)',
        'Urgências em oftalmologia (trauma contuso, trauma perfurante, queimaduras químicas e térmicas)'
      ]
    },
    {
      title: 'Conteúdo — Avaliação II',
      items: [
        'Urgências colorretais comuns no PS 2 (ileostomia e colostomia)',
        'Emergências vasculares (aneurisma de aorta abdominal roto, lesões vasculares agudas, tratamento endovascular, complicações de acessos)',
        'Urgências e emergências cardiotorácicas cirúrgicas (drenagem de tórax/toracocentese, pericardiocentese, trauma cardíaco, trauma torácico, traqueostomia)',
        'Queimaduras (avaliação inicial e manejo do paciente queimado, indicações de transferência)',
        'Urgências urológicas (trauma/fratura peniana, escroto agudo, hematúria aguda, trauma do sistema urinário)',
        'Abdome agudo (inflamatório, obstrutivo, vascular)',
        'Prática de suturas (Laboratório de Simulação)'
      ]
    }
  ],
  schedule: [
    { date: '2026-08-19', time: '08:00', dur: 60, type: 'aula', title: 'Apresentação do Curso', prof: 'Luiz Lobato', local: 'BSA S 34/10' },
    { date: '2026-08-19', time: '09:00', dur: 60, type: 'aula', title: 'Atendimento ao politraumatizado', prof: 'João Batista', local: 'BSA S 34/10' },
    { date: '2026-08-26', time: '08:00', dur: 120, type: 'aula', title: 'Urgências colorretais comuns no PS 1 (abscesso anorretal, fissura anal, trombose hemorroidária)', prof: 'Luiz Lobato', local: 'BSA S 34/10' },
    { date: '2026-09-02', time: '08:00', dur: 120, type: 'aula', title: 'Anestesiologia no politrauma (manejo de via aérea, manejo hemodinâmico)', prof: 'Gabriel Magalhães (convidado)', local: 'BSA S 34/10' },
    { date: '2026-09-09', time: '08:00', dur: 120, type: 'aula', title: 'Urgências e emergências neurocirúrgicas (TCE, AVC hemorrágico, HIC, trauma raquimedular)', prof: 'Iruena Kessler', local: 'BSA S 34/10' },
    { date: '2026-09-16', time: '08:00', dur: 120, type: 'seminario', title: 'Atividade Integradora do Semestre' },
    { date: '2026-09-23', time: '08:00', dur: 120, type: 'evento', title: 'Semana Universitária (sem aula)' },
    { date: '2026-09-30', time: '08:00', dur: 120, type: 'aula', title: 'Principais urgências e emergências em otorrinolaringologia', prof: 'André Sampaio', local: 'BSA S 34/10' },
    { date: '2026-10-07', time: '08:00', dur: 120, type: 'aula', title: 'Urgências e emergências músculo-esqueléticas (fraturas expostas, trauma músculo-esquelético)', prof: 'Eugênio Neto', local: 'BSA S 34/10' },
    { date: '2026-10-14', time: '08:00', dur: 120, type: 'aula', title: 'Urgências em oftalmologia (trauma contuso, trauma perfurante, queimaduras químicas e térmicas)', prof: 'Maria Regina Chalita', local: 'BSA S 34/10' },
    { date: '2026-10-21', time: '08:00', dur: 120, type: 'prova', title: 'Avaliação I', prof: 'Luiz Lobato', local: 'BSA S 34/10', assessmentId: 'prova1' },
    { date: '2026-10-28', time: '08:00', dur: 120, type: 'aula', title: 'Urgências colorretais comuns no PS 2 (ileostomia e colostomia)', prof: 'Luiz Lobato', local: 'BSA S 34/10' },
    { date: '2026-11-04', time: '08:00', dur: 120, type: 'aula', title: 'Emergências vasculares (aneurisma de aorta abdominal roto, lesões vasculares agudas, tratamento endovascular, complicações de acessos)', prof: 'Paulo Saad', local: 'BSA S 34/10' },
    { date: '2026-11-11', time: '08:00', dur: 120, type: 'aula', title: 'Urgências e emergências cardiotorácicas cirúrgicas (drenagem de tórax/toracocentese, pericardiocentese, trauma cardíaco, trauma torácico, traqueostomia)', prof: 'Paulo Saad', local: 'BSA S 34/10' },
    { date: '2026-11-18', time: '08:00', dur: 120, type: 'aula', title: 'Queimaduras (avaliação inicial e manejo do paciente queimado, indicações de transferência)', prof: 'Brenner Dollis (convidado)', local: 'BSA S 34/10' },
    { date: '2026-11-25', time: '08:00', dur: 120, type: 'aula', title: 'Urgências urológicas (trauma/fratura peniana, escroto agudo, hematúria aguda, trauma do sistema urinário)', prof: 'Mário Chammas (convidado)', local: 'BSA S 34/10' },
    { date: '2026-12-02', time: '08:00', dur: 120, type: 'aula', title: 'Abdome agudo (inflamatório, obstrutivo, vascular)', prof: 'Andrea Pedrosa', local: 'BSA S 34/10' },
    { date: '2026-12-09', time: '08:00', dur: 120, type: 'estagio', title: 'Prática de suturas (Laboratório de Simulação)', prof: 'Andrea Pedrosa', local: 'BSA S 34/10' },
    { date: '2026-12-14', time: '08:00', dur: 120, type: 'prova', title: 'Avaliação II', prof: 'Luiz Lobato', local: 'BSA S 34/10', assessmentId: 'prova2' }
  ]
},

// ────────────────────────────────────────────────────────
// 7) Medicina Legal e Deontologia
// ────────────────────────────────────────────────────────
{
  id: 'medlegal', label: 'Med Legal', emoji: '⚖️', fullLabel: 'Medicina Legal e Deontologia',
  code: 'não especificado', color: '#475569', fill: '#94a3b8',
  siWeight: 0, passingGrade: 5.0,
  calcDesc: '⚠️ O plano de ensino enviado traz o cronograma completo, mas só menciona uma única <b>"Avaliação final escrita"</b> (Aula 15, 04/12) — não há detalhamento de outras avaliações, pesos parciais, nota mínima ou frequência mínima no texto recebido. O sistema está considerando essa prova como 100% da nota final e usando 5,0 como nota mínima padrão. A disciplina também participa do Seminário Integrador do 8º semestre (segundo o plano de Ped 2), mas o peso disso não é informado neste documento — se houver, me avise para eu ajustar.',
  assessments: [
    { id: 'av_final', label: 'Avaliação Final Escrita (04/12)', weight: 1.0, max: 10 }
  ],
  sections: [
    { title: 'Conteúdo por aula (cronograma oficial)', items: [
      'Aula 1 — Importância da Medicina Legal; sistema jurídico brasileiro; Direitos e Garantias Fundamentais',
      'Aula 2 — Direito Médico: Código Penal, CPP, Código Civil, CPC, Código de Ética Médica, CDC, ECA, Res. CNS 466/12',
      'Aula 3 — Prontuário digital, assinatura eletrônica e Inteligência Artificial',
      'Aula 4 — Medicina Legal e Direitos Humanos; estrutura do laudo pericial',
      'Aula 5 — Lesões corporais (art. 129 CP); Perito Oficial, Assistentes Técnicos, Quesitos',
      'Aula 6 — Lesões Contusas, Incisas, Punctórias, Perfuroincisas e Corto-Contusas',
      'Aula 7 — Lesões Perfurocontusas (projéteis de arma de fogo)',
      'Aula 8 — Tanatologia Forense; morte encefálica',
      'Aula 9 — Identificação Humana: Genética, Papiloscopia, Antropologia Forense; desastres de massa',
      'Aula 10 — Energias (térmica, elétrica, radioativa, pressórica, sonora, luminosa); Asfixiologia',
      'Aula 11 — Sexologia Forense; Lei Maria da Penha; Feminicídio',
      'Aula 12 — Toxicologia Forense: drogas de abuso, álcool, medicamentos, venenos',
      'Aula 13 — Noções de Psicopatologia Forense',
      'Aula 14 — Responsabilidade médica (Penal/Civil/Ética/Administrativa); Sigilo Profissional; Publicidade Médica',
      'Aula 15 — Prevenção de Litígios; Consentimento Livre e Esclarecido (Avaliação Final Escrita)'
    ] }
  ],
  schedule: [
    {date:'2026-08-14', time:'10:00', dur:120, type:'aula', title:'Aula 1 — Importância da Medicina Legal; sistema jurídico brasileiro; Direitos e Garantias Fundamentais', prof:'Dr. Malthus', local:'BSA 26/10'},
    {date:'2026-08-21', time:'10:00', dur:120, type:'aula', title:'Aula 2 — Direito Médico: Código Penal, CPP, Código Civil, CPC, Código de Ética Médica, CDC, ECA, Res. CNS 466/12', prof:'Dr. Malthus', local:'BSA 26/10'},
    {date:'2026-08-28', time:'10:00', dur:120, type:'aula', title:'Aula 3 — Prontuário digital, assinatura eletrônica e Inteligência Artificial', prof:'Dr. Malthus', local:'BSA 26/10'},
    {date:'2026-09-04', time:'10:00', dur:120, type:'aula', title:'Aula 4 — Medicina Legal e Direitos Humanos; estrutura do laudo pericial', prof:'Dr. Malthus', local:'BSA 26/10'},
    {date:'2026-09-11', time:'10:00', dur:120, type:'aula', title:'Aula 5 — Lesões corporais (art. 129 CP); Perito Oficial, Assistentes Técnicos, Quesitos', prof:'Dr. Malthus', local:'BSA 26/10'},
    {date:'2026-09-18', time:'10:00', dur:120, type:'aula', title:'Aula 6 — Lesões Contusas, Incisas, Punctórias, Perfuroincisas e Corto-Contusas', prof:'Dr. Malthus', local:'BSA 26/10'},
    {date:'2026-09-25', type:'evento', title:'Sem aula'},
    {date:'2026-10-02', time:'10:00', dur:120, type:'aula', title:'Aula 7 — Lesões Perfurocontusas (projéteis de arma de fogo)', prof:'Dr. Malthus', local:'BSA 26/10'},
    {date:'2026-10-09', time:'10:00', dur:120, type:'aula', title:'Aula 8 — Tanatologia Forense; morte encefálica', prof:'Dr. Malthus', local:'BSA 26/10'},
    {date:'2026-10-16', time:'10:00', dur:120, type:'aula', title:'Aula 9 — Identificação Humana: Genética, Papiloscopia, Antropologia Forense; desastres de massa', prof:'Dr. Malthus', local:'BSA 26/10'},
    {date:'2026-10-23', time:'10:00', dur:120, type:'aula', title:'Aula 10 — Energias (térmica, elétrica, radioativa, pressórica, sonora, luminosa); Asfixiologia', prof:'Dr. Malthus', local:'BSA 26/10'},
    {date:'2026-10-30', time:'10:00', dur:120, type:'aula', title:'Aula 11 — Sexologia Forense; Lei Maria da Penha; Feminicídio', prof:'Dr. Malthus', local:'BSA 26/10'},
    {date:'2026-11-06', time:'10:00', dur:120, type:'aula', title:'Aula 12 — Toxicologia Forense: drogas de abuso, álcool, medicamentos, venenos', prof:'Dr. Malthus', local:'BSA 26/10'},
    {date:'2026-11-13', time:'10:00', dur:120, type:'aula', title:'Aula 13 — Noções de Psicopatologia Forense', prof:'Dr. Malthus', local:'BSA 26/10'},
    {date:'2026-11-20', type:'evento', title:'Feriado Nacional — sem aula'},
    {date:'2026-11-27', time:'10:00', dur:120, type:'aula', title:'Aula 14 — Responsabilidade médica (Penal/Civil/Ética/Administrativa); Sigilo Profissional; Publicidade Médica', prof:'Dr. Malthus', local:'BSA 26/10'},
    {date:'2026-12-04', time:'10:00', dur:120, type:'prova', title:'Aula 15 — Prevenção de Litígios; Consentimento Livre e Esclarecido + AVALIAÇÃO FINAL ESCRITA', assessmentId:'av_final', prof:'Dr. Malthus', local:'BSA 26/10'}
  ]
}

];

const EVENT_TYPE_META = {
  aula:      { label: 'Aula',       color: '#64748b' },
  prova:     { label: 'Prova',      color: '#e11d48' },
  seminario: { label: 'Seminário',  color: '#7c3aed' },
  estagio:   { label: 'Estágio/Lab', color: '#0284c7' },
  evento:    { label: 'Evento',     color: '#94a3b8' },
  entrega:   { label: 'Entrega',    color: '#d97706' },
  reposicao: { label: 'Reposição',  color: '#f59e0b' }
};
