import { drawOverlay } from '../utils/overlay.js';

// Application state
const API_URL = window.VITE_API_BASE || '/omr_api'; // endereço da sua API local

let currentPage = 'landing';
let mainSidebarOpen = false;
let dashboardSidebarOpen = false;
let currentTheme = 'light'; // Theme state
let uploads = [
  { id: 1, filename: "cartao_001.jpg", status: "Concluído", timestamp: "2025-10-23 10:15" },
  { id: 2, filename: "cartao_002.jpg", status: "Processando", timestamp: "2025-10-23 10:12" },
  { id: 3, filename: "cartao_003.jpg", status: "Erro",       timestamp: "2025-10-23 10:08" },
  { id: 4, filename: "cartao_004.jpg", status: "Concluído",  timestamp: "2025-10-23 10:05" }
];

let stats = { total_processed: 156, success_rate: 94.2, average_accuracy: 87.5 };

// ------------------------ Navegação de páginas ------------------------
function goToDashboard() {
  const landingPage = document.getElementById('landing-page');
  const dashboardPage = document.getElementById('dashboard-page');
  const aboutPage = document.getElementById('about-page');
  const configuracoesPage = document.getElementById('configuracoes-page');

  landingPage.classList.remove('active');
  aboutPage.classList.remove('active');
  configuracoesPage.classList.remove('active');
  dashboardPage.classList.add('active');
  currentPage = 'dashboard';

  closeMainSidebar();
  document.title = 'Dashboard - MarkQuest';
}
function showDashboard(){ goToDashboard(); }

function goToHome() {
  const landingPage = document.getElementById('landing-page');
  const dashboardPage = document.getElementById('dashboard-page');
  const aboutPage = document.getElementById('about-page');
  const configuracoesPage = document.getElementById('configuracoes-page');

  dashboardPage.classList.remove('active');
  aboutPage.classList.remove('active');
  configuracoesPage.classList.remove('active');
  landingPage.classList.add('active');
  currentPage = 'landing';

  closeMainSidebar();
  closeDashboardSidebar();
  document.title = 'MarkQuest - Correção Automática de Cartões-Resposta';
}

function goToAbout() {
  const landingPage = document.getElementById('landing-page');
  const dashboardPage = document.getElementById('dashboard-page');
  const aboutPage = document.getElementById('about-page');
  const configuracoesPage = document.getElementById('configuracoes-page');

  landingPage.classList.remove('active');
  dashboardPage.classList.remove('active');
  configuracoesPage.classList.remove('active');
  aboutPage.classList.add('active');
  currentPage = 'about';

  closeMainSidebar();
  document.title = 'Sobre - MarkQuest';
}

function goToConfiguracoes() {
  const landingPage = document.getElementById('landing-page');
  const dashboardPage = document.getElementById('dashboard-page');
  const aboutPage = document.getElementById('about-page');
  const configuracoesPage = document.getElementById('configuracoes-page');

  landingPage.classList.remove('active');
  dashboardPage.classList.remove('active');
  aboutPage.classList.remove('active');
  configuracoesPage.classList.add('active');
  currentPage = 'configuracoes';

  closeMainSidebar();
  setTimeout(updateThemeControls, 100);
  document.title = 'Configurações - MarkQuest';
}

function goToLogin() {
  closeMainSidebar();
  showNotification('Página de "Login" em desenvolvimento');
}

function goToDashboardSection(section) {
  if (currentPage !== 'dashboard') goToDashboard();
  closeMainSidebar();

  switch (section) {
    case 'enviar-cartao': showNotification('Funcionalidade "Enviar cartão" ativa no Dashboard'); break;
    case 'gabaritos':     showNotification('Seção "Gabaritos" em desenvolvimento'); break;
    case 'relatorios':    showNotification('Seção "Relatórios" em desenvolvimento'); break;
    case 'configuracoes': goToConfiguracoes(); break;
    default:              showNotification(`Seção "${section}" em desenvolvimento`);
  }
}
function showDashboardSection(section){ goToDashboardSection(section); }

