import { useState } from 'react';
import { Link } from '../router';
import { currentUser, fullName, respondToRequest, skillById, userById, useStore } from '../data/store';
import { Avatar, EmptyState, fmtDate, PageHeader, StatusPill, useToast } from '../components/ui';

const FILTERS = ['ALL', 'PROPOSED', 'ACCEPTED', 'COMPLETED', 'DECLINED'];

export default function Requests() {
  const s = useStore();
  const me = currentUser(s);
  const toast = useToast();
  const isMentor = me.role === 'MENTOR';
  const [filter, setFilter] = useState('ALL');

  const all = s.requests
    .filter((r) => (isMentor ? r.mentorId : r.menteeId) === me.id)
    .sort((a, b) => new Date(b.requestedAt) - new Date(a.requestedAt));
  const list = filter === 'ALL' ? all : all.filter((r) => r.status === filter);

  return (
    <div className="stack-lg">
      <PageHeader
        title="My Requests"
        subtitle={isMentor ? 'Requests from colleagues who want to learn from you.' : 'Skills you asked to learn and their status.'}
        actions={!isMentor && <Link to="/skills" className="btn btn-primary">+ New request</Link>}
      />
      <div className="seg-tabs" role="tablist">
        {FILTERS.map((f) => {
          const n = f === 'ALL' ? all.length : all.filter((r) => r.status === f).length;
          return (
            <button key={f} role="tab" aria-selected={filter === f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
              {f === 'ALL' ? 'All' : f.charAt(0) + f.slice(1).toLowerCase()} <span className="tab-count">{n}</span>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <EmptyState icon="📋" title="No requests here">
          {!isMentor && <Link to="/skills">Browse the catalog to create a new request →</Link>}
        </EmptyState>
      ) : (
        <div className="request-list">
          {list.map((r) => {
            const other = userById(s, isMentor ? r.menteeId : r.mentorId);
            const skill = skillById(s, r.skillId);
            const canChat = ['ACCEPTED', 'COMPLETED'].includes(r.status);
            return (
              <article key={r.id} className="request-card">
                <Avatar user={other} size={44} />
                <div className="grow">
                  <div className="row gap-sm wrap">
                    <h3>{skill?.name || 'Deleted skill'}</h3>
                    <StatusPill status={r.status} />
                  </div>
                  <small className="muted">
                    {isMentor ? 'Mentee' : 'Mentor'}: <strong>{fullName(other)}</strong> · {other?.department} · {fmtDate(r.requestedAt)}
                  </small>
                  {r.message && <p className="quote">“{r.message}”</p>}
                  {!isMentor && (
                    <small className="muted">
                      {r.status === 'PROPOSED' && 'Request sent to mentor. Waiting for a response.'}
                      {r.status === 'ACCEPTED' && 'Accepted by mentor. Check Sessions for your slot.'}
                      {r.status === 'DECLINED' && `Declined by mentor${r.declineReason ? `: ${r.declineReason}` : '.'}`}
                      {r.status === 'COMPLETED' && 'Completed. Thanks for learning!'}
                    </small>
                  )}
                </div>
                <div className="request-actions">
                  {isMentor && r.status === 'PROPOSED' && (
                    <>
                      <button className="btn btn-primary" onClick={() => { respondToRequest(r.id, true); toast('Request accepted'); }}>Accept</button>
                      <button className="btn btn-danger-soft" onClick={() => { respondToRequest(r.id, false); toast('Request declined', 'bad'); }}>Decline</button>
                    </>
                  )}
                  {canChat && <Link to={`/requests/${r.id}/chat`} className="btn btn-outline">💬 Chat</Link>}
                  {isMentor && r.status === 'ACCEPTED' && skill && (
                    <Link to={`/sessions/skill/${skill.id}`} className="btn btn-soft">📅 Book slot</Link>
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
