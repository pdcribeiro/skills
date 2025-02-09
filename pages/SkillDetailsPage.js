import van from '../third-party/van.js';
import { routes } from '../app.js';
import db from '../db.js';
import { goTo } from '../routing.js';
import { confirmAnd } from '../utils.js';

const { a, button, div, h1, p, img } = van.tags;

export default function SkillDetailsPage({ param: id }) {
  const skill = van.state(null);
  db.getSkill(id).then((data) => (skill.val = data));

  return div(
    div({ class: 'flex sticky top-0 items-center bg-theme' },
      a({ href: routes.skillList(), class: 'button small' }, '< skill list'),
      a({ href: routes.skillEdit(id), class: 'button small ml-auto' }, 'edit'),
      button({ onclick: confirmAndDelete, class: 'button small ml-4' }, 'delete'),
    ),
    () => skill.val ? SkillDetails(skill.val) : p('loading skill data...'),
  );

  function confirmAndDelete() {
    confirmAnd(() => db.deleteSkill(id).then(() => goTo(routes.skillList())))
  }
}

function SkillDetails({ name, description, pictures, tags }) {
  return div(
    h1(name),
    p({ class: 'whitespace-pre-wrap' }, description),
    Pictures({ pictures }),
    p(tags)
  );
}

function Pictures({ pictures }) {
  return div({ class: 'overflow-x-auto text-nowrap snap-x' },
    pictures.map((pic) => div({ class: 'inline-block w-full snap-center' },
      img({ src: pic.url, class: 'block mx-auto h-screen/2' }),
      p({ class: 'overflow-y-auto h-14 text-center whitespace-pre-wrap' }, pic.description),
    ))
  )
}
