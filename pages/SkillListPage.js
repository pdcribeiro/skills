import van from '../third-party/van.js';
import { routes } from '../app.js';
import db from '../db.js';
import { bind } from '../utils.js';

const { a, div, input, ul, li } = van.tags;

export default function SkillListPage() {
  const skills = van.state(null);
  db.findSkills().then((data) => (skills.val = data));
  const search = van.state('');

  return div(
    div({ class: 'flex sticky top-0 items-center bg-theme' },
      input({ placeholder: 'search', class: 'm-0', ...bind(search) }),
      a({ href: routes.skillCreate(), class: 'button ml-4' }, '+'),
    ),
    () => skills.val
      ? ul(skills.val.filter(checkMatch).map(SkillListItem))
      : div('loading skills...'),
  );

  function checkMatch({ name }) {
    return name.includes(search.val)
  }
}

function SkillListItem({ id, name }) {
  return li({ class: 'mb-6' }, a({ href: routes.skillDetails(id) }, name));
}
