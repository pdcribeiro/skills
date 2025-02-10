import kvstore from './kvstore.js';

const CONFIG_KEY = 'skills-database-config';
const COLLECTION_KEY = 'skills-database-collection';

const db = {
  async findSkills() {
    return get();
  },
  async createSkill(data) {
    const skills = get();
    const skill = { id: getNextId(), ...data };
    skills.push(skill);
    set(skills);
    console.debug('[dev db] skill created', skill);
    return skill;
  },
  async getSkill(id) {
    const skill = get().find((s) => s.id === id);
    if (!skill) {
      throw new Error('skill not found');
    }
    console.debug('[dev db] skill found', skill);
    return skill;
  },
  async updateSkill(id, data) {
    const skills = get();
    const index = skills.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('skill not found');
    }
    const skill = { ...skills[index], ...data };
    skills[index] = skill;
    set(skills);
    console.debug('[dev db] skill updated', skill);
    return skill;
  },
  async deleteSkill(id) {
    const skills = get();
    const index = skills.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('skill not found');
    }
    const skill = skills[index];
    skills.splice(index, 1);
    set(skills);
    console.debug('[dev db] skill deleted', skill);
  },
};

window.migrateDb = function (callback) {
  const skills = get();
  const migrated = callback(skills);
  set(migrated);
}

function get() {
  return kvstore.get(COLLECTION_KEY) ?? [];
}

function set(skills) {
  kvstore.set(COLLECTION_KEY, skills);
}

function getNextId() {
  const config = kvstore.get(CONFIG_KEY) ?? {};
  if (!config.nextId) {
    config.nextId = 1;
  } else {
    config.nextId += 1;
  }
  kvstore.set(CONFIG_KEY, config);
  return config.nextId;
}

export default db;


// MIGRATIONS

// migrateDb(skills => skills.map(s => ({...s, pictures: s.pictures.map(pic => ({...pic, description: pic.description ?? ''}))})))


// SEEDS

// await db.createSkill({ name: 'effleurage', description: 'lorem ipsum', images: [], tags: [] });

// import seeds from './seeds.json'
// localStorage.setItem(CONFIG_KEY, seeds.config)
// localStorage.setItem(COLLECTION_KEY, seeds.skills)
