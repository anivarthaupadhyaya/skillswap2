import { useState } from 'react';
import { Link, navigate, Redirect } from '../router';
import { CATEGORIES } from '../data/seed';
import {
  completeSession, createSkill, createSlot, currentUser, deleteSkill, fullName, mentorRating,
  rateMentor, respondToSlot, sessionForRequest, skillById, userById, useStore
} from '../data/store';
import {
  Avatar, CategoryTag, EmptyState, fmtDateTime, fmtShortDate, fmtTime, Icon, ModeLabel, PageHeader, StatusPill, useToast
} from '../components/ui';

function SlotLine({ sess }) {
  if (!sess) return null;
  return (
    <div className="slot-line">
      <span className="meta-item"><Icon name="calendar" size={14} /> {new Date(sess.start).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</span>
      <span className="meta-item"><Icon name="clock" size={14} /> {fmtTime(sess.start)} – {fmtTime(sess.end)}</span>
      <ModeLabel mode={sess.mode} />
    </div>
  );
}

function RateForm({ requestId, existing }) {
  const toast = useToast();
  const [rating, setRating] = useState(existing?.rating || 0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState(existing?.comment || '');
  return (
    <form
      className="rate-form"
      onSubmit={(e) => {
        e.preventDefault();
        if (!rating) return toast('Select a rating first', 'bad');
        rateMentor(requestId, rating, comment.trim());
        toast('Rating saved');
      }}
    >
      <span className="rate-label">{existing ? 'Your rating' : 'Rate this mentor'}</span>
      <div className="star-input" onMouseLeave={() => setHover(0)}>
        {[1, 2, 3, 4, 5].map((i) => (
          <button
            type="button"
            key={i}
            className={(hover || rating) >= i ? 'on' : ''}
            onMouseEnter={() => setHover(i)}
            onClick={() => setRating(i)}
            aria-label={`${i} star${i > 1 ? 's' : ''}`}
          >
            ★
          </button>
        ))}
      </div>
      <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Add a comment (optional)" />
      <button className="btn btn-secondary btn-sm" type="submit">{existing ? 'Update' : 'Submit'}</button>
    </form>
  );
}

function ScheduledList({ s, me }) {
  const toast = useToast();
  const list = s.sessions
    .filter((x) => (x.menteeId === me.id || x.mentorId === me.id) && ['SCHEDULED', 'COMPLETED', 'IN_PROGRESS'].includes(x.status))
    .sort((a, b) => new Date(b.start) - new Date(a.start));
  return (
    <section className="panel">
      <div className="panel-head"><h2>Scheduled sessions</h2></div>
      {list.length === 0 ? (
        <EmptyState icon="calendar" title="No sessions yet">Confirmed time slots appear here.</EmptyState>
      ) : (
        <ul className="rows">
          {list.map((x) => {
            const other = userById(s, x.mentorId === me.id ? x.menteeId : x.mentorId);
            const skill = skillById(s, s.requests.find((r) => r.id === x.requestId)?.skillId);
            const d = new Date(x.start);
            return (
              <li key={x.id} className="row-item">
                <div className={`date-chip ${x.status === 'COMPLETED' ? 'past' : ''}`}>
                  <span>{d.toLocaleDateString(undefined, { month: 'short' })}</span>
                  <strong>{d.getDate()}</strong>
                </div>
                <div className="grow">
                  <div className="row-title">{skill?.name || 'Session'}</div>
                  <div className="row-sub">
                    with {fullName(other)} · {fmtTime(x.start)} – {fmtTime(x.end)} · <ModeLabel mode={x.mode} />
                  </div>
                </div>
                <StatusPill status={x.status} />
                {x.status === 'SCHEDULED' && (
                  <button className="btn btn-secondary btn-sm" onClick={() => { completeSession(x.id); toast('Session marked as completed'); }}>
                    Mark complete
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </section>
  );
}

export default function Sessions() {
  const s = useStore();
  const me = currentUser(s);
  const toast = useToast();

  if (me.role === 'MENTOR') {
    const mySkills = s.skills.filter((k) => k.mentorId === me.id);
    return (
      <div className="stack-lg">
        <PageHeader
          title="Sessions"
          subtitle="Skills you teach and your schedule"
          actions={<Link to="/sessions/new-skill" className="btn btn-primary"><Icon name="plus" /> New skill</Link>}
        />
        <section className="panel">
          <div className="panel-head"><h2>Skills you teach</h2></div>
          {mySkills.length === 0 ? (
            <EmptyState icon="book" title="You haven't offered any skills yet">
              <Link to="/sessions/new-skill">Create your first skill</Link>
            </EmptyState>
          ) : (
            <div className="table-wrap flush">
              <table className="table">
                <thead>
                  <tr><th>Skill</th><th>Category</th><th>Mentees</th><th>Pending</th><th className="right"></th></tr>
                </thead>
                <tbody>
                  {mySkills.map((k) => {
                    const reqs = s.requests.filter((r) => r.skillId === k.id);
                    const pending = reqs.filter((r) => r.status === 'PROPOSED').length;
                    return (
                      <tr key={k.id}>
                        <td data-label="Skill">
                          <Link to={`/sessions/skill/${k.id}`} className="cell-title plain">{k.name}</Link>
                          <div className="cell-sub">Created {fmtShortDate(k.createdAt)}</div>
                        </td>
                        <td data-label="Category"><div className="tags">{k.categories.map((c) => <CategoryTag key={c} k={c} />)}</div></td>
                        <td data-label="Mentees">{reqs.filter((r) => r.status !== 'DECLINED').length}</td>
                        <td data-label="Pending">{pending > 0 ? <span className="status status-warn">{pending}</span> : <span className="muted">0</span>}</td>
                        <td className="right">
                          <div className="cell-actions">
                            <Link to={`/sessions/skill/${k.id}`} className="btn btn-secondary btn-sm">View mentees</Link>
                            <button
                              className="btn btn-ghost btn-sm icon-only"
                              aria-label={`Delete ${k.name}`}
                              title="Delete skill"
                              onClick={() => {
                                if (window.confirm(`Delete "${k.name}" and all of its requests?`)) {
                                  deleteSkill(k.id);
                                  toast('Skill deleted', 'bad');
                                }
                              }}
                            >
                              <Icon name="trash" size={15} />
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
        <ScheduledList s={s} me={me} />
      </div>
    );
  }

  // Mentee view
  const myReqs = s.requests.filter((r) => r.menteeId === me.id).sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
  return (
    <div className="stack-lg">
      <PageHeader title="Sessions" subtitle="Skills you're learning and your schedule" actions={<Link to="/skills" className="btn btn-primary">Browse skills</Link>} />
      <section className="stack">
        <h2 className="section-label">Registered skills</h2>
        {myReqs.length === 0 ? (
          <EmptyState icon="book" title="You haven't registered for any skills yet">
            <Link to="/skills">Browse the catalog</Link>
          </EmptyState>
        ) : (
          myReqs.map((r) => {
            const mentor = userById(s, r.mentorId);
            const skill = skillById(s, r.skillId);
            const sess = sessionForRequest(s, r.id);
            const rating = mentorRating(s, r.mentorId);
            const active = ['ACCEPTED', 'COMPLETED'].includes(r.status);
            const myRating = s.ratings.find((x) => x.requestId === r.id && x.menteeId === me.id);
            return (
              <article key={r.id} className="panel reg-card">
                <div className="reg-head">
                  <Avatar user={mentor} size={36} />
                  <div className="grow">
                    <div className="reg-title">
                      <h3>{skill?.name}</h3>
                      <StatusPill status={r.status} />
                    </div>
                    <div className="row-sub">
                      {fullName(mentor)} · {mentor.department}
                      {rating > 0 && <> · <span className="star-inline">★</span> {rating.toFixed(1)}</>}
                    </div>
                  </div>
                  {active && (
                    <Link to={`/requests/${r.id}/chat`} className="btn btn-secondary btn-sm"><Icon name="message" size={15} /> Chat</Link>
                  )}
                </div>

                {sess && (
                  <div className={`slot-box ${sess.status === 'PENDING_MENTEE_CONFIRMATION' ? 'pending' : ''}`}>
                    <div>
                      <div className="slot-heading">
                        {sess.status === 'PENDING_MENTEE_CONFIRMATION' ? `${mentor.firstName} proposed a time` : 'Scheduled'}
                      </div>
                      <SlotLine sess={sess} />
                    </div>
                    {sess.status === 'PENDING_MENTEE_CONFIRMATION' && (
                      <div className="cell-actions">
                        <button className="btn btn-primary btn-sm" onClick={() => { respondToSlot(sess.id, true); toast('Session confirmed'); }}>Accept</button>
                        <button className="btn btn-secondary btn-sm" onClick={() => { respondToSlot(sess.id, false); toast('Time slot declined', 'bad'); }}>Decline</button>
                      </div>
                    )}
                  </div>
                )}
                {r.status === 'PROPOSED' && <p className="muted small">Waiting for {mentor.firstName} to accept your request.</p>}
                {r.status === 'ACCEPTED' && !sess && <p className="muted small">{mentor.firstName} will propose a time slot soon.</p>}
                {r.status === 'DECLINED' && <p className="muted small">{mentor.firstName} isn't available for this right now.</p>}
                {active && <RateForm requestId={r.id} existing={myRating} />}
              </article>
            );
          })
        )}
      </section>
      <ScheduledList s={s} me={me} />
    </div>
  );
}

export function NewSkill() {
  const me = useStore(currentUser);
  const toast = useToast();
  const [form, setForm] = useState({ name: '', description: '', category: '' });
  const [error, setError] = useState('');
  if (me.role !== 'MENTOR') return <Redirect to="/sessions" />;
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  return (
    <div className="narrow stack-lg">
      <PageHeader
        back={<Link to="/sessions" className="back-link"><Icon name="chevronLeft" size={14} /> Sessions</Link>}
        title="New skill"
        subtitle="Describe what you can teach. It will appear in the catalog right away."
      />
      <form
        className="panel form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.category) return setError('Please choose a category.');
          const err = createSkill(form);
          if (err) return setError(err);
          toast('Skill published');
          navigate('/sessions');
        }}
      >
        {error && <div className="alert alert-bad">{error}</div>}
        <label className="field">
          <span>Name</span>
          <input value={form.name} onChange={set('name')} required placeholder="e.g. Watercolor painting" />
          <small className="muted">Must be unique.</small>
        </label>
        <label className="field">
          <span>Description</span>
          <textarea value={form.description} onChange={set('description')} required rows={4} placeholder="What will people learn, and who is it for?" />
        </label>
        <label className="field">
          <span>Category</span>
          <select value={form.category} onChange={set('category')} required>
            <option value="">Select a category</option>
            {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
          </select>
        </label>
        <div className="form-actions">
          <Link to="/sessions" className="btn btn-secondary">Cancel</Link>
          <button className="btn btn-primary" type="submit">Create skill</button>
        </div>
      </form>
    </div>
  );
}

const TIMES = [
  ['Morning', ['08:00', '09:00', '10:00', '11:00']],
  ['Afternoon', ['13:00', '14:00', '15:00', '16:00']],
  ['Evening', ['18:00', '19:00', '20:00']]
];
const label12 = (t) => {
  const [h, m] = t.split(':').map(Number);
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'AM' : 'PM'}`;
};

function BookingCard({ requestId, onDone }) {
  const toast = useToast();
  const today = new Date();
  const days = Array.from({ length: 14 }, (_, i) => {
    const d = new Date(today);
    d.setDate(today.getDate() + i + 1);
    return d;
  });
  const [mode, setMode] = useState('IN_PERSON');
  const [day, setDay] = useState(null);
  const [time, setTime] = useState('');
  const [duration, setDuration] = useState(60);
  const [error, setError] = useState(false);

  const save = () => {
    if (!day || !time) return setError(true);
    const [h, m] = time.split(':').map(Number);
    const start = new Date(day);
    start.setHours(h, m, 0, 0);
    createSlot(requestId, start.toISOString(), duration, mode);
    toast('Time slot sent to mentee');
    onDone();
  };

  return (
    <div className="booking">
      <div className="booking-row">
        <span className="booking-label">Format</span>
        <div className="segmented">
          {[['IN_PERSON', 'In person'], ['VIDEO_VISIT', 'Video call']].map(([v, l]) => (
            <button key={v} type="button" className={mode === v ? 'active' : ''} onClick={() => setMode(v)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="booking-row top">
        <span className="booking-label">Date</span>
        <div className="day-strip">
          {days.map((d) => {
            const sel = day && d.toDateString() === day.toDateString();
            return (
              <button key={d.toISOString()} type="button" className={`day-chip ${sel ? 'active' : ''}`} onClick={() => { setDay(d); setError(false); }}>
                <span>{d.toLocaleDateString(undefined, { weekday: 'short' })}</span>
                <strong>{d.getDate()}</strong>
              </button>
            );
          })}
        </div>
      </div>
      <div className="booking-row top">
        <span className="booking-label">Time</span>
        <div className="time-groups">
          {TIMES.map(([lbl, ts]) => (
            <div key={lbl} className="time-group">
              <span className="time-label">{lbl}</span>
              <div className="time-chips">
                {ts.map((t) => (
                  <button key={t} type="button" className={`time-chip ${time === t ? 'active' : ''}`} onClick={() => { setTime(t); setError(false); }}>
                    {label12(t)}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div className="booking-row">
        <span className="booking-label">Duration</span>
        <select className="select-sm" value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
          {[30, 45, 60, 90, 120].map((m) => <option key={m} value={m}>{m} minutes</option>)}
        </select>
      </div>
      {error && <div className="alert alert-bad">Select a date and a time.</div>}
      <div className="form-actions">
        <button type="button" className="btn btn-secondary btn-sm" onClick={onDone}>Cancel</button>
        <button type="button" className="btn btn-primary btn-sm" onClick={save}>Send to mentee</button>
      </div>
    </div>
  );
}

export function SkillMentees({ params }) {
  const s = useStore();
  const me = currentUser(s);
  const toast = useToast();
  const [booking, setBooking] = useState(null);
  const skill = skillById(s, Number(params.id));
  if (!skill || skill.mentorId !== me.id) return <Redirect to="/sessions" />;
  const reqs = s.requests.filter((r) => r.skillId === skill.id).sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));

  return (
    <div className="stack-lg">
      <PageHeader
        back={<Link to="/sessions" className="back-link"><Icon name="chevronLeft" size={14} /> Sessions</Link>}
        title={skill.name}
        subtitle={<div className="tags">{skill.categories.map((c) => <CategoryTag key={c} k={c} />)}</div>}
        actions={
          <button
            className="btn btn-secondary danger-text"
            onClick={() => {
              if (window.confirm(`Delete "${skill.name}"? This removes all of its requests and sessions.`)) {
                deleteSkill(skill.id);
                toast('Skill deleted', 'bad');
                navigate('/sessions');
              }
            }}
          >
            <Icon name="trash" size={15} /> Delete skill
          </button>
        }
      />
      <p className="muted skill-about">{skill.description}</p>

      <h2 className="section-label">Mentees ({reqs.length})</h2>
      {reqs.length === 0 ? (
        <EmptyState icon="users" title="No one has registered yet" />
      ) : (
        <div className="stack">
          {reqs.map((r) => {
            const mentee = userById(s, r.menteeId);
            const sess = sessionForRequest(s, r.id);
            const active = ['ACCEPTED', 'COMPLETED'].includes(r.status);
            return (
              <article key={r.id} className="panel reg-card">
                <div className="reg-head">
                  <Avatar user={mentee} size={36} />
                  <div className="grow">
                    <div className="reg-title">
                      <h3>{fullName(mentee)}</h3>
                      <StatusPill status={r.status} />
                    </div>
                    <div className="row-sub">{mentee.department} · requested {fmtDateTime(r.requestedAt)}</div>
                  </div>
                  <div className="cell-actions">
                    {r.status === 'PROPOSED' && <Link to="/requests" className="btn btn-primary btn-sm">Respond</Link>}
                    {active && <Link to={`/requests/${r.id}/chat`} className="btn btn-secondary btn-sm"><Icon name="message" size={15} /> Chat</Link>}
                    {r.status === 'ACCEPTED' && booking !== r.id && (
                      <button className="btn btn-secondary btn-sm" onClick={() => setBooking(r.id)}>
                        <Icon name="calendar" size={15} /> {sess ? 'Propose new time' : 'Propose time'}
                      </button>
                    )}
                  </div>
                </div>
                {r.message && <p className="note">{r.message}</p>}
                {sess && (
                  <div className="slot-box">
                    <div>
                      <div className="slot-heading">{sess.status === 'PENDING_MENTEE_CONFIRMATION' ? 'Waiting for confirmation' : 'Scheduled'}</div>
                      <SlotLine sess={sess} />
                    </div>
                    <StatusPill status={sess.status} />
                  </div>
                )}
                {booking === r.id && <BookingCard requestId={r.id} onDone={() => setBooking(null)} />}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
