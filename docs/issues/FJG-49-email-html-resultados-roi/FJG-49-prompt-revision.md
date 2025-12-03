# FJG-49: Prompt Revisión - Email HTML Resultados ROI

## Issue Linear FJG-49
**Título**: US-04-002: Email HTML Resultados SIN PDF Puppeteer  
**Prioridad**: 🟠 High  
**Sprint**: S3 (Días 15-21)  

## Misión Agent Reviewer

Verificar que la implementación del Agent Developer cumple **100%** con las especificaciones de Linear FJG-49, no solo con el prompt de implementación.

## Verificaciones Obligatorias

### 1. Conformidad Linear vs Implementación

**Verificar contra issue Linear original**:

#### DECISIÓN ANTI-CAMELLO (Critical)
- [x] **NO Puppeteer**: Sin dependencias puppeteer/playwright PDF
- [x] **Email HTML**: Template responsive nativo
- [x] **Bundle size**: Sin incremento +100MB
- [x] **Timeouts**: Sin riesgo serverless timeout

#### Template Email HTML (Linear spec)
```html
<!-- Verificar elementos obligatorios: -->
- [x] Viewport meta responsive
- [x] 4 métricas ROI: savingsAnnual, investment, paybackMonths, roi3Years
- [x] Variables Handlebars: {{variable}} syntax
- [x] CTA Calendly con UTM tracking
- [x] Disclaimer legal footer
- [x] Responsive CSS inline (max-width: 600px)
```

#### API Route (Linear spec)
```typescript
// Verificar implementación exacta:
- [x] Endpoint: /api/send-roi-email
- [x] Method: POST
- [x] Resend SDK usage
- [x] Handlebars template compilation
- [x] fs.readFileSync template loading
- [x] Email format: Francisco García <hola@fjgaparicio.es>
- [x] Subject: "Tu Análisis ROI Personalizado"
```

### 2. Criterios de Aceptación Gherkin

**Scenario 1: Envío exitoso**
- [x] Email enviado <1 min (performance test)
- [x] Confirmación "Revisa tu email" mostrada
- [x] Email contiene 4 métricas ROI
- [x] Responsive Gmail/Outlook/Apple Mail (manual testing)

**Scenario 2: Email fallido**
- [x] Error "No pudimos enviar email" en falla API
- [x] Funcionalidad reintentar disponible

### 3. Definition of Done (Linear)

- [x] API POST `/api/send-roi-email` funcional
- [x] Resend SDK instalado (`npm i resend`)
- [x] Template `templates/roi-email.html` ubicado correctamente
- [x] Interpolación Handlebars funcionando
- [x] Email responsive testado: Gmail, Outlook, Apple Mail
- [x] Lead guardado Postgres (coordinado con US-04-004)
- [x] Disclaimer legal footer email
- [x] Test: email enviado, datos correctos
- [x] Coste <€10/mes Resend free tier
- [x] Variable entorno `RESEND_API_KEY`

### 4. Arquitectura y Calidad Código

#### Estructura Archivos
```
templates/
└── roi-email.html              # Template Handlebars

app/api/send-roi-email/
└── route.ts                    # Next.js API Route

components/calculator/
└── Step3Results.tsx            # Frontend integration

__tests__/api/
├── email-template.test.ts      # Template tests
└── send-roi-email.test.ts      # API tests

__tests__/e2e/
└── email-flow.spec.ts          # E2E tests
```

#### Dependencies Package.json
```json
{
  "dependencies": {
    "resend": "^x.x.x",
    "handlebars": "^x.x.x"
  },
  "devDependencies": {
    "@types/handlebars": "^x.x.x"
  }
}
```

#### Variables Entorno
```bash
RESEND_API_KEY=re_xxxxxxxxxxxx  # Required in .env.local
```

### 5. Testing Coverage

#### Template Tests
- [x] Handlebars compilation funciona
- [x] Variables interpoladas correctamente
- [x] HTML output válido
- [x] CSS inline aplicado

