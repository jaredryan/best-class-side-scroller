import React from 'react';

const SodaBottle = () => (
  <svg
    viewBox="0 0 120 70"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <rect x="18" y="18" width="88" height="34" rx="14" fill="var(--soda-brown)" stroke="var(--ink)" strokeWidth="4" />
    <rect x="2" y="26" width="20" height="18" rx="6" fill="#6e3f21" stroke="var(--ink)" strokeWidth="4" />
    <rect x="40" y="24" width="34" height="22" rx="6" fill="var(--cola-red)" stroke="var(--ink)" strokeWidth="3" />
    <circle className="sodaBubble sodaBubbleA" cx="88" cy="12" r="5" fill="#996e44" opacity="0.85" />
    <circle className="sodaBubble sodaBubbleB" cx="98" cy="24" r="4" fill="#996e44" opacity="0.7" />
    <circle className="sodaBubble sodaBubbleC" cx="92" cy="58" r="4" fill="#996e44" opacity="0.7" />
  </svg>
);

export default SodaBottle;
