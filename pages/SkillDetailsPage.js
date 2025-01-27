import van from '/third-party/van-1.5.3.debug.js';
import { routes } from '../app.js';
import db from '../db.js';
import { goTo } from '../utils.js';

const { a, button, div, h1, h2, p, img } = van.tags;

export function SkillDetailsPage({ param }) {
  const id = parseInt(param);
  const skill = van.state(null);
  db.getSkill(id).then((data) => (skill.val = data));

  return div(
    a({ href: routes.skillList(), class: 'button' }, '< skill list'),
    div({ class: 'flex items-center' },
      h1('skill details'),
      Actions({ id }),
    ),
    () => (skill.val ? SkillDetails({ skill }) : p('loading skill data...'))
  );
}

function Actions({ id }) {
  return div({ class: 'ml-auto' },
    a({ href: routes.skillEdit(id), class: 'button small' }, 'edit'),
    button({ onclick: confirmAndDelete, class: 'button small ml-4' }, 'delete'),
  )

  async function confirmAndDelete() {
    if (confirm('are you sure?')) {
      await db.deleteSkill(id);
      goTo(routes.skillList());
    }
  }
}

function SkillDetails({ skill }) {
  const { name, description, pictures, tags } = skill.val;
  return div(
    h2(name),
    p(description),
    Pictures({ pictures }),
    p(tags)
  );
}

function Pictures({ pictures }) {
  return div({ class: 'flex flex-wrap gap-4' },
    pictures.map((pic) => div(
      img({ src: pic.url }),
      p(pic.description),
    ))
  )
}
