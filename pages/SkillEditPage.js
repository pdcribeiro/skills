import van from '/third-party/van-1.5.3.debug.js';
import { routes } from '../app.js';
import db from '../db.js';
import images from '../images.js';
import { goTo } from '../utils.js';
import { SkillForm } from '../components/SkillForm.js';

const { a, div, h1, p } = van.tags;

export function SkillEditPage({ param }) {
  const id = parseInt(param);
  const initialData = van.state(null);
  db.getSkill(id).then((data) => (initialData.val = data));

  return div(
    a({ href: routes.skillDetails(id), class: 'button' }, '< skill details'),
    h1('edit skill'),
    () =>
      initialData.val
        ? SkillForm({ initialData, onsubmit })
        : p('loading skill data...')
  );

  async function onsubmit(skillData) {
    skillData.pictures = await Promise.all(
      skillData.pictures.map((p) => (p.unsaved ? images.upload(p.file) : p))
    );
    await db.updateSkill(id, skillData);
    goTo(routes.skillDetails(id));
  }
}
