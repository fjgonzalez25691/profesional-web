import { describe, it, expect, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import LegalFooter from '@/components/Chatbot/LegalFooter';

describe('LegalFooter', () => {
  beforeEach(() => {
    process.env.NEXT_PUBLIC_CALENDLY_URL = 'https://calendly.com/test/30min';
  });

  it('renders legal copy and CTA link', () => {
    render(<LegalFooter />);

    expect(screen.getByText(/diagnóstico de 30 minutos/i)).toBeInTheDocument();
    const link = screen.getByRole('link', { name: /agenda diagnóstico/i });
    expect(link).toHaveAttribute('href', 'https://calendly.com/test/30min');
  });
});
