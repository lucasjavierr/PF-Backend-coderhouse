/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */

const productsContainer = document.getElementById( 'productsContainer' )
const createProductForm = document.getElementById( 'createProductForm' )

// enviamos info del formulario al servidor
createProductForm.addEventListener( 'submit', ( e ) => {
  e.preventDefault()
  // obtengo los datos ingresados en el formulario
  const formData = new FormData( createProductForm )

  // recorro todos los valores, y creo una propiedad con su respectivo nombre y valor
  const jsonData = {}
  for ( const [ key, value ] of formData.entries() ) {
    jsonData[ key ] = value
  }
  jsonData.price = +jsonData.price
  jsonData.stock = +jsonData.stock
  const userEmail = createProductForm.getAttribute( 'data-user-email' )
  jsonData.owner = userEmail
  console.log( jsonData )

  // enviamos el objeto a servidor
  socketClient.emit( 'createProduct', jsonData )
  createProductForm.reset()
} )

// recibimos los productos
socketClient.on( 'allProducts', async ( dataProducts ) => {
  console.log( 'products', dataProducts )
  let productsElements = ''
  dataProducts.forEach( ( elm ) => {
    productsElements += `
    <article class="card_body">
      <picture class="card_image_container">
        <img src=${ elm.thumbnail } />
      </picture>
      <div class="card_info_container">
        <h3>${ elm.title }</h3>
        <p>$${ elm.price }</p>
        <p>${ elm.description }</p>
      </div>
      <div class="card_button_container">
        <button class="delete-product-button" data-product-id="${ elm._id }">Eliminar producto</button>
      </div>
    </article>
    `
    productsContainer.innerHTML = productsElements
  } )

  const deleteProductButtons = document.querySelectorAll( '.delete-product-button' )
  deleteProductButtons.forEach( ( button ) => {
    button.addEventListener( 'click', () => {
      const productId = button.getAttribute( 'data-product-id' )
      socketClient.emit( 'deleteProduct', productId )
    } )
  } )
} )
