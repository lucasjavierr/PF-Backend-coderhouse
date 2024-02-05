import { EError } from '../enums/EError.js'

export const errorHandler = ( error, req, res, next ) => {
  switch ( error.code ) {
    case EError.DATABASE_ERROR:
      res.json( { status: 'error', error: error.message, cause: error.cause } )
      break

    case EError.AUTH_ERROR:
      res.json( { status: 'error', error: error.message, cause: error.cause } )
      break

    case EError.INVALID_BODY_JSON:
      res.json( { status: 'error', error: error.message, cause: error.cause } )
      break

    case EError.INVALID_PARAM:
      res.json( { status: 'error', error: error.message, cause: error.cause } )
      break

    default:
      res.json( { status: 'error', error: 'Error desconocido', cause: error.cause } )
      break
  }
}
