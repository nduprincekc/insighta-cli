const os = require('os')
const path = require('path')
const fs = require('fs')

const CREDENTIALS_DIR = path.join(os.homedir(), '.insighta')
const CREDENTIALS_FILE = path.join(CREDENTIALS_DIR, 'credentials.json')
const API_URL = 'https://hng-task-3-05rc.onrender.com'

function getCredentials() {
  try {
    if (!fs.existsSync(CREDENTIALS_FILE)) return null
    const data = fs.readFileSync(CREDENTIALS_FILE, 'utf8')
    return JSON.parse(data)
  } catch {
    return null
  }
}

function saveCredentials(data) {
  if (!fs.existsSync(CREDENTIALS_DIR)) {
    fs.mkdirSync(CREDENTIALS_DIR, { recursive: true })
  }
  fs.writeFileSync(CREDENTIALS_FILE, JSON.stringify(data, null, 2))
}

function clearCredentials() {
  if (fs.existsSync(CREDENTIALS_FILE)) {
    fs.unlinkSync(CREDENTIALS_FILE)
  }
}

module.exports = {
  API_URL,
  getCredentials,
  saveCredentials,
  clearCredentials,
}