# PRODUCT BACKLOG Meses 3-6 v1.0 - Web Seller Machine "El Arquitecto que traduce P&L"

**Versión**: Meses 3-6 v1.0 - Escalado & Profundización  
**Owner**: Francisco García Aparicio  
**Proyecto Linear**: `in2-web-personal`  
**Metodología**: Lean Startup + Vertical Slices 7 días + TDD  
**Alcance**: Meses 3-6 (Días 61-180) – Escalar tráfico cualificado, demostrar casos avanzados y profundizar en producto  
**North Star Meses 3-6** (complementaria al MVP + Mes 2):  
- +X% tráfico orgánico cualificado (SEO/casos).  
- Nº demos avanzadas completadas (OCR / automatización).  
- Nº leads que vuelven a entrar vía portal.  
- Engagement con transparencia/arquitectura (tiempo de lectura, clics en pasos).

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo Meses 3-6](#resumen-ejecutivo-meses-3-6)  
2. [Épicas Meses 3-6](#épicas-meses-3-6)  
   - In2-11: Content & SEO Engine (Blog + Librería de Casos)  
   - In2-12: Demo Viva OCR + Automatización Logística  
   - In2-13: Portal Cliente / Pre-cliente Lite  
   - In2-14: Transparencia Extendida & Arquitectura Interactiva  
3. [Mapa de Dependencias (Meses 3-6)](#mapa-de-dependencias-meses-3-6)  
4. [Historias Usuario por Épica (Meses 3-6)](#historias-usuario-por-épica-meses-3-6)  
5. [Criterios de Éxito Meses 3-6](#criterios-de-éxito-meses-3-6)

---

## 📊 RESUMEN EJECUTIVO MESES 3-6

Con el **MVP (28 días)** y **Mes 2** en producción (landing P&L, chatbot con RAG, calculadora ROI + PDF, nurturing, admin leads avanzado, A/B Tests), el foco de **Meses 3-6 (días 61-180)** es:

1. **Escalar tráfico cualificado** con un sistema de **contenido y SEO** centrado en casos y playbooks de P&L.  
2. **Demostrar un caso avanzado de automatización con IA (OCR + workflow)** en formato demo viva, reutilizable en comerciales.  
3. **Convertir la relación con los leads en algo recurrente** con un **portal ligero** donde puedan volver a ver informes, materiales y compartir datos adicionales.  
4. **Refinar todavía más tu posicionamiento** de transparencia y arquitectura con un **dashboard extendido y diagrama interactivo** que sirva como caso de estudio en sí mismo.

Se definen 4 épicas nuevas (In2-11 a In2-14) con issues en modo **Backlog** (sin sprint/cycle asignado aún). Algunas historias se apoyan en épicas ya existentes (In2-02, In2-04, In2-05), pero se gestionarán como proyectos nuevos en Linear para tener foco por “capas”.

---

## 🎯 ÉPICAS MESES 3-6

### In2-11: Content & SEO Engine (Blog + Librería de Casos)

**Objetivo**: Construir una **librería de contenido orientada a P&L** (casos profundos + artículos tácticos) que capture tráfico orgánico y refuerce tu autoridad.

**Prioridad**: 🟠 High  
**Story Points Estimados (total)**: 8 SP  
**Valor Negocio**:
- Aumenta tráfico orgánico cualificado.
- Material para compartir en follow-ups comerciales y nurturing.

**Issues incluidos (propuestos)**:
- US-11-001: Estructura Blog / Insights P&L  
- US-11-002: Plantilla de Case Study Detallado SEO  
- US-11-003: Pipeline ligero de contenido (MDX + tags P&L)

**Labels sugeridos**: `in2-web-personal`, `frontend`, `seo`, `content`, `mes3-6`  

**Dependencias**:
- Hero, casos básicos y SEO mínimo de MVP (In2-02, In2-05).
- Transparencia básica ya publicada.

---

### In2-12: Demo Viva OCR + Automatización Logística

**Objetivo**: Tener una demo interactiva (subida o selección de documento tipo albarán/factura logística) que muestre **end-to-end** cómo la IA reduce trabajo manual y genera ROI.

**Prioridad**: 🟠 High  
**Story Points Estimados (total)**: 9 SP  
**Valor Negocio**:
- Caso potente para conversaciones con industria/logística.
- Material demo para calls: “te enseño en 5 minutos cómo pasamos de PDFs a datos + ROI”.

**Issues incluidos**:
- US-12-001: Landing / sección Demo OCR + flujo de demo  
- US-12-002: Pipeline OCR IA (LLM visión / API externa) + normalización  
- US-12-003: Pantalla de resultados + estimación ROI específica de automatización

**Labels sugeridos**: `in2-web-personal`, `backend`, `ai`, `demo`, `mes3-6`  

**Dependencias**:
- Infra IA ya montada (LLM provider).
- Calculadora ROI base (para reutilizar lógica de ahorro/ROI).

---

### In2-13: Portal Cliente / Pre-cliente Lite

**Objetivo**: Crear un **portal muy ligero** donde leads seleccionados puedan ver sus informes (ROI, conversaciones clave, materiales) sin montar un SaaS completo.

**Prioridad**: 🟡 Medium  
**Story Points Estimados (total)**: 7 SP  
**Valor Negocio**:
- Más toques de contacto con el lead sin envíos manuales.
- Percepción de “producto” sin tener que construir un monstruo multi-tenant.

**Issues incluidos**:
- US-13-001: Acceso seguro vía magic-link (sin gestión de contraseñas)  
- US-13-002: Listado de informes ROI y material asociado para cada lead  
- US-13-003: Upload ligero de archivos por parte del lead (p.ej. para preparar diagnóstico)

**Labels sugeridos**: `in2-web-personal`, `frontend`, `backend`, `portal`, `mes3-6`  

**Dependencias**:
- Admin leads (In2-10).
- Calculadora ROI + PDF (In2-08).
- Emailing operativo (Resend).

---

### In2-14: Transparencia Extendida & Arquitectura Interactiva

**Objetivo**: Llevar el dashboard de transparencia y la arquitectura a un nivel “wow útil”:

- Métricas extendidas (SEO, uptime, coste, conversión).
- Integraciones tipo Website Carbon / uptime.
- Diagrama **interactivo** de arquitectura (React Flow u otro), pero acotado a un solo caso.

**Prioridad**: 🟡 Medium  
**Story Points Estimados (total)**: 8 SP  
**Valor Negocio**:
- Refuerza tu posicionamiento de “arquitecto que enseña las tripas”.
- Sirve como asset educativo en calls.

**Issues incluidos**:
- US-14-001: Métricas extendidas en /transparencia (SEO, funnel completo)  
- US-14-002: Integración Website Carbon + uptime simplificada  
- US-14-003: Diagrama interactivo de arquitectura (React Flow) con navegación por “viaje de un lead”

**Labels sugeridos**: `in2-web-personal`, `frontend`, `backend`, `observability`, `mes3-6`  

**Dependencias**:
- Transparencia básica (In2-05).
- Admin leads y funnel mínimo ya operativos.

---

## 🕸️ MAPA DE DEPENDENCIAS (Meses 3-6)

### Resumen alto nivel

- **In2-11 Content/SEO**:
  - Reutiliza casos de éxito y estructura de landing (In2-02).
  - Se apoya en SEO base ya implementado.

- **In2-12 Demo OCR**:
  - Se apoya en:
    - Infra de IA (LLM provider del chatbot).
    - Lógica de ROI de automatización (calculadora).

- **In2-13 Portal**:
  - Depende de:
    - Admin leads + datos de leads (In2-10).
    - ROI + PDF generados (In2-08).
    - Email transaccional (Resend).

- **In2-14 Transparencia Extendida**:
  - Extiende:
    - `/transparencia` de MVP.
    - Admin leads para métricas de funnel.
    - Analytics (Plausible) para métricas de tráfico y conversión.

### Diagrama simplificado (Mermaid)

```mermaid
graph TD;

  %% Base MVP + Mes 2
  MVP_LANDING[In2-02: Landing P&L + Casos] --> EP11[In2-11 Content & SEO]
  MVP_SEO[In2-05: SEO & Transparencia básica] --> EP11
  MVP_CHAT_RAG[In2-07: Chatbot con RAG] --> EP12[In2-12 Demo OCR]
  MVP_ROI[In2-04/08: Calculadora ROI + PDF] --> EP12
  MVP_ADMIN[In2-10: Admin Leads Avanzado] --> EP13[In2-13 Portal Cliente Lite]
  MVP_EMAIL[Email Resend operativo] --> EP13
  MVP_TRANS[In2-05: /transparencia básica] --> EP14[In2-14 Transparencia extendida]
  MVP_ANALYTICS[Plausible + eventos] --> EP11
  MVP_ANALYTICS --> EP14

  EP11 --> CONTENT_ORG[+Tráfico orgánico]
  EP12 --> DEMO_ADV[Demo avanzada para calls]
  EP13 --> PORTAL_RET[Re-entrada recurrente de leads]
  EP14 --> BRAND_TRUST[Confianza y autoridad técnica]
````

---

## 📝 HISTORIAS USUARIO POR ÉPICA (Meses 3-6)

> Nota: todas las historias se definen en **Backlog**, sin asignar todavía a cycles/sprints de 7 días.
> Cuando tenga sentido, se pueden colgar de projects existentes (p.ej. In2-05 Transparencia) o de los nuevos proyectos In2-11 a In2-14.

---

### 🟠 In2-11: Content & SEO Engine (Blog + Librería de Casos)

---

### US-11-001: Estructura Blog / Insights P&L

**Épica**: In2-11
**Prioridad**: 🟠 High
**Story Points**: 2 SP
**Labels**: `in2-web-personal`, `frontend`, `seo`, `content`, `mes3-6`

**Como** visitante que investiga soluciones
**Quiero** una sección de artículos/insights orientados a P&L
**Para** entender mejor cómo se aplican cloud + IA a problemas como los míos

**Impacto negocio**

* Aumenta el tráfico orgánico y el tiempo en página.
* Suministra piezas para compartir en LinkedIn y nurturing.

**Alcance técnico**

* Crear ruta `/insights` o similar.
* Listado de posts con:

  * Título, resumen corto, tags (sector, tipo de proyecto, P&L focus).
  * Fecha de publicación.
* Posts en formato MD/MDX con frontmatter (sector, tipo de texto: caso, tutorial, opinión, etc.).
* Diseño consistente con tu branding actual.

**Criterios de aceptación (Gherkin)**

```gherkin
Feature: Sección de Insights P&L
  Scenario: Listado de artículos
    Given existen al menos 3 artículos publicados
    When accedo a /insights
    Then veo un listado con título, resumen, fecha y tags
    And cada tarjeta enlaza a la página de detalle del artículo

  Scenario: Navegación a artículo
    Given estoy en /insights
    When hago clic en un artículo
    Then navego a una URL tipo /insights/<slug>
    And veo el contenido completo del artículo
```

**Estrategia de tests**

* Unitarios: render de listado y de un post.
* Integración: build de páginas estáticas para posts.
* E2E: navegación `/insights` → post y chequeos básicos de contenido.

---

### US-11-002: Plantilla de Case Study Detallado SEO

**Épica**: In2-11
**Prioridad**: 🟠 High
**Story Points**: 3 SP
**Labels**: `in2-web-personal`, `frontend`, `seo`, `content`, `mes3-6`

**Como** decisor que llega desde Google/LinkedIn
**Quiero** ver un case study profundo con datos de P&L
**Para** entender si has resuelto problemas parecidos a los míos

**Impacto negocio**

* Refuerza tu autoridad en sectores clave (industria, logística, agencias).
* Aporta contexto para el chatbot y demo en llamadas.

**Alcance técnico**

* Crear plantilla de case study detallado con secciones:

  * Contexto cliente (anonimizado o genérico).
  * Dolor P&L (costes, margen, tiempos).
  * Solución cloud + IA.
  * Resultados (ROI, payback, % mejora).
  * Stack técnico (resumen).
* MDX con campos específicos en frontmatter (sector, tamaño, tipo de proyecto).
* Metatags SEO específicas (title, description, canonical, schema.org tipo `Article` o `CaseStudy`).

**Criterios de aceptación (Gherkin)**

```gherkin
Feature: Plantilla Case Study SEO
  Scenario: Visualización de case study
    Given existe un case study publicado
    When accedo a su URL
    Then veo secciones de contexto, problema, solución y resultados
    And se muestra al menos una métrica de ROI o payback
```

**Estrategia de tests**

* Unitarios: render de plantilla con datos de prueba.
* Integración: generación de metatags y schema para un case.
* E2E: acceso desde /insights o /casos a la página de detalle.

---

### US-11-003: Pipeline ligero de contenido (MDX + tags P&L)

**Épica**: In2-11
**Prioridad**: 🟡 Medium
**Story Points**: 3 SP
**Labels**: `in2-web-personal`, `content`, `mes3-6`

**Como** Francisco redactando contenido
**Quiero** poder añadir posts y cases editando ficheros MDX o entradas mínimas en DB
**Para** no depender de un CMS pesado ni de tocar código cada vez

**Impacto negocio**

* Reduce fricción para publicar contenido nuevo (velocidad >> perfección).
* Permite iterar rápido en SEO y mensajes.

**Alcance técnico**

* Soportar posts y case studies como:

  * Ficheros MDX en un directorio `content/` con frontmatter, o
  * Entradas en una tabla simple `content` (si prefieres DB).
* Script o guideline (`README`) que explique:

  * Cómo crear un nuevo artículo o case.
  * Cómo previsualizarlo en local.
* (Opcional) Componente para mostrar “tag P&L” (ej. `Costes infra`, `Margen`, `Payback`) a partir de los metadatos.

**Criterios de aceptación (Gherkin)**

```gherkin
Feature: Pipeline ligero de contenido
  Scenario: Añadir un nuevo artículo
    Given añado un fichero MDX con frontmatter válido en la carpeta de contenido
    When arranco la app en local
    Then el nuevo artículo aparece en el listado de /insights
```

**Estrategia de tests**

* Unitarios: parseo de frontmatter y mapeo a modelo interno.
* Integración: build que incluye nuevo contenido.
* E2E: ver nuevo artículo tras añadirlo en entorno de staging.

---

### 🟠 In2-12: Demo Viva OCR + Automatización Logística

---

### US-12-001: Sección Demo OCR + flujo de demo

**Épica**: In2-12
**Prioridad**: 🟠 High
**Story Points**: 2 SP
**Labels**: `in2-web-personal`, `frontend`, `demo`, `mes3-6`

**Como** director de operaciones/logística
**Quiero** ver una demo guiada de cómo automatizas documentos operativos
**Para** visualizar el ahorro de tiempo y errores

**Alcance técnico**

* Crear sección/anchor `/demo-ocr` accesible desde la landing.
* UI con pasos claros:

  * Seleccionar tipo de documento (ej. albarán, factura logística).
  * Subir fichero de ejemplo o usar uno de muestra.
  * Ver progreso de “procesado”.
* Copy centrado en “horas administrativas vs. minutos”, errores y P&L.

**Criterios de aceptación (Gherkin)**

```gherkin
Feature: Sección Demo OCR
  Scenario: Inicio de demo
    Given estoy en la home
    When navego a la sección de demo OCR
    Then veo una explicación breve del caso de uso
    And un botón para subir documento o usar ejemplo
```

**Estrategia de tests**

* Unitarios: render de componentes de demo.
* E2E: navegación desde la home hasta la demo y visibilidad de elementos clave.

---

### US-12-002: Pipeline OCR IA (visión) + normalización de datos

**Épica**: In2-12
**Prioridad**: 🟠 High
**Story Points**: 4 SP
**Labels**: `in2-web-personal`, `backend`, `ai`, `demo`, `mes3-6`

**Como** usuario de la demo
**Quiero** que el sistema extraiga datos clave del documento (fechas, importes, identificadores)
**Para** ver el potencial de automatizar ese trabajo manual

**Alcance técnico**

* Implementar endpoint `/api/demo-ocr` que:

  * Reciba el documento (imagen/PDF) o use uno de ejemplo.
  * Llame a:

    * Un modelo de visión de LLM (OpenAI Vision u otro), o
    * Una API de OCR/GCV/Textract (según coste-simplicidad).
  * Normalice datos clave:

    * Fecha, importe total, proveedor, referencia, etc.
* Mantener límites:

  * Solo 1-2 tipos de documento soporte (no genérico).
  * Número de campos a extraer acotado.

**Criterios de aceptación (Gherkin)**

```gherkin
Feature: Pipeline OCR demo
  Scenario: Documento de ejemplo exitoso
    Given uso un documento de ejemplo soportado
    When lanzo la demo OCR
    Then el sistema devuelve al menos fecha e importe total
    And no se rompe ni devuelve error técnico visible al usuario
```

**Estrategia de tests**

* Unitarios: normalización de campos y parseo de respuesta de OCR.
* Integración: test contra un documento de ejemplo en entorno de staging.
* E2E: ejecución completa de demo con documento de muestra.

---

### US-12-003: Pantalla de resultados demo + ROI automatización

**Épica**: In2-12
**Prioridad**: 🟠 High
**Story Points**: 3 SP
**Labels**: `in2-web-personal`, `frontend`, `ai`, `mes3-6`

**Como** usuario que ha pasado por la demo
**Quiero** ver cómo se traduce el ahorro de tiempo de ese caso en ROI
**Para** entender si merece la pena avanzar a una llamada

**Alcance técnico**

* Pantalla de resultados que muestre:

  * Campos extraídos del documento.
  * Asunción de tiempo manual vs. automatizado.
  * Ahorro estimado por documento y por mes.
  * ROI y payback específico del proceso automatizado.
* Integrar opción de “Agenda 30 minutos” directamente desde esa pantalla.

**Criterios de aceptación (Gherkin)**

```gherkin
Feature: Resultados demo OCR + ROI
  Scenario: Resultados y CTA
    Given he ejecutado la demo con un documento válido
    When veo la pantalla de resultados
    Then veo los datos extraídos clave
    And una estimación de ahorro en tiempo y dinero
    And un CTA claro para agendar una llamada
```

**Estrategia de tests**

* Unitarios: cálculo de ROI específico del caso OCR (puede reutilizar lógica de calculadora ROI).
* E2E: flujo completo demo → resultados → clic en CTA.

---

### 🟡 In2-13: Portal Cliente / Pre-cliente Lite

---

### US-13-001: Acceso seguro vía magic-link

**Épica**: In2-13
**Prioridad**: 🟡 Medium
**Story Points**: 3 SP
**Labels**: `in2-web-personal`, `backend`, `frontend`, `portal`, `mes3-6`

**Como** lead cualificado
**Quiero** acceder a un portal sin recordar contraseña
**Para** consultar mis informes y materiales cuando quiera

**Alcance técnico**

* Crear ruta `/portal` protegida.
* Flujo de acceso:

  * Formulario con email.
  * Envío de magic-link temporal usando Resend.
  * Tabla `portal_tokens` con token, email, expiración, uso único.
* Sesión simple (cookie con token validado).

**Criterios de aceptación (Gherkin)**

```gherkin
Feature: Acceso portal via magic-link
  Scenario: Solicitud de acceso
    Given introduzco mi email en el formulario del portal
    When envío la solicitud
    Then recibo un email con un enlace de acceso temporal

  Scenario: Acceso con enlace válido
    Given he recibido un magic-link válido
    When hago clic en el enlace
    Then accedo al portal sin introducir contraseña
```

**Estrategia de tests**

* Unitarios: generación/validación de tokens.
* Integración: envío de email con Resend en entorno de test.
* E2E: flujo email → click → acceso.

---

### US-13-002: Listado de informes ROI y materiales por lead

**Épica**: In2-13
**Prioridad**: 🟡 Medium
**Story Points**: 2 SP
**Labels**: `in2-web-personal`, `frontend`, `portal`, `mes3-6`

**Como** lead que ha hecho un diagnóstico
**Quiero** ver mis informes ROI y materiales en un solo sitio
**Para** poder revisarlos y compartirlos internamente

**Alcance técnico**

* En `/portal`, tras login:

  * Listado de informes ROI asociados al email del lead.
  * Para cada informe:

    * Fecha.
    * Tipo de caso (calculadora estándar, demo OCR, etc.).
    * Link a PDF o a página de resultados.
* Mostrar también:

  * Enlaces a artículos/casos recomendados según sector del lead.

**Criterios de aceptación (Gherkin)**

```gherkin
Feature: Listado de informes en portal
  Scenario: Ver mis informes ROI
    Given estoy autenticado en el portal
    When accedo a la sección de informes
    Then veo un listado con fecha y tipo de informe
    And puedo abrir al menos un informe en detalle
```

**Estrategia de tests**

* Unitarios: consulta de informes filtrados por email.
* E2E: login vía magic-link → ver listado con datos de prueba.

---

### US-13-003: Upload ligero de archivos por parte del lead

**Épica**: In2-13
**Prioridad**: 🟡 Medium
**Story Points**: 2 SP
**Labels**: `in2-web-personal`, `frontend`, `backend`, `portal`, `mes3-6`

**Como** lead con interés real
**Quiero** subir documentos simples (ej. extracto, listado de procesos)
**Para** que puedas preparar un diagnóstico/pre-propuesta más afinada

**Alcance técnico**

* En el portal:

  * Formulario de subida de 1-3 ficheros (PDF/imagen).
  * Guardar en storage simple (S3-like) + referencia en DB.
* Notificación ligera:

  * Email a ti cuando un lead sube documentos.
* Sin procesar automáticamente (en esta fase): solo almacenamiento + notificación.

**Criterios de aceptación (Gherkin)**

```gherkin
Feature: Upload de documentos en portal
  Scenario: Subir documentos de diagnóstico
    Given estoy autenticado en el portal
    When subo un documento permitido
    Then el sistema guarda el documento
    And recibo un mensaje de confirmación
    And tú recibes una notificación de nuevo documento
```

**Estrategia de tests**

* Unitarios: validación de tipos y tamaño de archivo.
* Integración: subida a storage y persistencia de metadatos.
* E2E: login → upload → comprobar notificación simulada.

---

### 🟡 In2-14: Transparencia Extendida & Arquitectura Interactiva

---

### US-14-001: Métricas extendidas en /transparencia (SEO + funnel)

**Épica**: In2-14
**Prioridad**: 🟡 Medium
**Story Points**: 3 SP
**Labels**: `in2-web-personal`, `frontend`, `backend`, `observability`, `mes3-6`

**Como** visitante escéptico
**Quiero** ver métricas más completas del rendimiento de la web
**Para** entender que aplicas lo que predicas en datos y P&L

**Alcance técnico**

* Extender `/transparencia` con:

  * Tráfico orgánico mensual (últimos X meses).
  * Conversión por canal (orgánico, directo, social).
  * Conversión lead → llamada agendada.
* Fuentes: Plausible + datos de leads en DB.

**Criterios de aceptación (Gherkin)**

```gherkin
Feature: Métricas extendidas transparencia
  Scenario: Ver métricas de funnel
    Given accedo a /transparencia
    Then veo gráficos o tablas con tráfico por canal
    And veo la tasa de conversión a lead y a agenda
```

**Estrategia de tests**

* Unitarios: agregados a partir de eventos y leads.
* Integración: endpoint que expone métricas para render.

---

### US-14-002: Integración Website Carbon + uptime simplificada

**Épica**: In2-14
**Prioridad**: 🟡 Medium
**Story Points**: 2 SP
**Labels**: `in2-web-personal`, `backend`, `observability`, `mes3-6`

**Como** visitante sensibilizado con sostenibilidad y fiabilidad
**Quiero** ver datos aproximados de huella de carbono y uptime de la web
**Para** saber que también cuidas eficiencia y robustez

**Alcance técnico**

* Integración básica con Website Carbon API (o similar) para:

  * Mostrar estimación de CO₂ por visita.
* Uptime:

  * Puedes usar datos de Vercel / simple ping service.
  * Mostrar uptime de los últimos 30/90 días (a alto nivel, sin montarte un Prometheus).
* Incluir disclaimer de que son estimaciones.

**Criterios de aceptación (Gherkin)**

```gherkin
Feature: Huella y uptime en transparencia
  Scenario: Ver huella de carbono y uptime
    Given accedo a /transparencia
    Then veo una estimación de CO₂ por visita
    And veo un porcentaje de uptime de los últimos 30 días
```

**Estrategia de tests**

* Unitarios: formateo de datos y fallback si API externa falla.
* Integración: mocks de Website Carbon / servicio de uptime.

---

### US-14-003: Diagrama interactivo de arquitectura (React Flow) “viaje de un lead”

**Épica**: In2-14
**Prioridad**: 🟡 Medium
**Story Points**: 3 SP
**Labels**: `in2-web-personal`, `frontend`, `observability`, `mes3-6`

**Como** CTO/arquitecto potencial cliente
**Quiero** ver la arquitectura de tu seller machine de forma interactiva
**Para** entender cómo encajas cloud + IA + datos con bajo coste y sin camellos

**Alcance técnico**

* Usar React Flow (u otra librería similar) pero **acotado a un único diagrama**:

  * Nodos para: user → landing → chatbot → calculadora → admin → portal → transparencia.
  * Edges con descripciones cortas (qué servicio, qué datos).
* Interacciones:

  * Hover o clic muestra detalles: servicios concretos (Vercel, Postgres, LLM, etc.), decisiones de coste, razones de simplicidad.
* Integración en `/transparencia` o página específica `/arquitectura`.

**Criterios de aceptación (Gherkin)**

```gherkin
Feature: Diagrama interactivo arquitectura
  Scenario: Navegar por el viaje de un lead
    Given accedo a la sección de arquitectura
    When paso el ratón por los nodos del diagrama
    Then veo información sobre qué hace cada componente
    And se entiende el flujo desde la visita hasta el lead en admin
```

**Estrategia de tests**

* Unitarios: configuración del grafo (nodos, edges) y props.
* E2E: render del diagrama y tooltips básicos.

---

## ✅ CRITERIOS DE ÉXITO MESES 3-6

Consideraremos que la fase Meses 3-6 tiene éxito si, tras 3-6 meses desde desplegar estas épicas:

1. **Content & SEO (In2-11)**

   * Tráfico orgánico representa una parte significativa del total (ej. >20–30%).
   * Al menos 3–5 deals o conversaciones cualificadas que mencionan haber llegado por contenido/casos.

2. **Demo OCR (In2-12)**

   * La demo se usa en ≥ N llamadas comerciales.
   * Al menos X leads han completado la demo desde la web.

3. **Portal Lite (In2-13)**

   * Leads que usan el portal muestran mayor tasa de respuesta a follow-ups que los que no.
   * Se usa al menos 1 vez/semana como herramienta real en tu operativa.

4. **Transparencia Extendida (In2-14)**

   * `/transparencia` recibe visitas recurrentes (no solo picos iniciales).
   * La página y el diagrama de arquitectura se mencionan en llamadas como “muy útiles” (señal cualitativa).

---

**Versión**: Meses 3-6 v1.0 – Épicas + Dependencias
**Fecha**: 2025-11-30
**Próxima Acción**: Crear proyectos In2-11 a In2-14 en Linear y las US-11-xxx, US-12-xxx, US-13-xxx, US-14-xxx en Backlog (sin cycle asignado), enlazando con proyectos existentes cuando tenga sentido (especialmente Transparencia/SEO).

---

```
::contentReference[oaicite:0]{index=0}
```
