// Application state
const API_URL = "http://127.0.0.1:8000"; // endereço da sua API local
const TEMPLATE = { rows: 75, cols: 5, x: 0.06, y: 0.18, w: 0.88, h: 0.68 };

let currentPage = 'landing';
let mainSidebarOpen = false;
let dashboardSidebarOpen = false;
let currentTheme = 'light'; // Theme state
let uploads = [
  {
    id: 1,
    filename: "cartao_001.jpg",
    status: "Concluído",
    timestamp: "2025-10-23 10:15"
  },
  {
    id: 2,
    filename: "cartao_002.jpg",
    status: "Processando",
    timestamp: "2025-10-23 10:12"
  },
  {
    id: 3,
    filename: "cartao_003.jpg",
    status: "Erro",
    timestamp: "2025-10-23 10:08"
  },
  {
    id: 4,
    filename: "cartao_004.jpg",
    status: "Concluído",
    timestamp: "2025-10-23 10:05"
  }
];

let stats = {
  total_processed: 156,
  success_rate: 94.2,
  average_accuracy: 87.5
};

// Page navigation functions
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

  // Close main sidebar
  closeMainSidebar();

  // Update page title
  document.title = 'Dashboard - MarkQuest';
}

// Backward compatibility
function showDashboard() {
  goToDashboard();
}

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

  // Close any open sidebars
  closeMainSidebar();
  closeDashboardSidebar();

  // Update page title
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

  // Close main sidebar
  closeMainSidebar();

  // Update page title
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

  // Close main sidebar
  closeMainSidebar();

  // Update theme controls
  setTimeout(updateThemeControls, 100);

  // Update page title
  document.title = 'Configurações - MarkQuest';
}

function goToLogin() {
  closeMainSidebar();
  showNotification('Página de "Login" em desenvolvimento');
}

// Dashboard section navigation
function goToDashboardSection(section) {
  // First ensure we're on the dashboard page
  if (currentPage !== 'dashboard') {
    goToDashboard();
  }

  closeMainSidebar();

  switch (section) {
    case 'enviar-cartao':
      showNotification('Funcionalidade "Enviar cartão" ativa no Dashboard');
      break;
    case 'gabaritos':
      showNotification('Seção "Gabaritos" em desenvolvimento');
      break;
    case 'relatorios':
      showNotification('Seção "Relatórios" em desenvolvimento');
      break;
    case 'configuracoes':
      goToConfiguracoes();
      break;
    default:
      showNotification(`Seção "${section}" em desenvolvimento`);
  }
}

// Backward compatibility
function showDashboardSection(section) {
  goToDashboardSection(section);
}

function goToTest() {
  showNotification('Redirecionando para página de teste...');
  // In a real application, this would redirect to a test/demo page
  setTimeout(() => {
    showNotification('Demo: Esta seria uma página de cadastro ou demonstração');
  }, 1500);
}

// Main sidebar toggle functionality (available on all pages)
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

function closeMainSidebar() {
  if (mainSidebarOpen) {
    toggleSidebar();
  }
}

