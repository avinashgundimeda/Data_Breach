import { useState, useEffect, useRef } from "react";
import "./App.css";

const FIELDS = ["phone","first_name","last_name","email","gender","location","current_city","hometown","job","date","facebook_id"];

function useTypewriter(text, speed = 22) {
  const [displayed, setDisplayed] = useState("");
  useEffect(() => {
    setDisplayed("");
    let i = 0;
    const timer = setInterval(() => {
      if (i < text.length) { setDisplayed(text.slice(0, i + 1)); i++; }
      else clearInterval(timer);
    }, speed);
    return () => clearInterval(timer);
  }, [text]);
  return displayed;
}

function RecordCard({ record, index }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), index * 120);
    return () => clearTimeout(t);
  }, [index]);
  return (
    <div className={`record-card ${visible ? "visible" : ""}`}>
      <div className="record-header">
        <span className="record-id">// RECORD_{String(index + 1).padStart(3, "0")}</span>
        <span className="record-dot" />
      </div>
      <div className="record-fields">
        {FIELDS.map(f => (
          <div className="field-row" key={f}>
            <span className="field-key">{f.toUpperCase()}</span>
            <span className="field-sep">→</span>
            <span className={`field-val ${!record[f] ? "empty" : ""}`}>
              {record[f] ? String(record[f]) : "NULL"}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusBar({ status }) {
  const msg = useTypewriter(status, 22);
  return (
    <div className="status-bar">
      &gt;_ {msg}<span className="cursor">█</span>
    </div>
  );
}

export default function App() {
  const [form, setForm] = useState({ first_name: "", last_name: "", phone: "" });
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState("SYSTEM READY. AWAITING INPUT...");
  const [scanActive, setScanActive] = useState(false);
  const inputRef = useRef();

  useEffect(() => { inputRef.current?.focus(); }, []);
  const handleChange = e => setForm(p => ({ ...p, [e.target.name]: e.target.value }));

  const search = async () => {
    const { first_name, last_name, phone } = form;
    if (!first_name && !last_name && !phone) { setStatus("ERROR: NO QUERY PARAMETERS PROVIDED."); return; }
    setLoading(true); setScanActive(true); setResult(null);
    setStatus("INITIATING BREACH SCAN...");
    const params = new URLSearchParams();
    if (first_name) params.append("first_name", first_name);
    if (last_name) params.append("last_name", last_name);
    if (phone) params.append("phone", phone);
    try {
      await new Promise(r => setTimeout(r, 700));
      setStatus("QUERYING DATABASE NODE...");
      await new Promise(r => setTimeout(r, 500));
      const res = await fetch(`http://localhost:5000/api/check?${params}`);
      const data = await res.json();
      setResult(data);
      if (!data.found) setStatus("SCAN COMPLETE. NO BREACH RECORDS FOUND.");
      else setStatus(`SCAN COMPLETE. ${data.count} RECORD(S) COMPROMISED.`);
    } catch {
      setStatus("CONNECTION FAILED. BACKEND UNREACHABLE ON PORT 5000.");
      setResult({ error: true });
    } finally { setLoading(false); setScanActive(false); }
  };

  return (
    <div className="app">
      <div className="scanline" />
      <div className="noise" />
      <div className="container">
        <header className="header">
          <div className="logo-row">
            <span className="logo-bracket">[</span>
            <span className="logo-text">BREACH_RADAR</span>
            <span className="logo-bracket">]</span>
          </div>
          <div className="header-meta">
            <span className="meta-item">v2.0.0</span>
            <span className="meta-sep">|</span>
            <span className="meta-item">100K RECORDS</span>
            <span className="meta-sep">|</span>
            <span className={`meta-online ${scanActive ? "scanning" : ""}`}>
              <span className="dot" />{scanActive ? "SCANNING" : "ONLINE"}
            </span>
          </div>
        </header>

        <section className="hero">
          <div className="hero-label">// DATA BREACH INTELLIGENCE SYSTEM</div>
          <h1 className="hero-title">WAS YOUR DATA<br /><span className="hero-accent">EXPOSED?</span></h1>
          <p className="hero-sub">Cross-reference your identity against known breach databases. Enter any combination of fields to initiate scan.</p>
        </section>

        <div className="panel">
          <div className="panel-header">
            <span className="panel-title">QUERY_INTERFACE</span>
            <span className="panel-tag">SECURE</span>
          </div>
          <div className="input-grid">
            <div className="input-wrap">
              <label className="input-label">FIRST_NAME</label>
              <input ref={inputRef} className="inp" name="first_name" value={form.first_name} onChange={handleChange} placeholder="e.g. Sahabuddin" onKeyDown={e => e.key === "Enter" && search()} />
            </div>
            <div className="input-wrap">
              <label className="input-label">LAST_NAME</label>
              <input className="inp" name="last_name" value={form.last_name} onChange={handleChange} placeholder="e.g. Laskar" onKeyDown={e => e.key === "Enter" && search()} />
            </div>
            <div className="input-wrap full">
              <label className="input-label">PHONE_NUMBER</label>
              <input className="inp" name="phone" value={form.phone} onChange={handleChange} placeholder="e.g. 917278666831" onKeyDown={e => e.key === "Enter" && search()} />
            </div>
          </div>
          <button className={`btn ${loading ? "loading" : ""}`} onClick={search} disabled={loading}>
            {loading ? "SCANNING..." : ">_ EXECUTE BREACH SCAN"}
          </button>
        </div>

        <StatusBar status={status} />

        {result && !result.error && (
          <div className="results">
            {!result.found ? (
              <div className="result-safe">
                <div className="safe-icon">✓</div>
                <div>
                  <div className="safe-title">NO BREACH DETECTED</div>
                  <div className="safe-sub">Identity not found in breach database. Stay vigilant.</div>
                </div>
              </div>
            ) : (
              <div className="result-breach">
                <div className="breach-header">
                  <div className="breach-icon">!</div>
                  <div>
                    <div className="breach-title">BREACH CONFIRMED</div>
                    <div className="breach-sub">{result.count} record(s) found in compromised dataset</div>
                  </div>
                  <div className="breach-count">{result.count}</div>
                </div>
                <div className="records-list">
                  {result.results.map((r, i) => <RecordCard key={i} record={r} index={i} />)}
                </div>
              </div>
            )}
          </div>
        )}

        {result?.error && (
          <div className="result-error">CONNECTION_ERROR: Backend not reachable. Ensure server is running on port 5000.</div>
        )}

        <footer className="footer">
          BUILT_BY: <span>AVINASH_GUNDIMEDA</span> &nbsp;|&nbsp; FOR EDUCATIONAL USE ONLY &nbsp;|&nbsp; 2025
        </footer>
      </div>
    </div>
  );
}