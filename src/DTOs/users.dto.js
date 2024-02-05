import { USER_ROLE_TYPES } from '../enums/constants.js'

export class UsersDto {
  constructor ( user ) {
    this.name = `${ user.firstName } ${ user.lastName }`
    this.email = user.email
    this.cart = user.cart
    this.role = user.role
    this.isAdmin = user.role === USER_ROLE_TYPES.ADMIN
  }
}
