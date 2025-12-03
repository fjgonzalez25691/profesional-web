# FJG-45 - PROMPT IMPLEMENTACIÓN
**Issue**: US-03-003: Guardrails Legales + Fallback Timeout
**Agent Role**: Developer
**Sprint**: S2 (Cycle 2cce504b-650a-4498-bde9-35d43489c6f0)
**Story Points**: 2 SP

## VERIFICACIÓN LINEAR OBLIGATORIA

**ANTES DE PROCEDER**: Has verificado la issue FJG-45 en Linear y confirmas que los criterios de aceptación y DoD coinciden exactamente con este prompt.

**Issue verificada en Linear**: US-03-003: Guardrails Legales + Fallback Timeout
**Status**: In Progress
**Scope alineado**: Protección legal y coherencia posicionamiento empresarial FJG-44

## MISIÓN DEVELOPER TDD

Implementar **guardrails legales y timeout fallback** para chatbot Groq siguiendo metodología TDD estricta.

### ALCANCE ESPECÍFICO (según Linear)
1. **Footer Legal**: Texto orientativo siempre visible en chatbot
2. **Response Validation**: Detectar lenguaje absoluto prohibido y añadir disclaimer
3. **Timeout Fallback**: Mensaje humano si API >8s
4. **Coherencia FJG-44**: Mantener posicionamiento empresarial
5. **Tests básicos**: Casos prohibidos + timeout

### CONTEXTO EMPRESARIAL (Post FJG-44)
- **Posicionamiento**: "Empresario que domina tecnología" 
- **Tono**: Resultados financieros comprensibles, sin jerga técnica excesiva
- **Guardrails existentes**: Ya implementados en system prompt (sin "garantizo", "100%", "te aseguro")

### FUERA DE ALCANCE
- Modificar system prompt FJG-44 (ya tiene guardrails integrados)
- Compliance legal avanzado (GDPR, etc.)
- Logging detallado (coordinado con FJG-47)
- Moderación contenido compleja

## PLAN TDD IMPLEMENTACIÓN

### FASE 1: Footer Legal Siempre Visible
```bash
# 1. RED: Test footer aparece en chatbot
touch __tests__/components/chatbot-legal-footer.test.tsx
# 2. GREEN: Implementar LegalFooter component
# 3. REFACTOR: Integrar en ChatbotModal

# Test Cases:
- Footer visible en chatbot abierto
- Texto orientativo sobre aproximaciones
- Mención diagnóstico 30 min necesario
- Tono empresarial coherente FJG-44
```

### FASE 2: Response Validation + Disclaimer
```bash
# 1. RED: Test validateResponse detecta frases prohibidas
touch __tests__/lib/response-validator.test.ts
# 2. GREEN: Implementar validateResponse function
# 3. RED: Test disclaimer automático añadido
# 4. GREEN: Integrar en API route
# 5. REFACTOR: Clean validation logic

# Test Cases:
- Detecta "garantizo", "100% seguro", "resultado garantizado"
- Añade disclaimer orientativo automático
- No modifica respuestas válidas
- Mantiene tono empresarial coherente
```

### FASE 3: Timeout Fallback Humano
```bash
# 1. RED: Test timeout >8s muestra fallback
touch __tests__/api/timeout-fallback.test.ts
# 2. GREEN: Implementar timeout handling API
# 3. RED: Test mensaje fallback UI
# 4. GREEN: Implementar timeout UI frontend
# 5. REFACTOR: Error handling unificado

# Test Cases:
- API timeout >8s detectado
- Mensaje fallback humano y cercano
- CTA agendar llamada incluido
- UI error state apropiado
```

### FASE 4: Integration + Coherencia FJG-44
```bash
# 1. RED: Test coherencia posicionamiento empresarial
# 2. GREEN: Verificar integration con system prompt existente
# 3. RED: Test no breaking changes chatbot UI
# 4. GREEN: Garantizar UX seamless
# 5. REFACTOR: Documentation y cleanup
```

## ARQUITECTURA TÉCNICA

