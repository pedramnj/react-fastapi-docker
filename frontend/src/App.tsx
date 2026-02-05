import { useState, useEffect } from 'react'
import './App.css'

interface ApiInfo {
  app: string
  version: string
  environment: string
  total_visits: number
}

const pipelineSteps = [
  { num: 1, name: 'Lint & Type Check' },
  { num: 2, name: 'Unit Tests' },
  { num: 3, name: 'Docker Build' },
  { num: 4, name: 'Push to GHCR' },
  { num: 5, name: 'Deploy' },
]

const techStack = [
  { icon: '⚛️', name: 'React' },
  { icon: '⚡', name: 'FastAPI' },
  { icon: '🐳', name: 'Docker' },
  { icon: '🔄', name: 'GitHub Actions' },
  { icon: '🐘', name: 'PostgreSQL' },
  { icon: '🔒', name: 'Caddy' },
]

function App() {
  const [apiInfo, setApiInfo] = useState<ApiInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const apiUrl = import.meta.env.VITE_API_URL || ''

  useEffect(() => {
    fetch(`${apiUrl}/api/info`)
      .then((res) => {
        if (!res.ok) throw new Error('API request failed')
        return res.json()
      })
      .then((data) => {
        setApiInfo(data)
        setLoading(false)
      })
      .catch((err) => {
        setError(err.message)
        setLoading(false)
      })
  }, [apiUrl])

  return (
    <div className="app-wrapper">
      {/* Animated Background */}
      <div className="bg-gradient" />
      <div className="floating-orbs">
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
      </div>

      <div className="container">
        <header>
          <h1>DevOps Pipeline</h1>
          <div className="subtitle">
            <span className="tech-badge">React</span>
            <span className="tech-badge">FastAPI</span>
            <span className="tech-badge">Docker</span>
            <span className="tech-badge">GitHub Actions</span>
          </div>
        </header>

        <main>
          <section className="card">
            <h2>
              <span className="icon">🖥️</span>
              Frontend
            </h2>
            <div className="card-content">
              <div className="status success">
                <span className="status-dot" />
                Running
              </div>
              <p className="card-description">
                React application with TypeScript, served via Nginx with automatic HTTPS
              </p>
            </div>
          </section>

          <section className="card">
            <h2>
              <span className="icon">⚙️</span>
              Backend API
            </h2>
            <div className="card-content">
              {loading && (
                <div className="status loading">
                  <span className="status-dot" />
                  Connecting...
                </div>
              )}
              {error && (
                <>
                  <div className="status error">
                    <span className="status-dot" />
                    Disconnected
                  </div>
                  <p className="error-text">{error}</p>
                </>
              )}
              {apiInfo && (
                <>
                  <div className="status success">
                    <span className="status-dot" />
                    Connected
                  </div>
                  <ul className="info-list">
                    <li>
                      <strong>Version</strong>
                      <span>{apiInfo.version}</span>
                    </li>
                    <li>
                      <strong>Environment</strong>
                      <span>{apiInfo.environment}</span>
                    </li>
                    <li>
                      <strong>Total Visits</strong>
                      <span>{apiInfo.total_visits.toLocaleString()}</span>
                    </li>
                  </ul>
                </>
              )}
            </div>
          </section>

          <section className="card full-width">
            <h2>
              <span className="icon">🚀</span>
              CI/CD Pipeline
            </h2>
            <ul className="pipeline-list">
              {pipelineSteps.map((step) => (
                <li key={step.num}>
                  <span className="step-number">{step.num}</span>
                  {step.name}
                </li>
              ))}
            </ul>
          </section>

          <section className="card full-width">
            <h2>
              <span className="icon">🛠️</span>
              Tech Stack
            </h2>
            <div className="tech-stack">
              {techStack.map((tech) => (
                <div key={tech.name} className="tech-item">
                  <span className="tech-icon">{tech.icon}</span>
                  <span className="tech-name">{tech.name}</span>
                </div>
              ))}
            </div>
          </section>
        </main>

        <footer>
          <div className="footer-content">
            <div className="footer-links">
              <a
                href="https://github.com/pedramnj/react-fastapi-docker"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                <span>📦</span>
                View on GitHub
              </a>
              <a
                href="https://pedramcv.me"
                target="_blank"
                rel="noopener noreferrer"
                className="footer-link"
              >
                <span>🌐</span>
                Live Demo
              </a>
            </div>
            <p className="footer-text">
              Built by Pedram Nikjooy • DevOps Portfolio Project
            </p>
          </div>
        </footer>
      </div>
    </div>
  )
}

export default App
