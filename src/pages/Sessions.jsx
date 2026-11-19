import { useState } from 'react';
import { Link, navigate, Redirect } from '../router';
import { CATEGORIES } from '../data/seed';
import {
  completeSession, createSkill, createSlot, currentUser, deleteSkill, fullName, mentorRating,
  rateMentor, respondToSlot, sessionForRequest, skillById, userById, useStore
} from '../data/store';
import { Avatar, CategoryTag, EmptyState, fmtDate, fmtDateTime, fmtTime, PageHeader, Stars, StatusPill, useToast } from '../components/ui';

const modeLabel = (m) => (m === 'VIDEO_VISIT' ? '🎥 Video Visit' : '📍 In Person');

function SlotLine({ sess }) {
  if (!sess) return null;
  return (
    <div className="slot-line">
      <span>🗓 {fmtDate(sess.start)}</span>
      <span>⏰ {fmtTime(sess.start)} – {fmtTime(sess.end)}</span>
      <span>{modeLabel(sess.mode)}</span>
      <StatusPill status={sess.status} />
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
        if (!rating) return toast('Pick a star rating first', 'bad');
        rateMentor(requestId, rating, comment.trim());
        toast('Thanks for rating your mentor!');
      }}
    >
      <span className="small strong">{existing ? 'Your rating' : 'Rate mentor'}</span>
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
      <input value={comment} onChange={(e) => setComment(e.target.value)} placeholder="Optional comment" />
      <button className="btn btn-soft" type="submit">{existing ? 'Update' : 'Submit'}</button>
    </form>
  );
}

