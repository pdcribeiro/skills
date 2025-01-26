import { HomePage } from './pages/HomePage.js';
import { SkillListPage } from './pages/SkillListPage.js';
import { SkillCreatePage } from './pages/SkillCreatePage.js';
import { SkillDetailsPage } from './pages/SkillDetailsPage.js';
import { SkillEditPage } from './pages/SkillEditPage.js';

import { router, transformValues } from './utils.js';

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

export const app = router({
  [routes.home()]: HomePage,
  [routes.skillList()]: SkillListPage,
  [routes.skillCreate()]: SkillCreatePage,
  [routes.skillDetails()]: SkillDetailsPage,
  [routes.skillEdit()]: SkillEditPage,
});
