import { config } from '../config/config.js'
import jwt from 'jsonwebtoken'
import { transporter } from '../config/email.js'

export const generateEmailToken = ( email, expireTime ) => {
  const token = jwt.sign( { email }, config.gmail.secretToken, { expiresIn: expireTime } )
  return token
}

export const sendChangePasswordEmail = async ( req, userEmail, token ) => {
  const domain = `${ req.protocol }://${ req.get( 'host' ) }`
  const link = `${ domain }/reset-password?token=${ token }` // enlace con el token

  // enviamos el correo con el enlace
  await transporter.sendMail( {
    from: 'Component Hardware',
    to: userEmail,
    subject: 'Restablecer contraseña (mor toi haciendo pruebas con tu correo sorry xd)',
    html: `
      <div>
        <h2>Hola!!</h2>
        <p>Has solicitado restablecer tu contraseña, haz click en el siguiente enlace
          <a href='${ link }'>
            para restablecer tu contraseña.
          </a>
        </p>
      </div>
    `
  } )
}

export const verifyEmailToken = ( token ) => {
  try {
    const info = jwt.verify( token, config.gmail.secretToken )
    return info.email
  } catch ( error ) {
    console.log( error.message )
    return null
  }
}
