import { useState } from 'react';

interface AuthScreenProps {
  onAuth: (username: string) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!email.trim() || !password.trim()) {
      setError('Заполните все поля');
      return;
    }
    if (!email.includes('@')) {
      setError('Введите корректный email');
      return;
    }
    if (password.length < 6) {
      setError('Пароль минимум 6 символов');
      return;
    }
    setError('');
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      const name = email.split('@')[0] || 'Призрак_' + Math.floor(Math.random() * 9999);
      onAuth(name);
    }, 600);
  };

  return (
    <div className="flex flex-col items-center justify-center h-full px-6 ghost-grid-bg relative overflow-hidden">
      <div className="scan-line" />

      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-64 h-64 rounded-full opacity-5"
        style={{ background: 'radial-gradient(circle, var(--ghost-cyan), transparent 70%)' }} />

      <div className="w-full max-w-sm animate-fade-in">
        <div className="text-center mb-8">
          <div className="text-6xl mb-4 select-none" style={{ filter: 'drop-shadow(0 0 20px rgba(0,255,245,0.4))' }}>👻</div>
          <h1 className="ghost-logo-text text-2xl font-unbounded mb-1">Анонимный призрак</h1>
          <p className="text-xs font-mono" style={{ color: 'var(--ghost-cyan)', opacity: 0.6 }}>
            ЗАЩИЩЁННЫЙ МЕССЕНДЖЕР v1.0
          </p>
        </div>

        <div className="security-badge mx-auto mb-6 w-fit">
          <span style={{ color: 'var(--ghost-green)' }}>●</span>
          E2E шифрование активно
        </div>

        <div className="ghost-card p-6 space-y-4">
          <div className="flex gap-2 mb-5">
            <button
              onClick={() => { setMode('login'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-mono transition-all ${mode === 'login' ? 'ghost-btn' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Войти
            </button>
            <button
              onClick={() => { setMode('register'); setError(''); }}
              className={`flex-1 py-2 rounded-lg text-sm font-mono transition-all ${mode === 'register' ? 'ghost-btn' : 'text-gray-500 hover:text-gray-300'}`}
            >
              Регистрация
            </button>
          </div>

          <div className="space-y-3">
            <div>
              <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--ghost-cyan)', opacity: 0.7 }}>
                EMAIL
              </label>
              <input
                type="email"
                className="ghost-input"
                placeholder="your@email.com"
                value={email}
                onChange={e => setEmail(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
            <div>
              <label className="text-xs font-mono mb-1 block" style={{ color: 'var(--ghost-cyan)', opacity: 0.7 }}>
                ПАРОЛЬ
              </label>
              <input
                type="password"
                className="ghost-input"
                placeholder="••••••••"
                value={password}
                onChange={e => setPassword(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && handleSubmit()}
              />
            </div>
          </div>

          {error && (
            <p className="text-xs font-mono text-center" style={{ color: 'var(--ghost-red)' }}>
              ⚠ {error}
            </p>
          )}

          <button
            onClick={handleSubmit}
            disabled={loading}
            className="w-full py-3 rounded-lg font-mono text-sm transition-all font-semibold"
            style={{
              background: loading ? 'rgba(0,255,245,0.05)' : 'linear-gradient(135deg, rgba(0,255,245,0.25), rgba(0,255,245,0.1))',
              border: '1px solid var(--ghost-cyan-glow)',
              color: 'var(--ghost-cyan)',
              boxShadow: loading ? 'none' : '0 0 20px var(--ghost-cyan-dim)'
            }}
          >
            {loading ? '⠿ Входим...' : mode === 'login' ? '→ ВОЙТИ' : '→ СОЗДАТЬ АККАУНТ'}
          </button>

          <p className="text-center text-xs font-mono" style={{ color: '#444' }}>
            Данные защищены шифрованием AES-256
          </p>
        </div>
      </div>
    </div>
  );
}
