import van from './third-party/van.js';
import { transformValues } from './utils.js';

export function getRouteHelpers(routes) {
  return transformValues(
    routes,
    (path) =>
      (param = null) =>
        param ? path.replace(':param', param) : path
  )
}

// TODO: try to simplify (see: https://vanjs.org/demo#code-browser)
export function getRouter(routes) {
  const parsedRoutes = parsePaths(routes);
  console.debug('[router]', { parsedRoutes });

  const getPath = (url) => (new URL(url).hash || '#!/').split('?')[0];
  const path = van.state(getPath(location.href));
  window.addEventListener('hashchange', (e) => (path.val = getPath(e.newURL)));

  return () => {
    console.debug('[router]', { path: path.val });
    for (const [pattern, handler] of parsedRoutes) {
      const match = path.val.match(pattern);
      console.debug('[router]', { pattern, match });
      if (match) {
        return handler({ param: match[1] });
      }
    }
  };
}

function parsePaths(routes) {
  return Object.entries(routes).map(([path, handler]) => [
    `^${path.replace(':param', '(\\w+)')}$`,
    handler,
  ]);
}

export function goTo(path) {
  location.hash = path;
}
