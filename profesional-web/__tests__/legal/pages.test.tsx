import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import AvisoLegalPage from '@/app/legal/aviso-legal/page';
import PrivacidadPage from '@/app/legal/privacidad/page';

describe('Páginas Legales', () => {
  beforeEach(() => {
    vi.stubEnv('NEXT_PUBLIC_BUSINESS_NAME', 'Test Empresa S.L.');
    vi.stubEnv('NEXT_PUBLIC_BUSINESS_ADDRESS', 'Calle Test 123');
    vi.stubEnv('NEXT_PUBLIC_CONTACT_EMAIL', 'test@empresa.com');
  });

  describe('Aviso Legal', () => {
    it('renderiza información de la empresa desde variables de entorno', () => {
      render(<AvisoLegalPage />);
      expect(screen.getByRole('heading', { name: 'Aviso Legal' })).toBeInTheDocument();

      // Buscar dentro de la sección de Datos Identificativos
      const section = screen.getByText(/Datos Identificativos/i).closest('section');
      expect(section).toHaveTextContent('Test Empresa S.L.');
      expect(section).toHaveTextContent('Calle Test 123');
      expect(section).toHaveTextContent('test@empresa.com');
    });

    it('no contiene placeholders', () => {
      render(<AvisoLegalPage />);
      expect(screen.queryByText(/\[Domicilio Fiscal\]/)).not.toBeInTheDocument();
      expect(screen.queryByText(/\[Email de Contacto\]/)).not.toBeInTheDocument();
    });

    it('contiene secciones adicionales requeridas', () => {
      render(<AvisoLegalPage />);
      // Registro mercantil está en la lista de datos identificativos
      expect(screen.getByText(/Registro Mercantil \/ Actividad:/i)).toBeInTheDocument();
      // Resolución de litigios es un heading
      expect(screen.getByRole('heading', { name: /Resolución de litigios/i })).toBeInTheDocument();
    });
  });

  describe('Política de Privacidad', () => {
    it('renderiza información de contacto y domicilio desde variables de entorno', () => {
      render(<PrivacidadPage />);
      expect(screen.getByRole('heading', { name: 'Política de Privacidad' })).toBeInTheDocument();

      // Verificar que contiene el domicilio del responsable (GDPR Art. 13)
      const responsableSection = screen.getByRole('heading', { name: /Responsable del Tratamiento/i }).closest('section');
      expect(responsableSection).toHaveTextContent('Test Empresa S.L.');
      expect(responsableSection).toHaveTextContent('Calle Test 123');
      expect(responsableSection).toHaveTextContent('test@empresa.com');
    });

    it('contiene secciones GDPR detalladas', () => {
      render(<PrivacidadPage />);
      const sections = [
        'Cookies y Rastreadores',
        'Legitimación',
        'Conservación de datos',
        'Comunicación de datos', // Cesiones
        'Derechos del Usuario',
        'Reclamaciones'
      ];

      sections.forEach(section => {
        expect(screen.getByRole('heading', { name: new RegExp(section, 'i') })).toBeInTheDocument();
      });
    });
  });
});