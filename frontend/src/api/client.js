const API_BASE = import.meta.env.VITE_API_BASE || "/api";

async function request(path, options = {}) {
  const isForm = options.body instanceof FormData;

  const res = await fetch(`${API_BASE}${path}`, {
    credentials: "include",
    ...options,
    headers: {
      ...(isForm ? {} : { "Content-Type": "application/json" }),
      ...(options.headers || {}),
    },
  });

  const isJson = res.headers.get("content-type")?.includes("application/json");
  const data = isJson ? await res.json().catch(() => null) : await res.text().catch(() => "");

  if (!res.ok) {
    const msg =
      (data && data.detail) ||
      (data && data.message) ||
      (typeof data === "string" && data) ||
      `API error (${res.status})`;
    throw new Error(msg);
  }

  return data;
}

export const api = {
  startSession: () => request("/session/", { method: "POST" }),
  getState: () => request("/state/"),
  step0Word: (answer) =>
    request("/step0/word/", {
      method: "POST",
      body: JSON.stringify({ answer }),
    }),
};
