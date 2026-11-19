import { useEffect, useRef, useState } from 'react';
import { Link, Redirect } from '../router';
import { currentUser, fullName, sendMessage, skillById, userById, useStore } from '../data/store';
import { Avatar, fmtTime, Icon, StatusPill } from '../components/ui';

export default function Chat({ params }) {
  const s = useStore();
  const me = currentUser(s);
  const id = Number(params.id);
  const req = s.requests.find((r) => r.id === id);
  const [text, setText] = useState('');
  const endRef = useRef(null);
  const messages = s.messages.filter((m) => m.requestId === id);

  useEffect(() => endRef.current?.scrollIntoView({ block: 'end' }), [messages.length]);

  if (!req || (req.menteeId !== me.id && req.mentorId !== me.id)) return <Redirect to="/requests" />;

  const other = userById(s, req.menteeId === me.id ? req.mentorId : req.menteeId);
  const skill = skillById(s, req.skillId);

  const submit = (e) => {
    e.preventDefault();
    const t = text.trim();
    if (!t) return;
    sendMessage(id, t);
    setText('');
  };

  let lastDay = '';
  return (
    <div className="chat-page">
      <Link to="/requests" className="back-link"><Icon name="chevronLeft" size={14} /> Requests</Link>
      <div className="chat">
        <div className="chat-head">
          <Avatar user={other} size={36} />
          <div className="grow">
            <div className="row-title">{fullName(other)}</div>
            <div className="row-sub">{skill?.name} · {req.mentorId === me.id ? 'Mentee' : 'Mentor'}</div>
          </div>
          <StatusPill status={req.status} />
        </div>
        <div className="chat-body">
          {messages.length === 0 && <div className="chat-empty">No messages yet.</div>}
          {messages.map((m) => {
            const mine = m.senderId === me.id;
            const day = new Date(m.sentAt).toDateString();
            const showDay = day !== lastDay;
            lastDay = day;
            return (
              <div key={m.id}>
                {showDay && (
                  <div className="chat-day">
                    <span>{new Date(m.sentAt).toLocaleDateString(undefined, { weekday: 'long', day: 'numeric', month: 'long' })}</span>
                  </div>
                )}
                <div className={`msg ${mine ? 'mine' : ''}`}>
                  <div className="bubble">{m.text}</div>
                  <span className="msg-time">{mine ? 'You' : other.firstName} · {fmtTime(m.sentAt)}</span>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        <form className="chat-form" onSubmit={submit}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder={`Message ${other.firstName}`} maxLength={2000} aria-label="Message" />
          <button className="btn btn-primary" type="submit" disabled={!text.trim()} aria-label="Send">
            <Icon name="send" size={15} /> Send
          </button>
        </form>
      </div>
    </div>
  );
}
