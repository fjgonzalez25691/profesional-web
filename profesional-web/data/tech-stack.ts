export type TechItem = {
  name: string;
  purpose: string;
};

export type TechStack = {
  frontend: TechItem[];
  backend: TechItem[];
  infra: TechItem[];
  analytics: TechItem[];
};

export const TECH_STACK_MVP: TechStack = {
  frontend: [
    { name: 'Next.js 15', purpose: 'App Router SSR' },
    { name: 'React 19', purpose: 'UI Components' },
    { name: 'TypeScript', purpose: 'Type Safety' },
    { name: 'Tailwind CSS', purpose: 'Styling' },
    { name: 'Shadcn/ui', purpose: 'Component Library' },
  ],
  backend: [
    { name: 'Next.js API Routes', purpose: 'Serverless APIs' },
    { name: 'Neon Postgres', purpose: 'Database' },
    { name: 'Groq (Llama 3.3)', purpose: 'Chatbot IA' },
    { name: 'Resend', purpose: 'Transactional Email' },
  ],
  infra: [
    { name: 'Vercel', purpose: 'Deploy + CDN' },
    { name: 'GitHub Actions', purpose: 'CI/CD' },
    { name: 'Vercel Cron', purpose: 'Email Nurturing' },
  ],
  analytics: [
    { name: 'Vercel Analytics', purpose: 'Performance' },
    { name: 'Neon Logs', purpose: 'Leads + Chat' },
  ],
};
