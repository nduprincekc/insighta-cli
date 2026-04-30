const { apiFetch } = require('../../api')
const ora = require('ora')

module.exports = async function create(options) {
  const spinner = ora(`Creating profile for "${options.name}"...`).start()

  try {
    const data = await apiFetch('/api/profiles', {
      method: 'POST',
      data: { name: options.name },
    })

    spinner.succeed('Profile created!')
    const p = data.data
    console.log(`\nName:     ${p.name}`)
    console.log(`Gender:   ${p.gender}`)
    console.log(`Age:      ${p.age}`)
    console.log(`Country:  ${p.country_name}`)
  } catch (err) {
    spinner.fail('Failed to create profile')
    console.error(err.response?.data?.detail || err.message)
  }
}