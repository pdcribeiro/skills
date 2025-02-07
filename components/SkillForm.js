import van from '/third-party/van-1.5.3.debug.js';

const { button, div, input, label, textarea, img } = van.tags;

export function SkillForm({ initialData = {}, ...props }) {
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
    label('pictures'), input({ type: 'file', onchange: loadImage }),
    () => Pictures({ pictures: formData.val.pictures, update: updatePictures }),
    label('tags'), textarea(bind(formData, 'tags')),
    button({ onclick: submit }, 'save')
  );

  async function loadImage(event) {
    const file = event.target.files[0];
    const url = await getLocalUrl(file);
    const picture = { file, url, description: '', unsaved: true };
    updatePictures([...formData.val.pictures, picture]);
  }

  function updatePictures(pictures) {
    formData.val = { ...formData.val, pictures };
  }

  function submit(event) {
    console.debug('[skill form] submit event', event);
    props.onsubmit(formData.val);
  }
}

function Pictures({ pictures, update }) {
  const editing = van.state(null);
  return div({ class: 'mb-4' },
    div({ class: 'flex flex-wrap gap-4' },
      pictures.map((pic) => img({ src: pic.url, class: 'small', onclick: () => editing.val = pic })),
    ),
    () => editing.val ? EditModal({ picture: editing.val, update: updatePicture, close: () => editing.val = null }) : div(),
  );

  function updatePicture(picture) {
    update(pictures.map((p) => (p === editing.val ? picture : p)).filter((p) => !p.deleted));
  }
}

function EditModal({ update, close, ...props }) {
  const picture = van.state(props.picture);
  return div({ class: 'modal', onclick: (e) => e.target === e.currentTarget && close() },
    div(
      () => img({ src: picture.val.url }),
      input({ type: 'file', onchange: loadImage }),
      textarea(bind(picture, 'description')),
      button({ onclick: save }, 'save'),
      button({ class: 'ml-4', onclick: confirmAndDelete }, 'delete'),
      button({ class: 'ml-4', onclick: close }, 'cancel'),
    ),
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

  async function confirmAndDelete() {
    if (confirm('are you sure?')) {
      update({ ...props.picture, deleted: true });
      close()
    }
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

function bind(state, prop = null) {
  return {
    value: () => prop ? state.val[prop] : state.val,
    oninput: (e) => (state.val = prop ? { ...state.oldVal, [prop]: e.target.value } : e.target.value),
  };
}
