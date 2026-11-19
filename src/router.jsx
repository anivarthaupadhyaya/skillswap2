import { useEffect, useSyncExternalStore } from 'react';

// Minimal History-API router (no extra dependency needed).
const subscribe = (cb) => {
  window.addEventListener('popstate', cb);
  return () => window.removeEventListener('popstate', cb);
};

export function navigate(to, { replace = false } = {}) {
  if (to === window.location.pathname) return;
  window.history[replace ? 'replaceState' : 'pushState']({}, '', to);
  window.dispatchEvent(new PopStateEvent('popstate'));
  window.scrollTo({ top: 0 });
}

export const usePath = () => useSyncExternalStore(subscribe, () => window.location.pathname);

export function matchRoute(routes, path) {
  for (const [pattern, component] of routes) {
    const keys = [];
    const re = new RegExp(
      '^' + pattern.replace(/:[^/]+/g, (m) => (keys.push(m.slice(1)), '([^/]+)')).replace(/\/$/, '') + '/?$'
    );
    const m = path.match(re);
    if (m) return { component, params: Object.fromEntries(keys.map((k, i) => [k, decodeURIComponent(m[i + 1])])) };
  }
  return null;
}

export function Link({ to, children, className, onClick, ...rest }) {
  return (
    <a
      href={to}
      className={className}
      onClick={(e) => {
        if (e.metaKey || e.ctrlKey || e.shiftKey || e.button !== 0) return;
        e.preventDefault();
        onClick?.(e);
        navigate(to);
      }}
      {...rest}
    >
      {children}
    </a>
  );
}

export function Redirect({ to }) {
  useEffect(() => navigate(to, { replace: true }), [to]);
  return null;
}
