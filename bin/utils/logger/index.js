const Colors = require('colors')

class Logger {
    constructor(opts) {
        this.opts = opts
    }

    debug = (msg) => {
        if (this.opts.verbose) {
            console.log(Colors.magenta(msg))
        }
    }

    info = (msg) => {
        if (this.opts.verbose) {
            console.log(Colors.cyan(msg))
        }
    }

    warn = (msg) => console.log(Colors.yellow(msg))

    error = (msg) => console.log(Colors.red(msg))

    log = (msg) => console.log(Colors.green(msg))
}

module.exports = Logger