// Dashboard sidebar toggle functionality
function toggleDashboardSidebar() {
  const sidebar = document.querySelector('.sidebar');
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

function closeDashboardSidebar() {
  if (dashboardSidebarOpen) {
    toggleDashboardSidebar();
  }
}

// Dashboard sidebar navigation
function setActiveNav(element) {
  // Remove active class from all dashboard sidebar links
  const sidebarLinks = document.querySelectorAll('#dashboard-page .sidebar-link');
  sidebarLinks.forEach(link => link.classList.remove('active'));

  // Add active class to clicked link
  element.classList.add('active');

  // Here you could implement different views based on the selected menu item
  const linkText = element.querySelector('span').textContent;
  console.log(`Dashboard navigated to: ${linkText}`);

  // Show a simple notification
  showNotification(`Dashboard: Você acessou ${linkText}`);

  // Close dashboard sidebar on mobile after navigation
  setTimeout(closeDashboardSidebar, 300);
}

// Upload functionality
function handleUpload() {
  const fileInput = document.getElementById('file-input');
  fileInput.click();
}

async function processFile(input) {
  const file = input.files[0];
  if (!file) return;
  if (currentPage !== 'dashboard') goToDashboard();

  const newUpload = {
    id: uploads.length + 1,
    filename: file.name,
    status: "Processando",
    timestamp: new Date().toLocaleString('pt-BR', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' }),
    result: null,
    previewURL: null
  };
  uploads.unshift(newUpload);
  updateUploadsUI();
  showProcessingBalloon(newUpload);

  // prévia
  const isPDF = file.type === 'application/pdf';
  const previewURL = URL.createObjectURL(file);
  newUpload.previewURL = previewURL;

  ensureResultsPanel();
  const imgEl = document.getElementById('result-image');

  if (isPDF) {
    const ph = document.getElementById('result-placeholder'); // pode não existir
    if (ph) ph.textContent = 'PDF enviado. A prévia aparecerá após o processamento.';
    if (imgEl) imgEl.src = ''; // limpa
  } else {
    if (imgEl) {
      imgEl.onload = () => drawOverlay(imgEl, /*answers*/ null);
      imgEl.src = previewURL;
    }
  }


  try {
    const fd = new FormData();
    fd.append("file", file);
    const res = await fetch(`${API_URL}/scan`, { method: "POST", body: fd });
    const txt = await res.text();
    if (!res.ok) throw new Error(`HTTP ${res.status} - ${txt}`);

    const data = JSON.parse(txt); // em vez de res.json()
    window.__lastScanMeta = data.meta || {};
    console.log('SCAN OK:', data);

    if (data.preview_image_base64) {
      const b64 = `data:image/jpeg;base64,${data.preview_image_base64}`;

      // atualiza painel principal
      const imgEl = document.getElementById('result-image');
      if (imgEl) {
        imgEl.onload = () => drawOverlay(imgEl, data.answers || null);
        imgEl.src = b64;
      }

      // salva a prévia para o modal de detalhes
      newUpload.previewURL = b64;
    }

    newUpload.status = "Concluído";
    newUpload.result = data;
    updateUploadsUI();
    updateProcessingBalloon(newUpload, "Concluído");

    renderOmrAnswers(data);           // duas colunas
    drawOverlay(imgEl, data.answers); // overlay por cima
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

// Simulate processing completion after 3 seconds
setTimeout(() => {
  const uploadIndex = uploads.findIndex(u => u.id === newUpload.id);
  if (uploadIndex !== -1) {
    uploads[uploadIndex].status = Math.random() > 0.1 ? "Concluído" : "Erro";
    updateUploadsUI();

    const status = uploads[uploadIndex].status;
    const message = status === "Concluído"
      ? `Upload concluído com sucesso: ${file.name}`
      : `Erro no processamento: ${file.name}`;

    // Message already shown above

    // Update stats if successful
    if (status === "Concluído") {
      stats.total_processed++;
      updateStatsUI();
    }
  }
}, 3000);

// Clear the input
input.value = '';

// Update UI functions
function updateUploadsUI() {
  const uploadsList = document.querySelector('.uploads-list');

  uploadsList.innerHTML = uploads.slice(0, 4).map(upload => {
    const statusClass = getStatusClass(upload.status);
    const detailsBtn = upload.result
      ? `<button class="btn btn--outline btn--sm" onclick="showDetails(${upload.id})">Ver detalhes</button>`
      : '';
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
  document.body.style.overflow = 'hidden'; // trava o fundo
}

function closeDetails() {
  document.getElementById('details-modal').style.display = 'none';
  document.getElementById('details-backdrop').style.display = 'none';
  document.body.style.overflow = ''; // libera novamente
}

function updateStatsUI() {
  const statCards = document.querySelectorAll('.stat-card');
  const statValues = [stats.total_processed, `${stats.success_rate}%`, `${stats.average_accuracy}%`];

  statCards.forEach((card, index) => {
    const valueElement = card.querySelector('.stat-value');
    if (valueElement) {
      valueElement.textContent = statValues[index];
    }
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
  item.className = 'upload-item'; // reaproveita seu estilo de item
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

  if (status === 'Concluído') {
    badge.className = 'status status--success';
    badge.textContent = 'Concluído';
  } else if (status === 'Erro') {
    badge.className = 'status status--error';
    badge.textContent = 'Erro';
  } else {
    badge.className = 'status status--warning';
    badge.textContent = 'Processando';
  }
}

// opcional: defina um gabarito global quando quiser (ex.: {1:'A',2:'D',...})
// window.gabarito = { 1:'A', 2:'B', ... };

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

  // cores: se houver gabarito, pinta certo/errado; sem gabarito, “success” p/ marcado e “warning” p/ vazio
  const hasKey = typeof window.gabarito === 'object' && window.gabarito !== null;

  const pills = answers.map(a => {
    const q = a.question ?? '?';
    const opt = a.option ?? '—';
    let cls = 'status status--warning'; // sem marcação
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

  // divide em duas colunas equilibradas
  const mid = Math.ceil(pills.length / 2);
  col1.innerHTML = pills.slice(0, mid).join('');
  col2.innerHTML = pills.slice(mid).join('');
}

// Helper functions
function getStatusClass(status) {
  switch (status) {
    case 'Concluído':
      return 'success';
    case 'Processando':
      return 'warning';
    case 'Erro':
      return 'error';
    default:
      return 'info';
  }
}

// Notification system
function showNotification(message, type = 'info') {
  // Create notification element
  const notification = document.createElement('div');
  notification.className = `notification notification--${type}`;
  notification.style.cssText = `
    position: fixed;
    top: 20px;
    right: 20px;
    background: var(--color-surface);
    border: 1px solid var(--color-border);
    border-radius: var(--radius-base);
    padding: var(--space-4);
    box-shadow: var(--shadow-lg);
    z-index: 1000;
    max-width: 400px;
    font-size: var(--font-size-sm);
    color: var(--color-text);
    animation: slideIn 0.3s ease-out;
  `;

  notification.innerHTML = `
    <div style="display: flex; align-items: center; gap: var(--space-2);">
      <i class="fas fa-info-circle" style="color: var(--color-primary);"></i>
      <span>${message}</span>
      <button onclick="this.parentElement.parentElement.remove()" style="
        background: none;
        border: none;
        color: var(--color-text-secondary);
        cursor: pointer;
        margin-left: auto;
        padding: 2px;
      ">
        <i class="fas fa-times"></i>
      </button>
    </div>
  `;

  document.body.appendChild(notification);

  // Auto remove after 5 seconds
  setTimeout(() => {
    if (notification.parentElement) {
      notification.remove();
    }
  }, 5000);
}

// Add CSS for notification animation
function addNotificationStyles() {
  const style = document.createElement('style');
  style.textContent = `
    @keyframes slideIn {
      from {
        transform: translateX(100%);
        opacity: 0;
      }
      to {
        transform: translateX(0);
        opacity: 1;
      }
    }
    
    .notification {
      animation: slideIn 0.3s ease-out;
    }
  `;
  document.head.appendChild(style);
}

// Keyboard navigation
function handleKeyboardNavigation(event) {
  if (event.key === 'Escape') {
    if (mainSidebarOpen) {
      closeMainSidebar();
    } else if (dashboardSidebarOpen) {
      closeDashboardSidebar();
    } else if (currentPage === 'dashboard') {
      goToHome();
    } else if (currentPage === 'about') {
      goToHome();
    }
  }
}

// File drag and drop functionality
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
        // Simulate file selection
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

// Theme management functions
function toggleTheme(theme) {
  currentTheme = theme;

  // Update body class
  const body = document.body;
  if (theme === 'dark') {
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
  }

  // Update radio buttons
  const lightRadio = document.getElementById('theme-light');
  const darkRadio = document.getElementById('theme-dark');

  if (lightRadio && darkRadio) {
    lightRadio.checked = theme === 'light';
    darkRadio.checked = theme === 'dark';
  }

  // Show notification
  const themeName = theme === 'dark' ? 'Modo Escuro' : 'Modo Claro';
  showNotification(`Tema alterado para ${themeName}`, 'success');

  console.log(`Theme changed to: ${theme}`);
}

// Initialize theme on page load
function initializeTheme() {
  // Set initial theme state
  const body = document.body;
  if (currentTheme === 'dark') {
    body.classList.add('dark');
  } else {
    body.classList.remove('dark');
  }

  // Update radio buttons if they exist
  const lightRadio = document.getElementById('theme-light');
  const darkRadio = document.getElementById('theme-dark');

  if (lightRadio && darkRadio) {
    lightRadio.checked = currentTheme === 'light';
    darkRadio.checked = currentTheme === 'dark';
  }
}

// Apply theme when navigating to settings page
function updateThemeControls() {
  const lightRadio = document.getElementById('theme-light');
  const darkRadio = document.getElementById('theme-dark');

  if (lightRadio && darkRadio) {
    lightRadio.checked = currentTheme === 'light';
    darkRadio.checked = currentTheme === 'dark';
  }
}

// Initialize the application
function init() {
  // Add notification styles
  addNotificationStyles();

  // Initialize theme
  initializeTheme();

  // Add keyboard event listener
  document.addEventListener('keydown', handleKeyboardNavigation);

  // Initialize drag and drop after a short delay to ensure DOM is ready
  setTimeout(initializeDragAndDrop, 100);

  // Handle window resize for sidebar responsiveness
  window.addEventListener('resize', () => {
    // Always close sidebars on resize for better UX
    if (mainSidebarOpen) {
      closeMainSidebar();
    }
    if (dashboardSidebarOpen) {
      closeDashboardSidebar();
    }
  });

  // Show welcome message
  console.log('MarkQuest initialized successfully!');
}

// Run initialization when DOM is loaded
if (document.readyState === 'loading') {
  document.addEventListener('DOMContentLoaded', init);
} else {
  init();
}

// Utility function to show landing page (for backward compatibility)
function showLanding() {
  goToHome();
}

// Settings page functions
function salvarPerfil() {
  const nome = document.getElementById('nome-completo')?.value;
  const email = document.getElementById('email')?.value;
  const telefone = document.getElementById('telefone')?.value;
  const instituicao = document.getElementById('instituicao')?.value;

  showNotification('Perfil atualizado com sucesso!', 'success');
}

function salvarNotificacoes() {
  const emailNotif = document.getElementById('email-notifications')?.checked;
  const processingNotif = document.getElementById('processing-notifications')?.checked;
  const errorNotif = document.getElementById('error-notifications')?.checked;
  const updateNotif = document.getElementById('update-notifications')?.checked;

  showNotification('Preferências de notificação salvas!', 'success');
}

function salvarCorrecao() {
  const tolerancia = document.getElementById('tolerancia')?.value;
  const formato = document.getElementById('formato-cartao')?.value;
  const exportacao = document.getElementById('formato-exportacao')?.value;
  const autoSave = document.getElementById('auto-save-templates')?.checked;

  showNotification('Configurações de correção atualizadas!', 'success');
}

function alterarSenha() {
  showNotification('Redirecionando para alteração de senha...');
}

function gerenciarSessoes() {
  showNotification('Abrindo gerenciamento de sessões...');
}

function encerrarSessoes() {
  showNotification('Todas as sessões foram encerradas!', 'success');
}

function gerenciarPlano() {
  showNotification('Abrindo gerenciamento de plano...');
}

function historicoPagamentos() {
  showNotification('Abrindo histórico de pagamentos...');
}

function exportarDados() {
  showNotification('Iniciando exportação dos seus dados...');
}

function excluirConta() {
  if (confirm('Tem certeza que deseja excluir sua conta? Esta ação não pode ser desfeita.')) {
    showNotification('Solicitação de exclusão enviada!', 'warning');
  }
}

function abrirPoliticaPrivacidade() {
  showNotification('Abrindo Política de Privacidade...');
}

function abrirTermosUso() {
  showNotification('Abrindo Termos de Uso...');
}

function abrirChangelog() {
  showNotification('Abrindo changelog do sistema...');
}

function abrirSuporte() {
  showNotification('Abrindo suporte técnico...');
}

// Simulate periodic status updates for demonstration
setInterval(() => {
  if (currentPage === 'dashboard') {
    // Find any "Processando" uploads and randomly complete them
    const processingUploads = uploads.filter(u => u.status === 'Processando');
    if (processingUploads.length > 0 && Math.random() > 0.7) {
      const randomUpload = processingUploads[Math.floor(Math.random() * processingUploads.length)];
      randomUpload.status = Math.random() > 0.2 ? 'Concluído' : 'Erro';
      updateUploadsUI();

      if (randomUpload.status === 'Concluído') {
        stats.total_processed++;
        updateStatsUI();
      }
    }
  }
}, 10000); // Check every 10 seconds

function drawOverlay(imgEl, apiAnswers, canvasId = 'result-overlay') {
  const canvas = document.getElementById(canvasId);
  if (!canvas || !imgEl) return;

  const dispW = imgEl.clientWidth || imgEl.getBoundingClientRect().width;
  const dispH = imgEl.clientHeight || imgEl.getBoundingClientRect().height;
  canvas.width = dispW;
  canvas.height = dispH;

  const ctx = canvas.getContext('2d');
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // 1) Cantos detectados (debug)
  const meta = (window.__lastScanMeta || {});
  if (meta.warp_pts_norm && Array.isArray(meta.warp_pts_norm)) {
    ctx.strokeStyle = 'rgba(255, 120, 0, 0.9)';
    ctx.lineWidth = 2;
    ctx.beginPath();
    meta.warp_pts_norm.forEach((p, i) => {
      const x = p[0] * dispW;
      const y = p[1] * dispH;
      if (i === 0) ctx.moveTo(x, y); else ctx.lineTo(x, y);
      ctx.fillStyle = 'rgba(255,120,0,0.9)';
      ctx.beginPath(); ctx.arc(x, y, 4, 0, Math.PI * 2); ctx.fill();
    });
    ctx.closePath();
    ctx.stroke();
  }

  // 2) Área do grid (TEMPLATE)
  const gx = TEMPLATE.x * dispW;
  const gy = TEMPLATE.y * dispH;
  const gw = TEMPLATE.w * dispW;
  const gh = TEMPLATE.h * dispH;

  ctx.strokeStyle = 'rgba(0, 160, 120, 0.9)';
  ctx.lineWidth = 2;
  ctx.strokeRect(gx, gy, gw, gh);

  const answers = Array.isArray(apiAnswers) ? apiAnswers : [];
  if (!answers.length) return;

  const cellH = gh / TEMPLATE.rows;
  const cellW = gw / TEMPLATE.cols;

  answers.forEach((a, i) => {
    const r = (a.question ? a.question - 1 : i);
    const optIdx = a.option ? 'ABCDE'.indexOf(a.option) : -1;

    ctx.strokeStyle = 'rgba(0,0,0,0.08)';
    ctx.strokeRect(gx, gy + r * cellH, gw, cellH);

    if (optIdx >= 0 && a.marked) {
      const x = gx + optIdx * cellW;
      const y = gy + r * cellH;
      ctx.fillStyle = 'rgba(0, 160, 255, 0.25)';
      ctx.fillRect(x, y, cellW, cellH);
    }
  });
}

window.gabarito = {
  1: 'A', 2: 'C', 3: 'B', /* ... */ 75: 'D'
};