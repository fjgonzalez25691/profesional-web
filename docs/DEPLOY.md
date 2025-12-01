# Guía de Despliegue: Profesional Web

Este documento detalla el proceso de despliegue del proyecto `profesional-web` en la plataforma Vercel.

## 1. Arquitectura de Despliegue
El proyecto utiliza **Next.js App Router** y se despliega como una aplicación serverless en **Vercel**.

*   **Dominio:** `fjgaparicio.es`
*   **Base de Datos:** Neon PostgreSQL (Serverless)
*   **Repositorio:** GitHub (`fjgonzalez25691/profesional-web`)
*   **Rama de Producción:** `main`

## 2. Configuración en Vercel
El proyecto debe configurarse en Vercel con los siguientes parámetros:

*   **Framework Preset:** Next.js
*   **Root Directory:** `profesional-web` (Importante: El `package.json` no está en la raíz del repo)
*   **Build Command:** `next build` (o `npm run build`)
*   **Install Command:** `npm install`
*   **Output Directory:** `.next`

## 3. Variables de Entorno (Producción)
Las siguientes variables deben configurarse en el panel de Vercel (**Settings** -> **Environment Variables**):

| Variable | Descripción | Ejemplo / Valor |
| :--- | :--- | :--- |
| `DATABASE_URL` | Connection string Neon (Pooling) | `postgres://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` |
| `DIRECT_URL` | Connection string Neon (Direct) | `postgres://user:pass@ep-xyz.neon.tech/neondb?sslmode=require` |
| `NEXTAUTH_SECRET` | Secreto para NextAuth | Generar con `openssl rand -base64 32` |
| `NEXTAUTH_URL` | URL canónica de la app | `https://fjgaparicio.es` |
| `NEXT_PUBLIC_CALENDLY_URL` | URL pública de Calendly | `https://calendly.com/tu-usuario` |
| `NODE_ENV` | Entorno de ejecución | `production` |

## 4. Configuración DNS
El dominio `fjgaparicio.es` está gestionado por los nameservers de Vercel para optimizar la entrega y gestión de SSL.

*   **Nameservers:** Verificar en Vercel Domains (ej. `ns1.vercel-dns.com`, `ns2.vercel-dns.com`).
*   **SSL:** Let's Encrypt (Automático).
*   **Redirecciones:** Vercel maneja automáticamente `http` -> `https` y `www` <-> `apex` según configuración.

## 5. Verificación Post-Despliegue
Para validar que el despliegue ha sido exitoso y el DNS se ha propagado correctamente, ejecutar el script de verificación:

```bash
./scripts/verify-deploy.sh
```

Este script verifica:
1.  Respuesta HTTP 200 OK en dominio principal y www.
2.  Redirección forzada a HTTPS.
3.  Presencia de contenido esperado ("Profesional Web").
4.  Validez del certificado SSL.

## 6. Rollback
En caso de error crítico en producción:
1.  **Vercel:** Usar la función "Instant Rollback" en el dashboard de Deployments para volver a una versión anterior estable.
2.  **DNS:** Si el problema es de DNS/Migración, consultar `docs/AWS_BACKUP.md` para restaurar la configuración de Route 53.
