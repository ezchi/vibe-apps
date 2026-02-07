import { render, screen } from '@testing-library/react'
import { describe, it, expect } from 'vitest'
// @ts-ignore
import ChatLayout from './ChatLayout'

describe('ChatLayout', () => {
  it('renders children correctly', () => {
    render(
      <ChatLayout>
        <div data-testid="child">Child Content</div>
      </ChatLayout>
    )
    expect(screen.getByTestId('child')).toBeInTheDocument()
  })

  it('applies responsive grid classes for side-by-side layout', () => {
    const { container } = render(
      <ChatLayout>
        <div>Item 1</div>
        <div>Item 2</div>
      </ChatLayout>
    )
    const main = container.querySelector('main')
    expect(main).toBeInTheDocument()
    // Expect grid layout: single column on mobile, multiple on larger screens
    expect(main).toHaveClass('grid')
    expect(main).toHaveClass('grid-cols-1')
    // We expect at least support for side-by-side (2 or more columns) on desktop
    const hasResponsiveCols = main?.className.includes('md:grid-cols') || main?.className.includes('lg:grid-cols')
    expect(hasResponsiveCols).toBe(true)
  })
})
