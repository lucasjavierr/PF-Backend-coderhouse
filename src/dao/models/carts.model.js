import mongoose from 'mongoose'

const cartsCollection = 'carts'

const cartSchema = new mongoose.Schema( {
  products: {
    type: [
      {
        quantity: { type: Number, required: true },
        productId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'products',
          required: true
        },
        _id: false
      }
    ],
    default: []
  }
} )

export const cartsModel = mongoose.model( cartsCollection, cartSchema )
