const { apiFetch } = require('../api')
const { getCredentials } = require('../config')

module.exports = async function whoami() {
  const creds = getCredentials()
  if (!creds) {
    console.log('Not logged in. Run: insighta login')
    return
  }

  try {
    const data = await apiFetch('/auth/me')
    const user = data.data
    console.log(`Logged in as @${user.username}`)
    console.log(`Email:  ${user.email || 'Not provided'}`)
    console.log(`Role:   ${user.role}`)
  } catch {
    console.error('Failed to fetch user info.')
  }
}