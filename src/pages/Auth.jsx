import { useState } from 'react';
import { Link, navigate } from '../router';
import { Brand } from '../components/Layout';
import { login, register } from '../data/store';

function AuthShell({ title, children, footer }) {
  return (
    <div className="auth">
      <div className="auth-inner">
        <div className="auth-brand"><Brand /></div>
        <div className="auth-card">
          <h1>{title}</h1>
          {children}
        </div>
        <p className="auth-footer">{footer}</p>
      </div>
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
    <AuthShell title="Sign in" footer={<>Don't have an account? <Link to="/register">Create one</Link></>}>
      <form onSubmit={submit} className="form">
        {error && <div className="alert alert-bad">{error}</div>}
        <label className="field">
          <span>Work email</span>
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required autoComplete="email" autoFocus />
        </label>
        <label className="field">
          <span>Password</span>
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required autoComplete="current-password" />
        </label>
        <button className="btn btn-primary btn-block" type="submit">Sign in</button>
      </form>
      <div className="demo-note">
        <p><strong>Demo accounts</strong>: password <code>demo123</code></p>
        <div className="demo-actions">
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => demo('mentee')}>Continue as mentee</button>
          <button type="button" className="btn btn-secondary btn-sm" onClick={() => demo('mentor')}>Continue as mentor</button>
        </div>
      </div>
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
    <AuthShell title="Create your account" footer={<>Already have an account? <Link to="/login">Sign in</Link></>}>
      <form onSubmit={submit} className="form">
        {error && <div className="alert alert-bad">{error}</div>}
        <div className="form-row">
          <label className="field"><span>First name</span><input value={form.firstName} onChange={set('firstName')} required /></label>
          <label className="field"><span>Last name</span><input value={form.lastName} onChange={set('lastName')} required /></label>
        </div>
        <label className="field"><span>Work email</span><input type="email" value={form.email} onChange={set('email')} required autoComplete="email" /></label>
        <label className="field">
          <span>Password</span>
          <input type="password" value={form.password} onChange={set('password')} required autoComplete="new-password" />
          <small className="muted">At least 6 characters.</small>
        </label>
        <div className="form-row">
          <label className="field"><span>Department</span><input value={form.department} onChange={set('department')} required /></label>
          <label className="field">
            <span>Role</span>
            <select value={form.role} onChange={set('role')}>
              <option value="MENTEE">Mentee</option>
              <option value="MENTOR">Mentor</option>
            </select>
          </label>
        </div>
        <button className="btn btn-primary btn-block" type="submit">Create account</button>
      </form>
    </AuthShell>
  );
}
