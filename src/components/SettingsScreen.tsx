import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface SettingsScreenProps {
  onLogout: () => void;
}

export default function SettingsScreen({ onLogout }: SettingsScreenProps) {
  const [notifications, setNotifications] = useState(true);
  const [sounds, setSounds] = useState(true);
  const [darkMode] = useState(true);
  const [language, setLanguage] = useState('ru');
  const [msgTimer, setMsgTimer] = useState('never');

  const Toggle = ({ value, onChange }: { value: boolean; onChange: (v: boolean) => void }) => (
    <button
      onClick={() => onChange(!value)}
      className="relative w-11 h-6 rounded-full transition-all flex-shrink-0"
      style={{
        background: value ? 'rgba(0,255,245,0.3)' : 'var(--surface-4)',
        border: `1px solid ${value ? 'var(--ghost-cyan-glow)' : 'transparent'}`,
        boxShadow: value ? '0 0 10px var(--ghost-cyan-dim)' : 'none',
      }}
    >
      <span className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
        style={{ left: value ? 'calc(100% - 22px)' : '2px', background: value ? 'var(--ghost-cyan)' : '#555' }} />
    </button>
  );

  const sections = [
    {
      title: 'УВЕДОМЛЕНИЯ',
      items: [
        { label: 'Push-уведомления', value: notifications, onChange: setNotifications },
        { label: 'Звуки сообщений', value: sounds, onChange: setSounds },
        { label: 'Тёмная тема', value: darkMode, onChange: () => {} },
      ]
    }
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--ghost-cyan-dim)', background: 'var(--surface-2)' }}>
        <h2 className="font-unbounded text-base font-semibold" style={{ color: 'var(--ghost-cyan)' }}>Настройки</h2>
      </div>

      <div className="p-4 space-y-4">
        {sections.map(section => (
          <div key={section.title} className="ghost-card overflow-hidden">
            <div className="px-4 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <p className="text-xs font-mono" style={{ color: 'var(--ghost-cyan)', opacity: 0.6 }}>{section.title}</p>
            </div>
            {section.items.map((item, i) => (
              <div
                key={item.label}
                className="flex items-center justify-between px-4 py-3.5 border-b"
                style={{ borderColor: i === section.items.length - 1 ? 'transparent' : 'rgba(255,255,255,0.04)' }}
              >
                <span className="text-sm" style={{ color: '#e0e0e0' }}>{item.label}</span>
                <Toggle value={item.value} onChange={item.onChange} />
              </div>
            ))}
          </div>
        ))}

        <div className="ghost-card overflow-hidden">
          <div className="px-4 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            <p className="text-xs font-mono" style={{ color: 'var(--ghost-cyan)', opacity: 0.6 }}>СООБЩЕНИЯ</p>
          </div>
          <div className="px-4 py-3.5 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            <p className="text-sm mb-2" style={{ color: '#e0e0e0' }}>Автоудаление сообщений</p>
            <div className="flex gap-2 flex-wrap">
              {['never', '1h', '24h', '7d'].map(t => (
                <button
                  key={t}
                  onClick={() => setMsgTimer(t)}
                  className="px-3 py-1 rounded-lg text-xs font-mono transition-all"
                  style={{
                    background: msgTimer === t ? 'rgba(0,255,245,0.2)' : 'var(--surface-3)',
                    border: `1px solid ${msgTimer === t ? 'var(--ghost-cyan-glow)' : 'var(--surface-4)'}`,
                    color: msgTimer === t ? 'var(--ghost-cyan)' : '#888'
                  }}
                >
                  {t === 'never' ? 'Никогда' : t === '1h' ? '1 час' : t === '24h' ? '24 часа' : '7 дней'}
                </button>
              ))}
            </div>
          </div>
          <div className="px-4 py-3.5">
            <p className="text-sm mb-2" style={{ color: '#e0e0e0' }}>Язык интерфейса</p>
            <div className="flex gap-2">
              {[{ code: 'ru', label: '🇷🇺 Русский' }, { code: 'en', label: '🇺🇸 English' }].map(l => (
                <button
                  key={l.code}
                  onClick={() => setLanguage(l.code)}
                  className="px-3 py-1.5 rounded-lg text-xs font-mono transition-all"
                  style={{
                    background: language === l.code ? 'rgba(0,255,245,0.2)' : 'var(--surface-3)',
                    border: `1px solid ${language === l.code ? 'var(--ghost-cyan-glow)' : 'var(--surface-4)'}`,
                    color: language === l.code ? 'var(--ghost-cyan)' : '#888'
                  }}
                >
                  {l.label}
                </button>
              ))}
            </div>
          </div>
        </div>

        <div className="ghost-card overflow-hidden">
          <div className="px-4 py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
            <p className="text-xs font-mono" style={{ color: 'var(--ghost-cyan)', opacity: 0.6 }}>О ПРИЛОЖЕНИИ</p>
          </div>
          {[
            { label: 'Версия', value: '1.0.0' },
            { label: 'Протокол', value: 'Ghost-E2E v3' },
            { label: 'Шифрование', value: 'AES-256-GCM' },
            { label: 'Политика', value: 'Zero-Knowledge' },
          ].map((item, i, arr) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-4 py-3 border-b"
              style={{ borderColor: i === arr.length - 1 ? 'transparent' : 'rgba(255,255,255,0.04)' }}
            >
              <span className="text-sm text-gray-500 font-mono">{item.label}</span>
              <span className="text-sm font-mono" style={{ color: '#888' }}>{item.value}</span>
            </div>
          ))}
        </div>

        <div className="space-y-2">
          <button className="ghost-btn ghost-btn-danger w-full flex items-center justify-center gap-2 py-3"
            onClick={onLogout}>
            <Icon name="LogOut" size={16} />
            Выйти из аккаунта
          </button>
        </div>
      </div>
    </div>
  );
}
