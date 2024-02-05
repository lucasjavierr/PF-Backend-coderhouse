import { Router } from 'express'
import { UsersController } from '../controllers/users.controller.js'
import { checkRole, isAuth } from '../middlewares/auth.js'
import { USER_ROLE_TYPES } from '../enums/constants.js'
import { uploadDocuments } from '../utils.js'

const router = Router()

router.get( '/:userId', isAuth, UsersController.getUser )
router.put( '/premium/:userId', isAuth, checkRole( [ USER_ROLE_TYPES.ADMIN ] ), UsersController.modifyRole )
router.post( '/:userId/documents', isAuth, uploadDocuments.fields( [
  { name: 'identificación', maxCount: 1 },
  { name: 'domicilio', maxCount: 1 },
  { name: 'estadoDeCuenta', maxCount: 1 },
] ), UsersController.uploadDocuments )

export { router as usersRouter }
