export const createProductError = ( prod ) => {
  return `Una o mas propiedades del producto estan incompletas o son inválidas.
  Listado de campos obligatorios:
  * title:        Este campo debe ser de tipo string, y se recibió ${ prod.title },
  * description:  Este campo debe ser de tipo string, y se recibió ${ prod.description },
  * price:        Este campo debe ser de tipo numérico, y se recibió ${ prod.price },
  * category:     Este campo únicamente puede tener los valores de 'processor', "graphic-card', 'ram-memory', 'storage', pero se recibió ${ prod.category }
  * code:         Este campo debe ser de tipo string, y se recibió ${ prod.code },
  * stock:        Este campo debe ser de tipo numérico, pero se recibió ${ prod.stock },
  * status:       Este campo debe ser de tipo boleano, pero se recibió ${ prod.status }
  `
}
