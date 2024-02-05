/* eslint-disable no-undef */

const addToCartButtons = document.querySelectorAll( '.add-to-cart-button' )

addToCartButtons.forEach( ( button ) => {
  button.addEventListener( 'click', () => {
    const productId = button.getAttribute( 'data-product-id' )
    const info = { cartId, productId }
    socketClient.emit( 'addProductToCart', info )
  } )
} )