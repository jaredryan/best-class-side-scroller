import React from 'react';

const TinyChef = () => (
  <svg
    viewBox="0 0 70 84"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <g className="chefLegBack">
      <rect x="41" y="62" width="10" height="16" rx="5" fill="#e0af7c" stroke="var(--ink)" strokeWidth="3" />
      <ellipse cx="46" cy="80" rx="7" ry="4" fill="#5a4632" stroke="var(--ink)" strokeWidth="2" />
    </g>
    <g className="chefLegFront">
      <rect x="27" y="62" width="10" height="16" rx="5" fill="#f2c49a" stroke="var(--ink)" strokeWidth="3" />
      <ellipse cx="32" cy="80" rx="7" ry="4" fill="#5a4632" stroke="var(--ink)" strokeWidth="2" />
    </g>

    <g className="chefArmBack">
      <rect x="14" y="40" width="9" height="18" rx="4" fill="#e0af7c" stroke="var(--ink)" strokeWidth="3" />
    </g>

    <ellipse cx="34" cy="50" rx="12" ry="19" fill="var(--panel-cream)" stroke="var(--ink)" strokeWidth="4" />
    <rect x="27.5" y="46" width="13" height="16" rx="5" fill="var(--pea)" stroke="var(--ink)" strokeWidth="3" />

    <circle cx="34" cy="18" r="13" fill="#f2c49a" stroke="var(--ink)" strokeWidth="4" />
    <rect x="21" y="9" width="26" height="7" rx="3" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />
    <circle cx="24" cy="5" r="6" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />
    <circle cx="34" cy="2" r="7" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />
    <circle cx="44" cy="5" r="6" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />
    <path d="M38 16 L48 13" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="42" cy="20" r="2" fill="var(--ink)" />
    <path d="M38 26 Q44 30 50 26" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />

    <g className="chefArmFront">
      <rect x="46" y="39" width="14" height="8" rx="4" fill="#f2c49a" stroke="var(--ink)" strokeWidth="3" />
      <rect x="58" y="41" width="12" height="6" rx="3" fill="#c9c2b7" stroke="var(--ink)" strokeWidth="3" />
      <circle cx="70" cy="44" r="3" fill="var(--ink)" />
    </g>
  </svg>
);

export default TinyChef;
