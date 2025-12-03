const PROHIBITED_PATTERNS = [
  /\bgarantizo\b/i,
  /\b100%\s*(seguro|garantizado)\b/i,
  /\bresultado\s*garantizado\b/i,
  /\bte\s*aseguro\b/i,
  /\bsiempre\s*funciona\b/i,
];

const DISCLAIMER =
  "Nota: Las cifras y ejemplos son orientativos y dependen de cada negocio. Para un diagnóstico real hace falta una sesión de 30 minutos.";

export function validateResponse(response: string): { text: string; flagged: boolean } {
  const flagged = PROHIBITED_PATTERNS.some((pattern) => pattern.test(response));
  if (!flagged) {
    return { text: response, flagged };
  }

  return {
    text: `${response}\n\n⚠️ ${DISCLAIMER}`,
    flagged,
  };
}

export { PROHIBITED_PATTERNS, DISCLAIMER };
