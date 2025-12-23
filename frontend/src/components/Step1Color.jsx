import { useMemo, useState } from "react";
import { api } from "../api/client";

const OPTIONS = ["red", "blue", "green", "yellow", "pink"];

function nextColor(current) {
  const idx = OPTIONS.indexOf(current);
  return OPTIONS[(idx + 1) % OPTIONS.length];
}

export default function Step1Color({ onSuccess }) {
  const [colors, setColors] = useState(["red", "red", "red", "red"]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const swatches = useMemo(
    () => ({
      red:    { bg: "linear-gradient(180deg, #ff6a3d, #ff3b5c)" },
      blue:   { bg: "linear-gradient(180deg, #58b7ff, #2f6bff)" },
      green:  { bg: "linear-gradient(180deg, #45e09c, #13b26a)" },
      yellow: { bg: "linear-gradient(180deg, #ffe37a, #ffb84d)" },
      pink:   { bg: "linear-gradient(180deg, #ff9ad5, #ff5fa2)" }, // ✅ added
    }),
    []
  );


  function tap(i) {
    setColors((prev) => {
      const copy = [...prev];
      copy[i] = nextColor(copy[i]);
      return copy;
    });
    setError(null);
  }

  async function submit() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.step1Color(colors);
      if (res?.success) {
        await onSuccess();
      } else {
        setError(res?.message || "الگوی اشتباه");
      }
    } catch (err) {
      setError(err?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <p className="subtitle">مرحله ۱</p>
      <div className="h2-quote">"جایی که صداها آرام می‌شوند، اما حرف‌ها بلندند"</div>

      <div className="colorGrid" role="group" aria-label="Color tiles">
        {colors.map((c, i) => (
          <button
            key={i}
            type="button"
            className="colorTile"
            onClick={() => tap(i)}
            aria-label={`Tile ${i + 1}: ${c}`}
            disabled={loading}
            style={{
              background: swatches[c].bg,
            }}
          >
            <span className="tileDot" />
          </button>
        ))}
      </div>

      <div className="helper" style={{ textAlign: "right", marginTop: 10 }}>
        برای تغییر رنگ هر بخش بر روی آن کلیک کنید
      </div>

      <button className="btnPrimary" style={{ marginTop: 14 }} onClick={submit} disabled={loading}>
        {loading ? "در حال بررسی ..." : "ارسال"}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
