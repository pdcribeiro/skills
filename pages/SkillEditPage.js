import van from '../third-party/van.js';
import { routes } from '../app.js';
import db from '../db.js';
import images from '../images.js';
import { goTo } from '../utils.js';
import SkillForm from '../components/SkillForm.js';

const { a, div, h1, p } = van.tags;

export function SkillEditPage({ param: id }) {
  const skill = van.state(null);
  db.getSkill(id).then((data) => (skill.val = data));

  return div(
    a({ href: routes.skillDetails(id), class: 'button small' }, '< skill details'),
    h1('edit skill'),
    () =>
      skill.val
        ? SkillForm({ initialData: skill.val, onsubmit })
        : p('loading skill data...')
  );

  async function onsubmit(skillData) {
    const pictures = await Promise.all(
      skillData.pictures.map(async (pic) => {
        if (pic.unsaved) {
          const { id, url } = await images.upload(pic.file);
          return { id, url, description: pic.description };
        } else {
          return pic;
        }
      })
    );
    await db.updateSkill(id, { ...skillData, pictures });
    goTo(routes.skillDetails(id));
  }
}
