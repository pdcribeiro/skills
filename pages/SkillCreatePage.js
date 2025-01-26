import van from '/third-party/van-1.5.3.debug.js';
import { routes } from '../app.js';
import db from '../db.js';
import images from '../images.js';
import { goTo } from '../utils.js';
import { SkillForm } from '../components/SkillForm.js';

const { a, div, h1 } = van.tags;

export function SkillCreatePage() {
  return div(
    a({ href: routes.skillList() }, '< skill list'),
    h1('create skill'),
    SkillForm({ onsubmit })
  );

  async function onsubmit(skillData) {
    skillData.pictures = await Promise.all(
      skillData.pictures.map(({ file }) => images.upload(file))
    );
    await db.createSkill(skillData);
    goTo(routes.skillList());
  }
}
