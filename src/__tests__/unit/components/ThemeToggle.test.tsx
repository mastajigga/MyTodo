import { render, screen, fireEvent } from '@testing-library/react'
import { ThemeToggle } from '../ThemeToggle'
import { ThemeProvider } from '../ThemeProvider'

const renderWithTheme = (component: React.ReactNode) => {
  return render(<ThemeProvider>{component}</ThemeProvider>)
}

describe('ThemeToggle', () => {
  it('renders theme toggle button', () => {
    renderWithTheme(<ThemeToggle />)
    
    expect(screen.getByRole('button')).toBeInTheDocument()
    expect(screen.getByLabelText('Basculer le thème')).toBeInTheDocument()
  })

  it('shows theme options when clicked', () => {
    renderWithTheme(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('button'))
    
    expect(screen.getByText('Clair')).toBeInTheDocument()
    expect(screen.getByText('Sombre')).toBeInTheDocument()
  })

  it('changes theme when option is selected', () => {
    renderWithTheme(<ThemeToggle />)
    
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('Sombre'))
    
    expect(document.documentElement).toHaveClass('dark')
  })

  it('shows correct icon based on theme', () => {
    renderWithTheme(<ThemeToggle />)
    
    // Initial state (light theme)
    expect(screen.getByLabelText('Basculer le thème')).toBeInTheDocument()
    
    // Change to dark theme
    fireEvent.click(screen.getByRole('button'))
    fireEvent.click(screen.getByText('Sombre'))
    
    expect(screen.getByLabelText('Basculer le thème')).toBeInTheDocument()
  })
}) 