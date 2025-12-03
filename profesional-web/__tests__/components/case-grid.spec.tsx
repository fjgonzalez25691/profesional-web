import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CaseGrid from '@/components/CaseGrid';
import { CASOS_VISIBLES } from '@/data/cases';
import { trackEvent } from '@/lib/analytics';

vi.mock('@/lib/analytics', () => ({
  trackEvent: vi.fn(),
}));

const mockedTrackEvent = vi.mocked(trackEvent);
const escapeRegExp = (value: string) => value.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');

describe('CaseGrid Component', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renderiza el título de la sección', () => {
    render(<CaseGrid />);
    expect(screen.getByRole('heading', { level: 2, name: /Casos reales/i })).toBeInTheDocument();
  });

  it('renderiza exactamente 5 tarjetas de caso visibles', () => {
    render(<CaseGrid />);
    const caseCards = screen.getAllByTestId(/^case-card-/);
    expect(caseCards).toHaveLength(5);
  });

  it('muestra la información correcta para cada caso', () => {
    render(<CaseGrid />);
    
    CASOS_VISIBLES.forEach((caso) => {
      expect(screen.getByText(caso.sector)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(escapeRegExp(caso.pain), 'i'))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(escapeRegExp(caso.solution), 'i'))).toBeInTheDocument();
    });
  });

  it('muestra el bloque de impacto en el trabajo para cada caso', () => {
    render(<CaseGrid />);
    
    CASOS_VISIBLES.forEach((caso) => {
      expect(screen.getByText(new RegExp(escapeRegExp(caso.impact_time), 'i'))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(escapeRegExp(caso.impact_detail), 'i'))).toBeInTheDocument();
      const paybacks = screen.getAllByText(/Payback del proyecto:/i);
      expect(paybacks.length).toBeGreaterThanOrEqual(5);
    });
  });

  it('tiene el grid responsive configurado (1 col mobile, 3 cols desktop)', () => {
    render(<CaseGrid />);
    const gridContainer = screen.getByTestId('case-grid-container');
    // Verificamos clases de Tailwind para responsive grid
    expect(gridContainer).toHaveClass('grid');
    expect(gridContainer).toHaveClass('grid-cols-1');
    expect(gridContainer).toHaveClass('md:grid-cols-3');
  });

  it('muestra aviso de validación por CEO real en cada caso', () => {
    render(<CaseGrid />);
    const validationBadges = screen.getAllByText(/validado con CEO/i);
    expect(validationBadges).toHaveLength(CASOS_VISIBLES.length);
  });

  it('emite eventos case_view por cada caso al renderizar', () => {
    render(<CaseGrid />);
    expect(mockedTrackEvent).toHaveBeenCalledTimes(CASOS_VISIBLES.length);

    CASOS_VISIBLES.forEach((caso) => {
      expect(mockedTrackEvent).toHaveBeenCalledWith(
        'case_view',
        expect.objectContaining({
          case_id: caso.id,
          sector: caso.sector,
        })
      );
    });
  });

  it('lanza CTA con tracking y callback incluyendo UTM', () => {
    const handleCta = vi.fn();
    render(<CaseGrid onCtaClick={handleCta} />);

    const firstCta = screen.getAllByRole('button', { name: /ver detalles/i })[0];
    fireEvent.click(firstCta);

    const utmParams = {
      utm_source: 'web',
      utm_medium: 'case_grid',
      utm_content: CASOS_VISIBLES[0].id,
    };

    expect(mockedTrackEvent).toHaveBeenCalledWith(
      'case_cta_click',
      expect.objectContaining({
        case_id: CASOS_VISIBLES[0].id,
        sector: CASOS_VISIBLES[0].sector,
        ...utmParams,
      })
    );

    expect(handleCta).toHaveBeenCalledWith(CASOS_VISIBLES[0].id, utmParams);
  });
});
