import mongoose from "mongoose";

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },

    lastname: {
        type: String,
        required: true
    },

    midlename: {
        type: String,
        required: true
    },

    email: { 
        type: String, 
        required: true, 
        unique: true 
    },

    password: { 
        type: String, 
        required: true,
    },

    role: {
        type: String,
        default: "USER"
    }
});

export default mongoose.model("User", UserSchema);