# 🔧 Deuda Técnica - FJGaparicio.es

*Última actualización: 9 diciembre 2025*

---

## 🚨 Deuda Técnica Crítica

### 🧮 Calculadora ROI - Modelo No Viable (9 dic 2025)
**Estado**: Movida a `/admin/calculadora` (acceso restringido)

**Problema**: El modelo actual de la calculadora genera ROI poco realistas o negativos que no reflejan valor para el usuario:
- Ahorro cloud progresivo 6-12% resulta en ROI negativos frecuentes
- Inversión como % facturación (0.3-0.6%) genera cifras muy altas
- Ejemplo: 10-25M + 8K cloud/mes → ROI -59% (no viable para presentar al cliente)

**Decisión**: Calculadora movida a área admin protegida hasta rediseño del modelo

**Acciones Tomadas** (sin issue asociada):
- ✅ Ruta `/calculadora` → `/admin/calculadora`
- ✅ Protección con middleware + cookie auth `admin_auth`
- ✅ Dashboard admin en `/admin` con links a Leads y Calculadora
- ✅ Eliminada del sitemap público
- ✅ Metadata `noindex,nofollow`

**Siguiente Paso**: Requiere rediseño completo del modelo ROI antes de volver a hacer pública

---

## 🎯 Instrumentación y Métricas

### 📊 Métricas de Engagement Pendientes
- [ ] **Scroll tracking**: Profundidad de scroll por página (25%, 50%, 75%, 100%)
- [ ] **Time on page**: Duración media de permanencia  
- [ ] **Click tracking**: Botones CTA y elementos interactivos
- [ ] **Viewport metrics**: Tiempo visible en viewport
- [ ] **Exit points**: Dónde abandonan los usuarios
- [ ] **Heatmap tracking**: Mapas de calor de interacción
- [ ] **Form analytics**: Abandono en formularios

### 📈 Analytics Implementation
```typescript
// TODO: Implementar hook de tracking de scroll
const { metrics, trackCTAClick, trackElementView } = useScrollTracking({
  trackingPoints: [25, 50, 75, 100],
  enableAnalytics: process.env.NODE_ENV === 'production'
});

// TODO: Implementar tracking de intersección
const { isVisible, hasBeenVisible } = useIntersectionTracking(elementRef);

// TODO: Implementar heatmaps
const trackClickHeatmap = (element: string, x: number, y: number) => {
  // Track user interactions
}
```

---

## 🏗️ Arquitectura y Performance

### ⚡ Optimizaciones Pendientes
- [ ] **Image optimization**: WebP + lazy loading automático
- [ ] **Font preloading**: Inter font con display:swap
- [ ] **Bundle analysis**: Tree shaking y code splitting
- [ ] **Service Worker**: Cache estratégico para assets
- [ ] **Critical CSS**: Above-the-fold inlining

### 🎨 UX/UI Improvements
- [ ] **Loading states**: Skeletons para Calendly modal
- [ ] **Error boundaries**: Fallbacks elegantes
- [ ] **Focus management**: Keyboard navigation
- [ ] **Motion preferences**: Respect prefers-reduced-motion
- [ ] **Dark mode**: Sistema de temas automático

---

## 🧪 Testing y QA

### 🔬 Coverage Gaps
- [ ] **Scroll tracking tests**: Pruebas para hook de métricas
- [ ] **E2E testing**: Playwright para flujos críticos
- [ ] **Performance tests**: Core Web Vitals automation
- [ ] **Accessibility testing**: axe-core integration
- [ ] **Visual regression**: Chromatic o similar
- [ ] **Mobile testing**: Device farm real

### 🛡️ Security Audit
- [ ] **Dependency audit**: npm audit + Snyk
- [ ] **CSP headers**: Content Security Policy estricta
- [ ] **Rate limiting**: API protection
- [ ] **Input validation**: Formularios sanitizados
- [ ] **OWASP compliance**: Top 10 vulnerabilities

---

## 🌐 SEO y Marketing

