import React from 'react';

const SodaBottle = () => (
  <svg
    viewBox="0 0 120 70"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect x="18" y="18" width="88" height="34" rx="14" fill="var(--soda-blue)" stroke="var(--ink)" strokeWidth="4" />
    <rect x="2" y="26" width="20" height="18" rx="6" fill="#bfe9fb" stroke="var(--ink)" strokeWidth="4" />
    <rect x="40" y="24" width="34" height="22" rx="6" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />
    <circle cx="88" cy="12" r="5" fill="#ffffff" opacity="0.85" />
    <circle cx="98" cy="24" r="4" fill="#ffffff" opacity="0.7" />
    <circle cx="92" cy="58" r="4" fill="#ffffff" opacity="0.7" />
  </svg>
);

export default SodaBottle;
