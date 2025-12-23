import { useState } from "react";
import { api } from "../api/client";

export default function Step0Word({ onSuccess }) {
  const [answer, setAnswer] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      const res = await api.step0Word(answer.trim());
      if (res?.success) {
        await onSuccess();
      } else {
        setError(res?.message || "کلمه اشتباه است !");
      }
    } catch (err) {
      setError(err?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <p className="step0">مرحله 0</p>
      <div className="h2-quote3">
        شبی که سفره هنوز جمع نشده
        <br />
        بوی انار و آجیل تو هواست
        <br />
        چشم‌ها دنبال آخرین خوشمزگیه
        <br />
        رسمیه که همیشه آخر شب میاد
        <br />
        همه می‌دونن بدون اون، یلدا کامل نیست
      </div>
      <div className="h2-quote4">
        «قصه‌ها از اولین جمله معنا می‌گیرند»
      </div>

      <form onSubmit={submit} style={{ marginTop: 14 }}>
        <input
          className="input2"
          value={answer}
          onChange={(e) => setAnswer(e.target.value)}
          placeholder="مانند هندونه"
          autoCapitalize="none"
          autoCorrect="off"
          autoComplete="off"
          spellCheck={false}
          disabled={loading}
        />

        <button
          className="btnPrimary"
          style={{ marginTop: 14 }}
          disabled={loading || !answer.trim()}
        >
          {loading ? "در حال بررسی ..." : "ادامه"}
        </button>

        {error && <p className="error">{error}</p>}
      </form>
    </div>
  );
}
