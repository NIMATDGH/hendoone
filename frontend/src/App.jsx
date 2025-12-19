import { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import Step0Word from "./components/Step0Word";
import { api } from "./api/client";
import Background from "./components/Background";

function isStep0Done(state) {
  return Boolean(state?.steps?.step0?.completed);
}

export default function App() {
  const [screen, setScreen] = useState("home"); // home | game
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [state, setState] = useState(null);

  async function refreshState({ showSpinner = false } = {}) {
    if (showSpinner) setLoading(true);
    try {
      const s = await api.getState();
      setState(s);
      return s;
    } catch (err) {
      setError(err?.message || "Unexpected error");
      return null;
    } finally {
      if (showSpinner) setLoading(false);
    }
  }

  async function startGame() {
    setLoading(true);
    setError(null);
    try {
      await api.startSession();
      await refreshState();
      setScreen("game");
    } catch (e) {
      setError(e?.message || "Unexpected error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <>
      <Background />
      {screen === "home" ? (
        <HomeScreen onStart={startGame} loading={loading} error={error} />
      ) : (
        <div className="page">
          <div className="container">
            <div className="title">Hendoone</div>

            {error && <p className="error">Error: {error}</p>}

            {state && !isStep0Done(state) ? (
              <Step0Word onSuccess={() => refreshState()} />
            ) : (
              <div className="card">
                <p className="subtitle">Step 1</p>
                <div className="h2">Coming soon</div>
                <p className="helper" style={{ textAlign: "left" }}>
                  Step 1 UI will appear here once implemented.
                </p>
              </div>
            )}

            <button
              className="btnPrimary"
              style={{ width: "100%" }}
              onClick={() => refreshState({ showSpinner: true })}
              disabled={loading}
            >
              {loading ? "Refreshing..." : "Refresh"}
            </button>

            <button className="btnPrimary" onClick={() => setScreen("home")} disabled={loading}>
              Back
            </button>
          </div>
        </div>
      )}
    </>
  );
}
