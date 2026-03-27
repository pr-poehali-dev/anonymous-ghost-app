import { useState } from 'react';
import Icon from '@/components/ui/icon';

type CallState = 'idle' | 'calling' | 'active' | 'incoming';

interface CallLog {
  id: number;
  name: string;
  type: 'in' | 'out' | 'missed';
  time: string;
  duration?: string;
  avatar: string;
}

const CALL_LOGS: CallLog[] = [
  { id: 1, name: 'Призрак_7842', type: 'in', time: '23:10', duration: '4:22', avatar: '👤' },
  { id: 2, name: 'X_Shadow', type: 'out', time: '21:30', duration: '1:05', avatar: '🌑' },
  { id: 3, name: 'Тень_0019', type: 'missed', time: '20:15', avatar: '🕶️' },
  { id: 4, name: 'Anon_442', type: 'out', time: '18:42', duration: '12:47', avatar: '🎭' },
];

export default function CallsScreen() {
  const [callState, setCallState] = useState<CallState>('idle');
  const [callee, setCallee] = useState('');
  const [muted, setMuted] = useState(false);
  const [speaker, setSpeaker] = useState(false);
  const [timer, setTimer] = useState(0);
  const [intervalId, setIntervalId] = useState<ReturnType<typeof setInterval> | null>(null);

  const startCall = (name: string) => {
    setCallee(name);
    setCallState('calling');
    setTimeout(() => {
      setCallState('active');
      const id = setInterval(() => setTimer(t => t + 1), 1000);
      setIntervalId(id);
    }, 2000);
  };

  const endCall = () => {
    if (intervalId) clearInterval(intervalId);
    setCallState('idle');
    setTimer(0);
    setMuted(false);
    setSpeaker(false);
    setIntervalId(null);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${String(m).padStart(2,'0')}:${String(sec).padStart(2,'0')}`;
  };

  if (callState === 'calling' || callState === 'active') {
    return (
      <div className="flex flex-col h-full items-center justify-between py-12 px-6 ghost-grid-bg animate-fade-in" style={{ background: 'var(--surface-1)' }}>
        <div className="text-center space-y-4">
          <div className="relative mx-auto w-fit">
            <div className="w-24 h-24 rounded-full flex items-center justify-center text-5xl"
              style={{ background: 'var(--surface-3)', border: '2px solid var(--ghost-cyan-glow)', boxShadow: '0 0 40px var(--ghost-cyan-dim)' }}>
              👤
            </div>
            {callState === 'active' && (
              <>
                <div className="absolute inset-0 rounded-full" style={{ animation: 'pulse-ring 2s ease-out infinite', border: '2px solid var(--ghost-cyan)' }} />
                <div className="absolute inset-0 rounded-full" style={{ animation: 'pulse-ring 2s 0.7s ease-out infinite', border: '2px solid var(--ghost-cyan)' }} />
              </>
            )}
          </div>
          <div>
            <h3 className="font-mono font-semibold text-xl" style={{ color: '#e0e0e0' }}>{callee}</h3>
            <p className="font-mono text-sm mt-1" style={{ color: callState === 'active' ? 'var(--ghost-cyan)' : '#666' }}>
              {callState === 'calling' ? '⠿ Соединяемся...' : formatTime(timer)}
            </p>
          </div>
          <div className="security-badge mx-auto">🔒 Зашифрованный звонок</div>
        </div>

        <div className="flex gap-6 items-center">
          <button
            onClick={() => setMuted(m => !m)}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
            style={{
              background: muted ? 'rgba(255,59,59,0.2)' : 'var(--surface-3)',
              border: `1px solid ${muted ? 'rgba(255,59,59,0.4)' : 'var(--surface-4)'}`,
            }}
          >
            <Icon name={muted ? 'MicOff' : 'Mic'} size={22} style={{ color: muted ? 'var(--ghost-red)' : '#aaa' }} />
          </button>

          <button
            onClick={endCall}
            className="w-18 h-18 rounded-full flex items-center justify-center transition-all"
            style={{
              width: '64px',
              height: '64px',
              background: 'linear-gradient(135deg, rgba(255,59,59,0.4), rgba(255,59,59,0.2))',
              border: '1px solid rgba(255,59,59,0.5)',
              boxShadow: '0 0 25px rgba(255,59,59,0.3)'
            }}
          >
            <Icon name="PhoneOff" size={26} style={{ color: 'var(--ghost-red)' }} />
          </button>

          <button
            onClick={() => setSpeaker(s => !s)}
            className="w-14 h-14 rounded-full flex items-center justify-center transition-all"
            style={{
              background: speaker ? 'rgba(0,255,245,0.15)' : 'var(--surface-3)',
              border: `1px solid ${speaker ? 'var(--ghost-cyan-glow)' : 'var(--surface-4)'}`,
            }}
          >
            <Icon name={speaker ? 'Volume2' : 'VolumeX'} size={22} style={{ color: speaker ? 'var(--ghost-cyan)' : '#aaa' }} />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--ghost-cyan-dim)', background: 'var(--surface-2)' }}>
        <h2 className="font-unbounded text-base font-semibold" style={{ color: 'var(--ghost-cyan)' }}>Звонки</h2>
      </div>

      <div className="px-4 py-3 border-b" style={{ borderColor: 'var(--ghost-cyan-dim)' }}>
        <div className="ghost-card p-3 flex items-center gap-3">
          <input className="ghost-input flex-1 text-sm" placeholder="Введите псевдоним..." value={callee} onChange={e => setCallee(e.target.value)} />
          <button
            onClick={() => callee.trim() && startCall(callee)}
            disabled={!callee.trim()}
            className="p-2.5 rounded-lg transition-all flex-shrink-0"
            style={{
              background: callee.trim() ? 'rgba(0,255,136,0.2)' : 'var(--surface-3)',
              border: '1px solid rgba(0,255,136,0.3)',
              color: 'var(--ghost-green)'
            }}
          >
            <Icon name="Phone" size={18} />
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="px-4 py-2">
          <p className="text-xs font-mono text-gray-500 mb-2">ПОСЛЕДНИЕ ЗВОНКИ</p>
        </div>
        {CALL_LOGS.map((log, i) => (
          <div
            key={log.id}
            className="flex items-center gap-3 px-4 py-3 border-b cursor-pointer transition-all"
            style={{ borderColor: 'rgba(255,255,255,0.04)', animationDelay: `${i*0.05}s` }}
            onMouseEnter={e => (e.currentTarget.style.background = 'var(--surface-2)')}
            onMouseLeave={e => (e.currentTarget.style.background = 'transparent')}
          >
            <div className="w-11 h-11 rounded-full flex items-center justify-center text-xl"
              style={{ background: 'var(--surface-3)', border: '1px solid var(--surface-4)' }}>
              {log.avatar}
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold font-mono" style={{ color: '#e0e0e0' }}>{log.name}</p>
              <div className="flex items-center gap-1.5 mt-0.5">
                <Icon
                  name={log.type === 'in' ? 'PhoneIncoming' : log.type === 'out' ? 'PhoneOutgoing' : 'PhoneMissed'}
                  size={12}
                  style={{ color: log.type === 'missed' ? 'var(--ghost-red)' : log.type === 'in' ? 'var(--ghost-cyan)' : '#888' }}
                />
                <span className="text-xs font-mono" style={{ color: log.type === 'missed' ? 'var(--ghost-red)' : '#666' }}>
                  {log.type === 'missed' ? 'Пропущен' : log.type === 'in' ? 'Входящий' : 'Исходящий'}
                </span>
                {log.duration && <span className="text-xs font-mono text-gray-600">· {log.duration}</span>}
              </div>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono text-gray-600">{log.time}</span>
              <button
                onClick={() => startCall(log.name)}
                className="p-2 rounded-lg transition-all"
                style={{ background: 'var(--surface-3)', border: '1px solid var(--surface-4)' }}
                onMouseEnter={e => { (e.currentTarget as HTMLElement).style.background = 'rgba(0,255,136,0.1)'; (e.currentTarget as HTMLElement).style.borderColor = 'rgba(0,255,136,0.3)'; }}
                onMouseLeave={e => { (e.currentTarget as HTMLElement).style.background = 'var(--surface-3)'; (e.currentTarget as HTMLElement).style.borderColor = 'var(--surface-4)'; }}
              >
                <Icon name="Phone" size={14} style={{ color: 'var(--ghost-green)' }} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
