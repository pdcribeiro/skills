import van from './third-party/van.js';
import db from './db.js';
import Modal from './components/Modal.js';
import configHelper from './config.js';
import HomePage from './pages/HomePage.js';
import SkillCreatePage from './pages/SkillCreatePage.js';
import SkillDetailsPage from './pages/SkillDetailsPage.js';
import SkillEditPage from './pages/SkillEditPage.js';
import SkillListPage from './pages/SkillListPage.js';
import { getRouteHelpers, getRouter } from './routing.js';
import { bind } from './utils.js';

const { button, div, h1, h2, input, label } = van.tags;

export const routes = getRouteHelpers({
  home: '#!/',
  skillList: '#!/skills',
  skillCreate: '#!/skills/create',
  skillDetails: '#!/skills/:param',
  skillEdit: '#!/skills/:param/edit',
});

const router = getRouter({
  [routes.home()]: HomePage,
  [routes.skillList()]: SkillListPage,
  [routes.skillCreate()]: SkillCreatePage,
  [routes.skillDetails()]: SkillDetailsPage,
  [routes.skillEdit()]: SkillEditPage,
})

export function app() {
  const configOpen = van.state(false)
  const config = van.state(configHelper.load())
  const connected = van.state(false);
  init();

  return div(
    () => connected.val ? router() : div(),
    button({ class: 'small float-right my-4', onclick: () => configOpen.val = true }, 'settings'),
    () => configOpen.val ? ConfigModal({ config, connectToDatabase, close: () => configOpen.val = false }) : div(),
  )

  async function init() {
    if (config.val) {
      setDarkMode(config.val.appearance.darkMode);
      await connectToDatabase();
    }
  }

  async function connectToDatabase() {
    try {
      await db.connect(config.val.database);
      connected.val = true;
    } catch (e) {
      console.error(e)
      connected.val = false;
    }
  }
}

function ConfigModal({ config, close, ...props }) {
  return Modal({ class: 'w-full max-w-200', close },
    h1('configuration'),
    h2('appearance'),
    button({ onclick: toggleDarkMode }, 'toggle dark mode'),
    h2('database'),
    label('auth url'), input(bind(config, 'database', 'authUrl')),
    label('api key'), input(bind(config, 'database', 'apiKey')),
    label('base url'), input(bind(config, 'database', 'baseUrl')),
    button({ onclick: connectToDatabase }, 'connect')
  )

  function toggleDarkMode() {
    config.val = { ...config.val, appearance: { darkMode: !config.val.appearance.darkMode } }
    configHelper.save(config.val);
    setDarkMode(config.val.appearance.darkMode)
  }

  async function connectToDatabase() {
    configHelper.save(config.val);
    await props.connectToDatabase();
  }
}

function setDarkMode(enabled) {
  const darkColor = getCssVar('--color-dark');
  const lightColor = getCssVar('--color-light');
  setCssVar('--bg-color', enabled ? darkColor : lightColor);
  setCssVar('--color', enabled ? lightColor : darkColor);
}

function getCssVar(name) {
  return window.getComputedStyle(document.documentElement).getPropertyValue(name);
}

function setCssVar(name, value) {
  document.documentElement.style.setProperty(name, value);
}
