// Demo data that mirrors the Spring Boot entities (User, Skill, Request, Session, ...).
// Dates are generated relative to "now" so the demo always looks fresh.

export const CATEGORIES = [
  {
    key: 'PHYSICAL_FITNESS',
    name: 'Physical / Fitness',
    emoji: '🏃',
    tint: 'coral',
    description:
      'Activities involving body movement, strength, endurance, or coordination like gym workouts, sports, yoga, running, martial arts, and dancing.'
  },
  {
    key: 'CREATIVE_ARTISTIC',
    name: 'Creative / Artistic',
    emoji: '🎨',
    tint: 'pink',
    description:
      'Hobbies focused on creating or expressing ideas through music, art, writing, design, filmmaking, photography, or any imaginative activity.'
  },
  {
    key: 'INTELLECTUAL_LEARNING',
    name: 'Intellectual / Learning',
    emoji: '🧠',
    tint: 'indigo',
    description:
      'Activities that stimulate thinking and knowledge growth like reading, coding, problem-solving, studying subjects, puzzles, strategy games, and research.'
  },
  {
    key: 'SOCIAL_CONNECTION',
    name: 'Social / Connection',
    emoji: '🤝',
    tint: 'amber',
    description:
      'Hobbies involving interaction with others such as group activities, networking, clubs, events, conversations, team sports, and building relationships.'
  },
  {
    key: 'RELAXATION_PASSIVE',
    name: 'Relaxation / Passive',
    emoji: '🎧',
    tint: 'sky',
    description:
      'Low-effort activities meant for relaxation and enjoyment like watching movies, listening to music, casual gaming, or simply unwinding.'
  },
  {
    key: 'SPIRITUAL_INNER_GROWTH',
    name: 'Spiritual / Inner Growth',
    emoji: '🧘',
    tint: 'violet',
    description:
      'Practices that improve inner peace and self-awareness such as meditation, mindfulness, reflection, philosophy, and connecting with deeper purpose.'
  },
  {
    key: 'EXPLORATION_ADVENTURE',
    name: 'Exploration / Adventure',
    emoji: '🧭',
    tint: 'green',
    description:
      'Activities involving new experiences and environments like traveling, hiking, camping, road trips, discovering places, and stepping outside comfort zones.'
  },
  {
    key: 'COLLECTION_BUILDING',
    name: 'Collection / Building',
    emoji: '🧩',
    tint: 'teal',
    description:
      'Hobbies centered on making, assembling or curating things such as model kits, LEGO, woodworking, electronics, and collecting.'
  }
];

export const categoryByKey = Object.fromEntries(CATEGORIES.map((c) => [c.key, c]));

const DAY = 86400000;
const iso = (offsetDays, hour = 10, minute = 0) => {
  const d = new Date(Date.now() + offsetDays * DAY);
  d.setHours(hour, minute, 0, 0);
  return d.toISOString();
};

