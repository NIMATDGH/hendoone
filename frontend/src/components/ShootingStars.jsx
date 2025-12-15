import { useEffect, useMemo, useState } from "react";
import "./ShootingStars.css";

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function ShootingStars() {
  const [stars, setStars] = useState([]);
  const rnd = useMemo(() => mulberry32(4242), []);

  useEffect(() => {
    const prefersReduced =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (prefersReduced) return;

    const spawn = () => {
      const id = `${Date.now()}-${Math.floor(rnd() * 1e9)}`;

      setStars((prev) => [
        ...prev,
        {
          id,
          x: rnd() * 60,        // start left-ish
          y: rnd() * 40,        // start top-ish
          duration: 900 + rnd() * 600, // ms
          length: 120 + rnd() * 120,
        },
      ]);

      setTimeout(() => {
        setStars((prev) => prev.filter((s) => s.id !== id));
      }, 1600);
    };

    let t;
    const schedule = () => {
      t = setTimeout(() => {
        spawn();
        schedule();
      }, 3500 + rnd() * 3000);
    };

    schedule();
    return () => clearTimeout(t);
  }, [rnd]);

  return (
    <div className="shootingStars" aria-hidden="true">
      {stars.map((s) => (
        <span
          key={s.id}
          className="shootingStar"
          style={{
            left: `${s.x}vw`,
            top: `${s.y}vh`,
            ["--len"]: `${s.length}px`,
            ["--dur"]: `${s.duration}ms`,
          }}
        />
      ))}
    </div>
  );
}
