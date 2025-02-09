import van from '../third-party/van.js';
import { routes } from '../app.js';

const { a, div, h1 } = van.tags;

export function HomePage() {
  return div(h1('Home'), a({ href: routes.skillList() }, 'skill list'));
}
