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
      setError("Please choose a photo first.");
      return;
    }
    setLoading(true);
    setError(null);

    try {
      const res = await api.step3Selfie(file, retain);
      if (res?.success) {
        await onSuccess();
      } else {
        setError(res?.message || "Upload failed");
      }
    } catch (err) {
      setError(err?.message || "Server error");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="card">
      <p className="subtitle">Step 3</p>
      <div className="h2">Take a selfie at the location</div>

      <p className="helper" style={{ textAlign: "left", marginTop: 10 }}>
        Take a selfie at the requested spot. You can upload it without allowing us to save it, or
        allow saving for admin verification.
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
        <span className="fileBoxText">{file ? "Change photo" : "Choose / Take photo"}</span>
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
          {loading ? "Uploading..." : "Upload (Don’t Save)"}
        </button>

        <button
          className="btnPrimary"
          type="button"
          onClick={() => upload(true)}
          disabled={loading || !file}
        >
          {loading ? "Uploading..." : "Upload (Allow Saving)"}
        </button>
      </div>

      {error && <p className="error">{error}</p>}
    </div>
  );
}
