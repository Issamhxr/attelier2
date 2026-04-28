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

  const [openFaq, setOpenFaq] = useState(null);
  const [subject, setSubject] = useState("Course info");
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    fname: "", lname: "", email: "", phone: "", message: ""
  });
  const [errors, setErrors] = useState({});

  const faqs = [
    { q: "How do I enroll in a course?", a: "Click 'Enroll Now', choose your course, and complete the registration form. Our team will contact you within 24 hours to confirm your spot." },
    { q: "Are classes online or in-person?", a: "We offer both options. Attend in-person at our campus in Algiers, or join live sessions remotely from anywhere in the world." },
    { q: "What is the maximum class size?", a: "We keep groups small — a maximum of 12 students per class — to ensure personalized attention and faster progress." },
    { q: "Do you offer internationally recognized certificates?", a: "Yes. Upon completing a course, you receive a certificate of proficiency aligned with the CEFR international framework." },
    { q: "Can I switch levels during a course?", a: "Absolutely. If a level isn't the right fit, our academic coordinator will assess your level and move you to the appropriate class." },
  ];

  const handleSubmit = () => {
    const newErrors = {};
    if (!formData.email) newErrors.email = true;
    if (!formData.message) newErrors.message = true;
    if (Object.keys(newErrors).length > 0) { setErrors(newErrors); return; }
    setSubmitted(true);
    setFormData({ fname: "", lname: "", email: "", phone: "", message: "" });
    setErrors({});
    setTimeout(() => setSubmitted(false), 5000);
  };

  return (
    <div className="home-container">

      {/* ── NAVBAR ── */}
      <nav className="navbar">
        <div className="logo">
          <div className="logo-icon-wrap">
            <IconBook color="#fff" size={22} />
          </div>
          <h2>SchoolCore</h2>
        </div>
        <ul className="nav-links">
          <li>Home</li>
          <li>About</li>
          <li>Courses</li>
          <li>Teachers</li>
          <li>Contact</li>
        </ul>
        <div className="auth-buttons">
          <button className="login" onClick={onLoginClick}>Login</button>
          <button className="enroll">Enroll Now</button>
        </div>
      </nav>

      {/* ── HERO ── */}
      <section
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
          <p>Professional language education with certified teachers, flexible schedules, and internationally recognized certificates.</p>
          <div className="hero-actions">
            <button className="cta-btn">Get Started</button>
            <button className="cta-btn-secondary">Explore Courses</button>
          </div>
        </div>
      </section>

      {/* ── STATS ── */}
      <section className="stats">
        <div className="stat-card"><h3>1,200+</h3><p>Students Enrolled</p></div>
        <div className="stat-card"><h3>45+</h3><p>Certified Teachers</p></div>
        <div className="stat-card"><h3>60+</h3><p>Courses Available</p></div>
        <div className="stat-card"><h3>10+</h3><p>Languages Offered</p></div>
        <div className="stat-card"><h3>98%</h3><p>Satisfaction Rate</p></div>
      </section>

      {/* ── ABOUT ── */}
      <section className="section about">
        <div className="about-grid">
          <div className="about-text">
            <div className="section-label">About Us</div>
            <h2>A school built on excellence</h2>
            <p>Founded in 2010, Language School is one of Algeria's leading language education institutions. We are dedicated to helping students achieve fluency through interactive lessons, experienced teachers, and modern teaching techniques.</p>
            <p>Our campus in central Algiers welcomes students of all ages and levels — from complete beginners to advanced professionals seeking certification.</p>
            <button className="btn-outline-blue">Learn more about us</button>
          </div>
          <div className="about-highlights">
            <div className="highlight-card">
              <span className="highlight-num">15+</span>
              <span className="highlight-label">Years of experience</span>
            </div>
            <div className="highlight-card">
              <span className="highlight-num">CEFR</span>
              <span className="highlight-label">Aligned curriculum</span>
            </div>
            <div className="highlight-card">
              <span className="highlight-num">A1–C2</span>
              <span className="highlight-label">All proficiency levels</span>
            </div>
            <div className="highlight-card">
              <span className="highlight-num">12</span>
              <span className="highlight-label">Students max per class</span>
            </div>
          </div>
        </div>
      </section>

      {/* ── WHY US ── */}
      <section className="section why-us">
        <div className="section-label">Why choose us</div>
        <h2>The Language School difference</h2>
        <div className="why-grid">
          <div className="why-card">
            <div className="why-icon">🎓</div>
            <h3>Certified Teachers</h3>
            <p>All instructors hold international teaching certifications with an average of 8 years of experience.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">📅</div>
            <h3>Flexible Scheduling</h3>
            <p>Morning, evening, and weekend classes available to fit your lifestyle and professional commitments.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🌍</div>
            <h3>10+ Languages</h3>
            <p>From English and French to Arabic, Spanish, German and Mandarin — we cover the world's major languages.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">📜</div>
            <h3>Recognized Certificates</h3>
            <p>Our CEFR-aligned certificates are valued by universities, employers, and immigration authorities worldwide.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">💻</div>
            <h3>Online & In-Person</h3>
            <p>Attend class from our Algiers campus or join live sessions remotely — the choice is yours.</p>
          </div>
          <div className="why-card">
            <div className="why-icon">🤝</div>
            <h3>Small Group Classes</h3>
            <p>Maximum 12 students per class ensures personalized attention and a faster learning curve.</p>
          </div>
        </div>
      </section>

      {/* ── HOW IT WORKS ── */}
      <section className="section how-it-works">
        <div className="section-label-light">Process</div>
        <h2 className="h2-light">How to get started</h2>
        <div className="steps">
          <div className="step">
            <div className="step-number">01</div>
            <h3>Choose a Course</h3>
            <p>Browse our catalog and select the language and level that suits you best.</p>
          </div>
          <div className="step-divider" />
          <div className="step">
            <div className="step-number">02</div>
            <h3>Register Online</h3>
            <p>Fill in the enrollment form. Our team confirms your spot within 24 hours.</p>
          </div>
          <div className="step-divider" />
          <div className="step">
            <div className="step-number">03</div>
            <h3>Attend Classes</h3>
            <p>Join in-person or online sessions taught by certified language experts.</p>
          </div>
          <div className="step-divider" />
          <div className="step">
            <div className="step-number">04</div>
            <h3>Get Certified</h3>
            <p>Complete your course and receive your internationally recognized certificate.</p>
          </div>
        </div>
      </section>

      {/* ── COURSES ── */}
      <section className="section courses-section">
        <div className="section-label">Our Courses</div>
        <h2>Choose your language</h2>
        <div className="cards">
          {[
            { lang: "English", tag: "Most popular", lessons: 24, hours: "60h" },
            { lang: "French", tag: "Beginner → Advanced", lessons: 20, hours: "50h" },
            { lang: "Spanish", tag: "Beginner → Advanced", lessons: 22, hours: "55h" },
            { lang: "German", tag: "Beginner → Advanced", lessons: 18, hours: "45h" },
            { lang: "Arabic", tag: "Modern Standard", lessons: 16, hours: "40h" },
            { lang: "Mandarin", tag: "Beginner → Intermediate", lessons: 20, hours: "50h" },
          ].map((c) => (
            <div className="card course-card" key={c.lang}>
              <div className="course-tag">{c.tag}</div>
              <div className="course-title">{c.lang}</div>
              <div className="course-meta">{c.lessons} lessons · {c.hours} of content</div>
              <button className="course-btn">View course →</button>
            </div>
          ))}
        </div>
      </section>

      {/* ── TEACHERS ── */}
      <section className="section teachers-section">
        <div className="section-label">Our Team</div>
        <h2>Meet the teachers</h2>
        <div className="cards">
          {[
            { initials: "JD", name: "John Doe", subject: "English & German", rating: "4.9", years: 8 },
            { initials: "SS", name: "Sarah Smith", subject: "French & Spanish", rating: "4.8", years: 6 },
            { initials: "AB", name: "Ali Ben", subject: "Arabic & English", rating: "4.9", years: 10 },
          ].map((t) => (
            <div className="card teacher-card" key={t.name}>
              <div className="teacher-avatar">{t.initials}</div>
              <h3>{t.name}</h3>
              <p>{t.subject}</p>
              <div className="teacher-meta">
                <span className="teacher-badge">⭐ {t.rating}</span>
                <span className="teacher-badge">{t.years} yrs exp.</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── TESTIMONIALS ── */}
      <section className="section testimonials">
        <div className="section-label">Testimonials</div>
        <h2>What our students say</h2>
        <div className="testimonials-grid">
          {[
            { text: "Great school with excellent teachers! I reached B2 level in French in just 6 months. The small class size made a huge difference.", name: "Amira M.", stars: 5 },
            { text: "I improved my language skills rapidly. The online format was very convenient and the teacher was always available.", name: "Yacine B.", stars: 4 },
            { text: "Professional team, structured curriculum, and real results. The certificate I got here helped me land a job abroad.", name: "Fatima L.", stars: 5 },
          ].map((t) => (
            <div className="testimonial-card" key={t.name}>
              <div className="stars">{"⭐".repeat(t.stars)}</div>
              <p>"{t.text}"</p>
              <div className="testimonial-author">
                <div className="t-avatar">{t.name.split(" ").map(n => n[0]).join("")}</div>
                <span className="t-name">{t.name}</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── PARTNERS ── */}
      <section className="section partners">
        <div className="section-label">Partners</div>
        <h2>Internationally recognized</h2>
        <div className="partners-grid">
          {["Alliance Française", "British Council", "Goethe Institut", "Instituto Cervantes", "Cambridge English"].map(p => (
            <div className="partner-logo" key={p}>{p}</div>
          ))}
        </div>
      </section>

      {/* ── FAQ ── */}
      <section className="section faq">
        <div className="section-label">FAQ</div>
        <h2>Frequently asked questions</h2>
        <div className="faq-list">
          {faqs.map((item, i) => (
            <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`} onClick={() => setOpenFaq(openFaq === i ? null : i)}>
              <div className="faq-question">
                <span>{item.q}</span>
                <span className="faq-icon">{openFaq === i ? "−" : "+"}</span>
              </div>
              {openFaq === i && <div className="faq-answer">{item.a}</div>}
            </div>
          ))}
        </div>
      </section>

      {/* ── NEWSLETTER ── */}
      <section className="newsletter">
        <div className="newsletter-inner">
          <div className="section-label-light">Newsletter</div>
          <h2 className="h2-light">Stay updated</h2>
          <p>Get the latest course announcements, language tips, and exclusive offers straight to your inbox.</p>
          <div className="newsletter-form">
            <input type="email" placeholder="Enter your email address" />
            <button>Subscribe</button>
          </div>
        </div>
      </section>

      {/* ── CONTACT ── */}
      <section className="section contact">
        <div className="section-label">Contact</div>
        <h2>Get in touch</h2>
        <p className="contact-subtitle">Have a question about our courses or pricing? Our team responds within 24 hours on business days.</p>

        <div className="contact-grid">
          <div className="contact-info">
            <div className="info-item">
              <div className="info-icon-wrap">📍</div>
              <div className="info-text">
                <strong>Address</strong>
                <span>12 Rue Didouche Mourad<br />Algiers 16000, Algeria</span>
              </div>
            </div>
            <hr className="info-divider" />
            <div className="info-item">
              <div className="info-icon-wrap">📞</div>
              <div className="info-text">
                <strong>Phone</strong>
                <span>+213 23 456 789<br />Mon – Sat, 8am – 6pm</span>
              </div>
            </div>
            <hr className="info-divider" />
            <div className="info-item">
              <div className="info-icon-wrap">✉️</div>
              <div className="info-text">
                <strong>Email</strong>
                <span>contact@languageschool.dz<br />support@languageschool.dz</span>
              </div>
            </div>
            <hr className="info-divider" />
            <div className="social-section">
              <p className="social-label">Follow us</p>
              <div className="social-row">
                <div className="social-btn">f</div>
                <div className="social-btn">in</div>
                <div className="social-btn">ig</div>
                <div className="social-btn">tw</div>
              </div>
            </div>
          </div>

          <div className="contact-form-panel">
            {submitted && (
              <div className="success-msg">
                ✓ Message sent! We'll get back to you within 24 hours.
              </div>
            )}
            <div className="form-row">
              <div className="field">
                <label>First name</label>
                <input type="text" placeholder="Mohamed" value={formData.fname} onChange={e => setFormData({...formData, fname: e.target.value})} />
              </div>
              <div className="field">
                <label>Last name</label>
                <input type="text" placeholder="Kaci" value={formData.lname} onChange={e => setFormData({...formData, lname: e.target.value})} />
              </div>
            </div>
            <div className="field">
              <label>Email address *</label>
              <input type="email" placeholder="you@example.com" className={errors.email ? "input-error" : ""} value={formData.email} onChange={e => setFormData({...formData, email: e.target.value})} />
            </div>
            <div className="field">
              <label>Phone (optional)</label>
              <input type="tel" placeholder="+213 6 00 00 00 00" value={formData.phone} onChange={e => setFormData({...formData, phone: e.target.value})} />
            </div>
            <div className="field">
              <label>Subject</label>
              <div className="subject-chips">
                {["Course info", "Enrollment", "Pricing", "Partnerships", "Other"].map(s => (
                  <button key={s} className={`chip ${subject === s ? "active" : ""}`} onClick={() => setSubject(s)}>{s}</button>
                ))}
              </div>
            </div>
            <div className="field">
              <label>Message *</label>
              <textarea placeholder="Tell us what you'd like to know…" className={errors.message ? "input-error" : ""} value={formData.message} onChange={e => setFormData({...formData, message: e.target.value})} />
            </div>
            <div className="submit-row">
              <span className="submit-note">We reply within <strong>24h</strong> on business days</span>
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
              <div className="footer-logo-icon">
                <IconBook color="#185FA5" size={20} />
              </div>
              <strong>Language School</strong>
            </div>
            <p>Professional language education since 2010.<br />Algiers, Algeria.</p>
          </div>
          <div className="footer-cols">
            <div className="footer-col">
              <strong>Courses</strong>
              <span>English</span>
              <span>French</span>
              <span>Spanish</span>
              <span>German</span>
            </div>
            <div className="footer-col">
              <strong>School</strong>
              <span>About Us</span>
              <span>Our Teachers</span>
              <span>Testimonials</span>
              <span>Partners</span>
            </div>
            <div className="footer-col">
              <strong>Support</strong>
              <span>FAQ</span>
              <span>Contact</span>
              <span>Enrollment</span>
              <span>Newsletter</span>
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
