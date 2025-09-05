const mongoose = require("mongoose");

const productFormSchema = new mongoose.Schema({
    name: { type: String, required: true, unique: true }
});

module.exports = mongoose.model("ProductForm", productFormSchema);