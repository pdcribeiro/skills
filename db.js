import http from './http.js';
import kvstore from './kvstore.js';

const AUTH_TOKENS_STORE_KEY = 'skills-database-auth-tokens';
const _30_MINUTES_IN_MS = 30 * 60 * 1000;
const _60_DAYS_IN_MS = 60 * 24 * 60 * 60 * 1000;
const REFRESH_INTERVAL_FACTOR = 0.97
const ACCESS_TOKEN_LIFETIME = _30_MINUTES_IN_MS * REFRESH_INTERVAL_FACTOR;
const REFRESH_TOKEN_LIFETIME = _60_DAYS_IN_MS * REFRESH_INTERVAL_FACTOR;
const REFRESH_ENDPOINT_PATH = '/api/client/v2.0/auth/session'

const CLUSTER_NAME = 'Cluster0';
const DATABASE_NAME = 'skills';
const COLLECTION_NAME = 'skills';

let config, authTokens;

const db = {
  async connect(config_) {
    if (!config_.authUrl) {
      throw new Error('Missing DB auth URL');
    }
    if (!config_.apiKey) {
      throw new Error('Missing DB API key');
    }
    if (!config_.baseUrl) {
      throw new Error('Missing DB base URL');
    }
    config = config_

    authTokens = kvstore.get(AUTH_TOKENS_STORE_KEY)
    if (!authTokens || Date.now() > authTokens.refreshToken.expiresAt) {
      await fetchAuthTokens();
    } else if (Date.now() > authTokens.accessToken.expiresAt) {
      await refreshAccessToken();
    }
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
    console.debug('[database] skill found');
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

async function fetchAuthTokens() {
  console.debug('[database] fetchAuthTokens() call');
  const response = await http.postJson({
    url: config.authUrl,
    body: { key: config.apiKey },
  });
  authTokens = {
    accessToken: getAccessTokenWithExpiration(response.access_token),
    refreshToken: {
      token: response.refresh_token,
      expiresAt: Date.now() + REFRESH_TOKEN_LIFETIME,
    }
  };
  kvstore.set(AUTH_TOKENS_STORE_KEY, authTokens)
  setTimeout(REFRESH_TOKEN_LIFETIME, fetchAuthTokens)
}

async function refreshAccessToken() {
  console.debug('[database] refreshAccessToken() call');
  const response = await http.postJson({
    url: new URL(config.authUrl).origin + REFRESH_ENDPOINT_PATH,
    headers: {
      Authorization: `Bearer ${authTokens.refreshToken.token}`
    }
  });
  if (!response.access_token) {
    throw new Error('[database] failed to refresh access token')
  }
  authTokens.accessToken = getAccessTokenWithExpiration(response.access_token)
  kvstore.set(AUTH_TOKENS_STORE_KEY, authTokens)
  setTimeout(ACCESS_TOKEN_LIFETIME, refreshAccessToken)
}

function getAccessTokenWithExpiration(token) {
  return {
    token,
    expiresAt: Date.now() + ACCESS_TOKEN_LIFETIME,
  }
}

async function req(collection, action, body) {
  console.debug('[database] req() call', { body });
  if (!config || !authTokens) {
    throw new Error('[database] not connected');
  }
  const response = await http.postJson({
    url: `${config.baseUrl}/action/${action}`,
    headers: {
      Authorization: `Bearer ${authTokens.accessToken.token}`,
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
