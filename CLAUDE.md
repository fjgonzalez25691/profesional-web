# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

**Profesional Web** - Professional landing page for B2B lead generation targeting industrial/logistics companies (5-50M€ revenue). The project demonstrates Cloud & AI expertise while generating real business value through an ROI calculator, AI chatbot, and appointment booking system.

**Production URL:** https://fjgaparicio.es

## Critical Workflow Rules

### Agent-Based Development System

This repository uses a **strict agent-based workflow** with three roles defined in `.prompts/CONSTITUCION.md` and `.prompts/ROLES.md`:

1. **Agent Manager** - Orchestration, planning, and state management
2. **Agent Developer** - TDD implementation only
3. **Agent Reviewer** - Quality assurance (read-only)

**MANDATORY PRE-WORK VERIFICATION:**
- **ALWAYS** read the Linear issue (FJG-XX) using `mcp_linear_get_issue` before starting any task
- Compare Linear specs (Acceptance Criteria + DoD) against any prompts or instructions
- If discrepancies exist between Linear and instructions: **STOP and ask the user**
- NEVER invent requirements or modify scope without explicit approval

### Hierarchy of Truth (in order of priority)

1. **User (Fran)** - Current conversation takes precedence
2. **Linear Issue FJG-XX** - Acceptance Criteria (Gherkin) + Definition of Done
3. **Project State** - `docs/ESTADO_PROYECTO.md` and `docs/issues/FJG-XX-*/`
4. **Constitution** - `.prompts/CONSTITUCION.md`
5. **Generated Prompts** - System prompts, sub-prompts

### Git Operations - MANDATORY CLI Usage

- **REQUIRED:** Use `run_in_terminal` for all git operations (`git add`, `git commit`, `gh pr create`)
- **PROHIBITED:** GitKraken MCP tools (mcp_gitkraken_*) or GUI tools
- **Commits:** Spanish language, no emojis, conventional commits format
- **See:** `docs/GIT_FLOW_COMMITS.md` for commit message guidelines

### Core Principles

- **Human-in-the-loop:** Always get approval before commits/pushes
- **Ockham's Razor:** Simplicity first - no new files/folders/services without necessity
- **TDD/BDD:** Tests first for P0/P1 tasks, inspired by Acceptance Criteria
- **Maintainability:** Code must be maintainable by one person (<4h/month)

## Development Commands

**All commands must be run from the `profesional-web/` directory:**

```bash
# Development
npm install              # Install dependencies
npm run dev              # Start dev server (http://localhost:3000)

# Code Quality
npm run lint             # ESLint
npm run typecheck        # TypeScript type checking (no emit)

# Testing
npm test                 # Unit/integration tests (Vitest)
npm run test:watch       # Tests in watch mode
npm run test:coverage    # Coverage report
npm run test:e2e         # Playwright E2E tests
npm run test:e2e:ui      # Playwright UI mode
npm run test:e2e:report  # View last E2E report

# Build
npm run build            # Production build (--webpack flag for compatibility)
npm start                # Serve production build
```

## Architecture Overview

### Stack
- **Frontend:** Next.js 16 (App Router) + React 19 + TypeScript (strict mode)
- **Styling:** Tailwind CSS 4 + Shadcn/ui (New York style)
- **Database:** Neon PostgreSQL (serverless)
- **AI:** Groq SDK for chatbot (streaming responses)
- **Email:** Resend for ROI calculator results
- **Testing:** Vitest + Testing Library + Playwright
- **CI/CD:** GitHub Actions → Vercel deployment

### Project Structure

