import { useState } from 'react';
import { Link, navigate, Redirect } from '../router';
import { CATEGORIES, categoryByKey } from '../data/seed';
import { currentUser, fullName, mentorRating, registerForSkill, userById, useStore } from '../data/store';
import { Avatar, CategoryTag, EmptyState, Icon, PageHeader, useToast } from '../components/ui';

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

  const toolbar = (
    <div className="toolbar">
      <label className="search">
        <Icon name="search" />
        <input value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search skills" aria-label="Search skills" />
      </label>
      <select
        className="select-sm"
        value={cat?.key || ''}
        onChange={(e) => navigate(e.target.value ? `/skills/${e.target.value}` : '/skills')}
        aria-label="Category"
      >
        <option value="">All categories</option>
        {CATEGORIES.map((c) => <option key={c.key} value={c.key}>{c.name}</option>)}
      </select>
    </div>
  );

  if (!cat && !query) {
    return (
      <div className="stack-lg">
        <PageHeader title="Skill catalog" subtitle={`${s.skills.length} skills offered by colleagues across ${CATEGORIES.length} categories`} />
        {toolbar}
        <div className="category-grid">
          {CATEGORIES.map((c) => {
            const count = s.skills.filter((k) => k.categories.includes(c.key)).length;
            return (
              <Link key={c.key} to={`/skills/${c.key}`} className="category-card">
                <div className="category-top">
                  <span className="cat-icon" style={{ color: c.color }}><Icon name={c.icon} size={18} /></span>
                  <span className="muted small">{count} {count === 1 ? 'skill' : 'skills'}</span>
                </div>
                <h3>{c.name}</h3>
                <p>{c.description}</p>
              </Link>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="stack-lg">
      <PageHeader
        back={<Link to="/skills" className="back-link"><Icon name="chevronLeft" size={14} /> Skill catalog</Link>}
        title={cat ? cat.name : 'Search results'}
        subtitle={cat ? cat.description : `${skills.length} result${skills.length === 1 ? '' : 's'} for “${q}”`}
      />
      {toolbar}

      {skills.length === 0 ? (
        <EmptyState icon="search" title={query ? 'No skills match your search' : 'No skills in this category yet'}>
          {me.role === 'MENTOR' && <Link to="/sessions/new-skill">Offer a skill</Link>}
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
                <p className="skill-desc">{k.description}</p>
                <div className="skill-mentor">
                  <Avatar user={mentor} size={28} />
                  <div className="grow">
                    <div className="row-title">{fullName(mentor)}</div>
                    <div className="row-sub">
                      {mentor?.department}
                      {rating > 0 && <> · <span className="star-inline">★</span> {rating.toFixed(1)}</>}
                      {' · '}{learners} learner{learners === 1 ? '' : 's'}
                    </div>
                  </div>
                </div>
                <div className="skill-foot">
                  {me.role === 'MENTEE' ? (
                    req ? (
                      <Link to="/sessions" className="btn btn-secondary btn-sm btn-block">
                        <Icon name="check" size={14} /> Registered
                      </Link>
                    ) : (
                      <button
                        className="btn btn-primary btn-sm btn-block"
                        onClick={() => {
                          registerForSkill(k.id);
                          toast(`Request sent to ${mentor.firstName}`);
                        }}
                      >
                        Request to learn
                      </button>
                    )
                  ) : k.mentorId === me.id ? (
                    <Link to={`/sessions/skill/${k.id}`} className="btn btn-secondary btn-sm btn-block">Manage</Link>
                  ) : null}
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
