// ══════════════════════════════════════════════════════════
//  MOTOR DE CÁLCULO DE NOTAS
//  Nota "acumulada absoluta": soma dos pontos já garantidos (peso × nota
//  normalizada para 0-10) mais a projeção mínima/máxima do que falta.
// ══════════════════════════════════════════════════════════

function getSubjectGrades(dId) { return userGrades[dId] || {}; }

function calcSubjectMetrics(dId) {
  const d = userDisciplines.find(x => x.id === dId);
  if (!d || !d.assessments || d.assessments.length === 0) {
    return { atualNum:0, atual:'0.00', minNum:0, min:'0.00', maxNum:0, max:'0.00', status:'Sem dados', cls:'neut', color: d ? d.color : '#ccc' };
  }

  const grades = getSubjectGrades(dId);
  let absoluteScore = 0, missingWeight = 0;

  d.assessments.forEach(av => {
    const valStr = grades[av.id];
    if (valStr === '' || valStr === undefined || valStr === null) {
      missingWeight += av.weight;
    } else {
      let val = parseFloat(valStr);
      if (isNaN(val)) val = 0;
      const maxInput = av.max || 10;
      const normalizedVal = (val / maxInput) * 10;
      absoluteScore += normalizedVal * av.weight;
    }
  });

  const siWeight = d.siWeight || 0;
  if (siWeight > 0) {
    const valSIStr = userGrades.si;
    if (valSIStr === '' || valSIStr === undefined || valSIStr === null) {
      missingWeight += siWeight;
    } else {
      let valSI = parseFloat(valSIStr);
      if (isNaN(valSI)) valSI = 0;
      absoluteScore += valSI * siWeight;
    }
  }

  const passingGrade = d.passingGrade || 5.0;
  const mediaAtual = absoluteScore;
  const subMin = absoluteScore;
  const subMax = absoluteScore + (10 * missingWeight);

  let statusStr = '', statusCls = '';
  if (subMax < passingGrade) {
    statusStr = 'Reprovado'; statusCls = 'danger';
  } else if (subMin >= passingGrade) {
    statusStr = 'Aprovado (Garantido)'; statusCls = 'ok';
  } else if (missingWeight > 0) {
    const avgNeeded = (passingGrade - absoluteScore) / missingWeight;
    if (avgNeeded > 10) { statusStr = 'Reprovado (impossível atingir)'; statusCls = 'danger'; }
    else { statusStr = `Precisa de média ${avgNeeded.toFixed(1)} nas restantes`; statusCls = 'warn'; }
  } else {
    statusStr = 'Em avaliação'; statusCls = 'neut';
  }

  return {
    atualNum: mediaAtual, atual: mediaAtual.toFixed(2),
    minNum: subMin, min: subMin.toFixed(2),
    maxNum: subMax, max: subMax.toFixed(2),
    passingGrade, missingWeight,
    status: statusStr, cls: statusCls, color: d.color
  };
}

// ── Painel do semestre: média entre todas as disciplinas + contagem de aprovação ──
function calcSemesterOverview() {
  // Disciplinas ainda sem ementa importada (sem avaliações cadastradas) não entram na
  // média nem na contagem de aprovação — não há nota nenhuma para calcular ainda.
  const graded = userDisciplines.filter(d => (d.assessments || []).length > 0);
  if (!graded.length) return null;
  let sumAtual = 0, sumMin = 0, sumMax = 0;
  let countOk = 0, countDanger = 0, countWarn = 0;
  const perDisc = graded.map(d => {
    const m = calcSubjectMetrics(d.id);
    sumAtual += m.atualNum; sumMin += m.minNum; sumMax += m.maxNum;
    if (m.cls === 'ok') countOk++;
    else if (m.cls === 'danger') countDanger++;
    else countWarn++;
    return { id: d.id, label: d.label, emoji: d.emoji, color: d.color, ...m };
  });
  const n = graded.length;
  return {
    mediaAtual: (sumAtual / n), mediaMin: (sumMin / n), mediaMax: (sumMax / n),
    countOk, countDanger, countWarn, total: n,
    perDisc
  };
}

function renderGradeBar(metrics) {
  const threshold = metrics.passingGrade || 5.0;
  const pMin = Math.min(100, (metrics.minNum / 10) * 100);
  const pMax = Math.min(100, (metrics.maxNum / 10) * 100);
  const pThresh = (threshold / 10) * 100;
  return `
    <div style="margin-top:8px">
      <div class="g-track">
        <div class="g-thresh" style="left:${pThresh}%"></div>
        <div class="g-fill-min" style="width:${pMin}%; background:${metrics.color}"></div>
        <div class="g-fill-max" style="width:${pMax}%; background:${metrics.color}"></div>
      </div>
      <div class="g-labels"><span>0</span><span>${metrics.atual} (acumulado)</span><span>10</span></div>
    </div>
  `;
}
