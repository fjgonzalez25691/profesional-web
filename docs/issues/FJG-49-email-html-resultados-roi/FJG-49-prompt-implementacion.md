# FJG-49: Prompt Implementación - Email HTML Resultados ROI

## Issue Linear FJG-49
**Título**: US-04-002: Email HTML Resultados SIN PDF Puppeteer  
**Prioridad**: 🟠 High  
**Story Points**: 3 SP  
**Sprint**: S3 (Días 15-21)  
**Bloqueadores**: FJG-48 (Calculadora funcionando) ✅ COMPLETADO

## DECISIÓN ANTI-CAMELLO (Especificación Linear)

**Email HTML vs Puppeteer PDF**:
- ❌ **Puppeteer PDF**: 8 SP, timeout serverless risk, 100MB bundle
- ✅ **Email HTML**: 3 SP, 0 timeouts, responsive nativo
- **Ahorro**: -5 SP, -100MB bundle, -riesgo crashes

**Justificación Linear**: Valor está en DATOS (números ROI), no formato. Email HTML responsive = mejor experiencia mobile que PDF.

## Historia de Usuario (Linear)
**Como** lead que completó calculadora  
**Quiero** recibir resultados por email  
**Para** compartir con equipo/CFO

## Especificaciones Técnicas de Linear

### Template Email HTML (templates/roi-email.html)
```html
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Tu Análisis ROI - Francisco García</title>
  <style>
    body { font-family: -apple-system, system-ui, sans-serif; }
    .container { max-width: 600px; margin: 0 auto; padding: 20px; }
    .results { background: #f8fafc; padding: 20px; border-radius: 8px; }
    .metric { margin: 12px 0; }
    .metric-label { color: #64748b; font-size: 14px; }
    .metric-value { color: #0f172a; font-size: 24px; font-weight: 600; }
    .cta { background: #3b82f6; color: white; padding: 12px 24px; 
           border-radius: 6px; text-decoration: none; display: inline-block; }
    .disclaimer { color: #94a3b8; font-size: 12px; margin-top: 20px; }
  </style>
</head>
<body>
  <div class="container">
    <h1>Tu Análisis ROI Personalizado</h1>
    
    <div class="results">
      <div class="metric">
        <div class="metric-label">Ahorro Anual Estimado</div>
        <div class="metric-value">{{savingsAnnual}}€</div>
      </div>
      
      <div class="metric">
        <div class="metric-label">Inversión Estimada</div>
        <div class="metric-value">{{investment}}€</div>
      </div>
      
      <div class="metric">
        <div class="metric-label">Periodo Recuperación (Payback)</div>
        <div class="metric-value">{{paybackMonths}} meses</div>
      </div>
      
      <div class="metric">
        <div class="metric-label">ROI a 3 años</div>
        <div class="metric-value">{{roi3Years}}%</div>
      </div>
    </div>
    
    <p>Basado en tu sector <strong>{{sector}}</strong> y tamaño <strong>{{companySize}}</strong>.</p>
    
    <p>
      <a href="https://fjgaparicio.es/calendly?utm_source=email&utm_campaign=roi-calculator" 
         class="cta">Agendar Diagnóstico Gratuito 30 min</a>
    </p>
    
    <div class="disclaimer">
      ⚖️ Estas cifras son estimaciones orientativas. Un diagnóstico real requiere 
      evaluación personalizada de 30 minutos. No garantizamos resultados específicos.
    </div>
  </div>
</body>
</html>
```

### API Email (app/api/send-roi-email/route.ts)
```typescript
import { Resend } from 'resend';
import Handlebars from 'handlebars';
import fs from 'fs';

const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req: Request) {
  const { email, roiData, userData } = await req.json();
  
  // Load template
  const templateSource = fs.readFileSync('templates/roi-email.html', 'utf-8');
  const template = Handlebars.compile(templateSource);
  
  // Compile with data
  const html = template({
    savingsAnnual: roiData.savingsAnnual.toLocaleString('es-ES'),
    investment: roiData.investment.toLocaleString('es-ES'),
    paybackMonths: roiData.paybackMonths,
    roi3Years: roiData.roi3Years,
    sector: userData.sector,
    companySize: userData.companySize,
  });
  
  await resend.emails.send({
    from: 'Francisco García <hola@fjgaparicio.es>',
    to: email,
    subject: 'Tu Análisis ROI Personalizado',
    html,
  });
  
  return Response.json({ success: true });
}
```

