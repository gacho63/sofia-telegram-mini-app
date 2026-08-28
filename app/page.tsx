'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { type AppLanguage, translateToSpanish } from './i18n';

type Tab = 'home' | 'progress' | 'signals' | 'support' | 'academy';
type Pair = 'EURUSD' | 'GBPUSD' | 'USDJPY' | 'AUDUSD' | 'USDCAD' | 'USDCHF' | 'NZDUSD' | 'EURJPY' | 'GBPJPY' | 'EURGBP';

type TelegramWebApp = {
  initData: string;
  version?: string;
  initDataUnsafe?: { user?: { first_name?: string; username?: string; photo_url?: string }; start_param?: string };
  colorScheme?: 'light' | 'dark';
  ready: () => void;
  expand: () => void;
  isVersionAtLeast?: (version: string) => boolean;
  setHeaderColor?: (color: string) => void;
  setBackgroundColor?: (color: string) => void;
  setBottomBarColor?: (color: string) => void;
  disableVerticalSwipes?: () => void;
  openTelegramLink?: (url: string) => void;
  openLink?: (url: string, options?: { try_instant_view?: boolean }) => void;
  onEvent?: (event: string, callback: () => void) => void;
  offEvent?: (event: string, callback: () => void) => void;
  BackButton?: { show: () => void; hide: () => void; onClick: (callback: () => void) => void; offClick: (callback: () => void) => void };
  HapticFeedback?: { impactOccurred: (style: 'light' | 'medium' | 'heavy') => void; notificationOccurred: (type: 'error' | 'success' | 'warning') => void; selectionChanged: () => void };
};

declare global {
  interface Window { Telegram?: { WebApp: TelegramWebApp } }
}

function haptic(style: 'light' | 'medium' | 'heavy' = 'light') {
  window.Telegram?.WebApp.HapticFeedback?.impactOccurred(style);
}

function openTelegramProfile(event: React.MouseEvent<HTMLAnchorElement>) {
  const telegram = window.Telegram?.WebApp;
  if (!telegram?.openTelegramLink) return;
  event.preventDefault();
  telegram.HapticFeedback?.impactOccurred('light');
  telegram.openTelegramLink('https://t.me/SofaLopez');
}

const REGISTRATION_URL = 'https://pocket-brk.online/regist';
const PLATFORM_LOGIN_URL = 'https://pocketoption.com/es/login/';

function openRegistration(event: React.MouseEvent<HTMLAnchorElement>) {
  const telegram = window.Telegram?.WebApp;
  haptic('medium');
  if (!telegram?.openLink) return;
  event.preventDefault();
  telegram.openLink(REGISTRATION_URL);
}

function openPlatformLogin(event: React.MouseEvent<HTMLAnchorElement>) {
  const telegram = window.Telegram?.WebApp;
  haptic('medium');
  if (!telegram?.openLink) return;
  event.preventDefault();
  telegram.openLink(PLATFORM_LOGIN_URL);
}

const navItems: Array<{ id: Tab; icon: string; label: string }> = [
  { id: 'home', icon: '⌂', label: 'Главная' },
  { id: 'progress', icon: '▥', label: 'Прогресс' },
  { id: 'signals', icon: '◆', label: 'Сигналы' },
  { id: 'support', icon: '◌', label: 'Поддержка' },
  { id: 'academy', icon: '◇', label: 'Академия' },
];

type AcademyVisual = 'funding' | 'route' | 'binary' | 'glossary' | 'signal' | 'expiry' | 'candles' | 'math' | 'risk' | 'capital' | 'indicators' | 'bands' | 'checklist' | 'discipline' | 'journal';
type AcademyLesson = {
  id: string;
  title: string;
  duration: string;
  intro: string;
  takeaways: string[];
  visual: AcademyVisual;
  source?: string;
  quiz: { question: string; options: string[]; correct: number; explanation: string };
};

const academyModules: Array<{ id: string; title: string; subtitle: string; tone: string; lessons: AcademyLesson[] }> = [
  {
    id: 'start', title: 'Настройка и первый шаг', subtitle: 'Баланс, платформа и основная механика', tone: 'blue', lessons: [
      { id: 'funding', title: 'Регистрация по ссылке Sofia', duration: '3 мин', intro: 'Коротко разберём, зачем нужен аккаунт, созданный по ссылке Sofia, и как выглядит форма регистрации на торговой платформе.', takeaways: ['Новый аккаунт создаётся по персональной ссылке Sofia', 'Email, пароль и валюта счёта указываются только на торговой платформе', 'Если аккаунт уже создан по ссылке Sofia, повторная регистрация не нужна'], visual: 'funding', quiz: { question: 'Где вводятся данные для регистрации?', options: ['В Mini App', 'На торговой платформе', 'В чате поддержки'], correct: 1, explanation: 'Email и пароль вводятся только на странице торговой платформы.' } },
      { id: 'route', title: 'Как пройти путь от нуля до первой сессии', duration: '3 мин', intro: 'Сначала разберись в механике, затем потренируйся на демо и только после этого решай, переходить ли дальше.', takeaways: ['Не спеши переходить к реальным действиям', 'Освой платформу и структуру сигнала', 'Заранее задай лимит риска и стоп на день'], visual: 'route', source: 'https://telegra.ph/Prólogo-12-11', quiz: { question: 'Что должно быть первым шагом новичка?', options: ['Сразу пополнить счёт', 'Понять механику и потренироваться', 'Увеличить сумму сделки'], correct: 1, explanation: 'Сначала нужна понятная механика и практика без давления.' } },
      { id: 'binary', title: 'Бинарная опция и обычная сделка Forex', duration: '5 мин', intro: 'В бинарной опции важна цена в конкретный момент экспирации. В Forex результат зависит от величины движения и момента закрытия.', takeaways: ['Бинарная опция имеет два заранее известных исхода', 'Ты не покупаешь сам актив', 'Время экспирации нельзя менять после входа'], visual: 'binary', source: 'https://telegra.ph/Opciones-binarias-Conceptos-básicos-12-12', quiz: { question: 'Что определяет результат бинарной опции?', options: ['Количество пунктов за неделю', 'Цена в момент экспирации', 'Размер графика'], correct: 1, explanation: 'Сравнивается цена входа и цена в заранее выбранный момент.' } },
      { id: 'dictionary', title: 'Словарь трейдера простыми словами', duration: '6 мин', intro: 'Актив, Call, Put, экспирация, волатильность и уровень — базовые слова, которые встречаются в каждом сигнале.', takeaways: ['Call — сценарий роста, Put — сценарий снижения', 'Экспирация — момент фиксации результата', 'Волатильность показывает интенсивность движения'], visual: 'glossary', source: 'https://telegra.ph/DICCIONARIO-DEL-TRADER-06-16', quiz: { question: 'Что такое экспирация?', options: ['Время фиксации результата', 'Название валюты', 'Комиссия платформы'], correct: 0, explanation: 'Экспирация — точное время, когда сравниваются цены.' } },
    ],
  },
  {
    id: 'signals', title: 'Как читать сигнал', subtitle: 'Актив, направление и точное время', tone: 'mint', lessons: [
      { id: 'signal', title: 'Анатомия сигнала: что нажимать', duration: '4 мин', intro: 'Сигнал читается сверху вниз: актив → направление → цена входа → экспирация → размер позиции.', takeaways: ['Сначала сверь валютную пару', 'Не путай ВВЕРХ и ВНИЗ', 'Если опоздал — жди следующий сигнал'], visual: 'signal', quiz: { question: 'Что проверить первым?', options: ['Актив', 'Историю всех сделок', 'Размер шрифта'], correct: 0, explanation: 'Ошибка в активе превращает сигнал в другую сделку.' } },
      { id: 'timeframes', title: 'Таймфрейм и экспирация', duration: '5 мин', intro: 'Таймфрейм показывает длительность одной свечи, а экспирация — когда закончится именно твоя сделка.', takeaways: ['M1 означает одну минуту на свечу', 'Экспирация выбирается под характер движения', 'Короткое время не означает более лёгкий результат'], visual: 'expiry', quiz: { question: 'M5 означает…', options: ['Пять сделок', 'Одна свеча = 5 минут', 'Пять валют'], correct: 1, explanation: 'Таймфрейм задаёт длительность одной свечи.' } },
      { id: 'expiry-errors', title: 'Три ошибки с экспирацией', duration: '4 мин', intro: 'Сокращая или меняя время сигнала, пользователь фактически открывает уже другую сделку.', takeaways: ['Не ставь срок короче указанного', 'Не меняй 10 минут на случайные 7', 'Не входи, когда точка входа уже прошла'], visual: 'expiry', quiz: { question: 'Сигнал указывает 15 минут. Что делать?', options: ['Поставить 3 минуты', 'Соблюсти 15 минут', 'Выбрать случайный срок'], correct: 1, explanation: 'Параметры сигнала работают только как единая система.' } },
      { id: 'candle-basics', title: 'Свеча: четыре числа в одной форме', duration: '5 мин', intro: 'Каждая свеча показывает цену открытия, закрытия, максимум и минимум за выбранный период.', takeaways: ['Тело показывает расстояние между открытием и закрытием', 'Тени показывают максимум и минимум', 'Одна свеча — контекст, а не готовый прогноз'], visual: 'candles', quiz: { question: 'Что показывают тени свечи?', options: ['Максимум и минимум', 'Вероятность выигрыша', 'Сумму сделки'], correct: 0, explanation: 'Тени отмечают крайние цены внутри периода.' } },
    ],
  },
  {
    id: 'risk', title: 'Математика и защита капитала', subtitle: 'Без иллюзий и догонов', tone: 'amber', lessons: [
      { id: 'payout', title: 'Выплата 80% — не вероятность 80%', duration: '5 мин', intro: 'Выплата показывает размер прибыли при верном прогнозе. Она ничего не говорит о вероятности победы.', takeaways: ['WIN на $10 при выплате 80% даёт +$8', 'LOSS той же сделки даёт −$10', 'Для безубыточности нужна точность выше 55,6%'], visual: 'math', quiz: { question: 'Что означает выплата 80%?', options: ['80% шанс победы', '+80% к сумме при WIN', 'Гарантия дохода'], correct: 1, explanation: 'Выплата и вероятность — разные показатели.' } },
      { id: 'money', title: 'Money Management: правило 1–2%', duration: '6 мин', intro: 'Размер одной сделки задаётся заранее как небольшая доля баланса. После серии потерь нельзя увеличивать ставку ради возврата денег.', takeaways: ['Одна сделка — не больше 1–2% баланса', 'После лимита потерь сессия заканчивается', 'Догоны резко увеличивают риск разорения'], visual: 'risk', source: 'https://telegra.ph/Money-Management-en-el-trading-12-12', quiz: { question: 'Баланс $100. Какой учебный диапазон риска?', options: ['$1–2', '$25–50', 'Все $100'], correct: 0, explanation: 'Небольшой процент оставляет запас на серию разных результатов.' } },
      { id: 'capital', title: '$20 и $2000: меняются суммы, не правила', duration: '5 мин', intro: 'Небольшой баланс не делает торговлю проще, а крупный не заменяет дисциплину. Проценты и лимиты остаются одинаковыми.', takeaways: ['Начинай только с суммы, которую можешь потерять', 'Не ставь цель быстро удвоить счёт', 'Сначала проверь, подходит ли тебе сам процесс'], visual: 'capital', source: 'https://telegra.ph/20-vs-2000-para-arrancar-en-trading--qué-cambia-realmente-08-22', quiz: { question: 'Что важнее размера первого депозита?', options: ['Дисциплина и лимиты', 'Максимальная ставка', 'Количество кнопок'], correct: 0, explanation: 'Капитал без правил не защищает от ошибок.' } },
      { id: 'first14', title: 'Первые 14 дней: цель — не прибыль', duration: '4 мин', intro: 'Первые две недели нужны, чтобы научиться без ошибок выбирать актив, направление, сумму и время.', takeaways: ['Ограничь число сессий и сделок', 'Записывай технические ошибки', 'Повышай сумму только после стабильного выполнения правил'], visual: 'journal', quiz: { question: 'Главная цель первых 14 дней?', options: ['Удвоить баланс', 'Освоить механику и дисциплину', 'Торговать весь день'], correct: 1, explanation: 'Сначала оценивается качество действий, а не случайный финансовый результат.' } },
    ],
  },
  {
    id: 'analysis', title: 'Что видит алгоритм', subtitle: 'Свечи, уровни и индикаторы', tone: 'violet', lessons: [
      { id: 'patterns', title: 'Pin bar, поглощение и ложный пробой', duration: '7 мин', intro: 'Свечные модели помогают увидеть реакцию цены, но имеют смысл только рядом с уровнем и в контексте рынка.', takeaways: ['Pin bar показывает отбой от зоны', 'Поглощение усиливает сценарий разворота', 'Ложный пробой возвращает цену за уровень'], visual: 'candles', quiz: { question: 'Где свечной паттерн полезнее?', options: ['Возле важного уровня', 'В любом случайном месте', 'Только ночью'], correct: 0, explanation: 'Паттерн без контекста даёт много ложных трактовок.' } },
      { id: 'indicators', title: 'Индикатор — фильтр, а не волшебная стрелка', duration: '5 мин', intro: 'Индикатор обрабатывает прошлые цены. Он помогает фильтровать условия, но не знает будущего.', takeaways: ['Средние помогают увидеть тренд', 'Осцилляторы показывают перегрев', 'ATR и полосы помогают оценить волатильность'], visual: 'indicators', quiz: { question: 'Что делает индикатор?', options: ['Гарантирует будущее', 'Обрабатывает прошлые данные', 'Открывает сделку сам'], correct: 1, explanation: 'Это математический фильтр, а не гарантия.' } },
      { id: 'bollinger', title: 'Полосы Боллинджера: коридор волатильности', duration: '6 мин', intro: 'Полосы расширяются при усилении движения и сужаются, когда рынок становится спокойнее.', takeaways: ['Край полосы сам по себе не является входом', 'Нужны уровень, свечная реакция и подтверждение', 'Резкое расширение означает повышенную нестабильность'], visual: 'bands', quiz: { question: 'Что означает сжатие полос?', options: ['Рынок стал спокойнее', 'Гарантированный рост', 'Сделка уже открыта'], correct: 0, explanation: 'Сужение обычно отражает снижение текущей волатильности.' } },
      { id: 'rsi-bands', title: 'RSI + Bollinger Bands: учебная связка', duration: '7 мин', intro: 'Связка помогает искать перегрев у границ диапазона, но даёт ложные сигналы и требует проверки новостей и уровней.', takeaways: ['Сначала оцени общий тренд', 'Жди совпадения нескольких условий', 'Ни одна стратегия не гарантирует прибыль'], visual: 'bands', source: 'https://telegra.ph/Estrategia-de-trading-RSI--Bollinger-Bands-12-12', quiz: { question: 'Достаточно ли одного касания полосы?', options: ['Да, всегда', 'Нет, нужен контекст', 'Только при крупной ставке'], correct: 1, explanation: 'Один индикатор не заменяет систему условий.' } },
    ],
  },
  {
    id: 'session', title: 'Первая сессия и дисциплина', subtitle: 'Подготовься, выполни, разберись', tone: 'rose', lessons: [
      { id: 'checklist', title: 'Чек‑лист перед первой сессией', duration: '6 мин', intro: 'Подготовка снимает спешку: платформа открыта, режим выбран, сумма рассчитана, уведомления выключены.', takeaways: ['Зайди минимум за 15 минут', 'Проверь актив, баланс и лимит риска', 'Не используй деньги на обязательные расходы'], visual: 'checklist', source: 'https://telegra.ph/Cómo-prepararte-para-tu-PRIMERA-sesión-de-trading-CheckList-paso-a-paso-05-30', quiz: { question: 'Когда лучше открыть платформу?', options: ['После сигнала', 'Заранее до начала сессии', 'После окончания экспирации'], correct: 1, explanation: 'Подготовка заранее снижает количество технических ошибок.' } },
      { id: 'bad-trader', title: 'Семь способов быстро потерять контроль', duration: '5 мин', intro: 'Вход всей суммой, торговля без остановки и попытка немедленно вернуть LOSS — не стратегия, а ускорение риска.', takeaways: ['Не увеличивай ставку после потери', 'Не торгуй каждую движущуюся свечу', 'Не меняй систему после одного результата'], visual: 'discipline', source: 'https://telegra.ph/CÓMO-CONVERTIRTE-EN-UN-PÉSIMO-TRADER-DE-OPCIONES-BINARIAS-08-10', quiz: { question: 'Что делать после достижения дневного лимита?', options: ['Удвоить ставку', 'Остановить сессию', 'Открыть пять сделок'], correct: 1, explanation: 'Лимит существует именно для остановки эмоциональных решений.' } },
      { id: 'review', title: 'Разбор результата и торговый журнал', duration: '4 мин', intro: 'После сессии оцени не только WIN/LOSS, но и качество выполнения: время, актив, направление и соблюдение риска.', takeaways: ['Запиши каждую сделку и причину входа', 'Отделяй ошибку сигнала от ошибки исполнения', 'Ищи повторяющиеся нарушения правил'], visual: 'journal', quiz: { question: 'Что важнее записать кроме результата?', options: ['Ошибки исполнения', 'Цвет кнопки', 'Погоду'], correct: 0, explanation: 'Журнал нужен, чтобы увидеть повторяющиеся ошибки процесса.' } },
    ],
  },
];

