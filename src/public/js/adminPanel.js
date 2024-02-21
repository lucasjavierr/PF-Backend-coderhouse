const usersContainer = document.getElementById( 'usersContainer' )
const productsContainer = document.getElementById( 'productsContainer' )
const createProductForm = document.getElementById( 'createProductForm' )

// enviar la informacion del nuevo producto al servidor
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

// recibimos los productos y los renderizamos
socketClient.on( 'allProducts', async ( dataProducts ) => {
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
  } )
  productsContainer.innerHTML = productsElements

  // ponemos un evento a cada uno de los productos para que puedan eliminarse
  const deleteProductButtons = document.querySelectorAll( '.delete-product-button' )
  deleteProductButtons.forEach( ( button ) => {
    button.addEventListener( 'click', () => {
      Swal.fire( {
        title: "Estás seguro?",
        text: "Esta acción no se puede deshacer.",
        icon: "warning",
        showCancelButton: true,
        confirmButtonColor: "#3085d6",
        cancelButtonColor: "#d33",
        confirmButtonText: "Sí"
      } ).then( ( result ) => {
        if ( result.isConfirmed ) {
          Swal.fire( {
            title: "Eliminado correctamente",
            text: "El producto se eliminó ",
            icon: "success"
          } );
          const productId = button.getAttribute( 'data-product-id' )
          socketClient.emit( 'deleteProduct', productId )
        }
      } );
    } )
  } )
} )

socketClient.on( 'allUsers', async ( users ) => {
  console.log( users )
  let usersElements = ''
  users.forEach( user => {
    usersElements += `
      <article class="card_user_body">
        <picture class="card_user_img_container">
          <img src="${ user.avatar }" />
        </picture>
        <div class="card_user_details">
          <h3>${ user.name }</h3>
          <p>${ user.email }</p>
          <p>${ user.role }</p>
        </div>
      </article>
    `
  } )
  usersContainer.innerHTML = usersElements
} )
