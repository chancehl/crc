#!/usr/bin/env node
const fs = require('fs')
const path = require('path')
const prompt = require('prompt-sync')()

const { Logger, parseArgs } = require('./utils')

// Parse arguments
const args = parseArgs()
const name = args.name || 'DEFAULT_NAME'

// Initialize logger
const logger = new Logger({ verbose: args.verbose })

// Generate file/directory metadata
const cwd = process.cwd()
const type = args.type === 'functional' ? 'functional' : 'class'
const extension = args.typescript ? 'ts' : 'js'
const componentFileName = `${name}.${extension}x`
const indexFileName = `index.${extension}`

// Read our template and replace our tokens with the user provided input
const componentTemplate = fs.readFileSync(path.resolve(__dirname, `./templates/${type}-component.${extension}.txt`), { encoding: 'utf-8' })
const indexTemplate = fs.readFileSync(path.resolve(__dirname, `./templates/index.txt`), { encoding: 'utf-8' })

const componentBody = componentTemplate.replace(/COMPONENT_NAME/g, name)
const indexBody = indexTemplate.replace(/COMPONENT_NAME/g, name)

// Write file to location
const destinationDirectory = path.join(cwd, name)
const componentDestination = path.join(destinationDirectory, componentFileName)
const indexDestination = path.join(destinationDirectory, indexFileName)

// Create destination directory
if (!fs.existsSync(destinationDirectory)) {
    fs.mkdirSync(destinationDirectory)
}

// Create desination component & index
if (fs.existsSync(componentDestination) || fs.existsSync(indexDestination)) {
    logger.warn(`A component named ${componentFileName} or an index file already exists at ${componentDestination}.`)

    if (prompt('Would you like to overwrite these files? (y/n):') === 'y') {
        fs.writeFileSync(componentDestination, componentBody)
        fs.writeFileSync(indexDestination, indexBody)
    } else {
        process.exit(1)
    }
} else {
    fs.writeFileSync(componentDestination, componentBody)
    fs.writeFileSync(indexDestination, indexBody)
}

logger.log(`Component created at ${componentDestination}`)
