# CHECKLIST TAREAS MANUALES FJG-36

**Responsable:** Owner/Manager del Proyecto  
**Prerequisito:** Estas tareas DEBEN completarse antes de ejecutar el Agent Developer

## 📋 FASE 1: BACKUP AWS ✅ COMPLETADO (15 min)

### **Backup Route 53 Current Config** ✅ DOCUMENTADO VIA CLI
- [x] **Método:** AWS CLI con usuario `Fran_desarrollador`
- [x] **Account AWS:** `568680248062`
- [x] **Hosted Zone ID:** `Z097313434P641IJN23RG`
- [x] **Nameservers originales AWS:**
  ```
  - ns-1180.awsdns-19.org
  - ns-1563.awsdns-03.co.uk  
  - ns-138.awsdns-17.com
  - ns-800.awsdns-36.net
  ```
- [x] **Records DNS originales completos:**
  ```json
  {
    "fjgaparicio.es": {
      "A": "ALIAS → dqwyi1y0tmoid.cloudfront.net (Z2FDTNDATAQYW2)",
      "NS": "TTL 172800 → AWS nameservers",
      "SOA": "TTL 900 → ns-1180.awsdns-19.org"
    },
    "www.fjgaparicio.es": {
      "A": "ALIAS → dqwyi1y0tmoid.cloudfront.net (Z2FDTNDATAQYW2)"
    },
    "SSL Validation CNAMEs": [
      "_cc452a7badb8016f7ca268196e030080.fjgaparicio.es",
      "_1edc5a153df6d2eeb76d17bba577a798.www.fjgaparicio.es"
    ]
  }
  ```
- [x] **Dominio info:**
  - Registrar: GANDI SAS
  - Creación: 2025-10-07
  - Expiración: 2026-10-07
  - AutoRenew: ✅ Activo

### **Análisis Configuración Original** ✅ IDENTIFICADO
- [x] **Arquitectura actual:** CloudFront AWS Distribution
- [x] **Certificados SSL:** AWS Certificate Manager (ACM)
- [x] **Origen CloudFront:** No identificado (requiere acceso CloudFront Console)
- [x] **Migración target:** CloudFront AWS → Vercel Edge Network
- [x] **Rollback capability:** Nameservers + Hosted Zone preservados

---

## 📋 FASE 2: CONFIGURACIÓN VERCEL ✅ COMPLETADO (20 min)

### **Setup Proyecto Vercel** ✅ IMPORTADO
- [x] **Método:** Vercel CLI v48.12.0
- [x] **Usuario autenticado:** `fjgonzalez25691-8656`
- [x] **Proyecto importado:** `profesional-web`
- [x] **Team:** `fran-gonzalezs-projects`
- [x] **Configuración detectada:**
  - Framework: ✅ Next.js (autodetectado)
  - Node Version: ✅ 24.x
  - Build Status: ✅ Ready
  - Deployment ID: `dpl_5k1V4Jw9hRaW8N7zbdpZZeHpiG4m`
- [x] **URLs temporales activas:**
  ```
  - https://profesional-web-rho.vercel.app (principal)
  - https://profesional-web-fran-gonzalezs-projects.vercel.app
  - https://profesional-web-fjgonzalez25691-8656-fran-gonzalezs-projects.vercel.app
  ```
- [x] **Directorio local vinculado:** `.vercel/` creado
- [x] **Variables desarrollo:** `.env.local` descargado automáticamente

### **Añadir Dominio** ✅ CONFIGURADO
- [x] **Comando ejecutado:** `vercel domains add fjgaparicio.es`
- [x] **Resultado:** ✅ Domain added to project profesional-web
- [x] **Nameservers Vercel obtenidos:**
  ```
  - ns1.vercel-dns.com
  - ns2.vercel-dns.com
  ```
- [x] **Estado dominio:** Añadido, configuración DNS pendiente
- [x] **Verificación automática:** Email pending upon DNS completion
- [x] **Opción alternativa A:** A record `fjgaparicio.es` → `76.76.21.21`

---

## 📋 FASE 3: MIGRACIÓN DNS ✅ COMPLETADO (30 min + propagación)

### **Preparación Migración** ✅ VERIFICADO
- [x] **Permisos AWS:** Inicialmente `AccessDeniedException` en usuario `Fran_desarrollador`
- [x] **Permisos otorgados:** Policy `route53domains:UpdateDomainNameservers` añadida
- [x] **Pre-migración verificada:** Nameservers AWS operativos

### **Cambiar Nameservers en AWS** ✅ EJECUTADO
- [x] **Comando:** `aws route53domains update-domain-nameservers`
- [x] **Operación AWS ID:** `745d3f72-901d-4c14-b751-8a5d2d7033b1`
- [x] **Timestamp:** 2025-12-01 15:06:00 CET
- [x] **Estado inicial:** `IN_PROGRESS`
- [x] **Tipo operación:** `UPDATE_NAMESERVER`
- [x] **Nameservers migrados:**
  ```
  FROM (AWS Route 53):
  - ns-1180.awsdns-19.org
  - ns-1563.awsdns-03.co.uk
  - ns-138.awsdns-17.com  
  - ns-800.awsdns-36.net
  
  TO (Vercel DNS):
  - ns1.vercel-dns.com
  - ns2.vercel-dns.com
  ```

