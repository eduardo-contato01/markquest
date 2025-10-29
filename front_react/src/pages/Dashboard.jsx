import OMRTemplateDesigner from "../components/OMRTemplateDesigner";

export default function Dashboard() {
    return (
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
    )
}