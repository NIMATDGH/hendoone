import { Routes, Route, Navigate } from "react-router-dom";
import TopBar from "./components/TopBar";
import AdminPanel from "./pages/AdminPanel";
import AppGame from "./AppGame";

export default function App() {
  return (
    <>
      <TopBar />
      <Routes>
        <Route path="/" element={<AppGame />} />
        <Route path="/admin-panel" element={<AdminPanel />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </>
  );
}