```
profesional-web/
├── app/                          # Next.js App Router
│   ├── page.tsx                  # Landing page (Hero + PainPoints + CaseGrid)
│   ├── layout.tsx                # Root layout with Footer
│   ├── api/                      # API Routes
│   │   ├── chat/route.ts         # Chatbot endpoint (Groq streaming)
│   │   ├── send-roi-email/       # ROI calculator email endpoint
│   │   └── leads/route.ts        # Lead capture endpoint
│   ├── calculadora/page.tsx      # ROI Calculator page
│   ├── admin/page.tsx            # Admin dashboard (leads)
│   └── legal/                    # GDPR pages (aviso-legal, privacidad)
├── components/
│   ├── Hero.tsx                  # P&L-focused hero section
│   ├── PainPoints.tsx            # Quantified pain points
│   ├── CaseGrid.tsx              # ROI case studies
│   ├── CalendlyModal.tsx         # Appointment booking modal
│   ├── FloatingCalendlyButton.tsx # Floating CTA button
│   ├── Chatbot/                  # AI chatbot widget
│   ├── calculator/               # ROI calculator components
│   └── ui/                       # Shadcn/ui base components
├── lib/
│   ├── calculator/               # ROI calculation logic by pain type
│   │   ├── core.ts              # Common logic (revenue/investment by size)
│   │   ├── cloud.ts             # Cloud cost optimization
│   │   ├── manual.ts            # Manual process automation
│   │   ├── forecast.ts          # Demand forecasting
│   │   └── inventory.ts         # Inventory optimization
│   ├── validation/              # Zod schemas for all inputs
│   ├── analytics.ts             # Conversion tracking (CTA, Calendly)
│   ├── chat-logger.ts           # Postgres logging for chatbot
│   ├── groq.ts                  # Groq client configuration
│   ├── rate-limit.ts            # Rate limiting (Vercel KV)
│   └── db.ts                    # Neon PostgreSQL client
├── data/
│   └── cases.ts                 # Case study data (ROI examples)
├── __tests__/                   # Test suite (120+ tests)
│   ├── components/              # Component tests
│   ├── calculator/              # ROI calculator tests
│   ├── api/                     # API route tests
│   └── e2e/                     # Playwright E2E tests
└── migrations/                  # Database migrations
```

### Key Implementation Details

**ROI Calculator Architecture:**
- Business logic in `lib/calculator/` modules (pure functions)
- Each pain type (cloud, manual, forecast, inventory) has dedicated module
- Common logic (revenue/investment scaling) in `core.ts`
- Conservative assumptions: 27.5% cloud savings, capped ROI >1000%
- Input validation via Zod schemas in `lib/validation/`
- Results sent via email (Resend + Handlebars templates)

**AI Chatbot:**
- Groq SDK with streaming responses
- Prompt engineering WITHOUT RAG (guardrails in system prompt)
- Conversation logging to Postgres (`lib/chat-logger.ts`)
- Rate limiting via Vercel KV
- Legal guardrails + timeout protection

**Testing Strategy:**
- Unit tests for all calculator modules (100% coverage)
- Component tests with Testing Library
- E2E tests with Playwright (desktop + mobile)
- Test location: `__tests__/` with mirrors of source structure

**Analytics & Tracking:**
- Custom events: `cta_click`, `calendly_booking_completed`
- Production-only, no PII
- Implementation: `lib/analytics.ts`

## Environment Variables

Required in `.env.local`:

```bash
# Database (Neon PostgreSQL)
DATABASE_URL=                    # Pooled connection
DIRECT_URL=                      # Direct connection for migrations

# Authentication
NEXTAUTH_SECRET=                 # Random string for session encryption
NEXTAUTH_URL=http://localhost:3000

# Integrations
NEXT_PUBLIC_CALENDLY_URL=        # Public Calendly scheduling URL
GROQ_API_KEY=                    # Groq API key for chatbot
RESEND_API_KEY=                  # Resend for email sending

# Rate Limiting (Vercel KV)
KV_URL=
KV_REST_API_URL=
KV_REST_API_TOKEN=
KV_REST_API_READ_ONLY_TOKEN=
```

## Conventions

**Language:**
- Code (variables, functions, components): **English**
- Documentation, comments: **Spanish**
- Git commits: **Spanish**, conventional commits format

