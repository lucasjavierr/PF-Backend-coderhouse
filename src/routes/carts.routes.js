import { Router } from 'express'
import { isAuth, checkRole } from '../middlewares/auth.js'
import { CartsController } from '../controllers/carts.controller.js'
import { USER_ROLE_TYPES } from '../enums/constants.js'

const router = Router()

// http://localhost:8080/api/carts
router.get( '/', isAuth, checkRole( [ USER_ROLE_TYPES.ADMIN ] ), CartsController.getCarts )
router.get( '/:cartId', isAuth, CartsController.getCart )
router.post( '/', isAuth, CartsController.createCart )
router.post( '/:cartId/product/:productId', isAuth, CartsController.addProductToCart )
router.post( '/:cartId/purchase', isAuth, CartsController.purchaseCart )
router.put( '/:cartId', isAuth, CartsController.updateInfoToCart )
router.put( '/:cartId/product/:productId', isAuth, CartsController.updateProductQuantity )
router.delete( '/:cartId', isAuth, CartsController.clearCart )
router.delete( '/:cartId/product/:productId', isAuth, CartsController.deleteProductFromCart )

export { router as cartsRouter }
