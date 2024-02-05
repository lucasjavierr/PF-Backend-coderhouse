import { Router } from 'express'
import { ProductsController } from '../controllers/products.controller.js'
import { isAuth, checkRole } from '../middlewares/auth.js'
import { USER_ROLE_TYPES } from '../enums/constants.js'

const router = Router()

// mocking
router.get( '/mockingProducts', ProductsController.mockingProducts )

// http://localhost:8080/api/products
router.get( '/', ProductsController.getProducts )
router.get( '/:productId', ProductsController.getProduct )
router.post( '/', isAuth, checkRole( [ USER_ROLE_TYPES.ADMIN, USER_ROLE_TYPES.PREMIUM ] ), ProductsController.createProduct )
router.put( '/:productId', isAuth, checkRole( [ USER_ROLE_TYPES.ADMIN, USER_ROLE_TYPES.PREMIUM ] ), ProductsController.updateProduct )
router.delete( '/:productId', isAuth, checkRole( [ USER_ROLE_TYPES.ADMIN, USER_ROLE_TYPES.PREMIUM ] ), ProductsController.deleteProduct )

export { router as productsRouter }
