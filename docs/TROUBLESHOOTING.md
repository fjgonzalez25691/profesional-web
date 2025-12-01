# TROUBLESHOOTING - Problemas Conocidos y Soluciones

## Vercel Framework Preset Incorrecto

### Problema
Al hacer deploy en Vercel, el sitio genera solo archivos SVG sin páginas HTML, causando 404 en todas las rutas.

### Síntomas
- Build exitoso en Vercel (tiempo muy rápido ~63ms)
- Solo archivos SVG en output del build
- Navegación a la web muestra 404
- DNS correcto pero contenido no disponible

### Causa Raíz
**Framework Preset configurado como "Other" en lugar de "Next.js"** en el dashboard de Vercel.

### Solución
1. **Dashboard Vercel** → Settings → General → Framework Preset
2. Cambiar de `"Other"` → `"Next.js"`
3. **Opcional**: Configurar Root Directory como `profesional-web` si el proyecto está en subdirectorio
4. **Deploy manual** desde dashboard para aplicar cambios

### Root Directory
Si el proyecto Next.js está en un subdirectorio:
```
Root Directory: profesional-web
Build Command: npm run build  
Install Command: npm install
```

### Prevención
- **Siempre verificar** Framework Preset al crear proyecto Vercel
- **Documentar** estructura de directorios del monorepo
- **Validar output** del build antes de considerar DNS issues

### Archivos Relacionados
- `.vercel/project.json`: Configuración local del proyecto
- `vercel.json`: Configuración de build (opcional)

### Referencias
- Fecha Issue: FJG-36 (1 dic 2025)
- Tiempo resolución: ~2 horas de debugging
- Impact: Deploy bloqueado hasta corrección manual dashboard

---

*Actualizado: 1 de diciembre de 2025*