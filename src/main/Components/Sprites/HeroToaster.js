import React from 'react';

const HeroToaster = () => (
  <svg
    viewBox="0 0 90 90"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <polygon
      points="45,8 62,24 84,80 56,64 45,76 34,64 6,80 28,24"
      fill="var(--ketchup)"
      stroke="var(--ink)"
      strokeWidth="3"
    />
    <polygon
      points="45,16 56,28 70,72 45,58 20,72 34,28"
      fill="var(--cheese)"
      opacity="0.35"
    />
    <rect x="14" y="30" width="62" height="42" rx="10" fill="#d7d0c4" stroke="var(--ink)" strokeWidth="4" />
    <rect x="24" y="20" width="14" height="16" rx="4" fill="var(--ink)" />
    <rect x="52" y="20" width="14" height="16" rx="4" fill="var(--ink)" />
    <circle cx="32" cy="56" r="3" fill="var(--ink)" />
    <circle cx="58" cy="56" r="3" fill="var(--ink)" />
    <path d="M34 64 Q45 70 56 64" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <rect x="40" y="72" width="10" height="8" rx="2" fill="var(--ink)" />
  </svg>
);

export default HeroToaster;
