const signupForm = document.getElementById( 'signupForm' )
const errorSignupMsg = document.getElementById( 'errorSignupMsg' )

signupForm.addEventListener( 'submit', async ( e ) => {
  e.preventDefault()

  const formValues = {
    firstName: e.target.firstName.value,
    lastName: e.target.lastName.value,
    age: e.target.age.value,
    gender: e.target.gender.value,
    email: e.target.email.value,
    password: e.target.password.value
  }

  const response = await fetch( '/api/sessions/signup', {
    headers: {
      'Content-type': 'application/json'
    },
    method: 'POST',
    body: JSON.stringify( formValues )
  } )
  const result = await response.json()
  console.log( response )
  console.log( result )


  if ( result.status === 'success' ) {
    window.location.href = '/login'
  } else {
    errorSignupMsg.innerText = `${ result.message }`
  }
} )
