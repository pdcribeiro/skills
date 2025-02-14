import van from '../third-party/van.js';
import { routes } from '../app.js';
import db from '../db.js';
import images from '../images.js';
import { goTo } from '../routing.js';
import { confirmAnd } from '../utils.js';
import SkillForm from '../components/SkillForm.js';

const { div, h1 } = van.tags;

export default function SkillCreatePage() {
  return div(
    h1('new skill'),
    SkillForm({ onsubmit, oncancel: confirmAndCancel }),
  );

  async function onsubmit(skillData) {
    const pictures = await Promise.all(
      skillData.pictures.map(async ({ file, description }) => {
        const { id, url } = await images.upload(file);
        return { id, url, description };
      })
    );
    await db.createSkill({ ...skillData, pictures });
    goTo(routes.skillList());
  }

  async function confirmAndCancel() {
    confirmAnd(() => goTo(routes.skillList()));
  }
}
