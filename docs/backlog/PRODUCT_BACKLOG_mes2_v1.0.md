
# PRODUCT BACKLOG Mes 2 v1.0 - Web Seller Machine "El Arquitecto que traduce P&L"

**Versión**: Mes 2 v1.0 - Optimización  
**Owner**: Francisco García Aparicio  
**Proyecto Linear**: `in2-web-personal`  
**Metodología**: Lean Startup + Vertical Slices 7 días + TDD  
**Alcance**: Mes 2 (Días 29-60) – Optimización post-MVP (RAG, PDF ROI, A/B tests, Admin avanzado)  
**North Star complementaria Mes 2**:  
- +X% conversión hero (A/B)  
- % chats que citan casos reales  
- % leads que descargan PDF ROI  
- Velocidad de respuesta comercial (mejor uso del admin)

---

## 📋 ÍNDICE

1. [Resumen Ejecutivo Mes 2](#resumen-ejecutivo-mes-2)  
2. [Épicas Mes 2](#épicas-mes-2)  
3. [Mapa de Dependencias (Mes 2)](#mapa-de-dependencias-mes-2)  
4. [Historias Usuario por Épica (Mes 2)](#historias-usuario-por-épica-mes-2)  
5. [Criterios de Éxito Mes 2](#criterios-de-éxito-mes-2)

---

## 📊 RESUMEN EJECUTIVO MES 2

Con el MVP de 28 días en producción (landing P&L, chatbot sin RAG, calculadora ROI, nurturing y transparencia básica), el foco del **Mes 2 (días 29-60)** es **optimizar**:

1. **Relevancia del chatbot** → añadir **RAG completo** sobre casos y contenidos con `pgvector`.
2. **Calidad del entregable para el lead** → generar **PDF descargable** del informe ROI (React-PDF) además del email HTML.
3. **Conversión del hero** → A/B test simple de titulares y claims de la home orientados a P&L.
4. **Operativa comercial** → convertir el admin de leads en un **panel de trabajo real**: filtros, búsqueda y export para seguimiento.

Se definen 4 épicas nuevas (In2-07 a In2-10) con **20 SP estimados** en total (según roadmap v2.1), sin asignar aún a sprints concretos.  
Todas las historias **dependen explícitamente** del MVP (US-01-xxx a US-06-xxx) y se etiquetan como `mes2`.

---

## 🎯 ÉPICAS MES 2

### In2-07: RAG Completo con pgvector (Chatbot + Casos)

**Objetivo**: Que el chatbot deje de ser solo prompt-engineering y responda usando el contenido real de casos/artefactos almacenados en Postgres (`pgvector`).  
**Prioridad**: 🔴 Urgent  
**Story Points Estimados**: 8 SP  
**Valor Negocio**: Respuestas más concretas, con cifras y ejemplos reales → más confianza → más agendas cualificadas.

**Issues incluidos**:
- US-07-001: Esquema RAG + tabla embeddings pgvector
- US-07-002: Pipeline de ingesta de casos a embeddings
- US-07-003: Endpoint Chatbot con RAG (retrieval + LLM)

**Labels**: `in2-web-personal`, `backend`, `ai`, `mes2`  

**Dependencias**:
- Requiere MVP completado:
  - US-01-001 (Proyecto Next.js + Postgres operativo)  
  - US-02-003 / US-03-004 (casos publicados en landing)  
  - US-03-002 (Backend Groq + prompt base SIN RAG)

---

### In2-08: PDF ROI Descargable (React-PDF)

**Objetivo**: Que el lead pueda **descargar un informe PDF** con su cálculo de ROI, reutilizando el contenido existente del resultado de la calculadora y del email HTML.  
**Prioridad**: 🟠 High  
**Story Points Estimados**: 4 SP  
**Valor Negocio**: Aumenta la percepción de valor y tangibilidad del diagnóstico → más probabilidad de follow-up interno en el cliente.

**Issues incluidos**:
- US-08-001: Template React-PDF Informe ROI
- US-08-002: Botón "Descargar PDF ROI" + tracking

**Labels**: `in2-web-personal`, `frontend`, `backend`, `mes2`  

**Dependencias**:
- Requiere:
  - US-04-001 (Calculadora ROI Frontend)  
  - US-04-002 (Email HTML Resultados)

---

### In2-09: A/B Test Headlines Hero P&L

**Objetivo**: Validar qué mensaje de hero (claim + subtítulo + CTA) maximiza la conversión a clic en Calendly/Calculadora.  
**Prioridad**: 🟠 High  
**Story Points Estimados**: 3 SP  
**Valor Negocio**: Mejora inmediata de conversión del tráfico existente sin aumentar coste de adquisición.

**Issues incluidos**:
- US-09-001: Infra mínima A/B testing para hero
- US-09-002: Tracking de conversión por variante (A/B)

**Labels**: `in2-web-personal`, `frontend`, `analytics`, `mes2`  

**Dependencias**:
- Requiere:
  - US-02-001 (Hero P&L base)
  - US-02-004 (Modal Calendly flotante)
  - Analítica básica (Plausible configurado en MVP)

---

### In2-10: Dashboard Admin Leads Avanzado

**Objetivo**: Convertir `/admin/leads` en una herramienta de trabajo diaria: filtros, búsqueda y export para priorizar y hacer seguimiento.  
**Prioridad**: 🟡 Medium  
**Story Points Estimados**: 5 SP  
**Valor Negocio**: Menos fricción al gestionar leads, mejor priorización y trazabilidad → más cierres con el mismo volumen de tráfico.

**Issues incluidos**:
- US-10-001: Filtros y búsqueda en /admin/leads
- US-10-002: Export CSV de leads
- US-10-003: Métricas agregadas básicas en admin (embudo)

**Labels**: `in2-web-personal`, `frontend`, `backend`, `mes2`  

**Dependencias**:
- Requiere:
  - US-04-004 (Lead Capture Postgres)
  - US-04-005 (Dashboard Admin Leads Ultra-Light)

---

## 🕸️ MAPA DE DEPENDENCIAS (Mes 2)

### Resumen alto nivel

- **In2-07 RAG** depende de:
  - Infra y DB (In2-01)
  - Casos publicados (In2-02 / In2-03)
  - Chatbot MVP sin RAG (In2-03)
- **In2-08 PDF ROI** depende de:
  - Calculadora ROI + email HTML (In2-04)
- **In2-09 A/B Hero** depende de:
  - Hero P&L + Calendly modal (In2-02)
  - Analytics configuradas en MVP (In2-05)
- **In2-10 Admin avanzado** depende de:
  - Captura de leads y admin light (In2-04)

### Diagrama simplificado (Mermaid)

```mermaid
graph TD;

  %% MVP Base
  US_01_001[US-01-001: Next.js + Postgres] --> US_07_001[US-07-001: Esquema RAG + pgvector]

  US_02_003[US-02-003: 3 Casos Éxito] --> US_07_002[US-07-002: Ingesta Casos → Embeddings]
  US_03_004[US-03-004: Grid 5 Casos] --> US_07_002

  US_03_002[US-03-002: Backend Chat SIN RAG] --> US_07_003[US-07-003: Endpoint Chat RAG]

  US_04_001[US-04-001: Calculadora ROI] --> US_08_001[US-08-001: Template PDF ROI]
  US_04_002[US-04-002: Email HTML ROI] --> US_08_001
  US_08_001 --> US_08_002[US-08-002: Descargar PDF + tracking]

  US_02_001[US-02-001: Hero P&L] --> US_09_001[US-09-001: Infra A/B Hero]
  US_02_004[US-02-004: Calendly Modal] --> US_09_002[US-09-002: Tracking conversión A/B]
  US_09_001 --> US_09_002

  US_04_004[US-04-004: Lead Capture DB] --> US_10_001[US-10-001: Filtros + búsqueda]
  US_04_005[US-04-005: Admin Leads Light] --> US_10_001
  US_10_001 --> US_10_002[US-10-002: Export CSV]
  US_10_001 --> US_10_003[US-10-003: Métricas agregadas]
````

---

## 📝 HISTORIAS USUARIO POR ÉPICA (Mes 2)

### 🔴 In2-07: RAG Completo con pgvector

---

## US-07-001: Esquema RAG + tabla embeddings pgvector

**Épica**: In2-07
**Prioridad**: 🟠 High
**Story Points**: 3 SP
**Labels**: `in2-web-personal`, `backend`, `ai`, `mes2`
**Bloqueadores**: US-01-001 (DB Postgres operativa)
**Bloquea a**: US-07-002, US-07-003

**Como** arquitecto que mantiene el sistema
**Quiero** tener un esquema claro para documentos RAG y sus embeddings
**Para** poder almacenar y consultar contenido de casos de forma eficiente y extensible

### Descripción Impacto Negocio

* Sin esta historia, no hay base técnica para RAG.
* Define cómo crecerán futuros contenidos (FAQ, posts, docs técnicos) sin re-hacer el modelo.

### Descripción Técnica / Alcance

* Extender Postgres con extensión `pgvector` (si no está ya).
* Crear tablas mínimas:

  * `rag_documents` (id, slug, source_type, sector, lenguaje, payload_metadata JSONB, created_at).
  * `rag_chunks` (id, document_id, chunk_index, text, embedding vector(1536), created_at).
* Documentar convenciones:

  * Longitud máxima de chunk.
  * Estrategia de normalización de texto (lowercase, sin HTML, etc.).
* Añadir seeds mínimos para pruebas locales.

### Criterios de Aceptación (Gherkin)

```gherkin
Feature: Esquema RAG en Postgres
  Como desarrollador
  Quiero tablas para documentos y embeddings
  Para soportar retrieval eficiente con pgvector

  Scenario: Tablas RAG creadas
    Given la base de datos está migrada a la última versión
    Then existe la tabla "rag_documents"
    And existe la tabla "rag_chunks"
    And la columna "embedding" de "rag_chunks" es de tipo vector

  Scenario: Inserción de chunk de prueba
    Given una migración de seeds se ha ejecutado
    When consulto "rag_chunks"
    Then al menos un registro existe con texto no vacío
    And el vector "embedding" no es null
```

### Estrategia de Tests

* **Unitarios**:

  * Tests de migraciones (por ejemplo con `drizzle-kit`/`prisma migrate` para que no fallen en local/CI).
* **Integración**:

  * Test que conecta a Postgres de test y verifica existencia de tablas y tipos esperados.
* **E2E**:

  * No aplica directamente (se cubre vía US-07-002/003).

---

## US-07-002: Pipeline de ingesta de casos a embeddings

**Épica**: In2-07
**Prioridad**: 🟠 High
**Story Points**: 3 SP
**Labels**: `in2-web-personal`, `backend`, `ai`, `mes2`
**Bloqueadores**: US-07-001, US-02-003, US-03-004 (casos publicados)
**Bloquea a**: US-07-003

**Como** Francisco alimentando al chatbot
**Quiero** un script/pipeline que convierta casos en chunks embebidos
**Para** que el chatbot pueda recuperar trozos relevantes de esos casos

### Descripción Impacto Negocio

* Automatiza la carga de contenido a la base de conocimiento del chatbot.
* Permite volver a lanzar ingesta cuando se añadan o modifiquen casos.

### Descripción Técnica / Alcance

* Fuente de datos: mismos casos usados en la landing (`US-02-003`, `US-03-004`), ya sea:

  * Fichero JSON de casos, o
  * Tabla `cases` en Postgres (si existe en MVP).
* Implementar script (p.ej. `scripts/ingest-casos-rag.ts`) que:

  * Lee todos los casos.
  * Trocea en chunks (p.ej. 400-800 chars).
  * Llama a endpoint de embeddings (OpenAI / Groq equivalent).
  * Inserta en tablas `rag_documents` y `rag_chunks`.
* Evitar duplicados (p.ej. por `slug + chunk_index`).

### Criterios de Aceptación (Gherkin)

```gherkin
Feature: Ingesta de casos a embeddings
  Como owner
  Quiero poblar la base RAG con mis casos
  Para que el chatbot tenga material real sobre el que razonar

  Scenario: Ejecución de script de ingesta
    Given existen al menos 3 casos publicados
    When ejecuto el comando "npm run ingest:casos"
    Then se crean documentos en "rag_documents" uno por caso
    And se crean varios registros en "rag_chunks" asociados
    And ninguna fila tiene embedding null

  Scenario: Re-ejecución idempotente
    Given he ejecutado "npm run ingest:casos" una vez
    When lo vuelvo a ejecutar
    Then el número de documentos en "rag_documents" no se duplica
    And el número de chunks por caso se mantiene estable
```

### Estrategia de Tests

* **Unitarios**:

  * Tests del algoritmo de splitting en chunks.
* **Integración**:

  * Test con DB de test en el que se simulan 2-3 casos y se verifica el número de `rag_documents` / `rag_chunks`.
  * Stubs o mock del cliente de embeddings.
* **E2E**:

  * Script real contra entorno de staging (opcional, manual al principio).

---

## US-07-003: Endpoint Chatbot con RAG (retrieval + LLM)

**Épica**: In2-07
**Prioridad**: 🔴 Urgent
**Story Points**: 2 SP
**Labels**: `in2-web-personal`, `backend`, `ai`, `mes2`
**Bloqueadores**: US-07-002, US-03-002
**Bloquea a**: —

**Como** visitante con dudas concretas
**Quiero** que el chatbot use casos y contenido real al responder
**Para** confiar en las cifras y ejemplos que veo

### Descripción Impacto Negocio

* Diferencia clara frente a un chatbot genérico: “habla de mis casos y números”.
* Justifica tu posicionamiento de arquitecto que vive en P&L.

### Descripción Técnica / Alcance

* Extender el endpoint existente `/api/chat`:

  * Pasar de `LLM(prompt)` a:

    * `query → búsqueda en pgvector` (k-nearest neighbors).
    * Construcción de contexto con top-k chunks.
    * Llamada a LLM con:

      * System prompt base (ya existente en US-03-002).
      * Mensaje usuario.
      * Mensaje contexto con chunks (citando origen).
* Añadir campo de debug opcional (`?debug=1`) para ver qué chunks se han usado en la respuesta (solo admin).

### Criterios de Aceptación (Gherkin)

```gherkin
Feature: Chatbot responde con contexto RAG
  Como visitante
  Quiero respuestas basadas en casos reales
  Para entender impacto económico en situaciones similares

  Scenario: Pregunta relacionada con un caso existente
    Given la base de datos RAG contiene casos embebidos
    When pregunto "¿Cómo mejoraste el margen en una empresa logística?"
    Then la respuesta menciona explícitamente un caso real
    And cita al menos una cifra (ROI, % mejora o payback)
    And no inventa nombres de empresas si no existen en los datos

  Scenario: Pregunta sin match claro
    Given el índice RAG no encuentra chunks relevantes
    When pregunto algo fuera de contexto
    Then el chatbot responde de forma generalista basada en el system prompt
    And indica que no tiene un caso real exacto para esa situación
```

### Estrategia de Tests

* **Unitarios**:

  * Función de construcción de prompt con contexto.
  * Función de mapeo de resultados de vector search → chunks.
* **Integración**:

  * Test con DB de test con 1–2 casos y consulta que debe hacer match.
* **E2E**:

  * Test Playwright que lanza una pregunta concreta desde la UI del chatbot y verifica presencia de textos relativos al caso.

---

### 🟠 In2-08: PDF ROI Descargable (React-PDF)

---

## US-08-001: Template React-PDF Informe ROI

**Épica**: In2-08
**Prioridad**: 🟠 High
**Story Points**: 2 SP
**Labels**: `in2-web-personal`, `frontend`, `mes2`
**Bloqueadores**: US-04-001, US-04-002
**Bloquea a**: US-08-002

**Como** director general que ha usado la calculadora
**Quiero** un PDF con el resumen de mi ROI
**Para** poder reenviarlo internamente y justificar la conversación contigo

### Descripción Impacto Negocio

* El lead se lleva “algo serio” que puede enseñar al CFO/equipo.
* Aumenta la probabilidad de que se reabra la conversación incluso si se enfría el lead.

### Descripción Técnica / Alcance

* Crear componente `PdfRoiReport.tsx` usando React-PDF:

  * Reutiliza contenido del email HTML (US-04-002) y de la página de resultados.
  * Incluye:

    * Datos de entrada (sector, ticket, tiempos).
    * Resultados calculadora (ROI, payback, % mejora).
    * Disclaimers legales de estimaciones.
* Exponer una función que reciba el modelo de resultados y devuelva un `Blob`/`Uint8Array` imprimible.

### Criterios de Aceptación (Gherkin)

```gherkin
Feature: Template PDF ROI
  Como usuario que usa la calculadora
  Quiero un PDF con mis números
  Para compartirlo con mi equipo

  Scenario: Generación correcta del PDF
    Given he completado la calculadora ROI
    When se genera el PDF de informe
    Then el PDF contiene mi nombre o empresa si se ha introducido
    And muestra el ROI estimado y el payback en meses
    And incluye un disclaimer de que son estimaciones
```

### Estrategia de Tests

* **Unitarios**:

  * Tests de la función que transforma el modelo de datos en elementos React-PDF (snapshots básicos).
* **Integración**:

  * Test que genera un PDF en memoria y comprueba que no falla y tiene tamaño > X bytes.
* **E2E**:

  * Se cubre en US-08-002 (descarga desde la UI).

---

## US-08-002: Botón "Descargar PDF ROI" + tracking

**Épica**: In2-08
**Prioridad**: 🟠 High
**Story Points**: 2 SP
**Labels**: `in2-web-personal`, `frontend`, `analytics`, `mes2`
**Bloqueadores**: US-08-001
**Bloquea a**: —

**Como** usuario que ha visto sus resultados
**Quiero** descargar un PDF con el informe
**Para** guardarlo o reenviarlo cuando quiera

### Descripción Impacto Negocio

* Mide cuántos leads consideran el informe lo bastante valioso como para descargarlo.
* Señal extra de intención → se puede usar como trigger en el admin.

### Descripción Técnica / Alcance

* En la pantalla de resultados de la calculadora ROI:

  * Añadir botón “Descargar PDF (informe detallado)”.
  * Al clicar:

    * Se genera el PDF en cliente usando `PdfRoiReport`.
    * Se dispara evento de analytics (Plausible / custom) con:

      * `event: "roi_pdf_download"`
      * `props: { sector, company_size, source }`
* Manejar errores (mostrar toast si el PDF no se puede generar).

### Criterios de Aceptación (Gherkin)

```gherkin
Feature: Descarga PDF ROI
  Como usuario
  Quiero descargar mi informe ROI
  Para guardarlo o compartirlo

  Scenario: Descarga exitosa
    Given he completado la calculadora y veo la pantalla de resultados
    When hago clic en "Descargar PDF"
    Then se inicia la descarga de un archivo .pdf
    And se registra un evento de analytics "roi_pdf_download"

  Scenario: Error generando PDF
    Given la generación del PDF falla
    When hago clic en "Descargar PDF"
    Then veo un mensaje de error explicando que lo intente de nuevo
```

### Estrategia de Tests

* **Unitarios**:

  * Test del handler de clic para asegurar que llama a la función de generación y al tracker.
* **Integración**:

  * Test que simula la generación de PDF (mock) y verifica que se llama al tracker.
* **E2E**:

  * Test Playwright que:

    * Completa la calculadora con datos mínimos.
    * Clica en “Descargar PDF”.
    * Verifica que el navegador ha iniciado una descarga.

---

### 🟠 In2-09: A/B Test Headlines Hero P&L

---

## US-09-001: Infra mínima A/B testing hero

**Épica**: In2-09
**Prioridad**: 🟠 High
**Story Points**: 2 SP
**Labels**: `in2-web-personal`, `frontend`, `analytics`, `mes2`
**Bloqueadores**: US-02-001
**Bloquea a**: US-09-002

**Como** owner de la web
**Quiero** servir dos variantes de hero
**Para** comparar cuál convierte mejor en clic a Calendly/Calculadora

### Descripción Impacto Negocio

* Es la base para experimentar en hero sin tocar el resto de la página.
* Permite jugar con mensajes distintos (más duro en P&L vs más “dolor”, etc.).

### Descripción Técnica / Alcance

* Añadir sistema simple de variantes:

  * Variantes `A` y `B` para el hero (title + subtitle + bullet principal).
  * Asignación por:

    * Query param `?variant=a|b` (para tests controlados) y
    * Random + cookie para tráfico normal (50/50).
* Guardar la variante actual en cookie (p.ej. `hero_variant`).

### Criterios de Aceptación (Gherkin)

```gherkin
Feature: Infra A/B hero
  Como experimentador
  Quiero poder mostrar hero A o B
  Para comparar resultados

  Scenario: Forzar variante via query param
    Given accedo a la URL con "?variant=b"
    Then se muestra la variante B del hero
    And la cookie "hero_variant" se establece a "b"

  Scenario: Asignación aleatoria sin query param
    Given accedo a la home sin query param de variante
    When recargo varias veces
    Then en unas visitas veo la variante A
    And en otras veo la variante B
```

### Estrategia de Tests

* **Unitarios**:

  * Función que decide variante según query/cookie.
* **Integración**:

  * Test de rendering que verifica que cada variante muestra textos distintos.
* **E2E**:

  * Test Playwright que visita `/?variant=a` y `/?variant=b` y verifica el texto de hero.

---

## US-09-002: Tracking de conversión por variante (A/B)

**Épica**: In2-09
**Prioridad**: 🟠 High
**Story Points**: 1 SP
**Labels**: `in2-web-personal`, `analytics`, `mes2`
**Bloqueadores**: US-09-001, US-02-004
**Bloquea a**: —

**Como** owner que analiza conversión
**Quiero** ver la tasa de clic a CTA por variante
**Para** decidir qué hero mantener

### Descripción Impacto Negocio

* Permite tomar decisiones basadas en datos, no opiniones.
* Relaciona directamente copy de hero con agendas generadas.

### Descripción Técnica / Alcance

* Añadir eventos de analítica:

  * `hero_cta_click` con propiedad `variant: "a" | "b"`.
* Asegurar que:

  * El evento se dispara tanto desde CTA principal como secunda (si la hay).
* Crear doc corto (o nota en `/transparencia`) con:

  * Cómo leer esos datos en Plausible.

### Criterios de Aceptación (Gherkin)

```gherkin
Feature: Tracking conversión por variante
  Como owner
  Quiero saber qué hero convierte mejor
  Para seleccionar la mejor variante

  Scenario: Evento de clic con variante
    Given estoy viendo la variante A del hero
    When hago clic en el CTA principal
    Then se envía un evento "hero_cta_click"
    And el payload incluye "variant": "a"
```

### Estrategia de Tests

* **Unitarios**:

  * Test de la función que construye el payload de evento.
* **E2E**:

  * Test Playwright que:

    * Fuerza variante A y hace clic en CTA → verifica llamada a endpoint de analytics (mock).

---

### 🟡 In2-10: Dashboard Admin Leads Avanzado

---

## US-10-001: Filtros y búsqueda en /admin/leads

**Épica**: In2-10
**Prioridad**: 🟡 Medium
**Story Points**: 2 SP
**Labels**: `in2-web-personal`, `frontend`, `backend`, `mes2`
**Bloqueadores**: US-04-004, US-04-005
**Bloquea a**: US-10-002, US-10-003

**Como** Francisco gestionando leads
**Quiero** filtrar y buscar en `/admin/leads`
**Para** poder priorizar y encontrar leads relevantes rápido

### Descripción Impacto Negocio

* Reduce el tiempo perdido buscando leads por email/sector.
* Ayuda a centrarte en los leads con más intención (por fuente o interacción).

### Descripción Técnica / Alcance

* En `/admin/leads` añadir:

  * Filtro por:

    * Fecha (desde/hasta).
    * Estado (nuevo, contactado, no interesado… si se usa).
    * Source (landing, chatbot, calculadora).
  * Búsqueda por:

    * Email.
    * Empresa (si está recogido).
* Implementar filtrado server-side (query a Postgres).

### Criterios de Aceptación (Gherkin)

```gherkin
Feature: Filtros y búsqueda admin leads
  Como owner
  Quiero filtrar y buscar leads
  Para localizar rápido los que me interesan

  Scenario: Filtro por fecha y source
    Given existen leads de varias fechas y fuentes
    When selecciono fecha desde "2025-01-01" y source "calculadora"
    Then solo veo los leads de la calculadora desde esa fecha

  Scenario: Búsqueda por email
    Given existe un lead con email "ceo@empresa.com"
    When escribo "ceo@empresa.com" en el buscador
    Then solo se muestra ese lead
```

### Estrategia de Tests

* **Unitarios**:

  * Función que construye el filtro a partir de los parámetros del formulario.
* **Integración**:

  * Test de la API que devuelve leads filtrados por fecha/source/email.
* **E2E**:

  * Test Playwright que abre `/admin/leads`, aplica filtros y comprueba resultados.

---

## US-10-002: Export CSV de leads

**Épica**: In2-10
**Prioridad**: 🟡 Medium
**Story Points**: 1 SP
**Labels**: `in2-web-personal`, `backend`, `mes2`
**Bloqueadores**: US-10-001
**Bloquea a**: —

**Como** Francisco que quiere hacer seguimiento en otra herramienta
**Quiero** exportar los leads a CSV
**Para** poder cargarlos en un CRM, hoja de cálculo o hacer análisis ad-hoc

### Descripción Impacto Negocio

* Facilita hacer seguimiento semanal con herramientas muy simples (Google Sheets).
* Evita que el admin se convierta en un silo cerrado.

### Descripción Técnica / Alcance

* Añadir botón “Exportar CSV” en `/admin/leads`:

  * Endpoint `/api/admin/leads/export` que devuelve CSV con las columnas clave:

    * fecha, email, empresa, sector, source, nurturing_step…
  * Respeta filtros activos (exporta solo lo que se está viendo).

### Criterios de Aceptación (Gherkin)

```gherkin
Feature: Export CSV leads
  Como owner
  Quiero un CSV con mis leads
  Para analizarlos fuera del sistema

  Scenario: Exportar leads filtrados
    Given he aplicado un filtro por fecha y source
    When hago clic en "Exportar CSV"
    Then se descarga un fichero .csv
    And el número de filas coincide con los leads visibles en la tabla
```

### Estrategia de Tests

* **Unitarios**:

  * Función que serializa una lista de leads a CSV.
* **Integración**:

  * Test del endpoint `/api/admin/leads/export` con filtros de ejemplo.
* **E2E**:

  * Test Playwright que hace clic en "Exportar CSV" y comprueba que la respuesta tiene `content-type: text/csv`.

---

## US-10-003: Métricas agregadas básicas en admin (embudo)

**Épica**: In2-10
**Prioridad**: 🟡 Medium
**Story Points**: 2 SP
**Labels**: `in2-web-personal`, `frontend`, `backend`, `mes2`
**Bloqueadores**: US-10-001
**Bloquea a**: —

**Como** owner orientado a P&L
**Quiero** ver métricas agregadas sobre mis leads
**Para** entender qué canales convierten mejor y dónde se pierde el embudo

### Descripción Impacto Negocio

* Añade una mínima capa de “BI” encima de los datos de leads.
* Refuerza el discurso de que tomas decisiones de negocio basadas en datos.

### Descripción Técnica / Alcance

* En `/admin/leads`, sección superior con:

  * Nº leads por source (landing/chatbot/calculadora).
  * Nº leads por mes.
  * (Opcional) Nº leads con nurturing_step completado.
* Consultas agregadas en Postgres (GROUP BY).

### Criterios de Aceptación (Gherkin)

```gherkin
Feature: Métricas agregadas admin
  Como owner
  Quiero ver un resumen de mis leads
  Para entender el rendimiento de los canales

  Scenario: Resumen por source
    Given existen leads con source "landing" y "calculadora"
    When accedo a /admin/leads
    Then veo un contador por source
    And los totales coinciden con los leads listados
```

### Estrategia de Tests

* **Unitarios**:

  * Funciones que calculan agregados a partir de un array de leads.
* **Integración**:

  * Test de la API que devuelve datos agregados correctos con fixtures.
* **E2E**:

  * Test Playwright que verifica que los contadores coinciden con los leads visibles.

---

## ✅ CRITERIOS DE ÉXITO MES 2

Mes 2 se considera exitoso si, tras 4–8 semanas desde desplegar estas historias:

1. **RAG Chatbot**

   * ≥ 30–40% de conversaciones contienen menciones a casos reales o cifras concretas.
   * Disminuyen claramente las respuestas “genéricas”.

2. **PDF ROI**

   * ≥ 30% de los usuarios que llegan a la pantalla de resultados hacen clic en “Descargar PDF”.
   * Leads con descarga PDF tienen una tasa de respuesta a follow-up superior a los que no descargan.

3. **A/B Hero**

   * Se ha recogido al menos una muestra de n≥100 visitas por variante.
   * Se identifica claramente una variante ganadora con +X% clic en CTA respecto a la otra.

4. **Admin avanzado**

   * Export CSV usado al menos 1 vez/semana.
   * Tiempo medio para encontrar un lead concreto (tu percepción subjetiva) se reduce claramente.

---

**Versión**: Mes 2 v1.0 – Épicas + Dependencias
**Fecha**: 2025-11-30
**Próxima Acción**: Crear épicas In2-07 a In2-10 e issues US-07-xxx, US-08-xxx, US-09-xxx, US-10-xxx en Linear (estado `Backlog` / `Planned`, sin ciclo asignado).


