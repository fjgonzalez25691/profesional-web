// Mock para next/font/google usado en tests de Vitest
// Retorna una función que simula el comportamiento de las fuentes de Google

export const Inter = () => ({
  className: 'inter-mock',
  style: { fontFamily: 'Inter' },
  variable: '--font-inter',
});

export const Roboto = () => ({
  className: 'roboto-mock',
  style: { fontFamily: 'Roboto' },
  variable: '--font-roboto',
});
