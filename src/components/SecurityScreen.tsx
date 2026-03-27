import { useState } from 'react';
import Icon from '@/components/ui/icon';

export default function SecurityScreen() {
  const [twoFA, setTwoFA] = useState(true);
  const [biometric, setBiometric] = useState(true);
  const [autoDelete, setAutoDelete] = useState(false);
  const [vpn, setVpn] = useState(true);
  const [hideOnline, setHideOnline] = useState(false);
  const [antiscreen, setAntiscreen] = useState(true);

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
      <span
        className="absolute top-0.5 w-5 h-5 rounded-full transition-all"
        style={{
          left: value ? 'calc(100% - 22px)' : '2px',
          background: value ? 'var(--ghost-cyan)' : '#555',
        }}
      />
    </button>
  );

  const secItems = [
    { label: '2FA аутентификация', desc: 'Двойная защита при входе', value: twoFA, onChange: setTwoFA, icon: 'ShieldCheck' },
    { label: 'Биометрия', desc: 'Отпечаток / Face ID', value: biometric, onChange: setBiometric, icon: 'Fingerprint' },
    { label: 'VPN защита', desc: 'Скрыть реальный IP', value: vpn, onChange: setVpn, icon: 'Wifi' },
    { label: 'Скрыть онлайн-статус', desc: 'Никто не видит, когда вы в сети', value: hideOnline, onChange: setHideOnline, icon: 'EyeOff' },
    { label: 'Защита от скриншотов', desc: 'Блокировать захват экрана', value: antiscreen, onChange: setAntiscreen, icon: 'Camera' },
    { label: 'Авто-удаление сообщений', desc: 'Удалять чаты через 24 часа', value: autoDelete, onChange: setAutoDelete, icon: 'Trash2' },
  ];

  const secScore = [twoFA, biometric, vpn, hideOnline, antiscreen, autoDelete].filter(Boolean).length;
  const scorePercent = Math.round((secScore / 6) * 100);
  const scoreColor = scorePercent >= 80 ? 'var(--ghost-green)' : scorePercent >= 50 ? 'var(--ghost-cyan)' : 'var(--ghost-red)';

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--ghost-cyan-dim)', background: 'var(--surface-2)' }}>
        <h2 className="font-unbounded text-base font-semibold" style={{ color: 'var(--ghost-cyan)' }}>Безопасность</h2>
      </div>

      <div className="p-5 space-y-4">
        <div className="ghost-card p-5 ghost-glow">
          <div className="flex items-center justify-between mb-3">
            <div>
              <h3 className="font-mono font-semibold text-sm" style={{ color: '#e0e0e0' }}>Уровень защиты</h3>
              <p className="text-xs text-gray-500 font-mono mt-0.5">{secScore} из 6 мер активны</p>
            </div>
            <div className="text-3xl font-unbounded font-bold" style={{ color: scoreColor }}>
              {scorePercent}%
            </div>
          </div>
          <div className="h-2 rounded-full overflow-hidden" style={{ background: 'var(--surface-4)' }}>
            <div
              className="h-full rounded-full transition-all duration-500"
              style={{
                width: `${scorePercent}%`,
                background: `linear-gradient(90deg, ${scoreColor}, ${scoreColor}88)`,
                boxShadow: `0 0 8px ${scoreColor}55`
              }}
            />
          </div>
          <div className="flex items-center gap-2 mt-3">
            <span className="w-2 h-2 rounded-full" style={{ background: scoreColor }} />
            <span className="text-xs font-mono" style={{ color: scoreColor }}>
              {scorePercent >= 80 ? 'Высокий уровень защиты' : scorePercent >= 50 ? 'Средний уровень защиты' : 'Требуется усиление защиты'}
            </span>
          </div>
        </div>

        <div className="ghost-card overflow-hidden">
          {secItems.map((item, i) => (
            <div
              key={item.label}
              className="flex items-center justify-between px-4 py-3.5 border-b transition-all"
              style={{ borderColor: i === secItems.length - 1 ? 'transparent' : 'rgba(255,255,255,0.04)' }}
            >
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-lg flex items-center justify-center"
                  style={{
                    background: item.value ? 'rgba(0,255,245,0.1)' : 'var(--surface-3)',
                    border: `1px solid ${item.value ? 'var(--ghost-cyan-dim)' : 'var(--surface-4)'}`,
                  }}>
                  <Icon name={item.icon} size={16} style={{ color: item.value ? 'var(--ghost-cyan)' : '#555' }} fallback="Shield" />
                </div>
                <div>
                  <p className="text-sm font-semibold" style={{ color: '#e0e0e0' }}>{item.label}</p>
                  <p className="text-xs font-mono text-gray-500">{item.desc}</p>
                </div>
              </div>
              <Toggle value={item.value} onChange={item.onChange} />
            </div>
          ))}
        </div>

        <div className="ghost-card p-4">
          <h4 className="text-xs font-mono mb-3" style={{ color: 'var(--ghost-cyan)', opacity: 0.7 }}>ДОПОЛНИТЕЛЬНО</h4>
          <div className="space-y-2">
            <button className="ghost-btn w-full text-sm text-left flex items-center gap-2 py-2.5">
              <Icon name="Key" size={16} />
              Сменить пароль
            </button>
            <button className="ghost-btn w-full text-sm text-left flex items-center gap-2 py-2.5">
              <Icon name="RefreshCw" size={16} />
              Пересоздать ключи шифрования
            </button>
            <button className="ghost-btn w-full text-sm text-left flex items-center gap-2 py-2.5">
              <Icon name="Download" size={16} />
              Экспортировать резервный ключ
            </button>
            <button className="ghost-btn ghost-btn-danger w-full text-sm text-left flex items-center gap-2 py-2.5">
              <Icon name="AlertTriangle" size={16} />
              Аварийное удаление данных
            </button>
          </div>
        </div>

        <div className="ghost-card p-3 flex items-start gap-3">
          <span className="text-xl">🛡️</span>
          <div>
            <p className="text-sm font-semibold font-mono" style={{ color: '#e0e0e0' }}>Нулевое хранение логов</p>
            <p className="text-xs text-gray-500 font-mono mt-0.5">Никакие данные не записываются. Полная анонимность гарантирована протоколом Zero-Knowledge.</p>
          </div>
        </div>
      </div>
    </div>
  );
}