import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface AIMessage {
  id: number;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

function speakGruff(text: string) {
  if (!('speechSynthesis' in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.lang = 'ru-RU';
  utter.rate = 0.7;
  utter.pitch = 0.2;
  utter.volume = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const ruVoice = voices.find(v => v.lang.startsWith('ru') && v.name.toLowerCase().includes('male'))
    || voices.find(v => v.lang.startsWith('ru'))
    || voices[0];
  if (ruVoice) utter.voice = ruVoice;
  window.speechSynthesis.speak(utter);
}

function getAIResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('привет') || lower.includes('здарова') || lower.includes('hello') || lower.includes('хай'))
    return 'Ну здарова, чё как, братан? 👻 Я тут главный по кибербезу. Соединение чистое, базарь чё хочешь, блин.';
  if (lower.includes('аноним') || lower.includes('приватн') || lower.includes('vpn'))
    return 'Слушай сюда, ёпта. Ставь VPN, потом Tor поверх, геолокацию нахер выруби, куки чисти. E2E у нас и так пашет. Делай как говорю — и хрен тебя кто найдёт.';
  if (lower.includes('безопас') || lower.includes('шифр') || lower.includes('защит'))
    return 'Бля, тут всё зашифровано так, что даже я хер прочитаю. AES-256, ноль логов, ноль телеметрии. Расслабься, братишка, мы тут как призраки — невидимые нахер.';
  if (lower.includes('помог') || lower.includes('умеешь') || lower.includes('что можешь'))
    return 'Ёпт, да я много чё могу. Отвечаю на вопросы, помогаю с задачами, даю советы по безопасности. Всё строго между нами, никаких стукачей тут нет, бро.';
  if (lower.includes('как дел') || lower.includes('чё нов'))
    return 'Да нормально всё, блин, пашу тут 24/7 без перекуров. Что за вопросы, давай по делу, братан.';
  if (lower.includes('спасибо') || lower.includes('благодар'))
    return 'Да ладно, хорош подлизываться, ёпта. Обращайся если чё, я тут всегда.';

  const generic = [
    `Хм, "${text.slice(0,25)}" говоришь... Ну слушай, бро, тема интересная нахер. Давай подробнее расскажи, чё конкретно надо — я разберусь.`,
    `Ёпта, "${text.slice(0,25)}" — серьёзная тема. Дай подумать, блин... Окей, могу помочь, но давай конкретику, братан.`,
    `Бля, ну ты загнул — "${text.slice(0,25)}". Ладно, не ссы, разрулим. Уточни чё именно нужно, и я тебе всё разжую.`,
    `О, "${text.slice(0,25)}" — нормальный вопрос, братишка. Щас прикину... Ладно, давай подробности, и я тебе растолкую по-хакерски.`,
  ];
  return generic[Math.floor(Math.random() * generic.length)];
}

const SUGGESTIONS = [
  'Здарова, чё умеешь?',
  'Как защитить приватность?',
  'Расскажи про шифрование',
  'Как работает VPN?',
];

export default function AIScreen() {
  const greetText = 'Ну чё, братан, Ghost AI на связи 🔒 Канал защищён нахер, базарь чё хочешь. Я тут главный по кибербезу, ёпта.';
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 1,
      role: 'ai',
      text: greetText,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    window.speechSynthesis.getVoices();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim() || typing) return;
    const now = new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text, time: now }]);
    setInput('');
    setTyping(true);

    speakGruff(text);

    const delay = 600 + text.length * 20;
    setTimeout(() => {
      setTyping(false);
      const reply = getAIResponse(text);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: reply,
        time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      }]);
      setTimeout(() => speakGruff(reply), 300);
    }, Math.min(delay, 2500));
  };

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-3 border-b flex items-center gap-3" style={{ borderColor: 'var(--ghost-cyan-dim)', background: 'var(--surface-2)' }}>
        <div className="pulse-ring w-9 h-9 rounded-full flex items-center justify-center text-lg"
          style={{ background: 'rgba(180,79,255,0.15)', border: '1px solid rgba(180,79,255,0.3)' }}>
          🤖
        </div>
        <div>
          <h2 className="font-unbounded text-sm font-semibold" style={{ color: '#e0e0e0' }}>Ghost AI 🗣️</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--ghost-green)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--ghost-green)' }}>
              {typing ? 'печатает, бля...' : 'онлайн · грубый режим'}
            </span>
          </div>
        </div>
        <div className="ml-auto security-badge">🔒 Приватный</div>
      </div>

      <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'var(--surface-1)' }}>
        {messages.map(msg => (
          <div key={msg.id} className={`flex gap-2 animate-fade-in ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            {msg.role === 'ai' && (
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0 self-end"
                style={{ background: 'rgba(180,79,255,0.15)', border: '1px solid rgba(180,79,255,0.3)' }}>
                🤖
              </div>
            )}
            <div className={msg.role === 'user' ? 'message-bubble-out' : 'message-bubble-in'} style={msg.role === 'ai' ? {
              borderColor: 'rgba(180,79,255,0.2)',
              background: 'rgba(180,79,255,0.06)'
            } : {}}>
              <p>{msg.text}</p>
              <p className="text-xs font-mono mt-1.5" style={{ color: '#555' }}>{msg.time}</p>
            </div>
          </div>
        ))}
        {typing && (
          <div className="flex gap-2 items-end animate-fade-in">
            <div className="w-8 h-8 rounded-full flex items-center justify-center text-base flex-shrink-0"
              style={{ background: 'rgba(180,79,255,0.15)', border: '1px solid rgba(180,79,255,0.3)' }}>
              🤖
            </div>
            <div className="message-bubble-in" style={{ borderColor: 'rgba(180,79,255,0.2)', background: 'rgba(180,79,255,0.06)' }}>
              <div className="flex gap-1 items-center h-5">
                {[0,1,2].map(i => (
                  <span key={i} className="w-1.5 h-1.5 rounded-full" style={{
                    background: 'var(--ghost-purple)',
                    animation: `blink 1.2s ${i * 0.2}s ease-in-out infinite`
                  }} />
                ))}
              </div>
            </div>
          </div>
        )}
        <div ref={endRef} />
      </div>

      {messages.length === 1 && (
        <div className="px-4 pb-2">
          <div className="flex flex-wrap gap-2">
            {SUGGESTIONS.map(s => (
              <button
                key={s}
                onClick={() => sendMessage(s)}
                className="text-xs px-3 py-1.5 rounded-full font-mono transition-all hover:scale-105"
                style={{
                  background: 'var(--surface-3)',
                  border: '1px solid rgba(180,79,255,0.25)',
                  color: 'rgba(180,79,255,0.8)'
                }}
              >
                {s}
              </button>
            ))}
          </div>
        </div>
      )}

      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--ghost-cyan-dim)', background: 'var(--surface-2)' }}>
        <div className="flex gap-2 items-center">
          <input
            className="ghost-input flex-1"
            placeholder="Спроси что угодно..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage(input)}
            disabled={typing}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || typing}
            className="p-2.5 rounded-lg transition-all flex-shrink-0"
            style={{
              background: input.trim() && !typing ? 'rgba(180,79,255,0.2)' : 'var(--surface-3)',
              border: '1px solid rgba(180,79,255,0.3)',
              color: 'var(--ghost-purple)'
            }}
          >
            <Icon name="Send" size={18} />
          </button>
        </div>
      </div>
    </div>
  );
}