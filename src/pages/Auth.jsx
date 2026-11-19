import { useState } from 'react';
import { Link, navigate } from '../router';
import { Brand } from '../components/Layout';
import { login, register } from '../data/store';

function AuthShell({ title, subtitle, children, aside }) {
  return (
    <div className="auth">
      <div className="auth-panel">
        <Brand />
        <div className="auth-form-wrap">
          <h1>{title}</h1>
          <p className="muted">{subtitle}</p>
          {children}
        </div>
      </div>
      <aside className="auth-aside" aria-hidden="true">
        <div className="auth-quote">
          {aside}
        </div>
      </aside>
    </div>
  );
}

export function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const submit = (e) => {
    e.preventDefault();
    const err = login(email, password);
    if (err) setError(err);
    else navigate('/dashboard');
  };
  const demo = (who) => {
    login(who === 'mentor' ? 'mentor@skillswap.dev' : 'mentee@skillswap.dev', 'demo123');
    navigate('/dashboard');
  };

  return (
    <AuthShell
      title="Welcome back"
      subtitle="Log in to continue your learning journey."
      aside={<><p>“I learned guitar from a colleague two floors up. Best thing our company ever launched.”</p><span>Alex M. · Product</span></>}
    >
      <div className="demo-box">
        <span className="demo-label">Quick demo login</span>
        <div className="demo-buttons">
          <button type="button" className="btn btn-outline" onClick={() => demo('mentee')}>🎓 As a Mentee</button>
          <button type="button" className="btn btn-outline" onClick={() => demo('mentor')}>🧑‍🏫 As a Mentor</button>
        </div>
      </div>
      <div className="divider"><span>or use email</span></div>
      <form onSubmit={submit} className="form">
        {error && <div className="alert alert-bad">{error}</div>}
        <label className="field">
          <span>Email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com" required autoComplete="email" />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="••••••••" required autoComplete="current-password" />
        </label>
        <button className="btn btn-primary btn-block btn-lg" type="submit">Log in</button>
      </form>
      <p className="auth-switch">
        New to SkillSwap? <Link to="/register">Create an account</Link>
      </p>
    </AuthShell>
  );
}

export function Register() {
  const [form, setForm] = useState({ firstName: '', lastName: '', email: '', password: '', department: '', role: 'MENTEE' });
  const [error, setError] = useState('');
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const submit = (e) => {
    e.preventDefault();
    if (form.password.length < 6) return setError('Password must be at least 6 characters.');
    const err = register(form);
    if (err) setError(err);
    else navigate('/dashboard');
  };

  return (
    <AuthShell
      title="Create your account"
      subtitle="Join your colleagues and start swapping skills."
      aside={<><p>“Teaching chess to the data team made me a better mentor and a better player.”</p><span>Sara K. · Data</span></>}
    >
      <form onSubmit={submit} className="form">
        {error && <div className="alert alert-bad">{error}</div>}
        <div className="form-row">
          <label className="field"><span>First name</span><input value={form.firstName} onChange={set('firstName')} required /></label>
          <label className="field"><span>Last name</span><input value={form.lastName} onChange={set('lastName')} required /></label>
        </div>
        <label className="field"><span>Work email</span><input type="email" value={form.email} onChange={set('email')} required autoComplete="email" /></label>
        <label className="field"><span>Password</span><input type="password" value={form.password} onChange={set('password')} required autoComplete="new-password" placeholder="At least 6 characters" /></label>
        <label className="field"><span>Department</span><input value={form.department} onChange={set('department')} required placeholder="e.g. Engineering" /></label>
        <div className="field">
          <span>I want to join as</span>
          <div className="role-pick">
            {[
              ['MENTEE', '🎓', 'Mentee', 'Learn new skills'],
              ['MENTOR', '🧑‍🏫', 'Mentor', 'Share your expertise']
            ].map(([value, icon, label, hint]) => (
              <label key={value} className={`role-option ${form.role === value ? 'selected' : ''}`}>
                <input type="radio" name="role" value={value} checked={form.role === value} onChange={set('role')} />
                <span className="role-icon">{icon}</span>
                <strong>{label}</strong>
                <small className="muted">{hint}</small>
              </label>
            ))}
          </div>
        </div>
        <button className="btn btn-primary btn-block btn-lg" type="submit">Create account</button>
      </form>
      <p className="auth-switch">
        Already have an account? <Link to="/login">Log in</Link>
      </p>
    </AuthShell>
  );
}
