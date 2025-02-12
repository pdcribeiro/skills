# skills

## TODO

- chore: adapt DragAndDropList to work with click and touch events instead
  - add delay to trigger drag
  - scroll up/down when clientY in top/bottom 10% of viewport

- chore: performance improvements
  - skill form: extract pictures state, to avoid rerendering pictures when typing in inputs
  - avoid rerendering picture list (or scrolling back to the beginning) when a picture is updated
- feat: allow uploading pictures
  - feat: details page: display images in second column on larger screens. position fixed
  - feat: edit form: display images in second column on large screens
- chore: try switching to non hash based router

test
- access token refresh on load when expired
- access token auto refresh before expiring