### 🔍 SEO Technical
- [ ] **Structured data**: JSON-LD para servicios
- [ ] **Meta tags**: Dynamic OG + Twitter cards  
- [ ] **Sitemap**: Auto-generated XML + robots.txt
- [ ] **Core Web Vitals**: Optimización automática
- [ ] **Local SEO**: Schema.org para negocio local

### 📱 Conversion Optimization  
- [ ] **A/B testing**: Variants para CTAs
- [ ] **Funnel analysis**: Conversion tracking
- [ ] **Form optimization**: Multi-step vs single
- [ ] **Social proof**: Testimonials dinámicos
- [ ] **Urgency elements**: Scarcity indicators

---

## 🚀 Deployment y DevOps

### ⚙️ CI/CD Improvements
- [ ] **Preview deployments**: Branch-based testing
- [ ] **Automated testing**: Pre-deploy validation
- [ ] **Performance budgets**: Bundle size limits
- [ ] **Lighthouse CI**: Automated auditing
- [ ] **Security scanning**: Automated vulnerability checks

### 📊 Monitoring
- [ ] **Real User Monitoring**: Sentry + performance
- [ ] **Uptime monitoring**: Status page automation  
- [ ] **Error tracking**: Alert thresholds
- [ ] **Business metrics**: Revenue attribution
- [ ] **Cost monitoring**: Vercel usage optimization

---

## 📋 Priorización (Q1 2026)

### 🔥 Critical (Sprint 1-2)
1. **Scroll tracking** + **Time on page** (Analytics base - Nueva tarea)
2. **Image optimization** (Performance impacto)  
3. **E2E testing** (Quality gates)
4. **Exit points tracking** (Analytics completar)

### ⚡ High (Sprint 3-4)  
1. **Bundle analysis** + **Code splitting**
2. **Structured data** (SEO foundation)
3. **Error boundaries** + **Loading states**

### 📈 Medium (Q2 2026)
1. **A/B testing** infrastructure
2. **Service Worker** + **Offline support**
3. **Security audit** completo

---

## 💡 Ideas Innovadoras

### 🤖 AI/ML Integration
- [ ] **Chatbot inteligente**: Pre-qualification leads
- [ ] **Dynamic pricing**: Demand-based recommendations  
- [ ] **Content personalization**: Industry-specific messaging
- [ ] **Predictive analytics**: Churn prevention

### 🎯 Advanced Features
- [ ] **Progressive Web App**: Install prompt
- [ ] **WebRTC integration**: Video calls directas
- [ ] **Real-time collaboration**: Shared documents
- [ ] **Gamification**: Engagement rewards

---

## 🆕 Nueva Tarea: FJG-XX - Instrumentación Métricas Scroll/Engagement

### 🎯 Objetivo
Implementar sistema completo de tracking de engagement y comportamiento de usuarios para optimizar conversiones.

### 📋 Tareas Específicas
1. **Hook useScrollTracking**: 
   - Tracking profundidad scroll (25%, 50%, 75%, 100%)
   - Tiempo en página con throttling
   - Eventos de scroll con debounce
   - Visibilidad de página (hidden/visible)

2. **Hook useIntersectionTracking**:
   - Detectar elementos en viewport
   - Timing de visibilidad por sección
   - Threshold configurable

3. **Implementación en componentes**:
   - Hero: Tracking CTA clicks con contexto
   - PainPoints: Tiempo de visualización
   - Footer: Engagement con links legales

4. **Analytics Integration**:
   - Google Analytics 4 events
   - Console logs para desarrollo
   - Environment-based enabling

5. **Panel Debug (development)**:
   - Métricas en tiempo real
   - Visual feedback para desarrollo
   - Overlay no intrusivo

### 🧪 Testing Requirements
- Unit tests para hooks
- Mock IntersectionObserver
- Timer mocking para throttling
- Event simulation para scroll

### 📊 Success Metrics
- Reducción bounce rate >15%
- Aumento tiempo promedio en página >30s  
- CTR Hero button >5%
- Scroll depth promedio >60%

---

*Documento vivo - Se actualiza con cada sprint*