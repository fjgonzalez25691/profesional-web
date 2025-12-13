import { render, screen } from '@testing-library/react';
import { describe, it, expect } from 'vitest';
import TechStackDiagram from '@/components/TechStackDiagram';

describe('TechStackDiagram', () => {
  it('renderiza título principal', () => {
    render(<TechStackDiagram />);
    expect(screen.getByRole('heading', { level: 2, name: /Stack Tecnológico Transparente/i })).toBeInTheDocument();
  });

  it('renderiza descripción del caso de estudio', () => {
    render(<TechStackDiagram />);
    expect(screen.getByText(/Esta web es un caso de estudio/i)).toBeInTheDocument();
  });

  it('muestra imagen SVG del diagrama', () => {
    render(<TechStackDiagram />);
    const img = screen.getByRole('img', { name: /Diagrama arquitectura tech stack/i });
    expect(img).toBeInTheDocument();
    expect(img).toHaveAttribute('src', '/diagrams/tech-stack.svg');
  });

  it('renderiza badges de tecnologías clave', () => {
    render(<TechStackDiagram />);
    expect(screen.getByText('Next.js 15')).toBeInTheDocument();
    expect(screen.getByText('React 19')).toBeInTheDocument();
    expect(screen.getByText('Groq (Llama 3.3)')).toBeInTheDocument();
    expect(screen.getByText('Neon Postgres')).toBeInTheDocument();
  });

  it('cada badge muestra propósito', () => {
    render(<TechStackDiagram />);
    expect(screen.getByText('App Router SSR')).toBeInTheDocument();
    expect(screen.getByText('Chatbot IA')).toBeInTheDocument();
  });

  it('grid de badges usa 2 cols mobile y 4 cols desktop', () => {
    const { container } = render(<TechStackDiagram />);
    const grid = container.querySelector('.grid');
    expect(grid).toHaveClass('grid-cols-2', 'md:grid-cols-4');
  });
});
