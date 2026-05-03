import React, { useState } from "react";
import background from "../../assets/background.jpg";
import "../../styles/Home.css";

function IconBook({ color = "#185FA5", size = 32 }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
      <path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/>
      <path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>
    </svg>
  );
}

const Home = ({ onLoginClick }) => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ fname: "", email: "", message: "" });
  const [errors, setErrors] = useState({});

  const scrollTo = (id) => {
    const el = document.getElementById(id);
    if (el) el.scrollIntoView({ behavior: "smooth" });
  };

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = true;
    if (!formData.message) newErrors.message = true;
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setSubmitted(true);
    setFormData({ fname: "", email: "", message: "" });
    setErrors({});
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="home-container">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon-wrap"><IconBook color="#fff" size={22} /></div>
          <h2>SchoolCore</h2>
        </div>
        <ul className="nav-links">
          <li onClick={() => scrollTo("hero")}>Home</li>
          <li onClick={() => scrollTo("courses")}>Courses</li>
          <li onClick={() => scrollTo("languages")}>Languages</li>
          <li onClick={() => scrollTo("contact")}>Contact</li>
        </ul>
        <div className="auth-buttons">
          <button className="login" onClick={onLoginClick}>Login</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
        id="hero"
        className="hero"
        style={{
          backgroundImage: `url(${background})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
          position: "relative",
        }}
      >
        <div className="hero-overlay" />
        <div className="hero-content">
          <div className="hero-badge">Trusted by 1,200+ students worldwide</div>
          <h1>Learn Languages<br />with Confidence</h1>
          <p>Certified teachers · Flexible schedules · CEFR certificates</p>
          <div className="hero-actions">
            <button className="cta-btn" onClick={onLoginClick}>Get Started</button>
            <button className="cta-btn-secondary" onClick={() => scrollTo("courses")}>Explore Courses</button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats">
        <div className="stat-card"><h3>1,200+</h3><p>Students</p></div>
        <div className="stat-card"><h3>45+</h3><p>Teachers</p></div>
        <div className="stat-card"><h3>60+</h3><p>Courses</p></div>
        <div className="stat-card"><h3>10+</h3><p>Languages</p></div>
        <div className="stat-card"><h3>98%</h3><p>Satisfaction</p></div>
      </section>

      {/* ── WHY US ── */}
      <section className="section why-us">
        <div className="section-label">Why choose us</div>
        <h2>The Language School difference</h2>
        <div className="why-grid">
          {[
            { icon: "🎓", title: "Certified Teachers", desc: "International certifications, avg. 8 yrs experience." },
            { icon: "📅", title: "Flexible Scheduling", desc: "Morning, evening & weekend classes." },
            { icon: "🌍", title: "10+ Languages", desc: "English, French, Spanish, German, Arabic, Mandarin…" },
            { icon: "📜", title: "Recognized Certificates", desc: "CEFR-aligned, valued by universities & employers." },
            { icon: "💻", title: "Online & In-Person", desc: "Our Algiers campus or live remote sessions." },
            { icon: "🤝", title: "Small Groups", desc: "Max 12 students per class." },
          ].map(w => (
            <div className="why-card" key={w.title}>
              <div className="why-icon">{w.icon}</div>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── COURSES ── */}
      <section id="courses" className="section courses-section">
        <div className="section-label">Our Courses</div>
        <h2>Choose your language</h2>
        <div className="cards">
          {[
            { lang: "English",  tag: "Most popular",            lessons: 24, hours: "60h" },
            { lang: "French",   tag: "Beginner → Advanced",     lessons: 20, hours: "50h" },
            { lang: "Spanish",  tag: "Beginner → Advanced",     lessons: 22, hours: "55h" },
            { lang: "German",   tag: "Beginner → Advanced",     lessons: 18, hours: "45h" },
            { lang: "Arabic",   tag: "Modern Standard",         lessons: 16, hours: "40h" },
            { lang: "Mandarin", tag: "Beginner → Intermediate", lessons: 20, hours: "50h" },
          ].map(c => (
            <div className="card course-card" key={c.lang}>
              <div className="course-tag">{c.tag}</div>
              <div className="course-title">{c.lang}</div>
              <div className="course-meta">{c.lessons} lessons · {c.hours}</div>
              <button className="course-btn">View course →</button>
            </div>
          ))}
        </div>
      </section>

      {/* ── LANGUAGES ── */}
      <section id="languages" className="section why-us">
        <div className="section-label">Languages</div>
        <h2>Languages we offer</h2>
        <div className="why-grid">
          {[
            { icon: "🇬🇧", title: "English", desc: "From A1 beginner to C2 mastery. IELTS & TOEFL prep available." },
            { icon: "🇫🇷", title: "French", desc: "All levels. DELF/DALF exam preparation included." },
            { icon: "🇪🇸", title: "Spanish", desc: "Latin American & Castilian. DELE certification prep." },
            { icon: "🇩🇪", title: "German", desc: "Goethe Institut aligned curriculum. A1 to C1." },
            { icon: "🇸🇦", title: "Arabic", desc: "Modern Standard Arabic & Darija dialect options." },
            { icon: "🇨🇳", title: "Mandarin", desc: "Beginner to intermediate. HSK exam preparation." },
          ].map(w => (
            <div className="why-card" key={w.title}>
              <div className="why-icon">{w.icon}</div>
              <h3>{w.title}</h3>
              <p>{w.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section id="contact" className="section contact">
        <div className="section-label">Contact</div>
        <h2>Get in touch</h2>
        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-item">
              <div className="info-icon-wrap">📍</div>
              <div className="info-text"><strong>Address</strong><span>12 Rue Didouche Mourad, Algiers 16000</span></div>
            </div>
            <hr className="info-divider" />
            <div className="info-item">
              <div className="info-icon-wrap">📞</div>
              <div className="info-text"><strong>Phone</strong><span>+213 23 456 789 · Mon–Sat 8am–6pm</span></div>
            </div>
            <hr className="info-divider" />
            <div className="info-item">
              <div className="info-icon-wrap">✉️</div>
              <div className="info-text"><strong>Email</strong><span>contact@languageschool.dz</span></div>
            </div>
          </div>

          <div className="contact-form-panel">
            {submitted && <div className="success-msg">✓ Message sent! We'll reply within 24h.</div>}
            <div className="field">
              <label>Name</label>
              <input type="text" placeholder="Mohamed Kaci" value={formData.fname} onChange={e => setFormData({ ...formData, fname: e.target.value })} />
            </div>
            <div className="field">
              <label>Email *</label>
              <input type="email" placeholder="you@example.com" className={errors.email ? "input-error" : ""} value={formData.email} onChange={e => setFormData({ ...formData, email: e.target.value })} />
            </div>
            <div className="field">
              <label>Message *</label>
              <textarea placeholder="How can we help?" className={errors.message ? "input-error" : ""} value={formData.message} onChange={e => setFormData({ ...formData, message: e.target.value })} />
            </div>
            <div className="submit-row">
              <span className="submit-note">Reply within <strong>24h</strong></span>
              <button className="btn-contact-submit" onClick={handleSubmit}>Send message →</button>
            </div>
          </div>
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="footer">
        <div className="footer-inner">
          <div className="footer-brand">
            <div className="footer-logo">
              <div className="footer-logo-icon"><IconBook color="#185FA5" size={20} /></div>
              <strong>Language School</strong>
            </div>
            <p>Professional language education since 2010.<br />Algiers, Algeria.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <strong>Courses</strong>
              <span>English</span><span>French</span><span>Spanish</span><span>German</span>
            </div>
            <div className="footer-col">
              <strong>School</strong>
              <span>About Us</span><span>Languages</span>
            </div>
            <div className="footer-col">
              <strong>Support</strong>
              <span onClick={() => scrollTo("contact")} style={{cursor:"pointer"}}>Contact</span>
            </div>
          </div>
        </div>
        <div className="footer-bottom">
          <p>© 2026 Language School. All rights reserved.</p>
          <div className="footer-bottom-links">
            <span>Privacy Policy</span>
            <span>Terms of Use</span>
          </div>
        </div>
      </footer>

    </div>
  );
};

export default Home;