import { cartsModel } from '../../models/carts.model.js'

export class CartsManagerMongo {
  constructor () {
    this.model = cartsModel
  }

  // obtiene todos los carritos
  async get() {
    try {
      const carts = await this.model
        .find()
        .populate( 'products.productId' )
        .lean()

      if ( carts.length === 0 ) {
        throw new Error( 'No hay carritos creados hasta el momento.' )
      }

      return carts
    } catch ( error ) {
      console.log( 'DAO CARTS get:', error.message )
      throw new Error( 'No se pudieron obtener los carritos.' )
    }
  }

  // obtener un carrito por un ID
  async getById( cartId ) {
    try {
      const cart = await this.model
        .findById( cartId )
        .populate( 'products.productId' )
        .lean()

      if ( !cart ) {
        throw new Error( `El carrito con el ID: '${ cartId }' no existe.` )
      }

      return cart
    } catch ( error ) {
      console.log( 'DAO CARTS getById:', error.message )
      throw new Error( 'No se pudo encontrar el carrito.' )
    }
  }

  // crear un carrito
  async create() {
    try {
      const newCart = {}
      const cart = await this.model.create( newCart )
      return cart
    } catch ( error ) {
      console.log( 'DAO CARTS create:', error.message )
      throw new Error( 'No se pudo crear el carrito.' )
    }
  }

  // añadir un producto a un carrito
  async addProduct( cartId, productId ) {
    try {
      const cart = await this.getById( cartId )
      if ( !cart ) {
        throw new Error( `El carrito con el ID: '${ cartId }' no existe.` )
      }

      const productIndex = cart.products.findIndex(
        ( prod ) => prod.productId._id.toString() === productId
      )

      // si el producto no existe en el carrito, lo agrega
      // si existe, actualiza la cantidad
      if ( productIndex === -1 ) {
        cart.products.push( { productId, quantity: 1 } )
      } else {
        cart.products[ productIndex ].quantity++
      }

      const updateCart = await this.model
        .findByIdAndUpdate( cartId, cart, { new: true } )
        .populate( 'products.productId' )

      return updateCart
    } catch ( error ) {
      console.log( 'DAO CARTS addProduct:', error.message )
      throw new Error( 'No se pudo agregar el producto al carrito.' )
    }
  }

  // actualiza la informacion del carrito, con lo que le pasemos por el body
  async update( cartId, newCartInfo ) {
    try {
      const cart = await this.getById( cartId )
      if ( !cart ) {
        throw new Error( `El carrito con el ID: '${ cartId }' no existe.` )
      }

      const updatedCart = await this.model
        .findByIdAndUpdate( cartId, { products: newCartInfo }, { new: true } )
        .populate( 'products.productId' )

      return updatedCart
    } catch ( error ) {
      console.log( 'DAO CARTS update', error.message )
      throw new Error( 'No se pudo agregar el producto al carrito.' )
    }
  }

  // actualiza la cantidad de un producto en el carrito, con el número que le pasemos por el body
  async updateQty( cartId, productId, newQuantity ) {
    try {
      const cart = await this.getById( cartId )
      if ( !cart ) {
        throw new Error( `El carrito con el ID: '${ cartId }' no existe.` )
      }

      const productIndex = cart.products.findIndex(
        ( prod ) => prod.productId._id.toString() === productId
      )

      if ( productIndex === -1 ) {
        throw new Error( 'El producto ingresado no fue agregado al carrito' )
      }

      if ( typeof newQuantity !== 'number' ) {
        throw new Error( 'La cantidad ingresada debe ser de tipo numérico.' )
      }

      cart.products[ productIndex ].quantity = newQuantity

      const updateCart = await this.model
        .findByIdAndUpdate( cartId, cart, { new: true } )
        .populate( 'products.productId' )

      return updateCart
    } catch ( error ) {
      console.log( 'DAO CARTS updateQty', error.message )
      throw new Error( 'No se pudo actualizar la cantidad del producto.' )
    }
  }

  // eliminar solo un producto del carrito
  async deleteProduct( cartId, productId ) {
    try {
      // carrito existe
      const cart = await this.getById( cartId )
      if ( !cart ) {
        throw new Error( `El carrito con el ID: '${ cartId }' no existe.` )
      }

      // producto dentro del carrito existe
      const productExist = cart.products.some(
        ( prod ) => prod.productId._id.toString() === productId
      )
      if ( !productExist ) {
        throw new Error( 'El producto que quiere eliminar no se encuentra en el carrito.' )
      }

      const productIndex = cart.products.findIndex(
        ( prod ) => prod.productId._id.toString() === productId
      )

      cart.products.splice( productIndex, 1 )

      const updateCart = await this.model
        .findByIdAndUpdate( cartId, { products: cart.products }, { new: true } )
        .populate( 'products.productId' )

      return updateCart
    } catch ( error ) {
      console.log( 'DAO CARTS deleteProduct', error.message )
      throw new Error( 'No se pudo eliminar el producto del carrito.' )
    }
  }

  // elimina los elementos de cart.products, pero el carrito sigue existiendo
  async clear( cartId ) {
    try {
      const cart = await this.getById( cartId )
      if ( !cart ) {
        throw new Error( `El carrito con el ID: '${ cartId }' no existe.` )
      }

      const cartClean = await this.model
        .findByIdAndUpdate( cartId, { products: [] }, { new: true } )

      return cartClean
    } catch ( error ) {
      console.log( 'DAO CARTS clear:', error.message )
      throw new Error( 'No se pudo eliminar el carrito.' )
    }
  }

  // elimina todo el carrito
  async deleteAll( cartId ) {
    try {
      const cartDeleted = await this.model.findByIdAndDelete( cartId )
      if ( !cartDeleted ) {
        throw new Error( `El carrito con el ID: '${ cartId }' no existe.` )
      }
      return cartDeleted
    } catch ( error ) {
      console.log( 'DAO CARTS deleteCart:', error.message )
      throw new Error( 'No se pudo eliminar el carrito.' )
    }
  }
}
