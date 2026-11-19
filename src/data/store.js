import { useSyncExternalStore } from 'react';
import { createSeed } from './seed';

// A tiny client-side "backend". State is persisted in localStorage so the
// demo behaves like the real Spring Boot app without needing a server.

const KEY = 'skillswap-demo-v1';
let state = load();
const listeners = new Set();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && parsed.version === 1) return parsed;
    }
  } catch {
    /* storage unavailable – fall back to seed */
  }
  return createSeed();
}

function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    /* ignore */
  }
}

function set(updater) {
  state = { ...state, ...updater(state) };
  save();
  listeners.forEach((l) => l());
}

const subscribe = (l) => {
  listeners.add(l);
  return () => listeners.delete(l);
};

export function useStore(selector = (s) => s) {
  return selector(useSyncExternalStore(subscribe, () => state));
}

export const getState = () => state;

const nextId = (list) => list.reduce((m, x) => Math.max(m, x.id), 0) + 1;
const now = () => new Date().toISOString();

function notify(s, userId, type, title, message, link) {
  return [
    { id: nextId(s.notifications), userId, type, title, message, link, read: false, createdAt: now() },
    ...s.notifications
  ];
}

// ---------- selectors ----------
export const userById = (s, id) => s.users.find((u) => u.id === id);
export const skillById = (s, id) => s.skills.find((k) => k.id === id);
export const fullName = (u) => (u ? `${u.firstName} ${u.lastName}` : 'Unknown');
export const currentUser = (s) => userById(s, s.currentUserId);
export const mentorRating = (s, mentorId) => {
  const r = s.ratings.filter((x) => x.mentorId === mentorId);
  return r.length ? r.reduce((a, x) => a + x.rating, 0) / r.length : 0;
};
export const sessionForRequest = (s, requestId) =>
  [...s.sessions].reverse().find((x) => x.requestId === requestId && x.status !== 'REJECTED_BY_MENTEE');

// ---------- auth ----------
export function login(email, password) {
  const u = state.users.find((x) => x.email.toLowerCase() === email.trim().toLowerCase());
  if (!u || u.password !== password) return 'Invalid email or password.';
  set(() => ({ currentUserId: u.id }));
  return null;
}

export function register(data) {
  if (state.users.some((u) => u.email.toLowerCase() === data.email.trim().toLowerCase())) {
    return 'An account with this email already exists.';
  }
  set((s) => {
    const id = nextId(s.users);
    const user = { ...data, email: data.email.trim(), id };
    return {
      users: [...s.users, user],
      currentUserId: id,
      notifications: notify(s, id, 'SYSTEM_ALERT', 'Welcome to SkillSwap 🎉', 'Your account is ready. Explore the catalog to get started.', '/skills')
    };
  });
  return null;
}

export const logout = () => set(() => ({ currentUserId: null }));

export function resetDemo() {
  const keepUser = state.currentUserId;
  state = createSeed();
  state.currentUserId = state.users.some((u) => u.id === keepUser) ? keepUser : null;
  save();
  listeners.forEach((l) => l());
}

// ---------- skills ----------
export function registerForSkill(skillId) {
  const s = state;
  const me = currentUser(s);
  const skill = skillById(s, skillId);
  if (!me || !skill) return;
  if (s.requests.some((r) => r.menteeId === me.id && r.skillId === skillId && r.status !== 'DECLINED')) return;
  set((s) => ({
    requests: [
      ...s.requests,
      { id: nextId(s.requests), menteeId: me.id, mentorId: skill.mentorId, skillId, status: 'PROPOSED', message: `I'd like to learn ${skill.name}.`, requestedAt: now() }
    ],
    notifications: notify(s, skill.mentorId, 'REQUEST_RECEIVED', 'New mentee request', `${fullName(me)} wants to learn ${skill.name}.`, '/requests')
  }));
}

export function createSkill({ name, description, category }) {
  const me = currentUser(state);
  if (state.skills.some((k) => k.name.trim().toLowerCase() === name.trim().toLowerCase())) {
    return 'A skill with this name already exists.';
  }
  set((s) => ({
    skills: [...s.skills, { id: nextId(s.skills), name: name.trim(), description: description.trim(), categories: [category], mentorId: me.id, createdAt: now() }],
    notifications: notify(s, me.id, 'SKILL_CREATED', 'Skill published', `"${name.trim()}" is now live in the catalog.`, '/sessions')
  }));
  return null;
}

export function deleteSkill(skillId) {
  set((s) => {
    const reqIds = s.requests.filter((r) => r.skillId === skillId).map((r) => r.id);
    return {
      skills: s.skills.filter((k) => k.id !== skillId),
      requests: s.requests.filter((r) => r.skillId !== skillId),
      sessions: s.sessions.filter((x) => !reqIds.includes(x.requestId)),
      messages: s.messages.filter((m) => !reqIds.includes(m.requestId))
    };
  });
}

