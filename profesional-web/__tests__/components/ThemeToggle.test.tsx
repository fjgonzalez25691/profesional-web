import { render, screen, fireEvent } from '@testing-library/react';
import ThemeToggle from '@/components/ThemeToggle';
import { describe, it, expect, vi, beforeEach } from 'vitest';

const setThemeMock = vi.fn();

vi.mock('@/hooks/useTheme', () => {
  return {
    useTheme: () => ({
      theme: document.documentElement.dataset.theme || 'olive',
      setTheme: setThemeMock,
    }),
  };
});

describe('ThemeToggle Component', () => {
  beforeEach(() => {
    vi.resetModules();
    setThemeMock.mockClear();
    document.documentElement.dataset.theme = 'olive';
  });

  it('should render toggle button', () => {
    render(<ThemeToggle />);
    expect(screen.getByRole('button')).toBeInTheDocument();
  });

  it('should show current theme label', () => {
    document.documentElement.dataset.theme = 'olive';
    render(<ThemeToggle />);
    expect(screen.getByText(/olive/i)).toBeInTheDocument();
  });

  it('should toggle theme on click', () => {
    document.documentElement.dataset.theme = 'olive';
    render(<ThemeToggle />);
    const button = screen.getByRole('button');
    
    fireEvent.click(button);
    expect(setThemeMock).toHaveBeenCalledWith('navy');
  });

  it('should NOT render in fixed position (refactored)', () => {
    render(<ThemeToggle />);
    const toggle = screen.getByRole('button');
    expect(toggle.className).not.toMatch(/fixed/);
  });
});
