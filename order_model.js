const { model, Schema } = require('mongoose')

const order_schema = new Schema({

    order_items: {
        type: Array,
        required: true,
    },
    total_price: {
        type: Number,
        required: true
    },
    payment_method: {
        type: String,
        required: true
    },
    shipping_info: {
        type: Object,
        required: true
    }
}, { timestamps: true })

module.exports = model('orders', order_schema)