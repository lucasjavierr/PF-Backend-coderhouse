import { CartsService } from '../services/carts.service.js'
import { ProductsService } from '../services/products.service.js'
import { TicketsService } from '../services/tickets.service.js'
import { USER_ROLE_TYPES } from '../enums/constants.js'
import { v4 as uuidv4 } from 'uuid'
import { CustomError } from '../services/errors/customError.service.js'
import { EError } from '../enums/EError.js'
import { addProductError } from '../services/errors/addProductError.service.js'

export class CartsController {
  static getCarts = async ( req, res, next ) => {
    try {
      const carts = await CartsService.getAllCarts()
      res.json( { status: 'success', data: carts } )
    } catch ( error ) {
      next( error )
    }
  }

  static getCart = async ( req, res, next ) => {
    try {
      const { cartId } = req.params
      const cart = await CartsService.getOneCart( cartId )
      res.json( { status: 'success', data: cart } )
    } catch ( error ) {
      next( error )
    }
  }

  static createCart = async ( req, res, next ) => {
    try {
      const cartCreated = await CartsService.createCart()
      res.json( { status: 'success', data: cartCreated } )
    } catch ( error ) {
      next( error )
    }
  }

  static addProductToCart = async ( req, res, next ) => {
    try {
      const { cartId, productId } = req.params

      // verifico si producto y carrito existen
      await CartsService.getOneCart( cartId )
      const product = await ProductsService.getOneProduct( productId )

      if ( !product ) {
        CustomError.createError( {
          name: 'Create product error',
          cause: addProductError( productId ),
          message: 'Producto no encontrado',
          errorCode: EError.INVALID_PARAM
        } )
      }

      if (
        req.user.role === USER_ROLE_TYPES.PREMIUM &&
        product.owner.toString() === req.user._id.toString()
      ) {
        return res.json( { status: 'error', message: 'No puedes agregar tus propios productos a tu carrito' } )
      }
      const productAdded = await CartsService.addProductToCart( cartId, productId )
      res.json( { status: 'success', data: productAdded } )
    } catch ( error ) {
      next( error )
    }
  }

  static updateInfoToCart = async ( req, res, next ) => {
    try {
      const { cartId } = req.params
      const newCartInfo = req.body

      await CartsService.getOneCart( cartId )
      const newCart = await CartsService.updateCartInfo( cartId, newCartInfo )
      res.json( { status: 'success', data: newCart } )
    } catch ( error ) {
      next( error )
    }
  }

  static updateProductQuantity = async ( req, res, next ) => {
    try {
      const { cartId, productId } = req.params
      const { newQuantity } = req.body

      // verifico si producto y carrito existen
      await CartsService.getOneCart( cartId )
      await ProductsService.getOneProduct( productId )

      // realizo la operacion de actualizar la cantidad
      const productUpdated = await CartsService
        .updateProductQuantity( cartId, productId, newQuantity )

      res.json( { status: 'success', data: productUpdated } )
    } catch ( error ) {
      next( error )
    }
  }

  static clearCart = async ( req, res, next ) => {
    try {
      const { cartId } = req.params
      const cartDeleted = await CartsService.clearCart( cartId )
      res.json( { status: 'success', data: cartDeleted } )
    } catch ( error ) {
      next( error )
    }
  }

  static deleteProductFromCart = async ( req, res, next ) => {
    try {
      const { cartId, productId } = req.params
      await CartsService.getOneCart( cartId )
      await ProductsService.getOneProduct( productId )

      const newProducts = await CartsService.deleteProductFromCart( cartId, productId )
      res.json( { status: 'success', data: newProducts } )
    } catch ( error ) {
      next( error )
    }
  }

  static purchaseCart = async ( req, res, next ) => {
    try {
      const { cartId } = req.params
      const cart = await CartsService.getOneCart( cartId )

      // verificar que el carrito tenga productos
      if ( cart.products.length <= 0 ) return res.json( { status: 'error', message: 'El carrito esta vacío' } )

      const ticketProducts = []
      const rejectedProducts = []

      // verificar el stock de los productos
      for ( let i = 0; i < cart.products.length; i++ ) {
        const productInCart = cart.products[ i ]
        const productInfo = productInCart.productId

        if ( productInCart.quantity <= productInfo.stock ) {
          ticketProducts.push( productInCart )
          productInfo.stock -= productInCart.quantity

          // actualizo el stock de los productos en DB
          await ProductsService.updateProductInfo( productInfo._id, productInfo )
        } else {
          rejectedProducts.push( productInCart )
        }
      }

      const newTicket = {
        code: uuidv4(),
        purchase_datetime: new Date(),
        // eslint-disable-next-line no-return-assign
        amount: ticketProducts.reduce( ( acc, curr ) => acc += curr.quantity * curr.productId.price, 0 ),
        purchaser: req.user.email
      }
      // crear el ticket en la DB
      const ticket = await TicketsService.createTicket( newTicket )

      // actualizar el carrito con los productos rechazados
      // si es un array vacío, significa que todos los productos se compraron
      // por ende, el carrito quedaria vacío tambien
      await CartsService.updateCartInfo( cartId, rejectedProducts )

      if ( rejectedProducts.length >= 1 ) {
        return res.json( { status: 'success', message: 'Compra realizada, algunos productos no se pudieron comprar por falta de stock', rejectedProducts } )
      }
      res.json( { status: 'success', message: 'Compra realizada de forma exitosa', cart } )
    } catch ( error ) {
      next( error )
    }
  }
}
