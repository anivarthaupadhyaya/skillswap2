import { useEffect } from 'react';
import { matchRoute, Redirect, usePath } from './router';
import { useStore } from './data/store';
import Layout from './components/Layout';
import { ToastProvider } from './components/ui';
import Landing from './pages/Landing';
import { Login, Register } from './pages/Auth';
import Dashboard from './pages/Dashboard';
import Catalog from './pages/Catalog';
import Requests from './pages/Requests';
import Chat from './pages/Chat';
import Sessions, { NewSkill, SkillMentees } from './pages/Sessions';
import { Feedback, NotFound, Notifications } from './pages/Inbox';

const PUBLIC = [
  ['/', Landing],
  ['/login', Login],
  ['/register', Register]
];

const PRIVATE = [
  ['/dashboard', Dashboard],
  ['/skills', Catalog],
  ['/skills/:category', Catalog],
  ['/requests', Requests],
  ['/requests/:id/chat', Chat],
  ['/sessions', Sessions],
  ['/sessions/new-skill', NewSkill],
  ['/sessions/skill/:id', SkillMentees],
  ['/notifications', Notifications],
  ['/feedback', Feedback]
];

const TITLES = {
  '/': 'SkillSwap · Corporate Knowledge Exchange',
  '/login': 'Log in · SkillSwap',
  '/register': 'Register · SkillSwap'
};

export default function App() {
  const path = usePath();
  const loggedIn = useStore((s) => s.currentUserId != null && s.users.some((u) => u.id === s.currentUserId));

  useEffect(() => {
    const section = path.split('/')[1];
    document.title = TITLES[path] || `${section ? section.charAt(0).toUpperCase() + section.slice(1).replace('-', ' ') : 'Home'} · SkillSwap`;
  }, [path]);

  let content;
  const pub = matchRoute(PUBLIC, path);
  const priv = matchRoute(PRIVATE, path);

  if (pub) {
    content = loggedIn ? <Redirect to="/dashboard" /> : <pub.component params={pub.params} />;
  } else if (priv) {
    content = loggedIn ? (
      <Layout>
        <priv.component key={path} params={priv.params} />
      </Layout>
    ) : (
      <Redirect to="/login" />
    );
  } else {
    content = loggedIn ? <Layout><NotFound /></Layout> : <NotFound />;
  }

  return <ToastProvider>{content}</ToastProvider>;
}