export function createSeed() {
  const users = [
    { id: 1, firstName: 'Alex', lastName: 'Morgan', email: 'mentee@skillswap.dev', password: 'demo123', role: 'MENTEE', department: 'Product' },
    { id: 2, firstName: 'Priya', lastName: 'Sharma', email: 'mentor@skillswap.dev', password: 'demo123', role: 'MENTOR', department: 'Engineering' },
    { id: 3, firstName: 'Arjun', lastName: 'Mehta', email: 'arjun@skillswap.dev', password: 'demo123', role: 'MENTOR', department: 'Design' },
    { id: 4, firstName: 'Sara', lastName: 'Khan', email: 'sara@skillswap.dev', password: 'demo123', role: 'MENTOR', department: 'Data' },
    { id: 5, firstName: 'Daniel', lastName: 'Lee', email: 'daniel@skillswap.dev', password: 'demo123', role: 'MENTOR', department: 'People Ops' },
    { id: 6, firstName: 'Meera', lastName: 'Iyer', email: 'meera@skillswap.dev', password: 'demo123', role: 'MENTOR', department: 'Sales' },
    { id: 7, firstName: 'Kabir', lastName: 'Rao', email: 'kabir@skillswap.dev', password: 'demo123', role: 'MENTEE', department: 'Finance' },
    { id: 8, firstName: 'Lina', lastName: 'Park', email: 'lina@skillswap.dev', password: 'demo123', role: 'MENTEE', department: 'Marketing' }
  ];

  const s = (id, name, mentorId, categories, description, createdDaysAgo = 20) => ({
    id, name, mentorId, categories, description, createdAt: iso(-createdDaysAgo)
  });

  const skills = [
    s(1, 'Morning Yoga Flow', 2, ['PHYSICAL_FITNESS', 'SPIRITUAL_INNER_GROWTH'], 'A gentle 45-minute routine to build flexibility and start the day focused. Suitable for complete beginners.'),
    s(2, 'Couch to 5K Running', 2, ['PHYSICAL_FITNESS'], 'Structured plan, pacing tips and form checks to get you running your first 5K in eight weeks.'),
    s(3, 'Python for Automation', 2, ['INTELLECTUAL_LEARNING'], 'Automate spreadsheets, emails and file chores with small, practical Python scripts.'),
    s(4, 'Acoustic Guitar Basics', 3, ['CREATIVE_ARTISTIC', 'RELAXATION_PASSIVE'], 'Chords, strumming patterns and your first three songs. Bring any guitar, we will tune it together.'),
    s(5, 'Smartphone Photography', 3, ['CREATIVE_ARTISTIC', 'EXPLORATION_ADVENTURE'], 'Composition, light and editing on the phone you already own. Includes a photo walk.'),
    s(6, 'Chess Strategy', 4, ['INTELLECTUAL_LEARNING', 'SOCIAL_CONNECTION'], 'Openings, middlegame plans and endgame technique, with annotated games from our office league.'),
    s(7, 'Data Storytelling', 4, ['INTELLECTUAL_LEARNING'], 'Turn raw numbers into a clear narrative: picking charts, framing insights and presenting them.'),
    s(8, 'Mindfulness Meditation', 5, ['SPIRITUAL_INNER_GROWTH', 'RELAXATION_PASSIVE'], 'Short, science-backed practices to reduce stress and improve focus during busy work weeks.'),
    s(9, 'Public Speaking', 5, ['SOCIAL_CONNECTION'], 'Overcome stage fright and structure talks that land, from team stand-ups to all-hands.'),
    s(10, 'Weekend Hiking 101', 6, ['EXPLORATION_ADVENTURE', 'PHYSICAL_FITNESS'], 'Trail selection, packing lists and safety basics, followed by a group hike near the city.'),
    s(11, 'Budget Travel Planning', 6, ['EXPLORATION_ADVENTURE'], 'Find cheap flights, build itineraries and travel more for less on your annual leave.'),
    s(12, 'LEGO Technic Building', 3, ['COLLECTION_BUILDING', 'CREATIVE_ARTISTIC'], 'Gears, linkages and motors. Build a working mechanism and learn the engineering behind it.'),
    s(13, 'Board Game Nights', 6, ['SOCIAL_CONNECTION', 'RELAXATION_PASSIVE'], 'Learn modern strategy board games and how to host a great game night for your team.')
  ];

  const requests = [
    { id: 1, menteeId: 1, mentorId: 2, skillId: 1, status: 'ACCEPTED', message: 'I sit all day and would love a short morning routine.', requestedAt: iso(-9, 9, 15) },
    { id: 2, menteeId: 1, mentorId: 3, skillId: 4, status: 'ACCEPTED', message: 'Got a guitar for my birthday, have no idea where to start!', requestedAt: iso(-6, 14, 30) },
    { id: 3, menteeId: 1, mentorId: 4, skillId: 6, status: 'PROPOSED', message: 'I know the rules but keep losing in the office league.', requestedAt: iso(-1, 11, 0) },
    { id: 4, menteeId: 1, mentorId: 5, skillId: 9, status: 'COMPLETED', message: 'Presenting at the quarterly all-hands soon.', requestedAt: iso(-30, 10, 0) },
    { id: 5, menteeId: 7, mentorId: 2, skillId: 3, status: 'PROPOSED', message: 'Our month-end reports take two days. Can Python help?', requestedAt: iso(-2, 16, 45) },
    { id: 6, menteeId: 8, mentorId: 2, skillId: 1, status: 'ACCEPTED', message: 'Looking to de-stress before work.', requestedAt: iso(-5, 8, 20) },
    { id: 7, menteeId: 8, mentorId: 2, skillId: 2, status: 'PROPOSED', message: 'Signed up for a charity 5K next month!', requestedAt: iso(0, 9, 5) }
  ];

  const sessions = [
    { id: 1, requestId: 1, menteeId: 1, mentorId: 2, start: iso(2, 8, 0), end: iso(2, 9, 0), mode: 'IN_PERSON', status: 'SCHEDULED' },
    { id: 2, requestId: 2, menteeId: 1, mentorId: 3, start: iso(4, 18, 0), end: iso(4, 19, 0), mode: 'VIDEO_VISIT', status: 'PENDING_MENTEE_CONFIRMATION' },
    { id: 3, requestId: 4, menteeId: 1, mentorId: 5, start: iso(-20, 15, 0), end: iso(-20, 16, 0), mode: 'IN_PERSON', status: 'COMPLETED' },
    { id: 4, requestId: 6, menteeId: 8, mentorId: 2, start: iso(3, 9, 0), end: iso(3, 10, 0), mode: 'VIDEO_VISIT', status: 'SCHEDULED' }
  ];

  const messages = [
    { id: 1, requestId: 1, senderId: 1, text: 'Hi Priya! Thanks for accepting. Do I need a yoga mat?', sentAt: iso(-8, 10, 2) },
    { id: 2, requestId: 1, senderId: 2, text: 'Hi Alex! A mat helps, but a towel on carpet works for the first session too.', sentAt: iso(-8, 10, 20) },
    { id: 3, requestId: 1, senderId: 1, text: 'Perfect, see you on the scheduled day 🙌', sentAt: iso(-8, 10, 25) },
    { id: 4, requestId: 2, senderId: 3, text: 'Welcome aboard! Which guitar do you have, acoustic or classical?', sentAt: iso(-5, 12, 0) },
    { id: 5, requestId: 6, senderId: 8, text: 'Is video okay for the first session?', sentAt: iso(-4, 9, 0) },
    { id: 6, requestId: 6, senderId: 2, text: 'Absolutely, I have proposed a video slot.', sentAt: iso(-4, 9, 30) }
  ];

  const notifications = [
    { id: 1, userId: 1, type: 'SESSION_UPDATED', title: 'New slot proposed', message: 'Arjun proposed a Video Visit slot for Acoustic Guitar Basics.', link: '/sessions', read: false, createdAt: iso(-1, 9, 0) },
    { id: 2, userId: 1, type: 'REQUEST_ACCEPTED', title: 'Request accepted', message: 'Arjun accepted your request for Acoustic Guitar Basics.', link: '/requests', read: false, createdAt: iso(-5, 11, 40) },
    { id: 3, userId: 1, type: 'CHAT_RECEIVED', title: 'New message', message: 'Priya replied in your Morning Yoga Flow chat.', link: '/requests/1/chat', read: true, createdAt: iso(-8, 10, 20) },
    { id: 4, userId: 1, type: 'FEEDBACK_RECEIVED', title: 'Feedback received', message: 'Daniel left feedback on your Public Speaking session.', link: '/feedback', read: true, createdAt: iso(-19, 17, 0) },
    { id: 5, userId: 2, type: 'REQUEST_RECEIVED', title: 'New mentee request', message: 'Lina Park wants to learn Couch to 5K Running.', link: '/requests', read: false, createdAt: iso(0, 9, 5) },
    { id: 6, userId: 2, type: 'REQUEST_RECEIVED', title: 'New mentee request', message: 'Kabir Rao wants to learn Python for Automation.', link: '/requests', read: false, createdAt: iso(-2, 16, 45) },
    { id: 7, userId: 2, type: 'SESSION_SCHEDULED', title: 'Slot confirmed', message: 'Lina accepted your Video Visit slot for Morning Yoga Flow.', link: '/sessions', read: true, createdAt: iso(-4, 12, 0) }
  ];

  const ratings = [
    { id: 1, requestId: 4, mentorId: 5, menteeId: 1, rating: 5, comment: 'Daniel made me feel confident on stage.', createdAt: iso(-19) },
    { id: 2, requestId: 6, mentorId: 2, menteeId: 8, rating: 5, comment: 'Calm, clear and encouraging.', createdAt: iso(-3) },
    { id: 3, requestId: 0, mentorId: 2, menteeId: 7, rating: 4, comment: 'Great explanations.', createdAt: iso(-40) },
    { id: 4, requestId: 0, mentorId: 3, menteeId: 7, rating: 5, comment: '', createdAt: iso(-25) },
    { id: 5, requestId: 0, mentorId: 4, menteeId: 8, rating: 4, comment: '', createdAt: iso(-15) }
  ];

  const feedback = [
    { id: 1, givenBy: 5, givenTo: 1, rating: 5, skillDev: 5, comm: 4, comment: 'Alex prepared thoroughly and improved a lot between rehearsals. Great energy on stage!', date: iso(-19) },
    { id: 2, givenBy: 8, givenTo: 2, rating: 5, skillDev: 4, comm: 5, comment: 'Priya explains every pose clearly and adapts to my level. I already feel less stiff.', date: iso(-3) },
    { id: 3, givenBy: 7, givenTo: 2, rating: 4, skillDev: 4, comm: 4, comment: 'Practical examples I could use the very next day. Would love more homework.', date: iso(-40) },
    { id: 4, givenBy: 1, givenTo: 2, rating: 5, skillDev: 5, comm: 5, comment: 'Super patient and well organised mentor.', date: iso(-12) }
  ];

  return { version: 1, currentUserId: null, users, skills, requests, sessions, messages, notifications, ratings, feedback };
}
