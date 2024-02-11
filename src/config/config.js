import dotenv from 'dotenv'
// import { Command } from 'commander'

dotenv.config()

/* const serve = new Command()

serve
  .option( '-p, --persistence <persistence>', 'Tipo de persistencia de datos que utiliza la aplicación' )
  .option( '--env, <environment>', 'Entorno en el cual se ejecuta la aplicación' )

serve.parse()
const options = serve.opts()
process.env.NODE_ENVIRONMENT = options.env
process.env.PERSISTENCE = options.persistence */

export const config = {
  server: {
    secretSession: process.env.SECRET_SESSION,
    persistence: process.env.PERSISTENCE,
    env: process.env.NODE_ENV
  },
  mongo: {
    url: process.env.MONGO_URL,
    urlTest: process.env.MONGO_URL_TEST
  },
  gmail: {
    account: process.env.ADMIN_EMAIL,
    password: process.env.ADMIN_EMAIL_PASS,
    secretToken: process.env.TOKEN_EMAIL
  },
  admin: {
    id: process.env.ADMIN_ID,
    email: process.env.ADMIN_EMAIL,
  }
}
