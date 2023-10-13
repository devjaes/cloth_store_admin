import { model, Schema } from 'mongoose'

export const CategorySchema = new Schema(
  {
    title: { type: 'String', required: true }
  },
  { timestamps: true }
)

export const Category = model('Category', CategorySchema)
