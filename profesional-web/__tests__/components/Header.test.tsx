import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import Header from '@/components/Header';

describe('Header Component', () => {
  it('renders header and navigation landmarks', () => {
    render(<Header />);

    expect(screen.getByRole('banner')).toBeInTheDocument();
    expect(screen.getByRole('navigation')).toBeInTheDocument();
  });

  it('renders navigation links with correct targets', () => {
    render(<Header />);

    expect(screen.getByRole('link', { name: /Inicio/i })).toHaveAttribute('href', '#hero');
    expect(screen.getByRole('link', { name: /Casos/i })).toHaveAttribute('href', '#cases');
    expect(screen.getByRole('link', { name: /Metodología/i })).toHaveAttribute('href', '#methodology');
    expect(screen.getByRole('link', { name: /Contacto/i })).toHaveAttribute('href', '#contact');
  });

  it('applies theme token classes for background/text', () => {
    render(<Header />);
    const header = screen.getByRole('banner');

    expect(header.className).toMatch(/surface-|text-text-/);
  });

  it('toggles mobile navigation visibility with the menu button', () => {
    render(<Header />);

    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/menú/i));
    expect(screen.getByTestId('mobile-nav')).toBeInTheDocument();

    fireEvent.click(screen.getByLabelText(/menú/i));
    expect(screen.queryByTestId('mobile-nav')).not.toBeInTheDocument();
  });
});
