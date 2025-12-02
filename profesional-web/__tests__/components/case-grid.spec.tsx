import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import CaseGrid from '@/components/CaseGrid';
import { CASOS_MVP } from '@/data/cases';
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

  it('renderiza exactamente 3 tarjetas de caso', () => {
    render(<CaseGrid />);
    const caseCards = screen.getAllByTestId('case-card');
    expect(caseCards).toHaveLength(3);
  });

  it('muestra la información correcta para cada caso', () => {
    render(<CaseGrid />);
    
    CASOS_MVP.forEach((caso) => {
      expect(screen.getByText(caso.sector)).toBeInTheDocument();
      expect(screen.getByText(new RegExp(escapeRegExp(caso.pain), 'i'))).toBeInTheDocument();
      expect(screen.getByText(new RegExp(escapeRegExp(caso.solution), 'i'))).toBeInTheDocument();
    });
  });

  it('muestra el bloque de ROI destacado para cada caso', () => {
    render(<CaseGrid />);
    
    CASOS_MVP.forEach((caso) => {
      expect(screen.getByText(`${caso.savings_annual}€/año`)).toBeInTheDocument();
      expect(screen.getByText(`${caso.payback_weeks} semanas`)).toBeInTheDocument();
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
    expect(validationBadges).toHaveLength(CASOS_MVP.length);
  });

  it('emite eventos case_view por cada caso al renderizar', () => {
    render(<CaseGrid />);
    expect(mockedTrackEvent).toHaveBeenCalledTimes(CASOS_MVP.length);

    CASOS_MVP.forEach((caso) => {
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
      utm_content: CASOS_MVP[0].id,
    };

    expect(mockedTrackEvent).toHaveBeenCalledWith(
      'case_cta_click',
      expect.objectContaining({
        case_id: CASOS_MVP[0].id,
        sector: CASOS_MVP[0].sector,
        ...utmParams,
      })
    );

    expect(handleCta).toHaveBeenCalledWith(CASOS_MVP[0].id, utmParams);
  });
});
