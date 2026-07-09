import React from 'react';

const hotdogRows = [
  { y: 2, bun: '#e8b579', sausage: 'var(--ketchup)' },
  { y: 24, bun: '#e3ab6c', sausage: '#a9432f' },
  { y: 46, bun: '#e8b579', sausage: 'var(--ketchup)' },
  { y: 68, bun: '#e3ab6c', sausage: '#a9432f' },
];

const HotdogPile = () => (
  <svg
    viewBox="0 0 70 100"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    {hotdogRows.map((row, i) => (
      <g key={i}>
        <rect x="4" y={row.y} width="62" height="18" rx="9" fill={row.bun} stroke="var(--ink)" strokeWidth="3" />
        <rect x="10" y={row.y + 3} width="50" height="11" rx="5.5" fill={row.sausage} stroke="var(--ink)" strokeWidth="1.5" />
        <path
          d={`M14 ${row.y + 9} Q22 ${row.y + 4} 30 ${row.y + 9} T46 ${row.y + 9} T58 ${row.y + 9}`}
          stroke="var(--mustard)"
          strokeWidth="2.5"
          fill="none"
          strokeLinecap="round"
        />
      </g>
    ))}
    <ellipse className="dripKetchup" cx="52" cy="90" rx="3" ry="5" fill="var(--ketchup)" stroke="var(--ink)" strokeWidth="1" />
    <ellipse className="dripMustard" cx="20" cy="92" rx="3" ry="5" fill="var(--mustard)" stroke="var(--ink)" strokeWidth="1" />
  </svg>
);

export default HotdogPile;
