const axios = require('axios')
const fs = require('fs')
const path = require('path')
const ora = require('ora')
const { API_URL, getCredentials } = require('../../config')

module.exports = async function exportProfiles(options) {
  const spinner = ora('Exporting profiles...').start()

  const creds = getCredentials()
  if (!creds) {
    spinner.fail('Not logged in. Run: insighta login')
    return
  }

  try {
    const params = new URLSearchParams({ format: options.format || 'csv' })
    if (options.gender) params.append('gender', options.gender)
    if (options.country) params.append('country_id', options.country)

    const response = await axios.get(
      `${API_URL}/api/profiles/export?${params}`,
      {
        headers: {
          'X-API-Version': '1',
          Authorization: `Bearer ${creds.access_token}`,
        },
        responseType: 'stream',
      }
    )

    const timestamp = new Date().toISOString().replace(/[:.]/g, '-')
    const filename = `profiles_${timestamp}.csv`
    const filepath = path.join(process.cwd(), filename)

    const writer = fs.createWriteStream(filepath)
    response.data.pipe(writer)

    writer.on('finish', () => {
      spinner.succeed(`Exported to ${filepath}`)
    })

    writer.on('error', () => {
      spinner.fail('Export failed')
    })
  } catch (err) {
    spinner.fail('Export failed')
    console.error(err.response?.data?.detail || err.message)
  }
}