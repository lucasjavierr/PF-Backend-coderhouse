import { Router } from 'express'
import { TicketController } from '../controllers/tickets.controller.js'
import { isAuth } from '../middlewares/auth.js'

const router = Router()

router.get( '/', isAuth, TicketController.getTickets )
router.get( '/:ticketId', isAuth, TicketController.getTicket )
router.post( '/', isAuth, TicketController.createTicket )

export { router as ticketsRouter }
