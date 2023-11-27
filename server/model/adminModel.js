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
    profilePhoto: { type: String, default: 'https://res.cloudinary.com/dn5btexrs/image/upload/v1695185754/cld-sample.jpg'}
})

export const adminModel = mongoose.model("admin",adminSchema);