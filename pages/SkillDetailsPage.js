import van from '/third-party/van-1.5.3.debug.js';
import { routes } from '../app.js';
import db from '../db.js';
import { goTo } from '../utils.js';

const { a, button, div, h1, h2, li, p, ul, img } = van.tags;

export function SkillDetailsPage({ param }) {
  const id = parseInt(param);
  const skill = van.state(null);
  db.getSkill(id).then((data) => (skill.val = data));

  return div(
    a({ href: routes.skillList() }, '< skill list'),
    h1('skill details'),
    a({ href: routes.skillEdit(id) }, 'edit'),
    button({ onclick: confirmAndDelete }, 'delete'),
    () => (skill.val ? SkillDetails(skill) : p('loading skill data...'))
  );

  async function confirmAndDelete() {
    if (confirm('are you sure?')) {
      await db.deleteSkill(id);
      goTo(routes.skillList());
    }
  }
}

function SkillDetails(skill) {
  const { name, description, pictures, tags } = skill.val;
  return div(
    h2(name),
    p(description),
    ul(pictures.map(({ url }) => li(img({ src: url })))),
    p(tags)
  );
}
