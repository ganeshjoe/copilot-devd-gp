# AGENTS

- Keep this project plain JavaScript: no frameworks, bundlers, build tools, or extra npm dependencies.
- Put core quiz logic in `src/quiz.js`; export functions with `module.exports` so `node:test` can run them.
- Keep DOM/UI behavior in `src/app.js`; do not mix browser code into the logic file.
- Preserve the separation between pure logic and UI; tests should target logic in `src/quiz.js`.
- Use CSS variables only in `:root` for colors; do not add hardcoded color values elsewhere in CSS.
- Keep the interface accessible: use buttons for actions, show visible keyboard focus, and add `aria-live` to messages that change after interactions.
- Run tests with `npm test` before considering work complete.
- Prefer small, focused edits that match the repo’s minimalist style and no-dependency approach.
