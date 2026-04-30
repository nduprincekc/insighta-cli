const axios = require('axios')
const { API_URL, getCredentials, clearCredentials } = require('../config')

module.exports = async function logout() {
  const creds = getCredentials()

  if (!creds) {
    console.log('You are not logged in.')
    return
  }

  try {
    await axios.post(`${API_URL}/auth/logout`, {
      refresh_token: creds.refresh_token,
    })
  } catch {}

  clearCredentials()
  console.log('Logged out successfully.')
}