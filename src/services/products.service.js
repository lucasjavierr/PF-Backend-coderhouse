import { productsDao } from '../dao/factory.js'

export class ProductsService {
  static getAllProducts = async ( query, options ) => {
    return productsDao.get( query, options )
  }

  static getOneProduct = async ( productId ) => {
    return productsDao.getById( productId )
  }

  static createProduct = async ( productInfo ) => {
    return productsDao.create( productInfo )
  }

  static updateProductInfo = async ( productId, newProductInfo ) => {
    return productsDao.update( productId, newProductInfo )
  }

  static deleteProduct = async ( productId ) => {
    return productsDao.delete( productId )
  }
}
