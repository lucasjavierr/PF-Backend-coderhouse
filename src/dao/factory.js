import { config } from '../config/config.js'

let productsDao
let cartsDao
let usersDao
let ticketsDao
const persistence = config.server.persistence

switch ( persistence ) {
  case 'mongo': {
    const { connectDB } = await import( '../config/dbConnection.js' )
    connectDB()
    const { ProductsManagerMongo } = await import( './managers/mongo/products.mongo.js' )
    const { CartsManagerMongo } = await import( './managers/mongo/carts.mongo.js' )
    const { UsersManagerMongo } = await import( './managers/mongo/users.mongo.js' )
    const { TicketsManagerMongo } = await import( './managers/mongo/tickets.mongo.js' )
    productsDao = new ProductsManagerMongo()
    cartsDao = new CartsManagerMongo()
    usersDao = new UsersManagerMongo()
    ticketsDao = new TicketsManagerMongo()
    break
  }

  // para aplicar en un futuro(?)
  case 'sql': {
    break
  }

  case 'memory': {
    const { ProductsManagerFiles } = await import( './managers/files/products.files.js' )
    const { CartsManagerFiles } = await import( './managers/files/carts.files.js' )
    productsDao = new ProductsManagerFiles()
    cartsDao = new CartsManagerFiles()
    break
  }
}

export { productsDao, cartsDao, usersDao, ticketsDao }
