import { useState } from "react";
import { api } from "../api/client";

export default function Step0Word({ onSuccess }) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.step0Word(answer.trim());
      if (res?.success) {
        await onSuccess();
      } else {
        setError(res?.message || "Incorrect word");
      }
    } catch (err) {
      setError(err?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <p className="subtitle">Step 0</p>
      <div className="h2">Enter the secret word</div>

      <form onSubmit={submit} style={{ marginTop: 14 }}>
        <input
          className="input"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="Type here..."
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          disabled={loading}
        />

        <button
          className="btnPrimary"
          style={{ marginTop: 14 }}
          disabled={loading || !answer.trim()}
        >
          {loading ? "Checking..." : "Continue"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
