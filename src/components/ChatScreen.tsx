import { useState, useRef, useEffect } from 'react';
import Icon from '@/components/ui/icon';

interface Message {
  id: number;
  text: string;
  out: boolean;
  time: string;
  status?: 'sent' | 'read';
}

interface Contact {
  id: number;
  name: string;
  lastMsg: string;
  time: string;
  online: boolean;
  unread?: number;
  avatar: string;
}

const DEMO_CONTACTS: Contact[] = [
  { id: 1, name: 'Призрак_7842', lastMsg: 'Всё чисто, до связи', time: '23:14', online: true, unread: 2, avatar: '👤' },
  { id: 2, name: 'Тень_0019', lastMsg: 'Понял тебя', time: '22:58', online: false, avatar: '🕶️' },
  { id: 3, name: 'X_Shadow', lastMsg: 'Никаких следов', time: '21:30', online: true, avatar: '🌑' },
  { id: 4, name: 'Anon_442', lastMsg: 'Шифр получен', time: '20:05', online: false, avatar: '🎭' },
];

const DEMO_MESSAGES: Message[] = [
  { id: 1, text: 'Соединение установлено. Канал зашифрован.', out: false, time: '22:50', status: 'read' },
  { id: 2, text: 'Понял, жду данные', out: true, time: '22:51', status: 'read' },
  { id: 3, text: 'Данные отправлены. E2E шифрование активно. Никаких логов.', out: false, time: '22:53', status: 'read' },
  { id: 4, text: 'Отлично. Всё чисто, до связи', out: false, time: '23:14', status: 'sent' },
];

export default function ChatScreen() {
  const [activeContact, setActiveContact] = useState<Contact | null>(null);
  const [messages, setMessages] = useState<Message[]>(DEMO_MESSAGES);
  const [input, setInput] = useState('');
  const [contacts] = useState<Contact[]>(DEMO_CONTACTS);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, activeContact]);

  const sendMessage = () => {
    if (!input.trim()) return;
    const newMsg: Message = {
      id: Date.now(),
      text: input,
      out: true,
      time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      status: 'sent',
    };
    setMessages(prev => [...prev, newMsg]);
    setInput('');

    setTimeout(() => {
      const replies = [
        'Сообщение получено 🔒',
        'Канал защищён, продолжай',
        'Никаких следов. Понял тебя.',
        'E2E активно. Всё чисто.',
      ];
      setMessages(prev => [...prev, {
        id: Date.now() + 1,
        text: replies[Math.floor(Math.random() * replies.length)],
        out: false,
        time: new Date().toLocaleTimeString('ru', { hour: '2-digit', minute: '2-digit' }),
      }]);
    }, 1200);
  };

  if (activeContact) {
    return (
      <div className="flex flex-col h-full animate-fade-in">
        <div className="flex items-center gap-3 px-4 py-3 border-b" style={{ borderColor: 'var(--ghost-cyan-dim)', background: 'var(--surface-2)' }}>
          <button
            onClick={() => setActiveContact(null)}
            className="p-1.5 rounded-lg hover:bg-white/5 transition-colors"
          >
            <Icon name="ChevronLeft" size={20} style={{ color: 'var(--ghost-cyan)' }} />
          </button>
          <div className="text-2xl">{activeContact.avatar}</div>
          <div className="flex-1">
            <p className="text-sm font-semibold font-mono" style={{ color: '#e0e0e0' }}>{activeContact.name}</p>
            <div className="flex items-center gap-1.5">
              <span className="w-1.5 h-1.5 rounded-full" style={{ background: activeContact.online ? 'var(--ghost-green)' : '#555' }} />
              <span className="text-xs font-mono" style={{ color: activeContact.online ? 'var(--ghost-green)' : '#555' }}>
                {activeContact.online ? 'в сети' : 'не в сети'}
              </span>
            </div>
          </div>
          <div className="security-badge text-xs">
            <span>🔒</span> E2E
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-3" style={{ background: 'var(--surface-1)' }}>
          <div className="text-center">
            <span className="text-xs font-mono px-3 py-1 rounded-full" style={{ background: 'var(--surface-3)', color: '#555' }}>
              🔐 Конец-в-конец шифрование включено
            </span>
          </div>
          {messages.map(msg => (
            <div key={msg.id} className={`flex ${msg.out ? 'justify-end' : 'justify-start'} animate-fade-in`}>
              <div>
                {msg.out ? (
                  <div className="message-bubble-out">{msg.text}</div>
                ) : (
                  <div className="message-bubble-in">{msg.text}</div>
                )}
                <div className={`flex items-center gap-1 mt-1 text-xs font-mono text-gray-600 ${msg.out ? 'justify-end' : ''}`}>
                  <span>{msg.time}</span>
                  {msg.out && msg.status === 'read' && <Icon name="CheckCheck" size={12} style={{ color: 'var(--ghost-cyan)' }} />}
                  {msg.out && msg.status === 'sent' && <Icon name="Check" size={12} style={{ color: '#666' }} />}
                </div>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--ghost-cyan-dim)', background: 'var(--surface-2)' }}>
          <div className="flex gap-2 items-center">
            <input
              className="ghost-input flex-1"
              placeholder="Зашифрованное сообщение..."
              value={input}
              onChange={e => setInput(e.target.value)}
              onKeyDown={e => e.key === 'Enter' && sendMessage()}
            />
            <button
              onClick={sendMessage}
              className="p-2.5 rounded-lg transition-all flex-shrink-0"
              style={{
                background: input.trim() ? 'rgba(0,255,245,0.2)' : 'var(--surface-3)',
                border: '1px solid var(--ghost-cyan-dim)',
                color: 'var(--ghost-cyan)'
              }}
            >
              <Icon name="Send" size={18} />
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--ghost-cyan-dim)', background: 'var(--surface-2)' }}>
        <h2 className="font-unbounded text-base font-semibold" style={{ color: 'var(--ghost-cyan)' }}>Сообщения</h2>
        <div className="mt-2">
          <input className="ghost-input text-sm" placeholder="🔍 Поиск контактов..." />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        {contacts.map((contact, i) => (
          <div
            key={contact.id}
            onClick={() => setActiveContact(contact)}
            className="flex items-center gap-3 px-4 py-3 cursor-pointer transition-all border-b"
            style={{
              borderColor: 'rgba(255,255,255,0.04)',
              animationDelay: `${i * 0.05}s`,
            }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="relative">
              <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
                style={{ background: 'var(--surface-3)', border: '1px solid var(--surface-4)' }}>
                {contact.avatar}
              </div>
              {contact.online && (
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full border-2"
                  style={{ background: 'var(--ghost-green)', borderColor: 'var(--surface-1)' }} />
              )}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold font-mono truncate" style={{ color: '#e0e0e0' }}>{contact.name}</p>
                <span className="text-xs font-mono text-gray-600 ml-2 flex-shrink-0">{contact.time}</span>
              </div>
              <p className="text-xs text-gray-500 truncate mt-0.5">{contact.lastMsg}</p>
            </div>
            {contact.unread && (
              <div className="w-5 h-5 rounded-full flex items-center justify-center text-xs font-mono font-bold flex-shrink-0"
                style={{ background: 'var(--ghost-cyan)', color: '#000' }}>
                {contact.unread}
              </div>
            )}
          </div>
        ))}
      </div>

      <div className="px-4 py-3 border-t" style={{ borderColor: 'var(--ghost-cyan-dim)' }}>
        <button className="ghost-btn w-full text-sm">
          + Новый анонимный чат
        </button>
      </div>
    </div>
  );
}
