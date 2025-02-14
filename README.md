# skills

## next

- fix: update draggedItem position during scroll
  - if pointer doesn't move, the image stays behind
- chore: prevent re-rendering of images control in skillform
  - skill form: extract pictures state, to avoid rerendering pictures when typing in inputs
  - avoid rerendering picture list (or scrolling back to the beginning) when a picture is updated

test
- access token refresh on load when expired
- access token auto refresh before expiring


## backlog

- edit in place like notion
- autosave: save on exit or 2 seconds after typing stops

- feat: allow uploading pictures
  - feat: details page: display images in second column on larger screens. position fixed
  - feat: edit form: display images in second column on large screens
- chore: try switching to non hash based router
