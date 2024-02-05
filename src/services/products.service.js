import { productsDao } from '../dao/factory.js'
import { v4 as uuidv4 } from 'uuid'

export class ProductsService {
  static getAllProducts = async ( query, options ) => {
    return productsDao.get( query, options )
  }

  static getOneProduct = async ( productId ) => {
    return productsDao.getById( productId )
  }

  static createProduct = async ( productInfo ) => {
    productInfo.code = uuidv4()
    return productsDao.create( productInfo )
  }

  static updateProductInfo = async ( productId, newProductInfo ) => {
    return productsDao.update( productId, newProductInfo )
  }

  static deleteProduct = async ( productId ) => {
    return productsDao.delete( productId )
  }
}
