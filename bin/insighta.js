#!/usr/bin/env node
const { program } = require('commander')

program
  .name('insighta')
  .description('Insighta Labs CLI')
  .version('1.0.0')

// Auth commands
program
  .command('login')
  .description('Login with GitHub')
  .action(require('../lib/commands/login'))

program
  .command('logout')
  .description('Logout')
  .action(require('../lib/commands/logout'))

program
  .command('whoami')
  .description('Show current user')
  .action(require('../lib/commands/whoami'))

// Profiles commands
const profiles = program.command('profiles').description('Manage profiles')

profiles
  .command('list')
  .description('List profiles')
  .option('--gender <gender>', 'Filter by gender')
  .option('--country <country>', 'Filter by country code')
  .option('--age-group <ageGroup>', 'Filter by age group')
  .option('--min-age <minAge>', 'Minimum age')
  .option('--max-age <maxAge>', 'Maximum age')
  .option('--sort-by <sortBy>', 'Sort by field')
  .option('--order <order>', 'Sort order (asc/desc)')
  .option('--page <page>', 'Page number')
  .option('--limit <limit>', 'Results per page')
  .action(require('../lib/commands/profiles/list'))

profiles
  .command('get <id>')
  .description('Get profile by ID')
  .action(require('../lib/commands/profiles/get'))

profiles
  .command('search <query>')
  .description('Search profiles using natural language')
  .action(require('../lib/commands/profiles/search'))

profiles
  .command('create')
  .description('Create a new profile (admin only)')
  .requiredOption('--name <name>', 'Profile name')
  .action(require('../lib/commands/profiles/create'))

profiles
  .command('export')
  .description('Export profiles to CSV')
  .option('--format <format>', 'Export format', 'csv')
  .option('--gender <gender>', 'Filter by gender')
  .option('--country <country>', 'Filter by country code')
  .action(require('../lib/commands/profiles/export'))

program.parse(process.argv)