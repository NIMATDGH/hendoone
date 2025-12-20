import { useEffect, useState } from "react";
import { api } from "../api/client";

export default function AdminPanel() {
  const [pw, setPw] = useState("");
  const [loggedIn, setLoggedIn] = useState(false);
  const [q, setQ] = useState("");
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function loadList(query = q) {
    setLoading(true);
    setError(null);
    try {
      const res = await api.adminSessions(query);
      setItems(res?.items || []);
      setLoggedIn(true);
    } catch (e) {
      if (String(e?.message || "").toLowerCase().includes("forbidden")) {
        setLoggedIn(false);
      } else {
        setError(e?.message || "Failed to load sessions");
      }
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadList("");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function login(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      await api.adminLogin(pw);
      setPw("");
      await loadList("");
      setLoggedIn(true);
    } catch (e2) {
      setError(e2?.message || "Login failed");
      setLoggedIn(false);
    } finally {
      setLoading(false);
    }
  }

  async function logout() {
    setLoading(true);
    setError(null);
    try {
      await api.adminLogout();
      setLoggedIn(false);
      setItems([]);
    } catch (e) {
      setError(e?.message || "Logout failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="page">
      <div className="container">
        <div className="title">Admin</div>

        {!loggedIn ? (
          <div className="card">
            <p className="subtitle">Admin Panel</p>
            <div className="h2">Enter password</div>

            <form onSubmit={login} style={{ marginTop: 14 }}>
              <input
                className="input"
                type="password"
                value={pw}
                onChange={(e) => setPw(e.target.value)}
                placeholder="Password"
                disabled={loading}
              />

              <button className="btnPrimary" style={{ marginTop: 14 }} disabled={loading || !pw}>
                {loading ? "Signing in…" : "Login"}
              </button>

              {error && <p className="error">{error}</p>}
            </form>
          </div>
        ) : (
          <div className="card">
            <p className="subtitle">Sessions</p>

            <div className="adminTopRow">
              <input
                className="input"
                value={q}
                onChange={(e) => setQ(e.target.value)}
                placeholder="Search session_id or final_code…"
                disabled={loading}
              />
              <button className="btnPrimary adminSmallBtn" onClick={() => loadList(q)} disabled={loading}>
                Search
              </button>
            </div>

            <button className="btnSecondary" style={{ marginTop: 12 }} onClick={logout} disabled={loading}>
              Logout
            </button>

            {error && <p className="error">{error}</p>}

            <div className="adminList">
              {loading ? (
                <p className="helper">Loading…</p>
              ) : items.length === 0 ? (
                <p className="helper">No sessions found.</p>
              ) : (
                items.map((it) => (
                  <div className="adminItem" key={it.session_id}>
                    <div className="adminMeta">
                      <div className="adminCode">{it.final_code || "—"}</div>
                      <div className="adminId">{it.session_id}</div>
                    </div>

                    {it.selfie_url ? (
                      <div className="adminMedia">
                        <img className="adminThumb" src={it.selfie_url} alt="selfie" />
                        <a className="adminDownload" href={`${it.selfie_url}?download=1`}>
                          Download
                        </a>
                      </div>
                    ) : (
                      <div className="helper">No selfie</div>
                    )}
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
