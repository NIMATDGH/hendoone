import { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import Background from "./components/Background";

export default function App() {
  const [screen, setScreen] = useState("home"); 
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [gameState, setGameState] = useState(null);

  async function startGame() {
    setLoading(true);
    setError(null);

    try {
      const sessionRes = await fetch("/api/session/", {
        method: "POST",
        credentials: "include",
      });
      if (!sessionRes.ok) throw new Error(`Session failed (${sessionRes.status})`);

      const stateRes = await fetch("/api/state/", {
        credentials: "include",
      });
      if (!stateRes.ok) throw new Error(`State failed (${stateRes.status})`);

      const state = await stateRes.json();
      setGameState(state);
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

            <div className="card">
              <p className="subtitle">Step {gameState?.current_step ?? "?"}</p>

              {gameState?.current_step === 0 ? (
                <>
                  <div className="h2">Step 0</div>
                  <p className="helper" style={{ textAlign: "left" }}>
                    Word gate goes here. Next we’ll build the input + submit UI.
                  </p>
                </>
              ) : (
                <p className="helper" style={{ textAlign: "left" }}>
                  This is a placeholder. Next we’ll render the correct step based on
                  <code> current_step</code>.
                </p>
              )}
            </div>

            <button className="btnPrimary" onClick={() => setScreen("home")}>
              Back
            </button>
          </div>
        </div>
      )}
    </>
  );
}
