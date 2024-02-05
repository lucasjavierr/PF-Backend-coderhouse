export const isAuth = ( req, res, next ) => {
  if ( !req.user ) {
    return res.status( 401 ).json( { status: 'error', message: 'Debes iniciar sesión para acceder a esta ruta' } )
  }
  next()
}

export const isAuthView = ( req, res, next ) => {
  if ( !req.user ) {
    return res.redirect( '/login' )
  }
  next()
}

export const checkRole = ( roles ) => {
  return ( req, res, next ) => {
    if ( !req.user ) {
      return res.status( 401 ).json( { status: 'error', message: 'Debes iniciar sesión para acceder a esta ruta' } )
    }
    if ( !roles.includes( req.user?.role ) ) {
      return res.status( 403 ).json( { status: 'error', message: 'Acceso no autorizado' } )
    }
    next()
  }
}
