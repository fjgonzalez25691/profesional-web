# Protocolo de Verificación de Despliegue (FJG-36)

Este documento registra las pruebas de verificación realizadas para validar el despliegue de `fjgaparicio.es` en Vercel.

## Herramientas
* Script automático: `scripts/verify-deploy.sh`
* Comandos manuales: `curl`, `dig`, `openssl`

## Checklist de Validación

### 1. Conectividad DNS
* [ ] `dig fjgaparicio.es NS` devuelve nameservers de Vercel.
* [ ] `dig fjgaparicio.es A` devuelve IPs de Vercel (76.76.21.21).

### 2. Seguridad (SSL/TLS)
* [ ] Certificado válido emitido por Let's Encrypt.
* [ ] Protocolo HTTPS forzado (HTTP redirige a HTTPS).

### 3. Funcionalidad Web
* [ ] Carga de página de inicio (Status 200).
* [ ] Assets estáticos (CSS, JS, Imágenes) cargan correctamente (Status 200).
* [ ] Redirección www -> non-www (o viceversa) operativa.

### 4. Aplicación
* [ ] Conexión a base de datos Neon exitosa (verificar logs de servidor si es necesario, o funcionalidad de página).
* [ ] Variables de entorno cargadas correctamente.

## Ejecución del Script de Verificación
```bash
./scripts/verify-deploy.sh
```

### Resultado Esperado
```text
1️⃣  Verificando accesibilidad HTTPS...
   Checking https://fjgaparicio.es... ✅ OK (200)
   Checking https://www.fjgaparicio.es... ✅ OK (200)
2️⃣  Verificando forzado de SSL...
   Checking HTTP -> HTTPS redirect for http://fjgaparicio.es... ✅ OK (Redirects to HTTPS)
   Checking HTTP -> HTTPS redirect for http://www.fjgaparicio.es... ✅ OK (Redirects to HTTPS)
3️⃣  Verificando contenido de la página...
   ✅ Contenido verificado: Se encontró 'Profesional Web'
4️⃣  Verificando certificado SSL...
   ✅ Certificado SSL válido. Expira: [Fecha]
```
