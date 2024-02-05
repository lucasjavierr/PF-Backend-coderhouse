/* eslint-disable no-useless-catch */
import fs from 'node:fs'
import { logger } from '../../../helpers/logger.js'

export class ProductsManagerFiles {
  constructor ( filePath ) {
    this.path = filePath
  }

  // variable privada para la gestion de IDs
  #newId

  // metodo para verificar si el archivo existe
  #fileExist() {
    return fs.existsSync( this.path )
  }

  async #writeFile( infoToSave ) {
    await fs.promises.writeFile(
      this.path,
      JSON.stringify( infoToSave, null, '\t' )
    )
  }

  // metodo para obtener TODOS los archivos
  async getProducts() {
    try {
      // verifico si el archivo existe
      if ( !this.#fileExist() ) {
        throw new Error( 'No se pudieron obtener los productos.' )
      }

      // recupero los productos y los convierto en json
      const productsData = await fs.promises.readFile( this.path, 'utf-8' )
      if ( !productsData ) {
        throw new Error(
          'No se pudo leer el archivo porque no existe o está vacío.'
        )
      }
      const products = JSON.parse( productsData )

      // retorno todos los productos
      return products
    } catch ( error ) {
      throw error
    }
  }

  // obtener un producto por ID
  async getProductById( idProduct ) {
    try {
      // obtengo los productos formateados
      const products = await this.getProducts()

      // busco en el array un producto que coincida con el ID ingresado por parámetros
      // si no lo encuentra, devuelve un error
      const product = products.find( ( prod ) => prod.id === idProduct )
      if ( !product ) {
        throw new Error( `El producto con el ID "${ idProduct }" no existe.` )
      }

      // retorno el producto
      return product
    } catch ( error ) {
      throw error
    }
  }

  // metodo para añadir un producto
  async createProduct( productInfo ) {
    try {
      // desestructuro y verifico si existen todos los campos del objeto ingresado
      // si alguno no existe, devuevo un error
      const {
        title,
        description,
        price,
        thumbnails = [],
        code,
        stock,
        status = true
      } = productInfo

      if ( !title || !description || !price || !thumbnails || !code || !stock ) {
        throw new Error( 'Todos los campos deben estar completos.' )
      }

      // obtengo los productos formateados
      const products = await this.getProducts()

      // verifico si ya existe un producto con el mismo code
      if ( products.some( ( prod ) => prod.code === code ) ) {
        throw new Error( `Ya existe un producto con el código "${ code }".` )
      }

      // id incrementable, si el array no tiene ningun producto, el ID es 1
      // si ya tiene productos, busca el ID del ultimo elemento y le suma 1
      if ( products.length === 0 ) {
        this.#newId = 1
      } else {
        this.#newId = products[ products.length - 1 ].id + 1
      }

      // creo el objeto con sus propiedades y lo pusheo al array de productos
      const newProduct = {
        id: this.#newId,
        title,
        description,
        price,
        thumbnails,
        code,
        stock,
        status
      }
      products.push( newProduct )

      // reemplazo el array antiiguo con el nuevo, que ya contiene el nuevo producto
      this.#writeFile( products )
      logger.info( 'Producto creado correctamente.' )
    } catch ( error ) {
      throw error
    }
  }

  // actualizar un producto a traves de un ID
  async updateProduct( idProduct, infoToUpdate ) {
    try {
      // verifico que el objeto con los nuevos valores contiene todas las propiedades
      const { title, description, price, thumbnails, code, stock } =
        infoToUpdate
      if ( !title || !description || !price || !thumbnails || !code || !stock ) {
        throw new Error(
          'No se puede modificar el producto. Debe ingresar todas las propiedades.'
        )
      }

      // verifico que la nueva informacion no actualice el id
      if ( infoToUpdate.id ) {
        throw new Error( 'No se puede actualizar el ID de un producto.' )
      }

      // obtengo los productos formateados
      const products = await this.getProducts()

      // busco la posicion del producto que coincida con el ID ingresado
      // si no existe, retorno un error
      const productIndex = products.findIndex( ( prod ) => prod.id === idProduct )
      if ( !productIndex ) {
        throw new Error(
          `No se pudo encontrar el producto con el ID "${ idProduct }".`
        )
      }

      // actualizo el producto con la nueva información
      products[ productIndex ] = {
        ...products[ productIndex ],
        ...infoToUpdate
      }

      // reescribo el array con el objeto actualizado
      this.#writeFile( products )
      logger.info( 'Producto actualizado correctamente.' )
    } catch ( error ) {
      throw error
    }
  }

  // eliminar un producto por ID
  async deleteProduct( idProduct ) {
    try {
      // obtengo los productos formateados
      const products = await this.getProducts()

      // verifico si existe un producto con el ID ingresado por parámetros
      // si no existe, retorno un error
      if ( !products.some( ( prod ) => prod.id === idProduct ) ) {
        throw new Error( `El producto con el ID "${ idProduct }" no existe.` )
      }

      // filtro el array de productos con todos los productos que NO coincidan con el ID ingresado
      const productsUpdated = products.filter( ( prod ) => prod.id !== idProduct )

      // reescribo el array original con el actualizado
      this.#writeFile( productsUpdated )
      logger.info( 'Producto eliminado correctamente.' )
    } catch ( error ) {
      throw error
    }
  }
}
