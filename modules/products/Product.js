import mongoose from "mongoose";

const Product = new mongoose.Schema(
{
  name: {
    type: String,
    required: true,
    unique: true
  },

  description: {
    type: String,
    required: true
  },

  price: {
    type: Number,
    required: true
  },

  quantity: {
    type: Number,
    required: true
  },

  picture: {
    type: String
  },

  category: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Category",
    required: true
  },

  characteristic: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Characteristic",
    required: true
  }

},
{ collection: "products" }
);

export default mongoose.model("Product", Product);