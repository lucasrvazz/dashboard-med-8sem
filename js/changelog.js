// ══════════════════════════════════════════════════════════
//  NOVIDADES DO SITE — histórico de atualizações, mais recente primeiro.
//  Pra registrar uma nova atualização, adicione um objeto no topo do array
//  CHANGELOG_GROUPS com a mesma estrutura dos existentes.
// ══════════════════════════════════════════════════════════

const CHANGELOG_GROUPS = [
  {
    date: 'Mais recente',
    items: [
      { emoji: '🔪', title: 'Rodízio de Cirurgia 2 reatualizado', desc: 'Novo cronograma oficial das práticas: bloco de Ortopedia/Oftalmo mudou de janela (agora inclui 14/09, só de manhã, por causa do Seminário Integrador à tarde) e os rodízios de 30/11 e 07/12 saíram (viraram semana de provas). Também foi adicionada a Apresentação do rodízio (10/08).' },
      { emoji: '🧠', title: 'Cronograma de UE-PED corrigido', desc: 'A aula de 09/09 mudou de "PCR" para "TCE (Traumatismo Cranioencefálico)", conforme o que realmente aconteceu em sala.' },
      { emoji: '🧪', title: 'Lista de alunos por dia de OSCE (SFC 5)', desc: 'Nova referência na aba de Cronograma de SFC 5 mostrando quem faz o OSCE em cada uma das 3 datas (09/09, 25/11, 09/12).' },
      { emoji: '🚨', title: 'Ementa completa de UE-Cirurgia', desc: 'Cronograma com as 18 aulas do semestre, professores, local (BSA S 34/10) e a fórmula real de nota (Avaliação I 45% + Avaliação II 45% + Atividade Integradora 10%), a partir do plano de ensino oficial (FMD0021).' },
      { emoji: '📍', title: 'Local das aulas na agenda', desc: 'Cada aula agora mostra também onde ela acontece (sala/prédio) — na agenda de cada disciplina, no calendário e nos cards do Dashboard, com base na grade horária oficial da turma.' },
      { emoji: '🔪', title: 'Notas de Cirurgia 2 com pesos oficiais', desc: 'Antes era uma estimativa provisória (33,3% pra cada prova). Agora usa a fórmula real da ementa: TP 70% (dividida por sub-módulo), Avaliação Prática 20% e Seminário Integrador 10% — mais o conteúdo de prova completo e a correção de 3 professores de ORL (eram creditados ao Prof. André, na verdade são da Profª Alessandra).' },
      { emoji: '📚', title: 'Cronograma de UE-PED atualizado', desc: 'Laboratórios de Simulação (set/out) agora com as 5 turmas (A a E) em horários específicos, conforme o cronograma oficial mais recente — e corrigida a troca entre as aulas de Asma e Convulsões (25 e 26/08).' },
      { emoji: '👤', title: 'Nome do professor em cada aula', desc: 'A agenda de cada disciplina (e os cards do Dashboard) agora mostram quem dá a aula, direto da ementa oficial.' },
      { emoji: '🔧', title: 'Conteúdo de cada disciplina sempre atualizado', desc: 'Correção: se você já tinha usado o site, novos tópicos de conteúdo agora aparecem automaticamente, sem perder o progresso que você já tinha marcado.' },
      { emoji: '🔧', title: 'Ordem e título do Conteúdo ficam salvos', desc: 'Correção: se você arrasta os tópicos pra reorganizar ou renomeia o título de uma seção, agora isso é lembrado da próxima vez que você entrar.' },
      { emoji: '🆕', title: 'Aba de Novidades', desc: 'Essa aba aqui — pra você acompanhar tudo que muda no site sem precisar perguntar.' },
      { emoji: '🎨', title: '"Acontecendo agora" mais visual', desc: 'Cards do Dashboard com cores da disciplina, faixa de destaque e badges maiores.' },
      { emoji: '🎤', title: 'Grupos de Psicomed 8', desc: 'Escolha seu grupo na aba de Psicomed e veja o dia da sua apresentação destacado automaticamente na agenda.' },
      { emoji: '📋', title: 'Controle de Faltas', desc: 'Nova sub-aba em cada disciplina: acompanha horas totais, limite de 25% (regra da UnB) e quanto ainda resta, marcando aula por aula.' },
      { emoji: '🗂️', title: 'Sub-abas dentro de cada disciplina', desc: 'Notas, Cronograma, Faltas e Conteúdo agora ficam separados, sem precisar rolar uma página gigante.' },
      { emoji: '🔴', title: '"Acontecendo agora" e "Logo em seguida"', desc: 'Topo do Dashboard mostra o que está rolando neste minuto e o que vem a seguir, atualizando sozinho.' },
      { emoji: '📝', title: 'Aba dedicada de Provas', desc: 'Lista e calendário só com avaliações, com sincronização própria (agenda separada no Google) e atualização automática se uma data de prova mudar.' }
    ]
  },
  {
    date: '14/08/2026',
    items: [
      { emoji: '🗓️', title: 'Sincronização com Google Agenda', desc: 'Cria uma agenda própria na sua conta com todos os eventos do semestre, já com a duração real de cada aula/prova/estágio.' },
      { emoji: '⚖️', title: 'Ementa completa de Medicina Legal', desc: 'Cronograma, conteúdo e avaliação final cadastrados a partir do plano de ensino oficial.' },
      { emoji: '🔪', title: 'Rodízios completos de Cirurgia 2', desc: 'Oftalmo (por subgrupo, revezando segunda/terça), Otorrino, Anestesia e Ortopedia — tudo por grupo (A/B/C/D).' },
      { emoji: '🕐', title: 'Horários reais no calendário', desc: 'Cada evento passou a ter a duração de verdade (1h, 2h, 4h...) em vez de sempre aparecer como 1 hora.' },
      { emoji: '🔒', title: 'Política de Privacidade', desc: 'Página pública explicando quais dados o site guarda e como.' }
    ]
  },
  {
    date: '13/08/2026',
    items: [
      { emoji: '🚀', title: 'Lançamento do Dashboard MED 117', desc: 'As 5 disciplinas oficiais do 8º semestre cadastradas (UE-PED, SFC 5, Psicomed 8, Ped 2, Cirurgia 2), com conteúdo de prova, cronograma e cálculo de notas.' },
      { emoji: '🧮', title: 'Cálculo automático de notas', desc: 'Nota acumulada, mínima e máxima possível, e status de aprovação em cada disciplina — incluindo o Seminário Integrador.' },
      { emoji: '🔑', title: 'Login com Google + salvamento na nuvem', desc: 'Seus dados de notas e progresso ficam salvos na sua conta, sincronizados entre dispositivos.' }
    ]
  }
];

function renderChangelogTab() {
  const groups = CHANGELOG_GROUPS.map(group => {
    const items = group.items.map(it => `
      <div class="cl-item">
        <div class="cl-dot">${it.emoji}</div>
        <div class="cl-body">
          <div class="cl-title">${it.title}</div>
          <div class="cl-desc">${it.desc}</div>
        </div>
      </div>
    `).join('');
    return `
      <div class="cl-group">
        <div class="cl-date">${group.date}</div>
        <div class="cl-items">${items}</div>
      </div>
    `;
  }).join('');

  return `
    <div class="dash-title" style="margin-bottom:14px">🆕 Novidades do Site</div>
    <div class="info-box">Tudo que foi adicionado ou melhorado no Dashboard, mais recente primeiro. Tem sugestão? Manda mensagem pra quem cuida do site.</div>
    <div class="cl-timeline">${groups}</div>
  `;
}
