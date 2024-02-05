import { UsersDto } from '../DTOs/users.dto.js'
import { UsersService } from '../services/users.service.js'
import { generateEmailToken, sendChangePasswordEmail, verifyEmailToken } from '../helpers/email.js'
import { createHash, isValidPassword } from '../utils.js'
// import { CustomError } from '../services/errors/customError.service.js'
// import { EError } from '../enums/EError.js'
// import { authError } from '../services/errors/authError.service.js'

export class SessionsController {
  static signup = ( req, res ) => {
    res.json( { status: 'success', message: 'Usuario registrado correctamente' } )
  }

  static failSignup = ( req, res ) => {
    return res.json( { status: 'error', message: 'No se pudo registrar al usuario' } )
  }

  static login = ( req, res ) => {
    res.json( { status: 'success', message: 'Iniciaste sesión correctamente' } )
  }

  static failLogin = ( req, res ) => {
    return res.json( { status: 'error', message: 'Correo electrónico o contraseña incorrectos' } )
  }

  static currentUser = ( req, res ) => {
    const userDto = new UsersDto( req.user )
    res.json( { status: 'success', user: userDto } )
  }

  static logout = async ( req, res ) => {
    const user = { ...req.user }
    user.lastConnection = new Date()
    await UsersService.updateUser( user._id, user )
    req.session.destroy( ( err ) => {
      if ( err ) return res.status( 500 ).json( { message: 'No se pudo cerrar la sesión' } )
      res.redirect( '/login' )
    } )
  }

  static forgotPassword = async ( req, res ) => {
    try {
      const { email } = req.body
      // verifico que el usuario exista
      await UsersService.getUserByEmail( email )

      const emailToken = generateEmailToken( email, 10 * 60 )
      await sendChangePasswordEmail( req, email, emailToken )
      res.send( `
          <h3>Se ha enviado un mensaje a tu correo para restablecer la contraseña.</h3>
          <p>Ten en cuenta que el enlace solo estará disponible durante 10 minutos</p>
          <a href="https://mail.google.com">Ir a Gmail</a>
        `)
    } catch ( error ) {
      res.render( 'forgotPassword', { error: 'Se produjo un error al realizar la operación, vuelve a intentarlo en unos minutos' } )
    }
  }

  static resetPassword = async ( req, res, next ) => {
    try {
      const token = req.query.token
      const { newPassword } = req.body

      const validEmail = verifyEmailToken( token )
      if ( !validEmail ) {
        return res.send( `
          <h2>El enlace para restablecer su contraseña ha caducado</h2>
          <a href="/forgot-password">Vuelve a crear el enlace</a>
        `)
      }
      const user = await UsersService.getUserByEmail( validEmail )
      if ( !user ) return res.send( `<h2>No se pudo realizar la operación</h2>` )

      if ( isValidPassword( newPassword, user ) ) res.render( 'resetPassword', { error: 'Contraseña inválida', token } )

      const userData = { ...user, password: await createHash( newPassword ) }
      await UsersService.updateUser( user._id, userData )

      res.render( 'login', { message: 'Contraseña actualizada' } )
    } catch ( error ) {
      res.render( 'resetPassword', { error: 'Se produjo un error al realizar la operación, vuelve a intentarlo en unos minutos', token } )
    }
  }
}
