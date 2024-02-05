import { usersDao } from '../dao/factory.js'

export class UsersService {
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
