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
});
