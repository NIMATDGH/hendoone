import { useState } from "react";
import { api } from "../api/client";

export default function FinishScreen({ onRefresh }) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [code, setCode] = useState(null);

  async function getCode() {
    setLoading(true);
    setError(null);
    try {
      const res = await api.finish();
      const final = res?.final_code || res?.code;
      if (res?.success && final) {
        setCode(final);
      } else {
        setError("Failed to generate code.");
      }
    } catch (err) {
      setError(err?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  async function copy() {
    if (!code) return;
    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(code);
      } else {
        const el = document.createElement("textarea");
        el.value = code;
        document.body.appendChild(el);
        el.select();
        document.execCommand("copy");
        document.body.removeChild(el);
      }
    } catch {
      // ignore copy errors
    }
  }

  return (
    <div className="card">
      <p className="subtitle">Complete</p>
      <div className="h2">You did it 🎉</div>

      <p className="helper" style={{ textAlign: "left", marginTop: 10 }}>
        Tap below to generate your completion code.
      </p>

      {!code ? (
        <button className="btnPrimary" style={{ marginTop: 14 }} onClick={getCode} disabled={loading}>
          {loading ? "Finishing..." : "Get my code"}
        </button>
      ) : (
        <>
          <div className="codeBox" aria-label="Completion code">
            {code}
          </div>

          <div className="twoButtons" style={{ marginTop: 14 }}>
            <button className="btnSecondary" type="button" onClick={copy}>
              Copy
            </button>
            <button className="btnPrimary" type="button" onClick={onRefresh}>
              Refresh
            </button>
          </div>
        </>
      )}

      {error && <p className="error">{error}</p>}
    </div>
  );
}
