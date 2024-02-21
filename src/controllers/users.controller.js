import { CustomError } from '../services/errors/customError.service.js'
import { EError } from '../enums/EError.js'
import { UsersService } from '../services/users.service.js'
import { userIdParamError } from '../services/errors/invalidParamError.service.js'
import { USER_ROLE_TYPES } from '../enums/constants.js'
import { UsersDto } from '../DTOs/users.dto.js'

export class UsersController {

  static getAllUsers = async ( req, res, next ) => {
    try {
      const users = await UsersService.getAllUsers()
      res.json( { status: 'success', data: users } )
    } catch ( error ) {
      next( error )
    }
  }

  static getUser = async ( req, res, next ) => {
    try {
      const { userId } = req.params
      if ( Number.isNaN( parseInt( userId ) ) ) {
        CustomError.createError( {
          name: 'Get user error',
          cause: userIdParamError( userId ),
          message: 'ID invalido',
          errorCode: EError.INVALID_PARAM
        } )
      }
      const user = await UsersService.getUserById( userId )
      res.json( { status: 'success', data: user } )
    } catch ( error ) {
      next( error )
    }
  }

  static modifyRole = async ( req, res ) => {
    try {
      const userId = req.params.userId
      const user = await UsersService.getUserById( userId )

      // validar que el usuario haya subido todos los documentos
      if ( user.status !== 'completo' ) return res.json( { status: 'error', message: 'El usuario no ha subido todos los documentos' } )

      if ( user.role === USER_ROLE_TYPES.PREMIUM ) {
        user.role = USER_ROLE_TYPES.USER
      } else if ( user.role === USER_ROLE_TYPES.USER ) {
        user.role = USER_ROLE_TYPES.PREMIUM
      } else {
        return res.json( { status: 'error', message: 'No se puede actualizar el rol del usuario' } )
      }

      await UsersService.updateUser( user._id, user )
      res.json( { status: 'success', message: 'Rol de usuario modificado correctamente' } )
    } catch ( error ) {
      next( error )
    }
  }

  static uploadDocuments = async ( req, res ) => {
    try {
      const userId = req.params.userId
      const user = await UsersService.getUserById( userId )
      const identificación = req.files[ 'identificacion' ]?.[ 0 ] || null
      const domicilio = req.files[ 'domicilio' ]?.[ 0 ] || null
      const estadoDeCuenta = req.files[ 'estadoDeCuenta' ]?.[ 0 ] || null

      const docs = []
      if ( identificación ) {
        docs.push( { name: 'identificación', reference: identificación.filename } )
      }
      if ( domicilio ) {
        docs.push( { name: 'domicilio', reference: domicilio.filename } )
      }
      if ( estadoDeCuenta ) {
        docs.push( { name: 'estadoDeCuenta', reference: estadoDeCuenta.filename } )
      }
      user.documents = docs
      if ( docs.length < 3 ) {
        user.status = 'incompleto'
      } else {
        user.status = 'completo'
      }

      await UsersService.updateUser( user._id, user )
      res.json( { status: 'success', message: 'Documentos actualizados' } )
    } catch ( error ) {
      res.json( { status: 'error', message: error.message } )
    }
  }
}