// ------------------------ Sidebars ------------------------
function toggleSidebar() {
  const sidebar = document.querySelector('.main-sidebar');
  const overlay = document.querySelector('.sidebar-overlay');
  mainSidebarOpen = !mainSidebarOpen;
  if (mainSidebarOpen) {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}
function closeMainSidebar(){ if (mainSidebarOpen) toggleSidebar(); }

function toggleDashboardSidebar() {
  const sidebar = document.querySelector('#dashboard-page .sidebar');
  const overlay = document.querySelector('.dashboard-sidebar-overlay');
  dashboardSidebarOpen = !dashboardSidebarOpen;
  if (dashboardSidebarOpen) {
    sidebar.classList.add('open');
    overlay.classList.add('active');
    document.body.style.overflow = 'hidden';
  } else {
    sidebar.classList.remove('open');
    overlay.classList.remove('active');
    document.body.style.overflow = '';
  }
}
function closeDashboardSidebar(){ if (dashboardSidebarOpen) toggleDashboardSidebar(); }

function setActiveNav(element) {
  const sidebarLinks = document.querySelectorAll('#dashboard-page .sidebar-link');
  sidebarLinks.forEach(link => link.classList.remove('active'));
  element.classList.add('active');

  const linkText = element.querySelector('span').textContent;
  showNotification(`Dashboard: Você acessou ${linkText}`);
  setTimeout(closeDashboardSidebar, 300);
}

// ------------------------ Upload / Processamento ------------------------
function handleUpload() {
  const fileInput = document.getElementById('file-input');
  fileInput?.click();
}

async function processFile(input) {
  const file = input.files[0];
  if (!file) return;
  if (currentPage !== 'dashboard') goToDashboard();

  const newUpload = {
    id: uploads.length + 1,
    filename: file.name,
    status: "Processando",
    timestamp: new Date().toLocaleString('pt-BR', { year:'numeric', month:'2-digit', day:'2-digit', hour:'2-digit', minute:'2-digit' }),
    result: null,
    previewURL: null
  };
  uploads.unshift(newUpload);
  updateUploadsUI();
  showProcessingBalloon(newUpload);

  const isPDF = file.type === 'application/pdf';
  const previewURL = URL.createObjectURL(file);
  newUpload.previewURL = previewURL;

  ensureResultsPanel();
  const imgEl = document.getElementById('result-image');

  if (isPDF) {
    const ph = document.getElementById('result-placeholder');
    if (ph) ph.textContent = 'PDF enviado. A prévia aparecerá após o processamento.';
    if (imgEl) imgEl.src = '';
  } else if (imgEl) {
    imgEl.onload = () => drawOverlay(imgEl, null);
    imgEl.src = previewURL;
  }

  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_URL}/scan`, { method: "POST", body: fd });
    const txt = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${txt}`);

    const data = JSON.parse(txt);
    window.__lastScanMeta = data.meta || {};

    if (data.preview_image_base64) {
      const b64 = `data:image/jpeg;base64,${data.preview_image_base64}`;
      const imgEl = document.getElementById('result-image');
      if (imgEl) {
        imgEl.onload = () => drawOverlay(imgEl, data.answers || null);
        imgEl.src = b64;
      }
      newUpload.previewURL = b64;
    }

    newUpload.status = "Concluído";
    newUpload.result = data;
    updateUploadsUI();
    updateProcessingBalloon(newUpload, "Concluído");

    renderOmrAnswers(data);
    if (imgEl) drawOverlay(imgEl, data.answers);
    showNotification(`Processamento concluído: ${file.name}`, 'success');
  } catch (err) {
    newUpload.status = "Erro";
    updateUploadsUI();
    updateProcessingBalloon(newUpload, "Erro");
    showNotification("Falha no processamento. Veja o console.", 'error');
    console.error(err);
  } finally {
    input.value = "";
  }
}

// ------------------------ UI helpers ------------------------
function updateUploadsUI() {
  const uploadsList = document.querySelector('.uploads-list');
  if (!uploadsList) return;
  uploadsList.innerHTML = uploads.slice(0, 4).map(upload => {
    const statusClass = getStatusClass(upload.status);
    const detailsBtn = upload.result ? `<button class="btn btn--outline btn--sm" onclick="showDetails(${upload.id})">Ver detalhes</button>` : '';
    return `
      <div class="upload-item">
        <div class="upload-info">
          <span class="upload-filename">${upload.filename}</span>
          <span class="upload-time">${upload.timestamp}</span>
        </div>
        <div style="display:flex; align-items:center; gap: var(--space-3);">
          ${detailsBtn}
          <span class="status status--${statusClass}">${upload.status}</span>
        </div>
      </div>
    `;
  }).join('');
}

