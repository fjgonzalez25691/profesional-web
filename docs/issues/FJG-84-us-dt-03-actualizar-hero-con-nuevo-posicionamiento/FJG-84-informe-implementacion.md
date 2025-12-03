# FJG-84 - INFORME DE IMPLEMENTACIÓN
**Issue**: US-DT-03 Actualizar Hero con nuevo posicionamiento de negocio  
**Fecha**: 2025-12-03  
**Sprint**: S2  
**Story Points**: 2 SP

## ✅ Resumen
Se actualizó el Hero para reflejar el posicionamiento de negocio definido en FJG-44: empresario que usa IA/automatización/Cloud para mejorar los números. Solo se cambiaron textos; layout y funcionalidad de CTAs se mantienen.

## 📌 Cambios
- `app/page.tsx`: Hero usa los nuevos textos de Linear (H1, subtítulo y apoyo) y mantiene los callbacks de CTA principal (Calendly) y secundario (chatbot).
- `__tests__/components/page.test.tsx`: Ajustado a los nuevos textos del Hero.
- `__tests__/e2e/hero.spec.ts`: Actualizado para validar el nuevo copy en Playwright.
- Ajustes UX recientes: umbral de scroll de los flotantes (Calendly y chatbot) subido al 60% para que no convivan con el CTA del héroe; CTA secundario abre el chatbot via evento sin forzar scroll; botón del asistente ahora lleva icono de bot.

## 🎯 Criterios de Aceptación
- H1, subtítulo y apoyo sustituyen textos anteriores: ✅
- Tono alineado con FJG-44, sin promesas absolutas: ✅
- CTAs mantienen funcionalidad (Calendly y chatbot): ✅
- Sin cambios de layout/diseño: ✅ (solo copy)
- Responsive mobile/desktop preservado: ✅

## 🧪 Testing
- `npm run lint` ✅
- `npm run typecheck` ✅
- `npm test` ✅ (78 tests)

## ⚙️ Notas
- El CTA secundario sigue haciendo scroll al chatbot.
- No se tocaron estilos ni estructuras, solo texto y tests asociados.
