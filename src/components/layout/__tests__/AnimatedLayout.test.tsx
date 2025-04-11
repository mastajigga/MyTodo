import { render, screen } from '@testing-library/react'
import '@testing-library/jest-dom'
import { AnimatedLayout } from '../AnimatedLayout'
import { describe, it, expect, vi } from 'vitest'

const mockPathname = vi.fn()

vi.mock('next/navigation', () => ({
  usePathname: () => mockPathname(),
}))

vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>,
  },
  AnimatePresence: ({ children }: any) => <>{children}</>,
}))

describe('AnimatedLayout', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mockPathname.mockReturnValue('/test-path')
  })

  it('devrait rendre le contenu enfant', () => {
    const testContent = 'Test Content'
    render(
      <AnimatedLayout>
        <div>{testContent}</div>
      </AnimatedLayout>
    )
    
    const layout = screen.getByTestId('animated-layout')
    expect(layout).toBeInTheDocument()
    expect(layout).toHaveClass('min-h-screen')
    expect(layout).toHaveTextContent(testContent)
  })

  it('devrait utiliser le bon pathname', () => {
    const testPath = '/test-path'
    mockPathname.mockReturnValue(testPath)
    
    render(
      <AnimatedLayout>
        <div>Content</div>
      </AnimatedLayout>
    )
    
    // Vérifie que le pathname a été appelé
    expect(mockPathname).toHaveBeenCalled()
  })
}) 