type AcademySection = { title: string; body: string; bullets?: string[]; example?: string };

const academyArticles: Record<string, AcademySection[]> = {
  route: [
    { title: 'Три этапа вместо прыжка в неизвестность', body: 'Путь новичка делится на понятные части. Сначала ты настраиваешь доступ и разбираешь термины, затем тренируешь точность действий, и только после этого переходишь к первой сессии с заранее установленным лимитом.', bullets: ['Настройка аккаунта и интерфейса', 'Практика чтения сигнала без спешки', 'Первая короткая сессия по чек‑листу'] },
    { title: 'Когда можно считать себя готовым', body: 'Готовность — это не отсутствие страха и не серия случайных побед. Ты готов, когда без подсказки находишь актив, правильно выбираешь направление и экспирацию, заранее знаешь сумму сделки и умеешь остановиться по лимиту.', example: 'Если хотя бы один параметр сигнала непонятен — сделку пропускаем и возвращаемся к уроку.' },
  ],
  binary: [
    { title: 'Что происходит в бинарной опции', body: 'Ты не покупаешь валюту или акцию. Ты выбираешь сценарий: будет цена выше или ниже текущей в конкретный момент. Сумма сделки, возможная выплата и время завершения известны до входа.' },
    { title: 'Пример на $10', body: 'При выплате 80% верный сценарий возвращает $10 сделки и добавляет $8 прибыли. Неверный сценарий означает потерю $10. Даже минимальное движение цены к моменту экспирации определяет итог.', example: 'Вход: EUR/USD 1.10000. Через 5 минут цена 1.10001 — сценарий «выше» считается верным.' },
    { title: 'Чем это отличается от Forex', body: 'В Forex результат зависит от размера движения и момента закрытия позиции. В бинарной опции важен только итог выше или ниже точки входа в заданное время. Поэтому нельзя переносить правила одного инструмента на другой.' },
  ],
  dictionary: [
    { title: 'Пять слов внутри каждого сигнала', body: 'Актив — то, по чему строится прогноз. Направление — ВВЕРХ или ВНИЗ. Точка входа — момент начала. Экспирация — момент фиксации. Сумма сделки — заранее рассчитанная часть баланса.', bullets: ['CALL / ВВЕРХ — ожидается цена выше точки входа', 'PUT / ВНИЗ — ожидается цена ниже точки входа', 'OTC — отдельный внебиржевой поток котировок платформы'] },
    { title: 'Слова, описывающие рынок', body: 'Тренд показывает устойчивое направление. Уровень — зона, где цена раньше реагировала. Волатильность описывает силу и скорость движения. Таймфрейм показывает длительность одной свечи.' },
    { title: 'Как пользоваться словарём', body: 'Не пытайся выучить всё сразу. Открывай термин тогда, когда встретил его в сигнале или на графике, и сразу связывай определение с конкретным элементом интерфейса.' },
  ],
  signal: [
    { title: 'Читай сигнал в одном порядке', body: 'Начинай с актива, затем проверь направление, время входа, экспирацию и сумму. Такой порядок снижает риск открыть правильное направление на неправильной валютной паре.', bullets: ['1. Актив', '2. Направление', '3. Момент входа', '4. Экспирация', '5. Сумма сделки'] },
    { title: 'Сигнал — это набор связанных параметров', body: 'Нельзя взять только направление и самостоятельно заменить актив или время. Алгоритм формирует сценарий для конкретной пары и конкретного рыночного момента.' },
    { title: 'Что делать, если опоздал', body: 'Не входи вслед за уже начавшимся движением. Цена могла пройти основную часть импульса, а исходная точка больше не актуальна. Спокойно пропусти сигнал и дождись следующего.', example: 'Лучше пропущенная сделка, чем сделка с параметрами, которых алгоритм не рассчитывал.' },
  ],
  timeframes: [
    { title: 'Таймфрейм — масштаб графика', body: 'На M1 каждая свеча содержит одну минуту движения, на M5 — пять минут, на M15 — пятнадцать. Один и тот же рынок на разных масштабах выглядит по‑разному.' },
    { title: 'Экспирация — срок конкретной сделки', body: 'Экспирация может включать несколько свечей рабочего таймфрейма. Она выбирается так, чтобы сценарию хватило времени реализоваться, но сделка не попала в следующий рыночный цикл.' },
    { title: 'Практическая связь', body: 'Для M1 часто используются минуты, а не секунды; для M5 — более длинное окно. В готовом сигнале это уже рассчитано — пользователю важно перенести значение без изменений.' },
  ],
  'expiry-errors': [
    { title: 'Ошибка №1: сделать быстрее', body: 'Если сигнал рассчитан на 15 минут, экспирация 3 минуты создаёт другую сделку. Цена может сначала уйти против направления и только затем реализовать исходный сценарий.' },
    { title: 'Ошибка №2: выбрать удобное время', body: 'Случайные 7 минут вместо указанных 10 ломают статистику системы. Экспирация связана с таймфреймом, волатильностью и ожидаемой длиной движения.' },
    { title: 'Ошибка №3: войти слишком поздно', body: 'Когда таймер входа закончился или цена уже резко изменилась, соотношение условий другое. Не догоняй рынок — новый сигнал безопаснее попытки успеть в старый.' },
  ],
  'candle-basics': [
    { title: 'Из чего состоит свеча', body: 'Тело соединяет цену открытия и закрытия. Верхняя и нижняя тени показывают крайние значения за период. Цвет помогает быстро увидеть, закрылась цена выше или ниже открытия.' },
    { title: 'Что рассказывает форма', body: 'Большое тело говорит о сильном движении, длинная тень — о попытке пройти дальше и возврате, маленькое тело — о нерешительности. Но форма имеет смысл только вместе с предыдущими свечами и уровнями.' },
    { title: 'Почему одной свечи недостаточно', body: 'Одинаковый pin bar в середине диапазона и у сильного уровня — это разные ситуации. Алгоритм оценивает место, направление рынка, волатильность и подтверждение.' },
  ],
  payout: [
    { title: 'Выплата и вероятность — не одно и то же', body: 'Цифра 80% означает размер прибыли при верном прогнозе, а не шанс победить. Вероятность зависит от качества анализа и исполнения, а выплата задаётся платформой.' },
    { title: 'Математика серии', body: 'Один WIN на $10 даёт +$8, один LOSS забирает $10. При чередовании одного WIN и одного LOSS итог равен −$2. Для нулевого результата при выплате 80% требуется точность около 55,6%.', example: 'Формула безубыточности: 10 / (10 + 8) = 55,6%.' },
    { title: 'Почему важна серия, а не одна сделка', body: 'Один результат ничего не доказывает. Оценивай десятки одинаково исполненных сигналов, отдельно фиксируя ошибки входа. Так случайность меньше влияет на выводы.' },
  ],
  money: [
    { title: 'Размер сделки рассчитывается до сигнала', body: 'Базовый диапазон для новичка — 1–2% от текущего баланса. Если на счёте $100, сумма одной сделки составляет $1–2. После изменения баланса сумму пересчитывают.' },
    { title: 'Лимиты сессии', body: 'Заранее установи максимальное число сделок и допустимую потерю за день. Когда любой лимит достигнут, сессия заканчивается независимо от эмоций или желания вернуть результат.', bullets: ['Не более 5–7 сделок за день', 'Одна или две заранее выбранные сессии', 'Стоп после установленного дневного убытка'] },
    { title: 'Почему нельзя использовать догон', body: 'Увеличение суммы после LOSS быстро делает следующую ошибку критической. Серия неудачных сделок возможна даже у рабочей системы, поэтому размер риска должен оставаться стабильным.' },
  ],
  capital: [
    { title: 'Маленький и большой счёт подчиняются одним правилам', body: 'Суммы отличаются, но проценты риска, число сделок и дисциплина остаются одинаковыми. Больший баланс не делает прогноз точнее, а маленький не оправдывает риск всей суммой.' },
    { title: 'С какой суммы начинать', body: 'Используй только свободные деньги, потеря которых не повлияет на аренду, еду, кредиты или обязательства. Минимальный депозит платформы не является рекомендацией лично для тебя.' },
    { title: 'Реалистичная цель старта', body: 'Первые недели нужны для проверки процесса: умеешь ли ты точно повторять параметры, соблюдать риск и спокойно принимать LOSS. Цель «быстро удвоить» почти всегда толкает к избыточному риску.' },
  ],
  first14: [
    { title: 'Первая неделя — техника', body: 'Тренируй скорость без спешки: открыть правильный актив, перенести сумму, направление и экспирацию. Отмечай каждую техническую ошибку независимо от финансового результата.' },
    { title: 'Вторая неделя — дисциплина', body: 'Работай только в выбранное время, не превышай число сделок и прекращай сессию по лимиту. Стабильное соблюдение правил важнее случайной серии WIN.' },
    { title: 'Итог четырнадцати дней', body: 'Посчитай долю сделок без ошибок, средний риск и причины пропусков. Повышать сумму можно обсуждать только после стабильного исполнения, а не после одного удачного дня.' },
  ],
  patterns: [
    { title: 'Pin bar', body: 'Маленькое тело и длинная тень показывают, что цена попыталась пройти зону, но была возвращена. У сопротивления длинная верхняя тень может поддерживать сценарий ВНИЗ, у поддержки нижняя — сценарий ВВЕРХ.' },
    { title: 'Поглощение', body: 'Новая свеча телом перекрывает предыдущую и показывает резкую смену инициативы. Бычье поглощение у поддержки и медвежье у сопротивления ценнее, чем такая же форма в случайном месте.' },
    { title: 'Ложный пробой', body: 'Цена выходит за уровень, собирает заявки и возвращается обратно. Алгоритм ждёт закрытия за уровнем и дополнительные подтверждения, а не входит по одному касанию.' },
  ],
  indicators: [
    { title: 'Что на самом деле делает индикатор', body: 'Это математическая обработка уже произошедших цен. Индикатор помогает измерить тренд, скорость и волатильность, но не знает будущего и не может гарантировать результат.' },
    { title: 'Три группы фильтров', body: 'Скользящие средние показывают направление, RSI и Stochastic — перегрев движения, ATR и Bollinger Bands — текущую волатильность.', bullets: ['Тренд: куда направлено основное движение', 'Импульс: насколько движение перегрето', 'Волатильность: насколько широко движется цена'] },
    { title: 'Как алгоритм принимает решение', body: 'Сигнал появляется не из одной стрелки. Система сопоставляет несколько условий и пропускает ситуацию, если подтверждений недостаточно или рынок слишком хаотичен.' },
  ],
  bollinger: [
    { title: 'Три линии одного коридора', body: 'Средняя линия отражает усреднённую цену, верхняя и нижняя границы — текущий диапазон волатильности. Полосы расширяются в активном рынке и сжимаются в спокойном.' },
    { title: 'Реакция у границы', body: 'Касание верхней полосы не означает автоматический сигнал ВНИЗ. Нужны уровень сопротивления, признаки замедления и свечное подтверждение. То же правило работает зеркально у нижней полосы.' },
    { title: 'Когда лучше пропустить', body: 'При резком расширении полос цена может продолжать импульс вдоль границы. Попытка поймать разворот без подтверждения в такой момент особенно рискованна.' },
  ],
  'rsi-bands': [
    { title: 'Логика связки', body: 'Bollinger Bands показывают положение цены относительно текущего диапазона, а RSI — скорость движения. Совпадение двух признаков помогает заметить перегрев, но не является готовой сделкой.' },
    { title: 'Последовательность проверки', body: 'Сначала оцени направление старшего таймфрейма и новости, затем уровень, положение у полосы, RSI и свечную реакцию. Вход рассматривается только при согласованности условий.' },
    { title: 'Где возникает ложный сигнал', body: 'В сильном тренде RSI может долго оставаться в зоне перекупленности, а цена — двигаться вдоль верхней полосы. Поэтому алгоритм не разворачивается против импульса только из-за одной цифры.' },
  ],
  checklist: [
    { title: 'За 15 минут до начала', body: 'Открой платформу, проверь соединение, реальный или демо‑режим, текущий баланс и доступные активы. Убери уведомления и подготовь место без отвлечений.' },
    { title: 'Перед первой сделкой', body: 'Запиши максимальный риск, сумму одной сделки, число попыток и условие остановки. Открой сигнал и платформу рядом, чтобы не переключаться в спешке.', bullets: ['Аккаунт синхронизирован', 'Сумма рассчитана заранее', 'Экспирация доступна на платформе', 'Дневной стоп записан'] },
    { title: 'Во время и после сессии', body: 'Не меняй параметры из‑за эмоций. После каждой сделки отметь результат и качество исполнения. Когда лимит достигнут — закрой платформу и перейди к разбору.' },
  ],
  'bad-trader': [
    { title: 'Ошибки, которые выглядят безобидно', body: 'Вход всей суммой, торговля весь день, смена экспирации и попытка догнать пропущенный сигнал кажутся способом ускориться, но на самом деле уничтожают контроль над риском.' },
    { title: 'Эмоциональная ловушка после LOSS', body: 'Желание немедленно вернуть деньги заставляет увеличить сумму и снизить требования к сигналу. Сделай паузу, запиши результат и действуй только по заранее установленному плану.' },
    { title: 'Как распознать потерю контроля', body: 'Ты открываешь сделку без расчёта, скрываешь результат от журнала или продолжаешь после стопа. Любой из этих признаков означает завершение сессии на сегодня.' },
  ],
  review: [
    { title: 'Разделяй результат и качество', body: 'Хорошо исполненная сделка может завершиться LOSS, а ошибочная — случайным WIN. Поэтому оценивай два показателя отдельно: финансовый итог и соблюдение параметров.' },
    { title: 'Что записывать в журнал', body: 'Зафиксируй дату, актив, направление, сумму, экспирацию, результат и ошибку исполнения. Добавь короткую заметку о состоянии: спешил, сомневался или действовал спокойно.' },
    { title: 'Как использовать статистику', body: 'Раз в неделю ищи повторяющиеся ошибки. Если чаще всего опаздываешь — работай со временем входа; если путаешь актив — измени порядок проверки. Журнал должен приводить к одному конкретному улучшению.' },
  ],
};

