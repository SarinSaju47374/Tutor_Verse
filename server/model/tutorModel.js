import mongoose from "mongoose";

const tutorSchema = new mongoose.Schema({
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
    dob: { 
        type: Date, 
        required: true 
    },
    mob: { 
        type: String, 
        required: true 
    },
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'], 
        required: true 
    },
    college: { 
        type: String, 
        required: true 
    },
    expYear: { 
        type: Number, 
        required: true 
    },
    addr: { 
        type: String, 
        required: true 
    },
    pinCode: { 
        type: Number, 
        required: true 
    },
    psswd: { 
        type: String, 
        required: true 
    },
    termsAccepted:{
        type:Boolean
    },
    profileCompleted: {
        type: Boolean,
        default: false // Default to pending
    },
    verified:{
        type:Boolean,   //This is verified by the admin side after checking out the documents he submitted
        default:false,
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    profilePhoto:{
        title:String,
        filepath:String,
    },
    documents: {
        type: [{ title: String, filepath: String }],
    },
})

export const tutorModel = mongoose.model("tutor",tutorSchema);