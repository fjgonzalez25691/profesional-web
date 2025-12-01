# Backup Configuración AWS Route 53

**Fecha de Backup:** [DD/MM/AAAA]
**Dominio:** fjgaparicio.es
**Responsable:** [Nombre del Responsable]

## 1. Nameservers Originales (AWS)
Antes de cambiar a Vercel, los nameservers de AWS Route 53 eran:
1. `ns-xxxx.awsdns-xx.org`
2. `ns-xxxx.awsdns-xx.co.uk`
3. `ns-xxxx.awsdns-xx.com`
4. `ns-xxxx.awsdns-xx.net`

*(Rellenar con los valores reales obtenidos de la consola de AWS Route 53)*

## 2. Registros DNS Críticos (Snapshot)
Listado de registros A, CNAME, MX, TXT que existían antes de la migración.

| Tipo | Nombre | Valor/Destino | TTL | Propósito |
| :--- | :--- | :--- | :--- | :--- |
| A | fjgaparicio.es | [IP AWS] | 300 | Hosting S3 (antiguo) |
| CNAME | www.fjgaparicio.es | fjgaparicio.es | 300 | Redirect www |
| MX | fjgaparicio.es | [Valores MX] | 3600 | Correo (si aplica) |
| TXT | fjgaparicio.es | [Valores TXT] | 3600 | Verificación dominio |

*(Adjuntar captura de pantalla de la consola de Route 53 si es posible)*

## 3. Configuración S3 (Static Hosting)
Si el dominio apuntaba a un bucket S3:
- **Bucket Name:** [Nombre del bucket]
- **Region:** [Región AWS]
- **Endpoint:** [Endpoint S3 website]

## 4. Procedimiento de Rollback (Emergencia)
En caso de fallo crítico con Vercel:

1.  Acceder a la consola de **AWS Route 53**.
2.  Ir a **Hosted Zones** -> `fjgaparicio.es`.
3.  Restaurar los **Nameservers (NS)** a los valores originales listados en la sección 1.
    *   *Nota: Esto puede tardar hasta 48h en propagarse globalmente, pero suele ser rápido.*
4.  Verificar que los registros A/CNAME apunten de nuevo a la infraestructura AWS (S3/CloudFront).
5.  Validar accesibilidad usando `dig fjgaparicio.es @ns-xxxx.awsdns-xx.org`.
