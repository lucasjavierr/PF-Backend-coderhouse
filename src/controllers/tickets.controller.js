import { TicketsService } from '../services/tickets.service.js'

export class TicketController {
  static getTickets = async ( req, res, next ) => {
    try {
      const result = await TicketsService.getAllTickets()
      res.json( { status: 'success', data: result } )
    } catch ( error ) {
      next( error )
    }
  }

  // Obtener Tickets por ID
  static getTicket = async ( req, res, next ) => {
    try {
      const { ticketId } = req.params
      const ticket = await TicketsService.getOneTicket( ticketId )
      res.json( { status: 'success', data: ticket } )
    } catch ( error ) {
      next( error )
    }
  }

  // Crear Ticket
  static createTicket = async ( req, res, next ) => {
    try {
      const ticketInfo = req.body
      const result = await TicketsService.createTicket( ticketInfo )
      res.json( { status: 'success', data: result } )
    } catch ( error ) {
      next( error )
    };
  }
};
