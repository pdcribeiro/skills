const CONFIG_KEY = 'skills-config';
const SKILLS_KEY = 'skills-skills';

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

// await db.createSkill({ name: 'hip key', description: 'just do it' });

function get() {
  return getJson(SKILLS_KEY) ?? [];
}

function set(skills) {
  setJson(SKILLS_KEY, skills);
}

function getJson(key) {
  const json = localStorage.getItem(key);
  return JSON.parse(json);
}

function setJson(key, value) {
  const json = JSON.stringify(value);
  localStorage.setItem(key, json);
}

function getNextId() {
  const config = getJson(CONFIG_KEY) ?? {};
  if (!config.nextId) {
    config.nextId = 1;
  } else {
    config.nextId += 1;
  }
  setJson(CONFIG_KEY, config);
  return config.nextId;
}

export default db;
