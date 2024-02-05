import { CATEGORY_TYPES } from '../enums/constants.js'
import { ProductsService } from '../services/products.service.js'
import { UsersDto } from '../DTOs/users.dto.js'

export class ViewsController {
  static homeView = ( req, res ) => {
    const userDto = new UsersDto( req.user )
    res.render( 'home', { user: userDto } )
  }

  static productsView = async ( req, res ) => {
    try {
      const { limit = 10, page = 1, sort, category } = req.query
      const query = {}
      const options = { limit, page, lean: true }

      if ( limit < 1 ) throw new Error( 'El limite ingresado debe ser mayor a 1' )
      if ( page < 1 ) throw new Error( 'La página ingresada debe ser mayor a 1' )
      if ( sort === 'asc' ) options.sort = { price: 1 }
      if ( sort === 'desc' ) options.sort = { price: -1 }
      if (
        category === CATEGORY_TYPES.PROCESSOR ||
        category === CATEGORY_TYPES.GRAPHIC_CARD ||
        category === CATEGORY_TYPES.RAM_MEMORY ||
        category === CATEGORY_TYPES.STORAGE
      ) {
        query.category = category
      }

      const result = await ProductsService.getAllProducts( query, options )
      // se filtran los productos por stock
      const filteredProducts = result.docs.filter( ( prod ) => prod.stock > 0 )

      const baseUrl = req.protocol + '://' + req.get( 'host' ) + req.originalUrl

      const dataProducts = {
        payload: filteredProducts,
        prevPage: result.prevPage,
        nextPage: result.nextPage,
        page: result.page,
        hasPrevPage: result.hasPrevPage,
        hasNextPage: result.hasNextPage,
        prevLink: result.hasPrevPage
          ? `${ baseUrl.replace( `page=${ result.page }`, `page=${ result.prevPage }` ) }`
          : null,
        nextLink: result.hasNextPage
          ? baseUrl.includes( 'page' )
            ? baseUrl.replace( `&page=${ result.page }`, `&page=${ result.nextPage }` )
            : baseUrl.concat( `&page=${ result.nextPage }` )
          : null
      }
      const userDto = new UsersDto( req.user )

      res.render( 'products', { dataProducts, user: userDto } )
    } catch ( error ) {
      res.render( 'login' )
    }
  }

  static realTime = ( req, res ) => {
    const userDto = new UsersDto( req.user )
    res.render( 'realTime', { user: userDto } )
  }

  static cartView = async ( req, res ) => {
    const userDto = new UsersDto( req.user )
    res.render( 'cart', { user: userDto } )
  }

  static loginView = ( req, res ) => {
    if ( req.user ) return res.redirect( '/profile' )
    res.render( 'login' )
  }

  static signupView = ( req, res ) => {
    res.render( 'signup' )
  }

  static profileView = ( req, res ) => {
    const userDto = new UsersDto( req.user )
    res.render( 'profile', { user: userDto } )
  }

  static forgotPassword = ( req, res ) => {
    res.render( 'forgotPassword' )
  }

  static resetPassword = ( req, res ) => {
    const token = req.query.token
    res.render( 'resetPassword', { token } )
  }
}
