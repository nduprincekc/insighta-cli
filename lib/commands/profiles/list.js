const { apiFetch } = require('../../api')
const Table = require('cli-table3')
const ora = require('ora')

module.exports = async function list(options) {
  const spinner = ora('Fetching profiles...').start()

  try {
    const params = new URLSearchParams()
    if (options.gender) params.append('gender', options.gender)
    if (options.country) params.append('country_id', options.country)
    if (options.ageGroup) params.append('age_group', options.ageGroup)
    if (options.minAge) params.append('min_age', options.minAge)
    if (options.maxAge) params.append('max_age', options.maxAge)
    if (options.sortBy) params.append('sort_by', options.sortBy)
    if (options.order) params.append('order', options.order)
    if (options.page) params.append('page', options.page)
    if (options.limit) params.append('limit', options.limit)

    const data = await apiFetch(`/api/profiles?${params}`)

    spinner.stop()

    const table = new Table({
      head: ['Name', 'Gender', 'Age', 'Age Group', 'Country'],
      colWidths: [25, 10, 6, 12, 10],
    })

    data.data.forEach(p => {
      table.push([p.name, p.gender, p.age, p.age_group, p.country_id])
    })

    console.log(table.toString())
    console.log(`\nPage ${data.page} of ${data.total_pages} | Total: ${data.total}`)
  } catch (err) {
    spinner.fail('Failed to fetch profiles')
    console.error(err.response?.data?.detail || err.message)
  }
}