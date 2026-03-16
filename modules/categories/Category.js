import mongoose from "mongoose";

const CategorySchema = new mongoose.Schema({
    name: { 
        type: String, 
        required: true, 
        unique: true 
    },

    description: {
        type: String,
        required: true
    },

    parentCategory: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Category",
        default: null
    }
});

export default mongoose.model("Category", CategorySchema);