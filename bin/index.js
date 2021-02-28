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
const createStories = config.stories ? true : false
const createModule = config.css ? true : false

const componentFileName = `${name}.${extension}x`
const indexFileName = `index.${extension}`
const storyFileName = `${name}.stories.${extension}x`
const moduleFileName = `${name}.module.css`

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

const storyDestination = path.join(destinationDir, storyFileName)
const storyTemplate = fs.readFileSync(path.resolve(__dirname, `./templates/stories.${extension}.txt`), { encoding: 'utf-8' })
const storyBody = storyTemplate.replace(/COMPONENT_NAME/g, name)

const moduleDestination = path.join(destinationDir, moduleFileName)
const moduleTemplate = fs.readFileSync(path.resolve(__dirname, `./templates/css.module.txt`), { encoding: 'utf-8' })
const moduleBody = moduleTemplate.replace(/COMPONENT_NAME/g, name)

// Create destination directory
if (!fs.existsSync(destinationDir)) {
    try {
        fs.mkdirSync(destinationDir)
    } catch (ex) {
        logger.error(`Encountered an error while creating destination directory at ${destinationDir}.\n${ex}`)
        process.exit(1)
    }
}

// Check to see if component already exists
if (fs.existsSync(componentDestination) || fs.existsSync(indexDestination)) {
    logger.warn(`A component named ${componentFileName} or an index file already exists at ${componentDestination}.`)

    if (prompt('Would you like to overwrite these files? (y/n):') !== 'y') {
        logger.log('Terminating')
        process.exit(1)
    }
}

// Check to see if stories already exist
if (createStories && fs.existsSync(storyDestination)) {
    logger.warn(`Stories for a component named ${storyFileName} already exists at ${storyDestination}.`)

    if (prompt('Would you like to overwrite these files? (y/n):') !== 'y') {
        logger.log('Terminating')
        process.exit(1)
    }
}

// Check to see if stories already exist
if (createModule && fs.existsSync(moduleDestination)) {
    logger.warn(`A css module file for a component named ${moduleFileName} already exists at ${moduleDestination}.`)

    if (prompt('Would you like to overwrite these files? (y/n):') !== 'y') {
        logger.log('Terminating')
        process.exit(1)
    }
}

// Create desination component & index
try {
    fs.writeFileSync(componentDestination, componentBody)
    fs.writeFileSync(indexDestination, indexBody)

    if (createStories) fs.writeFileSync(storyDestination, storyBody)
    if (createModule) fs.writeFileSync(moduleDestination, moduleBody)
} catch (ex) {
    logger.error(`Encountered an error while creating component or index file at ${componentDestination}.\n${ex}`)
    process.exit(1)
}

logger.log(`Component created at ${componentDestination}`)
