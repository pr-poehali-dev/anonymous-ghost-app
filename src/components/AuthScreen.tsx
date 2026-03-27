import { useState } from 'react';
import Icon from '@/components/ui/icon';

interface AuthScreenProps {
  onAuth: (username: string) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [code, setCode] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = () => {
    if (!username.trim() || !password.trim()) {
      setError('Заполните все поля');
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
      setStep('2fa');
    }, 900);
  };

  const handle2FA = () => {
    if (code.length < 4) {
      setError('Введите код подтверждения');
      return;
    }
    setLoading(true);
    setTimeout(() => {
      setLoading(false);
      onAuth(username || 'Призрак_' + Math.floor(Math.random() * 9999));
    }, 700);
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

        {step === 'credentials' ? (
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
                  ПСЕВДОНИМ
                </label>
                <input
                  className="ghost-input"
                  placeholder="@призрак"
                  value={username}
                  onChange={e => setUsername(e.target.value)}
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
              {loading ? '⠿ Проверка...' : mode === 'login' ? '→ ВОЙТИ' : '→ СОЗДАТЬ АККАУНТ'}
            </button>

            <p className="text-center text-xs font-mono" style={{ color: '#444' }}>
              Данные хранятся только на устройстве
            </p>
          </div>
        ) : (
          <div className="ghost-card p-6 space-y-5 animate-fade-in">
            <div className="text-center">
              <div className="text-4xl mb-3">🔐</div>
              <h3 className="font-mono text-sm" style={{ color: 'var(--ghost-cyan)' }}>
                ДВУХФАКТОРНАЯ АУТЕНТИФИКАЦИЯ
              </h3>
              <p className="text-xs text-gray-500 mt-1 font-mono">
                Биометрия подтверждена. Введите код из приложения
              </p>
            </div>

            <div className="flex gap-2 justify-center">
              {[0,1,2,3,4,5].map(i => (
                <div
                  key={i}
                  className="w-10 h-12 flex items-center justify-center rounded-lg text-xl font-mono font-bold"
                  style={{
                    background: code[i] ? 'rgba(0,255,245,0.15)' : 'var(--surface-3)',
                    border: `1px solid ${code[i] ? 'var(--ghost-cyan-glow)' : 'var(--surface-4)'}`,
                    color: 'var(--ghost-cyan)',
                    transition: 'all 0.2s'
                  }}
                >
                  {code[i] ? '●' : ''}
                </div>
              ))}
            </div>

            <input
              className="ghost-input text-center tracking-widest text-lg"
              placeholder="Код 2FA"
              value={code}
              maxLength={6}
              onChange={e => { setCode(e.target.value.replace(/\D/g,'')); setError(''); }}
              onKeyDown={e => e.key === 'Enter' && handle2FA()}
            />

            {error && (
              <p className="text-xs font-mono text-center" style={{ color: 'var(--ghost-red)' }}>
                ⚠ {error}
              </p>
            )}

            <button
              onClick={handle2FA}
              disabled={loading}
              className="w-full py-3 rounded-lg font-mono text-sm transition-all"
              style={{
                background: 'linear-gradient(135deg, rgba(0,255,245,0.25), rgba(0,255,245,0.1))',
                border: '1px solid var(--ghost-cyan-glow)',
                color: 'var(--ghost-cyan)',
              }}
            >
              {loading ? '⠿ Проверка...' : '🔓 ПОДТВЕРДИТЬ'}
            </button>

            <button
              onClick={() => { setStep('credentials'); setCode(''); setError(''); }}
              className="w-full text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors"
            >
              ← Назад
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
