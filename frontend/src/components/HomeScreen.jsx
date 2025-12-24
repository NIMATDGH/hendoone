import watermelon from "../assets/watermelon.png";
import "./HomeScreen.css";


export default function HomeScreen({ onStart, loading, error }) {
  return (
    <div className="page">
      <div className="container">
        <div className="title">هندونه</div>

        <div className="card">
          <p className="subtitle">این یه بازی معمولی نیست</p>

          <div className="h2"></div>
          <ul className="bullets">
            <li>این یه بازی معمولی نیست.
قرار نیست چیزی قایم شده باشه،
فقط باید حواست جمع‌تر از همیشه باشه.</li>

            <li>جواب‌ها همین اطرافن،
ولی خودشون رو راحت نشون نمی‌دن.
یه کم دقیق‌تر نگاه کن.</li>
            <li>اگه جایی گیر کردی،
یار مخفی هست.
با یه نشونه‌ی کوچیک قرمز.
</li>
          </ul>

          <div className="watermelonWrap">
            <img className="watermelonImg" src={watermelon} alt="Watermelon slice" />
          </div>

          {error && <p className="error">Error: {error}</p>}
        </div>

        <button className="btnPrimary" onClick={onStart} disabled={loading}>
          {loading ? "در حال شروع ..." : "شروع"}
        </button>
      </div>
    </div>
  );
}
