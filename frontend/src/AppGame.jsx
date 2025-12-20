import { useState } from "react";
import HomeScreen from "./components/HomeScreen";
import Step0Word from "./components/Step0Word";
import Step1Color from "./components/Step1Color";
import Step2Objects from "./components/Step2Objects";
import Step3Selfie from "./components/Step3Selfie";
import FinishScreen from "./components/FinishScreen";
import { api } from "./api/client";
import Background from "./components/Background";

function isStepDone(state, n) {
  return Boolean(state?.steps?.[`step${n}`]?.completed);
}

export default function AppGame() {
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

            {!state ? (
              <div className="card">
                <p className="subtitle">Loading...</p>
              </div>
            ) : !isStepDone(state, 0) ? (
              <Step0Word onSuccess={refreshState} />
            ) : !isStepDone(state, 1) ? (
              <Step1Color onSuccess={refreshState} />
            ) : !isStepDone(state, 2) ? (
              <Step2Objects onSuccess={refreshState} />
            ) : !isStepDone(state, 3) ? (
              <Step3Selfie onSuccess={refreshState} />
            ) : (
              <FinishScreen />
            )}

            
          </div>
        </div>
      )}
    </>
  );
}
