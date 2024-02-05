import { ticketsModel } from '../../models/ticket.model.js'

export class TicketsManagerMongo {
  constructor () {
    this.model = ticketsModel
  };

  async get() {
    try {
      const result = await this.model.find().lean()
      return result
    } catch ( error ) {
      console.log( 'TICKETS DAO get: ', error.message )
      throw new Error( 'Se produjo un error al obtener los tickets' )
    }
  };

  async getById( ticketId ) {
    try {
      const result = await this.model.findById( ticketId ).lean()
      return result
    } catch ( error ) {
      console.log( 'TICKETS DAO getById: ', error.message )
      throw new Error( 'Se produjo un error obteniendo el ticket por ID' )
    }
  };

  async create( ticketInfo ) {
    try {
      const result = await this.model.create( ticketInfo )
      return result
    } catch ( error ) {
      console.log( 'TICKETS DAO create: ', error.message )
      throw new Error( 'Se produjo un error al crear el ticket' )
    }
  };
}
