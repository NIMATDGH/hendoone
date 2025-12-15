import { useMemo } from "react";
import cloud1 from "../assets/cloud1.png";
import cloud2 from "../assets/cloud2.png";
import ShootingStars from "./ShootingStars";

function mulberry32(seed) {
  return function () {
    let t = (seed += 0x6D2B79F5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export default function Background() {
  // Stable randomness for the session (doesn't change on rerender)
  const clouds = useMemo(() => {
    const rnd = mulberry32(1337);
    const count = 12; // ~10-12 clouds
    const items = [];

    for (let i = 0; i < count; i++) {
      const img = rnd() < 0.5 ? cloud1 : cloud2;

      // Position (vw/vh)
      const x = rnd() * 100; // start x
      const y = rnd() * 80;  // keep within visible area

      // Size + opacity
      const scale = 0.35 + rnd() * 0.55; // 0.35..0.90
      const opacity = 0.08 + rnd() * 0.18; // subtle

      // Speed: each cloud drifts across the screen slowly
      const duration = 70 + rnd() * 90; // 70..160s

      // Delay so they aren't synced
      const delay = -(rnd() * duration);

      // Small vertical wobble amplitude
      const wobble = 2 + rnd() * 6; // px

      items.push({
        id: i,
        img,
        x,
        y,
        scale,
        opacity,
        duration,
        delay,
        wobble,
      });
    }

    return items;
  }, []);

  return (
    <div className="bgLayers" aria-hidden="true">
      {clouds.map((c) => (
        <img
          key={c.id}
          className="cloudSprite"
          src={c.img}
          alt=""
          style={{
            left: `${c.x}vw`,
            top: `${c.y}vh`,
            opacity: c.opacity,
            animationDuration: `${c.duration}s, ${6 + c.duration / 18}s`,
            animationDelay: `${c.delay}s, ${c.delay / 2}s`,
            ["--wobble"]: `${c.wobble}px`,
            ["--scale"]: c.scale,
          }}
        />
      ))}
      <ShootingStars />
    </div>
  );
}
