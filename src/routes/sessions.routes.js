import { Router } from 'express'
import passport from 'passport'
import { SessionsController } from '../controllers/sessions.controller.js'
import { isAuth } from '../middlewares/auth.js'
import { uploadProfile } from '../utils.js'

const router = Router()

router.post( '/signup', uploadProfile.single( 'avatar' ), passport.authenticate( 'signupLS',
  { failureRedirect: '/api/sessions/fail-signup' }
), SessionsController.signup )

router.get( '/fail-signup', SessionsController.failSignup )

// ------------------------------------------------------------------------
router.post( '/login', passport.authenticate( 'loginLS',
  { failureRedirect: '/api/sessions/fail-login' }
), SessionsController.login )

router.get( '/fail-login', SessionsController.failLogin )

router.post( '/current', isAuth, SessionsController.currentUser )

router.get( '/logout', SessionsController.logout )

router.post( '/forgot-password', SessionsController.forgotPassword )

router.post( '/reset-password', SessionsController.resetPassword )

export { router as sessionsRouter }
