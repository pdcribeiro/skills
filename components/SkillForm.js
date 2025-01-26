import van from '/third-party/van-1.5.3.debug.js';

const { button, div, form, input, label, li, textarea, ul, img } = van.tags;

export function SkillForm({ initialData = {}, ...props }) {
  const formData = van.state({
    name: '',
    description: '',
    pictures: [],
    tags: '',
    ...initialData.val,
  });

  return form({ onsubmit },
    label('name'), input(bind(formData, 'name')),
    label('description'), textarea(bind(formData, 'description')),
    label('pictures'), () => Pictures({ pictures: formData.val.pictures, update: updatePictures }),
    label('tags'), textarea(bind(formData, 'tags')),
    button('save')
  );

  function onsubmit(event) {
    event.preventDefault();
    console.debug('[skill form] submit event', event);

    return props.onsubmit(formData.val);
  }

  function updatePictures(pictures) {
    formData.val = { ...formData.val, pictures };
  }
}

function bind(state, prop) {
  return {
    value: () => state.val[prop],
    oninput: (e) => (state.val = { ...state.oldVal, [prop]: e.target.value }),
  };
}

function Pictures({ pictures, update }) {
  const replacing = van.state(null);
  const fileInput = input({ type: 'file', onchange: loadImage });
  return div(
    fileInput,
    ul(pictures.map((pic) => li(img({ src: pic.url, onclick: () => replace(pic) }))))
  );

  async function loadImage(event) {
    const file = event.target.files[0];
    const url = await getLocalUrl(file);
    const picture = { file, url, unsaved: true };
    if (replacing.val) {
      update(pictures.map((p) => (p === replacing.val ? picture : p)))
      replacing.val = null;
    } else {
      update([...pictures, picture])
    }
  }

  function replace(pic) {
    replacing.val = pic;
    fileInput.click();
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
