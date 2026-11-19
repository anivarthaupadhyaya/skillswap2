import { useEffect, useRef, useState } from 'react';
import { Link, navigate, usePath } from '../router';
import { currentUser, fullName, logout, resetDemo, useStore } from '../data/store';
import { Avatar, Icon, useToast } from './ui';

export function Brand({ to = '/' }) {
  return (
    <Link to={to} className="brand">
      <span className="brand-mark" aria-hidden="true">S</span>
      <span>SkillSwap</span>
    </Link>
  );
}

const NAV = [
  ['/dashboard', 'Overview', 'home'],
  ['/skills', 'Skill catalog', 'grid'],
  ['/requests', 'Requests', 'file'],
  ['/sessions', 'Sessions', 'calendar'],
  ['/feedback', 'Feedback', 'star']
];

export default function Layout({ children }) {
  const path = usePath();
  const me = useStore(currentUser);
  const unread = useStore((s) => s.notifications.filter((n) => n.userId === s.currentUserId && !n.read).length);
  const pending = useStore((s) => s.requests.filter((r) => r.mentorId === s.currentUserId && r.status === 'PROPOSED').length);
  const [drawer, setDrawer] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const toast = useToast();

  useEffect(() => {
    const close = (e) => menuRef.current && !menuRef.current.contains(e.target) && setMenuOpen(false);
    document.addEventListener('mousedown', close);
    return () => document.removeEventListener('mousedown', close);
  }, []);
  useEffect(() => {
    setDrawer(false);
    setMenuOpen(false);
  }, [path]);

  const isActive = (to) => path === to || path.startsWith(to + '/');
  const roleLabel = me.role.charAt(0) + me.role.slice(1).toLowerCase();

  return (
    <div className="app">
      <aside className={`sidebar ${drawer ? 'open' : ''}`}>
        <div className="sidebar-top">
          <Brand to="/dashboard" />
        </div>
        <nav className="sidenav" aria-label="Main">
          {NAV.map(([to, label, icon]) => (
            <Link key={to} to={to} className={isActive(to) ? 'active' : ''}>
              <Icon name={icon} />
              <span>{label}</span>
              {to === '/requests' && pending > 0 && <span className="nav-count">{pending}</span>}
            </Link>
          ))}
          <Link to="/notifications" className={isActive('/notifications') ? 'active' : ''}>
            <Icon name="bell" />
            <span>Notifications</span>
            {unread > 0 && <span className="nav-count">{unread}</span>}
          </Link>
        </nav>

        <div className="sidebar-bottom" ref={menuRef}>
          {menuOpen && (
            <div className="menu" role="menu">
              <div className="menu-head">
                <strong>{fullName(me)}</strong>
                <span className="muted">{me.email}</span>
              </div>
              <button
                role="menuitem"
                onClick={() => {
                  resetDemo();
                  setMenuOpen(false);
                  toast('Demo data reset');
                }}
              >
                <Icon name="refresh" /> Reset demo data
              </button>
              <button
                role="menuitem"
                onClick={() => {
                  logout();
                  navigate('/');
                }}
              >
                <Icon name="logout" /> Sign out
              </button>
            </div>
          )}
          <button className="account" onClick={() => setMenuOpen((o) => !o)} aria-expanded={menuOpen}>
            <Avatar user={me} size={30} />
            <span className="account-meta">
              <strong>{fullName(me)}</strong>
              <span>{roleLabel} · {me.department}</span>
            </span>
            <Icon name="chevronDown" size={14} />
          </button>
        </div>
      </aside>
      {drawer && <div className="scrim" onClick={() => setDrawer(false)} />}

      <div className="main">
        <header className="mobilebar">
          <button className="icon-btn" onClick={() => setDrawer(true)} aria-label="Open menu">
            <Icon name="menu" size={20} />
          </button>
          <Brand to="/dashboard" />
          <Link to="/notifications" className="icon-btn" aria-label={`Notifications, ${unread} unread`}>
            <Icon name="bell" size={20} />
            {unread > 0 && <span className="bell-dot" />}
          </Link>
        </header>
        <main className="page">{children}</main>
      </div>
    </div>
  );
}
