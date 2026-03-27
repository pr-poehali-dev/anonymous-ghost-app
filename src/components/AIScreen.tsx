import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface AIMessage {
  id: number;
  role: 'user' | 'ai';
  text: string;
  time: string;
}

const AI_RESPONSES: Record<string, string> = {
  default: 'Я ваш анонимный AI-ассистент. Работаю локально, без передачи данных серверам. Чем могу помочь?',
  privacy: 'Для максимальной анонимности: используйте VPN/Tor, отключите геолокацию, регулярно очищайте данные сессий. Ваши сообщения шифруются E2E.',
  safe: 'Все данные зашифрованы. Никаких логов. Никакой телеметрии. Ваша приватность — приоритет.',
  hello: 'Приветствую, Призрак 👻 Соединение защищено. Готов помочь.',
  help: 'Я умею: отвечать на вопросы, помогать с задачами, давать советы по безопасности и анонимности. Всё строго конфиденциально.',
};

function getAIResponse(text: string): string {
  const lower = text.toLowerCase();
  if (lower.includes('привет') || lower.includes('здарова') || lower.includes('hello')) return AI_RESPONSES.hello;
  if (lower.includes('аноним') || lower.includes('приватн') || lower.includes('vpn')) return AI_RESPONSES.privacy;
  if (lower.includes('безопас') || lower.includes('шифр') || lower.includes('защит')) return AI_RESPONSES.safe;
  if (lower.includes('помог') || lower.includes('умеешь') || lower.includes('что можешь')) return AI_RESPONSES.help;
  const generic = [
    `Интересный вопрос. Анализирую в защищённом режиме... "${text}" — это тема требует внимательного рассмотрения с учётом вашей приватности.`,
    `Обрабатываю запрос локально. Все данные остаются на устройстве. По теме "${text.slice(0,30)}..." — расскажите подробнее, чтобы дать точный ответ.`,
    `Понял вас. Работаю без интернета для защиты данных. Могу дать развёрнутый ответ на "${text.slice(0,25)}..." — уточните контекст.`,
  ];
  return generic[Math.floor(Math.random() * generic.length)];
}

const SUGGESTIONS = [
  'Как защитить приватность?',
  'Советы по анонимности',
  'Что такое E2E шифрование?',
  'Как работает VPN?',
];

export default function AIScreen() {
  const [messages, setMessages] = useState<AIMessage[]>([
    {
      id: 1,
      role: 'ai',
      text: 'Анонимный AI-ассистент онлайн 🔒 Работаю в защищённом режиме. Ваши данные не покидают устройство. Чем могу помочь?',
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
    }
  ]);
  const [input, setInput] = useState('');
  const [typing, setTyping] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, typing]);

  const sendMessage = (text: string) => {
    if (!text.trim() || typing) return;
    const now = new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' });
    setMessages(prev => [...prev, { id: Date.now(), role: 'user', text, time: now }]);
    setInput('');
    setTyping(true);
    const delay = 600 + text.length * 20;
    setTimeout(() => {
      setTyping(false);
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        role: 'ai',
        text: getAIResponse(text),
        time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      }]);
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
          <h2 className="font-unbounded text-sm font-semibold" style={{ color: '#e0e0e0' }}>Ghost AI</h2>
          <div className="flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 rounded-full" style={{ background: 'var(--ghost-green)' }} />
            <span className="text-xs font-mono" style={{ color: 'var(--ghost-green)' }}>
              {typing ? 'печатает...' : 'онлайн · локальный режим'}
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
