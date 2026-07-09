import React from 'react';

const HotdogPile = () => (
  <svg
    viewBox="0 0 70 100"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect x="6" y="12" width="58" height="22" rx="11" fill="#e8b579" stroke="var(--ink)" strokeWidth="4" />
    <rect x="12" y="16" width="46" height="14" rx="7" fill="var(--ketchup)" stroke="var(--ink)" strokeWidth="2" />
    <path d="M14 23 Q22 17 30 23 T46 23 T58 23" stroke="var(--mustard)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="6" y="58" width="58" height="22" rx="11" fill="#e8b579" stroke="var(--ink)" strokeWidth="4" />
    <rect x="12" y="62" width="46" height="14" rx="7" fill="#a9432f" stroke="var(--ink)" strokeWidth="2" />
    <path d="M14 69 Q22 63 30 69 T46 69 T58 69" stroke="var(--mustard)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <circle cx="20" cy="45" r="2.5" fill="var(--ink)" />
    <circle cx="50" cy="45" r="2.5" fill="var(--ink)" />
    <path d="M22 50 Q35 56 48 50" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

export default HotdogPile;
