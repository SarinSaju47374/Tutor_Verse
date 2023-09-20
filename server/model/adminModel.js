import mongoose from "mongoose";

const adminSchema = new mongoose.Schema({
    fName: { 
        type: String, 
        required: true 
    },
    lName: { 
        type: String, 
        required: true 
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    psswd: { 
        type: String, 
        required: true 
    },
    profilePhoto: { type: String, default: ''}
})

export const adminModel = mongoose.model("admin",adminSchema);