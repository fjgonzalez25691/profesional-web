# Profesional Web - Tarjeta de Visita P&L

[![CI](https://github.com/fjgonzalez25691/profesional-web/actions/workflows/ci.yml/badge.svg)](https://github.com/fjgonzalez25691/profesional-web/actions/workflows/ci.yml)

Landing de diagnóstico rápido construida con Next.js 16, TypeScript estricto y Neon PostgreSQL.

## 🛠️ Stack Tecnológico
- **Framework:** [Next.js 16](https://nextjs.org) (App Router)
- **Lenguaje:** [TypeScript](https://www.typescriptlang.org/) (strict)
- **Estilos:** [Tailwind CSS](https://tailwindcss.com/) + [Shadcn/ui](https://ui.shadcn.com/)
- **Base de Datos:** [Neon PostgreSQL](https://neon.tech/) vía `@neondatabase/serverless`
- **Testing:** [Vitest](https://vitest.dev/) + [React Testing Library](https://testing-library.com/)
- **Iconos:** [Lucide React](https://lucide.dev/)
- **Agenda:** [React Calendly](https://www.npmjs.com/package/react-calendly)

## 🚀 Comandos de Desarrollo
```bash
npm install          # Instalar dependencias
npm run dev          # Servidor de desarrollo (http://localhost:3000)
npm run lint         # ESLint (ignora coverage/)
npm run typecheck    # TypeScript sin emitir
npm test             # Tests unitarios/integración con Vitest
npm run test:watch   # Tests en modo watch
npm run test:coverage# Cobertura
npm run build        # Build de producción
npm start            # Servir build
```

## 🌍 Variables de Entorno
Copia `.env.example` a `.env.local` y rellena las variables:

- `DATABASE_URL`, `DIRECT_URL` (Neon PostgreSQL)
- `NEXTAUTH_SECRET`, `NEXTAUTH_URL` (auth base)
- `NEXT_PUBLIC_CALENDLY_URL` (URL pública de agenda)

## 📂 Estructura del Proyecto
```
profesional-web/
├── __tests__/             # Tests unitarios y de integración
├── app/                   # Next.js App Router
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página inicial (landing)
│   └── globals.css        # Estilos globales (Tailwind 4)
├── lib/
│   ├── db.ts              # Cliente Neon PostgreSQL
│   └── utils.ts           # Utilidades (cn helper)
├── public/                # Archivos estáticos
├── .env.example           # Plantilla de variables de entorno
├── components.json        # Configuración Shadcn/ui
└── vitest.config.mts      # Configuración de Vitest
```

## 🚀 Despliegue
El proyecto se despliega automáticamente en **Vercel** al hacer push a `main`.

- **URL Producción:** [https://fjgaparicio.es](https://fjgaparicio.es)
- **Guía de Despliegue:** Consultar `../docs/DEPLOY.md` para detalles de configuración y variables de entorno.

## 📄 Licencia
Privado.
