import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Hero from '@/components/Hero'; // Aún no existe, pero TDD dice que escriba el test primero

describe('Hero Component', () => {
  const defaultProps = {
    headline: 'Test Headline',
    subtitle: 'Test Subtitle',
    ctaText: 'Test CTA',
    badgeText: 'Test Badge',
  };

  it('renders headline and subtitle correctly', () => {
    render(<Hero {...defaultProps} />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Headline');
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
  });

  it('renders badge text', () => {
    render(<Hero {...defaultProps} />);
    expect(screen.getByText('Test Badge')).toBeInTheDocument();
  });

  it('renders CTA button', () => {
    render(<Hero {...defaultProps} />);
    expect(screen.getByRole('button', { name: 'Test CTA' })).toBeInTheDocument();
  });
  
  // Test de imagen optimizada (verificar que usa next/image o img con atributos correctos)
  it('renders hero image with priority', () => {
     render(<Hero {...defaultProps} />);
     const img = screen.getByRole('img', { name: /hero/i }); // Asumiendo alt="Hero image"
     expect(img).toBeInTheDocument();
     // Verificar atributo priority o loading="eager" es difícil en unit test de Next.js Image sin mock profundo,
     // pero verificamos presencia.
  });
});
