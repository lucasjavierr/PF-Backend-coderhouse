import { CATEGORY_TYPES } from '../enums/constants.js'
import { ProductsService } from '../services/products.service.js'
import { generateProduct } from '../helpers/mock.js'
import { EError } from '../enums/EError.js'
import { CustomError } from '../services/errors/customError.service.js'
import { createProductError } from '../services/errors/createProductError.service.js'
import { USER_ROLE_TYPES } from '../enums/constants.js'

export class ProductsController {
  static getProducts = async ( req, res, next ) => {
    try {
      const { limit = 10, page = 1, sort, category } = req.query
      const query = {}
      const options = { limit, page, lean: true }

      if ( limit < 1 ) throw new Error( 'El limite ingresado debe ser mayor a 1' )
      if ( page < 1 ) throw new Error( 'La página ingresada debe ser mayor a 1' )
      if ( sort === 'asc' ) {
        options.sort = { price: 1 }
      }
      if ( sort === 'desc' ) {
        options.sort = { price: -1 }
      }
      if (
        category === CATEGORY_TYPES.PROCESSOR ||
        category === CATEGORY_TYPES.GRAPHIC_CARD ||
        category === CATEGORY_TYPES.RAM_MEMORY ||
        category === CATEGORY_TYPES.STORAGE
      ) {
        query.category = category
      }

      // una vez pasan las verificaciones, obtengo los productos y los filtro según su stock
      const result = await ProductsService.getAllProducts( query, options )

      // obtengo la URL actual
      const baseUrl = req.protocol + '://' + req.get( 'host' ) + req.originalUrl

      // creo el objeto de la respuesta y se lo envío al cliente
      const dataProducts = {
        payload: result.docs,
        totalPages: result.totalPages,
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
      return res.json( { status: 'success', dataProducts } )
    } catch ( error ) {
      next( error )
    }
  }

  static getProduct = async ( req, res, next ) => {
    try {
      const { productId } = req.params
      const product = await ProductsService.getOneProduct( productId )
      if ( !product ) {
        throw new Error( `El producto con el ID '${ productId }' no existe.` )
      }
      res.json( { status: 'success', data: product } )
    } catch ( error ) {
      next( error )
    }
  }

  static createProduct = async ( req, res, next ) => {
    try {
      const productInfo = req.body
      const { title, description, price, category, stock } = productInfo

      if ( !title || !description || !price || !category || !stock ) {
        CustomError.createError( {
          name: 'Create product error',
          cause: createProductError( productInfo ),
          message: 'Los datos son inválidos para crear el producto, todos los campos deben estar completos',
          errorCode: EError.DATABASE_ERROR
        } )
      }
      if ( !productInfo.owner ) {
        productInfo.owner = req.user._id
      }

      if ( stock < 0 ) {
        return res.json( { status: 'error', message: 'Un producto no puede tener stock negativo' } )
      }

      const productCreated = await ProductsService.createProduct( productInfo )
      res.json( { status: 'success', data: productCreated } )
    } catch ( error ) {
      next( error )
    }
  }

  static updateProduct = async ( req, res, next ) => {
    try {
      const { productId } = req.params
      const newInfoProduct = req.body
      const productUpdated = await ProductsService
        .updateProductInfo( productId, newInfoProduct )

      res.json( { status: 'success', data: productUpdated } )
    } catch ( error ) {
      next( error )
    }
  }

  static deleteProduct = async ( req, res, next ) => {
    try {
      const { productId } = req.params
      const prod = await ProductsService.getOneProduct( productId )

      if (
        req.user.role === USER_ROLE_TYPES.PREMIUM &&
        prod.owner.toString() === req.user._id.toString() ||
        req.user.role === USER_ROLE_TYPES.ADMIN
      ) {
        const productDeleted = await ProductsService.deleteProduct( productId )
        return res.json( { status: 'success', data: productDeleted } )
      }

      req.status( 403 ).json( { status: 'error', message: 'No tienes permisos para realizar esta operacion' } )
    } catch ( error ) {
      next( error )
    }
  }

  static mockingProducts = ( req, res, next ) => {
    const { qtyProducts = 100 } = req.body
    const productsMock = []
    for ( let i = 0; i < qtyProducts; i++ ) {
      const newProduct = generateProduct()
      productsMock.push( newProduct )
    }
    res.json( { status: 'success', productsMock } )
  }
}
