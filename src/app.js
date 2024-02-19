import { config } from './config/config.js'
import express from 'express'
import path from 'node:path'
import { __dirname } from './utils.js'
import cookieParser from 'cookie-parser'
import { Server } from 'socket.io'
import session from 'express-session'
import MongoStore from 'connect-mongo'
import { engine } from 'express-handlebars'
import { initializePassport } from './config/passport.config.js'
import passport from 'passport'
import swaggerUI from 'swagger-ui-express'
import { swaggerSpecs } from './config/swagger.config.js'
import { logger } from './helpers/logger.js'
import { errorHandler } from './middlewares/errorHandler.js'
import { ProductsService } from './services/products.service.js'
import { CartsService } from './services/carts.service.js'

import { viewsRouter } from './routes/views.routes.js'
import { productsRouter } from './routes/products.routes.js'
import { cartsRouter } from './routes/carts.routes.js'
import { sessionsRouter } from './routes/sessions.routes.js'
import { usersRouter } from './routes/users.routes.js'

import './config/console.js'
import { UsersService } from './services/users.service.js'

const port = process.env.PORT || 8080
const app = express()

// middlewares
app.use( express.json() )
app.use( express.static( path.join( __dirname, '/public' ) ) )
app.use( express.urlencoded( { extended: true } ) )
app.use( cookieParser() )

// servidor HTTP con express
const httpServer = app.listen( port, () => logger.info( `Server listening on port: ${ port }` ) )

// servidor con websocket
const io = new Server( httpServer )

app.use( session( {
  store: MongoStore.create( {
    ttl: 60 * 60 * 24, // en segundos. 24hs
    mongoUrl: config.mongo.url
  } ),
  secret: config.server.secretSession,
  resave: false,
  saveUninitialized: true,
  cookie: {
    maxAge: 1000 * 60 * 60 * 24 // en milisegundos. 24hs
  }
} ) )

// configuracion handlebars
app.engine( '.hbs', engine( { extname: '.hbs' } ) )
app.set( 'view engine', '.hbs' )
app.set( 'views', path.join( __dirname, '/views' ) )

// configurar passport
initializePassport()
app.use( passport.initialize() )
app.use( passport.session() )

// routes
app.use( viewsRouter )
app.use( '/api/products', productsRouter )
app.use( '/api/carts', cartsRouter )
app.use( '/api/sessions', sessionsRouter )
app.use( '/api/users', usersRouter )
app.use( '/api/docs', swaggerUI.serve, swaggerUI.setup( swaggerSpecs ) )

app.use( '/testLogger', ( req, res ) => {
  logger.fatal( 'log fatal' )
  logger.error( 'log error' )
  logger.warning( 'log warning' )
  logger.info( 'log info' )
  logger.http( 'log http' )
  logger.debug( 'log debug' )
  res.send( 'Prueba de logger' )
} )

app.use( errorHandler )

io.on( 'connection', async ( socket ) => {
  console.log( 'cliente conectado' )

  // envio la informacion de todos los productos para que se actualicen en tiempo real
  // tambien envio la informacion del carrito
  socket.on( 'cartInfo', async ( cartId ) => {
    const products = await ProductsService.getAllProducts()
    socket.emit( 'allProducts', products.docs )

    const cart = await CartsService.getOneCart( cartId )
    socket.emit( 'cartData', cart.products )
  } )

  // recibir los datos del cliente para crear el producto
  socket.on( 'createProduct', async ( productData ) => {
    const userEmail = productData.owner
    const user = await UsersService.getUserByEmail( userEmail )
    productData.owner = user._id
    await ProductsService.createProduct( productData )
    const products = await ProductsService.getAllProducts()
    socket.emit( 'allProducts', products.docs )
  } )

  socket.on( 'deleteProduct', async ( idProduct ) => {
    await ProductsService.deleteProduct( idProduct )
    const products = await ProductsService.getAllProducts()
    socket.emit( 'allProducts', products.docs )
  } )

  socket.on( 'addProductToCart', async ( info ) => {
    await CartsService.addProductToCart( info.cartId, info.productId )
    const cart = await CartsService.getOneCart( info.cartId )
    socket.emit( 'cartData', cart.products )
  } )

  socket.on( 'deleteProductFromCart', async ( info ) => {
    await CartsService.deleteProductFromCart( info.cartId, info.productId )
    const cart = await CartsService.getOneCart( info.cartId )
    socket.emit( 'cartData', cart.products )
  } )
} )

export { app }
