import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import ChatbotWidget from '@/components/Chatbot/ChatbotWidget';

describe('ChatbotWidget', () => {
  beforeEach(() => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({
      ok: true,
      json: async () => ({ message: 'Respuesta bot de prueba' }),
    }));
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    vi.restoreAllMocks();
  });

  it('renders floating buttons for desktop and mobile in correct positions', () => {
    render(<ChatbotWidget />);

    const buttons = screen.getAllByRole('button', { name: /abrir chatbot/i });
    expect(buttons).toHaveLength(2);

    const desktopButton = buttons[0];
    const mobileButton = buttons[1];

    expect(desktopButton.className).toMatch(/bottom-6/);
    expect(desktopButton.className).toMatch(/right-6/);
    expect(desktopButton.className).toMatch(/hidden/); // desktop only (md:flex)

    expect(mobileButton.className).toMatch(/bottom-6/);
    expect(mobileButton.className).toMatch(/-translate-x-1\/2/);
    expect(mobileButton.className).toMatch(/md:hidden/); // mobile only
  });

  it('opens modal, focuses input, sends message and receives bot reply', async () => {
    render(<ChatbotWidget />);

    const [desktopButton] = screen.getAllByRole('button', { name: /abrir chatbot/i });
    fireEvent.click(desktopButton);

    const input = screen.getByPlaceholderText(/¿en qué puedo ayudarte\?/i);
    expect(input).toHaveFocus();

    fireEvent.change(input, { target: { value: '¿Reducís costes AWS?' } });
    const sendButton = screen.getByRole('button', { name: /enviar mensaje/i });
    fireEvent.click(sendButton);

    expect(await screen.findByText('¿Reducís costes AWS?')).toBeInTheDocument();

    await waitFor(() => {
      const bubbles = screen.getAllByTestId('message-bubble');
      expect(bubbles.length).toBeGreaterThan(1);
    }, { timeout: 3000 });
  });

  it('closes modal with close button', async () => {
    render(<ChatbotWidget />);

    const [desktopButton] = screen.getAllByRole('button', { name: /abrir chatbot/i });
    fireEvent.click(desktopButton);

    const closeButtons = await screen.findAllByRole('button', { name: /cerrar chatbot/i });
    fireEvent.click(closeButtons[0]);

    await waitFor(() => {
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });
  });
});
