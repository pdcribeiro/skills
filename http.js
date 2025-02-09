export default {
  async postJson({ url, body, query = null, headers = null }) {
    console.debug('[http] postJson() call');
    let fullUrl = url;
    if (query) {
      fullUrl += '?' + new URLSearchParams(query).toString()
    }
    const response = await fetch(fullUrl, {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        ...headers,
      },
      body: JSON.stringify(body),
    });
    const json = await response.json();
    return json;
  },
};
