import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import CTAFinal from '@/components/CTAFinal';

describe('CTAFinal', () => {
  const defaultProps = {
    onCtaClick: vi.fn(),
  };

  it('renders the section with text content', () => {
    render(<CTAFinal {...defaultProps} />);

    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
    expect(section.textContent).toContain('diagnóstico gratuito');
  });

  it('renders call-to-action button', () => {
    render(<CTAFinal {...defaultProps} />);

    const ctaButton = screen.getByRole('button', { name: /agenda|contacto|reúnete|habla|diagnóstico/i });
    expect(ctaButton).toBeInTheDocument();
  });

  it('calls onCtaClick when CTA button is clicked', () => {
    const onCtaClick = vi.fn();

    render(<CTAFinal onCtaClick={onCtaClick} />);

    const ctaButton = screen.getByRole('button', { name: /agenda|contacto|reúnete|habla|diagnóstico/i });
    fireEvent.click(ctaButton);

    expect(onCtaClick).toHaveBeenCalledTimes(1);
  });

  it('has visible section identifier for accessibility', () => {
    render(<CTAFinal {...defaultProps} />);

    const section = screen.getByRole('region');
    expect(section).toBeInTheDocument();
  });

  it('renders supporting text or subheading', () => {
    render(<CTAFinal {...defaultProps} />);

    // Debe haber al menos un párrafo o texto de apoyo
    const text = screen.getByText(/sin compromiso.*identificamos/i);
    expect(text).toBeInTheDocument();
  });
});
