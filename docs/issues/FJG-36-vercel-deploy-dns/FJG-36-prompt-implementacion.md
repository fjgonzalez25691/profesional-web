# TAREA DE IMPLEMENTACIÓN: FJG-36

**Rol:** Agent Developer (Ver `.prompts/ROLES.md`)
**Objetivo:** US-01-002: Vercel Deploy + DNS fjgaparicio.es

## 0. Constitución (OBLIGATORIO)
Antes de escribir código, confirma que has leído:
1. `.prompts/CONSTITUCION.md`.
2. `docs/ESTADO_PROYECTO.md`.
3. La issue FJG-36 (Vía MCP).

## 1. Objetivo Funcional
Configurar deploy automático del proyecto en Vercel con dominio personalizado fjgaparicio.es para validar MVP con clientes reales. Establecer pipeline de CI/CD que despliegue automáticamente desde rama main con HTTPS y certificado SSL.

## 2. División de Responsabilidades

### **PARTE A: TAREAS MANUALES (RESPONSABLE PROYECTO)**
**⚠️ PREREQUISITO:** Las siguientes tareas deben completarse ANTES de ejecutar este prompt:

#### **A1. Backup AWS Route 53**
- [ ] Documentar nameservers actuales de fjgaparicio.es
- [ ] Guardar configuración completa Route 53 (A, CNAME, MX records)
- [ ] Capturar screenshot configuración actual S3

#### **A2. Configuración Vercel**
- [ ] Crear cuenta/proyecto en Vercel
- [ ] Conectar repositorio GitHub `fjgonzalez25691/profesional-web`
- [ ] Configurar directorio build: `profesional-web/`
- [ ] Configurar comando build: `cd profesional-web && npm run build`
- [ ] Añadir dominio `fjgaparicio.es` en Vercel
- [ ] Obtener nameservers Vercel para el dominio

#### **A3. Migración DNS**
- [ ] En AWS Route 53: Cambiar nameservers a los de Vercel
- [ ] Esperar propagación DNS (15-30 min)
- [ ] Verificar: `dig fjgaparicio.es` apunta a Vercel

#### **A4. Configurar Variables Producción**
- [ ] En Vercel: Añadir variables de entorno desde .env.example
- [ ] Configurar variables específicas de producción (DATABASE_URL, etc.)

### **PARTE B: TAREAS AGENT DEVELOPER (AUTOMATIZABLES)**
**✅ PREREQUISITO:** Agent Developer asume que TODAS las tareas manuales están completadas.

## 3. Criterios de Aceptación (CA) - Para Agent Developer
**NOTA:** Agent Developer verifica, NO ejecuta la configuración manual.

* [ ] Verificar proyecto conectado a Vercel (mediante curl/scripts)
* [ ] Verificar deploy automático funciona (<2 min)
* [ ] Verificar https://fjgaparicio.es accesible públicamente
* [ ] Verificar certificado SSL activo (Let's Encrypt)
* [ ] Verificar redirect www → apex domain configurado
* [ ] Crear scripts de verificación DNS
* [ ] Documentar variables de entorno de producción configuradas

## 4. Definición de Hecho (DoD) - Para Agent Developer
* [ ] Scripts de verificación creados y funcionando
* [ ] Documentación completa del deploy
* [ ] Backup AWS documentado para rollback futuro
* [ ] Smoke tests automáticos (curl https://fjgaparicio.es retorna 200 OK)
* [ ] Sin credenciales hardcodeadas en documentación
* [ ] README actualizado con URLs de producción

## 5. Archivos a Crear/Modificar (Agent Developer)
**Crear:**
* `docs/DEPLOY.md`: Documentación completa del proceso de deploy
* `docs/AWS_BACKUP.md`: Backup configuración Route 53 para rollback futuro
* `scripts/verify-deploy.sh`: Script verificación automática deploy
* `docs/issues/FJG-36-vercel-deploy-dns/FJG-36-verificacion-deploy.md`: Documentación verificaciones

**Modificar:**
* `docs/ESTADO_PROYECTO.md`: Actualizar con URLs de producción
* `profesional-web/README.md`: Añadir enlaces de producción y staging
* `profesional-web/.env.example`: Documentar variables de producción necesarias

## 6. Plan de Implementación (Agent Developer)

**⚠️ IMPORTANTE:** Agent Developer NO ejecuta configuración manual. Solo documenta y crea scripts.

### **Paso 1: Documentación Backup AWS**
1. Crear `docs/AWS_BACKUP.md` con template para documentar:
   - Nameservers originales AWS
   - Configuración Route 53 actual
   - Proceso de rollback paso a paso

### **Paso 2: Scripts de Verificación**
1. Crear `scripts/verify-deploy.sh` que verifique:
   - Conectividad https://fjgaparicio.es
   - Certificado SSL válido
   - Redirects www → apex
   - Tiempo de respuesta

### **Paso 3: Documentación Deploy**
1. Crear `docs/DEPLOY.md` documentando:
   - Proceso completo configuración Vercel
   - Variables de entorno necesarias
   - Comandos de verificación

### **Paso 4: Actualizar Documentación Proyecto**
1. Actualizar `README.md` con URLs finales
2. Actualizar `ESTADO_PROYECTO.md` con deploy info
3. Actualizar `.env.example` con variables producción

## 7. Instrucciones de Respuesta (Agent Developer)
**⚠️ CRÍTICO:** Agent Developer asume que las tareas manuales (Parte A) están completadas.

1. **Crear documentación** sin ejecutar configuración manual
2. **Generar scripts de verificación** que se puedan ejecutar post-deploy
3. **Actualizar documentación** del proyecto con URLs finales
4. Al finalizar, **genera obligatoriamente el informe**:
   * Ruta: `docs/issues/FJG-36-vercel-deploy-dns/FJG-36-informe-implementacion.md`
   * Contenido: Documentación creada, Scripts generados, Enlaces actualizados