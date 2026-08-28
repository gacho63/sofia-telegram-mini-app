const MINI_APP_URL = 'https://sofia-latam-academy.ggter545.chatgpt.site/';

type TelegramUpdate = {
  message?: {
    text?: string;
    chat?: { id?: number };
    from?: { first_name?: string };
  };
};

async function sendWelcome(chatId: number, firstName: string) {
  const token = process.env.TELEGRAM_BOT_TOKEN;
  if (!token) throw new Error('Telegram bot token is not configured');

  const name = firstName.replace(/[<>]/g, '').slice(0, 40) || 'amigo';
  const text = [
    `Hola, <b>${name}</b> 👋`,
    '',
    'Soy <b>Sofía López</b>, tu mentora de trading paso a paso.',
    '',
    'Dentro de la aplicación podrás:',
    '• ver señales en modo demo;',
    '• entender la dirección y el momento de entrada;',
    '• aprender con explicaciones sencillas;',
    '• seguir tu progreso.',
    '',
    'Pulsa el botón para activar tu acceso gratuito 👇',
  ].join('\n');

  const response = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({
      chat_id: chatId,
      text,
      parse_mode: 'HTML',
      reply_markup: {
        inline_keyboard: [
          [{ text: '🚀 Abrir Sofía — Señales', web_app: { url: MINI_APP_URL } }],
          [{ text: '💬 Hablar con Sofía', url: 'https://t.me/SofaLopez' }],
        ],
      },
    }),
  });

  if (!response.ok) throw new Error(`Telegram sendMessage failed: ${response.status}`);
}

export async function POST(request: Request) {
  const expectedSecret = process.env.TELEGRAM_WEBHOOK_SECRET;
  const providedSecret = request.headers.get('x-telegram-bot-api-secret-token');
  if (!expectedSecret || providedSecret !== expectedSecret) {
    return Response.json({ ok: false }, { status: 401 });
  }

  const update = await request.json() as TelegramUpdate;
  const chatId = update.message?.chat?.id;
  if (!chatId) return Response.json({ ok: true });

  await sendWelcome(chatId, update.message?.from?.first_name || 'amigo');

  return Response.json({ ok: true });
}

export async function GET() {
  return Response.json({ ok: true, service: 'sofia-telegram-bot' });
}