### Estructura Archivos
```
components/Chatbot/
├── ChatbotModal.tsx              # MODIFICAR: añadir LegalFooter
├── LegalFooter.tsx               # NUEVO: footer legal siempre visible
└── TimeoutFallback.tsx           # NUEVO: mensaje timeout humano

lib/
├── response-validator.ts         # NUEVO: validación frases prohibidas
└── timeout-handler.ts            # NUEVO: manejo timeout >8s

app/api/chat/
└── route.ts                      # MODIFICAR: integrar validation + timeout

__tests__/
├── components/
│   └── chatbot-legal-footer.test.tsx  # NUEVO
├── lib/
│   ├── response-validator.test.ts     # NUEVO  
│   └── timeout-handler.test.ts        # NUEVO
└── api/
    └── timeout-fallback.test.ts       # NUEVO
```

### Footer Legal Component
```typescript
// components/Chatbot/LegalFooter.tsx
export function LegalFooter() {
  return (
    <div className="border-t bg-gray-50 px-3 py-2 text-xs text-gray-600">
      <p>
        💡 Los ejemplos y cifras son aproximados basados en experiencia previa. 
        Cada caso es único y requiere diagnóstico específico. 
        <button className="text-blue-600 hover:underline ml-1">
          Agenda diagnóstico 30 min →
        </button>
      </p>
    </div>
  );
}
```

### Response Validator
```typescript
// lib/response-validator.ts
const PROHIBITED_PHRASES = [
  /\bgarantizo\b/i,
  /\b100%\s*(seguro|garantizado)\b/i,
  /\bresultado\s*garantizado\b/i,
  /\bte\s*aseguro\b/i,
  /\bsiempre\s*funciona\b/i
];

export function validateResponse(response: string): string {
  const hasProhibitedPhrase = PROHIBITED_PHRASES.some(
    pattern => pattern.test(response)
  );

  if (hasProhibitedPhrase) {
    return `${response}\n\n⚠️ Nota: Las estimaciones son orientativas basadas en experiencia previa. Resultados específicos dependen de cada caso y requieren evaluación detallada.`;
  }

  return response;
}
```

### Timeout Handler
```typescript
// lib/timeout-handler.ts
export const TIMEOUT_FALLBACK_MESSAGE = `
Disculpa, estoy experimentando dificultades técnicas en este momento.

Para una respuesta inmediata sobre tu caso específico, te recomiendo:
📞 Agendar una llamada de 30 minutos donde puedo darte una evaluación personalizada
📧 Enviar un email con los detalles de tu situación

¿Te parece bien agendar una breve conversación?
`;

export function handleTimeout(): { message: string } {
  return { message: TIMEOUT_FALLBACK_MESSAGE };
}
```

## CRITERIOS ACEPTACIÓN (Linear)

### Footer Legal
- [ ] Footer siempre visible en chatbot abierto
- [ ] Texto orientativo sobre aproximaciones/diagnóstico
- [ ] Botón agenda diagnóstico funcional
- [ ] Tono empresarial coherente FJG-44

### Response Validation
- [ ] Detecta frases prohibidas automáticamente
- [ ] Añade disclaimer orientativo (no agresivo)
- [ ] No modifica respuestas válidas
- [ ] Mantiene coherencia posicionamiento empresarial

### Timeout Fallback
- [ ] Timeout >8s detectado y manejado
- [ ] Mensaje humano y cercano (no técnico)
- [ ] CTA agendar llamada incluido
- [ ] UI error state apropiado

### Coherencia FJG-44
- [ ] No breaking changes chatbot existente
- [ ] Posicionamiento empresarial preservado
- [ ] System prompt no modificado
- [ ] UX seamless integration

## DEFINITION OF DONE (Linear)

- [ ] Footer legal implementado y siempre visible
- [ ] `validateResponse` activo en API route
- [ ] Timeout fallback funcional >8s
- [ ] Tests básicos casos prohibidos + timeout
- [ ] Coherencia posicionamiento FJG-44 mantenida
- [ ] No breaking changes UI chatbot
- [ ] Documentación integration guardrails

## VARIABLES ENTORNO

```bash
# Sin nuevas variables requeridas
# Usa configuración existente FJG-44
```

## COORDINACIÓN ISSUES

**Depende de**: FJG-44 (Backend Groq implementado)
**Coordina con**: FJG-47 (Logging conversaciones)
**No modifica**: System prompt FJG-44 (guardrails ya integrados)

---

**NOTA IMPORTANTE**: Esta implementación complementa los guardrails ya existentes en el system prompt FJG-44. NO duplica funcionalidad, sino que añade protecciones UI/UX y fallback handling.