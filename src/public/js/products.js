const addToCartButtons = document.querySelectorAll( '.add-to-cart-button' )

addToCartButtons.forEach( ( button ) => {
  button.addEventListener( 'click', () => {
    const productId = button.getAttribute( 'data-product-id' )
    Toastify( {
      text: "Producto agregado correctamente",
      duration: 2000,
      close: true,
      gravity: "top",
      position: "right",
      stopOnFocus: true,
      style: {
        background: "linear-gradient(to right, #00b09b, #96c93d)",
        borderRadius: "15px"
      },
    } ).showToast();
    const info = { cartId, productId }
    socketClient.emit( 'addProductToCart', info )
  } )
} )


const createProductForm = document.getElementById( 'createProduct' )

createProductForm.addEventListener( 'submit', async ( e ) => {
  e.preventDefault()

  const formValues = {
    title: e.target.title.value,
    description: e.target.description.value,
    category: e.target.category.value,
    thumbnail: e.target.thumbnail.value,
    price: e.target.price.value,
    stock: e.target.stock.value,
  }
  console.log( formValues )

  const response = await fetch( '/api/products', {
    headers: { 'Content-Type': 'application/json' },
    method: 'POST',
    body: JSON.stringify( formValues )
  } );

  // Verificar si la respuesta fue exitosa (código 2xx)
  if ( response.ok ) {
    // Obtener el JSON de la respuesta
    const data = await response.json();
    console.log( data )

    // Después de recibir la respuesta (el JSON), redirigir a la vista de productos
    window.location.href = '/products';
  } else {
    console.error( 'Error al enviar el formulario:', response.status, response.statusText );
  }
} )