import React, { useId } from "react";

export default function CuteWatermelonHalf({
  size = 260,
  className,
  title = "Cute watermelon slice",
  seedCount = 6,
}) {
  const uid = useId();
  const radius = size / 2;

  const ids = {
    flesh: `flesh-${uid}`,
    pith: `pith-${uid}`,
    rind: `rind-${uid}`,
    seed: `seed-${uid}`,
  };

  const seeds = [
    { x: -40, y: -30, r: -15, s: 1 },
    { x: -10, y: -45, r: 8, s: 0.9 },
    { x: 20, y: -35, r: -6, s: 0.95 },
    { x: -25, y: -10, r: 12, s: 0.9 },
    { x: 5, y: -15, r: -10, s: 0.85 },
    { x: 30, y: -8, r: 6, s: 0.9 },
  ].slice(0, seedCount);

  return (
    <svg
      width={size}
      height={radius}
      viewBox="-130 -130 260 130"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      role="img"
      aria-labelledby={`${ids.seed}-title`}
    >
      <title id={`${ids.seed}-title`}>{title}</title>

      <defs>
        {/* Flesh */}
        <radialGradient id={ids.flesh} cx="50%" cy="40%" r="70%">
          <stop offset="0%" stopColor="#ff6b6f" />
          <stop offset="100%" stopColor="#ff2d55" />
        </radialGradient>

        {/* Pith */}
        <linearGradient id={ids.pith} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#fff9ef" />
          <stop offset="100%" stopColor="#efe6d6" />
        </linearGradient>

        {/* Rind */}
        <linearGradient id={ids.rind} x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%" stopColor="#3fe38e" />
          <stop offset="100%" stopColor="#1fb86f" />
        </linearGradient>

        {/* Seed */}
        <path
          id={ids.seed}
          d="M0 -7 C-4 -2 -3 4 0 7 C3 4 4 -2 0 -7 Z"
        />
      </defs>

      {/* Rind */}
      <path
        d={`
          M -130 0
          A 130 130 0 0 1 130 0
          L 130 20
          A 150 150 0 0 0 -130 20
          Z
        `}
        fill={`url(#${ids.rind})`}
      />

      {/* Pith */}
      <path
        d={`
          M -115 0
          A 115 115 0 0 1 115 0
          L 115 14
          A 130 130 0 0 0 -115 14
          Z
        `}
        fill={`url(#${ids.pith})`}
      />

      {/* Flesh */}
      <path
        d={`
          M -100 0
          A 100 100 0 0 1 100 0
          Z
        `}
        fill={`url(#${ids.flesh})`}
      />

      {/* Seeds */}
      <g fill="#0b0f14" opacity="0.9">
        {seeds.map((s, i) => (
          <use
            key={i}
            href={`#${ids.seed}`}
            transform={`translate(${s.x} ${s.y}) rotate(${s.r}) scale(${s.s})`}
          />
        ))}
      </g>

      {/* Cute shine */}
      <path
        d="M -50 -40 Q 0 -65 50 -40"
        fill="none"
        stroke="rgba(255,255,255,0.25)"
        strokeWidth="6"
        strokeLinecap="round"
      />
    </svg>
  );
}
