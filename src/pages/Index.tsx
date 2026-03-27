import { useState } from 'react';
import Icon from '@/components/ui/icon';
import AuthScreen from '@/components/AuthScreen';
import ChatScreen from '@/components/ChatScreen';
import CalculatorScreen from '@/components/CalculatorScreen';
import AIScreen from '@/components/AIScreen';
import CallsScreen from '@/components/CallsScreen';
import ProfileScreen from '@/components/ProfileScreen';
import SecurityScreen from '@/components/SecurityScreen';
import SettingsScreen from '@/components/SettingsScreen';

type Tab = 'chat' | 'calls' | 'ai' | 'calc' | 'profile' | 'security' | 'settings';

const TABS: { id: Tab; icon: string; label: string }[] = [
  { id: 'chat', icon: 'MessageCircle', label: 'Чат' },
  { id: 'calls', icon: 'Phone', label: 'Звонки' },
  { id: 'ai', icon: 'Bot', label: 'AI' },
  { id: 'calc', icon: 'Calculator', label: 'Калькулятор' },
  { id: 'security', icon: 'Shield', label: 'Защита' },
  { id: 'profile', icon: 'User', label: 'Профиль' },
  { id: 'settings', icon: 'Settings', label: 'Настройки' },
];

export default function Index() {
  const [authed, setAuthed] = useState(false);
  const [username, setUsername] = useState('');
  const [activeTab, setActiveTab] = useState<Tab>('chat');

  const handleAuth = (name: string) => {
    setUsername(name);
    setAuthed(true);
  };

  const handleLogout = () => {
    setAuthed(false);
    setUsername('');
    setActiveTab('chat');
  };

  if (!authed) {
    return (
      <div className="h-screen w-screen overflow-hidden" style={{ background: 'var(--surface-1)' }}>
        <AuthScreen onAuth={handleAuth} />
      </div>
    );
  }

  const renderScreen = () => {
    switch (activeTab) {
      case 'chat': return <ChatScreen />;
      case 'calls': return <CallsScreen />;
      case 'ai': return <AIScreen />;
      case 'calc': return <CalculatorScreen />;
      case 'security': return <SecurityScreen />;
      case 'profile': return <ProfileScreen username={username} />;
      case 'settings': return <SettingsScreen onLogout={handleLogout} />;
      default: return <ChatScreen />;
    }
  };

  return (
    <div
      className="h-screen w-screen overflow-hidden flex flex-col"
      style={{ background: 'var(--surface-1)', maxWidth: '480px', margin: '0 auto' }}
    >
      <div className="scan-line" />

      <div
        className="flex items-center justify-between px-4 py-2.5 border-b flex-shrink-0"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--ghost-cyan-dim)' }}
      >
        <div className="flex items-center gap-2">
          <span className="text-xl" style={{ filter: 'drop-shadow(0 0 8px rgba(0,255,245,0.5))' }}>👻</span>
          <span className="ghost-logo-text font-unbounded text-sm font-bold">Призрак</span>
        </div>
        <div className="flex items-center gap-3">
          <div className="security-badge py-1 px-2 text-xs">
            <span style={{ color: 'var(--ghost-green)' }}>●</span>
            Защищён
          </div>
          <div className="flex items-center gap-1.5">
            <div className="w-6 h-6 rounded-full flex items-center justify-center text-sm"
              style={{ background: 'var(--surface-3)', border: '1px solid var(--ghost-cyan-dim)' }}>
              👤
            </div>
            <span
              className="text-xs font-mono"
              style={{ color: '#888', maxWidth: '80px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}
            >
              {username}
            </span>
          </div>
        </div>
      </div>

      <div className="flex-1 overflow-hidden animate-fade-in" key={activeTab}>
        {renderScreen()}
      </div>

      <div
        className="flex-shrink-0 border-t px-2 py-1.5"
        style={{ background: 'var(--surface-2)', borderColor: 'var(--ghost-cyan-dim)' }}
      >
        <div className="flex items-center justify-around">
          {TABS.map(tab => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`nav-item ${activeTab === tab.id ? 'active' : ''}`}
            >
              <Icon name={tab.icon} size={20} fallback="Circle" />
              <span>{tab.label}</span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
