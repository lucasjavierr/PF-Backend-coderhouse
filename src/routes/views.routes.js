import { Router } from 'express'
import { ViewsController } from '../controllers/views.controller.js'
import { USER_ROLE_TYPES } from '../enums/constants.js'
import { checkRoleView, isAuthView } from '../middlewares/auth.js'

const router = Router()

router.get( '/adminPanel', isAuthView, ViewsController.adminPanel )

router.get( '/', ViewsController.homeView )
router.get( '/products', isAuthView, ViewsController.productsView )
router.get( '/cart/:cartId', isAuthView, ViewsController.cartView )
router.get( '/login', ViewsController.loginView )
router.get( '/signup', ViewsController.signupView )
router.get( '/profile', isAuthView, ViewsController.profileView )
router.get( '/forgot-password', ViewsController.forgotPassword )
router.get( '/reset-password', ViewsController.resetPassword )

export { router as viewsRouter }
