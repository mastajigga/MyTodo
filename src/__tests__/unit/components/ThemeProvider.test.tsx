import { render, screen, fireEvent, act } from '@testing-library/react'
import { ThemeProvider, useTheme } from '../ThemeProvider'

const TestComponent = () => {
  const { theme, setTheme } = useTheme()
  return (
    <div>
      <div data-testid="theme">{theme}</div>
      <button onClick={() => setTheme('dark')}>Set Dark</button>
      <button onClick={() => setTheme('light')}>Set Light</button>
      <button onClick={() => setTheme('system')}>Set System</button>
    </div>
  )
}

describe('ThemeProvider', () => {
  beforeEach(() => {
    localStorage.clear()
    document.documentElement.classList.remove('light', 'dark')
  })

  it('provides default theme as light', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('light')
    expect(document.documentElement).toHaveClass('light')
  })

  it('allows setting theme', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    act(() => {
      fireEvent.click(screen.getByText('Set Dark'))
    })

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('persists theme in localStorage', () => {
    render(
      <ThemeProvider storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>
    )

    act(() => {
      fireEvent.click(screen.getByText('Set Dark'))
    })

    expect(localStorage.getItem('test-theme')).toBe('dark')
  })

  it('loads theme from localStorage', () => {
    localStorage.setItem('test-theme', 'dark')

    render(
      <ThemeProvider storageKey="test-theme">
        <TestComponent />
      </ThemeProvider>
    )

    expect(screen.getByTestId('theme')).toHaveTextContent('dark')
    expect(document.documentElement).toHaveClass('dark')
  })

  it('handles system theme preference', () => {
    render(
      <ThemeProvider>
        <TestComponent />
      </ThemeProvider>
    )

    act(() => {
      fireEvent.click(screen.getByText('Set System'))
    })

    expect(screen.getByTestId('theme')).toHaveTextContent('system')
  })
}) 