function showDetails(id) {
  const up = uploads.find(u => u.id === id);
  if (!up || !up.result) return;

  const modal = document.getElementById('details-modal');
  const backdrop = document.getElementById('details-backdrop');
  const content = document.getElementById('details-content');
  const title = document.getElementById('details-title');

  title.textContent = `Detalhes — ${up.filename}`;
  content.innerHTML = `
    <div class="results-layout" style="display:grid; grid-template-columns: 1fr 1fr; gap: var(--space-5);">
      <div>
        <h4>Imagem enviada</h4>
        <div class="image-stack" style="position:relative; border:1px solid var(--color-card-border); border-radius: var(--radius-lg); overflow:hidden;">
          <img id="details-image" style="display:block; width:100%; height:auto;">
          <canvas id="details-overlay" style="position:absolute; left:0; top:0; width:100%; height:100%; pointer-events:none;"></canvas>
        </div>
      </div>
      <div>
        <h4>Marcações detectadas</h4>
        <div class="answers-columns" style="display:grid; grid-template-columns: 1fr 1fr; gap: var(--space-3);">
          <div id="details-col-1" style="display:flex; flex-direction:column; gap: var(--space-2);"></div>
          <div id="details-col-2" style="display:flex; flex-direction:column; gap: var(--space-2);"></div>
        </div>
      </div>
    </div>
  `;
  const img = document.getElementById('details-image');
  img.onload = () => drawOverlay(img, up.result.answers, 'details-overlay');
  img.src = up.previewURL || document.getElementById('result-image')?.src;

  const answers = up.result.answers || [];
  const pills = answers.map(a => {
    const q = a.question ?? '?';
    const opt = a.option ?? '—';
    let cls = a.marked ? 'status status--success' : 'status status--warning';
    let label = a.marked ? `Q${q}: ${opt}` : `Q${q}: Sem Marcação`;
    if (window.gabarito && window.gabarito[q]) {
      const correct = window.gabarito[q];
      const isRight = a.marked && (opt === correct);
      cls = isRight ? 'status status--success' : 'status status--error';
      label = a.marked ? `Q${q}: ${opt} ${isRight ? '✓' : `≠ ${correct}`}` : `Q${q}: Sem Marcação`;
    }
    return `<span class="${cls}">${label}</span>`;
  });
  const mid = Math.ceil(pills.length / 2);
  document.getElementById('details-col-1').innerHTML = pills.slice(0, mid).join('');
  document.getElementById('details-col-2').innerHTML = pills.slice(mid).join('');

  modal.style.display = 'block';
  backdrop.style.display = 'block';
  document.body.style.overflow = 'hidden';
}
function closeDetails() {
  document.getElementById('details-modal').style.display = 'none';
  document.getElementById('details-backdrop').style.display = 'none';
  document.body.style.overflow = '';
}

function updateStatsUI() {
  const statCards = document.querySelectorAll('.stat-card');
  const statValues = [stats.total_processed, `${stats.success_rate}%`, `${stats.average_accuracy}%`];
  statCards.forEach((card, index) => {
    const valueElement = card.querySelector('.stat-value');
    if (valueElement) valueElement.textContent = statValues[index];
  });
}

function ensureResultsPanel() {
  const balloons = document.getElementById('processing-balloons');
  const panel = document.getElementById('results-panel');
  if (balloons) balloons.style.display = 'block';
  if (panel) panel.style.display = 'block';
}

function showProcessingBalloon(upload) {
  ensureResultsPanel();
  const wrap = document.getElementById('processing-balloons');
  if (!wrap) return;
  const idAttr = `balloon-${upload.id}`;
  const item = document.createElement('div');
  item.id = idAttr;
  item.className = 'upload-item';
  item.innerHTML = `
    <div class="upload-info">
      <span class="upload-filename">${upload.filename}</span>
      <span class="upload-time">${upload.timestamp}</span>
    </div>
    <span class="status status--warning">Processando</span>
  `;
  wrap.prepend(item);
}
function updateProcessingBalloon(upload, status) {
  const el = document.getElementById(`balloon-${upload.id}`);
  if (!el) return;
  const badge = el.querySelector('.status');
  if (!badge) return;
  if (status === 'Concluído') { badge.className = 'status status--success'; badge.textContent = 'Concluído'; }
  else if (status === 'Erro') { badge.className = 'status status--error'; badge.textContent = 'Erro'; }
  else { badge.className = 'status status--warning'; badge.textContent = 'Processando'; }
}

