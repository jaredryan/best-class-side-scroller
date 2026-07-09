import React from 'react';

const NachoPlate = () => (
  <svg
    viewBox="0 0 70 100"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    <ellipse cx="35" cy="90" rx="32" ry="8" fill="var(--panel-light)" stroke="var(--ink)" strokeWidth="3" />

    <polygon points="35,4 58,32 12,32" fill="var(--cheese)" stroke="var(--ink)" strokeWidth="3" />
    <polygon points="16,20 42,44 -4,44" fill="var(--cheese)" stroke="var(--ink)" strokeWidth="3" />
    <polygon points="54,20 72,46 34,44" fill="var(--cheese)" stroke="var(--ink)" strokeWidth="3" />
    <polygon points="35,36 60,62 12,62" fill="var(--cheese)" stroke="var(--ink)" strokeWidth="3" />
    <polygon points="14,46 40,72 -2,72" fill="var(--cheese)" stroke="var(--ink)" strokeWidth="3" />
    <polygon points="48,46 68,74 30,72" fill="var(--cheese)" stroke="var(--ink)" strokeWidth="3" />
    <polygon points="35,60 58,84 14,84" fill="var(--cheese)" stroke="var(--ink)" strokeWidth="3" />

    <path d="M18 26 Q26 36 18 46 T18 66" stroke="#ffdb70" strokeWidth="4" fill="none" strokeLinecap="round" />
    <path d="M50 30 Q42 40 50 50 T50 70" stroke="#ffdb70" strokeWidth="4" fill="none" strokeLinecap="round" />

    <circle cx="26" cy="50" r="2.5" fill="#8a5a2b" />
    <circle cx="44" cy="54" r="2.5" fill="#8a5a2b" />
    <circle cx="35" cy="70" r="2.5" fill="#8a5a2b" />
    <circle cx="20" cy="66" r="2.5" fill="#8a5a2b" />
    <ellipse cx="30" cy="20" rx="6" ry="3" fill="var(--pea)" stroke="var(--ink)" strokeWidth="2" />
    <ellipse cx="45" cy="58" rx="6" ry="3" fill="var(--pea)" stroke="var(--ink)" strokeWidth="2" />

    <ellipse className="cheeseDrip" cx="16" cy="80" rx="3" ry="5" fill="#ffdb70" stroke="var(--ink)" strokeWidth="1" />
    <ellipse className="cheeseDrip cheeseDripB" cx="50" cy="82" rx="3" ry="5" fill="#ffdb70" stroke="var(--ink)" strokeWidth="1" />
  </svg>
);

export default NachoPlate;
