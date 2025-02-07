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
    a({ href: routes.skillDetails(id), class: 'button small' }, '< skill details'),
    h1('edit skill'),
    () =>
      initialData.val
        ? SkillForm({ initialData, onsubmit })
        : p('loading skill data...')
  );

  async function onsubmit(skillData) {
    skillData.pictures = await Promise.all(
      skillData.pictures.map(async (pic) => {
        if (pic.unsaved) {
          const { id, url } = await images.upload(pic.file);
          return { id, url, description: pic.description };
        } else {
          return pic;
        }
      })
    );
    await db.updateSkill(id, skillData);
    goTo(routes.skillDetails(id));
  }
}
