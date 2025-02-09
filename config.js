import kvstorage from './kvstorage.js';

const CONFIG_KEY = 'skills-config';
const DEFAULT_CONFIG = {
  appearance: {
    darkMode: false,
  },
  database: {
    authUrl: '',
    apiKey: '',
    baseUrl: '',
  },
};

export default {
  load() {
    return kvstorage.get(CONFIG_KEY) ?? DEFAULT_CONFIG;
  },
  save(config) {
    kvstorage.set(CONFIG_KEY, config)
  },
};
