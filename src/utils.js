import bcrypt from 'bcrypt'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import multer from 'multer'

// exporto la referencia a la carpeta src
export const __dirname = path.dirname( fileURLToPath( import.meta.url ) )

export const createHash = async ( password ) => {
  return bcrypt.hashSync( password, bcrypt.genSaltSync() )
}

export const isValidPassword = ( password, user ) => {
  return bcrypt.compareSync( password, user.password )
}

const checkValidFields = ( user ) => {
  const { firstName, lastName, email, password } = user
  if ( !firstName || !lastName || !email || !password ) return false
  return true
}

const profileFilter = ( req, file, callback ) => {
  if ( !checkValidFields( req.body ) ) return callback( null, false )
  return callback( null, true )
}

// imagenes de usuarios
const profileStorage = multer.diskStorage( {
  // donde vamos a guardar las imagenes
  destination: function ( req, file, callback ) {
    callback( null, path.join( __dirname, '/assets/users/img' ) )
  },
  // nombre con el que voy a guardar las imagenes
  filename: function ( req, file, callback ) {
    callback( null, `${ req.body.email }-profile-${ file.originalname }` )
  },
} )
// crear el uploader
const uploadProfile = multer( { storage: profileStorage, fileFilter: profileFilter } )

// documentos de usuarios
const documentsStorage = multer.diskStorage( {
  destination: function ( req, file, callback ) {
    callback( null, path.join( __dirname, '/assets/users/docs' ) )
  },
  filename: function ( req, file, callback ) {
    callback( null, `${ req.user.email }-document-${ file.originalname }` )
  }
} )

const uploadDocuments = multer( { storage: documentsStorage } )

// imagenes de productos
const productsStorage = multer.diskStorage( {
  destination: function ( req, file, callback ) {
    callback( null, path.join( __dirname, '/assets/products/img' ) )
  },
  filename: function ( req, file, callback ) {
    callback( null, `${ req.body.code }-product-${ file.originalname }` )
  }
} )
const uploadImgProducts = multer( { storage: productsStorage } )

export { uploadProfile, uploadDocuments, uploadImgProducts }