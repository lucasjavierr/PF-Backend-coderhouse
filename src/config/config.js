import dotenv from 'dotenv'

dotenv.config()

export const config = {
  server: {
    secretSession: process.env.SECRET_SESSION,
    persistence: process.env.PERSISTENCE,
    env: process.env.NODE_ENV
  },
  mongo: {
    url: process.env.MONGO_URL,
  },
  gmail: {
    account: process.env.ADMIN_GMAIL,
    password: process.env.ADMIN_GMAIL_PASS,
    secretToken: process.env.TOKEN_GMAIL
  },
  admin: {
    id: process.env.ADMIN_ID,
    email: process.env.ADMIN_EMAIL,
  }
}
