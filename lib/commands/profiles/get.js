const { apiFetch } = require('../../api')
const ora = require('ora')

module.exports = async function get(id) {
  const spinner = ora('Fetching profile...').start()

  try {
    const data = await apiFetch(`/api/profiles/${id}`)
    spinner.stop()

    const p = data.data
    console.log('\n')
    console.log(`Name:               ${p.name}`)
    console.log(`Gender:             ${p.gender} (${(p.gender_probability * 100).toFixed(0)}% confidence)`)
    console.log(`Age:                ${p.age}`)
    console.log(`Age Group:          ${p.age_group}`)
    console.log(`Country:            ${p.country_name} (${p.country_id})`)
    console.log(`Country Confidence: ${(p.country_probability * 100).toFixed(0)}%`)
    console.log(`Created:            ${p.created_at}`)
    console.log('\n')
  } catch (err) {
    spinner.fail('Failed to fetch profile')
    console.error(err.response?.data?.detail || err.message)
  }
}