import { useState, useRef } from 'react';

const API_URL = 'https://functions.poehali.dev/e4bb05aa-6929-48b2-93df-581290a17bee';

interface AuthScreenProps {
  onAuth: (username: string) => void;
}

export default function AuthScreen({ onAuth }: AuthScreenProps) {
  const [mode, setMode] = useState<'login' | 'register'>('login');
  const [step, setStep] = useState<'credentials' | '2fa'>('credentials');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [digits, setDigits] = useState<string[]>(['', '', '', '', '', '']);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [resendCooldown, setResendCooldown] = useState(0);

  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const startCooldown = () => {
    setResendCooldown(60);
    const t = setInterval(() => {
      setResendCooldown(prev => {
        if (prev <= 1) { clearInterval(t); return 0; }
        return prev - 1;
      });
    }, 1000);
  };

  const handleSubmit = async () => {
    if (!username.trim() || !password.trim() || !email.trim()) {
      setError('Заполните все поля');
      return;
    }
    if (password.length < 6) {
      setError('Пароль минимум 6 символов');
      return;
    }
    if (!email.includes('@')) {
      setError('Введите корректный email');
      return;
    }
    setError('');
    setLoading(true);
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.success) {
        setStep('2fa');
        startCooldown();
      } else {
        setError(data.error || 'Ошибка отправки кода');
      }
    } catch {
      setError('Ошибка соединения. Проверьте интернет.');
    } finally {
      setLoading(false);
    }
  };

  const handleResend = async () => {
    if (resendCooldown > 0) return;
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'send', email: email.trim().toLowerCase() }),
      });
      const data = await res.json();
      if (data.success) {
        startCooldown();
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      } else {
        setError(data.error || 'Ошибка отправки');
      }
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  const handle2FA = async () => {
    const code = digits.join('');
    if (code.length < 6) {
      setError('Введите все 6 цифр кода');
      return;
    }
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email: email.trim().toLowerCase(), code }),
      });
      const data = await res.json();
      if (data.success) {
        onAuth(username.trim() || 'Призрак_' + Math.floor(Math.random() * 9999));
      } else {
        setError(data.error || 'Неверный код');
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitChange = (index: number, value: string) => {
    const digit = value.replace(/\D/g, '').slice(-1);
    const newDigits = [...digits];
    newDigits[index] = digit;
    setDigits(newDigits);
    setError('');
    if (digit && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
    if (newDigits.every(d => d !== '') && digit) {
      setTimeout(() => {
        const code = newDigits.join('');
        if (code.length === 6) handle2FAWithCode(newDigits);
      }, 100);
    }
  };

  const handle2FAWithCode = async (digs: string[]) => {
    const code = digs.join('');
    setLoading(true);
    setError('');
    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ action: 'verify', email: email.trim().toLowerCase(), code }),
      });
      const data = await res.json();
      if (data.success) {
        onAuth(username.trim() || 'Призрак_' + Math.floor(Math.random() * 9999));
      } else {
        setError(data.error || 'Неверный код');
        setDigits(['', '', '', '', '', '']);
        inputRefs.current[0]?.focus();
      }
    } catch {
      setError('Ошибка соединения');
    } finally {
      setLoading(false);
    }
  };

  const handleDigitKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (digits[index] === '' && index > 0) {
        inputRefs.current[index - 1]?.focus();
      } else {
        const newDigits = [...digits];
        newDigits[index] = '';
        setDigits(newDigits);
      }
    } else if (e.key === 'Enter') {
      handle2FA();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6);
    if (pasted.length > 0) {
      const newDigits = [...digits];
      pasted.split('').forEach((d, i) => { newDigits[i] = d; });
      setDigits(newDigits);
      const nextEmpty = newDigits.findIndex(d => d === '');
      const focusIdx = nextEmpty === -1 ? 5 : nextEmpty;
      inputRefs.current[focusIdx]?.focus();
    }
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
                  EMAIL (для 2FA кода)
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
              {loading ? '⠿ Отправляем код...' : mode === 'login' ? '→ ВОЙТИ' : '→ СОЗДАТЬ АККАУНТ'}
            </button>

            <p className="text-center text-xs font-mono" style={{ color: '#444' }}>
              Код 2FA будет отправлен на email
            </p>
          </div>
        ) : (
          <div className="ghost-card p-6 space-y-5 animate-fade-in">
            <div className="text-center">
              <div className="text-4xl mb-3">📧</div>
              <h3 className="font-mono text-sm font-semibold" style={{ color: 'var(--ghost-cyan)' }}>
                ДВУХФАКТОРНАЯ АУТЕНТИФИКАЦИЯ
              </h3>
              <p className="text-xs text-gray-500 mt-2 font-mono leading-relaxed">
                Код отправлен на<br />
                <span style={{ color: '#c8c8c8' }}>{email}</span>
              </p>
            </div>

            <div className="flex gap-2 justify-center" onPaste={handlePaste}>
              {digits.map((digit, i) => (
                <input
                  key={i}
                  ref={el => { inputRefs.current[i] = el; }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={digit}
                  onChange={e => handleDigitChange(i, e.target.value)}
                  onKeyDown={e => handleDigitKeyDown(i, e)}
                  className="w-11 h-14 text-center rounded-xl text-2xl font-mono font-bold outline-none transition-all"
                  style={{
                    background: digit ? 'rgba(0,255,245,0.12)' : 'var(--surface-3)',
                    border: `2px solid ${digit ? 'var(--ghost-cyan)' : 'var(--surface-4)'}`,
                    color: 'var(--ghost-cyan)',
                    boxShadow: digit ? '0 0 12px rgba(0,255,245,0.2)' : 'none',
                    caretColor: 'transparent',
                  }}
                  onFocus={e => (e.target.style.borderColor = 'var(--ghost-cyan-glow)')}
                  onBlur={e => (e.target.style.borderColor = digit ? 'var(--ghost-cyan)' : 'var(--surface-4)')}
                />
              ))}
            </div>

            {error && (
              <p className="text-xs font-mono text-center" style={{ color: 'var(--ghost-red)' }}>
                ⚠ {error}
              </p>
            )}

            <button
              onClick={handle2FA}
              disabled={loading || digits.some(d => d === '')}
              className="w-full py-3 rounded-lg font-mono text-sm transition-all font-semibold"
              style={{
                background: (loading || digits.some(d => d === ''))
                  ? 'rgba(0,255,245,0.05)'
                  : 'linear-gradient(135deg, rgba(0,255,245,0.25), rgba(0,255,245,0.1))',
                border: '1px solid var(--ghost-cyan-glow)',
                color: 'var(--ghost-cyan)',
                boxShadow: loading ? 'none' : '0 0 20px var(--ghost-cyan-dim)'
              }}
            >
              {loading ? '⠿ Проверяем...' : '🔓 ПОДТВЕРДИТЬ'}
            </button>

            <div className="flex items-center justify-between">
              <button
                onClick={() => { setStep('credentials'); setDigits(['','','','','','']); setError(''); }}
                className="text-xs font-mono text-gray-500 hover:text-gray-300 transition-colors"
              >
                ← Назад
              </button>
              <button
                onClick={handleResend}
                disabled={resendCooldown > 0 || loading}
                className="text-xs font-mono transition-colors"
                style={{ color: resendCooldown > 0 ? '#444' : 'var(--ghost-cyan)' }}
              >
                {resendCooldown > 0 ? `Повторно через ${resendCooldown}с` : 'Отправить снова'}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
