import { useEffect } from "react";
import { Routes, Route, Navigate, useNavigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";

export default function App() {
  const navigate = useNavigate();

  const closeSidebar = () => {
    document.querySelector(".main-sidebar")?.classList.remove("open");
    document.querySelector(".sidebar-overlay")?.classList.remove("active");
  };

  useEffect(() => {
    // injeta a variável global
    window.VITE_API_BASE = import.meta.env.VITE_API_BASE;

    // boot do legado (uma vez)
    if (!window.__legacyReady) {
      import("./legacy/app-legacy.js").then((m) => m.boot?.());
    }

    window.goToDashboard = () => navigate("/dashboard");
    window.goToHome = () => navigate("/");
    window.goToAbout = () => navigate("/about");
    window.goToConfiguracoes = () => navigate("/config");

  }, [navigate]);

  return (
    <>
      {/* ===== Main Sidebar (global) ===== */}
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
          <a href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); navigate("/"); closeSidebar(); }}>
            <i className="fas fa-home"></i>
            <span>Início</span>
          </a>

          <a href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); navigate("/about"); closeSidebar();}}>
            <i className="fas fa-info-circle"></i>
            <span>Sobre</span>
          </a>

          <a href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); navigate("/dashboard"); closeSidebar();}}>
            <i className="fas fa-tachometer-alt"></i>
            <span>Dashboard</span>
          </a>

          <div className="sidebar-separator"></div>

          <a href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); navigate("/dashboard"); window.goToDashboardSection?.("enviar-cartao"); closeSidebar();}}>
            <i className="fas fa-upload"></i>
            <span>Enviar cartão</span>
          </a>

          <a href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); navigate("/dashboard"); window.goToDashboardSection?.("gabaritos"); closeSidebar();}}>
            <i className="fas fa-file-text"></i>
            <span>Gabaritos</span>
          </a>

          <a href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); navigate("/dashboard"); window.goToDashboardSection?.("relatorios"); closeSidebar();}}>
            <i className="fas fa-chart-bar"></i>
            <span>Relatórios</span>
          </a>

          <a href="#" className="sidebar-link" onClick={(e) => { e.preventDefault(); navigate("/config"); closeSidebar();}}>
            <i className="fas fa-cog"></i>
            <span>Configurações</span>
          </a>
        </nav>
      </aside>
      <div className="sidebar-overlay" onClick={() => window.toggleSidebar?.()}></div>

      {/* ===== Rotas ===== */}
      <Routes>
        {/* Landing Page */}
        <Route
          path="/"
          element={
            <div id="landing-page" className="page active">
              {/* Header */}
              <header className="header">
                <div className="container">
                  <div className="header-content">
                    <div className="logo">
                      <h1>MarkQuest</h1>
                    </div>
                    <div className="header-nav">
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

              {/* HERO */}
              <section className="hero">
                <div className="container">
                  <div className="hero-content">
                    <h1 className="hero-title">Corrija cartões-resposta automaticamente</h1>
                    <p className="hero-subtitle">A forma mais rápida e precisa de avaliar respostas OMR</p>
                    <button
                      className="btn btn--primary btn--lg"
                      onClick={() => navigate("/dashboard")}
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
          }
        />

        <Route path="/dashboard" element={<Dashboard />} />

        {/* About (pode evoluir depois) */}
        <Route
          path="/about"
          element={
            <div id="about-page" className="page">
              <header className="header">
                <div className="container">
                  <div className="header-content">
                    <div className="logo"><h1>MarkQuest</h1></div>
                    <div className="header-nav">
                      <div className="header-buttons">
                        <button className="btn btn--outline btn--sm login-btn" onClick={() => window.goToLogin?.()}>Login</button>
                        <button className="hamburger-btn" onClick={() => window.toggleSidebar?.()} aria-label="Toggle Menu">
                          <span></span><span></span><span></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              <main className="about-main">
                <section className="about-hero">
                  <div className="container">
                    <div className="about-hero-content">
                      <h1 className="about-hero-title">Sobre o MarkQuest</h1>
                    </div>
                  </div>
                </section>

                <div className="container">
                  <div className="about-content">
                    <section className="about-section">
                      <h2>O que é o MarkQuest</h2>
                      <p>
                        Plataforma de correção automática de cartões-resposta (OMR) para avaliações rápidas e precisas.
                      </p>
                    </section>
                    {/* Você pode colar aqui o restante da About completa que já tinha */}
                  </div>
                </div>
              </main>

              <footer className="footer">
                <div className="container">
                  <div className="footer-content">
                    <p>© {new Date().getFullYear()} MarkQuest. Todos os direitos reservados.</p>
                    <a href="#" className="footer-link">Contato</a>
                  </div>
                </div>
              </footer>
            </div>
          }
        />

        {/* Configurações (pode evoluir depois) */}
        <Route
          path="/config"
          element={
            <div id="configuracoes-page" className="page">
              <header className="header">
                <div className="container">
                  <div className="header-content">
                    <div className="logo"><h1>MarkQuest</h1></div>
                    <div className="header-nav">
                      <div className="header-buttons">
                        <button className="btn btn--outline btn--sm login-btn" onClick={() => window.goToLogin?.()}>Login</button>
                        <button className="hamburger-btn" onClick={() => window.toggleSidebar?.()} aria-label="Toggle Menu">
                          <span></span><span></span><span></span>
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </header>

              <main className="configuracoes-main">
                <div className="container">
                  <div className="page-title">
                    <h1>Configurações</h1>
                  </div>
                </div>
                {/* Aqui você pode colar depois todo o grid de configurações completo */}
              </main>

              <footer className="footer">
                <div className="container">
                  <div className="footer-content">
                    <p>© {new Date().getFullYear()} MarkQuest. Todos os direitos reservados.</p>
                    <a href="#" className="footer-link">Contato</a>
                  </div>
                </div>
              </footer>
            </div>
          }
        />
      </Routes>

      {/* ===== Modal de Detalhes (global) ===== */}
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
