// ══════════════════════════════════════════════════════════
//  IMPORTAR EMENTA EM PDF — o próprio Gemini (com a chave de API do
//  usuário, nunca enviada a nenhum outro lugar) lê o PDF e devolve uma
//  disciplina estruturada, que é adicionada automaticamente ao site.
// ══════════════════════════════════════════════════════════

const GEMINI_KEY_STORAGE = 'med117_gemini_api_key';
const GEMINI_MODEL_STORAGE = 'med117_gemini_model';
const DEFAULT_GEMINI_MODEL = 'gemini-2.5-flash';

let pendingImportDiscipline = null;
let importLogLines = [];

function getGeminiKey() { return localStorage.getItem(GEMINI_KEY_STORAGE) || ''; }
function setGeminiKey(v) { localStorage.setItem(GEMINI_KEY_STORAGE, v.trim()); }
function getGeminiModel() { return localStorage.getItem(GEMINI_MODEL_STORAGE) || DEFAULT_GEMINI_MODEL; }
function setGeminiModel(v) { localStorage.setItem(GEMINI_MODEL_STORAGE, (v || DEFAULT_GEMINI_MODEL).trim()); }

function importLog(msg) {
  importLogLines.push(`[${new Date().toLocaleTimeString('pt-BR')}] ${msg}`);
  const el = document.getElementById('import-log');
  if (el) { el.textContent = importLogLines.join('\n'); el.scrollTop = el.scrollHeight; el.style.display = 'block'; }
}

function renderImportTab() {
  const key = getGeminiKey();
  return `
    <div class="dash-title" style="margin-bottom:14px">📥 Importar Ementa (PDF → Gemini → Disciplina)</div>
    <div class="info-box">Envie o PDF do plano de ensino/ementa de uma disciplina. O Gemini vai ler o documento com <b>a sua própria chave de API</b> e devolver a composição de notas, o conteúdo programático e o cronograma já estruturados — que você confere antes de adicionar ao site.</div>
    <div class="key-box">
      <label>🔑 Chave da API do Gemini (fica salva só no seu navegador, nunca é enviada a nenhum servidor além do Google)</label>
      <div class="key-row">
        <input type="password" id="gemini-key-input" placeholder="AIza..." value="${key ? key.replace(/./g, '•').slice(0, 20) : ''}" onfocus="this.type='text'; this.value=getGeminiKey()" onblur="this.type='password'; setGeminiKey(this.value); this.value=this.value?this.value.replace(/./g,'•').slice(0,20):''">
        <input type="text" id="gemini-model-input" style="max-width:220px" placeholder="modelo (ex: gemini-2.5-flash)" value="${getGeminiModel()}" onblur="setGeminiModel(this.value)">
        <a href="https://aistudio.google.com/apikey" target="_blank" rel="noopener" class="btn btn-ghost" style="text-decoration:none;display:flex;align-items:center">Gerar chave ↗</a>
      </div>
    </div>
    <div class="upload-zone" id="upload-zone" onclick="document.getElementById('pdf-input').click()"
         ondragover="event.preventDefault(); this.classList.add('drag')"
         ondragleave="this.classList.remove('drag')"
         ondrop="handlePdfDrop(event)">
      <div class="icon">📄</div>
      <div class="txt">Clique ou arraste o PDF da ementa aqui</div>
      <div class="sub">Somente arquivos .pdf — o Gemini lê o documento inteiro, incluindo tabelas de cronograma</div>
      <input type="file" id="pdf-input" accept="application/pdf" style="display:none" onchange="handlePdfSelect(event)">
    </div>
    <pre class="import-log" id="import-log" style="display:${importLogLines.length ? 'block' : 'none'}">${importLogLines.join('\n')}</pre>
    <div id="import-preview-wrap">${pendingImportDiscipline ? renderImportPreview(pendingImportDiscipline) : ''}</div>
  `;
}

function handlePdfDrop(e) {
  e.preventDefault();
  e.currentTarget.classList.remove('drag');
  const file = e.dataTransfer.files[0];
  if (file) analyzeEmentaWithGemini(file);
}
function handlePdfSelect(e) {
  const file = e.target.files[0];
  if (file) analyzeEmentaWithGemini(file);
}