**Naming:**
- React components: `PascalCase`
- Props, variables: `camelCase`
- CSS utility: `cn()` helper for class merging (Tailwind + clsx)

**Code Style:**
- TypeScript strict mode enabled
- Path aliases: `@/*` maps to project root
- No semicolons (ESLint Next.js config)

## Common Patterns

**Adding a new API route:**
1. Create route in `app/api/[name]/route.ts`
2. Add Zod validation schema in `lib/validation/`
3. Write tests in `__tests__/api/[name]/`
4. Update `docs/ESTADO_PROYECTO.md` when complete

**Adding ROI calculator pain type:**
1. Create module in `lib/calculator/[type].ts`
2. Export `calculate[Type]ROI()` function
3. Add validation schema in `lib/validation/calculator/`
4. Write comprehensive tests in `__tests__/calculator/`
5. Integrate in calculator UI components

**Modifying database schema:**
1. Create migration in `migrations/`
2. Test with direct connection (`DIRECT_URL`)
3. Update types in relevant lib files
4. Add tests for new schema

## Testing Guidelines

**Run tests before any PR:**
```bash
npm run typecheck   # Must pass
npm run lint        # Must pass
npm test            # All tests must pass
npm run build       # Must complete successfully
```

**Writing tests:**
- Test file location mirrors source: `__tests__/components/Hero.test.tsx` for `components/Hero.tsx`
- Use Vitest globals (describe, it, expect)
- Component tests: render + user interactions + assertions
- API tests: mock external services (Groq, Resend, DB)
- E2E tests: critical user flows only (booking, calculator submission)

## CI/CD Pipeline

GitHub Actions workflow (`.github/workflows/ci.yml`):
1. Lint
2. Type check
3. Run tests with coverage
4. Build

**On merge to main:** Automatic Vercel deployment

## Documentation

**Always update when completing a task:**
- `docs/ESTADO_PROYECTO.md` - Current sprint status, completed issues
- `docs/issues/FJG-XX-*/` - Issue-specific documentation (if Agent Manager creates it)

**Reference documentation:**
- `docs/CALCULADORA_ROI.md` - ROI calculator business logic
- `docs/DEPLOY.md` - Deployment configuration
- `docs/DEUDA_TECNICA.md` - Technical debt tracking
- `docs/GIT_FLOW_COMMITS.md` - Git workflow and commit format
- `lib/analytics.md` - Analytics implementation guide

## Issue Workflow

When assigned an issue (e.g., "Work on FJG-XX"):

1. **Read Linear issue** via `mcp_linear_get_issue` tool
2. **Verify specifications** match instructions received
3. **If conflict:** Stop and ask user for clarification
4. **Plan with TDD:** Tests first, then implementation
5. **Run full test suite** before marking complete
6. **Update docs:** `ESTADO_PROYECTO.md` and issue folder if exists
7. **Create PR:** Following conventional commits format (Spanish)

## Anti-Patterns to Avoid

- ❌ Creating new files without checking if existing ones can be reused
- ❌ Adding enterprise patterns for simple problems
- ❌ Committing without explicit user approval
- ❌ Modifying Linear issue specs or inventing requirements
- ❌ Using GitKraken MCP tools instead of terminal commands
- ❌ Over-engineering solutions beyond stated requirements
- ❌ Adding error handling for impossible scenarios
- ❌ Creating abstractions for one-time operations

## Production Checklist

Before any production deployment:
- [ ] All tests passing (unit + E2E)
- [ ] TypeScript checks clean
- [ ] ESLint warnings resolved
- [ ] Build completes successfully
- [ ] Environment variables configured in Vercel
- [ ] Database migrations applied
- [ ] GDPR compliance verified (legal pages up-to-date)
- [ ] Analytics tracking tested in production mode

---

🔧 Para instrucciones funcionales activas de los agentes (Constitución, Roles y estado del proyecto), consulta el archivo centralizado [`AGENTS.md`](./AGENTS.md).

