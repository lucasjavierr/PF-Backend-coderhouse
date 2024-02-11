import passport from 'passport'
import LocalStrategy from 'passport-local'
import { createHash, isValidPassword } from '../utils.js'
import { UsersService } from '../services/users.service.js'
import { CartsService } from '../services/carts.service.js'
import { USER_ROLE_TYPES } from '../enums/constants.js'

export const initializePassport = () => {
  passport.use( 'signupLS', new LocalStrategy(
    { passReqToCallback: true, usernameField: 'email' },

    async ( req, username, password, done ) => {
      const { firstName, lastName, age, gender } = req.body
      try {
        if ( !firstName || !lastName || !age || !gender || !username ) return done( null, false )

        const user = await UsersService.getUserByEmail( username )
        // usuario registrado
        if ( user ) return done( null, false )

        // usuario no registrado
        // creo el carrito asociado al usuario creado
        const newCart = await CartsService.createCart()
        // creo al usuario
        const newUser = {
          firstName,
          lastName,
          age,
          gender,
          email: username,
          password: await createHash( password ),
          cart: newCart._id,
          role: username.endsWith( '@coder.com' ) ? USER_ROLE_TYPES.ADMIN : USER_ROLE_TYPES.USER,
          avatar: req?.file?.filename || ''
        }

        const userCreated = await UsersService.createUser( newUser )
        return done( null, userCreated )
      } catch ( error ) {
        return done( error )
      }
    }
  ) )

  passport.use( 'loginLS', new LocalStrategy(
    { usernameField: 'email' },
    async ( username, password, done ) => {
      try {
        if ( !username || !password ) return done( null, false )

        const user = await UsersService.getUserByEmail( username )

        // usuario no existe, no puede loguear
        if ( !user ) return done( null, false )

        // datos incorrectos, no puede loguear
        if ( !isValidPassword( password, user ) ) return done( null, false )

        user.lastConnection = new Date()
        await UsersService.updateUser( user._id, user )

        // datos correctos correctos
        return done( null, user ) // req.user
      } catch ( error ) {
        return done( error )
      }
    }
  ) )

  passport.serializeUser( ( user, done ) => {
    done( null, user._id )
  } )

  passport.deserializeUser( async ( id, done ) => {
    const user = await UsersService.getUserById( id )
    done( null, user )// req.user = informacion del usuario que traemos de la base de datos
  } )
}
