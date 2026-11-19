import { Link } from '../router';
import { currentUser, fullName, skillById, userById, useStore } from '../data/store';
import { Avatar, EmptyState, fmtDateTime, StatusPill, timeAgo } from '../components/ui';

export default function Dashboard() {
  const s = useStore();
  const me = currentUser(s);
  const isMentor = me.role === 'MENTOR';
  const myRequests = s.requests.filter((r) => (isMentor ? r.mentorId : r.menteeId) === me.id);
  const mySessions = s.sessions.filter((x) => x.menteeId === me.id || x.mentorId === me.id);
  const upcoming = mySessions
    .filter((x) => ['SCHEDULED', 'PENDING_MENTEE_CONFIRMATION'].includes(x.status) && new Date(x.end) > new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start));
  const notes = s.notifications.filter((n) => n.userId === me.id).slice(0, 4);
  const myFeedback = s.feedback.filter((f) => f.givenTo === me.id);
  const avg = myFeedback.length ? myFeedback.reduce((a, f) => a + f.rating, 0) / myFeedback.length : 0;

  const stats = isMentor
    ? [
        ['📚', 'Skills offered', s.skills.filter((k) => k.mentorId === me.id).length, '/sessions'],
        ['📥', 'Pending requests', myRequests.filter((r) => r.status === 'PROPOSED').length, '/requests'],
        ['📅', 'Upcoming sessions', upcoming.length, '/sessions'],
        ['⭐', 'Average rating', avg ? avg.toFixed(1) : '–', '/feedback']
      ]
    : [
        ['📝', 'Skills registered', myRequests.length, '/sessions'],
        ['✅', 'Accepted', myRequests.filter((r) => ['ACCEPTED', 'COMPLETED'].includes(r.status)).length, '/requests'],
        ['📅', 'Upcoming sessions', upcoming.length, '/sessions'],
        ['🏅', 'Completed', mySessions.filter((x) => x.status === 'COMPLETED').length, '/sessions']
      ];

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';

  return (
    <div className="stack-lg">
      <section className="welcome">
        <div>
          <h1>{greet}, {me.firstName} 👋</h1>
          <p>
            {isMentor
              ? 'Your colleagues are eager to learn from you. Here is what needs your attention.'
              : 'Ready to learn something new today? Here is your learning overview.'}
          </p>
        </div>
        <Link to={isMentor ? '/sessions/new-skill' : '/skills'} className="btn btn-light">
          {isMentor ? '+ Create a skill' : 'Browse skills →'}
        </Link>
      </section>

      <section className="stat-grid">
        {stats.map(([icon, label, value, to]) => (
          <Link key={label} to={to} className="stat">
            <span className="stat-icon">{icon}</span>
            <span className="stat-value">{value}</span>
            <span className="stat-label">{label}</span>
          </Link>
        ))}
      </section>

      <div className="two-col">
        <section className="card">
          <div className="card-head">
            <h2>Upcoming sessions</h2>
            <Link to="/sessions" className="link">View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState icon="📅" title="Nothing scheduled yet">
              {isMentor ? 'Accept a request and propose a slot.' : 'Register for a skill to get started.'}
            </EmptyState>
          ) : (
            <ul className="list">
              {upcoming.slice(0, 4).map((x) => {
                const req = s.requests.find((r) => r.id === x.requestId);
                const other = userById(s, isMentor ? x.menteeId : x.mentorId);
                return (
                  <li key={x.id} className="list-row">
                    <Avatar user={other} />
                    <div className="grow">
                      <strong>{skillById(s, req?.skillId)?.name || 'Session'}</strong>
                      <small className="muted">
                        {fullName(other)} · {fmtDateTime(x.start)} · {x.mode === 'VIDEO_VISIT' ? '🎥 Video' : '📍 In person'}
                      </small>
                    </div>
                    <StatusPill status={x.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="card">
          <div className="card-head">
            <h2>Recent activity</h2>
            <Link to="/notifications" className="link">All notifications</Link>
          </div>
          {notes.length === 0 ? (
            <EmptyState icon="🔔" title="You're all caught up" />
          ) : (
            <ul className="list">
              {notes.map((n) => (
                <li key={n.id} className="list-row">
                  <span className={`dot ${n.read ? '' : 'dot-on'}`} />
                  <div className="grow">
                    <Link to={n.link || '/notifications'}><strong>{n.title}</strong></Link>
                    <small className="muted">{n.message}</small>
                  </div>
                  <small className="muted nowrap">{timeAgo(n.createdAt)}</small>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      <section className="quick-grid">
        {[
          ['📚', 'Skill Catalog', 'Browse available skills and find mentors', '/skills'],
          ['📋', 'My Requests', 'Manage your skill exchange requests', '/requests'],
          ['🎓', 'My Sessions', 'View and manage learning sessions', '/sessions'],
          ['⭐', 'Feedback', 'View received feedback and ratings', '/feedback']
        ].map(([icon, title, text, to]) => (
          <Link key={to} to={to} className="quick">
            <span className="quick-icon">{icon}</span>
            <div>
              <strong>{title}</strong>
              <small className="muted">{text}</small>
            </div>
            <span className="quick-arrow">→</span>
          </Link>
        ))}
      </section>
    </div>
  );
}
