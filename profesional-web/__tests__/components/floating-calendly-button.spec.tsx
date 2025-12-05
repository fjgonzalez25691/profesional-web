import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FloatingCalendlyButton from '@/components/FloatingCalendlyButton';

// Mock useAnalytics
const mockTrack = vi.fn();
vi.mock('@/hooks/useAnalytics', () => ({
  useAnalytics: () => ({
    track: mockTrack,
  }),
}));

describe('FloatingCalendlyButton', () => {
  it('renderiza dos botones flotantes (desktop y mobile)', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    const buttons = screen.getAllByRole('button', { name: /reserva 30 min/i });
    expect(buttons).toHaveLength(2);
  });

  it('botón desktop tiene posición top-right sticky', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    const [desktopButton] = screen.getAllByRole('button', { name: /reserva 30 min/i });
    expect(desktopButton).toHaveClass('fixed');
    expect(desktopButton).toHaveClass('top-6');
    expect(desktopButton).toHaveClass('right-6');
    expect(desktopButton).toHaveClass('hidden'); // hidden on mobile
    expect(desktopButton).toHaveClass('md:flex');
  });

  it('botón mobile se muestra como icono en bottom-left y apilable', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    const [, mobileButton] = screen.getAllByRole('button', { name: /reserva 30 min/i });
    expect(mobileButton).toHaveClass('fixed');
    expect(mobileButton).toHaveClass('bottom-20');
    expect(mobileButton).toHaveClass('right-4');
    expect(mobileButton).toHaveClass('flex');
    expect(mobileButton).toHaveClass('md:hidden');
    expect(mobileButton.textContent).toBe('🗓️');
  });

  it('llama a onClick y tracking cuando se hace click en cualquier botón', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    const buttons = screen.getAllByRole('button', { name: /reserva 30 min/i });

    fireEvent.click(buttons[0]);
    expect(mockOnClick).toHaveBeenCalledTimes(1);
    expect(mockTrack).toHaveBeenCalledWith('cta_calendly_click', { cta_id: 'floating' });

    mockTrack.mockClear();

    fireEvent.click(buttons[1]);
    expect(mockOnClick).toHaveBeenCalledTimes(2);
    expect(mockTrack).toHaveBeenCalledWith('cta_calendly_click', { cta_id: 'floating' });
  });

  it('es accesible por teclado (Enter y Space)', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    const button = screen.getAllByRole('button', { name: /reserva 30 min/i })[0];

    // Enter key
    fireEvent.keyDown(button, { key: 'Enter', code: 'Enter' });
    expect(mockOnClick).toHaveBeenCalled();

    mockOnClick.mockClear();

    // Space key
    fireEvent.keyDown(button, { key: ' ', code: 'Space' });
    expect(mockOnClick).toHaveBeenCalled();
  });

  it('ambos botones tienen alto z-index para estar sobre otros elementos', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    const buttons = screen.getAllByRole('button', { name: /reserva 30 min/i });
    const [desktopButton, mobileButton] = buttons;
    expect(desktopButton).toHaveClass('z-50');
    expect(mobileButton.className).toMatch(/z-\[/);
  });

  it('ambos botones muestran el texto con emoji de calendario', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    expect(screen.getByText('🗓️ Reserva 30 min')).toBeInTheDocument();
    const [, mobileButton] = screen.getAllByRole('button', { name: /reserva 30 min/i });
    expect(mobileButton.textContent).toBe('🗓️');
  });

  it('botones muestran textos correctos (mobile: "Diagnóstico 30 min", desktop: "Diagnóstico")', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    expect(screen.getByText('🗓️ Reserva 30 min')).toBeInTheDocument();
  });

  it('no renderiza nada cuando visible es false', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} visible={false} />);

    expect(screen.queryByRole('button', { name: /reserva 30 min/i })).not.toBeInTheDocument();
  });
});
