// ══════════════════════════════════════════════════════════
//  DADOS DAS DISCIPLINAS — 8º Semestre Medicina UnB — Turma 117 — 2/2026
//  Extraídos dos Planos de Ensino/Cronogramas oficiais em 2026-08-13.
//  Onde o documento não trouxe a informação, isso é indicado explicitamente
//  em calcDesc/notes — não foram inventados pesos ou datas.
// ══════════════════════════════════════════════════════════

const genId = () => Math.random().toString(36).substr(2, 9);

// Gera um cronograma semanal genérico (usado pelas disciplinas "placeholder" abaixo,
// que ainda não tiveram a ementa importada — só sabemos o horário fixo delas).
function buildWeeklyPlaceholderSchedule(startISO, endISO, dow, time, skipISO, label) {
  const out = [];
  const start = new Date(startISO + 'T00:00:00');
  const end = new Date(endISO + 'T00:00:00');
  const d = new Date(start);
  while (d.getDay() !== dow) d.setDate(d.getDate() + 1);
  while (d <= end) {
    const iso = d.toISOString().slice(0, 10);
    if (!skipISO.includes(iso)) out.push({ date: iso, time, dur: 120, type: 'aula', title: label });
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
  schedule: [
    {date:'2026-08-11', time:'10:00', type:'aula', title:'Introdução à disciplina'},
    {date:'2026-08-12', time:'10:00', type:'aula', title:'MINI PALS'},
    {date:'2026-08-18', time:'10:00', type:'aula', title:'Bronquiolite viral aguda'},
    {date:'2026-08-19', time:'10:00', type:'aula', title:'Distúrbios Respiratórios (Laringite/Crise; OVACE)'},
    {date:'2026-08-25', time:'10:00', type:'aula', title:'Asma — Crise'},
    {date:'2026-08-26', time:'10:00', type:'aula', title:'Convulsões em PS PED'},
    {date:'2026-09-01', time:'10:00', type:'aula', title:'PCR'},
    {date:'2026-09-02', time:'10:00', type:'aula', title:'Oxigenoterapia'},
    {date:'2026-09-08', time:'10:00', type:'estagio', title:'Lab. Simulação — Ventilação (Turma A/C 10h · B/D 11h)'},
    {date:'2026-09-09', time:'10:00', type:'aula', title:'PCR'},
    {date:'2026-09-15', time:'10:00', type:'seminario', title:'Seminário Integrador (14 a 17/09)'},
    {date:'2026-09-16', time:'10:00', type:'seminario', title:'Seminário Integrador (14 a 17/09)'},
    {date:'2026-09-22', time:'10:00', type:'aula', title:'Febre sem sinais localizatórios'},
    {date:'2026-09-23', time:'10:00', type:'aula', title:'Criança Gravemente Enferma'},
    {date:'2026-09-29', time:'10:00', type:'estagio', title:'Lab. Simulação — Ventilação (Turma A/C 10h · B/D 11h)'},
    {date:'2026-09-30', time:'10:00', type:'estagio', title:'Lab. Simulação — Ventilação/PCR (Turma A/C 10h · B/D 11h)'},
    {date:'2026-10-06', time:'10:00', type:'estagio', title:'Lab. Simulação — PCR (Turma A/C 10h · B/D 11h)'},
    {date:'2026-10-07', time:'10:00', type:'estagio', title:'Lab. Simulação — PCR (Turma A/C 10h · B/D 11h)'},
    {date:'2026-10-13', time:'10:00', type:'aula', title:'Choque séptico'},
    {date:'2026-10-14', time:'10:00', type:'aula', title:'Cetoacidose diabética'},
    {date:'2026-10-20', time:'10:00', type:'prova', title:'PROVA PARCIAL', assessmentId:'av1'},
    {date:'2026-10-21', time:'10:00', type:'aula', title:'Meningite e Encefalite'},
    {date:'2026-10-27', time:'10:00', type:'aula', title:'Hidratação em Emergência Pediátrica (prática)'},
    {date:'2026-10-28', type:'evento', title:'Ponto facultativo — sem aula'},
    {date:'2026-11-03', time:'10:00', type:'aula', title:'ITU em Emergência'},
    {date:'2026-11-04', time:'10:00', type:'aula', title:'Intoxicações'},
    {date:'2026-11-10', time:'10:00', type:'aula', title:'Distúrbio Ácido-Básico'},
    {date:'2026-11-11', time:'10:00', type:'aula', title:'TCE'},
    {date:'2026-11-17', time:'10:00', type:'aula', title:'Urgências Dermatológicas'},
    {date:'2026-11-18', time:'10:00', type:'aula', title:'Queimados'},
    {date:'2026-11-24', type:'entrega', title:'Prazo final — vídeos atividade de extensão'},
    {date:'2026-11-24', time:'10:00', type:'aula', title:'Cefaleia'},
    {date:'2026-11-25', time:'10:00', type:'aula', title:'Emergências Hematológicas'},
    {date:'2026-12-01', time:'10:00', type:'prova', title:'PROVA FINAL', assessmentId:'av2'},
    {date:'2026-12-02', time:'10:00', type:'aula', title:'Apresentação dos vídeos — atividade de extensão'},
    {date:'2026-12-08', time:'10:00', type:'aula', title:'Feedback / Encerramento'}
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
    {date:'2026-08-12', time:'13:00', dur:240, type:'aula', title:'Apresentação e divisão dos grupos; Rede de Urgência/Emergência; Acolhimento e Classificação de Risco'},
    {date:'2026-08-19', time:'13:00', dur:240, type:'aula', title:'Queimadura, choque, anafilaxia; HAS e DM descompensados'},
    {date:'2026-08-26', time:'13:00', dur:240, type:'seminario', title:'Simulação Grupo A (animais peçonhentos); Dor abdominal'},
    {date:'2026-09-02', time:'13:00', dur:240, type:'prova', title:'Teste de Progresso ABEM'},
    {date:'2026-09-09', time:'13:00', dur:240, type:'prova', title:'Avaliação Teórica 1 + OSCE 1 (A,B) / Prática em serviços (C,D,E,F)', assessmentId:'av1'},
    {date:'2026-09-16', time:'13:00', dur:240, type:'evento', title:'Semana Integradora'},
    {date:'2026-09-23', time:'13:00', dur:240, type:'evento', title:'SEMUNI'},
    {date:'2026-09-30', time:'13:00', dur:240, type:'seminario', title:'Simulação Grupo D (tontura); Grupo E (dor lombar)'},
    {date:'2026-10-07', time:'13:00', dur:240, type:'evento', title:'Julgamento Simulado CRM-DF'},
    {date:'2026-10-14', time:'13:00', dur:240, type:'seminario', title:'Simulação Grupo F (tosse); Grupo G (dispneia)'},
    {date:'2026-10-21', time:'13:00', dur:240, type:'aula', title:'Mordeduras: profilaxia raiva/tétano; Violência na APS'},
    {date:'2026-10-28', type:'evento', title:'Recesso do Dia do Servidor Público'},
    {date:'2026-11-04', time:'13:00', dur:240, type:'seminario', title:'Simulação Grupo B (cefaleia); Grupo C (disúria)'},
    {date:'2026-11-11', time:'13:00', dur:240, type:'aula', title:'Ansiedade e Reforma Psiquiátrica; Filme "Si può fare"'},
    {date:'2026-11-18', time:'13:00', dur:240, type:'seminario', title:'Simulação Grupo H (depressão/ideação suicida); Grupo I (diarreia)'},
    {date:'2026-11-25', time:'13:00', dur:240, type:'prova', title:'Avaliação Teórica 2 + OSCE 2', assessmentId:'av2'},
    {date:'2026-12-02', time:'13:00', dur:240, type:'seminario', title:'Simulação Grupo J (álcool/dependência); Dor torácica'},
    {date:'2026-12-09', time:'13:00', dur:240, type:'prova', title:'Avaliação Teórica 3 + OSCE 3', assessmentId:'av3'}
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
    {date:'2026-08-11', time:'08:00', dur:100, type:'aula', title:'Apresentação / divisão dos grupos / motivações para ser médico'},
    {date:'2026-08-18', time:'08:00', dur:100, type:'aula', title:'Motivações para escolha da especialidade (discussão de artigos)'},
    {date:'2026-08-25', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Clínica médica'},
    {date:'2026-09-01', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Cirurgia geral'},
    {date:'2026-09-08', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Medicina da família e comunidade'},
    {date:'2026-09-15', time:'08:00', dur:100, type:'evento', title:'Semana da Atividade Integradora (vale 1,5 pts)'},
    {date:'2026-09-22', type:'evento', title:'Semana Universitária — sem aula'},
    {date:'2026-09-29', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Ginecologia-obstetrícia'},
    {date:'2026-10-06', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Psiquiatria'},
    {date:'2026-10-13', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Especialidades clínico-cirúrgicas'},
    {date:'2026-10-20', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Pediatria'},
    {date:'2026-10-27', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Especialidades exclusivamente clínicas'},
    {date:'2026-11-03', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Especialidades exclusivamente cirúrgicas'},
    {date:'2026-11-10', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Medicina de imagem e nuclear'},
    {date:'2026-11-17', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Medicina legal e do trabalho'},
    {date:'2026-11-24', time:'08:00', dur:100, type:'seminario', title:'Atuação do Médico — Medicina preventiva e saúde coletiva'},
    {date:'2026-12-07', time:'08:00', dur:100, type:'evento', title:'Encerramento / Auto-avaliação'}
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
    {date:'2026-08-11', time:'11:00', type:'aula', title:'Uso de telas na pediatria'},
    {date:'2026-08-13', time:'08:00', dur:120, type:'aula', title:'Apresentação da disciplina / Doença celíaca'},
    {date:'2026-08-13', time:'11:00', type:'aula', title:'Puericultura do adolescente e principais problemas'},
    {date:'2026-08-14', time:'08:00', dur:120, type:'aula', title:'Médicos Saudáveis, Pacientes Saudáveis (online)'},
    {date:'2026-08-18', time:'11:00', type:'aula', title:'Como conduzir a criança com sopro'},
    {date:'2026-08-20', time:'08:00', dur:120, type:'aula', title:'Radiologia na Pediatria'},
    {date:'2026-08-20', time:'11:00', type:'aula', title:'Sexualidade na adolescência'},
    {date:'2026-08-21', time:'08:00', dur:120, type:'aula', title:'Erro Médico'},
    {date:'2026-08-25', time:'11:00', type:'aula', title:'Pneumonia'},
    {date:'2026-08-27', time:'08:00', dur:120, type:'aula', title:'Adolescente — "Passando a bola"'},
    {date:'2026-08-27', time:'11:00', type:'aula', title:'Exame neurológico do lactente e criança maior'},
    {date:'2026-08-28', time:'08:00', dur:120, type:'aula', title:'Anestesiologia em Pediatria'},
    {date:'2026-09-01', time:'11:00', type:'aula', title:'Crescimento: pré-escolar ao pré-adolescente'},
    {date:'2026-09-03', time:'08:00', dur:120, type:'aula', title:'Discussão de casos — crescimento e puberdade'},
    {date:'2026-09-03', time:'11:00', type:'aula', title:'Discussão de casos — crescimento e puberdade'},
    {date:'2026-09-04', time:'08:00', dur:120, type:'aula', title:'Incongruência de gênero'},
    {date:'2026-09-08', time:'11:00', type:'aula', title:'Cuidados paliativos'},
    {date:'2026-09-10', time:'08:00', dur:120, type:'aula', title:'Infecção do trato urinário'},
    {date:'2026-09-10', time:'11:00', type:'aula', title:'Sistema locomotor e diagnóstico diferencial de artralgia'},
    {date:'2026-09-11', time:'08:00', dur:120, type:'aula', title:'Urologia Pediátrica cirúrgica'},
    {date:'2026-09-15', time:'11:00', type:'seminario', title:'Atividade Integradora do Semestre (14 a 17/09)'},
    {date:'2026-09-17', time:'08:00', dur:120, type:'seminario', title:'Atividade Integradora do Semestre (14 a 17/09)'},
    {date:'2026-09-17', time:'11:00', type:'seminario', title:'Atividade Integradora do Semestre (14 a 17/09)'},
    {date:'2026-09-18', time:'08:00', dur:120, type:'aula', title:'Cirurgias otorrinolaringológicas na pediatria'},
    {date:'2026-09-22', type:'evento', title:'Semana Universitária'},
    {date:'2026-09-24', type:'evento', title:'Semana Universitária'},
    {date:'2026-09-25', type:'evento', title:'Semana Universitária'},
    {date:'2026-09-29', time:'11:00', type:'aula', title:'Diagnóstico clínico/laboratorial em genética'},
    {date:'2026-10-01', time:'08:00', dur:120, type:'aula', title:'Diagnóstico clínico/laboratorial de doenças genéticas'},
    {date:'2026-10-01', time:'11:00', type:'aula', title:'Diagnóstico clínico/laboratorial de doenças genéticas'},
    {date:'2026-10-02', time:'08:00', dur:120, type:'aula', title:'Controle clínico no pós-operatório'},
    {date:'2026-10-06', time:'11:00', type:'aula', title:'Obesidade sindrômica/monogênica'},
    {date:'2026-10-08', time:'08:00', dur:120, type:'prova', title:'PROVA PARCIAL — Módulo Adolescente', assessmentId:'prsa1'},
    {date:'2026-10-08', time:'11:00', type:'aula', title:'Infecção de vias aéreas superiores'},
    {date:'2026-10-09', time:'08:00', dur:120, type:'aula', title:'Deformidade da coluna/quadril da criança'},
    {date:'2026-10-13', time:'11:00', type:'prova', title:'PROVA PARCIAL — Módulo Criança', assessmentId:'prsc1'},
    {date:'2026-10-15', time:'08:00', dur:120, type:'aula', title:'Atividade física para crianças e adolescentes'},
    {date:'2026-10-15', time:'11:00', type:'aula', title:'Sepse'},
    {date:'2026-10-16', time:'08:00', dur:120, type:'aula', title:'TCE e hemorragia subaracnoidea'},
    {date:'2026-10-20', time:'11:00', type:'aula', title:'Calendário vacinal'},
    {date:'2026-10-22', time:'08:00', dur:120, type:'seminario', title:'Seminário da disciplina'},
    {date:'2026-10-22', time:'11:00', type:'seminario', title:'Seminário da disciplina'},
    {date:'2026-10-23', time:'08:00', dur:120, type:'aula', title:'Oncologia Pediátrica'},
    {date:'2026-10-27', time:'11:00', type:'aula', title:'Dermatite atópica'},
    {date:'2026-10-29', time:'08:00', dur:120, type:'aula', title:'Asma'},
    {date:'2026-10-29', time:'11:00', type:'aula', title:'Asma'},
    {date:'2026-10-30', time:'08:00', dur:120, type:'aula', title:'Gestação na adolescência'},
    {date:'2026-11-03', time:'11:00', type:'aula', title:'Transtorno do espectro autista'},
    {date:'2026-11-05', time:'08:00', dur:120, type:'aula', title:'Condições neurológicas crônicas'},
    {date:'2026-11-05', time:'11:00', type:'aula', title:'Depressão na Adolescência'},
    {date:'2026-11-06', time:'08:00', dur:120, type:'aula', title:'Desvio/dismetrias dos MMII; pé da criança e adolescente'},
    {date:'2026-11-10', time:'11:00', type:'aula', title:'Homeopatia'},
    {date:'2026-11-12', time:'08:00', dur:120, type:'aula', title:'Atividade de Extensão'},
    {date:'2026-11-12', time:'11:00', type:'aula', title:'Violência contra criança e adolescente'},
    {date:'2026-11-13', time:'08:00', dur:120, type:'aula', title:'Apendicite em pacientes pediátricos'},
    {date:'2026-11-17', time:'11:00', type:'aula', title:'Desidratação'},
    {date:'2026-11-19', time:'08:00', dur:240, type:'prova', title:'PROVA FINAL — Módulo Adolescente (8h-12h)', assessmentId:'prsa2'},
    {date:'2026-11-20', type:'evento', title:'Feriado — Consciência Negra'},
    {date:'2026-11-24', time:'11:00', type:'prova', title:'PROVA FINAL — Módulo Criança', assessmentId:'prsc2'},
    {date:'2026-11-26', time:'08:00', dur:240, type:'reposicao', title:'Reposição (com justificativa, 8h-12h)'},
    {date:'2026-11-27', time:'08:00', dur:120, type:'prova', title:'PROVA — Módulo Cirurgia Pediátrica', assessmentId:'cirurgia'},
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
  code: 'não especificado', color: '#d97706', fill: '#fbbf24',
  siWeight: 0, passingGrade: 5.0,
  calcDesc: '⚠️ O cronograma oficial desta disciplina não informa os pesos de cada prova nem a nota mínima de aprovação — apenas as datas. O sistema está usando <b>divisão igualitária (33,3% cada)</b> entre as 3 provas como estimativa provisória. Atualize os pesos reais assim que a coordenação divulgar o plano de ensino completo (use "Importar Ementa" para reprocessar quando tiver o PDF).',
  assessments: [
    { id: 'prova_ortoped_oftalmo', label: 'Prova Ortopedia/Oftalmologia (30/11)', weight: 0.3334, max: 10 },
    { id: 'prova_anestesia', label: 'Prova de Anestesia (07/12)', weight: 0.3333, max: 10 },
    { id: 'prova_orl', label: 'Prova de Otorrinolaringologia (07/12)', weight: 0.3333, max: 10 }
  ],
  sections: [
    { title: 'Prova Ortopedia/Oftalmologia', items: ['Conceitos básicos em ortopedia e investigação diagnóstica','Traumatologia: classificação, aspectos clínicos e consolidação','Lesões traumáticas: contusões, entorses, fraturas, luxações','Infecções osteoarticulares: osteomielite, artrite séptica, tuberculose','Lombalgias mecânicas, lombociatalgias','Osteoartrose (joelho e quadril)','Dor: neurofisiologia e aspectos clínicos','Exame oftalmológico normal e ametropias','Diagnóstico diferencial de olho vermelho','Catarata','Glaucoma','Estrabismo','Retinopatia diabética e hipertensiva'] },
    { title: 'Prova de Anestesia', items: ['Avaliação e preparo pré-anestésico','Via aérea e ventilação','Anestesia regional','Anestesia geral inalatória','Anestesia geral venosa'] },
    { title: 'Prova de Otorrinolaringologia', items: ['Otites e complicações — tratamento','Rinossinusites e complicações — tratamento','Doenças do anel linfático de Waldeyer — tratamento','Produção da voz, disfonias e tratamentos','Tumores da boca e laringe','Afecções das glândulas salivares'] }
  ],
  // Horário fixo semanal: Segunda-feira, blocos teóricos 11h-11:50h e 13h-13:50h — mais os
  // blocos práticos 8h-10h (anestesia/ortopedia) e 14h-16h (otorrino/oftalmo) da grade oficial,
  // cujo conteúdo semana a semana ainda não foi enviado (veja aviso em "Como funciona a nota").
  schedule: [
    {date:'2026-08-10', time:'11:00', type:'aula', title:'Avaliação/preparo pré-anestésico'},
    {date:'2026-08-10', time:'13:00', type:'aula', title:'Exame oftalmológico normal e ametropias'},
    {date:'2026-08-17', time:'11:00', type:'aula', title:'Conceitos básicos em ortopedia e investigação diagnóstica'},
    {date:'2026-08-17', time:'13:00', type:'aula', title:'Otites e suas complicações — tratamento'},
    {date:'2026-08-24', time:'11:00', type:'aula', title:'Traumatologia: classificação, aspectos clínicos e consolidação'},
    {date:'2026-08-24', time:'13:00', type:'aula', title:'Diagnóstico diferencial de olho vermelho'},
    {date:'2026-08-31', time:'11:00', type:'aula', title:'Lesões traumáticas fundamentais: contusões, entorses, fraturas, luxações'},
    {date:'2026-08-31', time:'13:00', type:'aula', title:'Rinossinusites e suas complicações — tratamento'},
    {date:'2026-09-14', time:'11:00', type:'aula', title:'Via aérea e ventilação'},
    {date:'2026-09-14', time:'13:00', type:'seminario', title:'Seminário Integrador'},
    {date:'2026-09-21', type:'evento', title:'Semana Universitária'},
    {date:'2026-09-28', time:'11:00', type:'aula', title:'Anestesia regional'},
    {date:'2026-09-28', time:'13:00', type:'aula', title:'Catarata'},
    {date:'2026-10-05', time:'11:00', type:'aula', title:'Infecções osteoarticulares: osteomielite, artrite séptica, tuberculose'},
    {date:'2026-10-05', time:'13:00', type:'aula', title:'Doenças do anel linfático de Waldeyer — tratamento'},
    {date:'2026-10-19', time:'11:00', type:'aula', title:'Dor: neurofisiologia e aspectos clínicos'},
    {date:'2026-10-19', time:'13:00', type:'aula', title:'Glaucoma'},
    {date:'2026-10-26', time:'11:00', type:'aula', title:'Lombalgias mecânicas, lombociatalgias'},
    {date:'2026-10-26', time:'13:00', type:'aula', title:'Produção humana da voz, disfonias e tratamentos'},
    {date:'2026-11-09', time:'11:00', type:'aula', title:'Anestesia geral inalatória'},
    {date:'2026-11-09', time:'13:00', type:'aula', title:'Estrabismo'},
    {date:'2026-11-16', time:'11:00', type:'aula', title:'Osteoartrose (joelho e quadril)'},
    {date:'2026-11-16', time:'13:00', type:'aula', title:'Principais doenças tumorais em ORL, tumores da boca e laringe'},
    {date:'2026-11-23', time:'11:00', type:'aula', title:'Anestesia geral venosa'},
    {date:'2026-11-23', time:'13:00', type:'aula', title:'Retinopatia diabética e hipertensiva'},
    {date:'2026-11-30', time:'11:00', type:'prova', title:'Prova — Ortopedia/Oftalmologia', assessmentId:'prova_ortoped_oftalmo'},
    {date:'2026-11-30', time:'13:00', type:'aula', title:'Principais afecções das glândulas salivares'},
    {date:'2026-12-07', time:'11:00', type:'prova', title:'Prova de Anestesia', assessmentId:'prova_anestesia'},
    {date:'2026-12-07', time:'13:00', type:'prova', title:'Prova de Otorrinolaringologia', assessmentId:'prova_orl'}
  ]
},

// ────────────────────────────────────────────────────────
// 6) UE-Cirurgia — Urgência e Emergência (Cirurgia) — AGUARDANDO EMENTA
// ────────────────────────────────────────────────────────
{
  id: 'uecir', label: 'UE-Cir', emoji: '🚨', fullLabel: 'Urgência e Emergência — Cirurgia',
  code: 'não especificado', color: '#be185d', fill: '#f472b6',
  siWeight: 0, passingGrade: 5.0,
  calcDesc: '⚠️ Ementa ainda não importada — esta disciplina foi criada apenas com o horário semanal fixo (Quarta 08h-10h), para aparecer no calendário. Assim que você tiver o PDF do plano de ensino, use a aba "Importar Ementa" para adicionar os pesos das provas e o conteúdo programático automaticamente.',
  assessments: [],
  sections: [],
  schedule: buildWeeklyPlaceholderSchedule('2026-08-11', '2026-12-08', 3, '08:00', ['2026-09-23'], 'Aula (conteúdo a confirmar — importe a ementa)')
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
    { title: 'Conteúdo Programático (Avaliação Final)', items: [
      'Importância da Medicina Legal — Medicina Legal e Direitos Humanos — Estrutura do Laudo Pericial',
      'Lesões corporais — Classificação segundo art. 129 do Código Penal',
      'Lesões Corporais Contusas, Incisas, Punctórias, Perfuroincisas e Corto-Contusas',
      'Lesões Perfurocontusas (projéteis de arma de fogo)',
      'Tanatologia Forense — Morte encefálica',
      'Identificação Humana — Genética, Papiloscopia e Antropologia Forenses — Desastres de Massa',
      'Energias Térmica, Elétrica, Radioativa, Pressórica, Sonora, Luminosa — Asfixiologia Forense',
      'Sexologia Forense — Lei Maria da Penha — Feminicídio',
      'Toxicologia Forense — drogas de abuso, álcool, medicamentos psicotrópicos, venenos',
      'Noções de Psicopatologia Forense',
      'Sistema jurídico de interesse médico — Constituição, Código Penal, Código Civil, Código de Ética Médica, ECA, CDC, Resolução CNS 466/12',
      'Perito Oficial, Assistentes Técnicos, Quesitos',
      'Sigilo Profissional e Publicidade Médica',
      'Responsabilidade profissional médica — âmbitos Penal, Civil, Ético e Administrativo',
      'Prevenção de Litígios — Prontuário Médico, negociação/mediação/arbitragem, Consentimento Livre e Esclarecido',
      'Prontuário digital, assinatura eletrônica e Inteligência Artificial na Medicina'
    ] }
  ],
  schedule: [
    {date:'2026-08-14', time:'10:00', dur:120, type:'aula', title:'Aula 1 — Importância da Medicina Legal; sistema jurídico brasileiro; Direitos e Garantias Fundamentais'},
    {date:'2026-08-21', time:'10:00', dur:120, type:'aula', title:'Aula 2 — Direito Médico: Código Penal, CPP, Código Civil, CPC, Código de Ética Médica, CDC, ECA, Res. CNS 466/12'},
    {date:'2026-08-28', time:'10:00', dur:120, type:'aula', title:'Aula 3 — Prontuário digital, assinatura eletrônica e Inteligência Artificial'},
    {date:'2026-09-04', time:'10:00', dur:120, type:'aula', title:'Aula 4 — Medicina Legal e Direitos Humanos; estrutura do laudo pericial'},
    {date:'2026-09-11', time:'10:00', dur:120, type:'aula', title:'Aula 5 — Lesões corporais (art. 129 CP); Perito Oficial, Assistentes Técnicos, Quesitos'},
    {date:'2026-09-18', time:'10:00', dur:120, type:'aula', title:'Aula 6 — Lesões Contusas, Incisas, Punctórias, Perfuroincisas e Corto-Contusas'},
    {date:'2026-09-25', type:'evento', title:'Sem aula'},
    {date:'2026-10-02', time:'10:00', dur:120, type:'aula', title:'Aula 7 — Lesões Perfurocontusas (projéteis de arma de fogo)'},
    {date:'2026-10-09', time:'10:00', dur:120, type:'aula', title:'Aula 8 — Tanatologia Forense; morte encefálica'},
    {date:'2026-10-16', time:'10:00', dur:120, type:'aula', title:'Aula 9 — Identificação Humana: Genética, Papiloscopia, Antropologia Forense; desastres de massa'},
    {date:'2026-10-23', time:'10:00', dur:120, type:'aula', title:'Aula 10 — Energias (térmica, elétrica, radioativa, pressórica, sonora, luminosa); Asfixiologia'},
    {date:'2026-10-30', time:'10:00', dur:120, type:'aula', title:'Aula 11 — Sexologia Forense; Lei Maria da Penha; Feminicídio'},
    {date:'2026-11-06', time:'10:00', dur:120, type:'aula', title:'Aula 12 — Toxicologia Forense: drogas de abuso, álcool, medicamentos, venenos'},
    {date:'2026-11-13', time:'10:00', dur:120, type:'aula', title:'Aula 13 — Noções de Psicopatologia Forense'},
    {date:'2026-11-20', type:'evento', title:'Feriado Nacional — sem aula'},
    {date:'2026-11-27', time:'10:00', dur:120, type:'aula', title:'Aula 14 — Responsabilidade médica (Penal/Civil/Ética/Administrativa); Sigilo Profissional; Publicidade Médica'},
    {date:'2026-12-04', time:'10:00', dur:120, type:'prova', title:'Aula 15 — Prevenção de Litígios; Consentimento Livre e Esclarecido + AVALIAÇÃO FINAL ESCRITA', assessmentId:'av_final'}
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
