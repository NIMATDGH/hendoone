import { Link, useLocation } from "react-router-dom";

export default function TopBar() {
  const loc = useLocation();
  const inAdmin = loc.pathname.startsWith("/admin-panel");

  return (
    <div className="topBar" aria-label="Top bar">
      <div className="topBarInner">
        <div className="topBarBrand">{inAdmin ? "Admin" : "Hendoone"}</div>
        <Link className="topBarLink" to={inAdmin ? "/" : "/admin-panel"}>
          {inAdmin ? "Game" : "Admin"}
        </Link>
      </div>
    </div>
  );
}
