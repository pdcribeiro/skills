import van from '/third-party/van-1.5.3.debug.js';
import { app } from './app.js';

van.add(document.body, app);

/* TODO
- feat: allow uploading pictures
  - feat: reorder images in skill form
    - pressing image shows buttons to edit, delete, move up, move down
  - feat: allow adding multiple images
  - feat: edit form: display images horizontally on large screens
  - feat?: details page: display images in second column in larger screens
- feat: use DB
- chore: try to switch to non hash based router
*/
