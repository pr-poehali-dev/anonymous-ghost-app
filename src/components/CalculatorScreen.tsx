import { useState } from 'react';

export default function CalculatorScreen() {
  const [display, setDisplay] = useState('0');
  const [expression, setExpression] = useState('');
  const [prev, setPrev] = useState('');
  const [op, setOp] = useState('');
  const [reset, setReset] = useState(false);

  const handleNumber = (n: string) => {
    if (reset) {
      setDisplay(n);
      setReset(false);
      return;
    }
    if (display === '0' && n !== '.') {
      setDisplay(n);
    } else if (n === '.' && display.includes('.')) {
      return;
    } else {
      setDisplay(display.length < 14 ? display + n : display);
    }
  };

  const handleOp = (o: string) => {
    setOp(o);
    setPrev(display);
    setExpression(display + ' ' + o);
    setReset(true);
  };

  const handleEqual = () => {
    if (!op || !prev) return;
    const a = parseFloat(prev);
    const b = parseFloat(display);
    let res = 0;
    if (op === '+') res = a + b;
    else if (op === '−') res = a - b;
    else if (op === '×') res = a * b;
    else if (op === '÷') res = b !== 0 ? a / b : 0;
    const resStr = parseFloat(res.toFixed(10)).toString();
    setDisplay(resStr);
    setExpression(prev + ' ' + op + ' ' + display + ' =');
    setPrev('');
    setOp('');
    setReset(true);
  };

  const handleClear = () => {
    setDisplay('0');
    setExpression('');
    setPrev('');
    setOp('');
    setReset(false);
  };

  const handleBackspace = () => {
    if (display.length > 1) {
      setDisplay(display.slice(0, -1));
    } else {
      setDisplay('0');
    }
  };

  const handleToggleSign = () => {
    setDisplay((parseFloat(display) * -1).toString());
  };

  const handlePercent = () => {
    setDisplay((parseFloat(display) / 100).toString());
  };

  const BTN_ROWS = [
    [
      { label: 'AC', onClick: handleClear, cls: 'op', wide: false },
      { label: '+/-', onClick: handleToggleSign, cls: 'op', wide: false },
      { label: '%', onClick: handlePercent, cls: 'op', wide: false },
      { label: '÷', onClick: () => handleOp('÷'), cls: 'op', wide: false },
    ],
    [
      { label: '7', onClick: () => handleNumber('7'), cls: '', wide: false },
      { label: '8', onClick: () => handleNumber('8'), cls: '', wide: false },
      { label: '9', onClick: () => handleNumber('9'), cls: '', wide: false },
      { label: '×', onClick: () => handleOp('×'), cls: 'op', wide: false },
    ],
    [
      { label: '4', onClick: () => handleNumber('4'), cls: '', wide: false },
      { label: '5', onClick: () => handleNumber('5'), cls: '', wide: false },
      { label: '6', onClick: () => handleNumber('6'), cls: '', wide: false },
      { label: '−', onClick: () => handleOp('−'), cls: 'op', wide: false },
    ],
    [
      { label: '1', onClick: () => handleNumber('1'), cls: '', wide: false },
      { label: '2', onClick: () => handleNumber('2'), cls: '', wide: false },
      { label: '3', onClick: () => handleNumber('3'), cls: '', wide: false },
      { label: '+', onClick: () => handleOp('+'), cls: 'op', wide: false },
    ],
  ];

  return (
    <div className="flex flex-col h-full">
      <div className="px-4 py-4 border-b" style={{ borderColor: 'var(--ghost-cyan-dim)', background: 'var(--surface-2)' }}>
        <h2 className="font-unbounded text-base font-semibold" style={{ color: 'var(--ghost-cyan)' }}>Калькулятор</h2>
      </div>

      <div className="flex-1 flex flex-col justify-end p-4">
        <div className="ghost-card p-5 mb-4 ghost-glow">
          <div className="text-right mb-1" style={{ minHeight: '20px' }}>
            <span className="text-sm font-mono" style={{ color: '#555' }}>{expression || ' '}</span>
          </div>
          <div className="text-right overflow-hidden">
            <span
              className="font-mono font-light"
              style={{
                fontSize: display.length > 10 ? '28px' : display.length > 7 ? '38px' : '52px',
                color: op ? 'var(--ghost-cyan)' : '#f0f0f0',
                transition: 'all 0.15s ease',
                lineHeight: 1.1,
              }}
            >
              {display}
            </span>
          </div>
        </div>

        <div className="grid grid-cols-4 gap-2">
          {BTN_ROWS.map((row, ri) =>
            row.map((btn, bi) => (
              <button
                key={`${ri}-${bi}`}
                onClick={btn.onClick}
                className={`calc-btn ${btn.cls}`}
              >
                {btn.label}
              </button>
            ))
          )}
          <button
            onClick={() => handleNumber('0')}
            className="calc-btn zero"
            style={{ gridColumn: 'span 2', aspectRatio: 'auto', padding: '0 28px', justifyContent: 'flex-start' }}
          >
            0
          </button>
          <button onClick={() => handleNumber('.')} className="calc-btn">.</button>
          <button onClick={handleEqual} className="calc-btn equal">=</button>
        </div>

        <div className="mt-3 flex justify-center">
          <button onClick={handleBackspace} className="ghost-btn text-xs">
            ⌫ Стереть
          </button>
        </div>
      </div>
    </div>
  );
}
