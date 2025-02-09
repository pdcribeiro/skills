import van from '../third-party/van.js';
import { routes } from '../app.js';
import db from '../db.js';
import images from '../images.js';
import { goTo } from '../routing.js';
import { confirmAnd } from '../utils.js';
import SkillForm from '../components/SkillForm.js';

const { div, h1, p } = van.tags;

export default function SkillEditPage({ param: id }) {
  const skill = van.state(null);
  db.getSkill(id).then((data) => (skill.val = data));

  return div(
    () => skill.val
      ? div(
        h1(skill.val.name),
        SkillForm({ initialData: skill.val, submit, cancel: confirmAndCancel }),
      )
      : p('loading skill data...')
  );

  async function submit(skillData) {
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

  function confirmAndCancel() {
    confirmAnd(() => goTo(routes.skillDetails(id)));
  }
}
