import { Link, navigate } from '../router';
import { currentUser, fullName, markAllRead, markRead, userById, useStore } from '../data/store';
import { Avatar, EmptyState, fmtDate, Icon, PageHeader, Stars, timeAgo } from '../components/ui';

const ICON = {
  REQUEST_RECEIVED: 'inbox', REQUEST_SENT: 'send', REQUEST_ACCEPTED: 'check', REQUEST_DECLINED: 'x',
  SKILL_CREATED: 'book', CHAT_RECEIVED: 'message', SESSION_SCHEDULED: 'calendar', SESSION_UPDATED: 'clock',
  SESSION_COMPLETED: 'flag', FEEDBACK_RECEIVED: 'star', SYSTEM_ALERT: 'info'
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
        subtitle={unread ? `${unread} unread` : 'All caught up'}
        actions={unread > 0 && <button className="btn btn-secondary" onClick={markAllRead}>Mark all as read</button>}
      />
      {list.length === 0 ? (
        <EmptyState icon="bell" title="No notifications" />
      ) : (
        <div className="panel flush">
          {list.map((n) => (
            <button
              key={n.id}
              className={`notif ${n.read ? '' : 'unread'}`}
              onClick={() => {
                markRead(n.id);
                if (n.link) navigate(n.link);
              }}
            >
              <span className="notif-icon"><Icon name={ICON[n.type] || 'info'} size={16} /></span>
              <span className="grow">
                <span className="row-title">{n.title}</span>
                <span className="row-sub">{n.message}</span>
              </span>
              <span className="row-meta">{timeAgo(n.createdAt)}</span>
              <span className={`unread-dot ${n.read ? '' : 'on'}`} aria-label={n.read ? undefined : 'Unread'} />
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
      <PageHeader title="Feedback" subtitle="Ratings and comments from your sessions" />
      {list.length === 0 ? (
        <EmptyState icon="star" title="No feedback yet">
          {me.role === 'MENTOR' ? 'Ratings appear here after mentees complete sessions with you.' : 'Mentors can leave feedback after your sessions.'}{' '}
          <Link to="/sessions">Go to sessions</Link>
        </EmptyState>
      ) : (
        <>
          <section className="panel feedback-summary">
            <div className="big-rating">
              <strong>{avg('rating').toFixed(1)}</strong>
              <Stars value={avg('rating')} size={16} />
              <span className="muted small">{list.length} review{list.length > 1 ? 's' : ''}</span>
            </div>
            <div className="dist">
              {dist.map(([star, n]) => (
                <div key={star} className="dist-row">
                  <span>{star}</span>
                  <div className="bar"><div style={{ width: `${(n / list.length) * 100}%` }} /></div>
                  <span className="muted">{n}</span>
                </div>
              ))}
            </div>
            <dl className="sub-ratings">
              <div><dt>Skill development</dt><dd>{avg('skillDev').toFixed(1)}</dd></div>
              <div><dt>Communication</dt><dd>{avg('comm').toFixed(1)}</dd></div>
            </dl>
          </section>
          <section className="panel flush">
            {list.map((f) => {
              const by = userById(s, f.givenBy);
              return (
                <article key={f.id} className="review">
                  <Avatar user={by} size={32} />
                  <div className="grow">
                    <div className="review-head">
                      <span className="row-title">{fullName(by)}</span>
                      <Stars value={f.rating} size={13} />
                      <span className="row-meta">{fmtDate(f.date)}</span>
                    </div>
                    <p>{f.comment}</p>
                    <div className="review-meta">
                      Skill development {f.skillDev}/5 · Communication {f.comm}/5
                    </div>
                  </div>
                </article>
              );
            })}
          </section>
        </>
      )}
    </div>
  );
}

export function NotFound() {
  return (
    <div className="narrow" style={{ paddingTop: '4rem' }}>
      <EmptyState icon="compass" title="Page not found">
        <Link to="/">Go to the home page</Link>
      </EmptyState>
    </div>
  );
}
