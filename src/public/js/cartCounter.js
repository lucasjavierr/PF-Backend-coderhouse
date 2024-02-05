/* eslint-disable no-undef */
/* eslint-disable no-return-assign */
const socketClient = io()

const cartLink = document.getElementById( 'cartLink' )
const cartId = cartLink.getAttribute( 'href' ).split( '/' ).pop()
socketClient.emit( 'cartInfo', cartId )

const qtyProdInCart = document.getElementById( 'cartCounter' )
socketClient.on( 'cartData', ( dataCart ) => {
  const qty = dataCart.reduce( ( prev, curr ) => prev += curr.quantity, 0 )
  qtyProdInCart.innerText = qty
} )
