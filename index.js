import van from '/third-party/van-1.5.3.debug.js';
import { app } from './app.js';

van.add(document.body, app);

/* TODO
- feat: allow uploading pictures
  - fix: image sizes
    - set max width and height
    - prevent overflow on mobile
    - prevent extra space on modal on desktop
  - feat: reorder images in skill form
    - pressing image shows buttons to edit, delete, move up, move down
  - feat: allow adding multiple images
- feat: use DB
*/
