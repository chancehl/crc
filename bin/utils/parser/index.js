const { argv } = require('yargs')
const { omit } = require('lodash')

const parseArgs = () => omit(argv, ['_', '$0'])

module.exports = parseArgs
