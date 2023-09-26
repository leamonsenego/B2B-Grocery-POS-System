const { Schema, model } = require('mongoose');
const mongoose = require('mongoose');
const mongoosePaginate = require('mongoose-paginate-v2');

const ProductSchema = new Schema(
  {
    productName: {
      type: String,
      required: [true, 'Product name is required'],
      lowercase: true,
      trim: true,
    },
    quantity: {
      type: String,
      required: [true, 'Quantity is required'],
      lowercase: true,
      trim: true,
    },
    productPrice: {
      type: Number, // Assuming productPrice is a numeric value
      trim: true,
      //required: [true, 'Product price is required'],
    },
    categoryName: {
      type: String,
      //required: [true, 'Category name is required'],
    },
    stock: {
      type: String, // Changed to boolean for stock status
     // default: true, // This sets the default value to true if not provided
    },
    description: {
      type: String,
      required: false, // Optional field
    },
    imageUrl: {
      type: String,
      required: false, // Optional field
    },
  },
  {
    timestamps: true,
  }
);

// Add mongoose paginate plugin
ProductSchema.plugin(mongoosePaginate);

const myModel = mongoose.model('pagination', ProductSchema);

module.exports = model('Product', ProductSchema);

