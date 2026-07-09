import React from 'react';

const TinyChef = () => (
  <svg
    viewBox="0 0 120 84"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <g className="chefLegBack">
      <rect x="58" y="62" width="10" height="18" rx="5" fill="#e0af7c" stroke="var(--ink)" strokeWidth="3" />
      <ellipse cx="63" cy="81" rx="7" ry="4" fill="#5a4632" stroke="var(--ink)" strokeWidth="2" />
    </g>
    <g className="chefLegFront">
      <rect x="40" y="62" width="10" height="18" rx="5" fill="#f2c49a" stroke="var(--ink)" strokeWidth="3" />
      <ellipse cx="45" cy="81" rx="7" ry="4" fill="#5a4632" stroke="var(--ink)" strokeWidth="2" />
    </g>

    <g className="chefArmBack">
      <rect x="24" y="44" width="10" height="20" rx="5" fill="#e0af7c" stroke="var(--ink)" strokeWidth="3" />
    </g>

    <rect x="30" y="26" width="48" height="40" rx="15" fill="var(--panel-cream)" stroke="var(--ink)" strokeWidth="4" />
    <rect x="42" y="44" width="22" height="16" rx="4" fill="var(--pea)" stroke="var(--ink)" strokeWidth="3" />

    <circle cx="84" cy="24" r="17" fill="#f2c49a" stroke="var(--ink)" strokeWidth="4" />
    <rect x="70" y="8" width="30" height="9" rx="4" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />
    <circle cx="76" cy="4" r="9" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />
    <circle cx="85" cy="1" r="11" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />
    <circle cx="95" cy="4" r="9" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />
    <path d="M89 18 L99 15" stroke="var(--ink)" strokeWidth="3" strokeLinecap="round" />
    <circle cx="93" cy="25" r="2.5" fill="var(--ink)" />
    <path d="M88 33 Q94 37 100 33" stroke="var(--ink)" strokeWidth="3" fill="none" strokeLinecap="round" />

    <g className="chefArmFront">
      <rect x="76" y="34" width="26" height="10" rx="5" fill="#f2c49a" stroke="var(--ink)" strokeWidth="3" />
      <rect x="98" y="36" width="22" height="8" rx="4" fill="#c9c2b7" stroke="var(--ink)" strokeWidth="3" />
      <circle cx="120" cy="40" r="4" fill="var(--ink)" />
    </g>
  </svg>
);

export default TinyChef;
