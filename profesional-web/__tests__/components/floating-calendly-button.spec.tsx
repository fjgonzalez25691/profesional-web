import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import FloatingCalendlyButton from '@/components/FloatingCalendlyButton';

describe('FloatingCalendlyButton', () => {
  it('renderiza dos botones flotantes (desktop y mobile)', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    const buttons = screen.getAllByRole('button', { name: /agendar reunión/i });
    expect(buttons).toHaveLength(2);
  });

  it('botón desktop tiene posición top-right sticky', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    const desktopButton = screen.getByTestId('calendar-icon-desktop').closest('button');
    expect(desktopButton).toHaveClass('fixed');
    expect(desktopButton).toHaveClass('top-6');
    expect(desktopButton).toHaveClass('right-6');
    expect(desktopButton).toHaveClass('hidden'); // hidden on mobile
    expect(desktopButton).toHaveClass('md:flex');
  });

  it('botón mobile tiene posición bottom-center', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    const mobileButton = screen.getByTestId('calendar-icon-mobile').closest('button');
    expect(mobileButton).toHaveClass('fixed');
    expect(mobileButton).toHaveClass('bottom-6');
    expect(mobileButton).toHaveClass('left-1/2');
    expect(mobileButton).toHaveClass('-translate-x-1/2');
    expect(mobileButton).toHaveClass('flex');
    expect(mobileButton).toHaveClass('md:hidden');
  });

  it('llama a onClick cuando se hace click en cualquier botón', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    const buttons = screen.getAllByRole('button', { name: /agendar reunión/i });

    fireEvent.click(buttons[0]);
    expect(mockOnClick).toHaveBeenCalledTimes(1);

    fireEvent.click(buttons[1]);
    expect(mockOnClick).toHaveBeenCalledTimes(2);
  });

  it('es accesible por teclado (Enter y Space)', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    const button = screen.getAllByRole('button', { name: /agendar reunión/i })[0];

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

    const buttons = screen.getAllByRole('button', { name: /agendar reunión/i });
    buttons.forEach(button => {
      expect(button).toHaveClass('z-50');
    });
  });

  it('ambos botones contienen iconos de calendario', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    const desktopIcon = screen.getByTestId('calendar-icon-desktop');
    const mobileIcon = screen.getByTestId('calendar-icon-mobile');

    expect(desktopIcon).toBeInTheDocument();
    expect(mobileIcon).toBeInTheDocument();
  });

  it('botones muestran textos correctos (mobile: "Diagnóstico 30 min", desktop: "Diagnóstico")', () => {
    const mockOnClick = vi.fn();
    render(<FloatingCalendlyButton onClick={mockOnClick} />);

    // Mobile button tiene el texto completo
    expect(screen.getByText('Diagnóstico 30 min')).toBeInTheDocument();

    // Desktop button tiene el texto corto
    expect(screen.getByText('Diagnóstico')).toBeInTheDocument();
  });
});