### **Propagación DNS** ⏳ EN CURSO
- [x] **Migración iniciada:** ✅ Exitosa
- [ ] **Propagación global:** 15-30 min estimado
- [ ] **TTL original:** 43200s (12h máximo)
- [x] **Monitoreo:** `dig fjgaparicio.es NS` cada 10 min
- [ ] **Target verification:**
  ```bash
  # Cuando complete, debería mostrar:
  fjgaparicio.es. IN NS ns1.vercel-dns.com.
  fjgaparicio.es. IN NS ns2.vercel-dns.com.
  ```

---

## 📋 FASE 4: CONFIGURAR VARIABLES PRODUCCIÓN ⏳ PENDIENTE (10 min)

### **Variables de Entorno Vercel** 
- [ ] **Método:** Vercel CLI o Dashboard
- [ ] **Proyecto vinculado:** ✅ `.vercel/` configurado
- [ ] **Variables desde `.env.example`:**
  ```bash
  # Database
  DATABASE_URL="postgresql://[neon-production-connection]"
  
  # Authentication  
  NEXTAUTH_SECRET="[nuevo-secret-producción-64-chars]"
  NEXTAUTH_URL="https://fjgaparicio.es"
  
  # External Services
  NEXT_PUBLIC_CALENDLY_URL="[tu-url-calendly-real]"
  
  # Optional adicionales según .env.example
  ```
- [ ] **Generar NEXTAUTH_SECRET:**
  ```bash
  openssl rand -base64 48
  # o
  node -e "console.log(require('crypto').randomBytes(48).toString('base64'))"
  ```

### **Deployment con Variables**
- [ ] **Post DNS propagation:** Esperar finalización FASE 3
- [ ] **Redeploy trigger:** Variables aplicadas automáticamente
- [ ] **Verificación:** `vercel env ls` para confirmar variables
- [ ] **Test endpoint:** `https://fjgaparicio.es` con variables aplicadas

---

## 📋 FASE 5: VERIFICACIÓN FINAL ⏳ PENDIENTE (10 min)

### **DNS & SSL Verification**
- [ ] **DNS propagation:**
  ```bash
  dig fjgaparicio.es NS    # → ns1.vercel-dns.com, ns2.vercel-dns.com
  dig fjgaparicio.es A     # → Vercel Edge IPs
  nslookup fjgaparicio.es  # Global DNS check
  ```
- [ ] **SSL Certificate:**
  - [ ] **https://fjgaparicio.es** → 🔒 Vercel SSL (auto-provisioned)
  - [ ] **Certificate issuer:** Let's Encrypt via Vercel
  - [ ] **Certificate validity:** Verificar fecha expiración

### **Functional Testing**
- [ ] **Primary domain:** `https://fjgaparicio.es` loads correctly
- [ ] **WWW redirect:** `https://www.fjgaparicio.es` → `https://fjgaparicio.es`
- [ ] **HTTP redirect:** `http://fjgaparicio.es` → `https://fjgaparicio.es`
- [ ] **Page load performance:** < 3s first contentful paint
- [ ] **Next.js hydration:** Client-side navigation functional

### **DevOps Integration**
- [ ] **GitHub integration:** Push to `main` triggers auto-deploy
- [ ] **Deployment status:** Vercel dashboard shows `Ready`
- [ ] **Environment variables:** All production vars loaded
- [ ] **Monitoring:** Vercel Analytics & Vitals active

### **Rollback Preparedness** 
- [ ] **AWS nameservers documented:** Ready for quick rollback
- [ ] **CloudFront config preserved:** Original setup recoverable
- [ ] **DNS TTL awareness:** 12h max for full rollback propagation

---

## 📊 ESTADO ACTUAL DEL DEPLOYMENT

### ✅ **COMPLETADO**
- [x] **FASE 1:** Backup AWS config vía CLI ✅
- [x] **FASE 2:** Proyecto Vercel importado y dominio añadido ✅  
- [x] **FASE 3:** Migración DNS iniciada (propagación en curso) ⏳
- [ ] **FASE 4:** Variables de entorno producción ⏳
- [ ] **FASE 5:** Verificación final y testing ⏳

### 📈 **PROGRESO**
- **Completado:** 60% (3/5 fases)
- **Tiempo invertido:** ~45 minutos
- **Tiempo restante estimado:** ~25 minutos + propagación DNS

### 🔄 **PRÓXIMOS PASOS INMEDIATOS**
1. **Esperar propagación DNS:** 15-30 min (automático)
2. **Configurar variables entorno:** 10 min (manual)
3. **Verificación final:** 10 min (manual + CLI)
4. **Ejecutar Agent Developer:** Documentación automatizada

### ⚠️ **DEPENDENCIAS ACTIVAS**
- **DNS Propagation:** Operation ID `745d3f72-901d-4c14-b751-8a5d2d7033b1`
- **Vercel Domain:** Email verification pending
- **SSL Certificate:** Auto-provisioning post DNS completion

---
**Status:** 🟡 **IN PROGRESS** - DNS migration active  
**Next:** Monitor propagation → Configure env vars → Final verification  
**Agent Ready:** Post manual completion → Execute FJG-36-prompt-implementacion.md