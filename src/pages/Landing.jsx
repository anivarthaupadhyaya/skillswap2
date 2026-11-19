import { Link } from '../router';
import { Brand } from '../components/Layout';
import { CATEGORIES } from '../data/seed';
import { useStore } from '../data/store';
import { Icon } from '../components/ui';

const STEPS = [
  ['Find a colleague', 'Browse skills your coworkers have offered to teach, from Python to public speaking, and send a request.'],
  ['Agree on a time', 'Your mentor proposes an in-person or video slot. Confirm it, or ask for another time in the request chat.'],
  ['Learn and give feedback', 'Meet, mark the session complete and rate it, so others know who to learn from next.']
];

function ProductPreview() {
  const rows = [
    ['Morning Yoga Flow', 'Priya Sharma', 'Tue, 8:00 AM', 'Scheduled', 'info'],
    ['Acoustic Guitar Basics', 'Arjun Mehta', 'Thu, 6:00 PM', 'Awaiting confirmation', 'warn'],
    ['Chess Strategy', 'Sara Khan', 'Not scheduled', 'Pending', 'warn'],
    ['Public Speaking', 'Daniel Lee', 'Oct 31', 'Completed', 'muted']
  ];
  return (
    <div className="preview" aria-hidden="true">
      <div className="preview-bar">
        <span /><span /><span />
      </div>
      <div className="preview-body">
        <div className="preview-side">
          <div className="preview-brand"><span className="brand-mark sm">S</span> SkillSwap</div>
          {['Overview', 'Skill catalog', 'Requests', 'Sessions', 'Feedback'].map((x, i) => (
            <div key={x} className={`preview-nav ${i === 3 ? 'on' : ''}`}>{x}</div>
          ))}
        </div>
        <div className="preview-main">
          <div className="preview-title">My sessions</div>
          <table className="preview-table">
            <tbody>
              {rows.map(([skill, who, when, status, tone]) => (
                <tr key={skill}>
                  <td><strong>{skill}</strong><span>{who}</span></td>
                  <td className="hide-sm">{when}</td>
                  <td><span className={`status status-${tone}`}>{status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default function Landing() {
  const counts = useStore((s) => Object.fromEntries(CATEGORIES.map((c) => [c.key, s.skills.filter((k) => k.categories.includes(c.key)).length])));

  return (
    <div className="landing">
      <header className="landing-nav">
        <Brand />
        <nav className="landing-links">
          <a href="#how">How it works</a>
          <a href="#categories">Categories</a>
        </nav>
        <div className="landing-auth">
          <Link to="/login" className="btn btn-ghost">Sign in</Link>
          <Link to="/register" className="btn btn-primary">Create account</Link>
        </div>
      </header>

      <section className="hero">
        <div className="hero-copy">
          <h1>Learn from the people you already work with.</h1>
          <p className="lead">
            SkillSwap is an internal mentoring portal. Employees offer skills they're good at, colleagues request
            sessions, and everyone keeps track of what they've learned in one place.
          </p>
          <div className="hero-actions">
            <Link to="/login" className="btn btn-primary btn-lg">Open the demo</Link>
            <Link to="/register" className="btn btn-secondary btn-lg">Create an account</Link>
          </div>
          <p className="hero-note muted">The demo runs entirely in your browser. No sign-up required.</p>
        </div>
        <ProductPreview />
      </section>

      <section className="section" id="how">
        <h2>How it works</h2>
        <ol className="steps">
          {STEPS.map(([title, text], i) => (
            <li key={title}>
              <span className="step-num">{i + 1}</span>
              <h3>{title}</h3>
              <p className="muted">{text}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="section" id="categories">
        <h2>Categories</h2>
        <div className="landing-cats">
          {CATEGORIES.map((c) => (
            <div key={c.key} className="landing-cat">
              <span className="cat-icon" style={{ color: c.color }}><Icon name={c.icon} size={18} /></span>
              <div>
                <strong>{c.name}</strong>
                <span className="muted">{counts[c.key]} skills</span>
              </div>
            </div>
          ))}
        </div>
      </section>

      <footer className="landing-footer">
        <span>© {new Date().getFullYear()} SkillSwap</span>
        <span className="muted">Corporate Knowledge Exchange Portal</span>
      </footer>
    </div>
  );
}
