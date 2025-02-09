import van from './third-party/van.js';

// TODO: try to simplify (see: https://vanjs.org/demo#code-browser)
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
    `^${path.replace(':param', '(\\w+)')}$`,
    handler,
  ]);
}

export function goTo(path) {
  location.hash = path;
}

export function transformValues(object, callback) {
  const transformed = Object.entries(object).map(([k, v]) => [k, callback(v)]);
  return Object.fromEntries(transformed);
}

export function bind(state, ...props) {
  return props.length ? {
    value: () => getNested(state.val, props),
    oninput: (e) => state.val = setNested(state.val, props, e.target.value),
  } : {
    value: state,
    oninput: (e) => state.val = e.target.value,
  };
}

function getNested(obj, path) {
  return path.reduce((o, key) => (o && o[key] !== undefined ? o[key] : ''), obj);
}

function setNested(obj, path, value) {
  if (path.length === 0) return value;
  const [key, ...rest] = path;
  return {
    ...obj,
    [key]: setNested(obj[key] || {}, rest, value),
  };
}

// note: event handlers must be assigned to the root element being added/removed
export function observeLifecycleEvents(element) {
  const observer = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
      mutation.addedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          node.dispatchEvent(new Event('mount'));
        }
      });
      mutation.removedNodes.forEach((node) => {
        if (node.nodeType === Node.ELEMENT_NODE) {
          node.dispatchEvent(new Event('unmount'));
        }
      });
    });
  });
  observer.observe(element, { childList: true, subtree: true });
  return observer.disconnect;
}

// export function range(n) {
//   return [...Array(n).keys()];
// }
