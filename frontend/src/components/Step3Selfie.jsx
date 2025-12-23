import { useMemo, useState } from "react";
import { api } from "../api/client";

export default function Step3Selfie({ onSuccess }) {
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const previewUrl = useMemo(() => (file ? URL.createObjectURL(file) : null), [file]);

  function onPick(e) {
    const f = e.target.files?.[0] || null;
    setError(null);
    setFile(f);
  }

  async function upload(retain) {
    if (!file) {
      setError("لطفا ابتدا عکس را انتخاب کنید");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await api.step3Selfie(file, retain);
      if (res?.success) {
        await onSuccess();
      } else {
        setError(res?.message || "آپلود ناموفق");
      }
    } catch (err) {
      setError(err?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <p className="subtitle">مرحله ۳</p>
      <div className="h2">یه سلفی بگیر 📸</div>

      <p className="helper" style={{ textAlign: "center", marginTop: 10 }}>
        این لحظه کوچک را برای ما ثبت کن؛
        <br />
ما آن را در قلب‌مان نگه می‌داریم
      </p>

      <label className="fileBox">
        <input
          type="file"
          accept="image/*"
          capture="user"
          onChange={onPick}
          disabled={loading}
          style={{ display: "none" }}
        />
        <span className="fileBoxText">{file ? "تغییر عکس" : "انتخاب / گرفتن عکس"}</span>
      </label>

      {previewUrl && (
        <div className="previewWrap">
          <img className="previewImg" src={previewUrl} alt="Selfie preview" />
        </div>
      )}

      <div className="twoButtons">
        <button
          className="btnSecondary"
          type="button"
          onClick={() => upload(false)}
          disabled={loading || !file}
        >
          {loading ? "در حال آپلود" : "آپلود بدون ذخیره سازی"}
        </button>

        <button
          className="btnPrimary btnPrimarySmall"
          type="button"
          onClick={() => upload(true)}
          disabled={loading || !file}
        >
          {loading ? "در حال آپلود" : "آپلود همراه با ذخیره سازی"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
