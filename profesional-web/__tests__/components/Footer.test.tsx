import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import Footer from '@/components/Footer';

describe('Footer Component', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_BUSINESS_NAME', 'Francisco Javier González Aparicio');
    vi.stubEnv('NEXT_PUBLIC_CONTACT_EMAIL', 'fjgonzalez25691@gmail.com');
    vi.stubEnv('NEXT_PUBLIC_LINKEDIN_URL', 'https://linkedin.com/in/test');
  });

  it('renders copyright text with business name from env', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025 Francisco Javier González Aparicio/i)).toBeInTheDocument();
  });

  it('renders legal links', () => {
    render(<Footer />);
    expect(screen.getByRole('link', { name: /aviso legal/i })).toHaveAttribute('href', '/legal/aviso-legal');
    expect(screen.getByRole('link', { name: /privacidad/i })).toHaveAttribute('href', '/legal/privacidad');
  });

  it('renders social links', () => {
    render(<Footer />);
    const linkedinLink = screen.getByRole('link', { name: /linkedin/i });
    expect(linkedinLink).toBeInTheDocument();
    expect(linkedinLink).toHaveAttribute('href', expect.stringContaining('linkedin.com'));

    const emailLink = screen.getByRole('link', { name: /fjgonzalez25691@gmail\.com/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });

  it('renders section headers', () => {
    render(<Footer />);
    expect(screen.getByRole('heading', { name: /contacto/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /legal/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /social/i })).toBeInTheDocument();
  });
});
