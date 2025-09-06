const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    product_name: { type: String, required: true },
    form: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductForm",
        required: true
    }], // references ProductForm documents
    specification: { 
        type: String, required: true 
    },
    package: { 
        type: String, required: true 
    },
    application_list: [{ 
        type: mongoose.Schema.Types.ObjectId,
        ref: "ProductApplication",
        required: true
    }],
    image: [{
        type: String
    }],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);