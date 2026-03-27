import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface ProfileScreenProps {
  username: string;
}

export default function ProfileScreen({ username }: ProfileScreenProps) {
  const [editMode, setEditMode] = useState(false);
  const [nick, setNick] = useState(username);
  const [bio, setBio] = useState('Анонимность — это свобода 👻');
  const [savedNick, setSavedNick] = useState(username);
  const [savedBio, setSavedBio] = useState('Анонимность — это свобода 👻');

  const avatarEmojis = ['👤', '👻', '🕶️', '🌑', '🎭', '🦊', '🐺', '🦅'];
  const [avatar, setAvatar] = useState(0);

  const handleSave = () => {
    setSavedNick(nick);
    setSavedBio(bio);
    setEditMode(false);
  };

  const stats = [
    { label: 'Сообщений', value: '1,248' },
    { label: 'Звонков', value: '73' },
    { label: 'Дней онлайн', value: '42' },
  ];

  return (
    <div className="flex flex-col h-full overflow-y-auto">
      <div className="px-4 py-4 border-b flex items-center justify-between" style={{ borderColor: 'var(--ghost-cyan-dim)', background: 'var(--surface-2)' }}>
        <h2 className="font-unbounded text-base font-semibold" style={{ color: 'var(--ghost-cyan)' }}>Профиль</h2>
        <button
          onClick={() => setEditMode(!editMode)}
          className="ghost-btn text-xs"
        >
          {editMode ? '✕ Отмена' : '✎ Изменить'}
        </button>
      </div>

      <div className="p-5 space-y-5">
        <div className="ghost-card p-5 text-center ghost-glow">
          <div className="relative mx-auto w-fit mb-4">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl mx-auto"
              style={{ background: 'var(--surface-3)', border: '2px solid var(--ghost-cyan-glow)', boxShadow: '0 0 30px var(--ghost-cyan-dim)' }}>
              {avatarEmojis[avatar]}
            </div>
          </div>

          {editMode ? (
            <div className="flex gap-2 justify-center mb-4 flex-wrap">
              {avatarEmojis.map((e, i) => (
                <button
                  key={i}
                  onClick={() => setAvatar(i)}
                  className="text-2xl p-2 rounded-lg transition-all"
                  style={{
                    background: avatar === i ? 'var(--ghost-cyan-dim)' : 'var(--surface-3)',
                    border: `1px solid ${avatar === i ? 'var(--ghost-cyan-glow)' : 'transparent'}`
                  }}
                >
                  {e}
                </button>
              ))}
            </div>
          ) : null}

          {editMode ? (
            <input
              className="ghost-input text-center text-lg font-semibold mb-2"
              value={nick}
              onChange={e => setNick(e.target.value)}
              maxLength={24}
            />
          ) : (
            <h3 className="font-mono font-semibold text-xl mb-1" style={{ color: '#e0e0e0' }}>{savedNick}</h3>
          )}

          {editMode ? (
            <input
              className="ghost-input text-center text-sm text-gray-400"
              value={bio}
              onChange={e => setBio(e.target.value)}
              maxLength={60}
              placeholder="О себе..."
            />
          ) : (
            <p className="text-sm text-gray-400 font-mono mt-1">{savedBio}</p>
          )}

          {editMode && (
            <button onClick={handleSave} className="ghost-btn mt-4 w-full">
              ✓ Сохранить
            </button>
          )}
        </div>

        <div className="grid grid-cols-3 gap-3">
          {stats.map(stat => (
            <div key={stat.label} className="ghost-card p-3 text-center">
              <p className="font-mono font-bold text-xl" style={{ color: 'var(--ghost-cyan)' }}>{stat.value}</p>
              <p className="text-xs text-gray-500 font-mono mt-1">{stat.label}</p>
            </div>
          ))}
        </div>

        <div className="ghost-card p-4 space-y-3">
          <h4 className="text-xs font-mono mb-3" style={{ color: 'var(--ghost-cyan)', opacity: 0.7 }}>ДАННЫЕ АККАУНТА</h4>
          {[
            { label: 'ID призрака', value: '#' + Math.random().toString(36).slice(2, 10).toUpperCase() },
            { label: 'Тип аккаунта', value: 'Анонимный' },
            { label: 'Регистрация', value: '28.03.2026' },
            { label: 'Шифрование', value: 'AES-256' },
          ].map(row => (
            <div key={row.label} className="flex items-center justify-between py-2 border-b" style={{ borderColor: 'rgba(255,255,255,0.04)' }}>
              <span className="text-sm text-gray-500 font-mono">{row.label}</span>
              <span className="text-sm font-mono" style={{ color: '#c8c8c8' }}>{row.value}</span>
            </div>
          ))}
        </div>

        <div className="ghost-card p-4 space-y-2">
          <h4 className="text-xs font-mono mb-3" style={{ color: 'var(--ghost-cyan)', opacity: 0.7 }}>БЫСТРЫЕ ДЕЙСТВИЯ</h4>
          <button className="ghost-btn w-full text-sm text-left flex items-center gap-2 py-2.5">
            <Icon name="QrCode" size={16} />
            Мой QR-код
          </button>
          <button className="ghost-btn w-full text-sm text-left flex items-center gap-2 py-2.5">
            <Icon name="Copy" size={16} />
            Скопировать ссылку
          </button>
          <button className="ghost-btn w-full text-sm text-left flex items-center gap-2 ghost-btn-danger py-2.5">
            <Icon name="Trash2" size={16} />
            Удалить аккаунт
          </button>
        </div>
      </div>
    </div>
  );
}