function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result.split(',')[1]);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

const GEMINI_EXTRACTION_PROMPT = `Você é um assistente que extrai dados estruturados de um Plano de Ensino / Ementa / Cronograma de uma disciplina de Medicina (UnB, Brasil) e devolve APENAS um objeto JSON válido (sem markdown, sem comentários, sem texto fora do JSON), no seguinte formato exato:

{
  "id": "slug-curto-sem-acentos",
  "label": "Nome curto para aba (máx 14 caracteres)",
  "emoji": "um único emoji representativo",
  "fullLabel": "Nome completo da disciplina",
  "code": "código da disciplina se houver, senão null",
  "color": "#hexcolor (escolha uma cor vibrante e distinta)",
  "fill": "#hexcolor mais claro da mesma cor",
  "siWeight": 0.0,
  "passingGrade": 5.0,
  "calcDesc": "Explicação em texto (pode usar <b>) de como a nota final é calculada, citando os pesos reais encontrados no documento",
  "assessments": [
    { "id": "slug_avaliacao", "label": "Nome da avaliação", "weight": 0.0, "max": 10 }
  ],
  "sections": [
    { "title": "Nome da unidade/prova", "items": ["tópico 1", "tópico 2"] }
  ],
  "schedule": [
    { "date": "YYYY-MM-DD", "type": "aula|prova|seminario|estagio|evento|entrega|reposicao", "title": "descrição curta", "assessmentId": "slug_avaliacao ou omitir" }
  ]
}

Regras importantes:
- "siWeight" é o peso (0 a 1) de uma nota de "Seminário Integrador" ou "Atividade Integradora" compartilhada com outras disciplinas do semestre, SE o documento mencionar isso explicitamente. Caso contrário, use 0 e trate essa atividade como um assessment normal.
- A soma de todos os "weight" em "assessments" MAIS "siWeight" deve ser igual a 1.0 (ou seja, 100% da nota final). Se o documento não especificar pesos claramente, distribua os pesos igualmente entre as avaliações encontradas e avise isso em "calcDesc" com um aviso "⚠️".
- Extraia TODAS as datas de aulas, provas, seminários e eventos do cronograma para "schedule", com o máximo de fidelidade às datas exatas do documento (formato YYYY-MM-DD, assumindo o ano correto pelo contexto do documento).
- "sections" deve conter o conteúdo programático agrupado por prova/unidade, para servir de checklist de estudo.
- Nunca invente notas mínimas de aprovação ou pesos que não estejam no documento — se não houver essa informação, use 5.0 como padrão e mencione isso em calcDesc.
- Responda em português do Brasil.`;

