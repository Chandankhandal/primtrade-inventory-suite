const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please add product name'],
        trim: true
    },

    description: {
        type: String,
        required: [true, "Please add some product Description"],
        trim: true
    },

    price: {
        type: Number,
        required: [true, "Please add the price of product"],
        min: 0
    },

    category: {
        type: String,
        required: [true, "Please add the category of the product"],
        trim: true
    },

    stock: {
        type: Number,
        required: [true, 'Please add the stock of the product'],
        min: 0,
        default: 0
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    }
},

    {
        timestamps: true,
    }
)


module.exports = mongoose.model("Product", productSchema);