import winston from 'winston'
import { __dirname } from '../utils.js'
import path from 'node:path'
import { config } from '../config/config.js'

const currentEnv = config.server.env

const customLevels = {
  levels: {
    fatal: 0,
    error: 1,
    warning: 2,
    info: 3,
    http: 4,
    debug: 5
  },
  colors: {
    fatal: 'red',
    error: 'orange',
    warning: 'yellow',
    info: 'blue',
    http: 'gray',
    debug: 'magenta'
  }
}

let logger

winston.addColors( customLevels.colors )
const devLogger = winston.createLogger( {
  levels: customLevels.levels,
  transports: [
    new winston.transports.Console( { level: 'debug' } )
  ]
} )

const prodLogger = winston.createLogger( {
  levels: customLevels.levels,
  transports: [
    new winston.transports.File( { filename: path.join( __dirname, '/logs/errors.log' ), level: 'info' } )
  ]
} )

if ( currentEnv !== 'production' ) {
  logger = devLogger
} else {
  logger = prodLogger
}

export { logger }