const academyQuizLessons = new Set(['binary', 'signal', 'payout', 'money', 'checklist']);

const pairData: Record<Pair, { label: string; price: string; change: string; positive: boolean; direction: string; arrow: string; confidence: number }> = {
  EURUSD: { label: 'EUR / USD', price: '1.16635', change: '+0.15%', positive: true, direction: 'ВНИЗ', arrow: '↓', confidence: 92 },
  GBPUSD: { label: 'GBP / USD', price: '1.36560', change: '+0.22%', positive: true, direction: 'ВВЕРХ', arrow: '↑', confidence: 87 },
  USDJPY: { label: 'USD / JPY', price: '158.700', change: '−0.04%', positive: false, direction: 'ВНИЗ', arrow: '↓', confidence: 84 },
  AUDUSD: { label: 'AUD / USD', price: '0.64820', change: '+0.11%', positive: true, direction: 'ВВЕРХ', arrow: '↑', confidence: 89 },
  USDCAD: { label: 'USD / CAD', price: '1.37245', change: '−0.08%', positive: false, direction: 'ВНИЗ', arrow: '↓', confidence: 86 },
  USDCHF: { label: 'USD / CHF', price: '0.80310', change: '+0.06%', positive: true, direction: 'ВВЕРХ', arrow: '↑', confidence: 88 },
  NZDUSD: { label: 'NZD / USD', price: '0.58940', change: '−0.12%', positive: false, direction: 'ВНИЗ', arrow: '↓', confidence: 85 },
  EURJPY: { label: 'EUR / JPY', price: '184.720', change: '+0.19%', positive: true, direction: 'ВВЕРХ', arrow: '↑', confidence: 91 },
  GBPJPY: { label: 'GBP / JPY', price: '216.430', change: '+0.27%', positive: true, direction: 'ВВЕРХ', arrow: '↑', confidence: 90 },
  EURGBP: { label: 'EUR / GBP', price: '0.85430', change: '−0.05%', positive: false, direction: 'ВНИЗ', arrow: '↓', confidence: 83 },
};

function useLiveTranslation(language: AppLanguage, rootRef: React.RefObject<HTMLElement | null>) {
  const textOriginals = useRef(new WeakMap<Text, string>());
  const textTranslations = useRef(new WeakMap<Text, string>());
  const attributeOriginals = useRef(new WeakMap<Element, Map<string, string>>());
  const attributeTranslations = useRef(new WeakMap<Element, Map<string, string>>());

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    document.documentElement.lang = language;

    const isExcluded = (node: Node) => node.parentElement?.closest('[data-no-translate]') !== null;
    const translateText = (node: Text) => {
      if (isExcluded(node)) return;
      const current = node.data;
      if (current === textTranslations.current.get(node)) return;
      textOriginals.current.set(node, current);
      const translated = translateToSpanish(current);
      textTranslations.current.set(node, translated);
      if (translated !== current) node.data = translated;
    };
    const translateAttributes = (element: Element) => {
      if (element.closest('[data-no-translate]')) return;
      for (const attribute of ['aria-label', 'title', 'placeholder', 'alt']) {
        const current = element.getAttribute(attribute);
        if (!current) continue;
        const known = attributeTranslations.current.get(element)?.get(attribute);
        if (current === known) continue;
        let originals = attributeOriginals.current.get(element);
        let translations = attributeTranslations.current.get(element);
        if (!originals) { originals = new Map(); attributeOriginals.current.set(element, originals); }
        if (!translations) { translations = new Map(); attributeTranslations.current.set(element, translations); }
        originals.set(attribute, current);
        const translated = translateToSpanish(current);
        translations.set(attribute, translated);
        if (translated !== current) element.setAttribute(attribute, translated);
      }
    };
    const walk = (start: Node, action: 'translate' | 'restore') => {
      if (start instanceof Text) {
        if (action === 'translate') translateText(start);
        else {
          const original = textOriginals.current.get(start);
          if (original !== undefined) start.data = original;
        }
        return;
      }
      if (!(start instanceof Element)) return;
      if (action === 'translate') translateAttributes(start);
      else {
        const originals = attributeOriginals.current.get(start);
        originals?.forEach((value, key) => start.setAttribute(key, value));
      }
      const walker = document.createTreeWalker(start, NodeFilter.SHOW_ELEMENT | NodeFilter.SHOW_TEXT);
      let node = walker.nextNode();
      while (node) {
        if (node instanceof Text) {
          if (action === 'translate') translateText(node);
          else {
            const original = textOriginals.current.get(node);
            if (original !== undefined) node.data = original;
          }
        } else if (node instanceof Element) {
          if (action === 'translate') translateAttributes(node);
          else {
            const originals = attributeOriginals.current.get(node);
            originals?.forEach((value, key) => node.setAttribute(key, value));
          }
        }
        node = walker.nextNode();
      }
    };

    if (language === 'ru') {
      walk(root, 'restore');
      return;
    }

    walk(root, 'translate');
    const observer = new MutationObserver((mutations) => {
      for (const mutation of mutations) {
        if (mutation.type === 'characterData') translateText(mutation.target as Text);
        if (mutation.type === 'attributes') translateAttributes(mutation.target as Element);
        mutation.addedNodes.forEach((node) => walk(node, 'translate'));
      }
    });
    observer.observe(root, { childList: true, subtree: true, characterData: true, attributes: true, attributeFilter: ['aria-label', 'title', 'placeholder', 'alt'] });
    return () => observer.disconnect();
  }, [language, rootRef]);
}

function Header({ onProfile, language, toggleLanguage }: { onProfile: () => void; language: AppLanguage; toggleLanguage: () => void }) {
  return (
    <header className="topbar">
      <button className="brand-mark" aria-label="Открыть профиль" onClick={onProfile}>С</button>
      <div>
        <p className="eyebrow">ТВОЙ НАСТАВНИК</p>
        <h1>София</h1>
      </div>
      <div className="topbar-actions">
        <button className="language-switch" data-no-translate aria-label={language === 'ru' ? 'Cambiar al español' : 'Переключить на русский'} onClick={toggleLanguage}>
          <span className={language === 'ru' ? 'active' : ''}>RU</span><span className={language === 'es' ? 'active' : ''}>ES</span>
        </button>
        <button className="icon-button" aria-label="Открыть напоминания">🔔</button>
      </div>
    </header>
  );
}

function TapTip({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <details className="tap-tip">
      <summary aria-label={`Открыть подсказку: ${title}`}>?</summary>
      <div><b>{title}</b><p>{children}</p></div>
    </details>
  );
}

function IncomeCalculator({ openReal }: { openReal: () => void }) {
  const [deposit, setDeposit] = useState(100);
  const [tradesPerDay, setTradesPerDay] = useState(3);
  const riskRate = 0.02;
  const payoutRate = 0.8;
  const scenarioWinRate = 0.8;
  const sessions = 20;
  const bonus = Math.round(deposit * 0.6);
  const workingBalance = deposit + bonus;
  const firstStake = workingBalance * riskRate;
  const trades = tradesPerDay * sessions;
  const wins = Math.round(trades * scenarioWinRate);
  const losses = trades - wins;
  const scenarioBalance = Math.round(
    workingBalance
      * Math.pow(1 + riskRate * payoutRate, wins)
      * Math.pow(1 - riskRate, losses),
  );
  const scenarioProfit = scenarioBalance - workingBalance;

  return (
    <section className="income-calculator">
      <div className="bonus-ribbon"><span>+60%</span><div><p className="eyebrow light">ПРОМОКОД SOFILOPAZ</p><h3>Дополнительные средства к пополнению</h3></div><button onClick={openReal}>Активировать →</button></div>
      <div className="calculator-head"><div><p className="eyebrow">VIP-СЦЕНАРИЙ · {sessions} СЕССИЙ</p><h3>Рассчитай свой потенциальный результат за 20 торговых сессий в VIP-группе</h3></div><TapTip title="Что показывает расчёт">Сценарий учитывает пополнение, бонус +60%, выбранное число сигналов, условный винрейт 80% и реинвестирование.</TapTip></div>
      <div className="calculator-period"><span>20 торговых сессий</span><small>1 сессия в день · до {tradesPerDay} сигналов</small></div>
      <label className="deposit-control"><span>Пополнение <b>${deposit}</b></span><input type="range" min="50" max="1000" step="50" value={deposit} onChange={(event) => setDeposit(Number(event.target.value))} /></label>
      <div className="trade-count"><span>Сигналов в день</span><div>{[1, 3, 5].map((value) => <button className={tradesPerDay === value ? 'active' : ''} onClick={() => setTradesPerDay(value)} key={value}>{value}</button>)}</div></div>
      <div className="bonus-breakdown"><span><small>СВОИ СРЕДСТВА</small><b>${deposit}</b></span><span><small>БОНУС +60%</small><b className="green">+${bonus}</b></span><span><small>СТАРТОВЫЙ БАЛАНС</small><b>${workingBalance}</b></span></div>
      <div className="scenario-result"><div><small>ПОТЕНЦИАЛЬНЫЙ ИТОГОВЫЙ БАЛАНС</small><strong>${scenarioBalance}</strong><em>+${scenarioProfit} к стартовому балансу</em></div><p><b>{trades} сделок · {wins} WIN / {losses} LOSS</b><br />Первая сумма сделки — ${firstStake.toFixed(2)}. Дальше она пересчитывается от нового баланса.</p></div>
      <div className="reinvestment-note"><span>2%</span><p><b>Реинвестирование включено</b><small>После каждого результата следующая сумма сделки пересчитывается как 2% от нового баланса. Выплата при WIN в сценарии — 80% от суммы сделки.</small></p></div>
      <small className="calculator-note">Это математический сценарий при условном винрейте 80%, а не прогноз или обещание дохода. Реальная серия и результат могут отличаться. Условия бонуса и его доступность определяет внешняя платформа.</small>
    </section>
  );
}

