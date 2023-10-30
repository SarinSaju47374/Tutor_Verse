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
      
    },
    mob: { 
        type: String, 
     
    },
    gender: { 
        type: String, 
        enum: ['Male', 'Female', 'Other'], 
   
    },
    college: { 
        type: String, 
    
    },
    expYear: { 
        type: Number, 
   
    },
    addr: { 
        type: String, 
   
    },
    pinCode: { 
        type: Number, 
   
    },
    psswd: { 
        type: String, 
        required: true,
            
    },
    termsAccepted:{
        type:Boolean
    },
    profileCompleted: {
        type: Boolean,
        default: false // Default to pending
    },
    isBlocked:{
        type:Boolean,
        default:false
    },
    profilePhoto:{
        type:String
    },
    schedule:[
        {
            courseId:{
                type:mongoose.Schema.Types.ObjectId,
                ref:'course'
            },
            slots:[
                {
                    value:String,
                    label:String
                }
            ],
            
        }
    ],
    documents: {
        type:[String]
    },
})

export const tutorModel = mongoose.model("tutor",tutorSchema);