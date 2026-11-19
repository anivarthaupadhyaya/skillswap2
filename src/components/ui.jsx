import { createContext, useCallback, useContext, useState } from 'react';
import { categoryByKey } from '../data/seed';

export const fmtDate = (iso) =>
  new Date(iso).toLocaleDateString(undefined, { day: '2-digit', month: 'short', year: 'numeric' });
export const fmtTime = (iso) => new Date(iso).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' });
export const fmtDateTime = (iso) => `${fmtDate(iso)} · ${fmtTime(iso)}`;
export function timeAgo(iso) {
  const diff = (Date.now() - new Date(iso).getTime()) / 1000;
  if (diff < 60) return 'just now';
  if (diff < 3600) return `${Math.floor(diff / 60)}m ago`;
  if (diff < 86400) return `${Math.floor(diff / 3600)}h ago`;
  if (diff < 86400 * 7) return `${Math.floor(diff / 86400)}d ago`;
  return fmtDate(iso);
}

const STATUS_LABEL = {
  PENDING_MENTEE_CONFIRMATION: 'Awaiting confirmation',
  REJECTED_BY_MENTEE: 'Rejected',
  IN_PROGRESS: 'In progress'
};
const STATUS_TONE = {
  PROPOSED: 'warn', ACCEPTED: 'ok', DECLINED: 'bad', COMPLETED: 'info',
  SCHEDULED: 'ok', PENDING_MENTEE_CONFIRMATION: 'warn', REJECTED_BY_MENTEE: 'bad',
  CANCELLED: 'bad', RESCHEDULED: 'muted', IN_PROGRESS: 'info'
};

export function StatusPill({ status }) {
  const label = STATUS_LABEL[status] || status.charAt(0) + status.slice(1).toLowerCase();
  return <span className={`pill pill-${STATUS_TONE[status] || 'muted'}`}>{label}</span>;
}

export function Avatar({ user, size = 36 }) {
  if (!user) return null;
  const initials = `${user.firstName[0] || ''}${user.lastName[0] || ''}`.toUpperCase();
  const hue = (user.id * 67) % 360;
  return (
    <span
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.38, '--hue': hue }}
      aria-hidden="true"
    >
      {initials}
    </span>
  );
}

export function CategoryTag({ k }) {
  const c = categoryByKey[k];
  if (!c) return null;
  return (
    <span className={`tag tint-${c.tint}`}>
      <span aria-hidden="true">{c.emoji}</span> {c.name}
    </span>
  );
}

export function Stars({ value, size = 16 }) {
  return (
    <span className="stars" style={{ fontSize: size }} aria-label={`${value.toFixed(1)} out of 5`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= Math.round(value) ? 'on' : ''}>★</span>
      ))}
    </span>
  );
}

export function EmptyState({ icon = '✨', title, children }) {
  return (
    <div className="empty">
      <div className="empty-icon" aria-hidden="true">{icon}</div>
      <h3>{title}</h3>
      {children && <div className="muted">{children}</div>}
    </div>
  );
}

export function PageHeader({ title, subtitle, actions }) {
  return (
    <div className="page-header">
      <div>
        <h1>{title}</h1>
        {subtitle && <p className="muted">{subtitle}</p>}
      </div>
      {actions && <div className="page-actions">{actions}</div>}
    </div>
  );
}

// ---------- toasts ----------
const ToastCtx = createContext(() => {});
export const useToast = () => useContext(ToastCtx);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);
  const push = useCallback((text, tone = 'ok') => {
    const id = Math.random();
    setToasts((t) => [...t, { id, text, tone }]);
    setTimeout(() => setToasts((t) => t.filter((x) => x.id !== id)), 3200);
  }, []);
  return (
    <ToastCtx.Provider value={push}>
      {children}
      <div className="toasts" role="status" aria-live="polite">
        {toasts.map((t) => (
          <div key={t.id} className={`toast toast-${t.tone}`}>{t.text}</div>
        ))}
      </div>
    </ToastCtx.Provider>
  );
}
