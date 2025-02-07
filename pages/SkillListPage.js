import van from '/third-party/van-1.5.3.debug.js';
import { routes } from '../app.js';
import db from '../db.js';

const { a, button, div, h1, ul, li } = van.tags;

export function SkillListPage() {
  const skills = van.state([]);
  db.findSkills().then((data) => (skills.val = data));

  return div(
    button({ class: 'button small', onclick: toggleDarkMode }, 'toggle dark mode'),
    div({ class: 'flex items-center' },
      h1('skill list'),
      a({ href: routes.skillCreate(), class: 'button ml-auto' }, 'create'),
    ),
    () => ul(skills.val.map(SkillListItem)),
  );
}

function toggleDarkMode() {
  const bgColor = window.getComputedStyle(document.documentElement).getPropertyValue('--bg-color')
  const color = window.getComputedStyle(document.documentElement).getPropertyValue('--color')
  document.documentElement.style.setProperty('--bg-color', color)
  document.documentElement.style.setProperty('--color', bgColor)
}

function SkillListItem({ id, name }) {
  return li(a({ href: routes.skillDetails(id) }, name));
}
