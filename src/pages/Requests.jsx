import { useState } from 'react';
import { Link } from '../router';
import { currentUser, fullName, respondToRequest, skillById, userById, useStore } from '../data/store';
import { Avatar, EmptyState, fmtDate, Icon, PageHeader, StatusPill, useToast } from '../components/ui';

const FILTERS = [
  ['ALL', 'All'],
  ['PROPOSED', 'Pending'],
  ['ACCEPTED', 'Accepted'],
  ['COMPLETED', 'Completed'],
  ['DECLINED', 'Declined']
];

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
        title="Requests"
        subtitle={isMentor ? 'Colleagues who asked to learn from you' : 'Skills you asked to learn'}
        actions={!isMentor && <Link to="/skills" className="btn btn-primary"><Icon name="plus" /> New request</Link>}
      />

      <div className="tabs" role="tablist">
        {FILTERS.map(([f, label]) => {
          const n = f === 'ALL' ? all.length : all.filter((r) => r.status === f).length;
          return (
            <button key={f} role="tab" aria-selected={filter === f} className={filter === f ? 'active' : ''} onClick={() => setFilter(f)}>
              {label} <span className="tab-count">{n}</span>
            </button>
          );
        })}
      </div>

      {list.length === 0 ? (
        <EmptyState icon="file" title="No requests">
          {!isMentor && <Link to="/skills">Browse the catalog</Link>}
        </EmptyState>
      ) : (
        <div className="table-wrap">
          <table className="table">
            <thead>
              <tr>
                <th>Skill</th>
                <th>{isMentor ? 'Mentee' : 'Mentor'}</th>
                <th>Requested</th>
                <th>Status</th>
                <th className="right">Actions</th>
              </tr>
            </thead>
            <tbody>
              {list.map((r) => {
                const other = userById(s, isMentor ? r.menteeId : r.mentorId);
                const skill = skillById(s, r.skillId);
                const canChat = ['ACCEPTED', 'COMPLETED'].includes(r.status);
                return (
                  <tr key={r.id}>
                    <td data-label="Skill">
                      <div className="cell-title">{skill?.name || 'Deleted skill'}</div>
                      {r.message && <div className="cell-sub" title={r.message}>{r.message}</div>}
                    </td>
                    <td data-label={isMentor ? 'Mentee' : 'Mentor'}>
                      <div className="person">
                        <Avatar user={other} size={26} />
                        <div>
                          <div className="cell-title">{fullName(other)}</div>
                          <div className="cell-sub">{other?.department}</div>
                        </div>
                      </div>
                    </td>
                    <td data-label="Requested" className="nowrap muted">{fmtDate(r.requestedAt)}</td>
                    <td data-label="Status"><StatusPill status={r.status} /></td>
                    <td className="right">
                      <div className="cell-actions">
                        {isMentor && r.status === 'PROPOSED' && (
                          <>
                            <button className="btn btn-primary btn-sm" onClick={() => { respondToRequest(r.id, true); toast('Request accepted'); }}>Accept</button>
                            <button className="btn btn-secondary btn-sm" onClick={() => { respondToRequest(r.id, false); toast('Request declined', 'bad'); }}>Decline</button>
                          </>
                        )}
                        {isMentor && r.status === 'ACCEPTED' && skill && (
                          <Link to={`/sessions/skill/${skill.id}`} className="btn btn-secondary btn-sm">Schedule</Link>
                        )}
                        {canChat && (
                          <Link to={`/requests/${r.id}/chat`} className="btn btn-ghost btn-sm" aria-label="Open chat">
                            <Icon name="message" size={15} /> Chat
                          </Link>
                        )}
                        {!isMentor && r.status === 'PROPOSED' && <span className="muted small">Waiting for mentor</span>}
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