## Criterios de Aceptación (Gherkin Linear)

```gherkin
Feature: Email resultados ROI
  Scenario: Envío exitoso
    Given completé calculadora ROI
    And ingresé email "ceo@empresa.com"
    When clic "Enviar Resultados"
    Then email enviado <1 min
    And veo confirmación "Revisa tu email"
    And email contiene 4 métricas ROI
    And email responsive Gmail/Outlook/Apple Mail

  Scenario: Email fallido
    Given API Resend falla
    When intento enviar
    Then veo error "No pudimos enviar email"
    And puedo reintentar
```

## Definición de Hecho (Linear)

- [x] API POST `/api/send-roi-email` funcional
- [x] Resend SDK instalado (`npm i resend`)
- [x] Template `templates/roi-email.html`
- [x] Interpolación Handlebars
- [x] Email responsive testado: Gmail, Outlook, Apple Mail
- [x] Lead guardado Postgres (coordinado con US-04-004)
- [x] Disclaimer legal footer email
- [x] Test: email enviado, datos correctos
- [x] Coste <€10/mes Resend free tier (100 emails/día)
- [x] Variable entorno `RESEND_API_KEY`

## Plan TDD (Agent Developer)

### Fase 1: Setup Dependencias
1. **Instalar Resend SDK**: `npm install resend handlebars`
2. **Instalar types**: `npm install -D @types/handlebars`
3. **Crear template directory**: `templates/roi-email.html`

### Fase 2: Template Email (TDD)
4. **Test RED**: `__tests__/api/email-template.test.ts`
   - Template se compila con datos
   - Variables interpoladas correctamente
   - HTML válido generado
5. **Implementación GREEN**: `templates/roi-email.html` según Linear spec
6. **Test GREEN**: Template tests pasan

### Fase 3: API Route (TDD)
7. **Test RED**: `__tests__/api/send-roi-email.test.ts`
   - POST acepta email, roiData, userData
   - Resend API llamada correcta
   - Response success: true
   - Error handling falla API
8. **Implementación GREEN**: `app/api/send-roi-email/route.ts`
9. **Test GREEN**: API tests pasan

### Fase 4: Frontend Integration
10. **Modificar Step3Results**: Añadir botón "Enviar por Email"
11. **Test integration**: E2E envío email desde calculadora
12. **Validación responsive**: Gmail, Outlook, Apple Mail

### Fase 5: Error Handling & UX
13. **Loading states**: Spinner durante envío
14. **Success message**: "Revisa tu email"
15. **Error message**: "No pudimos enviar email"
16. **Retry functionality**: Reintentar envío

## Variables Entorno Requeridas

```bash
# .env.local
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Arquitectura Técnica

```
templates/
└── roi-email.html              # Template HTML Handlebars

app/api/send-roi-email/
└── route.ts                    # API Route Resend

components/calculator/
└── Step3Results.tsx            # Modificado: botón email

__tests__/api/
├── email-template.test.ts      # Tests template
└── send-roi-email.test.ts      # Tests API

__tests__/e2e/
└── email-flow.spec.ts          # Tests E2E flujo completo
```

## Restricciones Técnicas
- **Stack actual**: Next.js 16.0.7, TypeScript, Resend
- **Testing**: Vitest + React Testing Library + Playwright E2E
- **Template engine**: Handlebars (simple interpolación)
- **Email service**: Resend (mejor que SendGrid para startups)
- **Responsive**: Mobile-first design

## Output Esperado (Agent Developer)
Al finalizar, generar `FJG-49-informe-implementacion.md` con:
- ✅ Template HTML responsive
- ✅ API `/api/send-roi-email` funcional
- ✅ Integration frontend Step3Results
- ✅ Tests unitarios + E2E verdes
- 📧 Email test enviado con datos reales
- 📱 Screenshots responsive Gmail/Outlook
- 🚦 Estado de cada criterio de aceptación