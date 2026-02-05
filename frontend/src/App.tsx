import { useState, useEffect } from 'react'
import './App.css'

interface ApiInfo {
  app: string
  version: string
  environment: string
  total_visits: number
}

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
    <div className="container">
      <header>
        <h1>Microservices CI/CD Demo</h1>
        <p className="subtitle">React + FastAPI + Docker + GitHub Actions</p>
      </header>

      <main>
        <section className="card">
          <h2>Frontend Status</h2>
          <div className="status success">Running</div>
          <p>React application served via Nginx</p>
        </section>

        <section className="card">
          <h2>Backend Status</h2>
          {loading && <div className="status loading">Connecting...</div>}
          {error && (
            <>
              <div className="status error">Disconnected</div>
              <p className="error-text">{error}</p>
            </>
          )}
          {apiInfo && (
            <>
              <div className="status success">Connected</div>
              <ul className="info-list">
                <li>
                  <strong>App:</strong> {apiInfo.app}
                </li>
                <li>
                  <strong>Version:</strong> {apiInfo.version}
                </li>
                <li>
                  <strong>Environment:</strong> {apiInfo.environment}
                </li>
                <li>
                  <strong>Total Visits:</strong> {apiInfo.total_visits}
                </li>
              </ul>
            </>
          )}
        </section>

        <section className="card">
          <h2>CI/CD Pipeline</h2>
          <ul className="pipeline-list">
            <li>Lint and Type Check</li>
            <li>Unit Tests</li>
            <li>Docker Build</li>
            <li>Push to GHCR</li>
            <li>Deploy to Staging</li>
          </ul>
        </section>
      </main>

      <footer>
        <p>
          Built for DevOps Portfolio |
          <a
            href="https://github.com/pedramnj/react-fastapi-docker"
            target="_blank"
            rel="noopener noreferrer"
          >
            View on GitHub
          </a>
        </p>
      </footer>
    </div>
  )
}

export default App
