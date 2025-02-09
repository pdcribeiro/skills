import van from '../third-party/van.js';
import { routes } from '../app.js';
import db from '../db.js';

const { a, div, h1, ul, li } = van.tags;

export function SkillListPage() {
  const skills = van.state(null);
  db.findSkills().then((data) => (skills.val = data));

  return div(
    div({ class: 'flex items-center' },
      h1('skill list'),
      a({ href: routes.skillCreate(), class: 'button ml-auto' }, 'create'),
    ),
    () => skills.val ? ul(skills.val.map(SkillListItem)) : div('loading skills...'),
  );
}

function SkillListItem({ id, name }) {
  return li(a({ href: routes.skillDetails(id) }, name));
}
