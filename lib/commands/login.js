const http = require('http')
const { exec } = require('child_process')
const crypto = require('crypto')
const axios = require('axios')
const ora = require('ora')
const { API_URL, saveCredentials } = require('../config')

const GITHUB_CLI_CLIENT_ID = 'Ov23liad4d8KZeQeD1mC'

function base64url(buffer) {
  return buffer.toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
}

module.exports = async function login() {
  const port = 9876
  const state = crypto.randomBytes(16).toString('hex')
  const codeVerifier = base64url(crypto.randomBytes(64))
  const codeChallenge = base64url(
    crypto.createHash('sha256').update(codeVerifier).digest()
  )

  const redirectUri = `http://127.0.0.1:${port}/callback`


  const authUrl = `https://github.com/login/oauth/authorize?client_id=${GITHUB_CLI_CLIENT_ID}&redirect_uri=${encodeURIComponent(redirectUri)}&scope=user:email&state=${state}`

  const spinner = ora('Waiting for GitHub login...').start()
  console.log(`\nIf browser does not open, visit:\n${authUrl}\n`)

  const server = http.createServer(async (req, res) => {
    const url = new URL(req.url, `http://localhost:${port}`)

    if (url.pathname !== '/callback') {
      res.end('Not found')
      return
    }

    const code = url.searchParams.get('code')
    const returnedState = url.searchParams.get('state')

    res.writeHead(200, { 'Content-Type': 'text/html' })
    res.end('<html><body><h2>Login successful! You can close this tab.</h2></body></html>')
    server.close()

    if (!code || returnedState !== state) {
      spinner.fail('Login failed — invalid state or missing code')
      return
    }

    try {
      spinner.text = 'Completing login...'
      const response = await axios.post(`${API_URL}/auth/cli-callback`, {
        code,
        code_verifier: codeVerifier,
        redirect_uri: redirectUri,
      })

      const { access_token, refresh_token, username } = response.data

      saveCredentials({ access_token, refresh_token, username })
      spinner.succeed(`Logged in as @${username}`)
    } catch (err) {
      spinner.fail('Login failed: ' + (err.response?.data?.detail || err.message))
    }
  })

  server.listen(port, () => {
    if (process.platform === 'win32') {
      exec(`start "" "${authUrl}"`)
    } else if (process.platform === 'darwin') {
      exec(`open "${authUrl}"`)
    } else {
      exec(`xdg-open "${authUrl}"`)
    }
  })

  setTimeout(() => {
    server.close()
    spinner.fail('Login timed out. Please try again.')
    process.exit(1)
  }, 120000)
}