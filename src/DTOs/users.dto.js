import { USER_ROLE_TYPES } from '../enums/constants.js'

export class UsersDto {
  constructor ( user ) {
    this.name = `${ user.firstName } ${ user.lastName }`
    this.email = user.email
    this.avatar = user.avatar
    this.cart = user.cart
    this.role = user.role
    this.isAdmin = user.role === USER_ROLE_TYPES.ADMIN
    this.isPremium = user.role === USER_ROLE_TYPES.PREMIUM
    this.isUser = this.isAdmin === false && this.isPremium === false
  }
}
