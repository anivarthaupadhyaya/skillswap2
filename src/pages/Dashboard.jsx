import { Link } from '../router';
import { currentUser, fullName, skillById, userById, useStore } from '../data/store';
import { Avatar, EmptyState, fmtShortDate, fmtTime, Icon, ModeLabel, PageHeader, StatusPill, timeAgo } from '../components/ui';

export default function Dashboard() {
  const s = useStore();
  const me = currentUser(s);
  const isMentor = me.role === 'MENTOR';
  const myRequests = s.requests.filter((r) => (isMentor ? r.mentorId : r.menteeId) === me.id);
  const mySessions = s.sessions.filter((x) => x.menteeId === me.id || x.mentorId === me.id);
  const upcoming = mySessions
    .filter((x) => ['SCHEDULED', 'PENDING_MENTEE_CONFIRMATION'].includes(x.status) && new Date(x.end) > new Date())
    .sort((a, b) => new Date(a.start) - new Date(b.start));
  const notes = s.notifications.filter((n) => n.userId === me.id).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).slice(0, 5);
  const myFeedback = s.feedback.filter((f) => f.givenTo === me.id);
  const avg = myFeedback.length ? myFeedback.reduce((a, f) => a + f.rating, 0) / myFeedback.length : 0;
  const pending = myRequests.filter((r) => r.status === 'PROPOSED');
  const toConfirm = mySessions.filter((x) => x.menteeId === me.id && x.status === 'PENDING_MENTEE_CONFIRMATION');

  const stats = isMentor
    ? [
        ['Skills offered', s.skills.filter((k) => k.mentorId === me.id).length, '/sessions'],
        ['Pending requests', pending.length, '/requests'],
        ['Upcoming sessions', upcoming.length, '/sessions'],
        ['Average rating', avg ? avg.toFixed(1) : '–', '/feedback']
      ]
    : [
        ['Skills registered', myRequests.length, '/sessions'],
        ['Accepted', myRequests.filter((r) => ['ACCEPTED', 'COMPLETED'].includes(r.status)).length, '/requests'],
        ['Upcoming sessions', upcoming.length, '/sessions'],
        ['Completed', mySessions.filter((x) => x.status === 'COMPLETED').length, '/sessions']
      ];

  const hour = new Date().getHours();
  const greet = hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening';
  const today = new Date().toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' });

  const todo = isMentor
    ? pending.length > 0 && { text: `${pending.length} mentee request${pending.length > 1 ? 's are' : ' is'} waiting for your response.`, to: '/requests', cta: 'Review requests' }
    : toConfirm.length > 0 && { text: `${toConfirm.length} proposed time slot${toConfirm.length > 1 ? 's need' : ' needs'} your confirmation.`, to: '/sessions', cta: 'Review slots' };

  return (
    <div className="stack-lg">
      <PageHeader
        title={`${greet}, ${me.firstName}`}
        subtitle={today}
        actions={
          <Link to={isMentor ? '/sessions/new-skill' : '/skills'} className="btn btn-primary">
            {isMentor ? <><Icon name="plus" /> New skill</> : 'Browse skills'}
          </Link>
        }
      />

      {todo && (
        <div className="banner">
          <Icon name="info" />
          <span className="grow">{todo.text}</span>
          <Link to={todo.to} className="btn btn-secondary btn-sm">{todo.cta}</Link>
        </div>
      )}

      <section className="stats">
        {stats.map(([label, value, to]) => (
          <Link key={label} to={to} className="stat">
            <span className="stat-label">{label}</span>
            <span className="stat-value">{value}</span>
          </Link>
        ))}
      </section>

      <div className="two-col">
        <section className="panel">
          <div className="panel-head">
            <h2>Upcoming sessions</h2>
            <Link to="/sessions" className="link">View all</Link>
          </div>
          {upcoming.length === 0 ? (
            <EmptyState icon="calendar" title="Nothing scheduled">
              {isMentor ? 'Accept a request and propose a time.' : 'Register for a skill to get started.'}
            </EmptyState>
          ) : (
            <ul className="rows">
              {upcoming.slice(0, 5).map((x) => {
                const req = s.requests.find((r) => r.id === x.requestId);
                const other = userById(s, isMentor ? x.menteeId : x.mentorId);
                const d = new Date(x.start);
                return (
                  <li key={x.id} className="row-item">
                    <div className="date-chip">
                      <span>{d.toLocaleDateString(undefined, { month: 'short' })}</span>
                      <strong>{d.getDate()}</strong>
                    </div>
                    <div className="grow">
                      <div className="row-title">{skillById(s, req?.skillId)?.name || 'Session'}</div>
                      <div className="row-sub">
                        {fullName(other)} · {fmtTime(x.start)} · <ModeLabel mode={x.mode} />
                      </div>
                    </div>
                    <StatusPill status={x.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>

        <section className="panel">
          <div className="panel-head">
            <h2>Recent activity</h2>
            <Link to="/notifications" className="link">View all</Link>
          </div>
          {notes.length === 0 ? (
            <EmptyState icon="bell" title="No activity yet" />
          ) : (
            <ul className="rows">
              {notes.map((n) => (
                <li key={n.id} className="row-item">
                  <span className={`unread-dot ${n.read ? '' : 'on'}`} />
                  <div className="grow">
                    <Link to={n.link || '/notifications'} className="row-title plain">{n.title}</Link>
                    <div className="row-sub">{n.message}</div>
                  </div>
                  <span className="row-meta">{timeAgo(n.createdAt)}</span>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>

      {!isMentor && (
        <section className="panel">
          <div className="panel-head">
            <h2>Your requests</h2>
            <Link to="/requests" className="link">View all</Link>
          </div>
          {myRequests.length === 0 ? (
            <EmptyState icon="file" title="No requests yet"><Link to="/skills">Browse the catalog</Link></EmptyState>
          ) : (
            <ul className="rows">
              {myRequests.slice(0, 4).map((r) => {
                const mentor = userById(s, r.mentorId);
                return (
                  <li key={r.id} className="row-item">
                    <Avatar user={mentor} size={30} />
                    <div className="grow">
                      <div className="row-title">{skillById(s, r.skillId)?.name}</div>
                      <div className="row-sub">{fullName(mentor)} · requested {fmtShortDate(r.requestedAt)}</div>
                    </div>
                    <StatusPill status={r.status} />
                  </li>
                );
              })}
            </ul>
          )}
        </section>
      )}
    </div>
  );
}
