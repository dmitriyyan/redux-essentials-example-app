// A tiny wrapper around fetch(), borrowed from
// https://kentcdodds.com/blog/replace-axios-with-a-simple-custom-fetch-wrapper

export async function client(
  endpoint: string,
  {
    body,
    ...customConfig
  }: { body?: { [key: string]: any }; [key: string]: any }
) {
  const headers = { 'Content-Type': 'application/json' }

  const config: { [key: string]: any } = {
    method: body ? 'POST' : 'GET',
    ...customConfig,
    headers: {
      ...headers,
      ...customConfig.headers,
    },
  }

  if (body) {
    config.body = JSON.stringify(body)
  }

  let data
  try {
    const response = await window.fetch(endpoint, config)
    data = await response.json()
    if (response.ok) {
      // Return a result object similar to Axios
      return {
        status: response.status,
        data,
        headers: response.headers,
        url: response.url,
      }
    }
    throw new Error(response.statusText)
  } catch (err) {
    if (err instanceof Error) {
      return Promise.reject(err.message ? err.message : data)
    }
  }
}

client.get = function (endpoint: string, customConfig = {}) {
  return client(endpoint, { ...customConfig, method: 'GET' })
}

client.post = function (
  endpoint: string,
  body: { [key: string]: any },
  customConfig = {}
) {
  return client(endpoint, { ...customConfig, body })
}
