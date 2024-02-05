/* eslint-disable no-useless-catch */
import fs from 'node:fs'
import { logger } from '../../../helpers/logger.js'

export class CartsManagerFiles {
  constructor ( filePath ) {
    this.path = filePath
  }

  #newId

  #fileExist() {
    return fs.existsSync( this.path )
  }

  async #writeFile( infoToSave ) {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify( infoToSave, null, '\t' )
    )
  }

  async getCarts() {
    try {
      // verifico si el archivo existe
      if ( !this.#fileExist() ) {
        throw new Error( 'No se pudieron obtener los carrito.s' )
      }

      // leo el archivo y lo convierto a json
      // si el archivo no existe, devuelvo un error
      const cartsData = await fs.promises.readFile( this.path, 'utf-8' )
      if ( !cartsData ) {
        throw new Error(
          'No se pudo leer el archivo porque no existe o está vacío.'
        )
      }
      const carts = JSON.parse( cartsData )

      // retorno todos los carritos
      return carts
    } catch ( error ) {
      throw error
    }
  }

  async getCartById( cartId ) {
    // obtengo los carritos ya formateados
    const carts = await this.getCarts()

    // busco el carrito por el id ingresado
    // si no existe, devuelvo un error
    const cart = carts.find( ( cart ) => cart.id === cartId )
    if ( !cart ) {
      throw new Error( `No se pudo encontrar un carrito con el ID ${ cartId }` )
    }

    // retorno el carrito
    return cart
  }

  async createCart() {
    try {
      // obtengo los carritos ya formateados
      const carts = await this.getCarts()

      // ID incrementable
      // si el array de carritos esta vacio, se crea el primer carrito con el ID 1
      // si ya tiene carritos, busca el ID del ultimo elemento y le suma 1
      if ( carts.length === 0 ) {
        this.#newId = 1
      } else {
        this.#newId = carts[ carts.length - 1 ].id + 1
      }

      // creo el carrito con su ID y un array para contener los productos
      const newCart = {
        id: this.#newId,
        products: []
      }

      // pusheo el nuevo carrito al array de carritos y reescribo el archivo
      carts.push( newCart )
      this.#writeFile( carts )
      logger.info( 'Producto creado correctamente' )
    } catch ( error ) {
      throw error
    }
  }

  async addProductToCart( cartId, productId ) {
    try {
      // recupero el archivo de carritos
      const carts = await this.getCarts()

      // obtengo la posicion del carrito
      // si no existe, devuelvo error
      const cartIndex = carts.findIndex( ( cart ) => cart.id === cartId )
      if ( cartIndex === -1 ) {
        throw new Error( `El carrito con el ID ${ cartId } no existe` )
      }

      // dentro de ese carrito, busco si el producto ya existe
      const productIndex = carts[ cartIndex ].products.findIndex(
        ( prod ) => prod.id === productId
      )

      // si el producto ya existe, sumo 1 a la propiedad quantity
      // si no existe, creo un objeto con el ID del producto y la propiedad quantity en 1
      if ( productIndex !== -1 ) {
        carts[ cartIndex ].products[ productIndex ].quantity += 1
      } else {
        carts[ cartIndex ].products.push( { id: productId, quantity: 1 } )
      }

      // reescribo el archivo y retorno el producto agregado
      this.#writeFile( carts )
      logger.info( 'Producto agregado correctamente' )
    } catch ( error ) {
      throw error
    }
  }
}