// ------------------------ Respostas (duas colunas) ------------------------
function renderOmrAnswers(apiData) {
  ensureResultsPanel();
  const col1 = document.getElementById('answers-col-1');
  const col2 = document.getElementById('answers-col-2');
  if (!col1 || !col2) return;

  const answers = Array.isArray(apiData?.answers) ? apiData.answers : [];
  if (answers.length === 0) {
    col1.innerHTML = `<span class="status status--info">Nenhuma marcação detectada</span>`;
    col2.innerHTML = ``;
    return;
  }

  const hasKey = typeof window.gabarito === 'object' && window.gabarito !== null;
  const pills = answers.map(a => {
    const q = a.question ?? '?';
    const opt = a.option ?? '—';
    let cls = 'status status--warning';
    let label = `Q${q}: Sem Marcação`;
    if (a.marked) {
      if (hasKey && window.gabarito[q]) {
        const correct = window.gabarito[q];
        const isRight = (opt === correct);
        cls = isRight ? 'status status--success' : 'status status--error';
        label = `Q${q}: ${opt} ${isRight ? '✓' : `≠ ${correct}`}`;
      } else {
        cls = 'status status--success';
        label = `Q${q}: ${opt}`;
      }
    }
    return `<span class="${cls}" title="fill=${a.filled_ratio} conf=${a.confidence}">${label}</span>`;
  });
  const mid = Math.ceil(pills.length / 2);
  col1.innerHTML = pills.slice(0, mid).join('');
  col2.innerHTML = pills.slice(mid).join('');
}

// ------------------------ Helpers / Notificações / Tema ------------------------
function getStatusClass(status) {
  switch (status) {
    case 'Concluído': return 'success';
    case 'Processando': return 'warning';
    case 'Erro': return 'error';
    default: return 'info';
  }
}

function showNotification(message, type = 'info') {
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.style.cssText = `
    position: fixed; top: 20px; right: 20px; background: var(--color-surface);
    border: 1px solid var(--color-border); border-radius: var(--radius-base);
    padding: var(--space-4); box-shadow: var(--shadow-lg); z-index: 1000;
    max-width: 400px; font-size: var(--font-size-sm); color: var(--color-text);
    animation: slideIn 0.3s ease-out;
  `;
  notification.innerHTML = `
    <div style="display:flex; align-items:center; gap: var(--space-2);">
      <i class="fas fa-info-circle" style="color: var(--color-primary);"></i>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="background:none; border:none; color: var(--color-text-secondary); cursor:pointer; margin-left:auto; padding:2px;">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;
  document.body.appendChild(notification);
  setTimeout(() => { notification.parentElement && notification.remove(); }, 5000);
}

function addNotificationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn { from { transform: translateX(100%); opacity: 0; } to { transform: translateX(0); opacity: 1; } }
    .notification { animation: slideIn 0.3s ease-out; }
  `;
  document.head.appendChild(style);
}

function handleKeyboardNavigation(event) {
  if (event.key === 'Escape') {
    if (mainSidebarOpen) closeMainSidebar();
    else if (dashboardSidebarOpen) closeDashboardSidebar();
    else if (currentPage === 'dashboard') goToHome();
    else if (currentPage === 'about') goToHome();
  }
}

// Drag & Drop
function initializeDragAndDrop() {
  const uploadCard = document.querySelector('.upload-card');
  if (!uploadCard) return;

  uploadCard.addEventListener('dragover', (e) => {
    e.preventDefault();
    uploadCard.style.backgroundColor = 'rgba(var(--color-blue-600-rgb), 0.05)';
    uploadCard.style.borderColor = 'var(--color-primary)';
  });
  uploadCard.addEventListener('dragleave', (e) => {
    e.preventDefault();
    uploadCard.style.backgroundColor = '';
    uploadCard.style.borderColor = '';
  });
  uploadCard.addEventListener('drop', (e) => {
    e.preventDefault();
    uploadCard.style.backgroundColor = '';
    uploadCard.style.borderColor = '';
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      const file = files[0];
      if (file.type.startsWith('image/') || file.type === 'application/pdf') {
        const fileInput = document.getElementById('file-input');
        const dt = new DataTransfer();
        dt.items.add(file);
        fileInput.files = dt.files;
        processFile(fileInput);
      } else {
        showNotification('Por favor, selecione apenas arquivos de imagem.', 'error');
      }
    }
  });
}

