
import van from '../third-party/van.js';

const { div } = van.tags;

export default function Modal({ close, ...props }, ...children) {
  return div({
    class: 'overlay flex justify-center items-center',
    onclick: (e) => e.target === e.currentTarget && close(),
  },
    div({ ...props, class: `p-6 m-4 bg-theme ${props.class ?? ''}` }, ...children)
  );
}
