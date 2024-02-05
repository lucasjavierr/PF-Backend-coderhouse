import { usersModel } from '../../models/users.model.js'

export class UsersManagerMongo {
  constructor () {
    this.model = usersModel
  }

  async getById( userId ) {
    try {
      const user = await this.model.findById( userId ).lean()
      return user
    } catch ( error ) {
      console.log( 'DAO USERS getById:', error.message )
      throw new Error(
        'Se produjo un error al obtener la información del usuario.'
      )
    }
  }

  async getByEmail( userEmail ) {
    try {
      const user = await this.model.findOne( { email: userEmail } ).lean()
      return user
    } catch ( error ) {
      console.log( 'DAO PRODUCTS getByEmail:', error.message )
      throw new Error(
        'Se produjo un error al obtener la información del usuario.'
      )
    }
  }

  async create( userInfo ) {
    try {
      const userCreated = await this.model.create( userInfo )
      return userCreated
    } catch ( error ) {
      console.log( 'DAO USERS create', error.message )
      throw new Error( 'Se produjo un error al momento de crear el usuario' )
    }
  }

  async update( id, newInfo ) {
    try {
      const result = await this.model.findByIdAndUpdate( id, newInfo, { new: true } )
      return result
    } catch ( error ) {
      console.log( 'DAO USERS update', error.message )
      throw new Error( 'Se produjo un error al modificar el usuario' )
    }
  }
}
