import { __dirname } from '../utils.js'
import swaggerJSDoc from 'swagger-jsdoc'
import path from 'node:path'

const swaggerOptions = {
  definition: {
    openapi: '3.0.1',
    info: {
      title: 'Documentacion API de Component Hardware',
      version: '1.0.0',
      description: 'Definicion de endpoints de API de un ecommerce'
    }
  },
  apis: [ `${ path.join( __dirname, '/docs/**/*.yaml' ) }` ]
}

export const swaggerSpecs = swaggerJSDoc( swaggerOptions )

