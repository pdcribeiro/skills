const skills = [];
let id = 1;

const db = {
  async findSkills() {
    return [...skills];
  },
  async createSkill(data) {
    const skill = { id: id++, ...data };
    skills.push(skill);
    console.debug('[dev db] skill created', skill);
    return skill;
  },
  async getSkill(id) {
    const skill = skills.find((s) => s.id === id);
    if (!skill) {
      throw new Error('skill not found');
    }
    console.debug('[dev db] skill found', skill);
    return skill;
  },
  async updateSkill(id, data) {
    const index = skills.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('skill not found');
    }
    const skill = { ...skills[index], ...data };
    skills[index] = skill;
    console.debug('[dev db] skill updated', skill);
    return skill;
  },
  async deleteSkill(id) {
    const index = skills.findIndex((s) => s.id === id);
    if (index === -1) {
      throw new Error('skill not found');
    }
    const skill = skills[index];
    skills.splice(index, 1);
    console.debug('[dev db] skill deleted', skill);
  },
};

// await db.createSkill({ name: 'hip key', description: 'just do it' });

export default db;
