import watermelon from "../assets/watermelon.png";

export default function HomeScreen({ onStart, loading, error }) {
  return (
    <div className="page">
      <div className="container">
        <div className="title">Hendoone</div>

        <div className="card">
          <p className="subtitle">A short real-world puzzle hunt</p>

          <div className="h2">How it works</div>
          <ul className="bullets">
            <li>Solve each step in order</li>
            <li>Your progress stays on this device</li>
            <li>Selfie is optional &amp; your choice to save</li>
          </ul>

          <div className="watermelonWrap">
            <img className="watermelonImg" src={watermelon} alt="Watermelon slice" />
          </div>

          {error && <p className="error">Error: {error}</p>}
        </div>

        <button className="btnPrimary" onClick={onStart} disabled={loading}>
          {loading ? "Starting..." : "Start"}
        </button>
      </div>
    </div>
  );
}
