import React from 'react';

const HeroToaster = () => (
  <svg
    viewBox="0 0 90 92"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    {/* main cape: tucks behind the body, only visible past its edges/below */}
    <path
      d="M28 30 L62 30 Q86 52 80 90 Q60 78 45 86 Q30 78 10 90 Q4 52 28 30 Z"
      fill="var(--ketchup)"
      stroke="var(--ink)"
      strokeWidth="3"
      strokeLinejoin="round"
    />
    <rect x="14" y="30" width="62" height="42" rx="10" fill="#d7d0c4" stroke="var(--ink)" strokeWidth="4" />
    {/* front collar: continues the cape flaps down onto the chest, thin and only slightly saggy */}
    <path d="M30 34 Q45 44 60 34" stroke="var(--ketchup)" strokeWidth="5" fill="none" strokeLinecap="round" />
    <rect x="24" y="18" width="14" height="16" rx="4" fill="#e8c98a" stroke="var(--ink)" strokeWidth="2" />
    <rect x="52" y="18" width="14" height="16" rx="4" fill="#e8c98a" stroke="var(--ink)" strokeWidth="2" />
    <circle cx="32" cy="56" r="3" fill="var(--ink)" />
    <circle cx="58" cy="56" r="3" fill="var(--ink)" />
    <path d="M34 64 Q45 70 56 64" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />
  </svg>
);

export default HeroToaster;
