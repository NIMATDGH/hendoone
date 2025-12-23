import { useState } from "react";
import { api } from "../api/client";

const KEYS = ["object1", "object2", "object3", "object4", "object5", "object6"];

export default function Step2Objects({ onSuccess }) {
  const [values, setValues] = useState({
    object1: "",
    object2: "",
    object3: "",
    object4: "",
    object5: "",
    object6: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  function setField(key, v) {
    setValues((prev) => ({ ...prev, [key]: v }));
    setError(null);
  }

  function buildAnswers() {
    const answers = {};
    for (const k of KEYS) {
      const raw = String(values[k] ?? "").trim();
      if (!raw) return { error: "هر ۶ عدد باید پر شوند" };
      const num = Number(raw);
      if (!Number.isFinite(num) || !Number.isInteger(num)) {
        return { error: "عدد باید حتما صحیح باشد" };
      }
      answers[k] = num;
    }
    return { answers };
  }

  async function submit() {
    setLoading(true);
    setError(null);

    try {
      const built = buildAnswers();
      if (built.error) {
        setError(built.error);
        return;
      }

      const res = await api.step2Objects(built.answers);
      if (res?.success) {
        await onSuccess();
      } else {
        setError(res?.message || "جواب نادرست");
      }
    } catch (err) {
      setError(err?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <p className="subtitle">مرحله ۲</p>
      <div className="h2-quote2">باکس ها را با جواب درست پر کنید</div>

      <p className="helper" style={{ textAlign: "center", marginTop: 10 }}>
        جایی زیر آسمان
        <br />
        که صندلی ها منتظر آدم ها هستند
        <br />
        نه برعکس
      </p>


      <div className="objGrid">
        {KEYS.map((k, idx) => (
          <label key={k} className="objField">
            <span className="objLabel">باکس {idx + 1}</span>
            <input
              className="input objInput"
              value={values[k]}
              onChange={(e) => setField(k, e.target.value)}
              inputMode="numeric"
              pattern="[0-9]*"
              placeholder="0"
              disabled={loading}
            />
          </label>
        ))}
      </div>

      <button className="btnPrimary" style={{ marginTop: 40 }} onClick={submit} disabled={loading}>
        {loading ? "در حال بررسی ..." : "ارسال"}
      </button>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
