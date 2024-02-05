import { cartsDao } from '../dao/factory.js'

export class CartsService {
  static getAllCarts = async () => {
    return cartsDao.get()
  }

  static getOneCart = async ( cartId ) => {
    return cartsDao.getById( cartId )
  }

  static createCart = async () => {
    return cartsDao.create()
  }

  static addProductToCart = async ( cartId, productId ) => {
    return cartsDao.addProduct( cartId, productId )
  }

  static updateCartInfo = async ( cartId, newCartInfo ) => {
    return cartsDao.update( cartId, newCartInfo )
  }

  static updateProductQuantity = async ( cartId, productId, newQuantity ) => {
    return cartsDao.updateQty( cartId, productId, newQuantity )
  }

  static deleteProductFromCart = async ( cartId, productId ) => {
    return cartsDao.deleteProduct( cartId, productId )
  }

  static clearCart = async ( cartId ) => {
    return cartsDao.clear( cartId )
  }

  static deleteCart = async ( cartId ) => {
    return cartsDao.deleteAll( cartId )
  }
}
