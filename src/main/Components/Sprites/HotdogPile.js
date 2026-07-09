import React from 'react';

const dog = (x, y, w, h, bun, sausage) => (
  <g key={`${x}-${y}`}>
    <rect x={x} y={y} width={w} height={h} rx={h / 2} fill={bun} stroke="var(--ink)" strokeWidth="3" />
    <rect x={x + 6} y={y + 3} width={w - 12} height={h - 8} rx={(h - 8) / 2} fill={sausage} stroke="var(--ink)" strokeWidth="1.5" />
    <path
      d={`M${x + 10} ${y + h / 2} Q${x + w * 0.3} ${y + 3} ${x + w * 0.5} ${y + h / 2} T${x + w - 10} ${y + h / 2}`}
      stroke="var(--mustard)"
      strokeWidth="2.5"
      fill="none"
      strokeLinecap="round"
    />
  </g>
);

const drips = [
  { x: 12, r: 3, cls: 'dripMustard' },
  { x: 24, r: 3.5, cls: 'dripKetchup' },
  { x: 36, r: 2.5, cls: 'dripMustard' },
  { x: 48, r: 4, cls: 'dripKetchup' },
  { x: 60, r: 3, cls: 'dripMustard' },
  { x: 72, r: 3.5, cls: 'dripKetchup' },
  { x: 82, r: 2.5, cls: 'dripMustard' },
];

const HotdogPile = () => (
  <svg
    viewBox="0 0 104 78"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <ellipse cx="52" cy="56" rx="50" ry="20" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />

    {dog(18, 28, 80, 22, '#e3ab6c', '#a9432f')}
    {dog(10, 20, 78, 24, '#e8b579', 'var(--ketchup)')}
    {dog(4, 40, 80, 22, '#e8b579', 'var(--ketchup)')}

    {drips.map((d, i) => (
      <ellipse
        key={i}
        className={d.cls}
        cx={d.x}
        cy="64"
        rx={d.r}
        ry={d.r * 1.6}
        fill={d.cls === 'dripKetchup' ? 'var(--ketchup)' : 'var(--mustard)'}
        stroke="var(--ink)"
        strokeWidth="1"
        style={{ animationDelay: `${i * 0.18}s` }}
      />
    ))}
  </svg>
);

export default HotdogPile;
