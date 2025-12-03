import { CHATBOT_SYSTEM_PROMPT } from '@/prompts/chatbot-system';
import { CASOS_MVP } from '@/data/cases';

describe('chatbot system prompt', () => {
  it('includes cases from CASOS_MVP', () => {
    expect(CHATBOT_SYSTEM_PROMPT).toContain(CASOS_MVP[0].sector);
    expect(CHATBOT_SYSTEM_PROMPT).toContain(CASOS_MVP[1].sector);
  });

  it('contains guardrails and CTA', () => {
    expect(CHATBOT_SYSTEM_PROMPT).toMatch(/estimaciones orientativas/i);
    expect(CHATBOT_SYSTEM_PROMPT).toMatch(/sesión de 30 minutos/i);
  });
});
