import mongoose from 'mongoose'
import mongoosePaginate from 'mongoose-paginate-v2'

const productsCollection = 'products'

const productSchema = new mongoose.Schema( {
  title: { type: String, required: true, index: true },
  description: { type: String, required: true },
  price: { type: Number, required: true },
  category: {
    type: String,
    required: true,
    index: true,
    enum: [ 'notebook', 'processor', 'graphic-card', 'storage', 'ram-memory', 'motherboard', 'power-supply', 'cooling', 'case' ]
  },
  code: { type: String, required: true, unique: true },
  stock: { type: Number, required: true },
  thumbnail: String,
  status: { type: Boolean, default: true, required: true },
  owner: { type: mongoose.Schema.Types.ObjectId, ref: 'users', required: true }
} )
productSchema.plugin( mongoosePaginate )

export const productsModel = mongoose.model( productsCollection, productSchema )
