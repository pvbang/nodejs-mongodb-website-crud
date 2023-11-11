const mongoose = require('mongoose')

const productSchema = mongoose.Schema(
    {
        name: {
            type: String,
            required: false
        },
        quantity: {
            type: Number,
            required: false,
            default: 0
        },
        price: {
            type: Number,
            required: false,
        },
    },
    {
        timestamps: true
    }
)


const Product = mongoose.model('Product', productSchema);

module.exports = Product;