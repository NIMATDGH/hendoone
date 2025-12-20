const API_BASE = import.meta.env.VITE_API_BASE || "/api";

const request = async (path, options = {}) => {
  const isForm = options.body instanceof FormData;

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
    ...options,
  });

  const text = await res.text();
  let data;
  try {
    data = text ? JSON.parse(text) : null;
  } catch {
    data = text;
  }

  if (!res.ok) {
    const msg = (data && (data.message || data.detail)) || `HTTP ${res.status}`;
    throw new Error(msg);
  }
  return data;
};

export const api = {
  startSession: () => request("/session/", { method: "POST" }),
  getState: () => request("/state/"),
  step0Word: (answer) =>
    request("/step0/word/", {
      method: "POST",
      body: JSON.stringify({ answer }),
    }),
  step1Color: (colors) =>
    request("/step1/color/", {
      method: "POST",
      body: JSON.stringify({ colors }),
    }),
  step2Objects: (answers) =>
    request("/step2/objects/", {
      method: "POST",
      body: JSON.stringify({ answers }),
    }),
  step3Selfie: (file, retain) => {
    const fd = new FormData();
    fd.append("file", file);
    fd.append("retain", retain ? "true" : "false");

    return request("/step3/selfie/", {
      method: "POST",
      body: fd,
    });
  },
  finish: () => request("/finish/", { method: "POST" }),
  adminLogin: (password) =>
    request("/admin/login/", {
      method: "POST",
      body: JSON.stringify({ password }),
    }),
  adminLogout: () => request("/admin/logout/", { method: "POST" }),
  adminSessions: (q = "", limit = 80) => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    qs.set("limit", String(limit));
    return request(`/admin/sessions/?${qs.toString()}`);
  },
};