// ---------- requests ----------
export function respondToRequest(requestId, accept) {
  set((s) => {
    const req = s.requests.find((r) => r.id === requestId);
    const skill = skillById(s, req.skillId);
    const mentor = userById(s, req.mentorId);
    return {
      requests: s.requests.map((r) =>
        r.id === requestId ? { ...r, status: accept ? 'ACCEPTED' : 'DECLINED', respondedAt: now(), declineReason: accept ? null : 'Not available right now' } : r
      ),
      notifications: notify(
        s,
        req.menteeId,
        accept ? 'REQUEST_ACCEPTED' : 'REQUEST_DECLINED',
        accept ? 'Request accepted' : 'Request declined',
        `${mentor.firstName} ${accept ? 'accepted' : 'declined'} your request for ${skill?.name}.`,
        '/requests'
      )
    };
  });
}

export function sendMessage(requestId, text) {
  const me = currentUser(state);
  set((s) => {
    const req = s.requests.find((r) => r.id === requestId);
    const other = req.menteeId === me.id ? req.mentorId : req.menteeId;
    return {
      messages: [...s.messages, { id: nextId(s.messages), requestId, senderId: me.id, text, sentAt: now() }],
      notifications: notify(s, other, 'CHAT_RECEIVED', 'New message', `${me.firstName}: ${text.slice(0, 60)}`, `/requests/${requestId}/chat`)
    };
  });
}

// ---------- sessions ----------
export function createSlot(requestId, startIso, durationMinutes, mode) {
  set((s) => {
    const req = s.requests.find((r) => r.id === requestId);
    const skill = skillById(s, req.skillId);
    const end = new Date(new Date(startIso).getTime() + durationMinutes * 60000).toISOString();
    const sessions = s.sessions.map((x) =>
      x.requestId === requestId && x.status === 'PENDING_MENTEE_CONFIRMATION' ? { ...x, status: 'RESCHEDULED' } : x
    );
    return {
      sessions: [...sessions, { id: nextId(s.sessions), requestId, menteeId: req.menteeId, mentorId: req.mentorId, start: startIso, end, mode, status: 'PENDING_MENTEE_CONFIRMATION' }],
      notifications: notify(s, req.menteeId, 'SESSION_UPDATED', 'New slot proposed', `A ${mode === 'VIDEO_VISIT' ? 'Video Visit' : 'In Person'} slot was proposed for ${skill?.name}.`, '/sessions')
    };
  });
}

export function respondToSlot(sessionId, accept) {
  set((s) => {
    const sess = s.sessions.find((x) => x.id === sessionId);
    const me = userById(s, sess.menteeId);
    return {
      sessions: s.sessions.map((x) => (x.id === sessionId ? { ...x, status: accept ? 'SCHEDULED' : 'REJECTED_BY_MENTEE' } : x)),
      notifications: notify(s, sess.mentorId, accept ? 'SESSION_SCHEDULED' : 'SESSION_UPDATED', accept ? 'Slot confirmed' : 'Slot rejected', `${me.firstName} ${accept ? 'accepted' : 'rejected'} your proposed slot.`, '/sessions')
    };
  });
}

export function completeSession(sessionId) {
  set((s) => {
    const sess = s.sessions.find((x) => x.id === sessionId);
    return {
      sessions: s.sessions.map((x) => (x.id === sessionId ? { ...x, status: 'COMPLETED' } : x)),
      requests: s.requests.map((r) => (r.id === sess.requestId ? { ...r, status: 'COMPLETED' } : r)),
      notifications: notify(s, sess.menteeId === s.currentUserId ? sess.mentorId : sess.menteeId, 'SESSION_COMPLETED', 'Session completed', 'A session was marked as completed. Don’t forget to leave a rating!', '/sessions')
    };
  });
}

export function rateMentor(requestId, rating, comment) {
  set((s) => {
    const req = s.requests.find((r) => r.id === requestId);
    const me = currentUser(s);
    const others = s.ratings.filter((r) => !(r.requestId === requestId && r.menteeId === me.id));
    return {
      ratings: [...others, { id: nextId(s.ratings), requestId, mentorId: req.mentorId, menteeId: me.id, rating, comment, createdAt: now() }],
      feedback: [
        { id: nextId(s.feedback), givenBy: me.id, givenTo: req.mentorId, rating, skillDev: rating, comm: rating, comment: comment || 'No comment left.', date: now() },
        ...s.feedback
      ],
      notifications: notify(s, req.mentorId, 'FEEDBACK_RECEIVED', 'New rating', `${me.firstName} rated you ${rating}/5.`, '/feedback')
    };
  });
}

// ---------- notifications ----------
export const markRead = (id) => set((s) => ({ notifications: s.notifications.map((n) => (n.id === id ? { ...n, read: true } : n)) }));
export const markAllRead = () =>
  set((s) => ({ notifications: s.notifications.map((n) => (n.userId === s.currentUserId ? { ...n, read: true } : n)) }));
