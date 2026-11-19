import { Link } from '../router';
import { Brand } from '../components/Layout';
import { CATEGORIES } from '../data/seed';
import { useStore } from '../data/store';

const FEATURES = [
  ['🎓', 'Skill mentorship', 'Connect with mentors across the company for focused one-on-one sessions.'],
  ['🔄', 'Peer exchange', 'Teach what you know, learn what you need. Everyone is both a mentor and a mentee.'],
  ['📅', 'Slot booking', 'Mentors propose in-person or video slots and mentees confirm in one click.'],
  ['💬', 'Built-in chat', 'Every accepted request gets its own conversation thread.'],
  ['🔔', 'Notifications', 'Stay in the loop on requests, slots, messages and feedback.'],
  ['⭐', 'Ratings & feedback', 'Rate mentors and track your growth with structured feedback.']
];

export default function Landing() {
  const stats = useStore((s) => ({
    skills: s.skills.length,
    mentors: s.users.filter((u) => u.role === 'MENTOR').length,
    sessions: s.sessions.length
  }));

  return (
    <div className="landing">
      <header className="landing-nav">
        <Brand />
        <div className="row gap-sm">
          <Link to="/login" className="btn btn-ghost">Log in</Link>
          <Link to="/register" className="btn btn-primary">Get started</Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <span className="eyebrow">Corporate Knowledge Exchange Portal</span>
          <h1>
            Learn from the people <span className="grad">you already work with.</span>
          </h1>
          <p className="lead">
            SkillSwap fosters a culture of continuous learning by connecting colleagues for mutual skill development,
            from yoga and guitar to Python and public speaking.
          </p>
          <div className="row gap-sm wrap">
            <Link to="/register" className="btn btn-primary btn-lg">Create free account</Link>
            <Link to="/login" className="btn btn-outline btn-lg">Try the demo →</Link>
          </div>
          <div className="hero-stats">
            <div><strong>{stats.skills}+</strong><span>skills shared</span></div>
            <div><strong>{stats.mentors}</strong><span>active mentors</span></div>
            <div><strong>{CATEGORIES.length}</strong><span>categories</span></div>
          </div>
        </div>

        <div className="hero-visual" aria-hidden="true">
          <div className="float-card fc-1">
            <span className="fc-emoji">🧘</span>
            <div><strong>Morning Yoga Flow</strong><small>with Priya · Tomorrow 8:00</small></div>
          </div>
          <div className="float-card fc-2">
            <span className="fc-emoji">✅</span>
            <div><strong>Request accepted</strong><small>Acoustic Guitar Basics</small></div>
          </div>
          <div className="float-card fc-3">
            <span className="fc-emoji">⭐</span>
            <div><strong>4.9 / 5</strong><small>average mentor rating</small></div>
          </div>
          <div className="orb" />
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Everything you need to grow together</h2>
        <div className="feature-grid">
          {FEATURES.map(([icon, title, text]) => (
            <article key={title} className="feature">
              <span className="feature-icon">{icon}</span>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section">
        <h2 className="section-title">Explore by category</h2>
        <div className="chip-cloud">
          {CATEGORIES.map((c) => (
            <span key={c.key} className={`tag tag-lg tint-${c.tint}`}>
              {c.emoji} {c.name}
            </span>
          ))}
        </div>
      </section>

      <section className="cta-band">
        <h2>Ready to swap skills?</h2>
        <p>Jump in with a demo account: no setup needed.</p>
        <Link to="/login" className="btn btn-light btn-lg">Open the demo</Link>
      </section>

      <footer className="app-footer">
        <span>© {new Date().getFullYear()} SkillSwap. All rights reserved.</span>
      </footer>
    </div>
  );
}
