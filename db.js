import http from './http.js';

const CLUSTER_NAME = 'Cluster0';
const DATABASE_NAME = 'skills';
const COLLECTION_NAME = 'skills';

let accessToken, baseUrl;

const db = {
  async connect({ authUrl, apiKey, ...config }) {
    if (!authUrl) {
      throw new Error('Missing DB auth URL');
    }
    if (!apiKey) {
      throw new Error('Missing DB API key');
    }
    if (!config.baseUrl) {
      throw new Error('Missing DB base URL');
    }
    accessToken = await fetchAccessToken(authUrl, apiKey);
    baseUrl = config.baseUrl;
    // await migrate();
  },
  async findSkills() {
    const { documents } = await req(COLLECTION_NAME, 'find');
    return documents.map((d) => ({ ...d, id: d._id, _id: undefined }));
  },
  async createSkill(data) {
    await req(COLLECTION_NAME, 'insertOne', { document: data });
    console.debug('[database] skill created');
  },
  async getSkill(id) {
    const { document } = await req(COLLECTION_NAME, 'findOne', { filter: { _id: { $oid: id } } });
    console.debug('[database] skill found', document);
    return { ...document, id: document._id };
  },
  async updateSkill(id, data) {
    await req(COLLECTION_NAME, 'updateOne', { filter: { _id: { $oid: id } }, update: { $set: { ...data, _id: undefined, id: undefined } } });
    console.debug('[database] skill updated');
  },
  async deleteSkill(id) {
    await req(COLLECTION_NAME, 'deleteOne', { filter: { _id: { $oid: id } } });
    console.debug('[database] skill deleted');
  },
};

export default db;

async function fetchAccessToken(url, key) {
  console.debug('[database] fetchAccessToken() call');
  const response = await http.postJson({
    url,
    body: { key },
  });
  return response.access_token;
}

async function req(collection, action, body) {
  console.debug('[database] req() call', { body });
  if (!accessToken) {
    throw new Error('[database] missing access token');
  }
  const response = await http.postJson({
    url: `${baseUrl}/action/${action}`,
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
    body: {
      ...body,
      dataSource: CLUSTER_NAME,
      database: DATABASE_NAME,
      collection,
    },
  });
  return response;
}
