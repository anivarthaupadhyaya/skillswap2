import { Link, navigate } from '../router';
import { currentUser, fullName, markAllRead, markRead, userById, useStore } from '../data/store';
import { Avatar, EmptyState, fmtDate, PageHeader, Stars, timeAgo } from '../components/ui';

const ICON = {
  REQUEST_RECEIVED: '📥', REQUEST_SENT: '📤', REQUEST_ACCEPTED: '✅', REQUEST_DECLINED: '❌',
  SKILL_CREATED: '📚', CHAT_RECEIVED: '💬', SESSION_SCHEDULED: '📅', SESSION_UPDATED: '🗓',
  SESSION_COMPLETED: '🏁', FEEDBACK_RECEIVED: '⭐', SYSTEM_ALERT: '🔔'
};

export function Notifications() {
  const s = useStore();
  const me = currentUser(s);
  const list = s.notifications.filter((n) => n.userId === me.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  const unread = list.filter((n) => !n.read).length;

  return (
    <div className="narrow stack-lg">
      <PageHeader
        title="Notifications"
        subtitle={unread ? `You have ${unread} unread notification${unread > 1 ? 's' : ''}.` : 'You are all caught up.'}
        actions={unread > 0 && <button className="btn btn-outline" onClick={markAllRead}>Mark all as read</button>}
      />
      {list.length === 0 ? (
        <EmptyState icon="🔔" title="No notifications yet" />
      ) : (
        <div className="notif-list">
          {list.map((n) => (
            <button
              key={n.id}
              className={`notif ${n.read ? '' : 'unread'}`}
              onClick={() => {
                markRead(n.id);
                if (n.link) navigate(n.link);
              }}
            >
              <span className="notif-icon">{ICON[n.type] || '🔔'}</span>
              <span className="grow">
                <strong>{n.title}</strong>
                <span className="muted">{n.message}</span>
              </span>
              <small className="muted nowrap">{timeAgo(n.createdAt)}</small>
              {!n.read && <span className="dot dot-on" aria-label="unread" />}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

export function Feedback() {
  const s = useStore();
  const me = currentUser(s);
  const list = s.feedback.filter((f) => f.givenTo === me.id).sort((a, b) => new Date(b.date) - new Date(a.date));
  const avg = (k) => (list.length ? list.reduce((a, f) => a + f[k], 0) / list.length : 0);
  const dist = [5, 4, 3, 2, 1].map((star) => [star, list.filter((f) => f.rating === star).length]);

  return (
    <div className="stack-lg">
      <PageHeader title="My Feedback" subtitle="What your colleagues are saying about sessions with you." />
      {list.length === 0 ? (
        <EmptyState icon="⭐" title="No feedback received yet">
          {me.role === 'MENTOR' ? 'Complete sessions with mentees to start receiving ratings.' : 'Mentors will leave feedback after your sessions.'}
          {' '}<Link to="/sessions">Go to sessions →</Link>
        </EmptyState>
      ) : (
        <>
          <section className="feedback-summary card">
            <div className="big-rating">
              <strong>{avg('rating').toFixed(2)}</strong>
              <Stars value={avg('rating')} size={20} />
              <small className="muted">{list.length} review{list.length > 1 ? 's' : ''}</small>
            </div>
            <div className="dist">
              {dist.map(([star, n]) => (
                <div key={star} className="dist-row">
                  <span>{star}★</span>
                  <div className="bar"><div style={{ width: `${(n / list.length) * 100}%` }} /></div>
                  <span className="muted">{n}</span>
                </div>
              ))}
            </div>
            <div className="sub-ratings">
              <div><span className="muted small">Skill development</span><strong>{avg('skillDev').toFixed(1)} / 5</strong></div>
              <div><span className="muted small">Communication</span><strong>{avg('comm').toFixed(1)} / 5</strong></div>
            </div>
          </section>
          <div className="feedback-grid">
            {list.map((f) => {
              const by = userById(s, f.givenBy);
              return (
                <article key={f.id} className="card feedback-card">
                  <div className="row gap-sm">
                    <Avatar user={by} />
                    <div className="grow">
                      <strong>{fullName(by)}</strong>
                      <small className="muted">{fmtDate(f.date)}</small>
                    </div>
                    <Stars value={f.rating} />
                  </div>
                  <p>“{f.comment}”</p>
                  <div className="row gap-sm wrap">
                    <span className="tag">Skill development · {f.skillDev}/5</span>
                    <span className="tag">Communication · {f.comm}/5</span>
                  </div>
                </article>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
}

export function NotFound() {
  return (
    <div className="narrow">
      <EmptyState icon="🧭" title="Page not found">
        <Link to="/">Go back home →</Link>
      </EmptyState>
    </div>
  );
}
