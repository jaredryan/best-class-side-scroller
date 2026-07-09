import React from 'react';

const NachoPlate = () => (
  <svg
    viewBox="0 0 70 100"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <polygon points="35,4 62,34 8,34" fill="var(--cheese)" stroke="var(--ink)" strokeWidth="4" />
    <polygon points="28,30 58,58 -2,58" fill="var(--cheese)" stroke="var(--ink)" strokeWidth="4" />
    <polygon points="35,54 65,86 5,86" fill="var(--cheese)" stroke="var(--ink)" strokeWidth="4" />
    <circle cx="30" cy="46" r="2.5" fill="#8a5a2b" />
    <circle cx="42" cy="50" r="2.5" fill="#8a5a2b" />
    <circle cx="35" cy="70" r="2.5" fill="#8a5a2b" />
    <circle cx="22" cy="20" r="2.5" fill="var(--ink)" />
    <circle cx="46" cy="20" r="2.5" fill="var(--ink)" />
    <path d="M24 26 Q34 32 44 26" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
    <ellipse cx="35" cy="16" rx="6" ry="3" fill="var(--pea)" stroke="var(--ink)" strokeWidth="2" />
  </svg>
);

export default NachoPlate;
