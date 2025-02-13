import van from '../third-party/van.js';
import DragAndDropList from './DragAndDropList.js'
import Modal from './Modal.js';
import { bind, confirmAnd } from '../utils.js';

const { button, div, input, label, textarea, img } = van.tags;

export default function SkillForm({ initialData = {}, cancel, ...props }) {
  const formData = van.state({
    name: '',
    description: '',
    pictures: [],
    tags: '',
    ...initialData,
  });

  return div(
    label('name'), input(bind(formData, 'name')),
    label('description'), textarea({ rows: 12, ...bind(formData, 'description') }),
    label('pictures'), input({ type: 'file', multiple: true, onchange: loadImages }),
    () => Pictures({ pictures: formData.val.pictures, update: updatePictures }),
    label('tags'), textarea(bind(formData, 'tags')),
    button({ onclick: submit }, 'save'),
    button({ class: 'ml-4', onclick: cancel }, 'cancel'),
  );

  async function loadImages(event) {
    const pictures = await Promise.all([...event.target.files].map(async (file) => {
      const url = await getLocalUrl(file)
      return { file, url, description: '', unsaved: true }
    }))
    updatePictures([...formData.val.pictures, ...pictures]);
  }

  function updatePictures(pictures) {
    formData.val = { ...formData.val, pictures };
  }

  function submit(event) {
    console.debug('[skill form] submit event', event);
    props.submit(formData.val);
  }
}

function Pictures({ pictures, update }) {
  const selected = van.state(null);
  const editing = van.state(null);
  return div({ class: 'mb-4' },
    div({ class: 'flex overflow-y-auto flex-col gap-4 items-center max-h-152' },
      DragAndDropList({
        items: pictures.map((pic) =>
          div({ class: 'relative' },
            img({ src: pic.url, class: 'block p-2 min-h-48 size-48 border', onclick: () => selected.val = pic }),
            () => pic === selected.val ?
              div(
                div({ class: 'overlay bg-transparent', onclick: unselect }),
                div({ class: 'overlay flex absolute flex-col justify-center items-center bg-theme' },
                  div(
                    button({ onclick: edit }, 'edit'),
                    button({ class: 'ml-4', onclick: confirmAndDelete }, 'delete'),
                  ),
                ),
              ) : div(),
          ),
        ),
        onupdate: handleMove,
      }),
    ),
    () => editing.val ? EditModal({ picture: editing.val, update: updatePicture, close: () => editing.val = null }) : div(),
  );

  function unselect() {
    selected.val = null;
  }

  function edit() {
    editing.val = selected.val;
    unselect();
  }

  function confirmAndDelete() {
    confirmAnd(() => update(pictures.filter((p) => p !== selected.val)))
    unselect();
  }

  function handleMove(originalIndex, newIndex) {
    const clone = [...pictures];
    const [movedItem] = clone.splice(originalIndex, 1);
    clone.splice(newIndex, 0, movedItem);
    update(clone);
  }

  function updatePicture(picture) {
    update(pictures.map((p) => (p === editing.val ? picture : p)).filter((p) => !p.deleted));
  }
}

function EditModal({ update, close, ...props }) {
  const picture = van.state(props.picture);
  return Modal({ close },
    () => img({ src: picture.val.url, class: 'block mx-auto mb-4 max-h-screen/2' }),
    input({ type: 'file', onchange: loadImage }),
    textarea({ rows: 5, ...bind(picture, 'description') }),
    button({ onclick: save }, 'save'),
    button({ class: 'ml-4', onclick: confirmAndDelete }, 'delete'),
    button({ class: 'ml-4', onclick: close }, 'cancel'),
  );

  async function loadImage(event) {
    const file = event.target.files[0];
    const url = await getLocalUrl(file);
    const { description } = picture.val
    picture.val = { file, url, description, unsaved: true };
  }

  async function save() {
    update(picture.val);
    close();
  }

  function confirmAndDelete() {
    confirmAnd(() => {
      update({ ...props.picture, deleted: true });
      close()
    })
  }
}

function getLocalUrl(file) {
  return new Promise((res, rej) => {
    const reader = new FileReader();
    reader.onload = (e) => res(e.target.result);
    reader.onerror = (e) => rej(e);
    reader.readAsDataURL(file);
  });
}