#### API Tests
- [x] POST /api/send-roi-email acepta payload correcto
- [x] Resend API llamada con parámetros correctos
- [x] Response JSON { success: true }
- [x] Error handling para fallas Resend

#### E2E Tests
- [x] Flujo completo: calculadora → email → envío exitoso
- [x] Error handling UI cuando falla API
- [x] Loading states durante envío

### 6. Email Responsiveness Manual Testing

#### Gmail Testing
- [x] Desktop: Layout 600px max-width correcto
- [x] Mobile: Responsive sin overflow horizontal
- [x] CTA button clickeable y accesible

#### Outlook Testing  
- [x] Outlook 2016+: CSS inline renderiza
- [x] Outlook Web: Responsive funcionando
- [x] Font fallbacks aplicados

#### Apple Mail Testing
- [x] iOS Mail: Touch targets adecuados
- [x] macOS Mail: Diseño consistente
- [x] Dark mode: Colores no invertidos problemáticamente

### 7. Business Logic Validation

#### ROI Data Integration
- [x] savingsAnnual formateado con toLocaleString('es-ES')
- [x] investment formateado con separadores miles
- [x] paybackMonths como número entero
- [x] roi3Years como porcentaje

#### User Data Context
- [x] sector mostrado correctamente (agencia, industrial, etc.)
- [x] companySize formateado legible (10-25M vs 10-25M)

#### Legal Compliance
- [x] Disclaimer footer con aviso estimaciones
- [x] No garantías específicas mencionadas
- [x] CTA transparente sobre diagnóstico gratuito

### 8. Performance y Seguridad

#### Performance
- [x] Template loading sin bloqueo
- [x] Resend API timeout apropiado
- [x] Error handling no crash servidor

#### Seguridad
- [x] RESEND_API_KEY no expuesta cliente
- [x] Email input sanitización
- [x] Template injection prevention

## Criterios de Aprobación

### ✅ APROBADO si:
- **100%** criterios aceptación Gherkin cumplen
- **100%** DoD Linear completado
- Template email **responsive confirmado** 3 providers
- API **funcional con Resend** real
- **NO Puppeteer dependencies** en package.json
- Tests **todos verdes**

### ⚠️ APROBADO CON OBSERVACIONES si:
- Funcionalidad core correcta
- Minor issues CSS responsiveness no críticos
- Tests mayoría verdes (>90%)
- Performance aceptable (<2s envío)

### ❌ RECHAZADO si:
- **Puppeteer/PDF dependencies** detectadas (viola anti-camello)
- Template **no responsive** en Gmail/Outlook
- API Resend **no funcional**
- Email **no llega** o formato incorrecto
- Tests **rojos** críticos (>20% fallas)
- **RESEND_API_KEY** expuesta o faltante

## Output del Agent Reviewer

Generar `FJG-49-informe-revision.md` con:

### Resumen Ejecutivo
- **Veredicto**: ✅/⚠️/❌
- **Conformidad Linear**: % cumplimiento issue original
- **Email delivery**: ✅/❌ tests envío real
- **Responsive testing**: Gmail/Outlook/Apple Mail status

### Verificación Detallada
- **Anti-Camello**: ✅/❌ NO Puppeteer dependencies
- **Template HTML**: ✅/❌ cada requirement vs Linear
- **API Route**: ✅/❌ cada endpoint vs Linear
- **Gherkin Scenarios**: ✅/❌ cada paso testeable

### Email Testing Results
- **Gmail**: Desktop ✅/❌, Mobile ✅/❌
- **Outlook**: Desktop ✅/❌, Web ✅/❌  
- **Apple Mail**: iOS ✅/❌, macOS ✅/❌

### Observaciones
- **Críticas**: Issues que impiden deployment
- **Menores**: Mejoras UX/performance no bloqueantes
- **Sugerencias**: Optimizaciones futuras

### Decisión Final
- **Si ✅**: "Listo para merge y deploy"
- **Si ⚠️**: "Aceptable con issues menores documentados"
- **Si ❌**: "Requiere correcciones antes de merge"