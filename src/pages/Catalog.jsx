import { useState } from 'react';
import { Link, Redirect } from '../router';
import { CATEGORIES, categoryByKey } from '../data/seed';
import { currentUser, fullName, mentorRating, registerForSkill, userById, useStore } from '../data/store';
import { Avatar, CategoryTag, EmptyState, PageHeader, Stars, useToast } from '../components/ui';

export default function Catalog({ params }) {
  const s = useStore();
  const me = currentUser(s);
  const toast = useToast();
  const [q, setQ] = useState('');
  const cat = params.category ? categoryByKey[params.category] : null;
  if (params.category && !cat) return <Redirect to="/skills" />;

  const query = q.trim().toLowerCase();
  const matches = (k) => !query || k.name.toLowerCase().includes(query) || k.description.toLowerCase().includes(query);
  const skills = s.skills.filter((k) => (!cat || k.categories.includes(cat.key)) && matches(k));
  const myReq = (skillId) => s.requests.find((r) => r.menteeId === me.id && r.skillId === skillId && r.status !== 'DECLINED');

  const search = (
    <label className="search">
      <svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
        <circle cx="11" cy="11" r="7" /><path d="m20 20-3.5-3.5" />
      </svg>
      <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search skills…" aria-label="Search skills" />
    </label>
  );

  // Category overview (no category picked and no search)
  if (!cat && !query) {
    return (
      <div className="stack-lg">
        <PageHeader title="Skill Catalog" subtitle="Pick a category to discover skills shared by your colleagues." actions={search} />
        <div className="category-grid">
          {CATEGORIES.map((c) => {
            const count = s.skills.filter((k) => k.categories.includes(c.key)).length;
            return (
              <Link key={c.key} to={`/skills/${c.key}`} className={`category-card tint-${c.tint}`}>
                <div className="category-top">
                  <span className="category-emoji">{c.emoji}</span>
                  <span className="count-pill">{count} {count === 1 ? 'skill' : 'skills'}</span>
                </div>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
                <span className="category-cta">Open category →</span>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <div>
        <Link to="/skills" className="back-link">← All categories</Link>
        <PageHeader
          title={cat ? `${cat.emoji} ${cat.name}` : `Results for “${q}”`}
          subtitle={cat ? cat.description : `${skills.length} matching skill${skills.length === 1 ? '' : 's'}`}
          actions={search}
        />
      </div>
      <div className="cat-tabs" role="tablist">
        <Link to="/skills" className={!cat ? 'active' : ''}>All</Link>
        {CATEGORIES.map((c) => (
          <Link key={c.key} to={`/skills/${c.key}`} className={cat?.key === c.key ? 'active' : ''}>
            {c.emoji} {c.name.split(' /')[0]}
          </Link>
        ))}
      </div>

      {skills.length === 0 ? (
        <EmptyState icon="🔍" title="This category is empty">
          {me.role === 'MENTOR' ? <Link to="/sessions/new-skill">Be the first to share a skill here →</Link> : 'Check back soon, mentors add new skills regularly.'}
        </EmptyState>
      ) : (
        <div className="skill-grid">
          {skills.map((k) => {
            const mentor = userById(s, k.mentorId);
            const rating = mentorRating(s, k.mentorId);
            const req = myReq(k.id);
            const learners = s.requests.filter((r) => r.skillId === k.id && r.status !== 'DECLINED').length;
            return (
              <article key={k.id} className="skill-card">
                <div className="tags">{k.categories.map((c) => <CategoryTag key={c} k={c} />)}</div>
                <h3>{k.name}</h3>
                <p className="muted">{k.description}</p>
                <div className="mentor-row">
                  <Avatar user={mentor} size={34} />
                  <div className="grow">
                    <strong>{fullName(mentor)}</strong>
                    <small className="muted">{mentor?.department} · {learners} learner{learners === 1 ? '' : 's'}</small>
                  </div>
                  {rating > 0 && (
                    <span className="rating-chip" title="Community mentor rating">
                      <Stars value={rating} size={12} /> {rating.toFixed(1)}
                    </span>
                  )}
                </div>
                <div className="skill-actions">
                  {me.role === 'MENTEE' ? (
                    req ? (
                      <Link to="/sessions" className="btn btn-soft btn-block">✓ Registered · {req.status.toLowerCase()}</Link>
                    ) : (
                      <button
                        className="btn btn-primary btn-block"
                        onClick={() => {
                          registerForSkill(k.id);
                          toast(`Request sent to ${mentor.firstName}!`);
                        }}
                      >
                        Register
                      </button>
                    )
                  ) : k.mentorId === me.id ? (
                    <Link to={`/sessions/skill/${k.id}`} className="btn btn-soft btn-block">Your skill · view mentees</Link>
                  ) : (
                    <span className="muted small center">Offered by a fellow mentor</span>
                  )}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
