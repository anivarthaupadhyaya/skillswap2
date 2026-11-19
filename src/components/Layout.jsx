import { useEffect, useRef, useState } from 'react';
import { Link, navigate, usePath } from '../router';
import { currentUser, fullName, logout, resetDemo, useStore } from '../data/store';
import { Avatar, useToast } from './ui';

export function Brand({ to = '/' }) {
  return (
    <Link to={to} className="brand">
      <span className="brand-mark" aria-hidden="true">
        <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round">
          <path d="M7 7h11l-3-3M17 17H6l3 3" />
        </svg>
      </span>
      SkillSwap
    </Link>
  );
}

const NAV = [
  ['/dashboard', 'Home'],
  ['/skills', 'Skill Catalog'],
  ['/requests', 'Requests'],
  ['/sessions', 'Sessions'],
  ['/feedback', 'Feedback']
];

export default function Layout({ children }) {
  const path = usePath();
  const me = useStore(currentUser);
  const unread = useStore((s) => s.notifications.filter((n) => n.userId === s.currentUserId && !n.read).length);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  useEffect(() => setMenuOpen(false), [path]);

  return (
    <div className="shell">
      <header className="topbar">
        <div className="topbar-inner">
          <Brand to="/dashboard" />
          <nav className="mainnav" aria-label="Main">
            {NAV.map(([to, label]) => (
              <Link key={to} to={to} className={path === to || path.startsWith(to + '/') ? 'active' : ''}>
                {label}
              </Link>
            ))}
          </nav>
          <div className="topbar-right">
            <Link to="/notifications" className={`icon-btn ${path === '/notifications' ? 'active' : ''}`} aria-label={`Notifications, ${unread} unread`}>
              <svg viewBox="0 0 24 24" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M6 8a6 6 0 1 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
              </svg>
              {unread > 0 && <span className="badge-dot">{unread > 9 ? '9+' : unread}</span>}
            </Link>
            <div className="usermenu" ref={menuRef}>
              <button className="user-btn" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
                <Avatar user={me} size={32} />
                <span className="user-meta">
                  <strong>{me.firstName}</strong>
                  <small>{me.role.charAt(0) + me.role.slice(1).toLowerCase()}</small>
                </span>
              </button>
              {menuOpen && (
                <div className="menu" role="menu">
                  <div className="menu-head">
                    <strong>{fullName(me)}</strong>
                    <small className="muted">{me.email}</small>
                    <small className="muted">{me.department}</small>
                  </div>
                  <button
                    role="menuitem"
                    onClick={() => {
                      resetDemo();
                      toast('Demo data has been reset');
                    }}
                  >
                    Reset demo data
                  </button>
                  <button
                    role="menuitem"
                    className="danger"
                    onClick={() => {
                      logout();
                      navigate('/');
                    }}
                  >
                    Log out
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>
      <main className="page">{children}</main>
      <footer className="app-footer">
        <span>© {new Date().getFullYear()} SkillSwap · Corporate Knowledge Exchange Portal</span>
        <span className="muted">Demo mode · data is stored in your browser</span>
      </footer>
    </div>
  );
}
