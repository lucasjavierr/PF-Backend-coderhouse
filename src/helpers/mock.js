import { faker } from '@faker-js/faker'

const { database, commerce, number, image, string, datatype } = faker

export const generateProduct = () => {
  return {
    _id: database.mongodbObjectId(),
    title: commerce.product(),
    description: commerce.productDescription(),
    price: parseFloat( commerce.price() ),
    category: commerce.department(),
    code: string.alphanumeric( 10 ),
    stock: number.int( { min: 20, max: 30 } ),
    image: image.url(),
    status: datatype.boolean()
  }
}
