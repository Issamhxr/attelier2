import { useState } from "react";
import "../../styles/Login.css";

function IconBook() {
  return (
    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}
function IconUsers() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/>
    </svg>
  );
}
function IconCalendar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="4" width="18" height="18" rx="2"/>
      <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/>
    </svg>
  );
}
function IconActivity() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
    </svg>
  );
}
function IconDollar() {
  return (
    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="12" y1="1" x2="12" y2="23"/>
      <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/>
    </svg>
  );
}
function IconMail() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a9ab0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/>
      <polyline points="22,6 12,13 2,6"/>
    </svg>
  );
}
function IconLock() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#8a9ab0" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
      <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
    </svg>
  );
}
function IconEye({ crossed }) {
  return crossed ? (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"/>
      <line x1="1" y1="1" x2="23" y2="23"/>
    </svg>
  ) : (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/>
      <circle cx="12" cy="12" r="3"/>
    </svg>
  );
}
function IconAlert() {
  return (
    <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <circle cx="12" cy="12" r="10"/>
      <line x1="12" y1="8" x2="12" y2="12"/>
      <line x1="12" y1="16" x2="12.01" y2="16"/>
    </svg>
  );
}
function IconArrow() {
  return (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <line x1="5" y1="12" x2="19" y2="12"/>
      <polyline points="12 5 19 12 12 19"/>
    </svg>
  );
}
function IconClose() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
    </svg>
  );
}
function IconCheck() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <polyline points="20 6 9 17 4 12"/>
    </svg>
  );
}

const FEATURES = [
  { icon: <IconUsers />,    label: "Student and class management" },
  { icon: <IconCalendar />, label: "Automatic course scheduling" },
  { icon: <IconActivity />, label: "Real-time progress tracking" },
  { icon: <IconDollar />,   label: "Payment tracking and invoicing" },
];

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000";

