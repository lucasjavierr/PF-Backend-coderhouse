import mongoose from 'mongoose'

const usersCollection = 'users'

const userSchema = new mongoose.Schema( {
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  age: Number,
  gender: { type: String, enum: [ 'masculino', 'femenino', null ] },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  cart: { type: mongoose.Schema.Types.ObjectId, ref: 'carts' },
  role: { type: String, required: true, enum: [ 'USER', 'ADMIN', 'PREMIUM' ], default: 'USER' },
  documents: { type: [ { name: { type: String, required: true }, reference: { type: String, required: true } } ], default: [] },
  lastConnection: { type: Date, default: null },
  status: { type: String, required: true, enum: [ 'pendiente', 'incompleto', 'completo' ], default: 'pendiente' },
  avatar: { type: String, default: '' }
} )

export const usersModel = mongoose.model( usersCollection, userSchema )
