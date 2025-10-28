import { useEffect } from "react";
import OMRTemplateDesigner from "./components/OMRTemplateDesigner";

export default function App() {

  useEffect(() => {
    // injeta a variável global para o legado
    window.VITE_API_BASE = import.meta.env.VITE_API_BASE;

    if (!window.__legacyReady) {
      import("./legacy/app-legacy.js").then((m) => m.boot?.());
    }
  }, []);


  return (
    <>
      <a href="#" className="sidebar-link" onclick="showDashboardSection('designer')">
        <i className="fas fa-th"></i><span>Designer</span>
      </a>

      {/* ===== Landing Page ===== */}
      <div id="landing-page" className="page active">
        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="header-content">
              <div className="logo">
                <h1>MarkQuest</h1>
              </div>
              <div className="header-nav">
                {/* Navegação unificada */}
                <div className="header-buttons">
                  <button
                    className="btn btn--outline btn--sm login-btn"
                    onClick={() => window.goToLogin?.()}
                  >
                    Login
                  </button>
                  <button
                    className="hamburger-btn"
                    onClick={() => window.toggleSidebar?.()}
                    aria-label="Toggle Menu"
                  >
                    <span></span>
                    <span></span>
                    <span></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Hero */}
        <section className="hero">
          <div className="container">
            <div className="hero-content">
              <h1 className="hero-title">Corrija cartões-resposta automaticamente</h1>
              <p className="hero-subtitle">A forma mais rápida e precisa de avaliar respostas OMR</p>
              <button
                className="btn btn--primary btn--lg"
                onClick={() => window.goToDashboard?.()}
              >
                Testar agora
              </button>
            </div>
          </div>
        </section>

        {/* Steps */}
        <section className="steps">
          <div className="container">
            <h2 className="steps-main-title">Veja como funciona a correção</h2>
            <div className="steps-grid">
              <div className="step-card">
                <div className="step-number">1</div>
                <h3 className="step-title">Faça upload do cartão</h3>
                <p className="step-description">Envie sua imagem de cartão-resposta de forma simples</p>
              </div>
              <div className="step-card">
                <div className="step-number">2</div>
                <h3 className="step-title">O sistema detecta as marcações</h3>
                <p className="step-description">Reconhecimento automático das respostas marcadas</p>
              </div>
              <div className="step-card">
                <div className="step-number">3</div>
                <h3 className="step-title">Veja o resultado instantâneo</h3>
                <p className="step-description">Obtenha a correção em segundos</p>
              </div>
            </div>
          </div>
        </section>

        {/* Public Stats */}
        <section className="public-stats">
          <div className="container">
            <h2 className="section-title">Nossos Números</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">1.850</div>
                <div className="stat-label">Cartões-resposta lidos</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">38</div>
                <div className="stat-label">Empresas atendidas</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">25</div>
                <div className="stat-label">Atualizações de software</div>
              </div>
            </div>
          </div>
        </section>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <p>© {new Date().getFullYear()} MarkQuest. Todos os direitos reservados.</p>
              <a href="#" className="footer-link">Contato</a>
            </div>
          </div>
        </footer>
      </div>

      {/* ===== Main Sidebar ===== */}
      <aside className="main-sidebar">
        <div className="sidebar-header">
          <h2>MarkQuest</h2>
          <button
            className="sidebar-close-btn"
            onClick={() => window.toggleSidebar?.()}
            aria-label="Fechar Menu"
          >
            <i className="fas fa-times"></i>
          </button>
        </div>
        <nav className="sidebar-nav">
          <a href="#" className="sidebar-link" onClick={() => window.goToHome?.()}>
            <i className="fas fa-home"></i>
            <span>Início</span>
          </a>
          <a href="#" className="sidebar-link" onClick={() => window.goToAbout?.()}>
            <i className="fas fa-info-circle"></i>
            <span>Sobre</span>
          </a>
          <a href="#" className="sidebar-link" onClick={() => window.goToDashboard?.()}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </a>
          <div className="sidebar-separator"></div>
          <a href="#" className="sidebar-link" onClick={() => window.goToDashboardSection?.("enviar-cartao") }>
            <i className="fas fa-upload"></i>
            <span>Enviar cartão</span>
          </a>
          <a href="#" className="sidebar-link" onClick={() => window.goToDashboardSection?.("gabaritos") }>
            <i className="fas fa-file-text"></i>
            <span>Gabaritos</span>
          </a>
          <a href="#" className="sidebar-link" onClick={() => window.goToDashboardSection?.("relatorios") }>
            <i className="fas fa-chart-bar"></i>
            <span>Relatórios</span>
          </a>
          <a href="#" className="sidebar-link" onClick={() => window.goToConfiguracoes?.()}>
            <i className="fas fa-cog"></i>
            <span>Configurações</span>
          </a>
        </nav>
      </aside>
      <div className="sidebar-overlay" onClick={() => window.toggleSidebar?.()}></div>

      {/* ===== Dashboard Page ===== */}
      <div id="dashboard-page" className="page">
        {/* Dashboard Sidebar */}
        <aside className="sidebar">
          <div className="sidebar-header">
            <h2>Dashboard</h2>
            <button
              className="sidebar-close-btn"
              onClick={() => window.toggleDashboardSidebar?.()}
              aria-label="Fechar Menu"
            >
              <i className="fas fa-times"></i>
            </button>
          </div>
          <nav className="sidebar-nav">
            <a href="#" className="sidebar-link active" onClick={(e) => { e.preventDefault(); window.setActiveNav?.(e.currentTarget); }}>
              <i className="fas fa-upload"></i>
              <span>Enviar cartão</span>
            </a>
            <a href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); window.setActiveNav?.(e.currentTarget); }}>
              <i className="fas fa-file-text"></i>
              <span>Gabaritos</span>
            </a>
            <a href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); window.setActiveNav?.(e.currentTarget); }}>
              <i className="fas fa-chart-bar"></i>
              <span>Relatórios</span>
            </a>
            <a href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); window.setActiveNav?.(e.currentTarget); }}>
              <i className="fas fa-cog"></i>
              <span>Configurações</span>
            </a>
          </nav>
          <div className="sidebar-footer">
            <button className="btn btn--outline btn--sm" onClick={() => window.goToHome?.()}>Voltar ao início</button>
          </div>
        </aside>

        <div className="dashboard-sidebar-overlay" onClick={() => window.toggleDashboardSidebar?.()}></div>

        {/* Dashboard Header (mesmo da principal) */}
        <header className="header">
          <div className="container">
            <div className="header-content">
              <div className="logo">
                <h1>MarkQuest</h1>
              </div>
              <div className="header-nav">
                <div className="header-buttons">
                  <button className="btn btn--outline btn--sm login-btn" onClick={() => window.goToLogin?.()}>Login</button>
                  <button className="hamburger-btn" onClick={() => window.toggleSidebar?.()} aria-label="Toggle Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="dashboard-main">
          {/* Título */}
          <div className="dashboard-title">
            <h1>Dashboard</h1>
            <div className="user-info">
              <span>Bem-vindo!</span>
            </div>
          </div>

          {/* Upload Card */}
          <section className="upload-section">
            <div className="upload-card">
              <div className="upload-icon">
                <i className="fas fa-cloud-upload-alt"></i>
              </div>
              <h3>Envie um cartão-resposta para análise</h3>
              <p>Selecione uma imagem do seu cartão-resposta para processamento automático</p>
              <button className="btn btn--primary" onClick={() => window.handleUpload?.()}>Fazer upload</button>
              <input
                type="file"
                id="file-input"
                accept="image/*,application/pdf"
                style={{ display: "none" }}
                onChange={(e) => window.processFile?.(e.target)}
              />
            </div>
          </section>

          {/* Recent Uploads (estática de exemplo) */}
          <section className="recent-uploads">
            <h2 className="section-title">Uploads recentes</h2>
            <div className="uploads-list">
              <div className="upload-item">
                <div className="upload-info">
                  <span className="upload-filename">cartao_001.jpg</span>
                  <span className="upload-time">23/10/2025 10:15</span>
                </div>
                <span className="status status--success">Concluído</span>
              </div>
              <div className="upload-item">
                <div className="upload-info">
                  <span className="upload-filename">cartao_002.jpg</span>
                  <span className="upload-time">23/10/2025 10:12</span>
                </div>
                <span className="status status--warning">Processando</span>
              </div>
              <div className="upload-item">
                <div className="upload-info">
                  <span className="upload-filename">cartao_003.jpg</span>
                  <span className="upload-time">23/10/2025 10:08</span>
                </div>
                <span className="status status--error">Erro</span>
              </div>
              <div className="upload-item">
                <div className="upload-info">
                  <span className="upload-filename">cartao_004.jpg</span>
                  <span className="upload-time">23/10/2025 10:05</span>
                </div>
                <span className="status status--success">Concluído</span>
              </div>
            </div>
          </section>

          {/* Visualização de Resultados */}
          <section className="results-visual">
            <h2 className="section-title">Resultado da leitura</h2>

            {/* Balões de processamento */}
            <div id="processing-balloons" className="card" style={{ padding: "var(--space-5)", display: "none" }}></div>

            {/* Painel de resultado */}
            <div id="results-panel" className="card" style={{ marginTop: "var(--space-4)", display: "none" }}>
              <div className="card__body">
                <div className="results-layout" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-5)" }}>
                  {/* Coluna esquerda: imagem + overlay */}
                  <div>
                    <h3 style={{ marginBottom: "var(--space-3)" }}>Imagem enviada</h3>
                    <div className="image-stack" style={{ position: "relative", border: "1px solid var(--color-card-border)", borderRadius: "var(--radius-lg)", overflow: "hidden" }}>
                      <img id="result-image" alt="Prévia do cartão" style={{ display: "block", width: "100%", height: "auto" }} />
                      <canvas id="result-overlay" style={{ position: "absolute", left: 0, top: 0, width: "100%", height: "100%", pointerEvents: "none" }}></canvas>
                    </div>
                    <div id="result-placeholder" style={{ marginTop: 8, color: "var(--color-text-secondary)" }}></div>
                  </div>

                  {/* Coluna direita: marcações em 2 colunas */}
                  <div>
                    <h3 style={{ marginBottom: "var(--space-3)" }}>Marcações detectadas</h3>
                    <div className="answers-columns" style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "var(--space-3)" }}>
                      <div id="answers-col-1" style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}></div>
                      <div id="answers-col-2" style={{ display: "flex", flexDirection: "column", gap: "var(--space-2)" }}></div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Statistics */}
          <section className="stats-section">
            <h2 className="section-title">Desempenho geral</h2>
            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-value">156</div>
                <div className="stat-label">Total processado</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">94.2%</div>
                <div className="stat-label">Taxa de sucesso</div>
              </div>
              <div className="stat-card">
                <div className="stat-value">87.5%</div>
                <div className="stat-label">Precisão média</div>
              </div>
            </div>
          </section>
          <section>

            <div className="min-h-screen bg-gray-100 p-6">
              <OMRTemplateDesigner />
            </div>

          </section>
        </main>
      </div>

      {/* ===== About Page ===== */}
      <div id="about-page" className="page">
        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="header-content">
              <div className="logo">
                <h1>MarkQuest</h1>
              </div>
              <div className="header-nav">
                <div className="header-buttons">
                  <button className="btn btn--outline btn--sm login-btn" onClick={() => window.goToLogin?.()}>Login</button>
                  <button className="hamburger-btn" onClick={() => window.toggleSidebar?.()} aria-label="Toggle Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="about-main">
          {/* Hero */}
          <section className="about-hero">
            <div className="container">
              <div className="about-hero-content">
                <h1 className="about-hero-title">Sobre o MarkQuest</h1>
              </div>
            </div>
          </section>

          <div className="container">
            <div className="about-content">
              {/* Introdução */}
              <section className="about-section">
                <h2>O que é o MarkQuest</h2>
                <p>
                  O MarkQuest é uma plataforma moderna de correção automática de cartões-resposta utilizando tecnologia OMR (Optical Mark Recognition). Facilitamos a correção de avaliações, provas e questionários de forma rápida, precisa e eficiente.
                </p>
              </section>

              {/* Missão */}
              <section className="about-section">
                <h2>Nossa Missão</h2>
                <p>
                  Democratizar o acesso à tecnologia de correção automática, tornando o processo de avaliação mais ágil e confiável para instituições de ensino e empresas.
                </p>
              </section>

              {/* Como Funciona */}
              <section className="about-section">
                <h2>Como Funciona</h2>
                <p>
                  Utilizamos algoritmos avançados de processamento de imagem para identificar marcações em cartões-resposta, comparar com gabaritos e gerar relatórios detalhados instantaneamente.
                </p>
              </section>

              {/* Benefícios */}
              <section className="about-section">
                <h2>Benefícios</h2>
                <div className="benefits-grid">
                  <div className="benefit-card">
                    <div className="benefit-icon">
                      <i className="fas fa-clock"></i>
                    </div>
                    <h3>Economia de tempo na correção</h3>
                  </div>
                  <div className="benefit-card">
                    <div className="benefit-icon">
                      <i className="fas fa-shield-alt"></i>
                    </div>
                    <h3>Redução de erros humanos</h3>
                  </div>
                  <div className="benefit-card">
                    <div className="benefit-icon">
                      <i className="fas fa-chart-line"></i>
                    </div>
                    <h3>Relatórios automatizados</h3>
                  </div>
                  <div className="benefit-card">
                    <div className="benefit-icon">
                      <i className="fas fa-user"></i>
                    </div>
                    <h3>Interface intuitiva</h3>
                  </div>
                  <div className="benefit-card">
                    <div className="benefit-icon">
                      <i className="fas fa-file-alt"></i>
                    </div>
                    <h3>Suporte a múltiplos formatos de cartão</h3>
                  </div>
                </div>
              </section>

              {/* Tecnologia */}
              <section className="about-section">
                <h2>Tecnologia</h2>
                <p>
                  Nossa plataforma utiliza tecnologia de ponta em reconhecimento óptico, machine learning e processamento de imagens para garantir precisão superior a 95% na detecção de marcações.
                </p>
              </section>

              {/* Contato */}
              <section className="about-section">
                <h2>Contato</h2>
                <div className="contact-info">
                  <p>
                    Entre em contato: <a href="mailto:contato@markquest.com">contato@markquest.com</a> | <a href="tel:+5511999999999">(11) 9999-9999</a>
                  </p>
                </div>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <p>© {new Date().getFullYear()} MarkQuest. Todos os direitos reservados.</p>
              <a href="#" className="footer-link">Contato</a>
            </div>
          </div>
        </footer>
      </div>

      {/* ===== Configurações Page ===== */}
      <div id="configuracoes-page" className="page">
        {/* Header */}
        <header className="header">
          <div className="container">
            <div className="header-content">
              <div className="logo">
                <h1>MarkQuest</h1>
              </div>
              <div className="header-nav">
                <div className="header-buttons">
                  <button className="btn btn--outline btn--sm login-btn" onClick={() => window.goToLogin?.()}>Login</button>
                  <button className="hamburger-btn" onClick={() => window.toggleSidebar?.()} aria-label="Toggle Menu">
                    <span></span>
                    <span></span>
                    <span></span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Main */}
        <main className="configuracoes-main">
          <div className="container">
            <div className="page-title">
              <h1>Configurações</h1>
            </div>
          </div>

          <div className="container">
            <div className="settings-grid">
              {/* Aparência */}
              <section className="settings-section">
                <div className="settings-card">
                  <h2>Aparência</h2>
                  <p className="theme-description">Escolha o tema de sua preferência</p>
                  <div className="theme-toggle-container">
                    <div className="theme-option">
                      <div className="theme-option-info">
                        <div className="theme-icon">☀️</div>
                        <span className="theme-label">Modo Claro</span>
                      </div>
                      <label className="theme-toggle">
                        <input type="radio" name="theme" value="light" id="theme-light" defaultChecked onChange={() => window.toggleTheme?.("light") } />
                        <span className="theme-radio"></span>
                      </label>
                    </div>
                    <div className="theme-option">
                      <div className="theme-option-info">
                        <div className="theme-icon">🌙</div>
                        <span className="theme-label">Modo Escuro</span>
                      </div>
                      <label className="theme-toggle">
                        <input type="radio" name="theme" value="dark" id="theme-dark" onChange={() => window.toggleTheme?.("dark") } />
                        <span className="theme-radio"></span>
                      </label>
                    </div>
                  </div>
                </div>
              </section>

              {/* Perfil do Usuário */}
              <section className="settings-section">
                <div className="settings-card">
                  <h2>Perfil do Usuário</h2>
                  <div className="form-group">
                    <label className="form-label" htmlFor="nome-completo">Nome completo</label>
                    <input type="text" id="nome-completo" className="form-control" defaultValue="João Silva" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="email">Email</label>
                    <input type="email" id="email" className="form-control" defaultValue="joao.silva@email.com" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="telefone">Telefone</label>
                    <input type="tel" id="telefone" className="form-control" defaultValue="(11) 98765-4321" />
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="instituicao">Instituição/Empresa</label>
                    <input type="text" id="instituicao" className="form-control" defaultValue="Universidade Exemplo" />
                  </div>
                  <button className="btn btn--primary" onClick={() => window.salvarPerfil?.()}>Salvar alterações</button>
                </div>
              </section>

              {/* Preferências de Notificação */}
              <section className="settings-section">
                <div className="settings-card">
                  <h2>Preferências de Notificação</h2>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" id="email-notifications" defaultChecked />
                      <span className="checkbox-text">Receber notificações por email</span>
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" id="processing-notifications" defaultChecked />
                      <span className="checkbox-text">Notificar quando processamento concluir</span>
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" id="error-notifications" defaultChecked />
                      <span className="checkbox-text">Alertas de erros no processamento</span>
                    </label>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" id="update-notifications" />
                      <span className="checkbox-text">Novidades e atualizações do sistema</span>
                    </label>
                  </div>
                  <button className="btn btn--primary" onClick={() => window.salvarNotificacoes?.()}>Salvar preferências</button>
                </div>
              </section>

              {/* Configurações de Correção */}
              <section className="settings-section">
                <div className="settings-card">
                  <h2>Configurações de Correção</h2>
                  <div className="form-group">
                    <label className="form-label" htmlFor="tolerancia">Tolerância de detecção</label>
                    <select id="tolerancia" className="form-control" defaultValue="media">
                      <option value="baixa">Baixa</option>
                      <option value="media">Média</option>
                      <option value="alta">Alta</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="formato-cartao">Formato padrão de cartão</label>
                    <select id="formato-cartao" className="form-control" defaultValue="enem">
                      <option value="enem">Padrão ENEM</option>
                      <option value="vestibular">Vestibular</option>
                      <option value="customizado">Customizado</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label" htmlFor="formato-exportacao">Exportação de resultados</label>
                    <select id="formato-exportacao" className="form-control" defaultValue="pdf">
                      <option value="pdf">PDF</option>
                      <option value="excel">Excel</option>
                      <option value="csv">CSV</option>
                    </select>
                  </div>
                  <div className="checkbox-group">
                    <label className="checkbox-label">
                      <input type="checkbox" id="auto-save-templates" defaultChecked />
                      <span className="checkbox-text">Salvar gabaritos automaticamente</span>
                    </label>
                  </div>
                  <button className="btn btn--primary" onClick={() => window.salvarCorrecao?.()}>Salvar configurações</button>
                </div>
              </section>

              {/* Segurança */}
              <section className="settings-section">
                <div className="settings-card">
                  <h2>Segurança</h2>
                  <div className="security-item">
                    <div className="security-info">
                      <h3>Alterar senha</h3>
                      <p>Altere sua senha de acesso</p>
                    </div>
                    <button className="btn btn--outline" onClick={() => window.alterarSenha?.()}>Alterar senha</button>
                  </div>
                  <div className="security-item">
                    <div className="security-info">
                      <h3>Autenticação em dois fatores</h3>
                      <p>Adicione uma camada extra de segurança</p>
                    </div>
                    <label className="toggle-switch">
                      <input type="checkbox" id="two-factor" />
                      <span className="toggle-slider"></span>
                    </label>
                  </div>
                  <div className="security-item">
                    <div className="security-info">
                      <h3>Sessões ativas</h3>
                      <p>2 dispositivos conectados</p>
                    </div>
                    <button className="btn btn--outline" onClick={() => window.gerenciarSessoes?.()}>Gerenciar</button>
                  </div>
                  <button className="btn btn--outline btn--destructive" onClick={() => window.encerrarSessoes?.()}>
                    Encerrar todas as sessões
                  </button>
                </div>
              </section>

              {/* Plano e Faturamento */}
              <section className="settings-section">
                <div className="settings-card">
                  <h2>Plano e Faturamento</h2>
                  <div className="plan-info">
                    <div className="plan-item">
                      <span className="plan-label">Plano atual:</span>
                      <span className="plan-value">Plano Básico</span>
                    </div>
                    <div className="plan-item">
                      <span className="plan-label">Créditos disponíveis:</span>
                      <span className="plan-value">250 cartões restantes</span>
                    </div>
                    <div className="plan-item">
                      <span className="plan-label">Próximo pagamento:</span>
                      <span className="plan-value">15/11/2025</span>
                    </div>
                  </div>
                  <div className="plan-actions">
                    <button className="btn btn--primary" onClick={() => window.gerenciarPlano?.()}>Gerenciar plano</button>
                    <button className="btn btn--outline" onClick={() => window.historicoPagamentos?.()}>Histórico de pagamentos</button>
                  </div>
                </div>
              </section>

              {/* Dados e Privacidade */}
              <section className="settings-section">
                <div className="settings-card">
                  <h2>Dados e Privacidade</h2>
                  <div className="privacy-actions">
                    <button className="btn btn--outline" onClick={() => window.exportarDados?.()}>Exportar meus dados</button>
                    <button className="btn btn--outline btn--destructive" onClick={() => window.excluirConta?.()}>
                      Excluir minha conta
                    </button>
                  </div>
                  <div className="privacy-links">
                    <a href="#" className="privacy-link" onClick={(e) => { e.preventDefault(); window.abrirPoliticaPrivacidade?.(); }} target="_blank">Política de Privacidade</a>
                    <a href="#" className="privacy-link" onClick={(e) => { e.preventDefault(); window.abrirTermosUso?.(); }} target="_blank">Termos de Uso</a>
                  </div>
                </div>
              </section>

              {/* Sobre o Sistema */}
              <section className="settings-section">
                <div className="settings-card">
                  <h2>Sobre o Sistema</h2>
                  <div className="system-info">
                    <div className="system-item">
                      <span className="system-label">Versão do sistema:</span>
                      <span className="system-value">v2.3.1</span>
                    </div>
                    <div className="system-item">
                      <span className="system-label">Última atualização:</span>
                      <span className="system-value">20/10/2025</span>
                    </div>
                  </div>
                  <div className="system-links">
                    <a href="#" className="system-link" onClick={(e) => { e.preventDefault(); window.abrirChangelog?.(); }} target="_blank">Changelog</a>
                    <a href="#" className="system-link" onClick={(e) => { e.preventDefault(); window.abrirSuporte?.(); }} target="_blank">Suporte técnico</a>
                  </div>
                </div>
              </section>
            </div>
          </div>
        </main>

        {/* Footer */}
        <footer className="footer">
          <div className="container">
            <div className="footer-content">
              <p>© {new Date().getFullYear()} MarkQuest. Todos os direitos reservados.</p>
              <a href="#" className="footer-link">Contato</a>
            </div>
          </div>
        </footer>
      </div>

      {/* ===== Modal de Detalhes ===== */}
      <div
        id="details-modal"
        className="card"
        style={{
          display: "none",
          position: "fixed",
          inset: "5vh 5vw",
          maxHeight: "90vh",
          background: "var(--color-surface)",
          zIndex: 1001,
          boxShadow: "var(--shadow-xl)",
          overflow: "auto",
          borderRadius: "var(--radius-lg)",
        }}
        aria-modal="true"
        role="dialog"
      >
        <div className="card__header" style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "var(--space-4)" }}>
          <h3 id="details-title">Detalhes do processamento</h3>
          <button className="btn btn--outline btn--sm" onClick={() => window.closeDetails?.()}>Fechar</button>
        </div>
        <div className="card__body" style={{ padding: "var(--space-4)", maxHeight: "calc(90vh - 64px)", overflow: "auto", WebkitOverflowScrolling: "touch" }}>
          <div id="details-content"></div>
        </div>
      </div>
      <div
        id="details-backdrop"
        style={{ display: "none", position: "fixed", inset: 0, background: "rgba(0,0,0,.35)", zIndex: 1000 }}
        onClick={() => window.closeDetails?.()}
      ></div>
    </>
  );
}
