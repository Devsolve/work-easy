export async function fetchJson(url, options = {}) {
  const { method = 'GET', body } = options
  const init = { method, headers: { 'Content-Type': 'application/json' } }
  const res = await fetch(url, body ? { ...init, body: JSON.stringify(body) } : init)
  return res.json()
}