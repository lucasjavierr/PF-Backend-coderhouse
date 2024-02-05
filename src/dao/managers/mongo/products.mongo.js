import { productsModel } from '../../models/products.model.js'

export class ProductsManagerMongo {
  constructor () {
    this.model = productsModel
  }

  async get( query, options ) {
    try {
      const products = await this.model.paginate( query, options )
      return products
    } catch ( error ) {
      console.log( 'DAO PRODUCTS get:', error.message )
      throw new Error( 'Se produjo un error al obtener los productos.' )
    }
  }

  async getById( productId ) {
    try {
      const product = await this.model.findById( productId ).lean()
      return product
    } catch ( error ) {
      console.log( 'DAO PRODUCTS getById:', error.message )
      throw new Error( 'Se produjo un error al buscar el producto.' )
    }
  }

  async create( productInfo ) {
    try {
      const productCreated = await this.model.create( productInfo )
      return productCreated
    } catch ( error ) {
      console.log( 'DAO PRODUCTS create:', error.message )
      throw new Error( 'No se pudo crear el producto.' )
    }
  }

  async update( productId, newProductInfo ) {
    try {
      const productUpdated = await this.model.findByIdAndUpdate(
        productId,
        newProductInfo,
        { new: true }
      )
      return productUpdated
    } catch ( error ) {
      console.log( 'DAO PRODUCTS update:', error.message )
      throw new Error( 'No se pudo actualizar el producto.' )
    }
  }

  async delete( productId ) {
    try {
      const result = await this.model.findByIdAndDelete( productId )
      return result
    } catch ( error ) {
      console.log( 'DAO PRODUCTS delete:', error.message )
      throw new Error( 'No se pudo eliminar el producto.' )
    }
  }
}
