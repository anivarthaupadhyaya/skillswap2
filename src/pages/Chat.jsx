import { useEffect, useRef, useState } from 'react';
import { Link, Redirect } from '../router';
import { currentUser, fullName, sendMessage, skillById, userById, useStore } from '../data/store';
import { Avatar, fmtTime, StatusPill } from '../components/ui';

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
      <Link to="/requests" className="back-link">← Back to requests</Link>
      <div className="chat">
        <div className="chat-head">
          <Avatar user={other} size={42} />
          <div className="grow">
            <strong>{fullName(other)}</strong>
            <small className="muted">{skill?.name} · {req.mentorId === me.id ? 'Your mentee' : 'Your mentor'}</small>
          </div>
          <StatusPill status={req.status} />
        </div>
        <div className="chat-body">
          {messages.length === 0 && <div className="chat-empty">No messages yet. Say hi 👋</div>}
          {messages.map((m) => {
            const mine = m.senderId === me.id;
            const day = new Date(m.sentAt).toDateString();
            const showDay = day !== lastDay;
            lastDay = day;
            return (
              <div key={m.id}>
                {showDay && <div className="chat-day">{new Date(m.sentAt).toLocaleDateString(undefined, { weekday: 'short', day: 'numeric', month: 'short' })}</div>}
                <div className={`msg ${mine ? 'mine' : ''}`}>
                  <div className="bubble">{m.text}</div>
                  <small className="msg-time">{fmtTime(m.sentAt)}</small>
                </div>
              </div>
            );
          })}
          <div ref={endRef} />
        </div>
        <form className="chat-form" onSubmit={submit}>
          <input value={text} onChange={(e) => setText(e.target.value)} placeholder="Type your message…" maxLength={2000} aria-label="Message" />
          <button className="btn btn-primary" type="submit" disabled={!text.trim()}>Send</button>
        </form>
      </div>
    </div>
  );
}
