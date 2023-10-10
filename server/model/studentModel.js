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
       
    },
    relation: { 
        type: String, 
     
    },
    email: { 
        type: String, 
        required: true, 
        unique: true 
    },
    dob: { 
        type: Date, 
    
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
      
    },
    board: { 
        type: String, 
        
    },
    grade:{
        type:Number,
    },
    addr: { 
        type: String, 
     
    },
    pinCode: { 
        type: Number, 
      
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