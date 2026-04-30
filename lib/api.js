const axios = require('axios')
const { API_URL, getCredentials, saveCredentials, clearCredentials } = require('./config')
async function apiFetch(path, options = {}) {
  const creds = getCredentials()
  const token = creds?.access_token

  try {
    const response = await axios({
      url: `${API_URL}${path}`,
      headers: {
        'X-API-Version': '1',
        ...(token ? { Authorization: `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
      ...options,
    })
    return response.data
  } catch (err) {
    if (err.response?.status === 401) {
      // Try refresh
      const refreshed = await tryRefresh()
      if (refreshed) {
        return apiFetch(path, options)
      } else {
        clearCredentials()
        console.error('Session expired. Please run: insighta login')
        process.exit(1)
      }
    }
    throw err
  }
}

async function tryRefresh() {
  const creds = getCredentials()
  if (!creds?.refresh_token) return false

  try {
    const response = await axios.post(`${API_URL}/auth/refresh`, {
      refresh_token: creds.refresh_token,
    })
    const { access_token, refresh_token } = response.data
    saveCredentials({ ...creds, access_token, refresh_token })
    return true
  } catch {
    return false
  }
}

module.exports = { apiFetch }