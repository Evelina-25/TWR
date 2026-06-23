import mongoose from "mongoose";

const CartSchema = new mongoose.Schema({
    cartNumber: {
        type: String,
        unique: true,
        required: true,
        index: true
    },

    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },

    status: {
        type: String,
        enum: ["unpaid", "paid"],
        default: "unpaid"
    },

    products: [
        {
            product: {
                type: mongoose.Schema.Types.ObjectId,
                ref: "Product"
            },
            quantity: {
                type: Number,
                default: 1
            }
        }
    ]
}, {
    timestamps: true
});

export default mongoose.model("Cart", CartSchema);