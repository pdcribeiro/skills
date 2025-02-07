import van from '/third-party/van-1.5.3.debug.js';
import { router, transformValues } from './utils.js';

import { HomePage } from './pages/HomePage.js';
import { SkillListPage } from './pages/SkillListPage.js';
import { SkillCreatePage } from './pages/SkillCreatePage.js';
import { SkillDetailsPage } from './pages/SkillDetailsPage.js';
import { SkillEditPage } from './pages/SkillEditPage.js';

const { button, div } = van.tags;

export const routes = transformValues(
  {
    home: '#!/',
    skillList: '#!/skills',
    skillCreate: '#!/skills/create',
    skillDetails: '#!/skills/:param',
    skillEdit: '#!/skills/:param/edit',
  },
  (path) =>
    (param = null) =>
      param ? path.replace(':param', param) : path
);

export const app = div(
  button({ class: 'small', onclick: toggleDarkMode }, 'toggle dark mode'),
  router({
    [routes.home()]: HomePage,
    [routes.skillList()]: SkillListPage,
    [routes.skillCreate()]: SkillCreatePage,
    [routes.skillDetails()]: SkillDetailsPage,
    [routes.skillEdit()]: SkillEditPage,
  }),
)

function toggleDarkMode() {
  const bgColor = window.getComputedStyle(document.documentElement).getPropertyValue('--bg-color')
  const color = window.getComputedStyle(document.documentElement).getPropertyValue('--color')
  document.documentElement.style.setProperty('--bg-color', color)
  document.documentElement.style.setProperty('--color', bgColor)
}
