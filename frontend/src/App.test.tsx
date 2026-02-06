import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import App from './App'

describe('App', () => {
  beforeEach(() => {
    vi.resetAllMocks()
  })

  it('renders the main heading', () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            app: 'Test App',
            version: '1.0.0',
            environment: 'test',
          }),
      })
    ) as unknown as typeof fetch

    render(<App />)
    expect(screen.getByText('DevOps Pipeline')).toBeInTheDocument()
  })

  it('renders frontend status section', () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            app: 'Test App',
            version: '1.0.0',
            environment: 'test',
          }),
      })
    ) as unknown as typeof fetch

    render(<App />)
    expect(screen.getByText('Frontend')).toBeInTheDocument()
    expect(screen.getByText('Running')).toBeInTheDocument()
  })

  it('renders CI/CD pipeline section', () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () =>
          Promise.resolve({
            app: 'Test App',
            version: '1.0.0',
            environment: 'test',
          }),
      })
    ) as unknown as typeof fetch

    render(<App />)
    expect(screen.getByText('CI/CD Pipeline')).toBeInTheDocument()
    expect(screen.getByText('Lint & Type Check')).toBeInTheDocument()
    expect(screen.getByText('Docker Build')).toBeInTheDocument()
  })
})
