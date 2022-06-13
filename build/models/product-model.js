"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose_1 = require("mongoose");
const productSchema = new mongoose_1.Schema({
    title: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    amount: {
        type: Number,
        required: true,
    },
    // 1:M - Produkas turi daug kategorijų
    categories: {
        type: [{ type: mongoose_1.Schema.Types.ObjectId, ref: 'Category' }],
        default: [],
    },
}, {
    timestamps: true,
});
// collection name - "products"
const ProductModel = (0, mongoose_1.model)('Product', productSchema);
exports.default = ProductModel;