async function analyzeEmentaWithGemini(file) {
  importLogLines = [];
  pendingImportDiscipline = null;
  document.getElementById('import-preview-wrap') && (document.getElementById('import-preview-wrap').innerHTML = '');

  const apiKey = getGeminiKey();
  if (!apiKey) { alert('Cole sua chave de API do Gemini antes de enviar um PDF.'); return; }
  if (file.type !== 'application/pdf') { alert('Envie um arquivo PDF.'); return; }

  importLog(`Lendo arquivo "${file.name}" (${(file.size / 1024).toFixed(0)} KB)...`);
  renderAll();

  try {
    const base64 = await fileToBase64(file);
    importLog('Enviando para o Gemini (' + getGeminiModel() + ')...');
    renderAll();

    const model = getGeminiModel();
    const resp = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent?key=${apiKey}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        contents: [{
          parts: [
            { text: GEMINI_EXTRACTION_PROMPT },
            { inline_data: { mime_type: 'application/pdf', data: base64 } }
          ]
        }],
        generationConfig: { responseMimeType: 'application/json', temperature: 0.2 }
      })
    });

    if (!resp.ok) {
      const errBody = await resp.text();
      throw new Error(`Gemini API respondeu ${resp.status}: ${errBody.slice(0, 300)}`);
    }
    const data = await resp.json();
    const text = data.candidates?.[0]?.content?.parts?.[0]?.text;
    if (!text) throw new Error('Resposta do Gemini veio vazia. Tente novamente ou troque o modelo.');

    importLog('Resposta recebida. Validando estrutura...');
    let parsed;
    try { parsed = JSON.parse(text); }
    catch (e) { throw new Error('O Gemini não devolveu um JSON válido. Tente novamente.'); }

    if (!parsed.fullLabel || !Array.isArray(parsed.assessments)) {
      throw new Error('JSON incompleto (faltam campos obrigatórios: fullLabel, assessments).');
    }

    // Garante ids únicos e defaults seguros
    const baseId = (parsed.id || parsed.fullLabel).toLowerCase().normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
    let finalId = baseId, suffix = 1;
    while (userDisciplines.find(d => d.id === finalId)) { finalId = `${baseId}-${++suffix}`; }
    parsed.id = finalId;
    parsed.label = parsed.label || parsed.fullLabel.slice(0, 14);
    parsed.emoji = parsed.emoji || '📘';
    parsed.color = parsed.color || '#334155';
    parsed.fill = parsed.fill || parsed.color;
    parsed.siWeight = Number(parsed.siWeight) || 0;
    parsed.passingGrade = Number(parsed.passingGrade) || 5.0;
    parsed.sections = (parsed.sections || []).map(s => ({ title: s.title, items: (s.items || []).map(lbl => ({ id: genId(), label: lbl, status: 0 })) }));
    parsed.schedule = parsed.schedule || [];
    parsed.assessments = (parsed.assessments || []).map(a => ({ id: a.id || genId(), label: a.label, weight: Number(a.weight) || 0, max: Number(a.max) || 10 }));

    pendingImportDiscipline = parsed;
    importLog(`✅ Disciplina "${parsed.fullLabel}" extraída: ${parsed.assessments.length} avaliações, ${parsed.sections.length} seções, ${parsed.schedule.length} eventos de cronograma.`);
    importLog('Revise abaixo e clique em "Adicionar disciplina" para confirmar.');
  } catch (e) {
    console.error(e);
    importLog('❌ ' + e.message);
  }
  renderAll();
}

function renderImportPreview(disc) {
  const totalWeight = disc.assessments.reduce((s, a) => s + a.weight, 0) + (disc.siWeight || 0);
  const weightWarn = Math.abs(totalWeight - 1) > 0.02 ? `<div class="warn-box">⚠️ Os pesos somam ${(totalWeight * 100).toFixed(0)}% (deveria ser 100%). Revise os pesos na página da disciplina depois de importar.</div>` : '';
  return `
    <div class="import-preview">
      <h4>${disc.emoji} ${disc.fullLabel} <span style="color:var(--slate);font-weight:400;font-size:.8rem">(${disc.code || 'sem código'})</span></h4>
      ${weightWarn}
      <div class="calc-info-box">${disc.calcDesc || ''}</div>
      <div><b>Avaliações:</b></div>
      <div class="pill-list">${disc.assessments.map(a => `<span>${a.label} — ${(a.weight * 100).toFixed(1)}%</span>`).join('')}</div>
      ${disc.siWeight ? `<div class="pill-list"><span>⭐ Seminário Integrador — ${(disc.siWeight * 100).toFixed(0)}%</span></div>` : ''}
      <div style="margin-top:10px"><b>Conteúdo:</b> ${disc.sections.length} seções, ${disc.sections.reduce((s, x) => s + x.items.length, 0)} tópicos</div>
      <div><b>Cronograma:</b> ${disc.schedule.length} eventos</div>
      <div style="margin-top:16px;display:flex;gap:10px">
        <button class="btn btn-primary" onclick="confirmImportDiscipline()">✅ Adicionar disciplina</button>
        <button class="btn btn-ghost" onclick="cancelImportDiscipline()">Cancelar</button>
      </div>
    </div>
  `;
}

function confirmImportDiscipline() {
  if (!pendingImportDiscipline) return;
  userDisciplines.push(pendingImportDiscipline);
  if (!userGrades[pendingImportDiscipline.id]) userGrades[pendingImportDiscipline.id] = {};
  const newId = pendingImportDiscipline.id;
  pendingImportDiscipline = null;
  importLogLines = [];
  scheduleSave();
  switchTab(newId);
}

function cancelImportDiscipline() {
  pendingImportDiscipline = null;
  renderAll();
}
