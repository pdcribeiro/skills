
import van from '../third-party/van.js';

const { div } = van.tags;

export default function Modal({ close }, ...children) {
  return div({
    class: 'overlay flex justify-center items-center',
    onclick: (e) => e.target === e.currentTarget && close()
  },
    div({ class: 'p-6 bg-theme' }, ...children)
  );
}