function PromoCountdown({ openReal }: { openReal: () => void }) {
  const [secondsLeft, setSecondsLeft] = useState(23 * 60 * 60 + 59 * 60 + 59);

  useEffect(() => {
    const key = 'sofia-promo-deadline';
    const saved = Number(window.localStorage.getItem(key));
    const deadline = Number.isFinite(saved) && saved > 0 ? saved : Date.now() + (24 * 60 * 60 * 1000) - 1000;
    if (!saved) window.localStorage.setItem(key, String(deadline));
    const update = () => setSecondsLeft(Math.max(0, Math.floor((deadline - Date.now()) / 1000)));
    update();
    const timer = window.setInterval(update, 1000);
    return () => window.clearInterval(timer);
  }, []);

  const hours = String(Math.floor(secondsLeft / 3600)).padStart(2, '0');
  const minutes = String(Math.floor((secondsLeft % 3600) / 60)).padStart(2, '0');
  const seconds = String(secondsLeft % 60).padStart(2, '0');

  return (
    <section className="promo-countdown" aria-label="Промо-бонус 60 процентов">
      <div className="promo-copy"><p className="eyebrow">ПЕРСОНАЛЬНОЕ ОКНО</p><h2><code>SOFILOPAZ</code> <span>+60%</span></h2><small>Введи код при пополнении. Доступность и начисление подтверждает платформа.</small></div>
      <button onClick={openReal}><span>▣</span>{secondsLeft > 0 ? 'Активировать' : 'Проверить'}</button>
      <div className="promo-clock"><small>{secondsLeft > 0 ? 'ОСТАЛОСЬ ВРЕМЕНИ' : 'ВРЕМЯ ИСТЕКЛО'}</small><strong>{hours}<i>:</i>{minutes}<i>:</i>{seconds}</strong></div>
    </section>
  );
}

function HomeScreen({ goTo, openPair, openReal, realRegistered, name }: { goTo: (tab: Tab) => void; openPair: (pair: Pair) => void; openReal: () => void; realRegistered: boolean; name: string }) {
  return (
    <>
      <section className="story-section">
        <div className="inline-heading"><h2>Полезное за минуту</h2><span>Смотреть</span></div>
        <div className="story-strip" aria-label="Полезные подсказки">
          {[
            ['1', 'Начни здесь', 'blue', 'academy'],
            ['↗', 'Сигнал', 'peach', 'signals'],
            ['С', 'София', 'violet', 'support'],
          ].map(([icon, label, tone, target]) => (
            <button className="story" key={label} onClick={() => goTo(target as Tab)}>
              <span className={tone}>{icon}</span>
              <small>{label}</small>
            </button>
          ))}
        </div>
      </section>

      <PromoCountdown openReal={openReal} />

      <section className="welcome-card command-card">
        <div className="welcome-copy">
          <div className="level-line"><span>Уровень 1</span><b>Демо готово</b></div>
          <p className="eyebrow light">СЕГОДНЯ · ШАГ 2 ИЗ 4</p>
          <h2>Привет, {name} 👋</h2>
          <p>Следующий шаг — открыть демо-сигнал на реальном графике и проверить точку входа.</p>
        </div>
        <button className="hero-action" onClick={() => goTo('signals')}>Получить сигнал <span>→</span></button>
      </section>

      <section className="balance-card">
        <div className="balance-top">
          <div><p>ДЕМО-БАЛАНС</p><h2>10 000 ₽</h2></div>
          <div className="mode-toggle dark-toggle" aria-label="Режим баланса">
            <button className="active">Демо</button>
            <button onClick={openReal}>Реальный {realRegistered ? '✓' : '→'}</button>
          </div>
        </div>
        <div className="balance-stats">
          <div><small>СИГНАЛОВ СЕГОДНЯ</small><b>10</b></div>
          <div><small>ВИНРЕЙТ ДЕМО</small><b className="green">80%</b></div>
          <div><small>РЕЗУЛЬТАТ WIN</small><b className="green">+80%</b></div>
        </div>
      </section>

      <button className="action-row" onClick={() => goTo('signals')}>
        <span className="action-icon">⌕</span>
        <span><b>Получить демо-сигнал</b><small>График, точка входа и экспирация</small></span>
        <em>›</em>
      </button>

      <section className={`real-entry-card ${realRegistered ? 'is-ready' : ''}`}>
        <div className="real-entry-icon">{realRegistered ? '✓' : '↗'}</div>
        <div><p className="eyebrow">РЕАЛЬНЫЙ СЧЁТ</p><h3>{realRegistered ? 'Доступ отмечен' : 'Готов перейти к реальным сигналам?'}</h3><p>{realRegistered ? 'Открой терминал, выбери актив и получи сигнал для самостоятельного входа на платформе.' : 'Создай новый аккаунт по ссылке Софии или войди в уже существующий. Пароль вводится только на платформе.'}</p></div>
        <button onClick={openReal}>{realRegistered ? 'Открыть терминал' : 'Войти или зарегистрироваться'} <span>→</span></button>
      </section>

      <IncomeCalculator openReal={openReal} />

      <section className="practice-calendar">
        <div className="section-heading"><h3>Календарь практики</h3><span>Август 2026</span></div>
        <div className="calendar-days">
          {['Пн|24|done', 'Вт|25|today', 'Ср|26|', 'Чт|27|', 'Пт|28|', 'Сб|29|', 'Вс|30|'].map((item) => {
            const [day, date, state] = item.split('|');
            return <div className={state} key={date}><small>{day}</small><b>{date}</b><span>{state === 'done' ? '✓' : ''}</span></div>;
          })}
        </div>
        <p><span>●</span> 1 практика завершена · следующая займёт 3 минуты</p>
      </section>

      <section className="watchlist-section">
        <div className="section-heading"><div><p className="eyebrow">НАБЛЮДЕНИЕ</p><h3>Рынок сейчас</h3></div><span className="live-pill">● 10 пар</span></div>
        <div className="watchlist">
          {(Object.keys(pairData) as Pair[]).map((pair) => (
            <button key={pair} onClick={() => openPair(pair)}>
              <small>{pairData[pair].label}</small>
              <b>{pairData[pair].price}</b>
              <em className={pairData[pair].positive ? 'up' : 'down'}>{pairData[pair].change}</em>
            </button>
          ))}
        </div>
      </section>

      <aside className="risk-note">
        <span>i</span>
        <p><b>Важно:</b> данные рынка могут задерживаться. Сигналы не гарантируют результат и используются здесь для обучения.</p>
      </aside>

    </>
  );
}

function ProgressScreen({ goTo }: { goTo: (tab: Tab) => void }) {
  const achievements = [
    ['✓', 'Первый шаг', true],
    ['⌕', 'Исследователь', false],
    ['↗', 'Практик', false],
    ['◆', 'Знаток сигналов', false],
    ['♢', 'Риск под контролем', false],
    ['★', 'Первая неделя', false],
    ['◎', 'Без спешки', false],
    ['♜', 'Уверенный старт', false],
  ] as const;

  return (
    <>
      <div className="screen-title">
        <p className="eyebrow">ТВОЙ МАРШРУТ</p>
        <h2>Прогресс</h2>
        <p>Здесь видно не заработок, а то, насколько ты готов принимать решения самостоятельно.</p>
      </div>

      <section className="level-card">
        <div className="level-card-head"><span>⚡</span><h3>Уровень 1 → 2</h3><b>50 / 84 XP</b></div>
        <div className="xp-track"><span /></div>
        <div className="level-footer"><span>До уровня 2 осталось 34 XP</span><span>Следующий бонус: тренажёр риска</span></div>
      </section>

      <div className="stats-grid">
        <article><span>↗</span><small>СИГНАЛОВ ПОНЯТО</small><b>2</b><em>из 3 примеров</em></article>
        <article><span>◇</span><small>УРОКОВ ПРОЙДЕНО</small><b>2 / 22</b><em>ещё 4 до уровня 2</em></article>
        <article><span>◎</span><small>ДНЕЙ ПРАКТИКИ</small><b>1</b><em>серия: 2 дня</em></article>
        <article><span>♡</span><small>ПЛАН РИСКА</small><b className="ready">Готов</b><em>лимит 1%</em></article>
      </div>

      <section className="performance-card">
        <div className="section-heading"><h3>Качество практики</h3><span>Только демо</span></div>
        <div className="performance-bar"><span className="done">1 выполнено</span><span>0 пропущено</span></div>
        <div className="performance-notes"><span>✓ Время входа проверено</span><span>✓ Риск выбран заранее</span></div>
      </section>

      <section className="academy-progress">
        <div className="section-heading"><h3>Прогресс академии</h3><span>2 / 22</span></div>
        {[
          ['◉', 'Новичок', '2 / 6', 33, 'mint'],
          ['⚙', 'Уверенный', '0 / 8', 0, 'blue'],
          ['◇', 'Продвинутый', '0 / 4', 0, 'violet'],
          ['♢', 'Эксперт', '0 / 4', 0, 'amber'],
        ].map(([icon, title, value, percent, tone]) => (
          <div className="academy-level" key={title}>
            <span className={String(tone)}>{icon}</span>
            <b>{title}</b>
            <div><i style={{ width: `${percent}%` }} /></div>
            <small>{value}</small>
          </div>
        ))}
      </section>

      <section className="achievements-card">
        <div className="section-heading"><h3>Достижения</h3><span>1 из 24</span></div>
        <div className="achievement-grid">
          {achievements.map(([icon, title, unlocked]) => (
            <div className={unlocked ? 'unlocked' : ''} key={title}><span>{unlocked ? icon : '⌑'}</span><small>{title}</small></div>
          ))}
        </div>
      </section>

      <button className="primary-action" onClick={() => goTo('academy')}>Заработать следующие 10 XP <span>→</span></button>
    </>
  );
}

function TradingViewChart({ pair }: { pair: Pair }) {
  const container = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const node = container.current;
    if (!node) return;
    node.innerHTML = '';
    const widget = document.createElement('div');
    widget.className = 'tradingview-widget-container__widget';
    widget.style.height = '100%';
    widget.style.width = '100%';
    const script = document.createElement('script');
    script.src = 'https://s3.tradingview.com/external-embedding/embed-widget-advanced-chart.js';
    script.async = true;
    script.type = 'text/javascript';
    script.innerHTML = JSON.stringify({
      autosize: true,
      symbol: `FX:${pair}`,
      interval: '1',
      timezone: 'Europe/Moscow',
      theme: 'dark',
      style: '1',
      locale: 'ru',
      backgroundColor: '#101a30',
      gridColor: 'rgba(105, 128, 181, 0.10)',
      hide_side_toolbar: true,
      hide_top_toolbar: true,
      hide_legend: false,
      hide_volume: true,
      allow_symbol_change: false,
      save_image: false,
      calendar: false,
      support_host: 'https://www.tradingview.com',
    });
    node.appendChild(widget);
    node.appendChild(script);
    return () => { node.innerHTML = ''; };
  }, [pair]);

  return (
    <div className="tv-shell">
      <div ref={container} className="tradingview-widget-container tv-container" />
      <a href={`https://www.tradingview.com/symbols/${pair}/`} target="_blank" rel="noopener nofollow">График {pairData[pair].label} от TradingView</a>
    </div>
  );
}

function RealRegistrationGate({ confirm, backToDemo }: { confirm: () => void; backToDemo: () => void }) {
  const [registrationOpened, setRegistrationOpened] = useState(false);
  const [loginOpened, setLoginOpened] = useState(false);

  return (
    <section className="registration-gate">
      <div className="registration-hero">
        <span>↗</span>
        <div><p className="eyebrow light">АКТИВАЦИЯ РЕАЛЬНОГО РЕЖИМА</p><h2>Создай аккаунт или проверь существующий</h2><p>Реальный режим доступен только аккаунтам, зарегистрированным по партнёрской ссылке Софии.</p></div>
      </div>
      <div className="registration-steps">
        <div className="current"><span>1</span><p><b>Новый пользователь</b><small>Создай аккаунт по персональной ссылке Софии.</small></p></div>
        <div className={loginOpened ? 'current' : ''}><span>2</span><p><b>Аккаунт уже существует</b><small>Войди, затем подтверди привязку к Софии.</small></p></div>
        <div className={registrationOpened ? 'current' : ''}><span>3</span><p><b>Вернись в Sofia</b><small>Реальный режим откроется только после подтверждения.</small></p></div>
      </div>
      <div className="registration-bonus"><span>+60%</span><p><b>Промо-бонус к пополнению</b><small>Предложение открывается вместе с регистрационной ссылкой. Условия и начисление определяет платформа.</small></p></div>
      <a className="registration-primary" href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer" onClick={(event) => { setRegistrationOpened(true); openRegistration(event); }}>Создать новый аккаунт <span>→</span></a>
      <a className="registration-login" href={PLATFORM_LOGIN_URL} target="_blank" rel="noopener noreferrer" onClick={(event) => { setLoginOpened(true); openPlatformLogin(event); }}>Аккаунт создан по ссылке Софии — войти <span>↗</span></a>
      {loginOpened && <div className="referral-check"><span>⌕</span><p><b>Требуется проверка привязки</b><small>Пока автоматическая проверка недоступна, реальный режим остаётся закрыт. Напиши Софии — она проверит аккаунт и поможет со входом.</small></p><a href="https://t.me/SofaLopez" target="_blank" rel="noopener noreferrer" onClick={openTelegramProfile}>Проверить у Софии</a></div>}
      {registrationOpened && <button className="registration-confirm" onClick={confirm}>Регистрация завершена — продолжить <span>✓</span></button>}
      <p className="registration-hint">Sofia не запрашивает логин или пароль. Все данные вводятся только на странице платформы.</p>
      <button className="registration-demo" onClick={backToDemo}>Вернуться в демо-режим</button>
      <div className="registration-support"><span>С</span><p><b>Не получается зарегистрироваться или войти?</b><small>Напиши Софии в личный Telegram — помогу разобраться шаг за шагом.</small></p><a href="https://t.me/SofaLopez" target="_blank" rel="noopener noreferrer" onClick={openTelegramProfile}>Написать в Telegram</a></div>
      <aside><span>i</span><p>Sofia не принимает платежи, не хранит пароль и не совершает сделки. Торговля связана с риском потери средств.</p></aside>
    </section>
  );
}