// Tema
function toggleTheme(theme) {
  currentTheme = theme;
  const body = document.body;
  if (theme === 'dark') body.classList.add('dark'); else body.classList.remove('dark');
  const lightRadio = document.getElementById('theme-light');
  const darkRadio = document.getElementById('theme-dark');
  if (lightRadio && darkRadio) { lightRadio.checked = theme === 'light'; darkRadio.checked = theme === 'dark'; }
  const themeName = theme === 'dark' ? 'Modo Escuro' : 'Modo Claro';
  showNotification(`Tema alterado para ${themeName}`, 'success');
}

function initializeTheme() {
  const body = document.body;
  if (currentTheme === 'dark') body.classList.add('dark'); else body.classList.remove('dark');
  const lightRadio = document.getElementById('theme-light');
  const darkRadio = document.getElementById('theme-dark');
  if (lightRadio && darkRadio) { lightRadio.checked = currentTheme === 'light'; darkRadio.checked = currentTheme === 'dark'; }
}
function updateThemeControls() {
  const lightRadio = document.getElementById('theme-light');
  const darkRadio = document.getElementById('theme-dark');
  if (lightRadio && darkRadio) { lightRadio.checked = currentTheme === 'light'; darkRadio.checked = currentTheme === 'dark'; }
}

// Init
function init() {
  addNotificationStyles();
  initializeTheme();
  document.addEventListener('keydown', handleKeyboardNavigation);
  setTimeout(initializeDragAndDrop, 100);
  window.addEventListener('resize', () => { if (mainSidebarOpen) closeMainSidebar(); if (dashboardSidebarOpen) closeDashboardSidebar(); });
  console.log('MarkQuest initialized successfully!');
}

function showLanding(){ goToHome(); }

// Config page actions
function salvarPerfil(){ showNotification('Perfil atualizado com sucesso!', 'success'); }
function salvarNotificacoes(){ showNotification('Preferências de notificação salvas!', 'success'); }
function salvarCorrecao(){ showNotification('Configurações de correção atualizadas!', 'success'); }
function alterarSenha(){ showNotification('Redirecionando para alteração de senha...'); }
function gerenciarSessoes(){ showNotification('Abrindo gerenciamento de sessões...'); }
function encerrarSessoes(){ showNotification('Todas as sessões foram encerradas!', 'success'); }
function gerenciarPlano(){ showNotification('Abrindo gerenciamento de plano...'); }
function historicoPagamentos(){ showNotification('Abrindo histórico de pagamentos...'); }
function exportarDados(){ showNotification('Iniciando exportação dos seus dados...'); }
function excluirConta(){ if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) showNotification('Solicitação de exclusão enviada!', 'warning'); }
function abrirPoliticaPrivacidade(){ showNotification('Abrindo Política de Privacidade...'); }
function abrirTermosUso(){ showNotification('Abrindo Termos de Uso...'); }
function abrirChangelog(){ showNotification('Abrindo changelog do sistema...'); }
function abrirSuporte(){ showNotification('Abrindo suporte técnico...'); }

// Demo: atualizações periódicas
setInterval(() => {
  if (currentPage === 'dashboard') {
    const processingUploads = uploads.filter(u => u.status === 'Processando');
    if (processingUploads.length > 0 && Math.random() > 0.7) {
      const randomUpload = processingUploads[Math.floor(Math.random() * processingUploads.length)];
      randomUpload.status = Math.random() > 0.2 ? 'Concluído' : 'Erro';
      updateUploadsUI();
      if (randomUpload.status === 'Concluído') { stats.total_processed++; updateStatsUI(); }
    }
  }
}, 10000);

// gabarito opcional
window.gabarito = { 1:'A', 2:'C', 3:'B', /* ... */ 75:'D' };

// Boot para React
export function boot() {
  try {
    Object.assign(window, {
      goToHome, goToDashboard, goToAbout, goToConfiguracoes, goToLogin, goToDashboardSection,
      toggleSidebar, toggleDashboardSidebar, setActiveNav,
      handleUpload, processFile, renderOmrAnswers, ensureResultsPanel, updateUploadsUI,
      showDetails, closeDetails,
      toggleTheme, salvarPerfil, salvarNotificacoes, salvarCorrecao,
      alterarSenha, gerenciarSessoes, encerrarSessoes,
      gerenciarPlano, historicoPagamentos,
      exportarDados, excluirConta, abrirPoliticaPrivacidade, abrirTermosUso, abrirChangelog, abrirSuporte,
      drawOverlay,
    });
  } catch (e) { console.warn('Exposição de funções (window) — algumas podem não existir:', e); }

  if (typeof init === 'function') init();
  window.__legacyReady = true;
  console.log('[MarkQuest] Legacy booted');
}
