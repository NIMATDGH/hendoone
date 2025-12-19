import { useMemo, useState } from "react";
import { api } from "../api/client";

const OPTIONS = ["red", "blue", "green", "yellow"];

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
      red: { bg: "linear-gradient(180deg, #ff6a3d, #ff3b5c)" },
      blue: { bg: "linear-gradient(180deg, #58b7ff, #2f6bff)" },
      green: { bg: "linear-gradient(180deg, #45e09c, #13b26a)" },
      yellow: { bg: "linear-gradient(180deg, #ffe37a, #ffb84d)" },
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
        setError(res?.message || "Incorrect pattern");
      }
    } catch (err) {
      setError(err?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <p className="subtitle">Step 1</p>
      <div className="h2">Match the color pattern</div>

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

      <div className="helper" style={{ textAlign: "left", marginTop: 10 }}>
        Tap each square to cycle colors.
      </div>

      <button className="btnPrimary" style={{ marginTop: 14 }} onClick={submit} disabled={loading}>
        {loading ? "Checking..." : "Submit"}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