function ScheduledList({ s, me }) {
  const toast = useToast();
  const list = s.sessions
    .filter((x) => (x.menteeId === me.id || x.mentorId === me.id) && ['SCHEDULED', 'COMPLETED', 'IN_PROGRESS'].includes(x.status))
    .sort((a, b) => new Date(b.start) - new Date(a.start));
  return (
    <section className="stack">
      <h2 className="h2">Scheduled sessions</h2>
      {list.length === 0 ? (
        <EmptyState icon="📅" title="No sessions yet">Confirmed slots will show up here.</EmptyState>
      ) : (
        <div className="session-list">
          {list.map((x) => {
            const other = userById(s, x.mentorId === me.id ? x.menteeId : x.mentorId);
            const skill = skillById(s, s.requests.find((r) => r.id === x.requestId)?.skillId);
            const d = new Date(x.start);
            return (
              <article key={x.id} className={`session-card ${x.status === 'COMPLETED' ? 'done' : ''}`}>
                <div className="date-block">
                  <span>{d.toLocaleDateString(undefined, { month: 'short' })}</span>
                  <strong>{d.getDate()}</strong>
                </div>
                <div className="grow">
                  <h3>{skill?.name || 'Session'}</h3>
                  <small className="muted">
                    with {fullName(other)} · {fmtTime(x.start)} – {fmtTime(x.end)} · {modeLabel(x.mode)}
                  </small>
                </div>
                <StatusPill status={x.status} />
                {x.status === 'SCHEDULED' && (
                  <button className="btn btn-soft" onClick={() => { completeSession(x.id); toast('Session marked complete 🎉'); }}>
                    Mark complete
                  </button>
                )}
              </article>
            );
          })}
        </div>
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
          title="My Sessions"
          subtitle="Skills you are giving and the sessions you have scheduled."
          actions={<Link to="/sessions/new-skill" className="btn btn-primary">+ Create skill</Link>}
        />
        <section className="stack">
          <h2 className="h2">Skills I am giving</h2>
          {mySkills.length === 0 ? (
            <EmptyState icon="🧑‍🏫" title="You haven't shared any skills yet">
              <Link to="/sessions/new-skill">Create your first skill →</Link>
            </EmptyState>
          ) : (
            <div className="skill-grid">
              {mySkills.map((k) => {
                const reqs = s.requests.filter((r) => r.skillId === k.id);
                const pending = reqs.filter((r) => r.status === 'PROPOSED').length;
                return (
                  <article key={k.id} className="skill-card">
                    <div className="tags">{k.categories.map((c) => <CategoryTag key={c} k={c} />)}</div>
                    <h3>{k.name}</h3>
                    <p className="muted">{k.description}</p>
                    <div className="mini-stats">
                      <span><strong>{reqs.length}</strong> mentee requests</span>
                      {pending > 0 && <span className="pill pill-warn">{pending} pending</span>}
                    </div>
                    <div className="row gap-sm">
                      <Link to={`/sessions/skill/${k.id}`} className="btn btn-primary grow">View mentees</Link>
                      <button
                        className="btn btn-danger-soft"
                        onClick={() => {
                          if (window.confirm(`Delete "${k.name}" and all its requests?`)) {
                            deleteSkill(k.id);
                            toast('Skill deleted', 'bad');
                          }
                        }}
                      >
                        Delete
                      </button>
                    </div>
                  </article>
                );
              })}
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
      <PageHeader title="My Sessions" subtitle="Skills you registered for, proposed slots and your sessions." actions={<Link to="/skills" className="btn btn-primary">Find skills</Link>} />
      <section className="stack">
        <h2 className="h2">Skills I registered for</h2>
        {myReqs.length === 0 ? (
          <EmptyState icon="🎓" title="You have not registered for any skills yet">
            <Link to="/skills">Browse the catalog →</Link>
          </EmptyState>
        ) : (
          <div className="stack">
            {myReqs.map((r) => {
              const mentor = userById(s, r.mentorId);
              const skill = skillById(s, r.skillId);
              const sess = sessionForRequest(s, r.id);
              const rating = mentorRating(s, r.mentorId);
              const active = ['ACCEPTED', 'COMPLETED'].includes(r.status);
              const myRating = s.ratings.find((x) => x.requestId === r.id && x.menteeId === me.id);
              return (
                <article key={r.id} className="card reg-card">
                  <div className="reg-head">
                    <Avatar user={mentor} size={44} />
                    <div className="grow">
                      <div className="row gap-sm wrap">
                        <h3>{skill?.name}</h3>
                        <StatusPill status={r.status} />
                      </div>
                      <small className="muted">
                        Mentor: <strong>{fullName(mentor)}</strong> · {rating > 0 ? <><Stars value={rating} size={12} /> {rating.toFixed(1)} / 5</> : 'No ratings yet'}
                      </small>
                    </div>
                    {active && <Link to={`/requests/${r.id}/chat`} className="btn btn-outline">💬 Chat</Link>}
                  </div>

                  {sess && (
                    <div className={`slot-box ${sess.status === 'PENDING_MENTEE_CONFIRMATION' ? 'pending' : ''}`}>
                      <div>
                        <span className="small strong">{sess.status === 'PENDING_MENTEE_CONFIRMATION' ? 'Proposed slot' : 'Your slot'}</span>
                        <SlotLine sess={sess} />
                      </div>
                      {sess.status === 'PENDING_MENTEE_CONFIRMATION' && (
                        <div className="row gap-sm">
                          <button className="btn btn-primary" onClick={() => { respondToSlot(sess.id, true); toast('Slot accepted, session scheduled!'); }}>Accept slot</button>
                          <button className="btn btn-danger-soft" onClick={() => { respondToSlot(sess.id, false); toast('Slot rejected', 'bad'); }}>Reject</button>
                        </div>
                      )}
                    </div>
                  )}
                  {r.status === 'ACCEPTED' && !sess && <p className="muted small">Your mentor will propose a time slot soon.</p>}
                  {active && <RateForm requestId={r.id} existing={myRating} />}
                </article>
              );
            })}
          </div>
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
      <div>
        <Link to="/sessions" className="back-link">← Back to sessions</Link>
        <PageHeader title="Create a new skill" subtitle="Share something you're great at with your colleagues." />
      </div>
      <form
        className="card form"
        onSubmit={(e) => {
          e.preventDefault();
          if (!form.category) return setError('Please choose a category.');
          const err = createSkill(form);
          if (err) return setError(err);
          toast('Skill published to the catalog!');
          navigate('/sessions');
        }}
      >
        {error && <div className="alert alert-bad">{error}</div>}
        <label className="field">
          <span>Skill name</span>
          <input value={form.name} onChange={set('name')} required placeholder="e.g. Watercolor Painting" />
          <small className="muted">Must be unique (no duplicate skill names).</small>
        </label>
        <label className="field">
          <span>Description</span>
          <textarea value={form.description} onChange={set('description')} required rows={4} placeholder="What will mentees learn? Who is it for?" />
        </label>
        <div className="field">
          <span>Category</span>
          <div className="cat-pick">
            {CATEGORIES.map((c) => (
              <label key={c.key} className={`cat-option tint-${c.tint} ${form.category === c.key ? 'selected' : ''}`}>
                <input type="radio" name="category" value={c.key} checked={form.category === c.key} onChange={set('category')} />
                <span>{c.emoji}</span> {c.name}
              </label>
            ))}
          </div>
        </div>
        <button className="btn btn-primary btn-lg" type="submit">Create skill</button>
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
  return `${((h + 11) % 12) + 1}:${String(m).padStart(2, '0')} ${h < 12 ? 'am' : 'pm'}`;
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
    toast('Slot proposed to mentee');
    onDone();
  };

  return (
    <div className="booking">
      <div className="booking-top">
        <strong>Book appointment</strong>
        <div className="segmented">
          {[['IN_PERSON', 'In Person'], ['VIDEO_VISIT', 'Video Visit']].map(([v, l]) => (
            <button key={v} type="button" className={mode === v ? 'active' : ''} onClick={() => setMode(v)}>{l}</button>
          ))}
        </div>
      </div>
      <div className="day-strip">
        {days.map((d) => {
          const sel = day && d.toDateString() === day.toDateString();
          return (
            <button key={d.toISOString()} type="button" className={`day-chip ${sel ? 'active' : ''}`} onClick={() => { setDay(d); setError(false); }}>
              <small>{d.toLocaleDateString(undefined, { weekday: 'short' })}</small>
              <strong>{d.getDate()}</strong>
              <small>{d.toLocaleDateString(undefined, { month: 'short' })}</small>
            </button>
          );
        })}
      </div>
      <div className="time-rows">
        {TIMES.map(([lbl, ts]) => (
          <div key={lbl} className="time-row">
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
      <div className="booking-foot">
        <label className="inline-field">
          Duration
          <select value={duration} onChange={(e) => setDuration(Number(e.target.value))}>
            {[30, 45, 60, 90, 120].map((m) => <option key={m} value={m}>{m} mins</option>)}
          </select>
        </label>
        <div className="row gap-sm">
          <button type="button" className="btn btn-ghost" onClick={onDone}>Cancel</button>
          <button type="button" className="btn btn-primary" onClick={save}>Save slot</button>
        </div>
      </div>
      {error && <div className="alert alert-bad">Please select both a date and a time.</div>}
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
      <div>
        <Link to="/sessions" className="back-link">← Back to my sessions</Link>
        <PageHeader
          title={skill.name}
          subtitle={<span className="tags">{skill.categories.map((c) => <CategoryTag key={c} k={c} />)}</span>}
          actions={
            <button
              className="btn btn-danger-soft"
              onClick={() => {
                if (window.confirm(`Delete "${skill.name}" completely?`)) {
                  deleteSkill(skill.id);
                  toast('Skill deleted', 'bad');
                  navigate('/sessions');
                }
              }}
            >
              Delete skill
            </button>
          }
        />
      </div>

      {reqs.length === 0 ? (
        <EmptyState icon="👀" title="No mentees registered for this skill yet">Share it with your team!</EmptyState>
      ) : (
        <div className="stack">
          {reqs.map((r) => {
            const mentee = userById(s, r.menteeId);
            const sess = sessionForRequest(s, r.id);
            const active = ['ACCEPTED', 'COMPLETED'].includes(r.status);
            return (
              <article key={r.id} className="card reg-card">
                <div className="reg-head">
                  <Avatar user={mentee} size={44} />
                  <div className="grow">
                    <div className="row gap-sm wrap">
                      <h3>{fullName(mentee)}</h3>
                      <StatusPill status={r.status} />
                    </div>
                    <small className="muted">{mentee.department} · requested {fmtDateTime(r.requestedAt)}</small>
                  </div>
                  <div className="row gap-sm wrap">
                    {r.status === 'PROPOSED' && <Link to="/requests" className="btn btn-primary">Respond</Link>}
                    {active && <Link to={`/requests/${r.id}/chat`} className="btn btn-outline">💬 Chat</Link>}
                    {r.status === 'ACCEPTED' && booking !== r.id && (
                      <button className="btn btn-soft" onClick={() => setBooking(r.id)}>📅 {sess ? 'New slot' : 'Create slot'}</button>
                    )}
                  </div>
                </div>
                {r.message && <p className="quote">“{r.message}”</p>}
                {sess && <SlotLine sess={sess} />}
                {booking === r.id && <BookingCard requestId={r.id} onDone={() => setBooking(null)} />}
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
