const { apiFetch } = require('../../api')
const Table = require('cli-table3')
const ora = require('ora')

module.exports = async function search(query) {
  const spinner = ora('Searching profiles...').start()

  try {
    const data = await apiFetch(`/api/profiles/search?q=${encodeURIComponent(query)}`)
    spinner.stop()

    if (!data.data || data.data.length === 0) {
      console.log('No profiles found.')
      return
    }

    const table = new Table({
      head: ['Name', 'Gender', 'Age', 'Age Group', 'Country'],
      colWidths: [25, 10, 6, 12, 10],
    })

    data.data.forEach(p => {
      table.push([p.name, p.gender, p.age, p.age_group, p.country_id])
    })

    console.log(table.toString())
    console.log(`\nTotal: ${data.total}`)
  } catch (err) {
    spinner.fail('Search failed')
    console.error(err.response?.data?.detail || err.message)
  }
}