/* ── Forgot Password Modal ── */
function ForgotPasswordModal({ onClose }) {
  const [email, setEmail]         = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [error, setError]         = useState("");
  const [loading, setLoading]     = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!email || !/\S+@\S+\.\S+/.test(email)) {
      setError("Please enter a valid email address.");
      return;
    }
    setError("");
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/auth/forgot-password`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.message || "An error occurred. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><IconClose /></button>

        {submitted ? (
          <div className="modal-success">
            <div className="modal-success-icon"><IconCheck /></div>
            <h3 className="modal-title">Check your inbox</h3>
            <p className="modal-text">
              If an account is linked to <strong>{email}</strong>, you'll receive a password reset link shortly.
            </p>
            <button className="btn-modal-primary" onClick={onClose}>Back to login</button>
          </div>
        ) : (
          <>
            <h3 className="modal-title">Forgot your password?</h3>
            <p className="modal-text">
              Enter your email address and we'll send you a link to reset your password.
            </p>
            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="reset-email">Email address</label>
                <div className="input-wrap">
                  <div className="input-icon"><IconMail /></div>
                  <input
                    id="reset-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); setError(""); }}
                    className={`form-input${error ? " has-error" : ""}`}
                    autoComplete="email"
                  />
                </div>
                {error && <p className="error-msg">{error}</p>}
              </div>
              <button type="submit" className="btn-modal-primary" disabled={loading}>
                {loading ? <div className="spinner-ring" /> : "Send reset link"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Contact Admin Modal — now connected to real API ── */
function ContactAdminModal({ onClose }) {
  const [name, setName]           = useState("");
  const [email, setEmail]         = useState("");
  const [message, setMessage]     = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [errors, setErrors]       = useState({});
  const [serverError, setServerError] = useState("");
  const [loading, setLoading]     = useState(false);

  const validate = () => {
    const e = {};
    if (!name.trim())                            e.name    = "Full name is required.";
    if (!email || !/\S+@\S+\.\S+/.test(email))  e.email   = "Valid email is required.";
    if (!message.trim())                         e.message = "Please write a message.";
    else if (message.trim().length < 10)         e.message = "Message must be at least 10 characters.";
    return e;
  };

  const handleSubmit = async (ev) => {
    ev.preventDefault();
    setServerError("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/contact`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ name, email, message }),
      });
      const data = await res.json();
      if (!res.ok) {
        setServerError(data.message || "An error occurred. Please try again.");
      } else {
        setSubmitted(true);
      }
    } catch {
      setServerError("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const clear = (field) => setErrors((prev) => ({ ...prev, [field]: null }));

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-box" onClick={(e) => e.stopPropagation()}>
        <button className="modal-close" onClick={onClose} aria-label="Close"><IconClose /></button>

        {submitted ? (
          <div className="modal-success">
            <div className="modal-success-icon"><IconCheck /></div>
            <h3 className="modal-title">Message sent!</h3>
            <p className="modal-text">
              The administrator will review your request and get back to you at <strong>{email}</strong>.
            </p>
            <button className="btn-modal-primary" onClick={onClose}>Back to login</button>
          </div>
        ) : (
          <>
            <h3 className="modal-title">Contact administrator</h3>
            <p className="modal-text">
              Don't have an account yet? Send a message to the administrator to request access.
            </p>

            {serverError && (
              <div className="alert" style={{ marginBottom: "16px" }}>
                <IconAlert /> {serverError}
              </div>
            )}

            <form onSubmit={handleSubmit} noValidate>
              <div className="form-group">
                <label className="form-label" htmlFor="c-name">Full name</label>
                <input
                  id="c-name"
                  type="text"
                  placeholder="Your full name"
                  value={name}
                  onChange={(e) => { setName(e.target.value); clear("name"); }}
                  className={`form-input form-input--no-icon${errors.name ? " has-error" : ""}`}
                />
                {errors.name && <p className="error-msg">{errors.name}</p>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="c-email">Email address</label>
                <div className="input-wrap">
                  <div className="input-icon"><IconMail /></div>
                  <input
                    id="c-email"
                    type="email"
                    placeholder="your@email.com"
                    value={email}
                    onChange={(e) => { setEmail(e.target.value); clear("email"); }}
                    className={`form-input${errors.email ? " has-error" : ""}`}
                    autoComplete="email"
                  />
                </div>
                {errors.email && <p className="error-msg">{errors.email}</p>}
              </div>
              <div className="form-group">
                <label className="form-label" htmlFor="c-msg">Message</label>
                <textarea
                  id="c-msg"
                  placeholder="Describe your role and why you need access…"
                  value={message}
                  onChange={(e) => { setMessage(e.target.value); clear("message"); }}
                  className={`form-textarea${errors.message ? " has-error" : ""}`}
                  rows={3}
                />
                {errors.message && <p className="error-msg">{errors.message}</p>}
              </div>
              <button type="submit" className="btn-modal-primary" disabled={loading}>
                {loading ? <div className="spinner-ring" /> : "Send message"}
              </button>
            </form>
          </>
        )}
      </div>
    </div>
  );
}

/* ── Main Login Page ── */
export default function LoginPage() {
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [showPw, setShowPw]     = useState(false);
  const [remember, setRemember] = useState(false);
  const [loading, setLoading]   = useState(false);
  const [errors, setErrors]     = useState({});
  const [alert, setAlert]       = useState("");

  const [showForgot,  setShowForgot]  = useState(false);
  const [showContact, setShowContact] = useState(false);

  const validate = () => {
    const e = {};
    if (!email || !/\S+@\S+\.\S+/.test(email)) e.email    = "Invalid email address.";
    if (!password)                              e.password = "Password is required.";
    return e;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setAlert("");
    const errs = validate();
    setErrors(errs);
    if (Object.keys(errs).length > 0) return;
    setLoading(true);
    try {
      const res  = await fetch(`${API_URL}/api/auth/login`, {
        method:  "POST",
        headers: { "Content-Type": "application/json" },
        body:    JSON.stringify({ email, password }),
      });
      const data = await res.json();
      if (!res.ok) {
        setAlert(data.message || "Invalid email or password.");
      } else {
        localStorage.setItem("token",  data.accessToken);
        localStorage.setItem("role",   data.user.role);
        localStorage.setItem("nom",    data.user.nom    || "");
        localStorage.setItem("prenom", data.user.prenom || "");

        switch (data.user.role) {
          case "admin":      window.location.href = "/admin";      break;
          case "professeur": window.location.href = "/professeur"; break;
          case "secretaire": window.location.href = "/secretaire"; break;
          case "etudiant":   window.location.href = "/etudiant";   break;
          default:           window.location.href = "/login";
        }
      }
    } catch {
      setAlert("Unable to connect to the server.");
    } finally {
      setLoading(false);
    }
  };

  const clearError = (field) => setErrors((prev) => ({ ...prev, [field]: null }));

  return (
    <div className="login-page">
      {showForgot  && <ForgotPasswordModal onClose={() => setShowForgot(false)} />}
      {showContact && <ContactAdminModal   onClose={() => setShowContact(false)} />}

      {/* LEFT PANEL */}
      <div className="panel-left">
        <div className="brand">
          <div className="brand-icon"><IconBook /></div>
          <span className="brand-name">SchoolCore</span>
        </div>
        <div className="panel-content">
          <h2 className="panel-tagline">
            Manage your school<br /><em>effortlessly.</em>
          </h2>
          <p className="panel-sub">
            The all-in-one platform for language schools. Enrollments,
            scheduling, payments and academic tracking — all in one place.
          </p>
          <ul className="features-list">
            {FEATURES.map((f, i) => (
              <li key={i}>
                <div className="feat-dot">{f.icon}</div>
                {f.label}
              </li>
            ))}
          </ul>
        </div>
        <div className="panel-footer">© 2025 SchoolCore. All rights reserved.</div>
      </div>

      {/* RIGHT PANEL */}
      <div className="panel-right">
        <div className="login-card">
          <div className="card-header">
            <p className="card-eyebrow">Welcome</p>
            <h1 className="card-title">Sign in to SchoolCore</h1>
            <p className="card-subtitle">Access your management dashboard</p>
          </div>

          {alert && (
            <div className="alert">
              <IconAlert />{alert}
            </div>
          )}

          <form onSubmit={handleSubmit} noValidate>
            <div className="form-group">
              <label className="form-label" htmlFor="email">Email address</label>
              <div className="input-wrap">
                <div className="input-icon"><IconMail /></div>
                <input
                  id="email" type="email" placeholder="your@email.com"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); clearError("email"); }}
                  className={`form-input${errors.email ? " has-error" : ""}`}
                  autoComplete="email"
                />
              </div>
              {errors.email && <p className="error-msg">{errors.email}</p>}
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="password">Password</label>
              <div className="input-wrap">
                <div className="input-icon"><IconLock /></div>
                <input
                  id="password" type={showPw ? "text" : "password"} placeholder="••••••••"
                  value={password}
                  onChange={(e) => { setPassword(e.target.value); clearError("password"); }}
                  className={`form-input has-pw-toggle${errors.password ? " has-error" : ""}`}
                  autoComplete="current-password"
                />
                <button type="button" className="toggle-pw"
                  onClick={() => setShowPw(!showPw)} aria-label="Show/hide password">
                  <IconEye crossed={showPw} />
                </button>
              </div>
              {errors.password && <p className="error-msg">{errors.password}</p>}
            </div>

            <div className="form-row">
              <label className="checkbox-wrap">
                <input type="checkbox" checked={remember}
                  onChange={(e) => setRemember(e.target.checked)} />
                Remember me
              </label>
              <button type="button" className="forgot-link" onClick={() => setShowForgot(true)}>
                Forgot your password?
              </button>
            </div>

            <button type="submit" className="btn-login" disabled={loading}>
              {loading ? <div className="spinner-ring" /> : <>Sign in <IconArrow /></>}
            </button>
          </form>

          <div className="card-footer">
            Don't have an account?{" "}
            <button type="button" className="footer-link-btn" onClick={() => setShowContact(true)}>
              Contact admin
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}