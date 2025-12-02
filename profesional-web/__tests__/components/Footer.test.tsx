import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import Footer from '@/components/Footer';

describe('Footer Component', () => {
  it('renders copyright text', () => {
    render(<Footer />);
    expect(screen.getByText(/© 2025 Francisco García/i)).toBeInTheDocument();
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
    
    const emailLink = screen.getByRole('link', { name: /email/i });
    expect(emailLink).toBeInTheDocument();
    expect(emailLink).toHaveAttribute('href', expect.stringContaining('mailto:'));
  });

  it('renders section headers', () => {
    render(<Footer />);
    expect(screen.getByRole('heading', { name: /legal/i })).toBeInTheDocument();
    expect(screen.getByRole('heading', { name: /social/i })).toBeInTheDocument();
  });
});
