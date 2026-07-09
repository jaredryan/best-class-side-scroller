import React from 'react';

// Three wide, near-equilateral chips: one upright chip stands front and
// center, flanked by two chips leaning outward and tucked behind it, all
// rooted inside the tray (base tucked behind the y=64 rim). Each chip carries
// a few darker speckles, like toasted spots on a real tortilla chip.
const chips = [
  {
    points: '30,26 12,64 48,64', shade: '#e6a83a', rotate: -22, origin: '30 45',
    speckles: [{ x: 26, y: 44, r: 1.2 }, { x: 34, y: 40, r: 1 }, { x: 28, y: 55, r: 1.1 }],
  },
  {
    points: '62,26 42,64 78,64', shade: '#e6a83a', rotate: 22, origin: '62 45',
    speckles: [{ x: 58, y: 44, r: 1.2 }, { x: 66, y: 40, r: 1 }, { x: 60, y: 55, r: 1.1 }],
  },
  {
    points: '46,20 26,66 66,66', shade: 'var(--cheese)', rotate: 0, origin: '46 45',
    speckles: [{ x: 40, y: 45, r: 1.3 }, { x: 52, y: 40, r: 1.1 }, { x: 44, y: 58, r: 1.2 }],
  },
];

const drips = [
  { x: 20, r: 3 }, { x: 30, r: 2.5 }, { x: 40, r: 3.5 },
  { x: 50, r: 2.5 }, { x: 60, r: 3 }, { x: 68, r: 2.5 },
];

const NachoPlate = () => (
  <svg
    viewBox="0 0 90 100"
    width="100%"
    height="100%"
    preserveAspectRatio="xMidYMid meet"
  >
    {chips.map((c, i) => (
      <g key={i} transform={`rotate(${c.rotate} ${c.origin})`}>
        <polygon points={c.points} fill={c.shade} stroke="var(--ink)" strokeWidth="3" />
        {c.speckles.map((s, j) => (
          <circle key={j} cx={s.x} cy={s.y} r={s.r} fill="#a86f22" opacity="0.6" />
        ))}
      </g>
    ))}

    <polygon points="14,64 76,64 68,90 22,90" fill="var(--ketchup)" stroke="var(--ink)" strokeWidth="3" />

    {drips.map((d, i) => (
      <ellipse
        key={i}
        className="cheeseDrip"
        cx={d.x}
        cy="63"
        rx={d.r}
        ry={d.r * 1.6}
        fill="#ffdb70"
        stroke="var(--ink)"
        strokeWidth="1"
        style={{ animationDelay: `${i * 0.2}s` }}
      />
    ))}
  </svg>
);

export default NachoPlate;
