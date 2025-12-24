import { Routes, Route, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import AdminPanel from "./pages/AdminPanel";
import AppGame from "./AppGame";

import logo1 from "./assets/recolorLOGO3.png";
// import logo2 from "./assets/logo2.png";
import "./index.css"; // or whatever your main css file is

export default function App() {
  return (
    <div className="appShell">
      <TopBar />

      <main className="appContent">
        <Routes>
          <Route path="/" element={<AppGame />} />
          <Route path="/admin-panel" element={<AdminPanel />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      <footer className="appFooter">
        <img className="footerLogo" src={logo1} alt="Logo 1" />
        {/* <img className="footerLogo" src={logo2} alt="Logo 2" /> */}
      </footer>
    </div>
  );
}
