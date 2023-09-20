import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
    fName: { 
        type: String, 
        required: true 
    },
    lName: { 
        type: String, 
        required: true 
    },
    gName: { 
        type: String, 
        required: true 
    },
    relation: { 
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
    school: { 
        type: String, 
        required: true 
    },
    board: { 
        type: String, 
        required: true 
    },
    grade:{
        type:Number,
    },
    addr: { 
        type: String, 
        required: true 
    },
    pinCode: { 
        type: Number, 
        required: true 
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    psswd: { 
        type: String, 
        required: true 
    },
    profilePhoto: { type: String, default: '' }
})

export const studentModel = mongoose.model("student",studentSchema);