function SignalsScreen({ goTo, initialSignalReady = false, initialPair = 'EURUSD', initialMode = 'demo', realRegistered, confirmRegistration }: { goTo: (tab: Tab) => void; initialSignalReady?: boolean; initialPair?: Pair; initialMode?: 'demo' | 'real'; realRegistered: boolean; confirmRegistration: () => void }) {
  const [mode, setMode] = useState<'demo' | 'real'>(initialMode);
  const [pair, setPair] = useState<Pair>(initialPair);
  const [terminalMode, setTerminalMode] = useState<'manual' | 'ai'>('ai');
  const [amount, setAmount] = useState(100);
  const [expirySeconds, setExpirySeconds] = useState(5);
  const [scanning, setScanning] = useState(false);
  const [scanPhase, setScanPhase] = useState(0);
  const [signalReady, setSignalReady] = useState(initialSignalReady);
  const [understood, setUnderstood] = useState(false);
  const [seconds, setSeconds] = useState(initialSignalReady ? 5 : 0);
  const [demoBalance, setDemoBalance] = useState(10000);
  const [result, setResult] = useState<'win' | 'loss' | null>(null);
  const [resultOpen, setResultOpen] = useState(false);
  const [awaitingRealResult, setAwaitingRealResult] = useState(false);
  const [tradeSequence, setTradeSequence] = useState(0);
  const [guideStep, setGuideStep] = useState(-1);
  const [infoSheet, setInfoSheet] = useState<'balance' | 'mode' | null>(null);
  const settledRef = useRef(false);
  const resultRef = useRef<HTMLElement>(null);

  const manualExpiryOptions = [
    { label: '1 мин', value: 60 },
    { label: '2 мин', value: 120 },
    { label: '3 мин', value: 180 },
    { label: '4 мин', value: 240 },
    { label: '5 мин', value: 300 },
    { label: '10 мин', value: 600 },
    { label: '15 мин', value: 900 },
  ];
  const aiExpiryOptions = [
    { label: '5 сек', value: 5 },
    { label: '10 сек', value: 10 },
    { label: '15 сек', value: 15 },
    { label: '30 сек', value: 30 },
    { label: '1 мин', value: 60 },
  ];
  const expiryOptions = terminalMode === 'manual' ? manualExpiryOptions : aiExpiryOptions;
  const scanPhases = ['Сканирую импульс', 'Проверяю уровни', 'Оцениваю волатильность', 'Собираю сигнал'];
  const guideSteps = [
    { target: 'mode', title: 'Выбери режим', text: 'В демо можно проверить механику без реальных средств. Реальный режим открывает регистрацию и переход на платформу.' },
    { target: 'setup', title: 'Настрой параметры', text: 'Слева выбери актив и сумму, справа — время экспирации. Риск пересчитается автоматически.' },
    { target: 'analyze', title: 'Запусти анализ', text: 'Нажми кнопку анализа. София в реальном времени покажет, какой этап проверки выполняется.' },
    { target: 'chart', title: 'Прочитай сигнал', text: 'Сначала направление, затем цена входа и таймер. Если время уже прошло — не повторяй вход.' },
    { target: 'platform', title: 'Перейди на платформу', text: 'В реальном режиме открой платформу, ещё раз сверь актив, сумму и экспирацию, затем принимай решение.' },
  ];

  useEffect(() => {
    if (window.localStorage.getItem('sofia-guide-seen') !== '1') setGuideStep(0);
  }, []);

  useEffect(() => {
    if (guideStep < 0) return;
    const target = document.querySelector<HTMLElement>(`[data-guide="${guideSteps[guideStep].target}"]`);
    const card = document.querySelector<HTMLElement>(`[data-coach-card="${guideStep}"]`);
    target?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    const timer = window.setTimeout(() => card?.scrollIntoView({ behavior: 'smooth', block: 'center' }), 180);
    return () => window.clearTimeout(timer);
  }, [guideStep]);

  useEffect(() => {
    if (!resultOpen) return;
    const timer = window.setTimeout(() => resultRef.current?.scrollIntoView({ behavior: 'smooth', block: 'start' }), 80);
    return () => window.clearTimeout(timer);
  }, [resultOpen]);

  const closeGuide = () => {
    window.localStorage.setItem('sofia-guide-seen', '1');
    setGuideStep(-1);
  };

  const moveGuide = (direction: 1 | -1) => {
    let next = guideStep + direction;
    while (next >= 0 && next < guideSteps.length && !document.querySelector(`[data-guide="${guideSteps[next].target}"]`)) next += direction;
    if (next < 0 || next >= guideSteps.length) closeGuide();
    else setGuideStep(next);
  };

  const renderGuideCard = (target: string) => {
    if (guideStep < 0 || guideSteps[guideStep].target !== target) return null;
    return (
      <article className="coach-card coach-card-inline" data-coach-card={guideStep} aria-live="polite">
        <div className="coach-progress"><span>ПОДСКАЗКА СОФИИ</span><b>{guideStep + 1} / {guideSteps.length}</b></div>
        <h3>{guideSteps[guideStep].title}</h3>
        <p>{guideSteps[guideStep].text}</p>
        <div className="coach-actions">
          <button className="coach-skip" onClick={closeGuide}>Пропустить</button>
          {guideStep > 0 && <button className="coach-back" onClick={() => moveGuide(-1)}>Назад</button>}
          <button className="coach-next" onClick={() => moveGuide(1)}>{guideStep === guideSteps.length - 1 || !guideSteps.slice(guideStep + 1).some((step) => document.querySelector(`[data-guide="${step.target}"]`)) ? 'Понятно ✓' : 'Далее →'}</button>
        </div>
      </article>
    );
  };

  useEffect(() => {
    if (!signalReady) return;
    if (seconds <= 0 && !settledRef.current) {
      settledRef.current = true;
      if (mode === 'real') {
        setAwaitingRealResult(true);
        window.Telegram?.WebApp.HapticFeedback?.notificationOccurred('warning');
        return;
      }
      const outcome = tradeSequence % 5 === 4 ? 'loss' : 'win';
      setResult(outcome);
      setResultOpen(true);
      setDemoBalance((balance) => outcome === 'win' ? balance + Math.round(amount * 0.8) : balance - amount);
      setTradeSequence((value) => value + 1);
      window.Telegram?.WebApp.HapticFeedback?.notificationOccurred(outcome === 'win' ? 'success' : 'warning');
      return;
    }
    if (seconds <= 0 || result) return;
    const timer = window.setTimeout(() => setSeconds((value) => Math.max(0, value - 1)), 1000);
    return () => window.clearTimeout(timer);
  }, [signalReady, seconds, result, tradeSequence, amount, mode]);

  const findSignal = () => {
    haptic('medium');
    setScanning(true);
    setScanPhase(0);
    setSignalReady(false);
    setUnderstood(false);
    setResult(null);
    setResultOpen(false);
    setAwaitingRealResult(false);
    settledRef.current = false;
    const phaseTimer = window.setInterval(() => setScanPhase((value) => Math.min(value + 1, scanPhases.length - 1)), 520);
    window.setTimeout(() => {
      window.clearInterval(phaseTimer);
      setScanning(false);
      setSignalReady(true);
      setSeconds(expirySeconds);
      window.Telegram?.WebApp.HapticFeedback?.notificationOccurred('success');
    }, 2200);
  };

  const clock = `${Math.floor(seconds / 60)}:${String(seconds % 60).padStart(2, '0')}`;
  const current = pairData[pair];
  const riskPercent = (amount / demoBalance) * 100;
  const expiryLabel = expiryOptions.find((option) => option.value === expirySeconds)?.label ?? (terminalMode === 'manual' ? '1 мин' : '5 сек');
  const demoPayout = Math.round(amount * 0.8);

  const recordRealResult = (outcome: 'win' | 'loss') => {
    setAwaitingRealResult(false);
    setResult(outcome);
    setResultOpen(true);
    window.Telegram?.WebApp.HapticFeedback?.notificationOccurred(outcome === 'win' ? 'success' : 'warning');
  };

  const resetSignal = () => {
    setSignalReady(false);
    setUnderstood(false);
    setSeconds(0);
    setResult(null);
    setResultOpen(false);
    setAwaitingRealResult(false);
    settledRef.current = false;
  };

  return (
    <>
      <div className="screen-title signals-title">
        <div><p className="eyebrow">ТОРГОВЫЙ ТЕРМИНАЛ</p><h2>Сигналы</h2></div>
        <button aria-label="Открыть подсказки" onClick={() => setGuideStep(0)}>?</button>
      </div>

      <section className={`signal-balance-card ${guideStep >= 0 && guideSteps[guideStep].target === 'mode' ? 'coach-focus' : ''}`} data-guide="mode">
        <div className="signal-balance-head"><div><p className="eyebrow light">{mode === 'demo' ? 'ДЕМО-БАЛАНС' : 'РЕАЛЬНЫЙ СЧЁТ'}</p><h2>{mode === 'demo' ? `${demoBalance.toLocaleString('ru-RU')} ₽` : realRegistered ? 'РЕГИСТРАЦИЯ ОТМЕЧЕНА' : 'НЕ АКТИВИРОВАН'}</h2></div><button className="terminal-info-button dark" aria-label="Подробнее о демо и реальном балансе" onClick={() => setInfoSheet('balance')}>i</button></div>
        <div className="mode-toggle dark-toggle">
          <button className={mode === 'demo' ? 'active' : ''} onClick={() => { resetSignal(); setMode('demo'); }}>Демо</button>
          <button className={mode === 'real' ? 'active' : ''} onClick={() => { resetSignal(); setMode('real'); }}>Реальный</button>
        </div>
        {mode === 'demo' ? <div className="terminal-stats"><span>Сигналов <b>10</b></span><span>Винрейт демо <b className="green">80%</b></span><span>Результат WIN <b className="green">+80%</b></span></div> : <div className="terminal-stats"><span>Статус <b className={realRegistered ? 'green' : ''}>{realRegistered ? 'Готово' : 'Регистрация'}</b></span><span>Пары <b>10</b></span><span>Риск <b className="green">до 1%</b></span></div>}
      </section>
      {renderGuideCard('mode')}

      <section className="live-guidance live-guidance-top" aria-live="polite">
        <span>С</span>
        <p><b>Сейчас сделай так</b>{mode === 'real' && !realRegistered ? 'Создай новый аккаунт по ссылке Софии. Если аккаунт уже есть, сначала подтверди, что он привязан к Софии.' : scanning ? `${scanPhases[scanPhase]}. Подожди завершения всех четырёх этапов.` : awaitingRealResult ? 'Экспирация закончилась. Сверь результат на платформе и отметь WIN или LOSS.' : result ? 'Результат сохранён. Перед следующим сигналом проверь сумму и риск ещё раз.' : signalReady ? `Проверь направление ${current.direction}, цену входа ${current.price} и таймер ${expiryLabel}.` : 'Выбери актив, сумму и экспирацию ниже, затем нажми «Запустить AI-анализ».'}</p>
        <TapTip title="Первая сессия">Следуй только текущему шагу. Не открывай сделку, если таймер закончился или параметры на платформе отличаются.</TapTip>
      </section>

      {result && resultOpen && (
        <article ref={resultRef} className={`result-spotlight ${result}`} role="status" aria-live="assertive" aria-atomic="true">
          <div className="result-spotlight-head">
            <span>{result === 'win' ? '✓' : '×'}</span>
            <div><p className="eyebrow">РЕЗУЛЬТАТ СРАЗУ ПОСЛЕ СДЕЛКИ</p><h2>{result === 'win' ? 'Победа' : 'Сделка в минус'}</h2></div>
            <button aria-label="Скрыть результат" onClick={() => setResultOpen(false)}>×</button>
          </div>
          <strong>{mode === 'demo' ? result === 'win' ? `+${demoPayout} ₽` : `−${amount} ₽` : result.toUpperCase()}</strong>
          <div className="result-spotlight-details"><span><small>АКТИВ</small><b>{current.label}</b></span><span><small>ЭКСПИРАЦИЯ</small><b>{expiryLabel}</b></span><span><small>{mode === 'demo' ? 'БАЛАНС' : 'СУММА'}</small><b>{mode === 'demo' ? `${demoBalance.toLocaleString('ru-RU')} ₽` : `${amount} ₽`}</b></span></div>
          <p>{result === 'win' ? 'Направление совпало с движением цены к моменту экспирации.' : 'Цена пошла против сигнала. Это часть торговли — проверь условия входа перед следующим действием.'}</p>
          <div className="result-next"><b>Следующий шаг</b><span>Посмотри короткий разбор или настрой новый сигнал.</span></div>
          <div className="result-spotlight-actions"><button onClick={() => { setResultOpen(false); setUnderstood(true); }}>Разобрать результат</button><button onClick={resetSignal}>Новый сигнал</button></div>
        </article>
      )}

      {mode === 'real' && !realRegistered ? (
        <RealRegistrationGate confirm={confirmRegistration} backToDemo={() => setMode('demo')} />
      ) : (
        <>
          <section className="terminal-mode-row" data-guide="mode-choice" aria-label="Выбор режима анализа">
            <div className="terminal-mode compact-mode-toggle">
              <button className={terminalMode === 'manual' ? 'active' : ''} onClick={() => { setTerminalMode('manual'); setExpirySeconds(60); resetSignal(); }}>⚙ Ручной</button>
              <button className={terminalMode === 'ai' ? 'active' : ''} onClick={() => { setTerminalMode('ai'); setExpirySeconds(5); resetSignal(); }}>✦ AI-алгоритм</button>
            </div>
            <button className="terminal-info-button" aria-label="Подробнее о ручном и AI-режиме" onClick={() => setInfoSheet('mode')}>i</button>
          </section>

          <section className={`terminal-config ${guideStep >= 0 && guideSteps[guideStep].target === 'setup' ? 'coach-focus' : ''}`} data-guide="setup" aria-label={mode === 'demo' ? 'Настройки демо-сделки' : 'Настройки реального сигнала'}>
            <div className="terminal-config-head"><div><p className="eyebrow">ШАГ 1</p><h3>Настрой первый сигнал</h3></div><TapTip title="Что нужно выбрать">Актив — валютная пара, сумма — размер одной сделки, экспирация — через сколько минут фиксируется результат.</TapTip></div>
            <div className="core-controls">
              <label><small>АКТИВ</small><select value={pair} onChange={(event) => { setPair(event.target.value as Pair); resetSignal(); }}>{(Object.keys(pairData) as Pair[]).map((item) => <option value={item} key={item}>{pairData[item].label} OTC</option>)}</select></label>
              <label><small>СУММА СДЕЛКИ</small><select value={amount} onChange={(event) => { setAmount(Number(event.target.value)); resetSignal(); }}>{[50, 100, 250, 500].map((value) => <option value={value} key={value}>{value} ₽</option>)}</select></label>
              <div className="quick-balance"><small>{mode === 'demo' ? 'ДЕМО-ДЕПО' : 'БАЛАНС ДЛЯ РАСЧЁТА'}</small><b>{demoBalance.toLocaleString('ru-RU')} ₽</b><span>Риск сделки: {riskPercent.toFixed(1)}%</span></div>
            </div>
            <div className="expiry-column">
              <small>ЭКСПИРАЦИЯ</small>
              {expiryOptions.map((option) => <button className={expirySeconds === option.value ? 'active' : ''} aria-pressed={expirySeconds === option.value} onClick={() => { setExpirySeconds(option.value); resetSignal(); }} key={option.value}><b>{option.label}</b>{terminalMode === 'ai' && option.value === 5 && <span>быстро</span>}</button>)}
            </div>
          </section>
          {renderGuideCard('setup')}

          <div className="terminal-summary">
            <span><small>{mode === 'demo' ? 'ДЕПО' : 'РАСЧЁТНЫЙ БАЛАНС'}</small><b>{demoBalance.toLocaleString('ru-RU')} ₽</b></span><span><small>СДЕЛКА</small><b>{amount} ₽</b></span><span><small>РИСК</small><b className={riskPercent <= 1 ? 'risk-ok' : 'risk-warn'}>{riskPercent.toFixed(1)}%</b></span>
          </div>
          {riskPercent > 1 && <div className="risk-alert"><span>i</span><p><b>Рекомендуемый размер позиции</b> София предлагает держать риск около 1% от баланса независимо от режима.</p><button onClick={() => { setAmount(Math.max(50, Math.round(demoBalance * 0.01 / 50) * 50)); resetSignal(); }}>Выбрать 1%</button></div>}

          <section className={`chart-card ${signalReady ? 'has-signal' : ''} ${guideStep >= 0 && guideSteps[guideStep].target === 'chart' ? 'coach-focus' : ''}`} data-guide="chart">
            <div className="pair-strip-heading"><span>ДОСТУПНЫЕ АКТИВЫ</span><small>10 валютных пар · выбери в поле «Актив»</small></div>
            <div className="pair-tabs">
              {(Object.keys(pairData) as Pair[]).map((item) => (
                <button className={pair === item ? 'active' : ''} key={item} onClick={() => { setPair(item); resetSignal(); }}>
                  <span>{pairData[item].label}</span><small className={pairData[item].positive ? 'up' : 'down'}>{pairData[item].change}</small>
                </button>
              ))}
            </div>
            <div className="market-heading"><span>🌐</span><div><b>{current.label}</b><small>Свечной график · интервал 1 мин</small></div><strong>{current.price}</strong></div>
            <TradingViewChart pair={pair} />
            {signalReady ? (
              <div className="active-terminal-signal">
                <div className="live-signal-strip">
                  <div><small>НАПРАВЛЕНИЕ</small><b className={current.direction === 'ВНИЗ' ? 'signal-down' : 'signal-up'}>{current.direction} {current.arrow}</b></div>
                  <div><small>ЦЕНА ВХОДА</small><b>{current.price}</b></div>
                  <div><small>ОЦЕНКА АЛГОРИТМА</small><b className="confidence">{current.confidence}%</b></div>
                </div>
                <div className={`signal-progress ${result ? `finished ${result}` : ''}`}><span>{result === 'win' ? mode === 'demo' ? `✓ ПОБЕДА · +${demoPayout} ₽` : '✓ РЕЗУЛЬТАТ ОТМЕЧЕН: WIN' : result === 'loss' ? mode === 'demo' ? `× РЕЗУЛЬТАТ: УБЫТОК · −${amount} ₽` : '× РЕЗУЛЬТАТ ОТМЕЧЕН: LOSS' : awaitingRealResult ? 'Экспирация завершена' : `Сигнал активен · ${amount} ₽`}</span><b>{result ? 'ГОТОВО' : awaitingRealResult ? 'ОТМЕТЬ' : clock}</b></div>
                {mode === 'real' && awaitingRealResult && <div className="real-result-actions"><p>Сверь результат на платформе и отметь его здесь:</p><button className="win" onClick={() => recordRealResult('win')}>WIN ✓</button><button className="loss" onClick={() => recordRealResult('loss')}>LOSS ×</button></div>}
                <div className="indicator-line"><small>УСЛОВИЯ АЛГОРИТМА</small><span>УРОВНИ ✓</span><span>ИМПУЛЬС ✓</span><span>ВОЛАТИЛЬНОСТЬ ✓</span></div>
                <p className="terminal-explanation">Цена замедлилась у уровня сопротивления. Алгоритм определил направление {current.direction.toLowerCase()} на экспирацию {expiryLabel}. Оценка показывает совпадение заданных условий, а не гарантию результата.</p>
              </div>
            ) : (
              <div className="chart-caption"><span>СВЕЧИ</span><p>Зелёная свеча показывает рост, красная — снижение. Алгоритм добавит направление, точку входа и таймер.</p></div>
            )}
          </section>
          {renderGuideCard('chart')}

          {mode === 'real' && signalReady && !result && <><a className={`broker-trade-button ${guideStep >= 0 && guideSteps[guideStep].target === 'platform' ? 'coach-focus' : ''}`} data-guide="platform" href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer" onClick={openRegistration}><span>↗</span><div><b>Открыть платформу для сделки</b><small>Скопируй параметры сигнала и проверь их перед входом</small></div><em>→</em></a>{renderGuideCard('platform')}</>}

          <section className="signal-settings">
            <div><small>ПАРА</small><b>{pairData[pair].label}</b></div>
            <div><small>ЭКСПИРАЦИЯ</small><b>{expiryLabel}</b></div>
            <div><small>РИСК</small><b className={riskPercent <= 1 ? 'green' : 'risk-warn'}>{riskPercent.toFixed(1)}%</b></div>
          </section>

          <section className={`algorithm-card ${scanning ? 'is-scanning' : ''}`}>
            <div className="algorithm-head"><span>AI</span><div><p className="eyebrow">{terminalMode === 'ai' ? 'AI-АЛГОРИТМ' : 'РУЧНОЙ РЕЖИМ'}</p><h3>{scanning ? scanPhases[scanPhase] : signalReady ? 'Условия найдены' : 'Готов к анализу'}</h3></div><b>{scanning ? `${Math.round(((scanPhase + 1) / scanPhases.length) * 100)}%` : signalReady ? 'ГОТОВО' : mode === 'demo' ? 'ДЕМО' : 'REAL'}</b></div>
            <div className="algorithm-track"><i style={{ width: scanning ? `${((scanPhase + 1) / scanPhases.length) * 100}%` : signalReady ? '100%' : '0%' }} /></div>
            <div className="algorithm-steps">{scanPhases.map((phase, index) => <span className={signalReady || index < scanPhase ? 'done' : index === scanPhase && scanning ? 'current' : ''} key={phase}><i>{signalReady || index < scanPhase ? '✓' : index + 1}</i>{phase}</span>)}</div>
            <p>{terminalMode === 'ai' ? 'Алгоритм сравнивает тренд, уровни и волатильность по заданным правилам.' : 'В ручном режиме ты читаешь свечи сам, а София показывает контрольные ориентиры.'}</p>
          </section>

          <button className={`find-signal-button ${scanning ? 'scanning' : ''} ${guideStep >= 0 && guideSteps[guideStep].target === 'analyze' ? 'coach-focus' : ''}`} data-guide="analyze" onClick={findSignal} disabled={scanning}>
            <span>{scanning ? '◌' : '⌕'}</span>{scanning ? scanPhases[scanPhase] : result ? 'Найти новый сигнал' : signalReady ? 'Обновить сигнал' : terminalMode === 'ai' ? 'Запустить AI-анализ' : 'Показать контрольную разметку'}
          </button>
          {renderGuideCard('analyze')}

          {!signalReady && !scanning && (
            <section className="empty-signal">
              <div>✦</div><h3>Торговое пространство готово</h3><p>Выбери актив, экспирацию и сумму. Затем запусти анализ — София объяснит результат простыми словами.</p>
            </section>
          )}

          {signalReady && (
            <section className="decision-card">
              <div className="decision-head"><span>1</span><div><p className="eyebrow">ЧТО ДЕЛАТЬ СЕЙЧАС</p><h3>Прочитай сигнал сверху вниз</h3></div></div>
              <ol>
                <li><b>{current.label}</b><span>Проверь выбранную пару</span></li>
                <li><b>{current.direction} {current.arrow}</b><span>Запомни направление</span></li>
                <li><b>{expiryLabel}</b><span>Не действуй после окончания таймера</span></li>
              </ol>
              <button className={`primary-action compact ${understood ? 'confirmed' : ''}`} onClick={() => setUnderstood(true)}>
                {understood ? 'Сигнал понятен ✓' : 'Я понял сигнал'} <span>{understood ? '' : '→'}</span>
              </button>
              {understood && <div className="next-step-note"><span>+10 XP</span><p><b>Готово.</b> После завершения вернись к разбору результата.</p></div>}
            </section>
          )}

          <section className="signal-history">
            <div className="section-heading"><h3>История сигналов</h3><button>Все результаты</button></div>
            {result && <div className={`current-result ${result}`}><span className="asset-mini">{pair.charAt(0)}</span><p><b>{current.label} · {current.direction}</b><small>{amount} ₽ · {expiryLabel} · только что</small></p><strong className={result}>{result === 'win' ? `WIN +${demoPayout} ₽` : `LOSS −${amount} ₽`}</strong></div>}
            <div><span className="asset-mini">G</span><p><b>GBP / USD · Вверх</b><small>100 ₽ · 2 мин · сегодня 17:10</small></p><strong className="win">WIN +80 ₽</strong></div>
            <div><span className="asset-mini">E</span><p><b>EUR / USD · Вниз</b><small>50 ₽ · 3 мин · вчера 16:40</small></p><strong className="loss">LOSS −50 ₽</strong></div>
          </section>
          <aside className="terminal-disclaimer"><span>i</span><p>{mode === 'demo' ? <><b>Демо-счёт.</b> Винрейт 80% рассчитан по серии из 10 демо-сигналов. Реальные результаты могут отличаться.</> : <><b>Реальный режим.</b> Sofia формирует информационный сигнал, но не открывает сделку. Решение и результат остаются за пользователем.</>}</p></aside>

        </>
      )}
      {infoSheet && (
        <div className="terminal-info-backdrop" role="presentation" onClick={() => setInfoSheet(null)}>
          <section className="terminal-info-sheet" role="dialog" aria-modal="true" aria-labelledby="terminal-info-title" onClick={(event) => event.stopPropagation()}>
            <span className="terminal-info-handle" />
            <button className="terminal-info-close" aria-label="Закрыть пояснение" onClick={() => setInfoSheet(null)}>×</button>
            {infoSheet === 'balance' ? (
              <>
                <p className="eyebrow light">РЕЖИМ БАЛАНСА</p><h2 id="terminal-info-title">Демо и реальный баланс</h2>
                <article className="terminal-info-topic demo"><span>▶</span><div><h3>Демо</h3><small>ТРЕНИРОВОЧНЫЙ СЧЁТ</small></div><p>Виртуальные средства позволяют разобраться с интерфейсом и сигналами без использования реального баланса.</p><footer><b>Виртуальные средства</b><b>Практика механики</b></footer></article>
                <article className="terminal-info-topic real"><span>▣</span><div><h3>Реальный</h3><small>БАЛАНС НА ТОРГОВОЙ ПЛАТФОРМЕ</small></div><p>Реальные сделки проводятся только на внешней торговой платформе. Sofia показывает параметры, но не открывает сделку за пользователя.</p><footer><b>Реальные средства</b><b>Самостоятельное решение</b></footer></article>
                <p className="terminal-info-note">Статистика демо и реального режима ведётся отдельно.</p>
              </>
            ) : (
              <>
                <p className="eyebrow light">СПОСОБ РАБОТЫ</p><h2 id="terminal-info-title">Ручной и AI-режим</h2>
                <article className="terminal-info-topic"><span>⚙</span><div><h3>Ручной режим</h3><small>ПАРАМЕТРЫ ВЫБИРАЕШЬ САМ</small></div><p>Ты выбираешь актив и минутную экспирацию, изучаешь график и самостоятельно переносишь параметры сделки на платформу.</p><ol><li>Выбери срок от 1 до 15 минут</li><li>Проверь график</li><li>Сам введи параметры</li></ol></article>
                <article className="terminal-info-topic ai"><span>AI</span><div><h3>AI-режим</h3><small>АЛГОРИТМ СОБИРАЕТ СИГНАЛ</small></div><p>Алгоритм работает с быстрыми экспирациями, сравнивает тренд, уровни и волатильность. Ты проверяешь готовый сигнал и сам решаешь, использовать его или нет.</p><ol><li>Выбери 5, 10, 15, 30 секунд или 1 минуту</li><li>Запусти анализ</li><li>Проверь готовый сигнал</li></ol></article>
                <p className="terminal-info-note">Экспирации отличаются: ручной режим — 1, 2, 3, 4, 5, 10 и 15 минут; AI — 5, 10, 15, 30 секунд и 1 минута.</p>
              </>
            )}
            <button className="terminal-info-confirm" onClick={() => setInfoSheet(null)}>Понятно</button>
          </section>
        </div>
      )}
      {guideStep >= 0 && <div className="coach-overlay" aria-hidden="true" />}
    </>
  );
}

function LessonIllustration({ kind }: { kind: AcademyVisual }) {
  if (kind === 'funding') return null;
  if (kind === 'route') return <div className="academy-visual route"><span>ПОНЯТЬ</span><i>→</i><span>ДЕМО</span><i>→</i><span>СЕССИЯ</span></div>;
  if (kind === 'binary') return <div className="academy-visual binary"><div><small>БИНАРНАЯ</small><b>Выше / ниже</b><em>фиксированное время</em></div><span>VS</span><div><small>FOREX</small><b>Размер движения</b><em>закрываешь сам</em></div></div>;
  if (kind === 'glossary') return <div className="academy-visual glossary">{['CALL ↑','PUT ↓','АКТИВ','ЭКСПИРАЦИЯ','УРОВЕНЬ','ВОЛАТИЛЬНОСТЬ'].map((word) => <span key={word}>{word}</span>)}</div>;
  if (kind === 'signal') return <div className="academy-visual signal"><small>EUR / USD OTC</small><b>ВНИЗ ↓</b><div><span>Вход 1.16635</span><span>1 мин</span><span>Риск 1%</span></div></div>;
  if (kind === 'expiry') return <div className="academy-visual expiry"><div><span>M1</span><i /><i /><i /></div><strong>→</strong><b>03:00</b></div>;
  if (kind === 'candles') return <div className="academy-visual candles"><span className="red" /><span className="green tall" /><span className="pin" /><div><b>Тело</b><small>Открытие · максимум · минимум · закрытие</small></div></div>;
  if (kind === 'math') return <div className="academy-visual math"><div><small>WIN</small><b>+$8</b></div><span>+</span><div><small>LOSS</small><b>−$10</b></div><strong>= −$2</strong></div>;
  if (kind === 'risk') return <div className="academy-visual risk"><div><b>2%</b><small>на одну сделку</small></div><p><span>Баланс $100</span><strong>Сделка $2</strong></p></div>;
  if (kind === 'capital') return <div className="academy-visual capital"><div><small>СТАРТ</small><b>$20</b><span>те же правила</span></div><i>=</i><div><small>СТАРТ</small><b>$2000</b><span>те же проценты</span></div></div>;
  if (kind === 'indicators') return <div className="academy-visual indicators"><span>ТРЕНД</span><span>RSI</span><span>ATR</span><span>УРОВЕНЬ</span><b>ФИЛЬТР УСЛОВИЙ</b></div>;
  if (kind === 'bands') return <div className="academy-visual bands"><i className="upper" /><i className="middle" /><i className="lower" /><span /><span /><span /><b>RSI 68</b></div>;
  if (kind === 'checklist') return <div className="academy-visual checklist">{['Платформа открыта','Актив проверен','Риск рассчитан','Телефон без отвлечений'].map((item) => <span key={item}>✓ {item}</span>)}</div>;
  if (kind === 'discipline') return <div className="academy-visual discipline"><strong>STOP</strong><div><span>Без догонов</span><span>Без спешки</span><span>По лимиту</span></div></div>;
  return <div className="academy-visual journal"><div><b>Сделка</b><b>Результат</b><b>Ошибка</b></div><div><span>EUR/USD</span><span>WIN</span><span>—</span></div><div><span>GBP/USD</span><span>LOSS</span><span>Опоздал</span></div></div>;
}

function FundingLessonDetails({ openReal }: { openReal: () => void }) {
  return (
    <div className="funding-lesson-details registration-only-lesson">
      <div className="registration-explanation">
        <p className="eyebrow">ПЕРВЫЙ ШАГ</p>
        <h3>Зачем нужна регистрация по ссылке Sofia</h3>
        <p>Чтобы подключить реальный режим, новый торговый аккаунт нужно создать по персональной ссылке Sofia. Так система сможет подтвердить связь аккаунта с Mini App.</p>
        <p>Если аккаунт уже был создан именно по этой ссылке, регистрироваться повторно не нужно — используй вход в существующий аккаунт.</p>
      </div>
      <section className="funding-account-actions">
        <img src="/academy/safe-registration.webp" alt="Регистрация: email, пароль, валюта счёта и возвращение в Sofia" />
        <div><p className="eyebrow">КАК ЭТО ВЫГЛЯДИТ</p><h3>Заполни три поля</h3><ol><li>Укажи действующий email.</li><li>Создай пароль и сохрани его.</li><li>Выбери валюту счёта и заверши регистрацию.</li></ol><button onClick={openReal}>Зарегистрироваться по ссылке Sofia <span>→</span></button></div>
        <aside><p><b>Уже регистрировался по ссылке Sofia?</b> Создавать новый аккаунт не нужно.</p><button onClick={openReal}>Войти в существующий аккаунт</button></aside>
      </section>
      <p className="registration-help-copy">Если при регистрации или входе возник вопрос, <a href="https://t.me/SofaLopez" target="_blank" rel="noreferrer" onClick={openTelegramProfile}>напиши мне в Telegram</a> — помогу разобраться.</p>
    </div>
  );
}

function LessonArticle({ lessonId }: { lessonId: string }) {
  const sections = academyArticles[lessonId] ?? [];
  if (!sections.length) return null;
  return (
    <div className="lesson-article">
      {sections.map((section, index) => (
        <section key={section.title}>
          <div className="lesson-section-number">{String(index + 1).padStart(2, '0')}</div>
          <div><h3>{section.title}</h3><p>{section.body}</p>{section.bullets && <ul>{section.bullets.map((item) => <li key={item}>{item}</li>)}</ul>}{section.example && <aside><b>Пример</b>{section.example}</aside>}</div>
        </section>
      ))}
    </div>
  );
}

function AcademyScreen({ openReal }: { openReal: () => void }) {
  const allLessons = academyModules.flatMap((module) => module.lessons);
  const [openLesson, setOpenLesson] = useState<string | null>(null);
  const [completed, setCompleted] = useState<string[]>([]);
  const [answer, setAnswer] = useState<number | null>(null);

  useEffect(() => {
    const saved = window.localStorage.getItem('sofia-academy-completed');
    if (saved) {
      try { setCompleted(JSON.parse(saved)); } catch { /* keep initial progress */ }
    }
  }, []);

  const lesson = allLessons.find((item) => item.id === openLesson) ?? null;
  const lessonIndex = lesson ? allLessons.findIndex((item) => item.id === lesson.id) : -1;
  const requiresQuiz = lesson ? academyQuizLessons.has(lesson.id) : false;
  const nextLesson = allLessons.find((item) => !completed.includes(item.id)) ?? allLessons[0];
  const progress = Math.round((completed.length / allLessons.length) * 100);

  const openLessonById = (id: string) => { haptic(); setAnswer(null); setOpenLesson(id); };
  const completeLesson = () => {
    if (!lesson) return;
    const nextCompleted = completed.includes(lesson.id) ? completed : [...completed, lesson.id];
    setCompleted(nextCompleted);
    window.localStorage.setItem('sofia-academy-completed', JSON.stringify(nextCompleted));
    window.Telegram?.WebApp.HapticFeedback?.notificationOccurred('success');
    if (lesson.id === 'funding') {
      setOpenLesson(null);
      openReal();
      return;
    }
    const next = allLessons[lessonIndex + 1];
    if (next) { setAnswer(null); setOpenLesson(next.id); } else setOpenLesson(null);
  };

  return (
    <>
      <div className="screen-title academy-title">
        <div><p className="eyebrow">ОБУЧЕНИЕ С НУЛЯ</p><h2>Академия Софии</h2></div>
        <TapTip title="Как учиться">Проходи уроки по порядку. Каждый занимает несколько минут, а короткая проверка появляется только после ключевых тем.</TapTip>
      </div>

      <section className="academy-journey">
        <div className="academy-journey-copy"><p className="eyebrow light">ТВОЙ МАРШРУТ ДО ПЕРВОЙ СЕССИИ</p><h3>Пойми → потренируйся → действуй по плану</h3><p>{completed.length} из {allLessons.length} уроков завершено</p></div>
        <div className="academy-progress-ring" style={{ background: `conic-gradient(#63d2a4 ${progress}%,rgba(255,255,255,.14) 0)` }}><span>{progress}%</span></div>
        <button onClick={() => openLessonById(nextLesson.id)}><span>▶</span><div><small>СЛЕДУЮЩИЙ УРОК · {nextLesson.duration}</small><b>{nextLesson.title}</b></div><em>→</em></button>
      </section>

      <section className="academy-principle"><span>С</span><p><b>Здесь не нужно угадывать.</b> Каждый экран отвечает на один вопрос и показывает один следующий шаг.</p></section>

      <div className="academy-modules">
        {academyModules.map((module, moduleIndex) => {
          const done = module.lessons.filter((item) => completed.includes(item.id)).length;
          return (
            <details className={`academy-module ${module.tone}`} open={moduleIndex === 0 ? true : undefined} key={module.id}>
              <summary>
                <span>{String(moduleIndex + 1).padStart(2, '0')}</span>
                <div><p className="eyebrow">МОДУЛЬ {moduleIndex + 1}</p><h3>{module.title}</h3><small>{module.subtitle}</small></div>
                <b>{done}/{module.lessons.length}</b><em>⌄</em>
              </summary>
              <div className="academy-lesson-list">
                {module.lessons.map((item, index) => {
                  const isDone = completed.includes(item.id);
                  const isNext = item.id === nextLesson.id;
                  return <button className={isDone ? 'done' : isNext ? 'current' : ''} onClick={() => openLessonById(item.id)} key={item.id}><span>{isDone ? '✓' : index + 1}</span><p><b>{item.title}</b><small>{item.duration} · простое объяснение</small></p><em>{isNext ? 'Начать' : '›'}</em></button>;
                })}
              </div>
            </details>
          );
        })}
      </div>

      <aside className="academy-safety"><span>i</span><p><b>Обучение не обещает доход.</b> Его задача — объяснить механику, риски и дисциплину до финансовых действий.</p></aside>

      {lesson && (
        <div className="sheet-backdrop academy-backdrop" role="presentation">
          <article className="lesson-sheet academy-lesson-sheet" role="dialog" aria-modal="true" aria-labelledby="lesson-title">
            <div className="lesson-topbar"><button aria-label="Вернуться в Академию" onClick={() => setOpenLesson(null)}>←</button><div><span style={{ width: `${((lessonIndex + 1) / allLessons.length) * 100}%` }} /></div><small>{lessonIndex + 1}/{allLessons.length}</small></div>
            <LessonIllustration kind={lesson.visual} />
            <p className="eyebrow">УРОК {lessonIndex + 1} · {lesson.duration}</p>
            <h2 id="lesson-title">{lesson.title}</h2>
            <p className="lesson-intro">{lesson.intro}</p>
            {lesson.id === 'funding' && <FundingLessonDetails openReal={openReal} />}
            <LessonArticle lessonId={lesson.id} />
            <section className="lesson-takeaways"><h3>Главное за минуту</h3>{lesson.takeaways.map((item) => <p key={item}><span>✓</span>{item}</p>)}</section>
            {requiresQuiz && <section className="lesson-quiz"><p className="eyebrow">КОРОТКАЯ ПРОВЕРКА</p><h3>{lesson.quiz.question}</h3>{lesson.quiz.options.map((option, index) => <button className={answer === null ? '' : index === lesson.quiz.correct ? 'correct' : answer === index ? 'wrong' : ''} onClick={() => setAnswer(index)} key={option}><span>{String.fromCharCode(65 + index)}</span>{option}</button>)}{answer !== null && <p className={answer === lesson.quiz.correct ? 'quiz-feedback correct' : 'quiz-feedback'}>{answer === lesson.quiz.correct ? 'Верно. ' : 'Почти. '}{lesson.quiz.explanation}</p>}</section>}
            <button className="lesson-complete" onClick={completeLesson} disabled={requiresQuiz && answer === null}>{lesson.id === 'funding' ? 'Перейти к подключению аккаунта' : completed.includes(lesson.id) ? 'Следующий урок' : requiresQuiz ? 'Завершить и продолжить' : 'Прочитал — продолжить'} <span>→</span></button>
            <div className="lesson-navigation"><button disabled={lessonIndex <= 0} onClick={() => { setAnswer(null); setOpenLesson(allLessons[lessonIndex - 1]?.id ?? null); }}>← Назад</button><button disabled={lessonIndex >= allLessons.length - 1} onClick={() => { setAnswer(null); setOpenLesson(allLessons[lessonIndex + 1]?.id ?? null); }}>Вперёд →</button></div>
          </article>
        </div>
      )}
    </>
  );
}

function SupportScreen() {
  return (
    <section className="chat-screen">
      <div className="chat-head">
        <div className="sofia-avatar small">С</div>
        <div><h2>Поддержка Софии</h2><p><span /> Онлайн</p></div>
      </div>
      <div className="chat-context"><b>Контекст сохранён:</b> Модуль 1 · Урок 2</div>
      <div className="support-content">
        <div className="message sofia">Привет, Алекс 👋 Вижу, ты учишься читать сигнал. Какую часть тебе хотелось бы прояснить?</div>
        <article className="telegram-card">
          <div className="telegram-card-copy">
            <span className="telegram-kicker">ЛИЧНАЯ ПОДДЕРЖКА В TELEGRAM</span>
            <h3>Напиши мне свой вопрос лично</h3>
            <p>Не нужно писать вопросы внутри платформы. Перейди в мой личный Telegram-аккаунт — я помогу тебе во всём разобраться.</p>
          </div>
          <div className="telegram-profile">
            <img src="/sofia-telegram-profile.jpg" alt="Профиль Софии Лопес в Telegram с именем пользователя @SofaLopez" />
            <div className="telegram-profile-info"><span>Личный аккаунт Софии</span><b>Sofía López</b><a href="https://t.me/SofaLopez" target="_blank" rel="noreferrer" onClick={openTelegramProfile}>@SofaLopez</a></div>
          </div>
          <a className="telegram-primary" href="https://t.me/SofaLopez" target="_blank" rel="noreferrer" onClick={openTelegramProfile}><span>✈</span> Написать Софии в Telegram</a>
          <div className="contact-reminder"><span>＋</span><p><b>Добавь аккаунт в контакты</b>Сохрани @SofaLopez, чтобы не потерять переписку и быстро вернуться к поддержке.</p></div>
          <a className="telegram-secondary" href="https://t.me/SofaLopez" target="_blank" rel="noreferrer" onClick={openTelegramProfile}>Открыть профиль и добавить в контакты</a>
        </article>
      </div>
    </section>
  );
}

function ActivationGate({ activate, skip }: { activate: () => void; skip: () => void }) {
  const [loading, setLoading] = useState(false);

  const start = () => {
    haptic('medium');
    setLoading(true);
    window.setTimeout(activate, 1200);
  };

  return (
    <div className="activation-gate" role="dialog" aria-modal="true" aria-labelledby="activation-title">
      <div className="activation-glow one" /><div className="activation-glow two" />
      <article className="activation-card">
        <div className="activation-brand"><span>С</span><b>SOFIA SIGNALS</b></div>
        <div className="activation-badge">ДЕМО-СЕРИЯ · ВИНРЕЙТ 80%</div>
        <h2 id="activation-title">Посмотри, как работает сигнал</h2>
        <p>София проанализирует рынок, покажет направление и проведёт через первый результат шаг за шагом.</p>
        <div className="activation-market">
          <div className="activation-market-head"><span><small>ПАРА</small><b>EUR / USD</b></span><span><small>СУММА</small><b>100 ₽</b></span><span><small>ЭКСПИРАЦИЯ</small><b>1 мин</b></span></div>
          <div className="activation-market-line"><i /><i /><i /><i /><i /><i /></div>
          <p><span className="claim-loader" /> AI анализирует рынок…</p>
        </div>
        <ul>
          <li><span>✓</span> Сначала проверь механику на демо</li>
          <li><span>✓</span> Затем зарегистрируй реальный счёт</li>
          <li><span>✓</span> Пароль вводится только на сайте платформы</li>
        </ul>
        <button className={`claim-button ${loading ? 'loading' : ''}`} onClick={start} disabled={loading}>
          {loading ? <><span className="claim-loader" /> Готовлю терминал…</> : <>Начать за 1 минуту <span>→</span></>}
        </button>
        <button className="activation-skip" onClick={skip} disabled={loading}>Перейти на главную</button>
        <small className="activation-note">80% относится только к заданной демо-серии. Реальный результат не гарантирован.</small>
      </article>
    </div>
  );
}

function ProfileSheet({ close, realRegistered, openReal, openSupport, name }: { close: () => void; realRegistered: boolean; openReal: () => void; openSupport: () => void; name: string }) {
  const [step, setStep] = useState(0);
  const [diagnosticOpen, setDiagnosticOpen] = useState(false);
  const questions = [
    { title: 'Какой у тебя опыт?', choices: ['Никогда не торговал', 'Пробовал один раз', 'У меня уже есть опыт'] },
    { title: 'Какая у тебя главная цель?', choices: ['Научиться с нуля', 'Разобраться в сигналах', 'Подготовиться к первой сессии'] },
    { title: 'У тебя уже есть аккаунт Pocket Option?', choices: ['Да, по ссылке Софии', 'Да, зарегистрирован иначе', 'Пока нет'] },
  ];

  if (!diagnosticOpen) return (
    <div className="sheet-backdrop" role="presentation" onClick={close}>
      <article className="profile-sheet account-sheet" role="dialog" aria-modal="true" aria-labelledby="profile-title" onClick={(event) => event.stopPropagation()}>
        <button className="sheet-close" aria-label="Закрыть" onClick={close}>×</button>
        <div className="account-head"><div className="profile-avatar">{name.charAt(0).toUpperCase()}</div><div><p className="eyebrow">ПРОФИЛЬ</p><h2 id="profile-title">{name}</h2><span className={realRegistered ? 'status-ready' : 'status-pending'}>{realRegistered ? 'Регистрация отмечена' : 'Реальный режим не активирован'}</span></div></div>
        <div className="account-section-title">ПОДДЕРЖКА И ПЛАТФОРМА</div>
        <button className="account-row" onClick={openSupport}><span>◌</span><p><b>Поддержка Софии</b><small>Личный диалог в Telegram</small></p><em>›</em></button>
        <a className="account-row" href={REGISTRATION_URL} target="_blank" rel="noopener noreferrer" onClick={openRegistration}><span>↗</span><p><b>Торговая платформа</b><small>Регистрация и вход во внешнем окне</small></p><em>›</em></a>
        <div className="account-section-title">НАСТРОЙКИ</div>
        <button className="account-row" onClick={openReal}><span>◆</span><p><b>Режим торговли</b><small>{realRegistered ? 'Реальный доступ отмечен' : 'Нужен вход или регистрация'}</small></p><em>{realRegistered ? 'REAL' : 'ДЕМО'}</em></button>
        <button className="account-row" onClick={() => setDiagnosticOpen(true)}><span>✓</span><p><b>Персональный план</b><small>Опыт, цель и наличие аккаунта</small></p><em>›</em></button>
        <p className="account-note">Sofia не хранит логины, пароли и платёжные данные. Все финансовые действия выполняются на внешней платформе.</p>
      </article>
    </div>
  );

  return (
    <div className="sheet-backdrop" role="presentation" onClick={close}>
      <article className="profile-sheet" role="dialog" aria-modal="true" aria-labelledby="profile-title" onClick={(event) => event.stopPropagation()}>
        <button className="sheet-close" aria-label="Вернуться к профилю" onClick={() => setDiagnosticOpen(false)}>←</button>
        <div className="profile-avatar">A</div>
        <p className="eyebrow">ТВОЯ ДИАГНОСТИКА · {step + 1} ИЗ 3</p>
        <h2 id="profile-title">{questions[step].title}</h2>
        <p>Ответы помогут Софии адаптировать твой план. Позже их можно изменить.</p>
        <div className="choice-list">
          {questions[step].choices.map((choice) => (
            <button key={choice} onClick={() => step < 2 ? setStep(step + 1) : close()}>{choice}<span>›</span></button>
          ))}
        </div>
      </article>
    </div>
  );
}

export default function Home() {
  const appRef = useRef<HTMLElement | null>(null);
  const [language, setLanguage] = useState<AppLanguage>('ru');
  const [tab, setTab] = useState<Tab>('home');
  const [profileOpen, setProfileOpen] = useState(false);
  const [activationOpen, setActivationOpen] = useState(true);
  const [activated, setActivated] = useState(false);
  const [selectedPair, setSelectedPair] = useState<Pair>('EURUSD');
  const [requestedMode, setRequestedMode] = useState<'demo' | 'real'>('demo');
  const [realRegistered, setRealRegistered] = useState(false);
  const [telegramName, setTelegramName] = useState('Алекс');
  const [isTelegram, setIsTelegram] = useState(false);

  useEffect(() => {
    const savedLanguage = window.localStorage.getItem('sofia-language');
    if (savedLanguage === 'es') setLanguage('es');
  }, []);

  useLiveTranslation(language, appRef);

  const toggleLanguage = () => {
    haptic();
    setLanguage((current) => {
      const next = current === 'ru' ? 'es' : 'ru';
      window.localStorage.setItem('sofia-language', next);
      return next;
    });
  };

  useEffect(() => {
    setRealRegistered(window.localStorage.getItem('sofia-referral-verified') === '1');
  }, []);

  useEffect(() => {
    let cancelled = false;
    const initializeTelegram = () => {
      const telegram = window.Telegram?.WebApp;
      if (cancelled || !telegram?.initData) return;

      setIsTelegram(true);
      document.documentElement.dataset.telegram = 'true';
      telegram.ready();
      telegram.expand();
      if (telegram.isVersionAtLeast?.('6.1')) {
        telegram.setHeaderColor?.('#f9fbff');
        telegram.setBackgroundColor?.('#f1f5fb');
      }
      if (telegram.isVersionAtLeast?.('8.0')) telegram.setBottomBarColor?.('#ffffff');
      if (telegram.isVersionAtLeast?.('7.7')) telegram.disableVerticalSwipes?.();

      const firstName = telegram.initDataUnsafe?.user?.first_name;
      if (firstName) setTelegramName(firstName);

      if (telegram.initDataUnsafe?.start_param === 'signals') {
        setActivated(true);
        setActivationOpen(false);
        setTab('signals');
      }
    };

    const existing = document.querySelector<HTMLScriptElement>('script[data-telegram-sdk]');
    if (existing) initializeTelegram();
    else {
      const script = document.createElement('script');
      script.src = 'https://telegram.org/js/telegram-web-app.js';
      script.dataset.telegramSdk = 'true';
      script.onload = initializeTelegram;
      document.head.appendChild(script);
    }

    return () => {
      cancelled = true;
      delete document.documentElement.dataset.telegram;
    };
  }, []);

  useEffect(() => {
    const backButton = window.Telegram?.WebApp.BackButton;
    if (!isTelegram || !backButton) return;
    const handleBack = () => {
      haptic();
      if (profileOpen) setProfileOpen(false);
      else setTab('home');
    };
    if (tab !== 'home' || profileOpen) {
      backButton.show();
      backButton.onClick(handleBack);
    } else {
      backButton.hide();
    }
    return () => backButton.offClick(handleBack);
  }, [tab, profileOpen, isTelegram]);

  const activateSignals = () => {
    window.Telegram?.WebApp.HapticFeedback?.notificationOccurred('success');
    setActivated(true);
    setActivationOpen(false);
    setRequestedMode('demo');
    setTab('signals');
  };

  const confirmRegistration = () => {
    window.localStorage.setItem('sofia-referral-verified', '1');
    setRealRegistered(true);
    window.Telegram?.WebApp.HapticFeedback?.notificationOccurred('success');
  };

  const openReal = () => {
    haptic('medium');
    setRequestedMode('real');
    setProfileOpen(false);
    setTab('signals');
  };

  const openPair = (pair: Pair) => {
    haptic();
    setSelectedPair(pair);
    setRequestedMode('demo');
    setTab('signals');
  };

  const screen = useMemo(() => {
    if (tab === 'home') return <HomeScreen goTo={setTab} openPair={openPair} openReal={openReal} realRegistered={realRegistered} name={telegramName} />;
    if (tab === 'progress') return <ProgressScreen goTo={setTab} />;
    if (tab === 'signals') return <SignalsScreen goTo={setTab} initialSignalReady={activated && requestedMode === 'demo'} initialPair={selectedPair} initialMode={requestedMode} realRegistered={realRegistered} confirmRegistration={confirmRegistration} />;
    if (tab === 'academy') return <AcademyScreen openReal={openReal} />;
    return <SupportScreen />;
  }, [tab, activated, telegramName, selectedPair, requestedMode, realRegistered]);

  return (
    <main className="app-shell" ref={appRef}>
      {tab !== 'support' && <Header language={language} toggleLanguage={toggleLanguage} onProfile={() => { haptic(); setProfileOpen(true); }} />}
      {tab === 'support' && <button className="language-switch language-switch-floating" data-no-translate aria-label={language === 'ru' ? 'Cambiar al español' : 'Переключить на русский'} onClick={toggleLanguage}><span className={language === 'ru' ? 'active' : ''}>RU</span><span className={language === 'es' ? 'active' : ''}>ES</span></button>}
      {isTelegram && <div className="telegram-runtime-badge"><span>●</span> Telegram Mini App</div>}
      <div className="screen" key={tab}>{screen}</div>
      <nav className="bottom-nav" aria-label="Основная навигация">
        {navItems.map((item) => (
          <button className={tab === item.id ? 'active' : ''} key={item.id} onClick={() => { haptic(); setTab(item.id); }} aria-current={tab === item.id ? 'page' : undefined}>
            {item.icon}<span>{item.label}</span>
          </button>
        ))}
      </nav>
      {profileOpen && <ProfileSheet close={() => setProfileOpen(false)} realRegistered={realRegistered} openReal={openReal} openSupport={() => { setProfileOpen(false); setTab('support'); }} name={telegramName} />}
      {activationOpen && <ActivationGate activate={activateSignals} skip={() => { haptic(); setActivationOpen(false); }} />}
    </main>
  );
}
