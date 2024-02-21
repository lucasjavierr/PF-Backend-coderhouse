import { usersDao } from '../dao/factory.js'
import { UsersDto } from '../DTOs/users.dto.js'

export class UsersService {
  static getAllUsers = async () => {
    const usersDB = await usersDao.get()
    let users = []
    usersDB.forEach( u => {
      const user = new UsersDto( u )
      users.push( user )
    } );
    return users
  }
  static getUserById = async ( userId ) => {
    return usersDao.getById( userId )
  }

  static getUserByEmail = async ( userEmail ) => {
    return usersDao.getByEmail( userEmail )
  }

  static createUser = async ( userInfo ) => {
    return usersDao.create( userInfo )
  }

  static updateUser = async ( id, newUserInfo ) => {
    return usersDao.update( id, newUserInfo )
  }
}
