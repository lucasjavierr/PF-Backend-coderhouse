import { ticketsDao } from '../dao/factory.js'

export class TicketsService {
  static getAllTickets = async () => {
    return ticketsDao.get()
  }

  static getOneTicket = async ( ticketId ) => {
    return ticketsDao.getById( ticketId )
  }

  static createTicket = async ( ticketInfo ) => {
    return ticketsDao.create( ticketInfo )
  }
}
