#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const prompt = require('prompt-sync')()
const { merge } = require('lodash')

const { Logger, parseArgs } = require('./utils')
const { RUNTIME_CONFIG_FILE } = require('./constants')

// Parse arguments
const args = parseArgs()
const name = args.name
const cwd = process.cwd()

// Initialize logger
const logger = new Logger({ verbose: args.verbose })

// Validate inputs
if (!name) {
    logger.error('Parameter --name not provided. Please specify a name.')
    process.exit(1)
}

// Look for crc.json
let config = { ...args }

const runtimeConfigPath = path.join(cwd, RUNTIME_CONFIG_FILE)

if (fs.existsSync(runtimeConfigPath)) {
    const runtimeConfigContents = fs.readFileSync(runtimeConfigPath, { encoding: 'utf-8' })

    try {
        // Try to parse the user provided config values
        const parsedConfig = JSON.parse(runtimeConfigContents)

        // Merge these with the existing args provided
        merge(config, parsedConfig)
    } catch (ex) {
        logger.warn('Could not parse crc.json file. Input will be taken from command line.')
    }
}

// Generate file/directory metadata
const type = config.class ? 'class' : 'functional'
const extension = config.typescript ? 'ts' : 'js'

const componentFileName = `${name}.${extension}x`
const indexFileName = `index.${extension}`

const template = config.template ? path.join(cwd, config.template) : null

let destinationDir = config.destination || cwd

if (typeof config.createDirectory === 'undefined' || config.createDirectory === true) {
    destinationDir = path.join(destinationDir, name)
}

// Read our template and replace our tokens with the user provided input
const componentDestination = path.join(destinationDir, componentFileName)
const componentTemplate = fs.readFileSync(template || path.resolve(__dirname, `./templates/${type}-component.${extension}.txt`), { encoding: 'utf-8' })
const componentBody = componentTemplate.replace(/COMPONENT_NAME/g, name)

const indexDestination = path.join(destinationDir, indexFileName)
const indexTemplate = fs.readFileSync(path.resolve(__dirname, `./templates/index.txt`), { encoding: 'utf-8' })
const indexBody = indexTemplate.replace(/COMPONENT_NAME/g, name)

// Create destination directory
if (!fs.existsSync(destinationDir)) {
    fs.mkdirSync(destinationDir)
}

// Check to see if component already exists
if (fs.existsSync(componentDestination) || fs.existsSync(indexDestination)) {
    logger.warn(`A component named ${componentFileName} or an index file already exists at ${componentDestination}.`)

    if (prompt('Would you like to overwrite these files? (y/n):') !== 'y') {
        process.exit(1)
    }
}

// Create desination component & index
fs.writeFileSync(componentDestination, componentBody)
fs.writeFileSync(indexDestination, indexBody)

logger.log(`Component created at ${componentDestination}`)
