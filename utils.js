import van from '/third-party/van-1.5.2.min.js';

export function runOnMount(callback) {
  setTimeout(callback, 5);
}
// takes state boolean and component function
export function renderIf(condition, component) {
  return () => (condition.val ? component() : div());
}

export function router(routes) {
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
    `^${path.replace(':p', '(\\w+)')}$`,
    handler,
  ]);
}
