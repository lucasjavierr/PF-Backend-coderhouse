import mongoose from 'mongoose'
import { config } from './config.js'
import { logger } from '../helpers/logger.js'

export const connectDB = async () => {
  try {
    await mongoose.connect( config.mongo.url )
    logger.info( 'Base de datos conectada correctamente' )
    console.log( 'http://localhost:8080/login' )
  } catch ( error ) {
    logger.fatal( `Hubo un error al conectarse a la base de datos: ${ error }` )
  }
}
