import van from '/third-party/van-1.5.3.debug.js';
import { routes } from '../app.js';
import db from '../db.js';

const { a, div, h1, ul, li } = van.tags;

export function SkillListPage() {
  const skills = van.state([]);
  db.findSkills().then((data) => (skills.val = data));

  return div(
    h1('skill list'),
    () => ul(skills.val.map(SkillListItem)),
    a({ href: routes.skillCreate(), class: 'button' }, 'create skill')
  );
}

function SkillListItem({ id, name }) {
  return li('- ', a({ href: routes.skillDetails(id) }, name));
}
