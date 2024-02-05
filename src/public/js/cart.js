/* eslint-disable no-return-assign */
/* eslint-disable no-undef */
socketClient.on( 'cartData', ( dataProducts ) => {
  const cartClean = document.getElementById( 'cartClean' )
  const cartProductsContainer = document.getElementById( 'cartProductsContainer' )

  if ( dataProducts.length <= 0 ) {
    const titleCart = `
      <h2>Tu carrito está vacío :(</h2>
      <p>Añade más productos para poder visualizarlos aquí</p>
    `
    cartClean.innerHTML = titleCart
    cartProductsContainer.innerHTML = ''
  } else {
    let productsElements = ''
    dataProducts.forEach( ( elm ) => {
      productsElements += `
        <article class="card_body">
          <picture class="card_image_container">
            <img src=${ elm.productId.thumbnail } />
          </picture>
          <div class="card_info_container">
            <h3>${ elm.productId.title }</h3>
            <p>$${ elm.productId.price }</p>
            <p>CANTIDAD: ${ elm.quantity }</p>
          </div>
          <div class="card_button_container">
            <button class="delete-to-cart-button" data-product-id="${ elm.productId._id }">Eliminar del carrito</button>
          </div>
        </article>
      `
    } )
    cartClean.innerHTML = ''
    cartProductsContainer.innerHTML = productsElements

    const deleteToCartButtons = document.querySelectorAll( '.delete-to-cart-button' )
    deleteToCartButtons.forEach( ( button ) => {
      button.addEventListener( 'click', () => {
        const productId = button.getAttribute( 'data-product-id' )
        const info = { productId, cartId }
        socketClient.emit( 'deleteProductFromCart', info )
      } )
    } )
  }
} )

