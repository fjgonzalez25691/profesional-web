import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import Hero from '@/components/Hero';

// Mock useAnalytics
const mockTrack = vi.fn();
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    track: mockTrack,
  }),
}));

describe('Hero Component', () => {
  const defaultProps = {
    headline: 'Test Headline',
    subtitle: 'Test Subtitle',
    badgeText: 'Test Badge',
    onCtaClick: vi.fn(),
  };

  it('renders headline, subtitle and CTA button', () => {
    render(<Hero {...defaultProps} />);
    
    expect(screen.getByRole('heading', { level: 1 })).toHaveTextContent('Test Headline');
    expect(screen.getByText('Test Subtitle')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /agendar/i })).toBeInTheDocument();
  });

  it('tracks CTA click event', () => {
    render(<Hero {...defaultProps} />);

    const cta = screen.getByRole('button', { name: /agendar/i });
    fireEvent.click(cta);

    expect(mockTrack).toHaveBeenCalledWith('cta_calendly_click', {
      cta_id: 'hero',
    });
    expect(defaultProps.onCtaClick).toHaveBeenCalled();
  });

  it('renders integrated pain points section', () => {
    render(<Hero {...defaultProps} />);

    // Verifica que aparece el título de pain points
    expect(screen.getByRole('heading', { name: /¿Te pasa esto\?/i })).toBeInTheDocument();

    // Verifica que hay exactamente 3 pain points
    const painPointItems = screen.getAllByTestId('pain-point-item');
    expect(painPointItems).toHaveLength(3);
  });

  it('renders all pain point texts', () => {
    render(<Hero {...defaultProps} />);

    // Verifica los 3 textos específicos de pain points
    expect(screen.getByText(/2-4 h\/día introduciendo facturas\/albaranes/i)).toBeInTheDocument();
    expect(screen.getByText(/AWS\/Azure subió >30% sin explicación/i)).toBeInTheDocument();
    expect(screen.getByText(/Previsiones Excel fallan 20-30%/i)).toBeInTheDocument();
  });

  it('renders pain point icons', () => {
    render(<Hero {...defaultProps} />);

    // Verifica que hay 3 iconos X (uno por pain point)
    const icons = screen.getAllByTestId('pain-point-icon');
    expect(icons).toHaveLength(3);
  });
});
